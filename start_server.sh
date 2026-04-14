#!/bin/bash
# 轻量笔记服务器启动脚本
# 确保在正确的项目目录下启动服务器

PROJECT_DIR="/Users/apple/Documents/New project 2"
PORT=8080

echo "正在启动轻量笔记服务器..."
echo "项目目录: $PROJECT_DIR"
echo "端口: $PORT"

# 杀死所有现有的 Python HTTP 服务器
pkill -9 -f "python.*http.server" 2>/dev/null

# 等待端口释放
sleep 2

# 在正确的项目目录下启动服务器
cd "$PROJECT_DIR" && python3 -m http.server $PORT --bind 0.0.0.0 &

# 等待服务器启动
sleep 1

# 检查服务器是否在运行
if lsof -i :$PORT > /dev/null 2>&1; then
    echo "✅ 服务器已成功启动！"
    echo "访问地址:"
    echo "  本地: http://localhost:$PORT"
    echo "  局域网: http://192.168.31.167:$PORT"
    
    # 验证服务器是否加载了正确的内容
    CONTENT=$(curl -s "http://localhost:$PORT/" 2>/dev/null)
    if echo "$CONTENT" | grep -q "darkModeBtn"; then
        echo "✅ 已加载最新版本（包含深色模式、新增笔记等功能）"
    else
        echo "⚠️  警告：可能仍在使用旧版本，请检查服务器工作目录"
    fi
else
    echo "❌ 服务器启动失败！"
    exit 1
fi
