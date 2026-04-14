// 为每个具体的三级目录型号生成对应的规格数据
const fs = require('fs');
const path = require('path');

const specsPath = path.join(__dirname, 'specs.json');
const specs = JSON.parse(fs.readFileSync(specsPath, 'utf8'));

if (!specs.iPad规格集) specs.iPad规格集 = {};
if (!specs.MacBook规格集) specs.MacBook规格集 = {};
if (!specs.Watch规格集) specs.Watch规格集 = {};

// 从现有数据复制规格
function copySpecs(target, source, rename) {
  const src = specs[source]?.[target] || specs[source]?.[Object.keys(specs[source] || {})[0]];
  if (!src) return null;
  const copy = JSON.parse(JSON.stringify(src));
  if (rename) {
    // 修改标题
    if (copy.official_data?.sections) {
      // 可以根据需要修改分类标题
    }
  }
  return copy;
}

// iPad 具体型号
const ipadProBase = specs.iPad规格集['iPad Pro'];
const ipadAirBase = specs.iPad规格集['iPad Air'];
const ipadBase = specs.iPad规格集['iPad'];
const ipadMiniBase = specs.iPad规格集['iPad mini'];

if (ipadProBase) {
  specs.iPad规格集['iPad Pro M4'] = JSON.parse(JSON.stringify(ipadProBase));
  specs.iPad规格集['iPad Pro M2'] = JSON.parse(JSON.stringify(ipadProBase));
  // 修改 M2 的芯片信息
  if (specs.iPad规格集['iPad Pro M2'].official_data?.sections) {
    specs.iPad规格集['iPad Pro M2'].official_data.sections = specs.iPad规格集['iPad Pro M2'].official_data.sections.map(s => {
      if (s.title.includes('芯片')) {
        return { ...s, items: ['M2 芯片', '8核中央处理器', '10核图形处理器', '16核神经网络引擎'] };
      }
      return s;
    });
  }
}

if (ipadAirBase) {
  specs.iPad规格集['iPad Air M2'] = JSON.parse(JSON.stringify(ipadAirBase));
  specs.iPad规格集['iPad Air M1'] = JSON.parse(JSON.stringify(ipadAirBase));
  if (specs.iPad规格集['iPad Air M1'].official_data?.sections) {
    specs.iPad规格集['iPad Air M1'].official_data.sections = specs.iPad规格集['iPad Air M1'].official_data.sections.map(s => {
      if (s.title.includes('芯片')) {
        return { ...s, items: ['M1 芯片', '8核中央处理器', '8核图形处理器', '16核神经网络引擎'] };
      }
      return s;
    });
  }
}

if (ipadBase) {
  specs.iPad规格集['iPad 第十代'] = JSON.parse(JSON.stringify(ipadBase));
  specs.iPad规格集['iPad 第九代'] = JSON.parse(JSON.stringify(ipadBase));
  if (specs.iPad规格集['iPad 第九代'].official_data?.sections) {
    specs.iPad规格集['iPad 第九代'].official_data.sections = specs.iPad规格集['iPad 第九代'].official_data.sections.map(s => {
      if (s.title.includes('芯片')) {
        return { ...s, items: ['A13 仿生芯片', '6核中央处理器', '4核图形处理器'] };
      }
      if (s.title.includes('显示屏')) {
        return { ...s, items: ['Retina 显示屏', '10.2英寸 (对角线) IPS', '2160 x 1620像素分辨率，264 ppi', '原彩显示', '广色域 (P3)', '500 尼特亮度'] };
      }
      return s;
    });
  }
}

if (ipadMiniBase) {
  specs.iPad规格集['iPad mini A17 Pro'] = JSON.parse(JSON.stringify(ipadMiniBase));
  specs.iPad规格集['iPad mini 第六代'] = JSON.parse(JSON.stringify(ipadMiniBase));
  if (specs.iPad规格集['iPad mini 第六代'].official_data?.sections) {
    specs.iPad规格集['iPad mini 第六代'].official_data.sections = specs.iPad规格集['iPad mini 第六代'].official_data.sections.map(s => {
      if (s.title.includes('芯片')) {
        return { ...s, items: ['A15 仿生芯片', '6核中央处理器', '5核图形处理器'] };
      }
      return s;
    });
  }
}

// MacBook 具体型号
const macbookAirBase = specs.MacBook规格集['MacBook Air'];
const macbookProBase = specs.MacBook规格集['MacBook Pro'];

