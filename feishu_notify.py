import base64
import hashlib
import hmac
import json
import os
import sys
import time
import urllib.request
from pathlib import Path


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


def build_sign(timestamp: str, secret: str) -> str:
    string_to_sign = f"{timestamp}\n{secret}".encode("utf-8")
    hmac_code = hmac.new(string_to_sign, digestmod=hashlib.sha256).digest()
    return base64.b64encode(hmac_code).decode("utf-8")


def send_feishu_text(text: str) -> dict:
    load_dotenv(BASE_DIR / ".env")

    webhook_url = os.getenv("FEISHU_WEBHOOK_URL", "").strip()
    secret = os.getenv("FEISHU_SECRET", "").strip()

    if not webhook_url:
        raise ValueError("缺少 FEISHU_WEBHOOK_URL，请在 .env 或环境变量中配置")

    payload = {
        "msg_type": "text",
        "content": {"text": text},
    }

    if secret:
        timestamp = str(int(time.time()))
        payload["timestamp"] = timestamp
        payload["sign"] = build_sign(timestamp, secret)

    data = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        webhook_url,
        data=data,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )

    with urllib.request.urlopen(request, timeout=10) as response:
        body = response.read().decode("utf-8")

    result = json.loads(body)
    if result.get("StatusCode", 0) != 0:
        raise RuntimeError(f"飞书返回错误: {result}")
    return result


def main() -> None:
    text = " ".join(sys.argv[1:]).strip() or "Hello from Codex"
    result = send_feishu_text(text)
    print("发送成功:", result)


if __name__ == "__main__":
    main()
