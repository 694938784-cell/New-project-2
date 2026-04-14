// 为 iPad 和 MacBook 生成完整规格数据
const fs = require('fs');
const path = require('path');

const specsPath = path.join(__dirname, 'specs.json');
const specs = JSON.parse(fs.readFileSync(specsPath, 'utf8'));

if (!specs.iPad规格集) specs.iPad规格集 = {};
if (!specs.MacBook规格集) specs.MacBook规格集 = {};
if (!specs.Watch规格集) specs.Watch规格集 = {};

// iPad Pro M4 规格
const ipadProSections = [
  { title: "🎨 外观", items: ["深空黑色、银色", "铝合金外壳", "超瓷晶面板 (正面)"] },
  { title: "💾 容量", items: ["256GB", "512GB", "1TB", "2TB"] },
  { title: "📐 尺寸与重量 (11英寸)", items: ["高度：249.7 毫米", "宽度：177.5 毫米", "厚度：5.3 毫米", "重量：444 克 (Wi-Fi)"] },
  { title: "📐 尺寸与重量 (13英寸)", items: ["高度：280.6 毫米", "宽度：214.9 毫米", "厚度：5.1 毫米", "重量：579 克 (Wi-Fi)"] },
  { title: "📱 显示屏 (11英寸)", items: ["超视网膜 XDR 显示屏", "11英寸 (对角线) Liquid Retina XDR", "2420 x 1668像素分辨率，264 ppi", "ProMotion 自适应刷新率，最高120Hz", "全天候显示", "原彩显示", "广色域 (P3)", "峰值亮度：1600 尼特 (HDR)"] },
  { title: "📱 显示屏 (13英寸)", items: ["超视网膜 XDR 显示屏", "13英寸 (对角线) Liquid Retina XDR", "2752 x 2064像素分辨率，264 ppi", "ProMotion 自适应刷新率，最高120Hz", "全天候显示", "原彩显示", "广色域 (P3)", "峰值亮度：1600 尼特 (HDR)"] },
  { title: "⚡ 芯片", items: ["M4 芯片", "9核中央处理器", "10核图形处理器", "16核神经网络引擎"] },
  { title: "📷 摄像头", items: ["1200 万像素广角摄像头", "ƒ/1.8 光圈", "数码变焦最高可达 5倍", "五片式镜头", "自动对焦", "智能 HDR 4"] },
  { title: "🤳 前置摄像头", items: ["1200 万像素超广角摄像头", "ƒ/2.4 光圈", "122° 视角", "Center Stage", "人像模式"] },
  { title: "🔋 电池", items: ["内置 28.93 瓦时锂电池", "上网最长可达 10 小时", "视频播放最长可达 10 小时", "使用 USB-C 连接充电"] },
  { title: "🔌 连接", items: ["USB-C 接口 (支持 USB 4 / Thunderbolt)", "Wi-Fi 6E", "蓝牙 5.3", "可选配 5G"] },
  { title: "👤 面容 ID", items: ["通过原深感摄像头启用人脸识别"] },
  { title: "📦 在盒内的配件", items: ["iPad Pro", "USB-C 充电线", "20W USB-C 电源适配器"] },
];

// iPad Air M2 规格
const ipadAirSections = [
  { title: "🎨 外观", items: ["星光色、午夜色、紫色、蓝色", "铝合金外壳"] },
  { title: "💾 容量", items: ["128GB", "256GB", "512GB", "1TB"] },
  { title: "📐 尺寸与重量 (11英寸)", items: ["高度：247.6 毫米", "宽度：178.5 毫米", "厚度：6.1 毫米", "重量：462 克"] },
  { title: "📐 尺寸与重量 (13英寸)", items: ["高度：280.6 毫米", "宽度：214.9 毫米", "厚度：6.1 毫米", "重量：617 克"] },
  { title: "📱 显示屏 (11英寸)", items: ["Liquid Retina 显示屏", "11英寸 (对角线) IPS", "2360 x 1640像素分辨率，264 ppi", "原彩显示", "广色域 (P3)", "500 尼特亮度"] },
  { title: "📱 显示屏 (13英寸)", items: ["Liquid Retina 显示屏", "13英寸 (对角线) IPS", "2732 x 2048像素分辨率，264 ppi", "原彩显示", "广色域 (P3)", "500 尼特亮度"] },
  { title: "⚡ 芯片", items: ["M2 芯片", "8核中央处理器", "10核图形处理器", "16核神经网络引擎"] },
  { title: "📷 摄像头", items: ["1200 万像素广角摄像头", "ƒ/1.8 光圈", "数码变焦最高可达 5倍"] },
  { title: "🤳 前置摄像头", items: ["1200 万像素超广角摄像头", "ƒ/2.4 光圈", "Center Stage", "人像模式"] },
  { title: "🔋 电池", items: ["内置 28.6 瓦时锂电池", "上网最长可达 10 小时", "视频播放最长可达 10 小时"] },
  { title: "🔌 连接", items: ["USB-C 接口", "Wi-Fi 6E", "蓝牙 5.3", "可选配 5G"] },
  { title: "🔘 按键", items: ["顶部按钮", "音量按钮"] },
  { title: "📦 在盒内的配件", items: ["iPad Air", "USB-C 充电线", "20W USB-C 电源适配器"] },
];

