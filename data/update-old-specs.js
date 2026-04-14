const fs = require('fs');
const path = require('path');

const specsPath = path.join(__dirname, 'specs.json');
const specs = JSON.parse(fs.readFileSync(specsPath, 'utf8'));

const models = specs['iPhone规格集'];

// 通用 sections 模板
const commonSections = {
  operationEnv: {
    title: "🌍 操作环境",
    items: [
      "工作温度：0°C 至 35°C (32°F 至 95°F)",
      "非工作温度：−20°C 至 45°C (−4°F 至 113°F)",
      "相对湿度：非凝结状态下 5% 至 95%",
      "工作高度：最高测试 3000 米 (10,000 英尺)"
    ]
  },
  languageSupport: {
    title: "🌐 语言支持",
    items: [
      "中文、英文、法文、德文、日文、韩文、西班牙文等 30+ 种语言及地区变体"
    ]
  },
  faceID: {
    title: "👤 面容 ID",
    items: [
      "通过原深感摄像头进行面容识别"
    ]
  },
  security: {
    title: "🛡️ 安全功能",
    items: [
      "车祸检测",
      "SOS 紧急联络",
      "查找我的 iPhone"
    ]
  },
  inBox: {
    title: "📦 在盒内的配件",
    items: [
      "iPhone",
      "USB-C 转 Lightning 线缆 / Lightning 转 USB-C 线缆",
      "资料"
    ]
  }
};

