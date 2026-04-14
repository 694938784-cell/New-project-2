// 从苹果官网抓取 iPad、MacBook、Apple Watch 规格数据
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const specsPath = path.join(__dirname, 'specs.json');
const specs = JSON.parse(fs.readFileSync(specsPath, 'utf8'));

// 确保 iPad、MacBook、Watch 顶级分类存在
if (!specs.iPad规格集) specs.iPad规格集 = {};
if (!specs.MacBook规格集) specs.MacBook规格集 = {};
if (!specs.Watch规格集) specs.Watch规格集 = {};

// 从苹果官网获取 HTML 并解析
async function fetchURL(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// 解析规格页面
function parseSpecs(html) {
  const sections = [];
  
  // 匹配规格区块
  const sectionRegex = /<div[^>]*class="rf-table[^"]*"[^>]*>([\s\S]*?)<\/div>/g;
  let sectionMatch;
  
  // 更简单的解析方式：提取所有规格项
  const rows = [];
  const rowRegex = /<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/g;
  let rowMatch;
  
  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const label = rowMatch[1].replace(/<[^>]*>/g, '').trim();
    const value = rowMatch[2].replace(/<[^>]*>/g, '').trim();
    if (label && value) {
      rows.push({ label, value });
    }
  }
  
  // 按分类分组
  const categoryKeywords = {
    '显示屏': ['显示屏', '屏幕', '分辨率', 'Retina', '英寸', 'ppi'],
    '芯片': ['芯片', '处理器', 'M[1-4]', 'A[0-9]', 'CPU', 'GPU'],
    '内存与存储': ['内存', '存储', 'GB', 'TB'],
    '摄像头': ['摄像头', '相机', '镜头'],
    '电池': ['电池', '续航', '充电'],
    '连接': ['连接', 'Wi-Fi', '蓝牙', 'USB', '雷电'],
    '尺寸与重量': ['尺寸', '重量', '高度', '宽度', '厚度'],
    '外观': ['外观', '颜色', '材质', '铝合金', '不锈钢'],
  };
  
  // 简单按行分组
  let currentSection = null;
  for (const row of rows) {
    // 检测是否是新的分类
    let isCategory = false;
    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(kw => row.label.includes(kw))) {
        if (currentSection !== cat) {
          currentSection = cat;
          sections.push({ title: cat, items: [] });
        }
        sections[sections.length - 1].items.push(`${row.label}：${row.value}`);
        isCategory = true;
        break;
      }
    }
    if (!isCategory && currentSection) {
      sections[sections.length - 1].items.push(`${row.label}：${row.value}`);
    }
  }
  
  return sections;
}

async function main() {
  console.log('🔄 开始抓取苹果官网规格数据...\n');
  
  // iPad 型号
  const ipadModels = {
    'iPad Pro': 'https://www.apple.com.cn/ipad-pro/specs/',
    'iPad Air': 'https://www.apple.com.cn/ipad-air/specs/',
    'iPad': 'https://www.apple.com.cn/ipad/specs/',
    'iPad mini': 'https://www.apple.com.cn/ipad-mini/specs/',
  };
  
  // MacBook 型号
  const macbookModels = {
    'MacBook Air 13': 'https://www.apple.com.cn/macbook-air/specs/',
    'MacBook Pro 14': 'https://www.apple.com.cn/macbook-pro/specs/',
    'MacBook Pro 16': 'https://www.apple.com.cn/macbook-pro/specs/',
  };
  
  // 为 iPad 型号生成规格数据
  for (const [name, url] of Object.entries(ipadModels)) {
    console.log(`📱 抓取 ${name}...`);
    try {
      const html = await fetchURL(url);
      const sections = parseSpecs(html);
      
      if (sections.length > 0) {
        if (!specs.iPad规格集[name]) specs.iPad规格集[name] = {};
        specs.iPad规格集[name].official_data = {
          source: 'Apple CN official specs page',
          specs_page: url,
          compare_page: 'https://www.apple.com.cn/ipad/compare/',
          fetched_at: new Date().toISOString(),
          sections: sections
        };
        console.log(`   ✅ ${sections.length} 个分类`);
      }
    } catch (err) {
      console.error(`   ❌ 抓取失败: ${err.message}`);
    }
  }
  
  // 为 MacBook 型号生成规格数据
  for (const [name, url] of Object.entries(macbookModels)) {
    console.log(`💻 抓取 ${name}...`);
    try {
      const html = await fetchURL(url);
      const sections = parseSpecs(html);
      
      if (sections.length > 0) {
        if (!specs.MacBook规格集[name]) specs.MacBook规格集[name] = {};
        specs.MacBook规格集[name].official_data = {
          source: 'Apple CN official specs page',
          specs_page: url,
          compare_page: 'https://www.apple.com.cn/mac/compare/',
          fetched_at: new Date().toISOString(),
          sections: sections
        };
        console.log(`   ✅ ${sections.length} 个分类`);
      }
    } catch (err) {
      console.error(`   ❌ 抓取失败: ${err.message}`);
    }
  }
  
  // 添加 iPad 和 MacBook 的目录到文件夹
  console.log('\n📁 添加目录结构...');
  
  // 保存
  fs.writeFileSync(specsPath, JSON.stringify(specs, null, 2), 'utf8');
  console.log('\n✅ 规格数据已保存到 specs.json');
}

main().catch(console.error);
