const fs = require('fs');
const path = require('path');

const specsPath = path.join(__dirname, '..', 'data', 'specs.json');
const specs = JSON.parse(fs.readFileSync(specsPath, 'utf8'));

// 分类图标映射 (emoji)
const sectionIcons = {
  '外观': '🎨',
  '容量': '💾',
  '尺寸与重量': '📐',
  '显示屏': '📱',
  '防溅、抗水、防尘': '💧',
  '芯片': '⚡',
  'Apple 智能': '🧠',
  '摄像头': '📷',
  '视频拍摄': '🎬',
  '前置摄像头': '🤳',
  '电源和电池': '🔋',
  'USB-C': '🔌',
  '面容 ID': '👤',
  '安全功能': '🛡️',
  '蜂窝网络和连接': '📡',
  'MagSafe 无线充电': '🔮',
  '在盒内的配件': '📦',
  '定位': '📍',
  'SIM 卡': '📇',
  '音频播放': '🎵',
  '视频播放': '🎥',
  '操作环境与包装': '🌍',
  '按键与接口': '🔘',
  '传感器': '🔬',
  '操作系统': '💻'
};

// 定义更完整的规格数据
const allSpecs = {
  'iPhone 17': {
    sections: [
      {
        title: '外观',
        icon: '🎨',
        items: [
          '黑色、白色、青雾蓝色、鼠尾草绿色、薰衣草紫色',
          '铝金属设计',
          '超瓷晶面板 (正面)',
          '融色玻璃背板'
        ]
      },
      {
        title: '容量',
        icon: '💾',
        items: ['256GB', '512GB']
      },
      {
        title: '尺寸与重量',
        icon: '📐',
        items: [
          '宽度：71.5毫米 (2.81英寸)',
          '高度：149.6毫米 (5.89英寸)',
          '厚度：7.95毫米 (0.31英寸)',
          '重量：177克 (6.24盎司)'
        ]
      },
      {
        title: '显示屏',
        icon: '📱',
        items: [
          '超视网膜 XDR 显示屏',
          '6.3英寸 (对角线) OLED 全面屏',
          '2622 x 1206像素分辨率，460 ppi',
          '灵动岛功能',
          '全天候显示',
          'ProMotion 自适应刷新率技术，最高可达 120Hz',
          'HDR显示',
          '原彩显示',
          '广色域 (P3)',
          '触感触控',
          '2000000:1对比度 (典型)',
          '1000尼特最大亮度 (典型)',
          '1600尼特峰值亮度 (HDR)',
          '3000尼特峰值亮度 (户外)',
          '最小亮度为1尼特',
          '采用防油渍防指纹涂层',
          '抗反射涂层',
          '支持多种语言文字同时显示',
          'iPhone 17 显示屏采用曲线优美的圆角设计，四个圆角位于一个标准矩形内。按照标准矩形测量时，屏幕的对角线长度是 6.27 英寸 (实际可视区域较小)。'
        ]
      },
      {
        title: '防溅、抗水、防尘',
        icon: '💧',
        items: [
          '效果在 IEC 60529 标准下达到 IP68 级别',
          '在最深 6 米的水下停留时间最长可达 30 分钟'
        ]
      },
      {
        title: '芯片',
        icon: '⚡',
        items: [
          'A19 芯片',
          '6核中央处理器，具有 2 个性能核心和 4 个能效核心',
          '5核图形处理器，配备神经网络加速器',
          '16核神经网络引擎',
          '硬件加速光线追踪'
        ]
      },
      {
        title: 'Apple 智能',
        icon: '🧠',
        items: [
          '为 Apple 智能预备好',
          'Apple 智能推出时间依监管部门审批情况而定。'
        ]
      },
      {
        title: '摄像头',
        icon: '📷',
        items: [
          '4800 万像素融合式摄像头系统',
          '4800 万像素融合式主摄：26 毫米焦距，ƒ/1.6 光圈',
          '传感器位移式光学图像防抖功能',
          '100% Focus Pixels',
          '支持超高分辨率照片 (2400 万像素和 4800 万像素)',
          '4800 万像素融合式超广角摄像头：13 毫米焦距，ƒ/2.2 光圈',
          '120° 视角',
          '2 倍光学变焦 (放大和缩小)',
          '0.5x、1x、2x 光学变焦范围',
          '最高可达 10 倍数码变焦',
          'Camera Control',
          '蓝宝石玻璃镜头表面',
          '原彩闪光灯',
          '光像引擎',
          '智能 HDR 5',
          '深度融合技术',
          '新一代人像功能，支持焦点控制和景深控制',
          '人像光效，支持六种效果',
          '夜间模式',
          '微距摄影',
          '新一代摄影风格',
          '拍摄广色域的照片和实况照片',
          '先进的红眼校正功能',
          '自动图像防抖功能',
          '连拍模式',
          '照片地理标记功能',
          '图像拍摄格式：HEIF 和 JPEG',
          '空间照片'
        ]
      },
      {
        title: '视频拍摄',
        icon: '🎬',
        items: [
          '4K 杜比视界视频拍摄，24 fps、25 fps、30 fps 或 60 fps',
          '1080p 杜比视界视频拍摄，25 fps、30 fps 或 60 fps',
          '720p 杜比视界视频拍摄，30 fps',
          '电影效果模式，最高可达 4K 杜比视界，30 fps',
          '运动模式，最高可达 2.8K 杜比视界，60 fps',
          '慢动作视频支持 1080p (120 fps 或 240 fps)',
          '空间视频拍摄，1080p (30 fps)',
          '传感器位移式视频光学图像防抖功能',
          '最高可达 10 倍数码变焦',
          '音频变焦',
          '原彩闪光灯',
          '影院级视频防抖功能 (4K、1080p 和 720p)',
          '连续自动对焦视频',
          '4K 视频录制过程中拍摄 2400 万像素静态照片',
          '视频快录功能',
          '混音'
        ]
      },
      {
        title: '前置摄像头',
        icon: '🤳',
        items: [
          '1800 万像素 Center Stage 摄像头：ƒ/1.9 光圈',
          'Focus Pixels 自动对焦',
          '视网膜屏闪光灯',
          '新一代摄影风格',
          '智能 HDR 5',
          '深度融合技术',
          '人像模式，支持先进的人像光效和景深控制',
          '夜间模式',
          '4K 杜比视界视频拍摄，最高可达 60 fps',
          '电影效果模式，最高可达 4K 杜比视界，30 fps',
          '视频超稳防抖',
          '影院级视频防抖功能 (4K、1080p 和 720p)',
          '空间音频录音',
          '混音'
        ]
      },
      {
        title: '电源和电池',
        icon: '🔋',
        items: [
          '视频播放 最长可达 30 小时',
          '流媒体视频播放 最长可达 27 小时',
          '音频播放 最长可达 85 小时',
          '内置锂离子充电电池',
          '可快速充电：约 20 分钟最多可充至 50% 电量',
          '需使用 40 瓦或更大功率的电源适配器 (另外有售)'
        ]
      },
      {
        title: 'USB-C',
        icon: '🔌',
        items: [
          'USB-C 接口',
          '支持充电',
          'DisplayPort',
          'USB 2 (最高可达 480Mb/s)'
        ]
      },
      {
        title: '面容 ID',
        icon: '👤',
        items: [
          '通过原深感摄像头进行面容识别'
        ]
      },
      {
        title: '安全功能',
        icon: '🛡️',
        items: [
          'SOS 紧急联络',
          '车祸检测'
        ]
      },
      {
        title: '蜂窝网络和连接',
        icon: '📡',
        items: [
          '5G (sub-6 GHz)',
          '千兆 LTE，支持 4x4 MIMO',
          '支持双卡 (nano-SIM 卡)',
          'Wi‑Fi 7 (802.11be)，具备 2x2 MIMO 技术',
          '蓝牙 6',
          '超宽带技术芯片 (第二代)',
          'Thread 网络技术',
          'NFC 支持读卡器模式',
          '可通过备用电量使用的快捷交通卡功能'
        ]
      },
      {
        title: 'MagSafe 无线充电',
        icon: '🔮',
        items: [
          'MagSafe 无线充电 (功率最高可达 15 瓦)',
          'Qi2 无线充电 (功率最高可达 15 瓦)',
          '磁吸阵列',
          '磁吸对齐',
          '配件识别 NFC',
          '磁力计'
        ]
      },
      {
        title: '在盒内的配件',
        icon: '📦',
        items: [
          '装有 iOS 26 的 iPhone',
          'iPhone 配备 USB-C 充电线 (1 米)',
          '文档'
        ]
      }
    ],
    image_og: 'images/iphone/iphone-17-hero.jpg'
  }
};

// 更新 iPhone 17
if (specs.iPhone规格集['iPhone 17']) {
  const data = allSpecs['iPhone 17'];
  specs.iPhone规格集['iPhone 17'].official_data = {
    source: 'Apple CN official compare page',
    specs_page: 'https://www.apple.com.cn/iphone-17/specs/',
    compare_page: 'https://www.apple.com.cn/iphone/compare/',
    fetched_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    sections: data.sections,
    image_og: data.image_og
  };
  console.log(`✓ iPhone 17: ${data.sections.length} 个分类，图标已添加`);
}

fs.writeFileSync(specsPath, JSON.stringify(specs, null, 2));
console.log('\n✅ iPhone 17 详细规格已更新并保存');