// 为旧机型生成 official_data
function generateOfficialData(modelName, config) {
  const {
    chip,
    hasAppleIntelligence,
    hasMagSafe,
    hasActionMode,
    hasDynamicIsland,
    hasCeramicShield,
    hasProMotion,
    hasAlwaysOn,
    hasCameraControl,
    hasUSB_C,
    usbVersion,
    videoHours,
    audioHours,
    wirelessWatt,
    ipRating,
    mainCamera,
    ultraCamera,
    teleCamera,
    frontCamera,
    frontAperture,
    videoFeatures,
    colors,
    materials,
    height,
    width,
    thickness,
    weight,
    storage,
    screenSize,
    screenType,
    resolution,
    refreshRate,
    network,
    wifi,
    bluetooth,
    gps,
    ios,
    hasUltraWideband,
    hasThread,
    hasNFC,
    hasSatellite,
    hasLiDAR,
    ecoFeatures,
    imageOg
  } = config;

  const sections = [];

  // 外观
  sections.push({
    title: "🎨 外观",
    items: [
      colors.join('、'),
      materials,
      hasCeramicShield ? "超瓷晶面板 (正面)" : "玻璃面板 (正面)",
      "玻璃背板"
    ]
  });

  // 容量
  sections.push({
    title: "💾 容量",
    items: storage
  });

  // 尺寸与重量
  sections.push({
    title: "📐 尺寸与重量",
    items: [
      `高度：${height} 毫米`,
      `宽度：${width} 毫米`,
      `厚度：${thickness} 毫米`,
      `重量：${weight} 克`
    ]
  });

  // 显示屏
  const displayItems = [
    screenType + " 显示屏",
    `${screenSize}英寸 (对角线) ${screenType.includes('Retina XDR') ? 'OLED' : 'IPS LCD'} 全面屏`,
    `${resolution}分辨率`,
  ];
  if (hasDynamicIsland) displayItems.push("灵动岛功能");
  if (hasAlwaysOn) displayItems.push("全天候显示");
  if (hasProMotion) displayItems.push("ProMotion 自适应刷新率技术，最高可达 120Hz");
  displayItems.push(
    "HDR显示",
    "原彩显示",
    "广色域 (P3)",
    "触感触控",
    refreshRate.includes('120') ? "120Hz 刷新率" : "60Hz 刷新率"
  );
  sections.push({ title: "📱 显示屏", items: displayItems });

  // 防溅抗水防尘
  sections.push({
    title: "💧 防溅抗水防尘",
    items: [
      ipRating === 'IP68' ? "在最深 6 米的水下停留时间最长可达 30 分钟" : 
      ipRating === 'IP67' ? "在最深 1 米的水下停留时间最长可达 30 分钟" :
      ipRating === 'IP65' ? "防溅、抗水、防尘" : "防溅、抗水",
      `${ipRating} 等级`
    ]
  });

  // 芯片
  const chipItems = [`${chip} 芯片`];
  if (chip.includes('A17 Pro')) {
    chipItems.push("6核中央处理器，具有 2 个性能核心和 4 个能效核心");
    chipItems.push("6核图形处理器");
    chipItems.push("16核神经网络引擎");
    chipItems.push("硬件加速光线追踪");
  } else if (chip.includes('A16')) {
    chipItems.push("6核中央处理器");
    chipItems.push("5核图形处理器");
    chipItems.push("16核神经网络引擎");
  } else if (chip.includes('A15')) {
    chipItems.push("6核中央处理器");
    chipItems.push(config.gpuCores === '5' ? "5核图形处理器" : "4核图形处理器");
    chipItems.push("16核神经网络引擎");
  } else if (chip.includes('A14')) {
    chipItems.push("6核中央处理器");
    chipItems.push("4核图形处理器");
    chipItems.push("16核神经网络引擎");
  } else if (chip.includes('A13')) {
    chipItems.push("6核中央处理器");
    chipItems.push("4核图形处理器");
    chipItems.push("8核神经网络引擎");
  }
  sections.push({ title: "⚡ 芯片", items: chipItems });

  // Apple 智能
  if (hasAppleIntelligence) {
    sections.push({
      title: "🧠 Apple 智能",
      items: ["为 Apple 智能预备好"]
    });
  }

  // 摄像头
  const cameraItems = [
    mainCamera,
  ];
  if (ultraCamera) cameraItems.push(ultraCamera);
  if (teleCamera) cameraItems.push(teleCamera);
  cameraItems.push(
    "蓝宝石玻璃镜头表面",
    "原彩闪光灯",
    "光像引擎",
    "智能 HDR",
    "深度融合技术",
    "人像模式",
    "夜间模式"
  );
  if (config.hasMacro) cameraItems.push("微距摄影");
  if (config.hasProRAW) cameraItems.push("ProRAW");
  sections.push({ title: "📷 摄像头", items: cameraItems });

  // 视频拍摄
  const videoItems = videoFeatures || [
    "4K 杜比视界视频拍摄，最高可达 60 fps",
    "1080p 杜比视界视频拍摄，最高可达 60 fps",
    "电影效果模式",
    hasActionMode ? "运动模式" : null,
    "光学图像防抖"
  ].filter(Boolean);
  sections.push({ title: "🎬 视频拍摄", items: videoItems });

  // 前置摄像头
  const frontItems = [
    `${frontCamera}：${frontAperture} 光圈`,
    "视网膜屏闪光灯",
    "智能 HDR",
    "深度融合技术",
    "人像模式",
    "夜间模式",
    "4K 杜比视界视频拍摄，最高可达 60 fps",
    "电影效果模式"
  ];
  sections.push({ title: "🤳 前置摄像头", items: frontItems });

  // 电源和电池
  const batteryItems = [
    `视频播放 最长可达 ${videoHours} 小时`,
    `音频播放 最长可达 ${audioHours || videoHours + 50} 小时`,
    "内置锂离子充电电池",
    "可快速充电：约 30 分钟最多可充至 50% 电量"
  ];
  sections.push({ title: "🔋 电源和电池", items: batteryItems });

  // USB-C / Lightning
  if (hasUSB_C) {
    sections.push({
      title: "🔌 USB-C",
      items: [
        `USB ${usbVersion || '2'} 速度`,
        "DisplayPort 输出",
        "支持 USB 音频配件"
      ]
    });
  } else {
    sections.push({
      title: "🔌 Lightning",
      items: [
        "Lightning 接口",
        "支持 USB 2.0 速度"
      ]
    });
  }

  // 面容 ID
  sections.push(commonSections.faceID);

  // 安全功能
  sections.push(commonSections.security);

  // 蜂窝网络和连接
  const networkItems = [
    network || "5G (sub-6 GHz)",
    "千兆级 LTE",
    "支持 eSIM",
    wifi || "Wi-Fi 6 (802.11ax)",
    bluetooth || "蓝牙 5.0",
  ];
  if (hasUltraWideband) networkItems.push("超宽带芯片");
  if (hasThread) networkItems.push("Thread 网络技术");
  if (hasNFC !== false) networkItems.push("NFC 支持读卡器模式");
  if (hasSatellite) networkItems.push("卫星连接 (支持紧急 SOS)");
  sections.push({ title: "📡 蜂窝网络和连接", items: networkItems });

  // MagSafe / 无线充电
  if (hasMagSafe) {
    const magsafeItems = [
      `MagSafe 无线充电 (功率最高可达 ${wirelessWatt || 15} 瓦)`,
      "Qi2 无线充电 (功率最高可达 15 瓦)",
      "磁吸阵列",
      "磁吸对齐",
      "配件识别 NFC"
    ];
    sections.push({ title: "🔮 MagSafe 无线充电", items: magsafeItems });
  } else {
    sections.push({
      title: "🔮 无线充电",
      items: [
        "Qi 无线充电 (功率最高可达 7.5 瓦)",
        "MagSafe 不支持"
      ]
    });
  }

  // 定位
  const gpsItems = gps || [
    "精准双频 GPS",
    "GLONASS",
    "Galileo",
    "QZSS",
    "北斗",
    "数字指南针",
    "无线局域网/蜂窝网络/iBeacon 微定位"
  ];
  sections.push({ title: "📍 定位", items: gpsItems });

  // 在盒内的配件
  const inBoxItems = [
    `装有 ${ios || 'iOS'} 的 iPhone`,
    hasUSB_C ? "USB-C 转 Lightning 充电线 (1 米)" : "Lightning 转 USB-C 充电线 (1 米)",
    "资料"
  ];
  sections.push({ title: "📦 在盒内的配件", items: inBoxItems });

  // 操作环境
  sections.push(commonSections.operationEnv);

  // 环保特性
  sections.push({
    title: "🌱 环保特性",
    items: ecoFeatures || [
      "采用再生材料制造",
      "再生铝金属",
      "100% 再生稀土元素",
      "纤维包装"
    ]
  });

  // 语言支持
  sections.push(commonSections.languageSupport);

  return {
    sections,
    image_og: imageOg || ""
  };
}

