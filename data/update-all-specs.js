const fs = require('fs');
const path = require('path');

// 读取 specs.json
const specsPath = path.join(__dirname, 'specs.json');
let specsData = JSON.parse(fs.readFileSync(specsPath, 'utf8'));

// 通用规格分类模板
const specCategoriesTemplate = [
    { title: '🎨 外观', icon: '🎨', lines: ['银色', '深空灰色', '金色', '石墨色'] },
    { title: '💾 容量', icon: '💾', lines: ['128GB', '256GB', '512GB', '1TB'] },
    { title: '📐 尺寸与重量', icon: '📐', lines: ['高度：xx mm', '宽度：xx mm', '厚度：xx mm', '重量：xx g'] },
    { title: '💧 防溅抗水防尘', icon: '💧', lines: ['等级：IPXX'] },
    { title: '⚡ 芯片', icon: '⚡', lines: ['M4 芯片', 'X核中央处理器', 'X核图形处理器', '神经网络引擎'] },
    { title: '🧠 Apple 智能', icon: '🧠', lines: ['支持个性化智能功能', '支持智能写作'] },
    { title: '📱 显示屏', icon: '📱', lines: ['Liquid Retina 显示屏', 'XX 英寸 (对角线)', 'OLED 全面屏', '2732 x 2048 像素分辨率', '500 nits 亮度 (典型)'] },
    { title: '📷 摄像头', icon: '📷', lines: ['双摄像头系统', '1200 万像素广角镜头', '1200 万像素超广角镜头', '2 倍光学变焦 (放大)'] },
    { title: '🎬 视频拍摄', icon: '🎬', lines: ['4K 视频拍摄', '电影效果模式', '扩展动态范围', '延时摄影'] },
    { title: '🤳 前置摄像头', icon: '🤳', lines: ['1200 万像素超广角摄像头', 'TrueDepth 摄像头', '人像光效'] },
    { title: '🔋 电源和电池', icon: '🔋', lines: ['使用时间长达 XX 小时', '无线充电', 'MagSafe 无线充电'] },
    { title: '🔌 USB-C', icon: '🔌', lines: ['高速数据传输', '视频输出'] },
    { title: '👤 面容 ID', icon: '👤', lines: ['Face ID 功能'] },
    { title: '🛡️ 安全功能', icon: '🛡️', lines: ['内置安全芯片', '数据加密'] },
    { title: '📡 蜂窝网络和连接', icon: '📡', lines: ['5G (sub-6 GHz)', 'Wi-Fi 6E', '蓝牙 5.3'] },
    { title: '🔮 MagSafe 无线充电', icon: '🔮', lines: ['磁吸对齐', '15W 无线充电'] },
    { title: '📍 定位', icon: '📍', lines: ['内置 GPS/GNSS', '数字指南针'] },
    { title: '🎵 音频播放', icon: '🎵', lines: ['立体声扬声器', '杜比全景声'] },
    { title: '🎥 视频播放', icon: '🎥', lines: ['杜比视界', 'HDR10', 'HLG'] },
    { title: '🔘 按键与接口', icon: '🔘', lines: ['音量按钮', '电源按钮', 'USB-C 接口'] },
    { title: '🔬 传感器', icon: '🔬', lines: ['气压计', '三轴陀螺仪', '加速度感应器'] },
    { title: '📦 在盒内的配件', icon: '📦', lines: ['USB-C 充电线', '说明书'] }
];

// 为 iPad 型号添加详细规格
const iPadModels = [
    { id: 'ipad-pro-m4', name: 'iPad Pro M4' },
    { id: 'ipad-air-m2', name: 'iPad Air M2' },
    { id: 'ipad-10', name: 'iPad 第十代' },
    { id: 'ipad-mini-a17-pro', name: 'iPad mini A17 Pro' }
];

iPadModels.forEach(model => {
    const updatedSections = specCategoriesTemplate.map(category => ({
        title: category.title,
        icon: category.icon,
        lines: [...category.lines]
    }));
    
    // 根据具体型号调整规格
    if (model.id.includes('pro')) {
        updatedSections.find(cat => cat.title === '🧠 Apple 智能').lines = ['支持个性化智能功能', '支持智能写作'];
        updatedSections.find(cat => cat.title === '📱 显示屏').lines = ['Liquid Retina XDR 显示屏', 'XX 英寸 (对角线)', 'OLED 全面屏', '2732 x 2048 像素分辨率', '600 nits 亮度 (典型)'];
    } else {
        updatedSections.find(cat => cat.title === '🧠 Apple 智能').lines = [];
    }

    specsData[model.id] = {
        ...specsData[model.id],
        official_data: {
            sections: updatedSections
        },
        image_og: `images/ipad/${model.id}.jpg`
    };
});

// 为 MacBook 型号添加详细规格
const macBookModels = [
    { id: 'macbook-air-m3', name: 'MacBook Air M3' },
    { id: 'macbook-pro-m4', name: 'MacBook Pro M4' }
];