// iPad 第十代 规格
const ipadSections = [
  { title: "🎨 外观", items: ["银色、蓝色、粉色、黄色", "铝合金外壳"] },
  { title: "💾 容量", items: ["64GB", "256GB"] },
  { title: "📐 尺寸与重量", items: ["高度：248.6 毫米", "宽度：179.5 毫米", "厚度：7 毫米", "重量：477 克"] },
  { title: "📱 显示屏", items: ["Liquid Retina 显示屏", "10.9英寸 (对角线) IPS", "2360 x 1640像素分辨率，264 ppi", "原彩显示", "广色域 (P3)", "500 尼特亮度"] },
  { title: "⚡ 芯片", items: ["A14 仿生芯片", "6核中央处理器", "4核图形处理器", "16核神经网络引擎"] },
  { title: "📷 摄像头", items: ["1200 万像素广角摄像头", "ƒ/1.8 光圈", "智能 HDR 3"] },
  { title: "🤳 前置摄像头", items: ["1200 万像素超广角摄像头", "ƒ/2.4 光圈", "Center Stage"] },
  { title: "🔋 电池", items: ["内置 28.6 瓦时锂电池", "上网最长可达 10 小时"] },
  { title: "🔌 连接", items: ["USB-C 接口", "Wi-Fi 6", "蓝牙 5.2", "可选配 5G"] },
  { title: "📦 在盒内的配件", items: ["iPad", "USB-C 充电线", "20W USB-C 电源适配器"] },
];

// iPad mini A17 Pro 规格
const ipadMiniSections = [
  { title: "🎨 外观", items: ["星光色、紫色、蓝色", "铝合金外壳"] },
  { title: "💾 容量", items: ["128GB", "256GB", "512GB"] },
  { title: "📐 尺寸与重量", items: ["高度：195.4 毫米", "宽度：134.8 毫米", "厚度：6.3 毫米", "重量：293 克"] },
  { title: "📱 显示屏", items: ["Liquid Retina 显示屏", "8.3英寸 (对角线) IPS", "2266 x 1488像素分辨率，326 ppi", "原彩显示", "广色域 (P3)", "500 尼特亮度"] },
  { title: "⚡ 芯片", items: ["A17 Pro 芯片", "6核中央处理器", "5核图形处理器", "16核神经网络引擎"] },
  { title: "📷 摄像头", items: ["1200 万像素广角摄像头", "ƒ/1.8 光圈", "智能 HDR 4"] },
  { title: "🤳 前置摄像头", items: ["1200 万像素超广角摄像头", "ƒ/2.4 光圈", "Center Stage"] },
  { title: "🔋 电池", items: ["内置 19.3 瓦时锂电池", "上网最长可达 10 小时"] },
  { title: "🔌 连接", items: ["USB-C 接口 (USB 3.1)", "Wi-Fi 6E", "蓝牙 5.3", "可选配 5G"] },
  { title: "📦 在盒内的配件", items: ["iPad mini", "USB-C 充电线"] },
];

