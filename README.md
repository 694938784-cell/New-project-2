# 飞书接入

当前项目支持三种方式：

1. 应用方式（`app_id + app_secret`）
2. Webhook 机器人方式
3. 长连接命令机器人方式（推荐）

## 推荐：长连接命令机器人（无公网回调）

目标：你在手机飞书给机器人发 `run: pwd`，你电脑执行并回消息。

### 1. 飞书开放平台配置

1. 创建企业自建应用并开启机器人能力。
2. 给应用开通消息相关权限（至少收消息/发消息）。
3. 在“事件订阅”里开启 `im.message.receive_v1` 事件。
4. 连接方式选择长连接（WebSocket），不需要配置公网回调 URL。
5. 发布并安装应用到企业。

### 2. 本地配置

编辑 `.env`：

- `FEISHU_APP_ID`
- `FEISHU_APP_SECRET`
- `FEISHU_ALLOWED_OPEN_IDS`（强烈建议只填你自己的 open_id）
- `FEISHU_ALLOWED_COMMAND_PREFIXES`
- `FEISHU_CMD_WORKDIR`
- `FEISHU_CMD_TIMEOUT_SEC`

### 3. 启动

```bash
python3 feishu_ws_command_bot.py
```

### 4. 手机测试

给机器人发：

```text
run: pwd
```

机器人会回复执行结果。

### 5. 聊天模型分流（OpenAI + 百炼）

`feishu_ws_chat_bot.py` 支持 `chat:` 提问并按 `.env` 分流：

- `LLM_PROVIDER=openai`：全部走 OpenAI
- `LLM_PROVIDER=bailian`：全部走百炼
- `LLM_PROVIDER=split`：按 `LLM_SPLIT_BAILIAN_PERCENT` 分流到百炼，其余走 OpenAI
- `LLM_TASK_ROUTER=1`：优先按任务类型分流（命中关键词走百炼）

需要配置：

- `OPENAI_API_KEY` / `OPENAI_MODEL`
- `OPENAI_API_BASE`（可选，默认 OpenAI 官方地址）
- `BAILIAN_API_KEY` / `BAILIAN_MODEL`
- `BAILIAN_API_BASE`（可选，默认百炼官方兼容地址）

示例：

```dotenv
LLM_PROVIDER=split
LLM_TASK_ROUTER=1
HEAVY_CHEAP_TASK_KEYWORDS=批量抓取,初步清洗,长文本切分,去重
LLM_SPLIT_BAILIAN_PERCENT=70
LLM_REPLY_PROVIDER_TAG=1
```

这样约 70% 请求走百炼，30% 走 OpenAI（按请求内容哈希稳定分流）。
若命中 `HEAVY_CHEAP_TASK_KEYWORDS`，会优先走百炼（即 heavy-cheap-worker）。
你也可以手动指定前缀：

- `heavy:` 或 `heavy-cheap-worker:` -> 百炼
- `quality:` 或 `quality-pass:` -> OpenAI

## 其他模式

- 应用方式发送消息：`python3 feishu_app_notify.py "你好，飞书应用"`
- Webhook 机器人发送：`python3 feishu_notify.py "你好，飞书"`