// iPhone 15 系列 (A17 Pro, 支持 Apple 智能, USB-C, MagSafe, 操作按钮 Pro 系列)
const iphone15Config = {
  chip: "A16 Bionic",
  hasAppleIntelligence: false,
  hasMagSafe: true,
  hasActionMode: true,
  hasDynamicIsland: true,
  hasCeramicShield: true,
  hasProMotion: false,
  hasAlwaysOn: false,
  hasCameraControl: false,
  hasUSB_C: true,
  usbVersion: "2",
  videoHours: "20",
  audioHours: "70",
  wirelessWatt: 15,
  ipRating: "IP67",
  mainCamera: "4800 万像素融合式主摄：26 毫米焦距，ƒ/1.6 光圈，传感器位移式光学图像防抖",
  ultraCamera: "1200 万像素超广角摄像头：13 毫米焦距，ƒ/2.4 光圈，120° 视角",
  teleCamera: null,
  frontCamera: "1200 万像素前置摄像头",
  frontAperture: "ƒ/1.9",
  videoFeatures: [
    "4K 杜比视界视频拍摄，24/25/30/60 fps",
    "1080p 杜比视界视频拍摄，25/30/60 fps",
    "电影效果模式，最高可达 4K 杜比视界，30 fps",
    "运动模式，最高可达 2.8K 杜比视界，60 fps",
    "慢动作视频支持 1080p (120/240 fps)",
    "传感器位移式光学图像防抖",
    "影院级视频防抖功能"
  ],
  colors: ["黑色", "黄色", "绿色", "蓝色", "粉色"],
  materials: "铝金属设计",
  height: "147.6",
  width: "71.6",
  thickness: "7.80",
  weight: "171",
  storage: ["128GB", "256GB", "512GB"],
  screenSize: "6.1",
  screenType: "超视网膜 XDR",
  resolution: "2556 x 1179",
  refreshRate: "60Hz",
  network: "5G (sub-6 GHz)",
  wifi: "Wi-Fi 6 (802.11ax)",
  bluetooth: "蓝牙 5.3",
  hasUltraWideband: true,
  hasThread: false,
  hasNFC: true,
  hasSatellite: true,
  hasLiDAR: false,
  hasMacro: false,
  hasProRAW: false,
  ios: "iOS 17",
  ecoFeatures: [
    "整机含再生成分",
    "再生铝金属外壳",
    "100% 再生稀土元素",
    "100% 再生钴电池",
    "100% 纤维包装"
  ],
  imageOg: "images/iphone/iphone-15-hero.jpg"
};