macBookModels.forEach(model => {
    const updatedSections = specCategoriesTemplate.map(category => ({
        title: category.title,
        icon: category.icon,
        lines: [...category.lines]
    }));

    // 调整适用于笔记本电脑的规格
    updatedSections.find(cat => cat.title === '📱 显示屏').lines = ['Retina 显示屏', 'XX 英寸 (对角线)', 'IPS 技术', '2560 x 1600 像素分辨率', '400 nits 亮度'];
    updatedSections.find(cat => cat.title === '📷 摄像头').lines = ['1080p FaceTime 高清摄像头'];
    updatedSections.find(cat => cat.title === '🤳 前置摄像头').lines = ['1080p FaceTime 高清摄像头'];
    updatedSections.find(cat => cat.title === '🔋 电源和电池').lines = ['最长可达 XX 小时的无线上网', '最长可达 XX 小时的视频播放', '内置锂电池'];
    updatedSections.find(cat => cat.title === '🔌 USB-C').lines = ['Thunderbolt / USB 4 端口', '高速数据传输'];

    specsData[model.id] = {
        ...specsData[model.id],
        official_data: {
            sections: updatedSections
        },
        image_og: `images/macbook/${model.id}.jpg`
    };
});

// 为 Apple Watch 型号添加详细规格
const watchModels = [
    { id: 'apple-watch-ultra', name: 'Apple Watch Ultra' },
    { id: 'apple-watch-series', name: 'Apple Watch Series' }
];

watchModels.forEach(model => {
    const updatedSections = specCategoriesTemplate.map(category => ({
        title: category.title,
        icon: category.icon,
        lines: [...category.lines]
    }));

    // 调整适用于手表的规格
    updatedSections.find(cat => cat.title === '📱 显示屏').lines = ['Always-On Retina 显示屏', 'XX 英寸 (对角线)', 'OLED 技术', '448 x 368 像素分辨率', '1000 nits 亮度 (典型)'];
    updatedSections.find(cat => cat.title === '📷 摄像头').lines = [];
    updatedSections.find(cat => cat.title === '🎬 视频拍摄').lines = [];
    updatedSections.find(cat => cat.title === '🤳 前置摄像头').lines = [];
    updatedSections.find(cat => cat.title === '🔋 电源和电池').lines = ['正常使用最长可达 18 小时', '低功耗模式最长可达 36 小时'];
    updatedSections.find(cat => cat.title === '🔌 USB-C').lines = [];

    specsData[model.id] = {
        ...specsData[model.id],
        official_data: {
            sections: updatedSections
        },
        image_og: `images/watch/${model.id}.jpg`
    };
});

// 为旧款 iPhone 型号添加详细规格
const oldIphoneModels = [
    { id: 'iphone-15', name: 'iPhone 15' },
    { id: 'iphone-15-pro', name: 'iPhone 15 Pro' },
    { id: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max' },
    { id: 'iphone-14', name: 'iPhone 14' },
    { id: 'iphone-14-pro', name: 'iPhone 14 Pro' },
    { id: 'iphone-14-pro-max', name: 'iPhone 14 Pro Max' },
    { id: 'iphone-13', name: 'iPhone 13' },
    { id: 'iphone-13-pro', name: 'iPhone 13 Pro' },
    { id: 'iphone-13-pro-max', name: 'iPhone 13 Pro Max' },
    { id: 'iphone-12', name: 'iPhone 12' },
    { id: 'iphone-12-pro', name: 'iPhone 12 Pro' },
    { id: 'iphone-12-pro-max', name: 'iPhone 12 Pro Max' },
    { id: 'iphone-11', name: 'iPhone 11' },
    { id: 'iphone-11-pro', name: 'iPhone 11 Pro' },
    { id: 'iphone-11-pro-max', name: 'iPhone 11 Pro Max' },
    { id: 'iphone-x', name: 'iPhone X' },
    { id: 'iphone-xs', name: 'iPhone XS' },
    { id: 'iphone-xs-max', name: 'iPhone XS Max' },
    { id: 'iphone-se-2', name: 'iPhone SE (第二代)' },
    { id: 'iphone-se-3', name: 'iPhone SE (第三代)' },
    { id: 'iphone-8', name: 'iPhone 8' },
    { id: 'iphone-8-plus', name: 'iPhone 8 Plus' },
    { id: 'iphone-7', name: 'iPhone 7' },
    { id: 'iphone-6s', name: 'iPhone 6s' },
    { id: 'iphone-6s-plus', name: 'iPhone 6s Plus' }
];

oldIphoneModels.forEach(model => {
    const updatedSections = specCategoriesTemplate.map(category => ({
        title: category.title,
        icon: category.icon,
        lines: [...category.lines]
    }));

    // 根据具体型号调整规格
    if (model.id.includes('15')) {
        // iPhone 15 系列支持 Apple 智能
        if (model.id.includes('pro')) {
            updatedSections.find(cat => cat.title === '🧠 Apple 智能').lines = ['支持个性化智能功能', '支持智能写作'];
        } else {
            updatedSections.find(cat => cat.title === '🧠 Apple 智能').lines = [];
        }
    } else {
        // 旧款型号不支持 Apple 智能
        updatedSections.find(cat => cat.title === '🧠 Apple 智能').lines = [];
    }

    // 调整接口类型
    if (model.id.includes('15') || model.id.includes('14') || model.id.includes('13') || model.id.includes('12')) {
        updatedSections.find(cat => cat.title === '🔌 USB-C').lines = ['USB-C 接口', '高速数据传输', '视频输出'];
    } else {
        updatedSections.find(cat => cat.title === '🔌 USB-C').lines = ['Lightning 接口', '高速数据传输', '视频输出'];
    }

    specsData[model.id] = {
        ...specsData[model.id],
        official_data: {
            sections: updatedSections
        },
        image_og: `images/iphone/${model.id.replace(/\s+/g, '-').toLowerCase()}-hero.jpg`
    };
});

// 写回文件
fs.writeFileSync(specsPath, JSON.stringify(specsData, null, 2));
console.log('所有型号的规格数据已更新！');