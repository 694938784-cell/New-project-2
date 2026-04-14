import json
import os
import shlex
import subprocess
import hashlib
from pathlib import Path
from typing import List
import urllib.request
import urllib.error

import lark_oapi as lark

from feishu_app_notify import get_tenant_access_token, send_text_message

BASE_DIR = Path(__file__).resolve().parent
DEFAULT_OPENAI_API_BASE = "https://api.openai.com/v1/chat/completions"
DEFAULT_BAILIAN_API_BASE = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"


def load_dotenv(path: Path) -> None:
    if not path.exists():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()
        if key and key not in os.environ:
            os.environ[key] = value


def split_csv(value: str) -> List[str]:
    return [x.strip() for x in value.split(",") if x.strip()]


def set_env_value(path: Path, key: str, value: str) -> None:
    if not key:
        return
    lines: List[str] = []
    if path.exists():
        lines = path.read_text(encoding="utf-8").splitlines()

    target = "{}={}".format(key, value)
    replaced = False
    for idx, line in enumerate(lines):
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        current_key = stripped.split("=", 1)[0].strip()
        if current_key == key:
            lines[idx] = target
            replaced = True
            break

    if not replaced:
        if lines and lines[-1].strip():
            lines.append("")
        lines.append(target)

    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def parse_text_from_content(raw_content: str) -> str:
    if not raw_content:
        return ""
    try:
        data = json.loads(raw_content)
        return (data.get("text") or "").strip()
    except Exception:
        return raw_content.strip()


def truncate_text(text: str, max_chars: int = 1500) -> str:
    if len(text) <= max_chars:
        return text
    return text[:max_chars] + "\n...\n(输出过长，已截断)"


def run_command(command: str, workdir: str, timeout_sec: int) -> str:
    args = shlex.split(command)
    if not args:
        return "空命令，已忽略。"

    result = subprocess.run(
        args,
        cwd=workdir,
        capture_output=True,
        text=True,
        timeout=timeout_sec,
        shell=False,
    )

    output_parts = []
    if result.stdout:
        output_parts.append("[stdout]\n" + result.stdout.strip())
    if result.stderr:
        output_parts.append("[stderr]\n" + result.stderr.strip())
    output_parts.append("[exit_code] {}".format(result.returncode))
    return "\n\n".join(part for part in output_parts if part)


def _hash_percent(text: str) -> int:
    digest = hashlib.sha256(text.encode("utf-8")).hexdigest()
    return int(digest[:8], 16) % 100


def choose_provider_by_task(user_text: str) -> str:
    task_router = os.getenv("LLM_TASK_ROUTER", "1").strip() == "1"
    if not task_router:
        return ""

    lowered = user_text.lower()
    if lowered.startswith("quality:") or lowered.startswith("quality-pass:"):
        return "openai"
    if lowered.startswith("heavy:") or lowered.startswith("heavy-cheap-worker:"):
        return "bailian"

    heavy_keywords = split_csv(
        os.getenv(
            "HEAVY_CHEAP_TASK_KEYWORDS",
            "批量抓取,初步清洗,长文本切分,去重,摘要,分类,提取,改写,翻译",
        )
    )
    if any(keyword and keyword in user_text for keyword in heavy_keywords):
        return "bailian"

    return ""


def choose_provider(user_text: str) -> str:
    task_provider = choose_provider_by_task(user_text)
    if task_provider:
        return task_provider

    provider = os.getenv("LLM_PROVIDER", "openai").strip().lower()
    if provider in ("openai", "bailian"):
        return provider
    if provider == "split":
        try:
            percent = int(os.getenv("LLM_SPLIT_BAILIAN_PERCENT", "50"))
        except ValueError:
            percent = 50
        percent = max(0, min(100, percent))
        return "bailian" if _hash_percent(user_text) < percent else "openai"
    return "openai"


def call_chat_completions(api_base: str, api_key: str, model: str, user_text: str, vendor_name: str) -> str:
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": user_text}],
    }

    req = urllib.request.Request(
        api_base,
        data=json.dumps(payload).encode("utf-8"),
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer {}".format(api_key),
        },
    )

    try:
        with urllib.request.urlopen(req, timeout=40) as resp:
            body = resp.read().decode("utf-8")
    except Exception as exc:
        return "调用 {} 失败: {}".format(vendor_name, exc)

    try:
        data = json.loads(body)
    except Exception:
        return "{} 返回解析失败: {}".format(vendor_name, body[:300])

    try:
        choices = data.get("choices", [])
        if choices:
            message = choices[0].get("message", {})
            text = (message.get("content") or "").strip()
            if text:
                return text
    except Exception:
        pass

    return "模型返回为空。"


