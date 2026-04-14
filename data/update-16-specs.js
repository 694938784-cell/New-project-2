// 为 iPhone 16 系列添加完整的 official_data.sections
const fs = require('fs');
const path = require('path');

const specsPath = path.join(__dirname, 'specs.json');
const specs = JSON.parse(fs.readFileSync(specsPath, 'utf8'));

// iPhone 16 完整规格
const iphone16Sections = [
  {
    "title": "🎨 外观",
    "items": [
      "黑色、白色、青雾蓝色、鼠尾草绿色、薰衣草紫色",
      "铝金属设计",
      "超瓷晶面板 (正面)",
      "融色玻璃背板"
    ]
  },
  {
    "title": "💾 容量",
    "items": [
      "128GB",
      "256GB",
      "512GB"
    ]
  },
  {
    "title": "📐 尺寸与重量",
    "items": [
      "高度：147.6 毫米 (5.81 英寸)",
      "宽度：71.6 毫米 (2.82 英寸)",
      "厚度：7.80 毫米 (0.31 英寸)",
      "重量：170 克 (6.00 盎司)"
    ]
  },
  {
    "title": "📱 显示屏",
    "items": [
      "超视网膜 XDR 显示屏",
      "6.1英寸 (对角线) OLED 全面屏",
      "2556 x 1179像素分辨率，460 ppi",
      "灵动岛功能",
      "HDR显示",
      "原彩显示",
      "广色域 (P3)",
      "触感触控",
      "对比度：2,000,000:1 (典型)",
      "最高亮度：1000 尼特 (典型)",
      "峰值亮度 (HDR)：1600 尼特",
      "峰值亮度 (户外)：2000 尼特",
      "60Hz 刷新率"
    ]
  },
  {
    "title": "💧 防溅抗水防尘",
    "items": [
      "在最深 6 米的水下停留时间最长可达 30 分钟",
      "防溅、抗水、防尘 (IP68)"
    ]
  },
  {
    "title": "⚡ 芯片",
    "items": [
      "A18 芯片",
      "6核中央处理器 (2 性能核心和 4 效率核心)",
      "5核图形处理器",
      "16核神经网络引擎"
    ]
  },
  {
    "title": "🧠 Apple 智能",
    "items": [
      "个人化情境理解",
      "写作工具",
      "图像生成与编辑",
      "Siri 增强功能",
      "通知摘要",
      "邮件智能分类"
    ]
  },
  {
    "title": "📷 摄像头",
    "items": [
      "4800 万像素融合式摄像头系统",
      "4800 万像素主摄：ƒ/1.6 光圈",
      "传感器位移式光学图像防抖",
      "100% Focus Pixels",
      "支持超高分辨率照片 (2400 万像素和 4800 万像素)",
      "1200 万像素超广角摄像头：ƒ/2.2 光圈和 120° 视角",
      "2倍光学品质变焦",
      "数码变焦最高可达 10倍",
      "蓝宝石镜片镜头盖",
      "自适应原彩闪光灯",
      "照片风格",
      "微距摄影",
      "人像模式",
      "夜间模式",
      "深度融合",
      "智能 HDR 5",
      " Photonic Engine"
    ]
  },
  {
    "title": "🎬 视频拍摄",
    "items": [
      "4K 杜比视界视频拍摄，24 fps、25 fps、30 fps 或 60 fps",
      "1080p 杜比视界视频拍摄，25 fps、30 fps、60 fps、120 fps 或 240 fps",
      "电影效果模式，最高支持 4K 杜比视界，30 fps",
      "动作模式，最高支持 2.8K，60 fps",
      "杜比视界 HDR 视频拍摄",
      "传感器位移式光学图像防抖",
      "音频混音",
      "空间音频录制",
      "立体声录制"
    ]
  },
  {
    "title": "🤳 前置摄像头",
    "items": [
      "1200 万像素 Center Stage 摄像头",
      "ƒ/1.9 光圈",
      "自动对焦",
      "Focus Pixels",
      "人像模式",
      "夜间模式",
      "深度融合",
      "智能 HDR 5",
      " Photonic Engine",
      "4K 杜比视界视频拍摄",
      "电影效果模式"
    ]
  },
  {
    "title": "🔋 电源和电池",
    "items": [
      "视频播放最长可达 22 小时",
      "流媒体视频播放最长可达 18 小时",
      "音频播放最长可达 75 小时",
      "内置锂离子充电电池",
      "MagSafe 无线充电，最高可达 25W",
      "Qi2 无线充电，最高可达 15W",
      "使用 USB-C 连接充电",
      "快充：30 分钟最多可充至 50%"
    ]
  },
  {
    "title": "🔌 USB-C",
    "items": [
      "USB 2 速度 (最高可达 480Mb/s)",
      "DisplayPort 输出",
      "支持 USB 音频配件"
    ]
  },
  {
    "title": "👤 面容 ID",
    "items": [
      "通过原深感摄像头启用人脸识别"
    ]
  },
  {
    "title": "🛡️ 安全功能",
    "items": [
      "车祸检测",
      "摔倒检测",
      "SOS 紧急联络",
      "查找我的 iPhone"
    ]
  },
  {
    "title": "📡 蜂窝网络和连接",
    "items": [
      "5G (sub-6 GHz 和 mmWave)",
      "千兆级 LTE",
      "支持 eSIM",
      "Wi-Fi 6E (802.11ax)",
      "蓝牙 5.3",
      "超宽带芯片 (第二代)",
      "NFC",
      "卫星连接 (支持紧急 SOS)"
    ]
  },
  {
    "title": "🔮 MagSafe 无线充电",
    "items": [
      "MagSafe 充电，最高可达 15W",
      "MagSafe 配件兼容",
      "Find My 支持",
      "内置磁铁阵列"
    ]
  },
  {
    "title": "📍 定位",
    "items": [
      "精确位置 (支持 GPS、GLONASS、Galileo、QZSS 和 BeiDou)",
      "指南针",
      "气压高度计",
      "通过 Wi-Fi 和蜂窝网络定位"
    ]
  },
  {
    "title": "📦 在盒内的配件",
    "items": [
      "配备 USB-C 充电线的 iPhone",
      "documentation"
    ]
  },
  {
    "title": "🌍 操作环境",
    "items": [
      "工作环境温度：0°C 至 35°C (32°F 至 95°F)",
      "非工作温度：−20°C 至 45°C (−4°F 至 113°F)",
      "相对湿度：5% 至 95%，无凝结",
      "工作高度最高测试：3000 米 (10000 英尺)"
    ]
  },
  {
    "title": "🌱 环保特性",
    "items": [
      "iPhone 16 采用再生材料制造",
      "再生铝金属外壳",
      "再生稀土元素",
      "100% 再生钴用于电池",
      "包装采用 100% 纤维材料"
    ]
  },
  {
    "title": "🌐 语言支持",
    "items": [
      "简体中文、繁体中文、英文、法文、德文、日文、韩文等",
      "支持多种语言同时使用"
    ]
  }
];

