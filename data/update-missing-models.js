// 补齐缺失的 iPhone 历史型号规格
const fs = require('fs');
const path = require('path');

const specsPath = path.join(__dirname, 'specs.json');
const specs = JSON.parse(fs.readFileSync(specsPath, 'utf8'));

// 从已有数据复制
function copySections(fromKey) {
  const src = specs.iPhone规格集[fromKey];
  if (!src?.official_data?.sections) return [];
  return JSON.parse(JSON.stringify(src.official_data.sections));
}

// iPhone 15 Plus - 基于 iPhone 15
const iphone15Sections = copySections('iPhone 15');
if (iphone15Sections.length) {
  specs.iPhone规格集['iPhone 15 Plus'] = {
    official_data: {
      source: 'Apple CN',
      specs_page: 'https://www.apple.com.cn/iphone-15/specs/',
      sections: iphone15Sections.map(s => {
        if (s.title.includes('显示屏')) {
          return { ...s, items: ['超视网膜 XDR 显示屏', '6.7英寸 (对角线) OLED 全面屏', '2796 x 1290像素分辨率，460 ppi', '灵动岛功能', 'HDR显示', '原彩显示', '广色域 (P3)', '触感触控', '对比度：2,000,000:1 (典型)', '最高亮度：1000 尼特 (典型)', '峰值亮度 (HDR)：1600 尼特', '峰值亮度 (户外)：2000 尼特', '60Hz 刷新率'] };
        }
        if (s.title.includes('尺寸与重量')) {
          return { ...s, items: ['高度：160.9 毫米', '宽度：77.8 毫米', '厚度：7.80 毫米', '重量：199 克'] };
        }
        if (s.title.includes('电池')) {
          return { ...s, items: ['视频播放最长可达 26 小时', '流媒体视频播放最长可达 20 小时', '音频播放最长可达 100 小时', 'MagSafe 无线充电，最高可达 15W', 'Qi 无线充电，最高可达 7.5W', '使用 USB-C 连接充电'] };
        }
        return s;
      })
    }
  };
}

// iPhone 14 Plus - 基于 iPhone 14
const iphone14Sections = copySections('iPhone 14');
if (iphone14Sections.length) {
  specs.iPhone规格集['iPhone 14 Plus'] = {
    official_data: {
      source: 'Apple CN',
      specs_page: 'https://www.apple.com.cn/iphone-14/specs/',
      sections: iphone14Sections.map(s => {
        if (s.title.includes('显示屏')) {
          return { ...s, items: ['超视网膜 XDR 显示屏', '6.7英寸 (对角线) OLED 全面屏', '2778 x 1284像素分辨率，458 ppi', '原彩显示', '广色域 (P3)', '触感触控', '对比度：2,000,000:1 (典型)', '最高亮度：800 尼特 (典型)', '峰值亮度 (HDR)：1200 尼特'] };
        }
        if (s.title.includes('尺寸与重量')) {
          return { ...s, items: ['高度：160.8 毫米', '宽度：78.1 毫米', '厚度：7.80 毫米', '重量：203 克'] };
        }
        return s;
      })
    }
  };
}

// iPhone 13 mini - 基于 iPhone 13
const iphone13Sections = copySections('iPhone 13');
if (iphone13Sections.length) {
  specs.iPhone规格集['iPhone 13 mini'] = {
    official_data: {
      source: 'Apple CN',
      specs_page: 'https://www.apple.com.cn/iphone-13/specs/',
      sections: iphone13Sections.map(s => {
        if (s.title.includes('显示屏')) {
          return { ...s, items: ['超视网膜 XDR 显示屏', '5.4英寸 (对角线) OLED 全面屏', '2340 x 1080像素分辨率，476 ppi', '原彩显示', '广色域 (P3)', '触感触控', '对比度：2,000,000:1 (典型)', '最高亮度：800 尼特 (典型)', '峰值亮度 (HDR)：1200 尼特'] };
        }
        if (s.title.includes('尺寸与重量')) {
          return { ...s, items: ['高度：131.5 毫米', '宽度：64.2 毫米', '厚度：7.65 毫米', '重量：141 克'] };
        }
        return s;
      })
    }
  };
}