const iphone15ProConfig = {
  ...iphone15Config,
  chip: "A17 Pro",
  hasAppleIntelligence: true,
  hasProMotion: true,
  hasAlwaysOn: true,
  hasActionMode: true,
  hasCameraControl: false,
  wirelessWatt: 25,
  ipRating: "IP68",
  mainCamera: "4800 万像素 Pro 融合式主摄：24 毫米焦距，ƒ/1.78 光圈，第二代传感器位移式光学图像防抖",
  ultraCamera: "1200 万像素超广角摄像头：13 毫米焦距，ƒ/2.2 光圈，120° 视角",
  teleCamera: "1200 万像素长焦摄像头：77 毫米焦距，ƒ/2.8 光圈，3 倍光学变焦",
  videoFeatures: [
    "4K 杜比视界视频拍摄，24/25/30/60 fps",
    "1080p 杜比视界视频拍摄，25/30/60 fps",
    "ProRes 视频拍摄，最高可达 4K 60 fps",
    "Apple Log",
    "电影效果模式，最高可达 4K 杜比视界，30 fps",
    "运动模式，最高可达 2.8K 杜比视界，60 fps",
    "慢动作视频支持 1080p (120/240 fps)",
    "传感器位移式光学图像防抖",
    "影院级视频防抖功能"
  ],
  colors: ["黑钛色", "白钛色", "蓝钛色", "自然钛色"],
  materials: "钛金属设计",
  height: "146.6",
  width: "70.6",
  thickness: "8.25",
  weight: "187",
  storage: ["128GB", "256GB", "512GB", "1TB"],
  screenSize: "6.1",
  resolution: "2556 x 1179",
  refreshRate: "120Hz ProMotion",
  usbVersion: "3",
  network: "5G (sub-6 GHz 和毫米波)",
  wifi: "Wi-Fi 6E (802.11ax)",
  bluetooth: "蓝牙 5.3",
  hasLiDAR: true,
  hasMacro: true,
  hasProRAW: true,
  ios: "iOS 17",
  hasActionMode: true,
  ecoFeatures: [
    "整机含再生成分",
    "再生钛金属外壳",
    "100% 再生稀土元素",
    "100% 再生钴电池",
    "100% 纤维包装"
  ],
  imageOg: "images/iphone/iphone-15-pro-hero.jpg"
};

const iphone15ProMaxConfig = {
  ...iphone15ProConfig,
  mainCamera: "4800 万像素 Pro 融合式主摄：24 毫米焦距，ƒ/1.78 光圈，第二代传感器位移式光学图像防抖",
  teleCamera: "1200 万像素四重反射棱镜长焦摄像头：120 毫米焦距，ƒ/2.8 光圈，5 倍光学变焦",
  videoHours: "29",
  audioHours: "95",
  height: "159.9",
  width: "76.7",
  thickness: "8.25",
  weight: "221",
  storage: ["256GB", "512GB", "1TB"],
  screenSize: "6.7",
  resolution: "2796 x 1290",
  imageOg: "images/iphone/iphone-15-pro-max-hero.jpg"
};

// iPhone 14 系列 (A15/A16, 不支持 Apple 智能, Lightning, MagSafe)
const iphone14Config = {
  chip: "A15 Bionic",
  gpuCores: "5",
  hasAppleIntelligence: false,
  hasMagSafe: true,
  hasActionMode: false,
  hasDynamicIsland: false,
  hasCeramicShield: true,
  hasProMotion: false,
  hasAlwaysOn: false,
  hasCameraControl: false,
  hasUSB_C: false,
  videoHours: "20",
  audioHours: "70",
  wirelessWatt: 15,
  ipRating: "IP67",
  mainCamera: "1200 万像素主摄：26 毫米焦距，ƒ/1.6 光圈，传感器位移式光学图像防抖",
  ultraCamera: "1200 万像素超广角摄像头：13 毫米焦距，ƒ/2.4 光圈，120° 视角",
  teleCamera: null,
  frontCamera: "1200 万像素前置摄像头",
  frontAperture: "ƒ/1.9",
  videoFeatures: [
    "4K 杜比视界视频拍摄，24/25/30/60 fps",
    "1080p 杜比视界视频拍摄，25/30/60 fps",
    "电影效果模式，最高可达 4K 杜比视界，30 fps",
    "运动模式，最高可达 2.8K，60 fps",
    "慢动作视频支持 1080p (120/240 fps)",
    "传感器位移式光学图像防抖",
    "影院级视频防抖功能"
  ],
  colors: ["午夜色", "星光色", "蓝色", "紫色", "红色"],
  materials: "铝金属设计",
  height: "146.7",
  width: "71.5",
  thickness: "7.80",
  weight: "172",
  storage: ["128GB", "256GB", "512GB"],
  screenSize: "6.1",
  screenType: "超视网膜 XDR",
  resolution: "2532 x 1170",
  refreshRate: "60Hz",
  network: "5G (sub-6 GHz)",
  wifi: "Wi-Fi 6 (802.11ax)",
  bluetooth: "蓝牙 5.3",
  hasUltraWideband: true,
  hasThread: false,
  hasNFC: true,
  hasSatellite: true,
  hasLiDAR: false,
  hasMacro: false,
  hasProRAW: false,
  ios: "iOS 16",
  ecoFeatures: [
    "整机含再生成分",
    "再生铝金属外壳",
    "100% 再生稀土元素",
    "100% 再生钴电池",
    "纤维包装"
  ],
  imageOg: "images/iphone/iphone-14-hero.jpg"
};