def call_chat_completions_stream(
    api_base: str,
    api_key: str,
    model: str,
    user_text: str,
    vendor_name: str,
    on_delta,
) -> str:
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": user_text}],
        "stream": True,
    }

    req = urllib.request.Request(
        api_base,
        data=json.dumps(payload).encode("utf-8"),
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer {}".format(api_key),
        },
    )

    full_text = ""
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            while True:
                raw_line = resp.readline()
                if not raw_line:
                    break
                line = raw_line.decode("utf-8", errors="ignore").strip()
                if not line or not line.startswith("data:"):
                    continue
                data_line = line[5:].strip()
                if data_line == "[DONE]":
                    break
                try:
                    event = json.loads(data_line)
                except Exception:
                    continue
                choices = event.get("choices", [])
                if not choices:
                    continue
                delta = choices[0].get("delta", {})
                content = delta.get("content", "")
                chunk = ""
                if isinstance(content, str):
                    chunk = content
                elif isinstance(content, list):
                    for item in content:
                        if isinstance(item, dict) and isinstance(item.get("text"), str):
                            chunk += item.get("text")
                if chunk:
                    full_text += chunk
                    on_delta(chunk)
    except Exception as exc:
        return "调用 {} 失败: {}".format(vendor_name, exc)

    return full_text.strip() or "模型返回为空。"


def ask_llm(user_text: str, forced_provider: str = "", on_delta=None) -> str:
    provider = (forced_provider or "").strip().lower() or choose_provider(user_text)
    reply_provider_tag = os.getenv("LLM_REPLY_PROVIDER_TAG", "1").strip() == "1"
    use_stream = on_delta is not None

    if provider == "bailian":
        api_key = os.getenv("BAILIAN_API_KEY", "").strip()
        model = os.getenv("BAILIAN_MODEL", "qwen-plus").strip() or "qwen-plus"
        api_base = os.getenv("BAILIAN_API_BASE", DEFAULT_BAILIAN_API_BASE).strip() or DEFAULT_BAILIAN_API_BASE
        if not api_key:
            return "未配置 BAILIAN_API_KEY。请在 .env 中设置后重启机器人。"
        if use_stream:
            answer = call_chat_completions_stream(api_base, api_key, model, user_text, "百炼", on_delta)
        else:
            answer = call_chat_completions(api_base, api_key, model, user_text, "百炼")
        return "[via bailian] {}".format(answer) if reply_provider_tag else answer

    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    model = os.getenv("OPENAI_MODEL", "gpt-5.4-mini").strip() or "gpt-5.4-mini"
    api_base = os.getenv("OPENAI_API_BASE", DEFAULT_OPENAI_API_BASE).strip() or DEFAULT_OPENAI_API_BASE
    if not api_key:
        return "未配置 OPENAI_API_KEY。请在 .env 中设置后重启机器人。"
    if use_stream:
        answer = call_chat_completions_stream(api_base, api_key, model, user_text, "OpenAI", on_delta)
    else:
        answer = call_chat_completions(api_base, api_key, model, user_text, "OpenAI")
    return "[via openai] {}".format(answer) if reply_provider_tag else answer


def send_chat_text(chat_id: str, text: str) -> None:
    app_id = os.getenv("FEISHU_APP_ID", "").strip()
    app_secret = os.getenv("FEISHU_APP_SECRET", "").strip()
    token = get_tenant_access_token(app_id, app_secret)
    send_text_message(token, "chat_id", chat_id, truncate_text(text))


