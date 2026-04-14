// 为旧 iPhone 型号补齐到 22 分类
const fs = require('fs');
const path = require('path');

const specsPath = path.join(__dirname, 'specs.json');
const specs = JSON.parse(fs.readFileSync(specsPath, 'utf8'));

// 从 iPhone 17 复制一个完整的 22 分类模板，然后修改
const template = [
  { title: "🎨 外观", items: [] },
  { title: "💾 容量", items: [] },
  { title: "📐 尺寸与重量", items: [] },
  { title: "📱 显示屏", items: [] },
  { title: "💧 防溅抗水防尘", items: [] },
  { title: "⚡ 芯片", items: [] },
  { title: "🧠 Apple 智能", items: ["不支持"] },
  { title: "📷 摄像头", items: [] },
  { title: "🎬 视频拍摄", items: [] },
  { title: "🤳 前置摄像头", items: [] },
  { title: "🔋 电源和电池", items: [] },
  { title: "🔌 充电接口", items: [] },
  { title: "👤 生物识别", items: [] },
  { title: "🛡️ 安全功能", items: ["SOS 紧急联络", "查找我的 iPhone"] },
  { title: "📡 蜂窝网络和连接", items: [] },
  { title: "🔮 无线充电", items: [] },
  { title: "📍 定位", items: ["精确位置 (支持 GPS、GLONASS、Galileo、QZSS 和 BeiDou)", "指南针", "通过 Wi-Fi 和蜂窝网络定位"] },
  { title: "📦 在盒内的配件", items: [] },
  { title: "🌍 操作环境", items: ["工作环境温度：0°C 至 35°C (32°F 至 95°F)", "非工作温度：−20°C 至 45°C (−4°F 至 113°F)", "相对湿度：5% 至 95%，无凝结", "工作高度最高测试：3000 米 (10000 英尺)"] },
  { title: "🌱 环保特性", items: ["采用再生材料制造", "再生铝金属外壳", "再生稀土元素"] },
  { title: "🌐 语言支持", items: ["简体中文、繁体中文、英文、法文、德文、日文、韩文等", "支持多种语言同时使用"] },
  { title: "🔘 按键与接口", items: [] },
];

function updateModel(key, updateFn) {
  const model = specs.iPhone规格集[key];
  if (!model) return;
  
  const existing = model.official_data?.sections || [];
  const newSections = template.map(t => {
    const existingSection = existing.find(e => e.title === t.title);
    if (existingSection) return existingSection;
    return { ...t };
  });
  
  updateFn(newSections);
  
  if (!model.official_data) model.official_data = {};
  model.official_data.sections = newSections;
  model.official_data.source = model.official_data.source || 'Apple CN';
  model.official_data.specs_page = model.official_data.specs_page || 'https://www.apple.com.cn/iphone/compare/';
}

// iPhone X
updateModel('iPhone X', (sections) => {
  sections[0].items = ["深空灰色、银色", "不锈钢边框", "玻璃背板"];
  sections[1].items = ["64GB", "256GB"];
  sections[2].items = ["高度：143.6 毫米 (5.65 英寸)", "宽度：70.9 毫米 (2.79 英寸)", "厚度：7.7 毫米 (0.30 英寸)", "重量：174 克 (6.14 盎司)"];
  sections[3].items = ["Super Retina HD 显示屏", "5.8 英寸 (对角线) OLED 全面屏", "2436 x 1125 像素分辨率，458 ppi", "HDR 显示", "原彩显示", "广色域 (P3)", "触感触控", "对比度：1,000,000:1", "最高亮度：625 尼特"];
  sections[4].items = ["在最深 1 米的水下停留时间最长可达 30 分钟", "防溅、抗水 (IP67)"];
  sections[5].items = ["A11 仿生芯片", "6 核中央处理器", "3 核图形处理器", "神经网络引擎"];
  sections[7].items = ["1200 万像素广角摄像头，ƒ/1.8 光圈", "1200 万像素长焦摄像头，ƒ/2.4 光圈", "光学变焦 2 倍", "光学图像防抖", "人像模式", "人像光效"];
  sections[8].items = ["4K 视频拍摄，24 fps、30 fps 或 60 fps", "1080p 高清视频拍摄，30 fps 或 60 fps", "1080p 慢动作视频，120 fps 或 240 fps", "影院级视频防抖", "立体声录制"];
  sections[9].items = ["700 万像素摄像头", "ƒ/2.2 光圈", "1080p 视频拍摄", "人像模式", "人像光效", "影院级视频防抖"];
  sections[10].items = ["视频播放最长可达 13 小时", "音频播放最长可达 60 小时", "内置锂离子充电电池", "Qi 无线充电"];
  sections[11].items = ["闪电接口 (Lightning)", "USB 2.0 速度"];
  sections[12].items = ["不支持面容 ID", "通过原深感摄像头启用人脸识别"];
  sections[14].items = ["千兆级 LTE", "Wi-Fi 802.11ac", "蓝牙 5.0", "NFC", "eSIM 支持"];
  sections[15].items = ["Qi 无线充电，最高可达 7.5W"];
  sections[17].items = ["iPhone", "EarPods (闪电接口)", "闪电接口转 3.5 毫米耳机插孔转换器", "USB 电源适配器", "闪电接口转 USB 连接线"];
  sections[21].items = ["侧边按钮", "音量按钮", "静音开关", "闪电接口", "扬声器", "麦克风"];
});