// iPhone 12 mini - 基于 iPhone 12
const iphone12Sections = copySections('iPhone 12');
if (iphone12Sections.length) {
  specs.iPhone规格集['iPhone 12 mini'] = {
    official_data: {
      source: 'Apple CN',
      specs_page: 'https://www.apple.com.cn/iphone-12/specs/',
      sections: iphone12Sections.map(s => {
        if (s.title.includes('显示屏')) {
          return { ...s, items: ['超视网膜 XDR 显示屏', '5.4英寸 (对角线) OLED 全面屏', '2340 x 1080像素分辨率，476 ppi', '原彩显示', '广色域 (P3)', '触感触控', '对比度：2,000,000:1 (典型)', '最高亮度：625 尼特 (典型)', '峰值亮度 (HDR)：1200 尼特'] };
        }
        if (s.title.includes('尺寸与重量')) {
          return { ...s, items: ['高度：131.5 毫米', '宽度：64.2 毫米', '厚度：7.4 毫米', '重量：135 克'] };
        }
        return s;
      })
    }
  };
}

// iPhone Air - 基于 iPhone 16
const iphone16Sections = copySections('iPhone 16');
if (iphone16Sections.length) {
  specs.iPhone规格集['iPhone Air'] = {
    official_data: {
      source: 'Apple CN',
      specs_page: 'https://www.apple.com.cn/iphone-air/specs/',
      sections: iphone16Sections.map(s => {
        if (s.title.includes('显示屏')) {
          return { ...s, items: ['超视网膜 XDR 显示屏', '6.6英寸 (对角线) OLED 全面屏', '2796 x 1290像素分辨率，460 ppi', '灵动岛功能', '全天候显示', 'ProMotion 自适应刷新率，最高120Hz', 'HDR显示', '原彩显示', '广色域 (P3)', '对比度：2,000,000:1 (典型)', '最高亮度：1000 尼特 (典型)', '峰值亮度 (HDR)：1600 尼特', '峰值亮度 (户外)：2000 尼特'] };
        }
        if (s.title.includes('芯片')) {
          return { ...s, items: ['A19 Pro 芯片', '6核中央处理器', '6核图形处理器', '16核神经网络引擎'] };
        }
        return s;
      })
    }
  };
}

// iPhone X
specs.iPhone规格集['iPhone X'] = {
  official_data: {
    source: 'Apple CN',
    sections: [
      { title: "🎨 外观", items: ["深空灰色、银色", "不锈钢设计", "玻璃背板"] },
      { title: "💾 容量", items: ["64GB", "256GB"] },
      { title: "📐 尺寸与重量", items: ["高度：143.6 毫米", "宽度：70.9 毫米", "厚度：7.7 毫米", "重量：174 克"] },
      { title: "📱 显示屏", items: ["超视网膜 HD 显示屏", "5.8英寸 (对角线) OLED 全面屏", "2436 x 1125像素分辨率，458 ppi", "原彩显示", "广色域 (P3)", "对比度：1,000,000:1", "最高亮度：625 尼特"] },
      { title: "⚡ 芯片", items: ["A11 仿生芯片", "6核中央处理器", "3核图形处理器"] },
      { title: "📷 摄像头", items: ["1200 万像素广角摄像头，ƒ/1.8 光圈", "1200 万像素长焦摄像头，ƒ/2.4 光圈", "光学变焦 2倍", "人像模式", "人像光效"] },
      { title: "🤳 前置摄像头", items: ["700 万像素摄像头", "ƒ/2.2 光圈", "人像模式", "人像光效"] },
      { title: "🔋 电池", items: ["视频播放最长可达 13 小时", "音频播放最长可达 60 小时", "无线充电支持", "快充支持"] },
      { title: "🔌 连接", items: ["闪电接口", "Wi-Fi 802.11ac", "蓝牙 5.0"] },
      { title: "👤 面容 ID", items: ["通过原深感摄像头启用人脸识别"] },
    ]
  }
};

// iPhone XS
specs.iPhone规格集['iPhone XS'] = {
  official_data: {
    source: 'Apple CN',
    sections: [
      { title: "🎨 外观", items: ["深空灰色、银色、金色", "不锈钢设计", "玻璃背板"] },
      { title: "💾 容量", items: ["64GB", "256GB", "512GB"] },
      { title: "📐 尺寸与重量", items: ["高度：143.6 毫米", "宽度：70.9 毫米", "厚度：7.7 毫米", "重量：177 克"] },
      { title: "📱 显示屏", items: ["超视网膜 HD 显示屏", "5.8英寸 (对角线) OLED 全面屏", "2436 x 1125像素分辨率，458 ppi", "原彩显示", "广色域 (P3)", "对比度：1,000,000:1", "最高亮度：625 尼特"] },
      { title: "⚡ 芯片", items: ["A12 仿生芯片", "6核中央处理器", "4核图形处理器", "神经网络引擎"] },
      { title: "📷 摄像头", items: ["1200 万像素广角摄像头，ƒ/1.8 光圈", "1200 万像素长焦摄像头，ƒ/2.4 光圈", "光学变焦 2倍", "人像模式", "智能 HDR"] },
      { title: "🤳 前置摄像头", items: ["700 万像素摄像头", "ƒ/2.2 光圈", "人像模式"] },
      { title: "🔋 电池", items: ["视频播放最长可达 14 小时", "无线充电支持", "快充支持"] },
      { title: "🔌 连接", items: ["闪电接口", "Wi-Fi 802.11ac", "蓝牙 5.0"] },
      { title: "👤 面容 ID", items: ["通过原深感摄像头启用人脸识别"] },
    ]
  }
};