const iphone14ProConfig = {
  ...iphone14Config,
  chip: "A16 Bionic",
  hasDynamicIsland: true,
  hasProMotion: true,
  hasAlwaysOn: true,
  wirelessWatt: 25,
  ipRating: "IP67",
  mainCamera: "4800 万像素 Pro 融合式主摄：24 毫米焦距，ƒ/1.78 光圈，传感器位移式光学图像防抖",
  ultraCamera: "1200 万像素超广角摄像头：13 毫米焦距，ƒ/2.2 光圈，120° 视角",
  teleCamera: "1200 万像素长焦摄像头：77 毫米焦距，ƒ/2.8 光圈，3 倍光学变焦",
  videoFeatures: [
    "4K 杜比视界视频拍摄，24/25/30/60 fps",
    "1080p 杜比视界视频拍摄，25/30/60 fps",
    "ProRes 视频拍摄，最高可达 4K 30 fps",
    "电影效果模式，最高可达 4K 杜比视界，30 fps",
    "运动模式，最高可达 2.8K，60 fps",
    "慢动作视频支持 1080p (120/240 fps)",
    "传感器位移式光学图像防抖",
    "影院级视频防抖功能"
  ],
  colors: ["深空黑色", "银色", "金色", "暗紫色"],
  materials: "不锈钢设计",
  height: "147.5",
  width: "71.5",
  thickness: "7.85",
  weight: "187",
  storage: ["128GB", "256GB", "512GB", "1TB"],
  screenSize: "6.1",
  resolution: "2556 x 1179",
  refreshRate: "120Hz ProMotion",
  hasLiDAR: true,
  hasMacro: true,
  hasProRAW: true,
  ios: "iOS 16",
  ecoFeatures: [
    "整机含再生成分",
    "再生不锈钢外壳",
    "100% 再生稀土元素",
    "100% 再生钴电池",
    "纤维包装"
  ],
  imageOg: "images/iphone/iphone-14-pro-hero.jpg"
};

const iphone14ProMaxConfig = {
  ...iphone14ProConfig,
  videoHours: "26",
  audioHours: "100",
  height: "160.7",
  width: "77.6",
  thickness: "7.85",
  weight: "215",
  storage: ["256GB", "512GB", "1TB"],
  screenSize: "6.7",
  resolution: "2796 x 1290",
  imageOg: "images/iphone/iphone-14-pro-max-hero.jpg"
};

// iPhone 13 系列 (A15, Lightning, MagSafe 从 12 开始)
const iphone13Config = {
  chip: "A15 Bionic",
  gpuCores: "4",
  hasAppleIntelligence: false,
  hasMagSafe: true,
  hasActionMode: false,
  hasDynamicIsland: false,
  hasCeramicShield: true,
  hasProMotion: false,
  hasAlwaysOn: false,
  hasCameraControl: false,
  hasUSB_C: false,
  videoHours: "19",
  audioHours: "65",
  wirelessWatt: 15,
  ipRating: "IP67",
  mainCamera: "1200 万像素主摄：26 毫米焦距，ƒ/1.6 光圈，传感器位移式光学图像防抖",
  ultraCamera: "1200 万像素超广角摄像头：13 毫米焦距，ƒ/2.4 光圈，120° 视角",
  teleCamera: null,
  frontCamera: "1200 万像素前置摄像头",
  frontAperture: "ƒ/2.2",
  videoFeatures: [
    "4K 杜比视界视频拍摄，24/25/30/60 fps",
    "1080p 杜比视界视频拍摄，25/30/60 fps",
    "电影效果模式，最高可达 1080p，30 fps",
    "慢动作视频支持 1080p (120/240 fps)",
    "传感器位移式光学图像防抖",
    "影院级视频防抖功能"
  ],
  colors: ["午夜色", "星光色", "蓝色", "粉色", "红色"],
  materials: "铝金属设计",
  height: "146.7",
  width: "71.5",
  thickness: "7.65",
  weight: "174",
  storage: ["128GB", "256GB", "512GB"],
  screenSize: "6.1",
  screenType: "超视网膜 XDR",
  resolution: "2532 x 1170",
  refreshRate: "60Hz",
  network: "5G (sub-6 GHz)",
  wifi: "Wi-Fi 6 (802.11ax)",
  bluetooth: "蓝牙 5.0",
  hasUltraWideband: true,
  hasThread: false,
  hasNFC: true,
  hasSatellite: false,
  hasLiDAR: false,
  hasMacro: false,
  hasProRAW: false,
  ios: "iOS 15",
  ecoFeatures: [
    "整机含再生成分",
    "再生铝金属外壳",
    "100% 再生稀土元素",
    "100% 再生钴电池",
    "纤维包装"
  ],
  imageOg: "images/iphone/iphone-13-hero.jpg"
};