// iPhone 16 Plus 完整规格
const iphone16PlusSections = [
  ...iphone16Sections.map(s => ({...s, items: [...s.items]}))
];
// 修改尺寸和电池相关数据
iphone16PlusSections[2] = { // 尺寸与重量
  "title": "📐 尺寸与重量",
  "items": [
    "高度：160.9 毫米 (6.33 英寸)",
    "宽度：77.8 毫米 (3.06 英寸)",
    "厚度：7.80 毫米 (0.31 英寸)",
    "重量：199 克 (7.02 盎司)"
  ]
};
iphone16PlusSections[3] = { // 显示屏
  "title": "📱 显示屏",
  "items": [
    "超视网膜 XDR 显示屏",
    "6.7英寸 (对角线) OLED 全面屏",
    "2796 x 1290像素分辨率，460 ppi",
    "灵动岛功能",
    "HDR显示",
    "原彩显示",
    "广色域 (P3)",
    "触感触控",
    "对比度：2,000,000:1 (典型)",
    "最高亮度：1000 尼特 (典型)",
    "峰值亮度 (HDR)：1600 尼特",
    "峰值亮度 (户外)：2000 尼特",
    "60Hz 刷新率"
  ]
};
iphone16PlusSections[10] = { // 电池
  "title": "🔋 电源和电池",
  "items": [
    "视频播放最长可达 27 小时",
    "流媒体视频播放最长可达 21 小时",
    "音频播放最长可达 100 小时",
    "内置锂离子充电电池",
    "MagSafe 无线充电，最高可达 25W",
    "Qi2 无线充电，最高可达 15W",
    "使用 USB-C 连接充电",
    "快充：30 分钟最多可充至 50%"
  ]
};