// iPhone XS
updateModel('iPhone XS', (sections) => {
  sections[0].items = ["深空灰色、银色、金色", "不锈钢边框", "玻璃背板"];
  sections[1].items = ["64GB", "256GB", "512GB"];
  sections[2].items = ["高度：143.6 毫米 (5.65 英寸)", "宽度：70.9 毫米 (2.79 英寸)", "厚度：7.7 毫米 (0.30 英寸)", "重量：177 克 (6.24 盎司)"];
  sections[3].items = ["Super Retina HD 显示屏", "5.8 英寸 (对角线) OLED 全面屏", "2436 x 1125 像素分辨率，458 ppi", "HDR 显示", "原彩显示", "广色域 (P3)", "触感触控", "对比度：1,000,000:1", "最高亮度：625 尼特"];
  sections[4].items = ["在最深 2 米的水下停留时间最长可达 30 分钟", "防溅、抗水 (IP68)"];
  sections[5].items = ["A12 仿生芯片", "6 核中央处理器", "4 核图形处理器", "神经网络引擎"];
  sections[7].items = ["1200 万像素广角摄像头，ƒ/1.8 光圈", "1200 万像素长焦摄像头，ƒ/2.4 光圈", "光学变焦 2 倍", "光学图像防抖", "人像模式", "智能 HDR"];
  sections[8].items = ["4K 视频拍摄，24 fps、30 fps 或 60 fps", "1080p 高清视频拍摄，30 fps 或 60 fps", "1080p 慢动作视频，120 fps 或 240 fps", "影院级视频防抖", "立体声录制"];
  sections[9].items = ["700 万像素原深感摄像头", "ƒ/2.2 光圈", "1080p 视频拍摄", "人像模式", "智能 HDR"];
  sections[10].items = ["视频播放最长可达 14 小时", "音频播放最长可达 65 小时", "内置锂离子充电电池", "Qi 无线充电", "快充支持"];
  sections[11].items = ["闪电接口 (Lightning)", "USB 2.0 速度"];
  sections[12].items = ["面容 ID", "通过原深感摄像头启用人脸识别"];
  sections[14].items = ["千兆级 LTE", "Wi-Fi 802.11ac", "蓝牙 5.0", "NFC", "eSIM 支持"];
  sections[15].items = ["Qi 无线充电，最高可达 7.5W"];
  sections[17].items = ["iPhone", "EarPods (闪电接口)", "闪电接口转 3.5 毫米耳机插孔转换器", "USB 电源适配器", "闪电接口转 USB 连接线"];
  sections[21].items = ["侧边按钮", "音量按钮", "静音开关", "闪电接口", "扬声器", "麦克风"];
});

