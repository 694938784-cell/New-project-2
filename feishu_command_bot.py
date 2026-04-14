import json
import os
import shlex
import subprocess
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from typing import Dict, List, Optional

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


class FeishuCommandHandler(BaseHTTPRequestHandler):
    def _json_response(self, code: int, payload: Dict) -> None:
        raw = json.dumps(payload).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def _send_text_to_chat(self, text: str, chat_id: str) -> None:
        app_id = os.getenv("FEISHU_APP_ID", "").strip()
        app_secret = os.getenv("FEISHU_APP_SECRET", "").strip()
        if not app_id or not app_secret:
            return

        token = get_tenant_access_token(app_id, app_secret)
        send_text_message(token, "chat_id", chat_id, truncate_text(text))

    def do_POST(self):
        if self.path != "/callback":
            self._json_response(404, {"error": "not found"})
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(content_length)

        try:
            payload = json.loads(raw_body.decode("utf-8") or "{}")
        except Exception:
            self._json_response(400, {"error": "invalid json"})
            return

        # 飞书 URL 校验
        if "challenge" in payload:
            self._json_response(200, {"challenge": payload.get("challenge")})
            return

        verify_token = os.getenv("FEISHU_EVENT_VERIFICATION_TOKEN", "").strip()
        if verify_token:
            token_in_payload = payload.get("token", "")
            if token_in_payload and token_in_payload != verify_token:
                self._json_response(403, {"error": "token mismatch"})
                return

        header = payload.get("header", {})
        event_type = header.get("event_type", "")
        event = payload.get("event", {})

        if event_type != "im.message.receive_v1":
            self._json_response(200, {"ok": True})
            return

        sender_open_id = (
            event.get("sender", {})
            .get("sender_id", {})
            .get("open_id", "")
            .strip()
        )
        allowed_open_ids = split_csv(os.getenv("FEISHU_ALLOWED_OPEN_IDS", ""))
        if allowed_open_ids and sender_open_id not in allowed_open_ids:
            self._json_response(200, {"ok": True})
            return

        message = event.get("message", {})
        if message.get("message_type") != "text":
            self._json_response(200, {"ok": True})
            return

        text = parse_text_from_content(message.get("content", ""))
        text_lower = text.lower()
        if not text_lower.startswith("run:"):
            self._json_response(200, {"ok": True})
            return

        command = text[4:].strip()
        if not command:
            self._json_response(200, {"ok": True})
            return

        allowed_prefixes = split_csv(
            os.getenv(
                "FEISHU_ALLOWED_COMMAND_PREFIXES",
                "pwd,ls,git status,python3",
            )
        )
        if allowed_prefixes and not any(command.startswith(prefix) for prefix in allowed_prefixes):
            chat_id = message.get("chat_id", "")
            if chat_id:
                self._send_text_to_chat(
                    "命令被拒绝：不在白名单前缀内。\n允许前缀: {}".format(", ".join(allowed_prefixes)),
                    chat_id,
                )
            self._json_response(200, {"ok": True})
            return

        timeout_sec = int(os.getenv("FEISHU_CMD_TIMEOUT_SEC", "15"))
        workdir = os.getenv("FEISHU_CMD_WORKDIR", str(BASE_DIR)).strip() or str(BASE_DIR)
        chat_id = message.get("chat_id", "")

        def worker() -> None:
            try:
                result = run_command(command, workdir, timeout_sec)
                response_text = "命令: {}\n\n{}".format(command, result)
            except subprocess.TimeoutExpired:
                response_text = "命令超时（{}s）: {}".format(timeout_sec, command)
            except Exception as exc:
                response_text = "执行失败: {}".format(exc)

            if chat_id:
                try:
                    self._send_text_to_chat(response_text, chat_id)
                except Exception:
                    pass

        threading.Thread(target=worker, daemon=True).start()
        self._json_response(200, {"ok": True})


if __name__ == "__main__":
    load_dotenv(BASE_DIR / ".env")

    host = os.getenv("FEISHU_BOT_HOST", "0.0.0.0").strip() or "0.0.0.0"
    port = int(os.getenv("FEISHU_BOT_PORT", "9000"))

    server = HTTPServer((host, port), FeishuCommandHandler)
    print("Feishu command bot listening on http://{}:{}/callback".format(host, port))
    server.serve_forever()