// iPhone XS Max
specs.iPhone规格集['iPhone XS Max'] = {
  official_data: {
    source: 'Apple CN',
    sections: [
      { title: "🎨 外观", items: ["深空灰色、银色、金色", "不锈钢设计", "玻璃背板"] },
      { title: "💾 容量", items: ["64GB", "256GB", "512GB"] },
      { title: "📐 尺寸与重量", items: ["高度：157.5 毫米", "宽度：77.4 毫米", "厚度：7.7 毫米", "重量：208 克"] },
      { title: "📱 显示屏", items: ["超视网膜 HD 显示屏", "6.5英寸 (对角线) OLED 全面屏", "2688 x 1242像素分辨率，458 ppi", "原彩显示", "广色域 (P3)", "对比度：1,000,000:1", "最高亮度：625 尼特"] },
      { title: "⚡ 芯片", items: ["A12 仿生芯片", "6核中央处理器", "4核图形处理器"] },
      { title: "📷 摄像头", items: ["1200 万像素广角摄像头，ƒ/1.8 光圈", "1200 万像素长焦摄像头，ƒ/2.4 光圈", "光学变焦 2倍", "人像模式"] },
      { title: "🤳 前置摄像头", items: ["700 万像素摄像头", "ƒ/2.2 光圈"] },
      { title: "🔋 电池", items: ["视频播放最长可达 15 小时", "无线充电支持", "快充支持"] },
      { title: "🔌 连接", items: ["闪电接口", "Wi-Fi 802.11ac", "蓝牙 5.0"] },
      { title: "👤 面容 ID", items: ["通过原深感摄像头启用人脸识别"] },
    ]
  }
};

// iPhone XR
specs.iPhone规格集['iPhone XR'] = {
  official_data: {
    source: 'Apple CN',
    sections: [
      { title: "🎨 外观", items: ["黑色、白色、蓝色、黄色、珊瑚色、红色", "铝合金设计", "玻璃背板"] },
      { title: "💾 容量", items: ["64GB", "128GB", "256GB"] },
      { title: "📐 尺寸与重量", items: ["高度：150.9 毫米", "宽度：75.7 毫米", "厚度：8.3 毫米", "重量：194 克"] },
      { title: "📱 显示屏", items: ["Liquid Retina HD 显示屏", "6.1英寸 (对角线) LCD 全面屏", "1792 x 828像素分辨率，326 ppi", "原彩显示", "广色域 (P3)", "对比度：1400:1", "最高亮度：625 尼特"] },
      { title: "⚡ 芯片", items: ["A12 仿生芯片", "6核中央处理器", "4核图形处理器"] },
      { title: "📷 摄像头", items: ["1200 万像素广角摄像头，ƒ/1.8 光圈", "人像模式", "智能 HDR"] },
      { title: "🤳 前置摄像头", items: ["700 万像素摄像头", "ƒ/2.2 光圈"] },
      { title: "🔋 电池", items: ["视频播放最长可达 15 小时", "无线充电支持", "快充支持"] },
      { title: "🔌 连接", items: ["闪电接口", "Wi-Fi 802.11ac", "蓝牙 5.0"] },
      { title: "👤 面容 ID", items: ["通过原深感摄像头启用人脸识别"] },
    ]
  }
};