const iphone13ProConfig = {
  ...iphone13Config,
  gpuCores: "5",
  hasProMotion: true,
  hasAlwaysOn: false,
  wirelessWatt: 15,
  ipRating: "IP68",
  mainCamera: "1200 万像素 Pro 主摄：26 毫米焦距，ƒ/1.5 光圈，传感器位移式光学图像防抖",
  ultraCamera: "1200 万像素超广角摄像头：13 毫米焦距，ƒ/1.8 光圈，120° 视角",
  teleCamera: "1200 万像素长焦摄像头：77 毫米焦距，ƒ/2.8 光圈，3 倍光学变焦",
  videoFeatures: [
    "4K 杜比视界视频拍摄，24/25/30/60 fps",
    "1080p 杜比视界视频拍摄，25/30/60 fps",
    "ProRes 视频拍摄，最高可达 4K 30 fps",
    "电影效果模式，最高可达 1080p，30 fps",
    "慢动作视频支持 1080p (120/240 fps)",
    "传感器位移式光学图像防抖",
    "影院级视频防抖功能"
  ],
  colors: ["石墨色", "金色", "银色", "远峰蓝色"],
  materials: "不锈钢设计",
  height: "146.7",
  width: "71.5",
  thickness: "7.65",
  weight: "204",
  storage: ["128GB", "256GB", "512GB", "1TB"],
  screenSize: "6.1",
  resolution: "2532 x 1170",
  refreshRate: "120Hz ProMotion",
  hasLiDAR: true,
  hasMacro: true,
  hasProRAW: true,
  ios: "iOS 15",
  ecoFeatures: [
    "整机含再生成分",
    "再生不锈钢外壳",
    "100% 再生稀土元素",
    "100% 再生钴电池",
    "纤维包装"
  ],
  imageOg: "images/iphone/iphone-13-pro-hero.jpg"
};

const iphone13ProMaxConfig = {
  ...iphone13ProConfig,
  videoHours: "28",
  audioHours: "95",
  height: "160.8",
  width: "78.1",
  thickness: "7.65",
  weight: "238",
  storage: ["128GB", "256GB", "512GB", "1TB"],
  screenSize: "6.7",
  resolution: "2778 x 1284",
  imageOg: "images/iphone/iphone-13-pro-max-hero.jpg"
};

// iPhone 12 系列 (A14, 第一个支持 MagSafe, Lightning)
const iphone12Config = {
  chip: "A14 Bionic",
  hasAppleIntelligence: false,
  hasMagSafe: true,
  hasActionMode: false,
  hasDynamicIsland: false,
  hasCeramicShield: true,
  hasProMotion: false,
  hasAlwaysOn: false,
  hasCameraControl: false,
  hasUSB_C: false,
  videoHours: "17",
  audioHours: "65",
  wirelessWatt: 15,
  ipRating: "IP67",
  mainCamera: "1200 万像素主摄：26 毫米焦距，ƒ/1.6 光圈",
  ultraCamera: "1200 万像素超广角摄像头：13 毫米焦距，ƒ/2.4 光圈，120° 视角",
  teleCamera: null,
  frontCamera: "1200 万像素前置摄像头",
  frontAperture: "ƒ/2.2",
  videoFeatures: [
    "4K 杜比视界视频拍摄，24/25/30/60 fps",
    "1080p 杜比视界视频拍摄，25/30/60 fps",
    "慢动作视频支持 1080p (120/240 fps)",
    "光学图像防抖",
    "影院级视频防抖功能"
  ],
  colors: ["黑色", "白色", "蓝色", "绿色", "红色"],
  materials: "铝金属设计",
  height: "146.7",
  width: "71.5",
  thickness: "7.40",
  weight: "162",
  storage: ["64GB", "128GB", "256GB"],
  screenSize: "6.1",
  screenType: "超视网膜 XDR",
  resolution: "2532 x 1170",
  refreshRate: "60Hz",
  network: "5G (sub-6 GHz)",
  wifi: "Wi-Fi 6 (802.11ax)",
  bluetooth: "蓝牙 5.0",
  hasUltraWideband: true,
  hasThread: false,
  hasNFC: true,
  hasSatellite: false,
  hasLiDAR: false,
  hasMacro: false,
  hasProRAW: false,
  ios: "iOS 14",
  ecoFeatures: [
    "整机含再生成分",
    "再生铝金属外壳",
    "100% 再生稀土元素",
    "纤维包装"
  ],
  imageOg: "images/iphone/iphone-12-hero.jpg"
};