// iPhone XS Max
updateModel('iPhone XS Max', (sections) => {
  sections[0].items = ["深空灰色、银色、金色", "不锈钢边框", "玻璃背板"];
  sections[1].items = ["64GB", "256GB", "512GB"];
  sections[2].items = ["高度：157.5 毫米 (6.20 英寸)", "宽度：77.4 毫米 (3.05 英寸)", "厚度：7.7 毫米 (0.30 英寸)", "重量：208 克 (7.34 盎司)"];
  sections[3].items = ["Super Retina HD 显示屏", "6.5 英寸 (对角线) OLED 全面屏", "2688 x 1242 像素分辨率，458 ppi", "HDR 显示", "原彩显示", "广色域 (P3)", "触感触控", "对比度：1,000,000:1", "最高亮度：625 尼特"];
  sections[4].items = ["在最深 2 米的水下停留时间最长可达 30 分钟", "防溅、抗水 (IP68)"];
  sections[5].items = ["A12 仿生芯片", "6 核中央处理器", "4 核图形处理器", "神经网络引擎"];
  sections[7].items = ["1200 万像素广角摄像头，ƒ/1.8 光圈", "1200 万像素长焦摄像头，ƒ/2.4 光圈", "光学变焦 2 倍", "光学图像防抖", "人像模式", "智能 HDR"];
  sections[8].items = ["4K 视频拍摄，24 fps、30 fps 或 60 fps", "1080p 高清视频拍摄，30 fps 或 60 fps", "1080p 慢动作视频，120 fps 或 240 fps", "影院级视频防抖", "立体声录制"];
  sections[9].items = ["700 万像素原深感摄像头", "ƒ/2.2 光圈", "1080p 视频拍摄", "人像模式", "智能 HDR"];
  sections[10].items = ["视频播放最长可达 15 小时", "音频播放最长可达 70 小时", "内置锂离子充电电池", "Qi 无线充电", "快充支持"];
  sections[11].items = ["闪电接口 (Lightning)", "USB 2.0 速度"];
  sections[12].items = ["面容 ID", "通过原深感摄像头启用人脸识别"];
  sections[14].items = ["千兆级 LTE", "Wi-Fi 802.11ac", "蓝牙 5.0", "NFC", "eSIM 支持"];
  sections[15].items = ["Qi 无线充电，最高可达 7.5W"];
  sections[17].items = ["iPhone", "EarPods (闪电接口)", "闪电接口转 3.5 毫米耳机插孔转换器", "USB 电源适配器", "闪电接口转 USB 连接线"];
  sections[21].items = ["侧边按钮", "音量按钮", "静音开关", "闪电接口", "扬声器", "麦克风"];
});

// iPhone XR
updateModel('iPhone XR', (sections) => {
  sections[0].items = ["黑色、白色、蓝色、黄色、珊瑚色、红色", "铝合金边框", "玻璃背板"];
  sections[1].items = ["64GB", "128GB", "256GB"];
  sections[2].items = ["高度：150.9 毫米 (5.94 英寸)", "宽度：75.7 毫米 (2.98 英寸)", "厚度：8.3 毫米 (0.33 英寸)", "重量：194 克 (6.84 盎司)"];
  sections[3].items = ["Liquid Retina HD 显示屏", "6.1 英寸 (对角线) LCD 全面屏", "1792 x 828 像素分辨率，326 ppi", "原彩显示", "广色域 (P3)", "触感触控", "对比度：1400:1", "最高亮度：625 尼特"];
  sections[4].items = ["在最深 1 米的水下停留时间最长可达 30 分钟", "防溅、抗水 (IP67)"];
  sections[5].items = ["A12 仿生芯片", "6 核中央处理器", "4 核图形处理器", "神经网络引擎"];
  sections[7].items = ["1200 万像素广角摄像头，ƒ/1.8 光圈", "光学图像防抖", "人像模式", "智能 HDR"];
  sections[8].items = ["4K 视频拍摄，24 fps、30 fps 或 60 fps", "1080p 高清视频拍摄，30 fps 或 60 fps", "1080p 慢动作视频，120 fps 或 240 fps", "影院级视频防抖", "立体声录制"];
  sections[9].items = ["700 万像素原深感摄像头", "ƒ/2.2 光圈", "1080p 视频拍摄", "人像模式", "智能 HDR"];
  sections[10].items = ["视频播放最长可达 15 小时", "音频播放最长可达 65 小时", "内置锂离子充电电池", "Qi 无线充电", "快充支持"];
  sections[11].items = ["闪电接口 (Lightning)", "USB 2.0 速度"];
  sections[12].items = ["面容 ID", "通过原深感摄像头启用人脸识别"];
  sections[14].items = ["千兆级 LTE", "Wi-Fi 802.11ac", "蓝牙 5.0", "NFC", "eSIM 支持"];
  sections[15].items = ["Qi 无线充电，最高可达 7.5W"];
  sections[17].items = ["iPhone", "EarPods (闪电接口)", "闪电接口转 3.5 毫米耳机插孔转换器", "USB 电源适配器", "闪电接口转 USB 连接线"];
  sections[21].items = ["侧边按钮", "音量按钮", "静音开关", "闪电接口", "扬声器", "麦克风"];
});

