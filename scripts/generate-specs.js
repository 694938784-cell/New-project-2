#!/usr/bin/env node
/**
 * 基于compare页面数据为所有iPhone机型生成详细的official_data.sections
 */

const fs = require('fs');

// 读取specs.json
const specsPath = '/Users/apple/Documents/New project 2/data/specs.json';
const specs = JSON.parse(fs.readFileSync(specsPath, 'utf8'));

// 机型顺序（与compare页面一致）
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

// 读取compare页面文本
const html = fs.readFileSync('/tmp/iphone-compare.html', 'utf8');
let text = html.replace(/<script[\s\S]*?<\/script>/gi, '')
               .replace(/<style[\s\S]*?<\/style>/gi, '')
               .replace(/<[^>]+>/g, ' ')
               .replace(/\s+/g, ' ')
               .trim();

console.log('开始为各机型生成详细规格数据...\n');

// 定义规格提取规则
const specRules = [
  {
    section: '显示屏',
    lines: [
      { pattern: '显示屏：屏幕尺寸', endPattern: '显示屏：OLED' },
      { pattern: '显示屏：OLED', endPattern: '显示：原彩显示' },
      { pattern: '显示：原彩显示', endPattern: '显示屏：ProMotion' },
      { pattern: '显示屏：ProMotion', endPattern: '显示屏：全天候显示' },
      { pattern: '显示屏：全天候显示', endPattern: '灵动岛功能' },
    ]
  },
  {
    section: '芯片',
    lines: [
      { pattern: '处理器：芯片', endPattern: '处理器：中央处理器' },
      { pattern: '处理器：中央处理器', endPattern: '处理器：图形处理器' },
      { pattern: '处理器：图形处理器', endPattern: '处理器：引擎' },
      { pattern: '处理器：引擎', endPattern: '硬件加速光线追踪' },
    ]
  },
  {
    section: '电源和电池',
    lines: [
      { pattern: '电池 视频播放', endPattern: 'Front Camera' },
    ]
  },
  {
    section: '尺寸与重量',
    lines: [
      { pattern: '尺寸与重量', endPattern: '防溅' },
    ]
  },
  {
    section: '防溅、抗水、防尘',
    lines: [
      { pattern: '防溅', endPattern: '前置摄像头' },
    ]
  },
  {
    section: '前置摄像头',
    lines: [
      { pattern: '前置摄像头', endPattern: '后置摄像头' },
    ]
  },
  {
    section: '后置摄像头',
    lines: [
      { pattern: '后置摄像头', endPattern: '视频拍摄' },
    ]
  },
  {
    section: '视频拍摄',
    lines: [
      { pattern: '视频拍摄', endPattern: '安全功能' },
    ]
  },
  {
    section: '安全功能',
    lines: [
      { pattern: '安全功能', endPattern: 'MagSafe' },
    ]
  },
  {
    section: 'MagSafe 无线充电',
    lines: [
      { pattern: 'MagSafe', endPattern: '蜂窝网络' },
    ]
  },
  {
    section: '蜂窝网络和连接',
    lines: [
      { pattern: '蜂窝网络', endPattern: '面容ID' },
    ]
  },
  {
    section: '面容 ID',
    lines: [
      { pattern: '面容ID', endPattern: 'Siri' },
    ]
  }
];

// 分割列的函数
function splitColumns(lineContent, totalModels = 39) {
  // 清理前缀
  let cleaned = lineContent.replace(/^[^：]*：\s*/, '').trim();
  
  // 尝试基于重复模式分割
  // 对于简单数据（如芯片型号），直接按出现次数分割
  // 对于复杂数据，需要更智能的方法
  
  // 简化方法：按固定长度分割（如果数据长度相近）
  // 或者基于明显的分隔符
  
  const result = [];
  
  // 方法1：基于重复的关键词分割
  // 方法2：基于固定位置分割
  // 方法3：返回整行作为单个值（作为fallback）
  
  // 这里我们先尝试简单分割
  const parts = cleaned.split(/\s{3,}/);
  
  if (parts.length >= totalModels) {
    // 如果parts数量大于等于机型数量，每个part可能对应一个机型
    for (let i = 0; i < totalModels; i++) {
      result.push(parts[i] || '');
    }
  } else {
    // 否则，返回整行
    result.push(cleaned);
  }
  
  return result;
}

// 为每个机型生成sections
function generateSpecsForModels() {
  const iphoneSpecs = specs.iphone_specs || {};
  
  MODEL_ORDER.forEach((modelName, modelIdx) => {
    // 如果该机型已有详细数据，跳过
    if (iphoneSpecs[modelName]?.official_data?.sections && 
        Object.keys(iphoneSpecs[modelName].official_data.sections).length > 15) {
      console.log(`✓ ${modelName}: 已有详细数据 (${Object.keys(iphoneSpecs[modelName].official_data.sections).length} 个分类)`);
      return;
    }
    
    console.log(`\n处理 ${modelName}...`);
    
    const sections = {};
    
    // 对于每个规格规则，提取数据
    specRules.forEach(({ section, lines }) => {
      const sectionItems = [];
      
      lines.forEach(({ pattern, endPattern }) => {
        const startIdx = text.indexOf(pattern);
        if (startIdx === -1) return;
        
        const endIdx = text.indexOf(endPattern, startIdx + pattern.length);
        const lineContent = text.substring(startIdx, endIdx > startIdx ? endIdx : startIdx + 1000);
        
        // 分割列
        const columns = splitColumns(lineContent);
        
        // 获取该机型的值
        if (columns[modelIdx]) {
          sectionItems.push(columns[modelIdx].trim());
        }
      });
      
      if (sectionItems.length > 0) {
        sections[section] = sectionItems;
      }
    });
    
    // 如果提取到了数据，更新specs
    if (Object.keys(sections).length > 0) {
      if (!iphoneSpecs[modelName]) {
        iphoneSpecs[modelName] = {};
      }
      
      iphoneSpecs[modelName].official_data = iphoneSpecs[modelName].official_data || {};
      iphoneSpecs[modelName].official_data.sections = sections;
      iphoneSpecs[modelName].official_data.source = 'Apple CN official website (compare page)';
      iphoneSpecs[modelName].official_data.fetched_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
      
      console.log(`  ✓ 生成 ${Object.keys(sections).length} 个分类`);
    } else {
      console.log(`  ⚠ 未提取到数据`);
    }
  });
  
  specs.iphone_specs = iphoneSpecs;
  return specs;
}

// 执行生成
const updatedSpecs = generateSpecsForModels();

// 保存
fs.writeFileSync(specsPath, JSON.stringify(updatedSpecs, null, 2));
console.log(`\n✅ 规格数据已更新并保存到 ${specsPath}`);

// 统计
console.log('\n=== 最终统计 ===');
let detailedCount = 0;
Object.entries(updatedSpecs.iphone_specs || {}).forEach(([name, data]) => {
  const sections = data?.official_data?.sections;
  if (sections && Object.keys(sections).length > 10) {
    detailedCount++;
  }
});
console.log(`详细数据机型数量: ${detailedCount} / ${Object.keys(updatedSpecs.iphone_specs || {}).length}`);
