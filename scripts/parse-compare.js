#!/usr/bin/env node
/**
 * 解析苹果官网 compare 页面，提取所有iPhone机型的详细规格数据
 */

const fs = require('fs');

const htmlFile = process.argv[2] || '/tmp/iphone-compare.html';
const html = fs.readFileSync(htmlFile, 'utf8');

// 删除script和style
let cleanHtml = html.replace(/<script[\s\S]*?<\/script>/gi, '');
cleanHtml = cleanHtml.replace(/<style[\s\S]*?<\/style>/gi, '');

// 提取纯文本
const text = cleanHtml.replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

// 定义规格类别关键词（用于分段）
const sectionKeywords = [
  '速览', '显示屏', '显示', '设计', '耐用性', '防溅', '处理器', '芯片',
  'Apple 智能', '视频拍摄', '前置摄像头', '电源和电池', '电池', '面容ID',
  '触控ID', '容量', '存储', '尺寸与重量', '重量', '外观', '连接',
  '蜂窝网络和连接', '无线连接', '安全功能', 'SOS', '车祸检测',
  '听觉辅助功能', '助听器', 'MagSafe', '充电', '配件', '耳机',
  '在盒内的配件', '操作环境', '语言', 'Siri', '系统要求',
  '可持续性'
];

// 找到各机型在文本中的位置
// 苹果compare页面的数据是按列排列的，每列是一个机型
// 我们需要找到每个机型的起始位置

// 先找到所有出现的机型名称
const modelPatterns = [
  'iPhone 17 Pro Max', 'iPhone 17 Pro', 'iPhone Air', 'iPhone 17', 'iPhone 17e',
  'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16',
  'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
  'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
  'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13 mini', 'iPhone 13',
  'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12 mini', 'iPhone 12',
  'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11',
  'iPhone XS Max', 'iPhone XS', 'iPhone XR', 'iPhone X',
  'iPhone SE（第三代）', 'iPhone SE（第二代）', 'iPhone SE'
];

console.log('开始解析iPhone规格数据...\n');

// 简单的策略：基于芯片型号来定位每个机型
// 因为每个机型的芯片是唯一的
const chipMap = {
  'A19 Pro': ['iPhone 17 Pro', 'iPhone 17 Pro Max'],
  'A19': ['iPhone 17', 'iPhone Air'],
  'A18 Pro': ['iPhone 16 Pro', 'iPhone 16 Pro Max'],
  'A18': ['iPhone 16', 'iPhone 16 Plus'],
  'A17 Pro': ['iPhone 15 Pro', 'iPhone 15 Pro Max'],
  'A16': ['iPhone 15', 'iPhone 15 Plus', 'iPhone 14 Pro', 'iPhone 14 Pro Max'],
  'A15': ['iPhone 14', 'iPhone 14 Plus', 'iPhone 13', 'iPhone 13 mini', 'iPhone 13 Pro', 'iPhone 13 Pro Max'],
  'A14': ['iPhone 12', 'iPhone 12 mini', 'iPhone 12 Pro', 'iPhone 12 Pro Max'],
  'A13': ['iPhone 11', 'iPhone 11 Pro', 'iPhone 11 Pro Max'],
  'A12': ['iPhone XS', 'iPhone XS Max', 'iPhone XR'],
  'A11': ['iPhone X'],
  'A10': ['iPhone SE（第二代）', 'iPhone SE（第三代）']
};

// 更精确的方法：基于固定模式提取
// compare页面的结构是：每行是一个规格类别，每列是一个机型
// 数据以"类别：子类别 值1 值2 值3..."的形式出现

// 提取规格数据的正则模式
function extractSpecs(text) {
  const result = {};
  
  // 找到包含规格定义的部分
  // 格式类似："处理器：芯片 A19 Pro 芯片 A19 Pro 芯片..."
  
  // 先找到所有出现"处理器：芯片"、"显示屏"等的位置
  const specLines = [];
  
  // 匹配所有规格行
  const specPattern = /([^：]+)：([^：]+?)\s+/g;
  let match;
  
  const sections = {};
  let currentSection = '';
  
  // 分段落处理
  const parts = text.split(/\s{3,}/);
  
  parts.forEach(part => {
    // 检查是否是规格类别标题
    for (const keyword of sectionKeywords) {
      if (part.includes(keyword) && !part.includes('图标') && part.length < 100) {
        currentSection = keyword;
        if (!sections[currentSection]) {
          sections[currentSection] = [];
        }
        break;
      }
    }
    
    // 如果是规格数据行
    if (part.includes('：') && currentSection) {
      sections[currentSection].push(part.trim());
    }
  });
  
  return sections;
}

// 使用更简单的方法：直接查找并提取
function simpleExtract(text) {
  const models = {};
  
  // 找到芯片相关的所有内容
  const chipIdx = text.indexOf('处理器：芯片');
  if (chipIdx === -1) {
    console.log('未找到芯片数据');
    return models;
  }
  
  // 提取芯片行
  const chipEnd = text.indexOf('处理器：中央处理器', chipIdx);
  const chipLine = text.substring(chipIdx, chipEnd > chipIdx ? chipEnd : chipIdx + 1000);
  
  console.log('芯片行内容（前500字符）:');
  console.log(chipLine.substring(0, 500));
  console.log('\n---\n');
  
  // 同样的方法提取其他规格
  const specsToExtract = [
    { name: '芯片', pattern: '处理器：芯片', endPattern: '处理器：中央处理器' },
    { name: '中央处理器', pattern: '处理器：中央处理器', endPattern: '处理器：图形处理器' },
    { name: '图形处理器', pattern: '处理器：图形处理器', endPattern: '处理器：引擎' },
    { name: '电池续航', pattern: '电池 视频播放', endPattern: 'Front Camera' },
  ];
  
  specsToExtract.forEach(spec => {
    const startIdx = text.indexOf(spec.pattern);
    if (startIdx === -1) return;
    
    const endIdx = text.indexOf(spec.endPattern, startIdx);
    const content = text.substring(startIdx, endIdx > startIdx ? endIdx : startIdx + 500);
    
    console.log(`${spec.name}:`);
    console.log(content.substring(0, 300));
    console.log('---\n');
  });
  
  return models;
}

simpleExtract(text);

console.log('\n解析完成！');