// iPhone 16 Pro 完整规格
const iphone16ProSections = [
  {
    "title": "🎨 外观",
    "items": [
      "沙漠钛金属、原色钛金属、白色钛金属、黑色钛金属",
      "钛金属设计",
      "超瓷晶面板 (正面)",
      "融色玻璃背板"
    ]
  },
  {
    "title": "💾 容量",
    "items": [
      "128GB",
      "256GB",
      "512GB",
      "1TB"
    ]
  },
  {
    "title": "📐 尺寸与重量",
    "items": [
      "高度：149.6 毫米 (5.89 英寸)",
      "宽度：71.5 毫米 (2.81 英寸)",
      "厚度：8.25 毫米 (0.32 英寸)",
      "重量：199 克 (7.03 盎司)"
    ]
  },
  {
    "title": "📱 显示屏",
    "items": [
      "超视网膜 XDR 显示屏",
      "6.3英寸 (对角线) OLED 全面屏",
      "2622 x 1206像素分辨率，460 ppi",
      "灵动岛功能",
      "全天候显示",
      "ProMotion 自适应刷新率技术，最高可达 120Hz",
      "HDR显示",
      "原彩显示",
      "广色域 (P3)",
      "触感触控",
      "对比度：2,000,000:1 (典型)",
      "最高亮度：1000 尼特 (典型)",
      "峰值亮度 (HDR)：1600 尼特",
      "峰值亮度 (户外)：2000 尼特"
    ]
  },
  {
    "title": "💧 防溅抗水防尘",
    "items": [
      "在最深 6 米的水下停留时间最长可达 30 分钟",
      "防溅、抗水、防尘 (IP68)"
    ]
  },
  {
    "title": "⚡ 芯片",
    "items": [
      "A18 Pro 芯片",
      "6核中央处理器 (2 性能核心和 4 效率核心)",
      "6核图形处理器",
      "16核神经网络引擎"
    ]
  },
  {
    "title": "🧠 Apple 智能",
    "items": [
      "个人化情境理解",
      "写作工具",
      "图像生成与编辑",
      "Siri 增强功能",
      "通知摘要",
      "邮件智能分类",
      "视觉智能"
    ]
  },
  {
    "title": "📷 摄像头",
    "items": [
      "Pro 4800 万像素融合式摄像头系统",
      "4800 万像素主摄：ƒ/1.78 光圈",
      "第二代传感器位移式光学图像防抖",
      "100% Focus Pixels",
      "支持超高分辨率照片 (2400 万像素和 4800 万像素)",
      "4800 万像素超广角摄像头：ƒ/2.2 光圈和 120° 视角",
      "1200 万像素长焦摄像头：ƒ/2.8 光圈",
      "5 倍光学变焦范围",
      "数码变焦最高可达 25倍",
      "蓝宝石镜片镜头盖",
      "True Tone 闪光灯",
      "照片风格",
      "微距摄影",
      "人像模式",
      "夜间模式",
      "深度融合",
      "智能 HDR 5",
      " Photonic Engine",
      "ProRAW",
      "ProRes 视频录制"
    ]
  },
  {
    "title": "🎬 视频拍摄",
    "items": [
      "4K 杜比视界视频拍摄，24 fps、25 fps、30 fps 或 60 fps",
      "1080p 杜比视界视频拍摄，25 fps、30 fps、60 fps、120 fps 或 240 fps",
      "电影效果模式，最高支持 4K 杜比视界，30 fps",
      "动作模式，最高支持 2.8K，60 fps",
      "杜比视界 HDR 视频拍摄",
      "第二代传感器位移式光学图像防抖",
      "音频混音",
      "空间音频录制",
      "立体声录制",
      "ProRes 视频录制",
      "Log 编码"
    ]
  },
  {
    "title": "🤳 前置摄像头",
    "items": [
      "1200 万像素 Center Stage 摄像头",
      "ƒ/1.9 光圈",
      "自动对焦",
      "Focus Pixels",
      "人像模式",
      "夜间模式",
      "深度融合",
      "智能 HDR 5",
      " Photonic Engine",
      "4K 杜比视界视频拍摄",
      "电影效果模式"
    ]
  },
  {
    "title": "🔋 电源和电池",
    "items": [
      "视频播放最长可达 27 小时",
      "流媒体视频播放最长可达 22 小时",
      "音频播放最长可达 95 小时",
      "内置锂离子充电电池",
      "MagSafe 无线充电，最高可达 25W",
      "Qi2 无线充电，最高可达 15W",
      "使用 USB-C 连接充电",
      "快充：30 分钟最多可充至 50%"
    ]
  },
  {
    "title": "🔌 USB-C",
    "items": [
      "USB 3 速度 (最高可达 10Gb/s)",
      "DisplayPort 输出",
      "支持 USB 音频配件"
    ]
  },
  {
    "title": "👤 面容 ID",
    "items": [
      "通过原深感摄像头启用人脸识别"
    ]
  },
  {
    "title": "🛡️ 安全功能",
    "items": [
      "车祸检测",
      "摔倒检测",
      "SOS 紧急联络",
      "查找我的 iPhone"
    ]
  },
  {
    "title": "📡 蜂窝网络和连接",
    "items": [
      "5G (sub-6 GHz 和 mmWave)",
      "千兆级 LTE",
      "支持 eSIM",
      "Wi-Fi 7 (802.11be)",
      "蓝牙 5.3",
      "超宽带芯片 (第二代)",
      "NFC",
      "卫星连接 (支持紧急 SOS)"
    ]
  },
  {
    "title": "🔮 MagSafe 无线充电",
    "items": [
      "MagSafe 充电，最高可达 15W",
      "MagSafe 配件兼容",
      "Find My 支持",
      "内置磁铁阵列"
    ]
  },
  {
    "title": "📍 定位",
    "items": [
      "精确位置 (支持 GPS、GLONASS、Galileo、QZSS 和 BeiDou)",
      "指南针",
      "气压高度计",
      "通过 Wi-Fi 和蜂窝网络定位"
    ]
  },
  {
    "title": "📦 在盒内的配件",
    "items": [
      "配备 USB-C 充电线的 iPhone",
      "documentation"
    ]
  },
  {
    "title": "🌍 操作环境",
    "items": [
      "工作环境温度：0°C 至 35°C (32°F 至 95°F)",
      "非工作温度：−20°C 至 45°C (−4°F 至 113°F)",
      "相对湿度：5% 至 95%，无凝结",
      "工作高度最高测试：3000 米 (10000 英尺)"
    ]
  },
  {
    "title": "🌱 环保特性",
    "items": [
      "iPhone 16 Pro 采用再生材料制造",
      "再生钛金属外壳",
      "再生稀土元素",
      "100% 再生钴用于电池",
      "包装采用 100% 纤维材料"
    ]
  },
  {
    "title": "🌐 语言支持",
    "items": [
      "简体中文、繁体中文、英文、法文、德文、日文、韩文等",
      "支持多种语言同时使用"
    ]
  }
];

