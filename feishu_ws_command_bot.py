import json
import os
import shlex
import subprocess
from pathlib import Path
from typing import List

import lark_oapi as lark

from feishu_app_notify import get_tenant_access_token, send_text_message


BASE_DIR = Path(__file__).resolve().parent


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

    # 避免机器人自己的消息触发回环
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
    if not text.lower().startswith("run:"):
        return

    command = text[4:].strip()
    if not command:
        return

    allowed_prefixes = split_csv(
        os.getenv(
            "FEISHU_ALLOWED_COMMAND_PREFIXES",
            "pwd,ls,git status,python3",
        )
    )

    chat_id = (message.chat_id or "").strip()
    if not chat_id:
        return

    if allowed_prefixes and not any(command.startswith(prefix) for prefix in allowed_prefixes):
        send_chat_text(
            chat_id,
            "命令被拒绝：不在白名单前缀内。\n允许前缀: {}".format(", ".join(allowed_prefixes)),
        )
        return

    timeout_sec = int(os.getenv("FEISHU_CMD_TIMEOUT_SEC", "15"))
    workdir = os.getenv("FEISHU_CMD_WORKDIR", str(BASE_DIR)).strip() or str(BASE_DIR)

    try:
        result = run_command(command, workdir, timeout_sec)
        response_text = "命令: {}\n\n{}".format(command, result)
    except subprocess.TimeoutExpired:
        response_text = "命令超时（{}s）: {}".format(timeout_sec, command)
    except Exception as exc:
        response_text = "执行失败: {}".format(exc)

    send_chat_text(chat_id, response_text)


def main() -> None:
    load_dotenv(BASE_DIR / ".env")

    app_id = os.getenv("FEISHU_APP_ID", "").strip()
    app_secret = os.getenv("FEISHU_APP_SECRET", "").strip()

    if not app_id or not app_secret:
        raise ValueError("缺少 FEISHU_APP_ID 或 FEISHU_APP_SECRET，请在 .env 中配置")

    event_handler = lark.EventDispatcherHandler.builder("", "").register_p2_im_message_receive_v1(handle_message).build()

    ws_client = lark.ws.Client(
        app_id,
        app_secret,
        event_handler=event_handler,
        log_level=lark.LogLevel.INFO,
    )

    print("Feishu WS command bot started. 现在可以在飞书里发送: run: pwd")
    ws_client.start()


if __name__ == "__main__":
    main()