const iphone12ProConfig = {
  ...iphone12Config,
  ipRating: "IP68",
  mainCamera: "1200 万像素 Pro 主摄：26 毫米焦距，ƒ/1.6 光圈，传感器位移式光学图像防抖",
  ultraCamera: "1200 万像素超广角摄像头：13 毫米焦距，ƒ/2.4 光圈，120° 视角",
  teleCamera: "1200 万像素长焦摄像头：52 毫米焦距，ƒ/2.0 光圈，2 倍光学变焦",
  videoFeatures: [
    "4K 杜比视界视频拍摄，24/25/30/60 fps",
    "1080p 杜比视界视频拍摄，25/30/60 fps",
    "ProRes 视频拍摄不支持",
    "慢动作视频支持 1080p (120/240 fps)",
    "传感器位移式光学图像防抖",
    "影院级视频防抖功能"
  ],
  colors: ["石墨色", "银色", "金色", "太平洋蓝色"],
  materials: "不锈钢设计",
  height: "146.7",
  width: "71.5",
  thickness: "7.40",
  weight: "189",
  storage: ["128GB", "256GB", "512GB"],
  screenSize: "6.1",
  resolution: "2532 x 1170",
  hasLiDAR: true,
  hasMacro: false,
  hasProRAW: true,
  ios: "iOS 14",
  ecoFeatures: [
    "整机含再生成分",
    "再生不锈钢外壳",
    "100% 再生稀土元素",
    "纤维包装"
  ],
  imageOg: "images/iphone/iphone-12-pro-hero.jpg"
};

const iphone12ProMaxConfig = {
  ...iphone12ProConfig,
  videoHours: "20",
  audioHours: "80",
  mainCamera: "1200 万像素 Pro 主摄：26 毫米焦距，ƒ/1.6 光圈，传感器位移式光学图像防抖",
  teleCamera: "1200 万像素长焦摄像头：65 毫米焦距，ƒ/2.2 光圈，2.5 倍光学变焦",
  height: "160.8",
  width: "78.1",
  thickness: "7.40",
  weight: "228",
  storage: ["128GB", "256GB", "512GB"],
  screenSize: "6.7",
  resolution: "2778 x 1284",
  imageOg: "images/iphone/iphone-12-pro-max-hero.jpg"
};

// iPhone 11 系列 (A13, 不支持 MagSafe, Lightning)
const iphone11Config = {
  chip: "A13 Bionic",
  hasAppleIntelligence: false,
  hasMagSafe: false,
  hasActionMode: false,
  hasDynamicIsland: false,
  hasCeramicShield: false,
  hasProMotion: false,
  hasAlwaysOn: false,
  hasCameraControl: false,
  hasUSB_C: false,
  videoHours: "18",
  audioHours: "65",
  wirelessWatt: 7.5,
  ipRating: "IP68",
  mainCamera: "1200 万像素主摄：26 毫米焦距，ƒ/1.8 光圈，光学图像防抖",
  ultraCamera: "1200 万像素超广角摄像头：13 毫米焦距，ƒ/2.4 光圈，120° 视角",
  teleCamera: null,
  frontCamera: "1200 万像素前置摄像头",
  frontAperture: "ƒ/2.2",
  videoFeatures: [
    "4K 视频拍摄，24/25/30/60 fps",
    "1080p 视频拍摄，25/30/60 fps",
    "慢动作视频支持 1080p (120/240 fps)",
    "光学图像防抖",
    "影院级视频防抖功能"
  ],
  colors: ["黑色", "绿色", "黄色", "紫色", "白色", "红色"],
  materials: "铝金属设计",
  height: "150.9",
  width: "75.7",
  thickness: "8.30",
  weight: "194",
  storage: ["64GB", "128GB", "256GB"],
  screenSize: "6.1",
  screenType: "Liquid Retina HD",
  resolution: "1792 x 828",
  refreshRate: "60Hz",
  network: "4G LTE",
  wifi: "Wi-Fi 6 (802.11ax)",
  bluetooth: "蓝牙 5.0",
  hasUltraWideband: true,
  hasThread: false,
  hasNFC: true,
  hasSatellite: false,
  hasLiDAR: false,
  hasMacro: false,
  hasProRAW: false,
  ios: "iOS 13",
  ecoFeatures: [
    "整机含再生成分",
    "再生铝金属外壳",
    "100% 再生稀土元素",
    "纤维包装"
  ],
  imageOg: "images/iphone/iphone-11-hero.jpg"
};

const iphone11ProConfig = {
  ...iphone11Config,
  mainCamera: "1200 万像素 Pro 主摄：26 毫米焦距，ƒ/1.8 光圈，光学图像防抖",
  ultraCamera: "1200 万像素超广角摄像头：13 毫米焦距，ƒ/2.4 光圈，120° 视角",
  teleCamera: "1200 万像素长焦摄像头：52 毫米焦距，ƒ/2.0 光圈，2 倍光学变焦",
  videoFeatures: [
    "4K 杜比视界视频拍摄，24/25/30/60 fps",
    "1080p 杜比视界视频拍摄，25/30/60 fps",
    "慢动作视频支持 1080p (120/240 fps)",
    "光学图像防抖",
    "影院级视频防抖功能"
  ],
  colors: ["暗夜绿色", "太空灰色", "银色", "金色"],
  materials: "不锈钢设计",
  height: "144.0",
  width: "71.4",
  thickness: "8.10",
  weight: "188",
  storage: ["64GB", "256GB", "512GB"],
  screenSize: "5.8",
  screenType: "超视网膜 XDR",
  resolution: "2436 x 1125",
  hasLiDAR: false,
  ios: "iOS 13",
  imageOg: "images/iphone/iphone-11-pro-hero.jpg"
};