// iPhone 8
updateModel('iPhone 8', (sections) => {
  sections[0].items = ["深空灰色、银色、金色", "铝合金边框", "玻璃背板"];
  sections[1].items = ["64GB", "256GB"];
  sections[2].items = ["高度：138.4 毫米 (5.45 英寸)", "宽度：67.3 毫米 (2.65 英寸)", "厚度：7.3 毫米 (0.29 英寸)", "重量：148 克 (5.22 盎司)"];
  sections[3].items = ["Retina HD 显示屏", "4.7 英寸 (对角线) LCD", "1334 x 750 像素分辨率，326 ppi", "原彩显示", "广色域 (P3)", "触感触控", "对比度：1400:1", "最高亮度：625 尼特"];
  sections[4].items = ["防溅、抗水、防尘 (IP67)"];
  sections[5].items = ["A11 仿生芯片", "6 核中央处理器", "3 核图形处理器", "神经网络引擎"];
  sections[7].items = ["1200 万像素广角摄像头，ƒ/1.8 光圈", "光学图像防抖", "人像模式"];
  sections[8].items = ["4K 视频拍摄，24 fps、30 fps 或 60 fps", "1080p 高清视频拍摄，30 fps 或 60 fps", "1080p 慢动作视频，120 fps 或 240 fps", "影院级视频防抖"];
  sections[9].items = ["700 万像素 FaceTime 高清摄像头", "ƒ/2.2 光圈", "1080p 视频拍摄", "影院级视频防抖"];
  sections[10].items = ["视频播放最长可达 13 小时", "音频播放最长可达 50 小时", "内置锂离子充电电池", "Qi 无线充电", "快充支持"];
  sections[11].items = ["闪电接口 (Lightning)", "USB 2.0 速度"];
  sections[12].items = ["触控 ID", "通过 Touch ID 启用指纹识别"];
  sections[14].items = ["千兆级 LTE", "Wi-Fi 802.11ac", "蓝牙 5.0", "NFC"];
  sections[15].items = ["Qi 无线充电，最高可达 7.5W"];
  sections[17].items = ["iPhone", "EarPods (闪电接口)", "闪电接口转 3.5 毫米耳机插孔转换器", "USB 电源适配器", "闪电接口转 USB 连接线"];
  sections[21].items = ["主屏幕按钮 (触控 ID)", "静音开关", "闪电接口", "扬声器", "麦克风"];
});