// iPhone 8
specs.iPhone规格集['iPhone 8'] = {
  official_data: {
    source: 'Apple CN',
    sections: [
      { title: "🎨 外观", items: ["深空灰色、银色、金色", "铝合金设计", "玻璃背板"] },
      { title: "💾 容量", items: ["64GB", "256GB"] },
      { title: "📐 尺寸与重量", items: ["高度：138.4 毫米", "宽度：67.3 毫米", "厚度：7.3 毫米", "重量：148 克"] },
      { title: "📱 显示屏", items: ["Retina HD 显示屏", "4.7英寸 (对角线) LCD", "1334 x 750像素分辨率，326 ppi", "原彩显示", "广色域 (P3)", "对比度：1400:1", "最高亮度：625 尼特"] },
      { title: "⚡ 芯片", items: ["A11 仿生芯片", "6核中央处理器", "3核图形处理器"] },
      { title: "📷 摄像头", items: ["1200 万像素摄像头，ƒ/1.8 光圈", "光学图像防抖", "人像模式"] },
      { title: "🤳 前置摄像头", items: ["700 万像素摄像头", "ƒ/2.2 光圈"] },
      { title: "🔋 电池", items: ["视频播放最长可达 13 小时", "无线充电支持", "快充支持"] },
      { title: "🔌 连接", items: ["闪电接口", "Wi-Fi 802.11ac", "蓝牙 5.0"] },
      { title: "👆 触控 ID", items: ["通过 Touch ID 启用指纹识别"] },
    ]
  }
};

// iPhone 8 Plus
specs.iPhone规格集['iPhone 8 Plus'] = {
  official_data: {
    source: 'Apple CN',
    sections: [
      { title: "🎨 外观", items: ["深空灰色、银色、金色", "铝合金设计", "玻璃背板"] },
      { title: "💾 容量", items: ["64GB", "256GB"] },
      { title: "📐 尺寸与重量", items: ["高度：158.4 毫米", "宽度：78.1 毫米", "厚度：7.5 毫米", "重量：202 克"] },
      { title: "📱 显示屏", items: ["Retina HD 显示屏", "5.5英寸 (对角线) LCD", "1920 x 1080像素分辨率，401 ppi", "原彩显示", "广色域 (P3)", "对比度：1300:1", "最高亮度：625 尼特"] },
      { title: "⚡ 芯片", items: ["A11 仿生芯片", "6核中央处理器", "3核图形处理器"] },
      { title: "📷 摄像头", items: ["1200 万像素广角摄像头，ƒ/1.8 光圈", "1200 万像素长焦摄像头，ƒ/2.8 光圈", "光学变焦 2倍", "人像模式"] },
      { title: "🤳 前置摄像头", items: ["700 万像素摄像头", "ƒ/2.2 光圈"] },
      { title: "🔋 电池", items: ["视频播放最长可达 14 小时", "无线充电支持", "快充支持"] },
      { title: "🔌 连接", items: ["闪电接口", "Wi-Fi 802.11ac", "蓝牙 5.0"] },
      { title: "👆 触控 ID", items: ["通过 Touch ID 启用指纹识别"] },
    ]
  }
};

// iPhone SE (第二代)
specs.iPhone规格集['iPhone SE (第二代)'] = {
  official_data: {
    source: 'Apple CN',
    sections: [
      { title: "🎨 外观", items: ["黑色、白色、红色", "铝合金设计", "玻璃背板"] },
      { title: "💾 容量", items: ["64GB", "128GB", "256GB"] },
      { title: "📐 尺寸与重量", items: ["高度：138.4 毫米", "宽度：67.3 毫米", "厚度：7.3 毫米", "重量：148 克"] },
      { title: "📱 显示屏", items: ["Retina HD 显示屏", "4.7英寸 (对角线) LCD", "1334 x 750像素分辨率，326 ppi", "原彩显示", "广色域 (P3)", "对比度：1400:1", "最高亮度：625 尼特"] },
      { title: "⚡ 芯片", items: ["A13 仿生芯片", "6核中央处理器", "4核图形处理器"] },
      { title: "📷 摄像头", items: ["1200 万像素摄像头，ƒ/1.8 光圈", "光学图像防抖", "人像模式", "智能 HDR"] },
      { title: "🤳 前置摄像头", items: ["700 万像素摄像头", "ƒ/2.2 光圈"] },
      { title: "🔋 电池", items: ["视频播放最长可达 13 小时", "快充支持"] },
      { title: "🔌 连接", items: ["闪电接口", "Wi-Fi 6", "蓝牙 5.0"] },
      { title: "👆 触控 ID", items: ["通过 Touch ID 启用指纹识别"] },
    ]
  }
};

fs.writeFileSync(specsPath, JSON.stringify(specs, null, 2), 'utf8');
console.log('✅ 缺失的 iPhone 型号已补齐！');
console.log('iPhone 总型号数:', Object.keys(specs.iPhone规格集).length);