// MacBook Air M3 规格
const macbookAirSections = [
  { title: "🎨 外观", items: ["午夜色、星光色、深空灰色、银色", "铝合金外壳"] },
  { title: "💾 容量", items: ["256GB", "512GB", "1TB", "2TB"] },
  { title: "📐 尺寸与重量 (13英寸)", items: ["高度：1.13 厘米", "宽度：30.41 厘米", "深度：21.5 厘米", "重量：1.24 千克"] },
  { title: "📐 尺寸与重量 (15英寸)", items: ["高度：1.15 厘米", "宽度：34.04 厘米", "深度：23.76 厘米", "重量：1.51 千克"] },
  { title: "📱 显示屏 (13英寸)", items: ["Liquid Retina 显示屏", "13.6英寸 (对角线) LED", "2560 x 1664像素分辨率，224 ppi", "原彩显示", "广色域 (P3)", "500 尼特亮度"] },
  { title: "📱 显示屏 (15英寸)", items: ["Liquid Retina 显示屏", "15.3英寸 (对角线) LED", "2880 x 1864像素分辨率，224 ppi", "原彩显示", "广色域 (P3)", "500 尼特亮度"] },
  { title: "⚡ 芯片", items: ["M3 芯片", "8核中央处理器", "8核/10核图形处理器", "16核神经网络引擎"] },
  { title: "📷 摄像头", items: ["1080p FaceTime 高清摄像头", "ƒ/2.0 光圈"] },
  { title: "🔋 电池", items: ["内置 52.6 瓦时锂电池 (13寸)", "内置 66.5 瓦时锂电池 (15寸)", "无线上网最长可达 15 小时", "视频播放最长可达 18 小时", "MagSafe 3 充电口"] },
  { title: "🔌 连接", items: ["MagSafe 3 充电口", "3.5mm 耳机插孔", "两个雷雳 / USB 4 端口", "Wi-Fi 6E", "蓝牙 5.3"] },
  { title: "🔘 键盘与触控板", items: ["背光妙控键盘", "触控 ID", "力度触控触控板"] },
  { title: "📦 在盒内的配件", items: ["MacBook Air", "MagSafe 3 充电线", "30W/35W/70W USB-C 电源适配器"] },
];

// MacBook Pro M4 规格
const macbookProSections = [
  { title: "🎨 外观", items: ["深空黑色、银色", "铝合金外壳"] },
  { title: "💾 容量", items: ["512GB", "1TB", "2TB", "4TB", "8TB"] },
  { title: "📐 尺寸与重量 (14英寸)", items: ["高度：1.55 厘米", "宽度：31.26 厘米", "深度：22.12 厘米", "重量：1.55 千克"] },
  { title: "📐 尺寸与重量 (16英寸)", items: ["高度：1.68 厘米", "宽度：35.57 厘米", "深度：24.81 厘米", "重量：2.14 千克"] },
  { title: "📱 显示屏 (14英寸)", items: ["Liquid Retina XDR 显示屏", "14.2英寸 (对角线) Mini-LED", "3024 x 1964像素分辨率，254 ppi", "ProMotion 自适应刷新率，最高120Hz", "原彩显示", "广色域 (P3)", "峰值亮度：1600 尼特 (HDR)", "1,000,000:1 对比度"] },
  { title: "📱 显示屏 (16英寸)", items: ["Liquid Retina XDR 显示屏", "16.2英寸 (对角线) Mini-LED", "3456 x 2234像素分辨率，254 ppi", "ProMotion 自适应刷新率，最高120Hz", "原彩显示", "广色域 (P3)", "峰值亮度：1600 尼特 (HDR)"] },
  { title: "⚡ 芯片", items: ["M4 / M4 Pro / M4 Max 芯片", "10/12/14/16核中央处理器", "10/16/32/40核图形处理器", "16核神经网络引擎"] },
  { title: "📷 摄像头", items: ["1080p FaceTime 高清摄像头", "ƒ/2.0 光圈", "高级图像处理"] },
  { title: "🔋 电池", items: ["内置 70 瓦时锂电池 (14寸)", "内置 100 瓦时锂电池 (16寸)", "无线上网最长可达 17 小时", "视频播放最长可达 22 小时", "MagSafe 3 充电口"] },
  { title: "🔌 连接", items: ["MagSafe 3 充电口", "3.5mm 耳机插孔 (支持高阻抗耳机)", "HDMI 端口", "SDXC 卡槽", "三个雷雳 4 / USB 4 端口", "Wi-Fi 6E", "蓝牙 5.3"] },
  { title: "🔘 键盘与触控板", items: ["背光妙控键盘", "触控 ID", "力度触控触控板"] },
  { title: "📦 在盒内的配件", items: ["MacBook Pro", "MagSafe 3 充电线", "70W/96W/140W USB-C 电源适配器"] },
];