if (macbookAirBase) {
  specs.MacBook规格集['MacBook Air M4'] = JSON.parse(JSON.stringify(macbookAirBase));
  specs.MacBook规格集['MacBook Air 13-inch M3'] = JSON.parse(JSON.stringify(macbookAirBase));
  specs.MacBook规格集['MacBook Air 15-inch M3'] = JSON.parse(JSON.stringify(macbookAirBase));
  
  // M4 版本
  if (specs.MacBook规格集['MacBook Air M4'].official_data?.sections) {
    specs.MacBook规格集['MacBook Air M4'].official_data.sections = specs.MacBook规格集['MacBook Air M4'].official_data.sections.map(s => {
      if (s.title.includes('芯片')) {
        return { ...s, items: ['M4 芯片', '10核中央处理器', '10核图形处理器', '16核神经网络引擎'] };
      }
      return s;
    });
  }
  // 15-inch 版本
  if (specs.MacBook规格集['MacBook Air 15-inch M3'].official_data?.sections) {
    specs.MacBook规格集['MacBook Air 15-inch M3'].official_data.sections = specs.MacBook规格集['MacBook Air 15-inch M3'].official_data.sections.map(s => {
      if (s.title.includes('显示屏')) {
        return { ...s, items: ['Liquid Retina 显示屏', '15.3英寸 (对角线) LED', '2880 x 1864像素分辨率，224 ppi', '原彩显示', '广色域 (P3)', '500 尼特亮度'] };
      }
      if (s.title.includes('尺寸')) {
        return { ...s, items: ['高度：1.15 厘米', '宽度：34.04 厘米', '深度：23.76 厘米', '重量：1.51 千克'] };
      }
      return s;
    });
  }
}

if (macbookProBase) {
  specs.MacBook规格集['MacBook Pro 14-inch M4'] = JSON.parse(JSON.stringify(macbookProBase));
  specs.MacBook规格集['MacBook Pro 14-inch M4 Pro'] = JSON.parse(JSON.stringify(macbookProBase));
  specs.MacBook规格集['MacBook Pro 14-inch M4 Max'] = JSON.parse(JSON.stringify(macbookProBase));
  specs.MacBook规格集['MacBook Pro 16-inch M4 Pro'] = JSON.parse(JSON.stringify(macbookProBase));
  specs.MacBook规格集['MacBook Pro 16-inch M4 Max'] = JSON.parse(JSON.stringify(macbookProBase));
  
  // 16-inch 版本
  ['MacBook Pro 16-inch M4 Pro', 'MacBook Pro 16-inch M4 Max'].forEach(key => {
    if (specs.MacBook规格集[key]?.official_data?.sections) {
      specs.MacBook规格集[key].official_data.sections = specs.MacBook规格集[key].official_data.sections.map(s => {
        if (s.title.includes('显示屏')) {
          return { ...s, items: ['Liquid Retina XDR 显示屏', '16.2英寸 (对角线) Mini-LED', '3456 x 2234像素分辨率，254 ppi', 'ProMotion 自适应刷新率，最高120Hz', '原彩显示', '广色域 (P3)', '峰值亮度：1600 尼特 (HDR)'] };
        }
        if (s.title.includes('尺寸')) {
          return { ...s, items: ['高度：1.68 厘米', '宽度：35.57 厘米', '深度：24.81 厘米', '重量：2.14 千克'] };
        }
        return s;
      });
    }
  });
  
  // M4 Pro 版本
  ['MacBook Pro 14-inch M4 Pro', 'MacBook Pro 16-inch M4 Pro'].forEach(key => {
    if (specs.MacBook规格集[key]?.official_data?.sections) {
      specs.MacBook规格集[key].official_data.sections = specs.MacBook规格集[key].official_data.sections.map(s => {
        if (s.title.includes('芯片')) {
          return { ...s, items: ['M4 Pro 芯片', '12核中央处理器', '16核图形处理器', '16核神经网络引擎'] };
        }
        return s;
      });
    }
  });
  
  // M4 Max 版本
  ['MacBook Pro 14-inch M4 Max', 'MacBook Pro 16-inch M4 Max'].forEach(key => {
    if (specs.MacBook规格集[key]?.official_data?.sections) {
      specs.MacBook规格集[key].official_data.sections = specs.MacBook规格集[key].official_data.sections.map(s => {
        if (s.title.includes('芯片')) {
          return { ...s, items: ['M4 Max 芯片', '14核中央处理器', '32核图形处理器', '16核神经网络引擎'] };
        }
        return s;
      });
    }
  });
}

// Watch 具体型号
const watchUltraBase = specs.Watch规格集['Apple Watch Ultra'];
const watchSeriesBase = specs.Watch规格集['Apple Watch'];

if (watchUltraBase) {
  specs.Watch规格集['Apple Watch Ultra 3'] = JSON.parse(JSON.stringify(watchUltraBase));
  specs.Watch规格集['Apple Watch Ultra 2'] = JSON.parse(JSON.stringify(watchUltraBase));
}

if (watchSeriesBase) {
  specs.Watch规格集['Apple Watch Series 10'] = JSON.parse(JSON.stringify(watchSeriesBase));
  specs.Watch规格集['Apple Watch Series 9'] = JSON.parse(JSON.stringify(watchSeriesBase));
  specs.Watch规格集['Apple Watch SE 第三代'] = JSON.parse(JSON.stringify(watchSeriesBase));
  specs.Watch规格集['Apple Watch SE 第二代'] = JSON.parse(JSON.stringify(watchSeriesBase));
}

fs.writeFileSync(specsPath, JSON.stringify(specs, null, 2), 'utf8');

console.log('✅ 所有具体型号规格已生成！');
console.log('iPad:', Object.keys(specs.iPad规格集).length, '型号');
console.log('MacBook:', Object.keys(specs.MacBook规格集).length, '型号');
console.log('Watch:', Object.keys(specs.Watch规格集).length, '型号');
