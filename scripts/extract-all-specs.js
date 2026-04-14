#!/usr/bin/env node
/**
 * 从compare页面文本中提取所有iPhone机型的详细规格数据
 * 基于列位置（每个机型按固定顺序排列）
 */

const fs = require('fs');

// 读取compare页面
let html = fs.readFileSync('/tmp/iphone-compare.html', 'utf8');
let text = html.replace(/<script[\s\S]*?<\/script>/gi, '')
               .replace(/<style[\s\S]*?<\/style>/gi, '')
               .replace(/<[^>]+>/g, ' ')
               .replace(/\s+/g, ' ')
               .trim();

// 机型顺序（39个）
const MODEL_ORDER = [
  'iPhone 17 Pro', 'iPhone 17 Pro Max', 'iPhone Air', 'iPhone 17', 'iPhone 17e',
  'iPhone 16 Pro', 'iPhone 16 Pro Max', 'iPhone 16', 'iPhone 16 Plus',
  'iPhone 15 Pro', 'iPhone 15 Pro Max', 'iPhone 15', 'iPhone 15 Plus',
  'iPhone 14 Pro', 'iPhone 14 Pro Max', 'iPhone 14', 'iPhone 14 Plus',
  'iPhone 13 Pro', 'iPhone 13 Pro Max', 'iPhone 13', 'iPhone 13 mini',
  'iPhone 12 Pro', 'iPhone 12 Pro Max', 'iPhone 12', 'iPhone 12 mini',
  'iPhone 11 Pro', 'iPhone 11 Pro Max', 'iPhone 11',
  'iPhone XS', 'iPhone XS Max', 'iPhone XR', 'iPhone X',
  'iPhone SE（第三代）', 'iPhone SE（第二代）'
];

/**
 * 从连续文本中提取第idx个值
 * 基于重复的模式识别
 */
function extractValueAt(lineContent, idx, totalModels = 39) {
  // 清理前缀
  let cleaned = lineContent.replace(/^[^：\s]*[：\s]\s*/, '').trim();
  cleaned = cleaned.replace(/^.*?(?=\d|超|A|6|12|48|Pro|Face|IP|USB|Wi)/, '').trim();
  
  // 方法：基于重复模式分割
  // 对于数值型数据（如尺寸、重量），尝试匹配数字模式
  // 对于文本型数据，尝试基于关键词分割
  
  const result = [];
  
  // 策略1：匹配数字+单位的模式（如 "6.3 英寸"）
  const numPattern = /[\d.]+\s*(?:英寸|毫米|克|小时|分钟|米|fps|px|ppi|GB|TB|瓦|兆像素)/g;
  const numMatches = [...cleaned.matchAll(numPattern)];
  
  if (numMatches.length >= totalModels) {
    // 如果匹配数量足够，按索引取值
    if (numMatches[idx]) {
      return numMatches[idx][0];
    }
  }
  
  // 策略2：基于重复的文本模式分割
  // 例如："A19 Pro 芯片 A19 Pro 芯片 A19 Pro 芯片..."
  // 找到重复的分隔点
  
  // 策略3：对于复杂数据，返回整行或空
  return cleaned.length > 100 ? cleaned.substring(0, 100) + '...' : cleaned;
}

// 定义规格行提取规则
const specRules = [
  {
    section: '显示屏',
    items: [
      { name: '屏幕尺寸', pattern: '显示屏：屏幕尺寸', endPattern: '显示屏：视网膜', extractType: 'size' },
      { name: '显示技术', pattern: '显示屏：视网膜', endPattern: '显示：原彩显示', extractType: 'text' },
    ]
  },
  {
    section: '芯片',
    items: [
      { name: '芯片型号', pattern: '处理器：芯片 A', endPattern: '处理器：中央处理器', extractType: 'chip' },
    ]
  },
  {
    section: '电源和电池',
    items: [
      { name: '视频播放', pattern: '电池 视频播放最长可达', endPattern: '流媒体视频播放', extractType: 'hours' },
    ]
  },
  {
    section: '尺寸与重量',
    items: [
      { name: '高度', pattern: '尺寸与重量', endPattern: '宽度', extractType: 'height' },
      { name: '重量', pattern: '重量', endPattern: '防溅', extractType: 'weight' },
    ]
  },
  {
    section: '防溅、抗水、防尘',
    items: [
      { name: '防护等级', pattern: '防溅', endPattern: '前置摄像头', extractType: 'ip' },
    ]
  }
];