// Apple Watch 规格
const watchUltraSections = [
  { title: "🎨 外观", items: ["天然色、蓝色、黑色", "钛金属外壳", "平面蓝宝石玻璃"] },
  { title: "📐 尺寸与重量", items: ["高度：49 毫米", "宽度：44 毫米", "厚度：14.4 毫米", "重量：61.4 克"] },
  { title: "📱 显示屏", items: ["全天候 Retina LTPO OLED", "49 毫米 (对角线)", "2000 尼特峰值亮度", "1 尼特最低亮度"] },
  { title: "⚡ 芯片", items: ["S9 SiP 芯片", "64位双核处理器", "4核神经网络引擎"] },
  { title: "🔋 电池", items: ["内置 567 毫安时锂电池", "正常使用最长 36 小时", "低电量模式最长 72 小时"] },
  { title: "💧 防水", items: ["WR100 防水", "EN 13319 认证", "最深 100 米"] },
  { title: "🔌 连接", items: ["蓝牙 5.3", "Wi-Fi 4", "超宽带芯片", "LTE / UMTS"] },
  { title: "📍 定位", items: ["精确 GPS (L1/L5)", "指南针", "气压高度计", "水深仪"] },
  { title: "📦 在盒内的配件", items: ["Apple Watch Ultra", "Ocean 表带"] },
];

const watchSeriesSections = [
  { title: "🎨 外观", items: ["午夜色、星光色、银色、红色", "铝合金外壳"] },
  { title: "📐 尺寸与重量 (41mm)", items: ["高度：41 毫米", "宽度：35 毫米", "厚度：10.7 毫米", "重量：31.9 克"] },
  { title: "📐 尺寸与重量 (45mm)", items: ["高度：45 毫米", "宽度：38 毫米", "厚度：10.7 毫米", "重量：38.7 克"] },
  { title: "📱 显示屏", items: ["全天候 Retina LTPO OLED", "1000 尼特峰值亮度", "1 尼特最低亮度"] },
  { title: "⚡ 芯片", items: ["S9 SiP 芯片", "64位双核处理器"] },
  { title: "🔋 电池", items: ["正常使用最长 18 小时", "低电量模式最长 36 小时", "快充支持"] },
  { title: "💧 防水", items: ["WR50 防水"] },
  { title: "🔌 连接", items: ["蓝牙 5.3", "Wi-Fi 4", "超宽带芯片"] },
  { title: "📦 在盒内的配件", items: ["Apple Watch", "运动表带"] },
];

// 添加到 specs.json
specs.iPad规格集["iPad Pro"] = { official_data: { sections: ipadProSections } };
specs.iPad规格集["iPad Air"] = { official_data: { sections: ipadAirSections } };
specs.iPad规格集["iPad"] = { official_data: { sections: ipadSections } };
specs.iPad规格集["iPad mini"] = { official_data: { sections: ipadMiniSections } };

specs.MacBook规格集["MacBook Air"] = { official_data: { sections: macbookAirSections } };
specs.MacBook规格集["MacBook Pro"] = { official_data: { sections: macbookProSections } };

specs.Watch规格集["Apple Watch Ultra"] = { official_data: { sections: watchUltraSections } };
specs.Watch规格集["Apple Watch"] = { official_data: { sections: watchSeriesSections } };

fs.writeFileSync(specsPath, JSON.stringify(specs, null, 2), 'utf8');
console.log('✅ iPad、MacBook、Apple Watch 规格数据已更新！');
console.log('- iPad Pro: ' + ipadProSections.length + ' 分类');
console.log('- iPad Air: ' + ipadAirSections.length + ' 分类');
console.log('- iPad: ' + ipadSections.length + ' 分类');
console.log('- iPad mini: ' + ipadMiniSections.length + ' 分类');
console.log('- MacBook Air: ' + macbookAirSections.length + ' 分类');
console.log('- MacBook Pro: ' + macbookProSections.length + ' 分类');
console.log('- Watch Ultra: ' + watchUltraSections.length + ' 分类');
console.log('- Watch Series: ' + watchSeriesSections.length + ' 分类');
