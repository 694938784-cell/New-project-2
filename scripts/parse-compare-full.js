#!/usr/bin/env node
/**
 * 完整解析苹果官网 compare 页面的所有iPhone机型规格数据
 * 输出格式与现有 specs.json 的 official_data.sections 一致
 */

const fs = require('fs');

const htmlFile = '/tmp/iphone-compare.html';
const html = fs.readFileSync(htmlFile, 'utf8');

// 清理HTML
let cleanHtml = html.replace(/<script[\s\S]*?<\/script>/gi, '');
cleanHtml = cleanHtml.replace(/<style[\s\S]*?<\/style>/gi, '');
const text = cleanHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

// 定义机型映射（基于屏幕尺寸和芯片）
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

// 定义要提取的规格行模式
const SPEC_PATTERNS = [
  { section: '总览', pattern: '速览 显示屏', endPattern: '显示屏：OLED' },
  { section: '显示屏', pattern: '显示屏：屏幕尺寸', endPattern: '显示：原彩显示' },
  { section: '外观', pattern: '外观', endPattern: '耐用性' },
  { section: '耐用性', pattern: '耐用性', endPattern: '处理器' },
  { section: '芯片', pattern: '处理器：芯片', endPattern: '电源和电池' },
  { section: '电源和电池', pattern: '电源和电池', endPattern: '容量' },
  { section: '尺寸与重量', pattern: '尺寸与重量', endPattern: '防溅' },
  { section: '防溅、抗水、防尘', pattern: '防溅', endPattern: '前置摄像头' },
  { section: '前置摄像头', pattern: '前置摄像头', endPattern: '后置摄像头' },
  { section: '后置摄像头', pattern: '后置摄像头', endPattern: '视频拍摄' },
  { section: '视频拍摄', pattern: '视频拍摄', endPattern: '安全功能' },
  { section: '安全功能', pattern: '安全功能', endPattern: 'MagSafe' },
  { section: 'MagSafe', pattern: 'MagSafe', endPattern: '蜂窝网络' },
  { section: '蜂窝网络和连接', pattern: '蜂窝网络', endPattern: '面容ID' },
  { section: '面容ID', pattern: '面容ID', endPattern: 'Siri' },
  { section: '在盒内的配件', pattern: '在盒内的配件', endPattern: 'iPhone' }
];

/**
 * 按列分割数据
 * @param {string} line - 包含所有机型数据的行
 * @param {number} modelCount - 机型数量
 * @returns {string[]} 每个机型对应的数据数组
 */
function splitByColumns(line, modelCount = 39) {
  // 方法：根据重复的模式来分割
  // 苹果compare页面的数据是按列重复的，每列对应一个机型
  
  // 简单策略：基于已知的分隔符（如连字符序列或重复模式）
  // 或者基于固定宽度（如果数据是对齐的）
  
  // 更好的方法：查找重复出现的相同子模式
  const result = [];
  
  // 对于文本数据，我们需要找到每个机型数据的边界
  // 这通常通过查找重复的关键词或模式来实现
  
  // 简化处理：对于短文本，直接按空格分割后重新组合
  const parts = line.split(/\s{2,}/);
  
  // 如果parts数量是modelCount的倍数，说明每个机型有相同数量的子项
  if (parts.length % modelCount === 0) {
    const itemsPerModel = parts.length / modelCount;
    for (let i = 0; i < modelCount; i++) {
      const start = i * itemsPerModel;
      result.push(parts.slice(start, start + itemsPerModel).join(' '));
    }
  } else {
    // 否则，尝试基于重复模式分割
    // 这是一个简化版本，可能不完美
    for (let i = 0; i < Math.min(modelCount, parts.length); i++) {
      result.push(parts[i] || '');
    }
  }
  
  return result;
}

/**
 * 提取规格数据
 */
function extractAllSpecs() {
  const allModels = {};
  
  MODEL_ORDER.forEach((modelName, idx) => {
    allModels[modelName] = {
      sections: {}
    };
  });
  
  // 对于每个规格模式，提取数据
  SPEC_PATTERNS.forEach(({ section, pattern, endPattern }) => {
    console.log(`提取: ${section}...`);
    
    const startIdx = text.indexOf(pattern);
    if (startIdx === -1) {
      console.log(`  未找到: ${pattern}`);
      return;
    }
    
    const endIdx = text.indexOf(endPattern, startIdx + pattern.length);
    const lineContent = text.substring(startIdx, endIdx > startIdx ? endIdx : startIdx + 2000);
    
    // 清理前缀
    const cleanedLine = lineContent.replace(/^[^：]*：\s*/, '').replace(/^.*?\s+/, '');
    
    // 分割成各列
    const columns = splitByColumns(cleanedLine, MODEL_ORDER.length);
    
    // 分配给每个机型
    MODEL_ORDER.forEach((modelName, idx) => {
      if (columns[idx] && columns[idx].trim()) {
        if (!allModels[modelName].sections[section]) {
          allModels[modelName].sections[section] = [];
        }
        allModels[modelName].sections[section].push(columns[idx].trim());
      }
    });
  });
  
  return allModels;
}

// 执行提取
console.log('开始提取所有机型规格数据...\n');
const extractedData = extractAllSpecs();

// 输出结果统计
console.log('\n=== 提取结果统计 ===\n');
Object.entries(extractedData).forEach(([name, data]) => {
  const sectionCount = Object.keys(data.sections).length;
  const totalItems = Object.values(data.sections).reduce((sum, arr) => sum + arr.length, 0);
  console.log(`${name}: ${sectionCount} 个分类, ${totalItems} 条参数`);
});

// 保存到一个临时文件供后续合并
const outputFile = '/tmp/extracted-specs.json';
fs.writeFileSync(outputFile, JSON.stringify(extractedData, null, 2));
console.log(`\n数据已保存到: ${outputFile}`);