// iPhone 8 Plus
updateModel('iPhone 8 Plus', (sections) => {
  sections[0].items = ["深空灰色、银色、金色", "铝合金边框", "玻璃背板"];
  sections[1].items = ["64GB", "256GB"];
  sections[2].items = ["高度：158.4 毫米 (6.24 英寸)", "宽度：78.1 毫米 (3.07 英寸)", "厚度：7.5 毫米 (0.30 英寸)", "重量：202 克 (7.13 盎司)"];
  sections[3].items = ["Retina HD 显示屏", "5.5 英寸 (对角线) LCD", "1920 x 1080 像素分辨率，401 ppi", "原彩显示", "广色域 (P3)", "触感触控", "对比度：1300:1", "最高亮度：625 尼特"];
  sections[4].items = ["防溅、抗水、防尘 (IP67)"];
  sections[5].items = ["A11 仿生芯片", "6 核中央处理器", "3 核图形处理器", "神经网络引擎"];
  sections[7].items = ["1200 万像素广角摄像头，ƒ/1.8 光圈", "1200 万像素长焦摄像头，ƒ/2.8 光圈", "光学变焦 2 倍", "光学图像防抖", "人像模式"];
  sections[8].items = ["4K 视频拍摄，24 fps、30 fps 或 60 fps", "1080p 高清视频拍摄，30 fps 或 60 fps", "1080p 慢动作视频，120 fps 或 240 fps", "影院级视频防抖"];
  sections[9].items = ["700 万像素 FaceTime 高清摄像头", "ƒ/2.2 光圈", "1080p 视频拍摄", "影院级视频防抖"];
  sections[10].items = ["视频播放最长可达 14 小时", "音频播放最长可达 60 小时", "内置锂离子充电电池", "Qi 无线充电", "快充支持"];
  sections[11].items = ["闪电接口 (Lightning)", "USB 2.0 速度"];
  sections[12].items = ["触控 ID", "通过 Touch ID 启用指纹识别"];
  sections[14].items = ["千兆级 LTE", "Wi-Fi 802.11ac", "蓝牙 5.0", "NFC"];
  sections[15].items = ["Qi 无线充电，最高可达 7.5W"];
  sections[17].items = ["iPhone", "EarPods (闪电接口)", "闪电接口转 3.5 毫米耳机插孔转换器", "USB 电源适配器", "闪电接口转 USB 连接线"];
  sections[21].items = ["主屏幕按钮 (触控 ID)", "静音开关", "闪电接口", "扬声器", "麦克风"];
});

// iPhone SE (第二代)
updateModel('iPhone SE (第二代)', (sections) => {
  sections[0].items = ["黑色、白色、红色", "铝合金边框", "玻璃背板"];
  sections[1].items = ["64GB", "128GB", "256GB"];
  sections[2].items = ["高度：138.4 毫米 (5.45 英寸)", "宽度：67.3 毫米 (2.65 英寸)", "厚度：7.3 毫米 (0.29 英寸)", "重量：148 克 (5.22 盎司)"];
  sections[3].items = ["Retina HD 显示屏", "4.7 英寸 (对角线) LCD", "1334 x 750 像素分辨率，326 ppi", "原彩显示", "广色域 (P3)", "触感触控", "对比度：1400:1", "最高亮度：625 尼特"];
  sections[4].items = ["防溅、抗水、防尘 (IP67)"];
  sections[5].items = ["A13 仿生芯片", "6 核中央处理器", "4 核图形处理器", "神经网络引擎"];
  sections[7].items = ["1200 万像素广角摄像头，ƒ/1.8 光圈", "光学图像防抖", "人像模式", "智能 HDR"];
  sections[8].items = ["4K 视频拍摄，24 fps、30 fps 或 60 fps", "1080p 高清视频拍摄，30 fps 或 60 fps", "1080p 慢动作视频，120 fps 或 240 fps", "影院级视频防抖", "立体声录制"];
  sections[9].items = ["700 万像素 FaceTime 高清摄像头", "ƒ/2.2 光圈", "1080p 视频拍摄", "影院级视频防抖"];
  sections[10].items = ["视频播放最长可达 13 小时", "音频播放最长可达 40 小时", "内置锂离子充电电池", "Qi 无线充电", "快充支持"];
  sections[11].items = ["闪电接口 (Lightning)", "USB 2.0 速度"];
  sections[12].items = ["触控 ID", "通过 Touch ID 启用指纹识别"];
  sections[14].items = ["千兆级 LTE", "Wi-Fi 6 (802.11ax)", "蓝牙 5.0", "NFC"];
  sections[15].items = ["Qi 无线充电，最高可达 7.5W"];
  sections[17].items = ["iPhone", "EarPods (闪电接口)", "闪电接口转 3.5 毫米耳机插孔转换器", "USB 电源适配器", "闪电接口转 USB 连接线"];
  sections[21].items = ["主屏幕按钮 (触控 ID)", "静音开关", "闪电接口", "扬声器", "麦克风"];
});

fs.writeFileSync(specsPath, JSON.stringify(specs, null, 2), 'utf8');
console.log('✅ 所有旧 iPhone 型号已补齐到 22 分类！');
