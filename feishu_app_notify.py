import json
import os
import sys
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Optional


BASE_DIR = Path(__file__).resolve().parent


FEISHU_API_BASE = "https://open.feishu.cn/open-apis"


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


def post_json(url: str, payload: dict, headers: Optional[dict] = None) -> dict:
    req_headers = {"Content-Type": "application/json; charset=utf-8"}
    if headers:
        req_headers.update(headers)

    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers=req_headers,
        method="POST",
    )

    with urllib.request.urlopen(request, timeout=15) as response:
        body = response.read().decode("utf-8")

    result = json.loads(body)
    # 飞书开放平台常用返回格式：{"code":0, ...}
    if result.get("code", 0) != 0:
        raise RuntimeError("飞书 API 返回错误: {}".format(result))
    return result


def get_tenant_access_token(app_id: str, app_secret: str) -> str:
    url = "{}/auth/v3/tenant_access_token/internal".format(FEISHU_API_BASE)
    payload = {"app_id": app_id, "app_secret": app_secret}
    result = post_json(url, payload)

    token = result.get("tenant_access_token", "")
    if not token:
        raise RuntimeError("未获取到 tenant_access_token: {}".format(result))
    return token


def send_text_message(token: str, receive_id_type: str, receive_id: str, text: str) -> dict:
    query = urllib.parse.urlencode({"receive_id_type": receive_id_type})
    url = "{}/im/v1/messages?{}".format(FEISHU_API_BASE, query)

    payload = {
        "receive_id": receive_id,
        "msg_type": "text",
        "content": json.dumps({"text": text}, ensure_ascii=False),
    }

    headers = {"Authorization": "Bearer {}".format(token)}
    return post_json(url, payload, headers=headers)


def send_by_app(text: str) -> dict:
    load_dotenv(BASE_DIR / ".env")

    app_id = os.getenv("FEISHU_APP_ID", "").strip()
    app_secret = os.getenv("FEISHU_APP_SECRET", "").strip()
    receive_id_type = os.getenv("FEISHU_RECEIVE_ID_TYPE", "chat_id").strip() or "chat_id"
    receive_id = os.getenv("FEISHU_RECEIVE_ID", "").strip()

    if not app_id or not app_secret:
        raise ValueError("缺少 FEISHU_APP_ID 或 FEISHU_APP_SECRET，请在 .env 中配置")
    if not receive_id:
        raise ValueError("缺少 FEISHU_RECEIVE_ID，请在 .env 中配置")

    token = get_tenant_access_token(app_id, app_secret)
    return send_text_message(token, receive_id_type, receive_id, text)


def main() -> None:
    text = " ".join(sys.argv[1:]).strip() or "Hello from Feishu App"
    result = send_by_app(text)
    print("发送成功:", result)


if __name__ == "__main__":
    main()