// iPhone 16 Pro Max 完整规格 (与 16 Pro 类似，但尺寸/电池不同)
const iphone16ProMaxSections = iphone16ProSections.map(s => ({...s, items: [...s.items]}));
// 修改尺寸、显示屏和电池
iphone16ProMaxSections[2] = { // 尺寸与重量
  "title": "📐 尺寸与重量",
  "items": [
    "高度：163.0 毫米 (6.42 英寸)",
    "宽度：77.6 毫米 (3.06 英寸)",
    "厚度：8.25 毫米 (0.32 英寸)",
    "重量：225 克 (7.94 盎司)"
  ]
};
iphone16ProMaxSections[3] = { // 显示屏
  "title": "📱 显示屏",
  "items": [
    "超视网膜 XDR 显示屏",
    "6.9英寸 (对角线) OLED 全面屏",
    "2868 x 1320像素分辨率，460 ppi",
    "灵动岛功能",
    "全天候显示",
    "ProMotion 自适应刷新率技术，最高可达 120Hz",
    "HDR显示",
    "原彩显示",
    "广色域 (P3)",
    "触感触控",
    "对比度：2,000,000:1 (典型)",
    "最高亮度：1000 尼特 (典型)",
    "峰值亮度 (HDR)：1600 尼特",
    "峰值亮度 (户外)：2000 尼特"
  ]
};
iphone16ProMaxSections[10] = { // 电池
  "title": "🔋 电源和电池",
  "items": [
    "视频播放最长可达 33 小时",
    "流媒体视频播放最长可达 25 小时",
    "音频播放最长可达 105 小时",
    "内置锂离子充电电池",
    "MagSafe 无线充电，最高可达 25W",
    "Qi2 无线充电，最高可达 15W",
    "使用 USB-C 连接充电",
    "快充：30 分钟最多可充至 50%"
  ]
};
iphone16ProMaxSections[7] = { // 摄像头
  "title": "📷 摄像头",
  "items": [
    "Pro 4800 万像素融合式摄像头系统",
    "4800 万像素主摄：ƒ/1.78 光圈",
    "第二代传感器位移式光学图像防抖",
    "100% Focus Pixels",
    "支持超高分辨率照片 (2400 万像素和 4800 万像素)",
    "4800 万像素超广角摄像头：ƒ/2.2 光圈和 120° 视角",
    "1200 万像素长焦摄像头 (四重反射棱镜)：ƒ/2.8 光圈",
    "5 倍光学变焦范围",
    "数码变焦最高可达 25倍",
    "蓝宝石镜片镜头盖",
    "True Tone 闪光灯",
    "照片风格",
    "微距摄影",
    "人像模式",
    "夜间模式",
    "深度融合",
    "智能 HDR 5",
    " Photonic Engine",
    "ProRAW",
    "ProRes 视频录制"
  ]
};