def handle_message(data: lark.im.v1.P2ImMessageReceiveV1) -> None:
    event = data.event
    if event is None or event.message is None:
        return

    message = event.message
    sender = event.sender

    if sender and sender.sender_type and sender.sender_type != "user":
        return

    sender_open_id = ""
    if sender and sender.sender_id and sender.sender_id.open_id:
        sender_open_id = sender.sender_id.open_id.strip()

    allowed_open_ids = split_csv(os.getenv("FEISHU_ALLOWED_OPEN_IDS", ""))
    if allowed_open_ids and sender_open_id not in allowed_open_ids:
        return

    if message.message_type != "text":
        return

    text = parse_text_from_content(message.content or "")
    chat_id = (message.chat_id or "").strip()
    if not chat_id:
        return

    lower = text.lower()
    if lower == "help" or lower == "run: help":
        send_chat_text(
            chat_id,
            "可用:\nchat: 你的问题\nrun: 命令\n示例:\nchat: 解释一下git rebase\nrun: git status",
        )
        return

    if lower.startswith("chat:"):
        prompt = text[5:].strip()
        if not prompt:
            send_chat_text(chat_id, "请在 chat: 后面输入问题。")
            return

        prompt_lower = prompt.lower()
        if prompt_lower.startswith("set-bailian-model:"):
            model = prompt[len("set-bailian-model:"):].strip()
            if not model:
                send_chat_text(chat_id, "请提供模型名，例如：chat: set-bailian-model:qwen-plus")
                return
            set_env_value(BASE_DIR / ".env", "BAILIAN_MODEL", model)
            os.environ["BAILIAN_MODEL"] = model
            send_chat_text(chat_id, "已切换百炼模型为: {}".format(model))
            return

        forced_provider = ""
        normalized_prompt = prompt
        if prompt_lower.startswith("quality:"):
            forced_provider = "openai"
            normalized_prompt = prompt[len("quality:"):].strip()
        elif prompt_lower.startswith("quality-pass:"):
            forced_provider = "openai"
            normalized_prompt = prompt[len("quality-pass:"):].strip()

        if not normalized_prompt:
            send_chat_text(chat_id, "问题内容为空，请在前缀后输入具体内容。")
            return

        stream_enabled = os.getenv("FEISHU_STREAMING_ENABLED", "0").strip() == "1"
        if not stream_enabled:
            answer = ask_llm(normalized_prompt, forced_provider=forced_provider)
            send_chat_text(chat_id, answer)
            return

        stream_chunk_chars = int(os.getenv("FEISHU_STREAM_CHUNK_CHARS", "180"))
        stream_buffer = ""
        stream_sent = False

        send_chat_text(chat_id, "⏳ 正在流式生成中...")

        def on_delta(delta: str) -> None:
            nonlocal stream_buffer, stream_sent
            stream_buffer += delta
            while len(stream_buffer) >= stream_chunk_chars:
                chunk = stream_buffer[:stream_chunk_chars]
                stream_buffer = stream_buffer[stream_chunk_chars:]
                send_chat_text(chat_id, chunk)
                stream_sent = True

        answer = ask_llm(normalized_prompt, forced_provider=forced_provider, on_delta=on_delta)
        if stream_buffer:
            send_chat_text(chat_id, stream_buffer)
            stream_sent = True
        if not stream_sent:
            send_chat_text(chat_id, answer)
        return

    if lower.startswith("run:"):
        command = text[4:].strip()
        if not command:
            send_chat_text(chat_id, "请在 run: 后面输入命令。")
            return

        allowed_prefixes = split_csv(
            os.getenv(
                "FEISHU_ALLOWED_COMMAND_PREFIXES",
                "pwd,ls,cd,cat,echo,git,python,python3,pip,pip3,node,npm,pnpm,yarn",
            )
        )

        if allowed_prefixes and not any(command.startswith(prefix) for prefix in allowed_prefixes):
            send_chat_text(
                chat_id,
                "命令被拒绝：不在白名单前缀内。\n允许前缀: {}".format(", ".join(allowed_prefixes)
                ),
            )
            return

        timeout_sec = int(os.getenv("FEISHU_CMD_TIMEOUT_SEC", "20"))
        workdir = os.getenv("FEISHU_CMD_WORKDIR", str(BASE_DIR)).strip() or str(BASE_DIR)

        try:
            result = run_command(command, workdir, timeout_sec)
            response_text = "命令: {}\n\n{}".format(command, result)
        except subprocess.TimeoutExpired:
            response_text = "命令超时（{}s）: {}".format(timeout_sec, command)
        except Exception as exc:
            response_text = "执行失败: {}".format(exc)

        send_chat_text(chat_id, response_text)
        return


def main() -> None:
    load_dotenv(BASE_DIR / ".env")

    app_id = os.getenv("FEISHU_APP_ID", "").strip()
    app_secret = os.getenv("FEISHU_APP_SECRET", "").strip()

    if not app_id or not app_secret:
        raise ValueError("缺少 FEISHU_APP_ID 或 FEISHU_APP_SECRET，请在 .env 中配置")

    event_handler = (
        lark.EventDispatcherHandler.builder("", "")
        .register_p2_im_message_receive_v1(handle_message)
        .build()
    )

    ws_client = lark.ws.Client(
        app_id,
        app_secret,
        event_handler=event_handler,
        log_level=lark.LogLevel.INFO,
    )

    print("Feishu WS chat bot started. 用法: chat: 你好 或 run: pwd")
    ws_client.start()


if __name__ == "__main__":
    main()