// 提取所有机型的规格
const allModelSpecs = {};

MODEL_ORDER.forEach((modelName, modelIdx) => {
  console.log(`\n提取 ${modelName} (索引 ${modelIdx})...`);
  
  const sections = {};
  
  specRules.forEach(({ section, items }) => {
    const sectionItems = [];
    
    items.forEach(({ name, pattern, endPattern, extractType }) => {
      const startIdx = text.indexOf(pattern);
      if (startIdx === -1) {
        console.log(`  ⚠ 未找到: ${name} (${pattern})`);
        return;
      }
      
      const endIdx = text.indexOf(endPattern, startIdx + pattern.length);
      const lineContent = text.substring(startIdx, endIdx > startIdx ? endIdx : startIdx + 2000);
      
      // 提取该机型的值
      let value;
      
      if (extractType === 'size') {
        // 提取屏幕尺寸
        const sizes = [...lineContent.matchAll(/(\d+\.?\d*)\s*英寸/g)];
        value = sizes[modelIdx] ? sizes[modelIdx][0] : '未知';
      } else if (extractType === 'chip') {
        // 提取芯片
        const chips = [...lineContent.matchAll(/(A\d+(?:\s*(?:Pro|Max|Ultra|Fusion)?(?:\s*仿生)?\s*芯片))/g)];
        value = chips[modelIdx] ? chips[modelIdx][0] : '未知';
      } else if (extractType === 'hours') {
        // 提取电池时长
        const hours = [...lineContent.matchAll(/(\d+)\s*小时/g)];
        value = hours[modelIdx] ? hours[modelIdx][0] + ' 小时' : '未知';
      } else if (extractType === 'height') {
        // 提取高度
        const heights = [...lineContent.matchAll(/(\d+\.?\d*)\s*毫米\s*\(/g)];
        value = heights[modelIdx] ? heights[modelIdx][0] + ' 毫米' : '未知';
      } else if (extractType === 'weight') {
        // 提取重量
        const weights = [...lineContent.matchAll(/(\d+)\s*克\s*\(/g)];
        value = weights[modelIdx] ? weights[modelIdx][0] + ' 克' : '未知';
      } else if (extractType === 'ip') {
        // 提取IP等级 - 这个通常所有机型都一样
        const ipMatch = lineContent.match(/IP6[78][^\)]*\)/);
        value = ipMatch ? ipMatch[0] : '未知';
      } else {
        // 默认：提取文本
        const parts = lineContent.split(/\s{2,}/);
        value = parts[modelIdx] || parts[0] || '未知';
      }
      
      sectionItems.push(`${name}: ${value}`);
      console.log(`  ✓ ${name}: ${value}`);
    });
    
    if (sectionItems.length > 0) {
      sections[section] = sectionItems;
    }
  });
  
  allModelSpecs[modelName] = { sections };
});

// 保存结果
const outputFile = '/tmp/iphone-models-specs.json';
fs.writeFileSync(outputFile, JSON.stringify(allModelSpecs, null, 2));
console.log(`\n✅ 所有机型规格已保存到: ${outputFile}`);

// 显示统计
console.log('\n=== 提取统计 ===');
Object.entries(allModelSpecs).forEach(([name, data]) => {
  const sectionCount = Object.keys(data.sections).length;
  console.log(`${name}: ${sectionCount} 个分类`);
});