const iphone11ProMaxConfig = {
  ...iphone11ProConfig,
  videoHours: "20",
  audioHours: "80",
  height: "158.0",
  width: "77.8",
  thickness: "8.10",
  weight: "226",
  storage: ["64GB", "256GB", "512GB"],
  screenSize: "6.5",
  resolution: "2688 x 1242",
  imageOg: "images/iphone/iphone-11-pro-max-hero.jpg"
};

// iPhone X 及早期 (简化版)
const iphoneXConfig = {
  chip: "A11 Bionic",
  hasAppleIntelligence: false,
  hasMagSafe: false,
  hasActionMode: false,
  hasDynamicIsland: false,
  hasCeramicShield: false,
  hasProMotion: false,
  hasAlwaysOn: false,
  hasCameraControl: false,
  hasUSB_C: false,
  videoHours: "14",
  audioHours: "60",
  wirelessWatt: 7.5,
  ipRating: "IP67",
  mainCamera: "1200 万像素广角摄像头：28 毫米焦距，ƒ/1.8 光圈，光学图像防抖",
  ultraCamera: null,
  teleCamera: "1200 万像素长焦摄像头：56 毫米焦距，ƒ/2.4 光圈，2 倍光学变焦",
  frontCamera: "700 万像素前置摄像头",
  frontAperture: "ƒ/2.2",
  videoFeatures: [
    "4K 视频拍摄，24/25/30/60 fps",
    "1080p 视频拍摄，25/30/60 fps",
    "慢动作视频支持 1080p (120/240 fps)",
    "光学图像防抖"
  ],
  colors: ["深空灰色", "银色"],
  materials: "不锈钢设计 + 玻璃背板",
  height: "143.6",
  width: "70.9",
  thickness: "7.70",
  weight: "174",
  storage: ["64GB", "256GB"],
  screenSize: "5.8",
  screenType: "超视网膜 HD",
  resolution: "2436 x 1125",
  refreshRate: "60Hz",
  network: "4G LTE",
  wifi: "Wi-Fi 5 (802.11ac)",
  bluetooth: "蓝牙 5.0",
  hasUltraWideband: false,
  hasThread: false,
  hasNFC: true,
  hasSatellite: false,
  hasLiDAR: false,
  hasMacro: false,
  hasProRAW: false,
  ios: "iOS 11",
  ecoFeatures: [
    "采用再生材料",
    "纤维包装"
  ],
  imageOg: "images/iphone/iphone-x-hero.jpg"
};

// 更新机型数据
const modelsToUpdate = {
  "iPhone 15": iphone15Config,
  "iPhone 15 Pro": iphone15ProConfig,
  "iPhone 15 Pro Max": iphone15ProMaxConfig,
  "iPhone 14": iphone14Config,
  "iPhone 14 Pro": iphone14ProConfig,
  "iPhone 14 Pro Max": iphone14ProMaxConfig,
  "iPhone 13": iphone13Config,
  "iPhone 13 Pro": iphone13ProConfig,
  "iPhone 13 Pro Max": iphone13ProMaxConfig,
  "iPhone 12": iphone12Config,
  "iPhone 12 Pro": iphone12ProConfig,
  "iPhone 12 Pro Max": iphone12ProMaxConfig,
  "iPhone 11": iphone11Config,
  "iPhone 11 Pro": iphone11ProConfig,
  "iPhone 11 Pro Max": iphone11ProMaxConfig,
};

let updatedCount = 0;

for (const [modelName, config] of Object.entries(modelsToUpdate)) {
  if (models[modelName]) {
    if (!models[modelName].official_data) {
      models[modelName].official_data = {};
    }
    const officialData = generateOfficialData(modelName, config);
    models[modelName].official_data.sections = officialData.sections;
    models[modelName].official_data.image_og = officialData.image_og;
    updatedCount++;
    console.log(`已更新: ${modelName} (${officialData.sections.length} 个分类)`);
  } else {
    console.log(`未找到: ${modelName}`);
  }
}

// 保存文件
fs.writeFileSync(specsPath, JSON.stringify(specs, null, 2), 'utf8');
console.log(`\n完成! 共更新 ${updatedCount} 个机型的数据。`);
console.log(`文件已保存至: ${specsPath}`);