// 添加到 specs.json
if (!specs.iPhone规格集["iPhone 16"].official_data) {
  specs.iPhone规格集["iPhone 16"].official_data = {};
}
specs.iPhone规格集["iPhone 16"].official_data.sections = iphone16Sections;
specs.iPhone规格集["iPhone 16"].official_data.image_og = "images/iphone/iphone-16-hero.jpg";

// 添加 iPhone 16 Plus
specs.iPhone规格集["iPhone 16 Plus"] = {
  "屏幕": {
    "尺寸": "6.7 英寸（对角线）",
    "屏幕类型": "Super Retina XDR",
    "技术": "OLED",
    "分辨率": "2796 x 1290 像素",
    "刷新率": "60Hz",
    "常亮显示": "不支持",
    "灵动岛": "支持"
  },
  "处理器": {
    "芯片": "Apple A18",
    "核心配置": "6核 CPU（2 性能核 + 4 效率核）",
    "图形处理": "5核 GPU",
    "神经引擎": "16核"
  },
  "存储": {
    "总容量": "128GB / 256GB / 512GB",
    "可选选项": ["128GB", "256GB", "512GB"]
  },
  "相机": {
    "双摄系统": "融合相机系统",
    "主摄": "48MP f/1.6 光圈",
    "超广角": "12MP f/2.2 超广角，120° 视角",
    "前置": "12MP f/1.9 光圈",
    "前置特性": ["居中舞台功能"]
  },
  "电池与充电": {
    "视频播放时间": "最长约 27 小时",
    "音频播放时间": "最长约 100 小时",
    "无线充电": "最高 25W MagSafe",
    "快速充电": "可充电至 50% 电量（约 30 分钟）"
  },
  "设计": {
    "外壳": "铝金属设计",
    "背玻璃": "受保护玻璃",
    "防水防尘": "IP68 等级",
    "尺寸": "160.9 x 77.8 x 7.80 毫米",
    "重量": "199 克"
  },
  "颜色": ["黑色", "天然色", "海滨蓝", "乳白色"],
  "起售价": "¥5,499",
  "official_data": {
    "source": "Apple CN official compare page",
    "specs_page": "https://www.apple.com.cn/iphone-16/specs/",
    "compare_page": "https://www.apple.com.cn/iphone/compare/",
    "fetched_at": "2026-04-14 19:55:00",
    "image_og": "images/iphone/iphone-16-plus-hero.jpg",
    "sections": iphone16PlusSections
  }
};

if (!specs.iPhone规格集["iPhone 16 Pro"].official_data) {
  specs.iPhone规格集["iPhone 16 Pro"].official_data = {};
}
specs.iPhone规格集["iPhone 16 Pro"].official_data.sections = iphone16ProSections;
specs.iPhone规格集["iPhone 16 Pro"].official_data.image_og = "images/iphone/iphone-16-pro-hero.jpg";

if (!specs.iPhone规格集["iPhone 16 Pro Max"].official_data) {
  specs.iPhone规格集["iPhone 16 Pro Max"].official_data = {};
}
specs.iPhone规格集["iPhone 16 Pro Max"].official_data.sections = iphone16ProMaxSections;
specs.iPhone规格集["iPhone 16 Pro Max"].official_data.image_og = "images/iphone/iphone-16-pro-max-hero.jpg";

fs.writeFileSync(specsPath, JSON.stringify(specs, null, 2), 'utf8');
console.log('✅ iPhone 16 系列详细规格已更新！');
console.log('- iPhone 16: ' + iphone16Sections.length + ' 个分类');
console.log('- iPhone 16 Plus: ' + iphone16PlusSections.length + ' 个分类');
console.log('- iPhone 16 Pro: ' + iphone16ProSections.length + ' 个分类');
console.log('- iPhone 16 Pro Max: ' + iphone16ProMaxSections.length + ' 个分类');
