const titleInput = document.getElementById("titleInput");
const contentInput = document.getElementById("contentInput");
const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");
const notesEl = document.getElementById("notes");
const searchInput = document.getElementById("searchInput");
const folderTreeEl = document.getElementById("folderTree");
const addFolderBtn = document.getElementById("addFolderBtn");
const currentFolderEl = document.getElementById("currentFolder");

const STORAGE_KEY = "codex_notes";
const FOLDER_STORAGE_KEY = "codex_folders";
const SPECS_STORAGE_KEY = "codex_specs";
const VERSION_KEY = "codex_version";
const FAVORITES_KEY = "codex_favorites";
const RECENT_KEY = "codex_recent";
const DARK_MODE_KEY = "codex_dark_mode";
const CURRENT_VERSION = "20260414221000"; // 版本号，每次更新时修改

// 版本检测：如果版本不匹配，强制清除所有缓存
function checkAndClearCache() {
  const savedVersion = localStorage.getItem(VERSION_KEY);
  if (savedVersion !== CURRENT_VERSION) {
    console.log('检测到版本更新，清除所有缓存...');
    localStorage.removeItem(FOLDER_STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SPECS_STORAGE_KEY);
    localStorage.removeItem(VERSION_KEY);
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    return true; // 表示已清除缓存
  }
  return false; // 表示版本一致，无需清除
}

// 页面加载时立即检查版本
const cacheCleared = checkAndClearCache();
let currentFolderId = "all";
let expandedFolders = {}; // 跟踪展开的文件夹
let sortOrder = "date-desc"; // 默认按日期倒序（新的在前）
let isEditMode = false; // 编辑模式状态
const LAYOUT_STORAGE_KEY = "codex_layout"; // 布局存储键

function loadNotes() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function loadFolders() {
  const raw = localStorage.getItem(FOLDER_STORAGE_KEY);
  if (!raw) {
    const now = Date.now();
    // 初始化默认folder和iPhone数据，按苹果官网产品线分类
    const defaultFolders = [
      { id: "all", name: "所有笔记", parent: null, createdAt: now },

      // 四大产品线（一级菜单）
      { id: "iphone", name: "iPhone", parent: "all", createdAt: now + 1 },
      { id: "ipad", name: "iPad", parent: "all", createdAt: now + 2 },
      { id: "watch", name: "Apple Watch", parent: "all", createdAt: now + 3 },
      { id: "macbook", name: "MacBook", parent: "all", createdAt: now + 4 },

      // ========== iPhone 系列 ==========
      // 当前在售系列
      { id: "iphone17-series", name: "iPhone 17 系列", parent: "iphone", createdAt: now + 10 },
      { id: "iphone17", name: "iPhone 17", parent: "iphone17-series", createdAt: now + 11 },
      { id: "iphone17-pro", name: "iPhone 17 Pro", parent: "iphone17-series", createdAt: now + 12 },
      { id: "iphone17-promax", name: "iPhone 17 Pro Max", parent: "iphone17-series", createdAt: now + 13 },
      { id: "iphone17e", name: "iPhone 17e", parent: "iphone17-series", createdAt: now + 14 },

      { id: "iphone-air-series", name: "iPhone Air 系列", parent: "iphone", createdAt: now + 15 },
      { id: "iphone-air", name: "iPhone Air", parent: "iphone-air-series", createdAt: now + 16 },

      { id: "iphone16-series", name: "iPhone 16 系列", parent: "iphone", createdAt: now + 20 },
      { id: "iphone16", name: "iPhone 16", parent: "iphone16-series", createdAt: now + 21 },
      { id: "iphone16-pro", name: "iPhone 16 Pro", parent: "iphone16-series", createdAt: now + 22 },
      { id: "iphone16-promax", name: "iPhone 16 Pro Max", parent: "iphone16-series", createdAt: now + 23 },

      // 历史系列
      { id: "iphone15-series", name: "iPhone 15 系列", parent: "iphone", createdAt: now + 30 },
      { id: "iphone15", name: "iPhone 15", parent: "iphone15-series", createdAt: now + 31 },
      { id: "iphone15plus", name: "iPhone 15 Plus", parent: "iphone15-series", createdAt: now + 32 },
      { id: "iphone15pro", name: "iPhone 15 Pro", parent: "iphone15-series", createdAt: now + 33 },
      { id: "iphone15promax", name: "iPhone 15 Pro Max", parent: "iphone15-series", createdAt: now + 34 },

      { id: "iphone14-series", name: "iPhone 14 系列", parent: "iphone", createdAt: now + 40 },
      { id: "iphone14", name: "iPhone 14", parent: "iphone14-series", createdAt: now + 41 },
      { id: "iphone14plus", name: "iPhone 14 Plus", parent: "iphone14-series", createdAt: now + 42 },
      { id: "iphone14pro", name: "iPhone 14 Pro", parent: "iphone14-series", createdAt: now + 43 },
      { id: "iphone14promax", name: "iPhone 14 Pro Max", parent: "iphone14-series", createdAt: now + 44 },

      { id: "iphone13-series", name: "iPhone 13 系列", parent: "iphone", createdAt: now + 50 },
      { id: "iphone13", name: "iPhone 13", parent: "iphone13-series", createdAt: now + 51 },
      { id: "iphone13mini", name: "iPhone 13 mini", parent: "iphone13-series", createdAt: now + 52 },
      { id: "iphone13pro", name: "iPhone 13 Pro", parent: "iphone13-series", createdAt: now + 53 },
      { id: "iphone13promax", name: "iPhone 13 Pro Max", parent: "iphone13-series", createdAt: now + 54 },

      { id: "iphone12-series", name: "iPhone 12 系列", parent: "iphone", createdAt: now + 60 },
      { id: "iphone12", name: "iPhone 12", parent: "iphone12-series", createdAt: now + 61 },
      { id: "iphone12mini", name: "iPhone 12 mini", parent: "iphone12-series", createdAt: now + 62 },
      { id: "iphone12pro", name: "iPhone 12 Pro", parent: "iphone12-series", createdAt: now + 63 },
      { id: "iphone12promax", name: "iPhone 12 Pro Max", parent: "iphone12-series", createdAt: now + 64 },

      { id: "iphone11-series", name: "iPhone 11 系列", parent: "iphone", createdAt: now + 70 },
      { id: "iphone11", name: "iPhone 11", parent: "iphone11-series", createdAt: now + 71 },
      { id: "iphone11pro", name: "iPhone 11 Pro", parent: "iphone11-series", createdAt: now + 72 },
      { id: "iphone11promax", name: "iPhone 11 Pro Max", parent: "iphone11-series", createdAt: now + 73 },

      // 早期系列
      { id: "iphonex-early-series", name: "iPhone X 及早期系列", parent: "iphone", createdAt: now + 80 },
      { id: "iphonex", name: "iPhone X", parent: "iphonex-early-series", createdAt: now + 81 },
      { id: "iphonexs", name: "iPhone XS", parent: "iphonex-early-series", createdAt: now + 82 },
      { id: "iphonexsmax", name: "iPhone XS Max", parent: "iphonex-early-series", createdAt: now + 83 },
      { id: "iphonexr", name: "iPhone XR", parent: "iphonex-early-series", createdAt: now + 84 },
      { id: "iphone8", name: "iPhone 8", parent: "iphonex-early-series", createdAt: now + 85 },
      { id: "iphone8plus", name: "iPhone 8 Plus", parent: "iphonex-early-series", createdAt: now + 86 },
      { id: "iphonese-2nd", name: "iPhone SE (第二代)", parent: "iphonex-early-series", createdAt: now + 87 },

      // ========== iPad 系列 ==========
      { id: "ipad-pro-series", name: "iPad Pro", parent: "ipad", createdAt: now + 100 },
      { id: "ipad-pro-m4", name: "iPad Pro M4", parent: "ipad-pro-series", createdAt: now + 101 },
      { id: "ipad-pro-m2", name: "iPad Pro M2", parent: "ipad-pro-series", createdAt: now + 102 },

      { id: "ipad-air-series", name: "iPad Air", parent: "ipad", createdAt: now + 110 },
      { id: "ipad-air-m2", name: "iPad Air M2", parent: "ipad-air-series", createdAt: now + 111 },
      { id: "ipad-air-m1", name: "iPad Air M1", parent: "ipad-air-series", createdAt: now + 112 },

      { id: "ipad-series", name: "iPad", parent: "ipad", createdAt: now + 120 },
      { id: "ipad-10th", name: "iPad 第十代", parent: "ipad-series", createdAt: now + 121 },
      { id: "ipad-9th", name: "iPad 第九代", parent: "ipad-series", createdAt: now + 122 },

      { id: "ipad-mini-series", name: "iPad mini", parent: "ipad", createdAt: now + 130 },
      { id: "ipad-mini-a17", name: "iPad mini A17 Pro", parent: "ipad-mini-series", createdAt: now + 131 },
      { id: "ipad-mini-6th", name: "iPad mini 第六代", parent: "ipad-mini-series", createdAt: now + 132 },

      // ========== Apple Watch 系列 ==========
      { id: "watch-ultra-series", name: "Apple Watch Ultra", parent: "watch", createdAt: now + 200 },
      { id: "watch-ultra-3", name: "Apple Watch Ultra 3", parent: "watch-ultra-series", createdAt: now + 201 },
      { id: "watch-ultra-2", name: "Apple Watch Ultra 2", parent: "watch-ultra-series", createdAt: now + 202 },

      { id: "watch-series-series", name: "Apple Watch 系列", parent: "watch", createdAt: now + 210 },
      { id: "watch-series-10", name: "Apple Watch Series 10", parent: "watch-series-series", createdAt: now + 211 },
      { id: "watch-series-9", name: "Apple Watch Series 9", parent: "watch-series-series", createdAt: now + 212 },

      { id: "watch-se-series", name: "Apple Watch SE", parent: "watch", createdAt: now + 220 },
      { id: "watch-se-3rd", name: "Apple Watch SE 第三代", parent: "watch-se-series", createdAt: now + 221 },
      { id: "watch-se-2nd", name: "Apple Watch SE 第二代", parent: "watch-se-series", createdAt: now + 222 },

      // ========== MacBook 系列 ==========
      { id: "macbook-air-series", name: "MacBook Air", parent: "macbook", createdAt: now + 300 },
      { id: "macbook-air-m4", name: "MacBook Air M4", parent: "macbook-air-series", createdAt: now + 301 },
      { id: "macbook-air-m3-13", name: "MacBook Air 13-inch M3", parent: "macbook-air-series", createdAt: now + 302 },
      { id: "macbook-air-m3-15", name: "MacBook Air 15-inch M3", parent: "macbook-air-series", createdAt: now + 303 },

      { id: "macbook-pro-series", name: "MacBook Pro", parent: "macbook", createdAt: now + 310 },
      { id: "macbook-pro-m4-14", name: "MacBook Pro 14-inch M4", parent: "macbook-pro-series", createdAt: now + 311 },
      { id: "macbook-pro-m4-pro-14", name: "MacBook Pro 14-inch M4 Pro", parent: "macbook-pro-series", createdAt: now + 312 },
      { id: "macbook-pro-m4-max-14", name: "MacBook Pro 14-inch M4 Max", parent: "macbook-pro-series", createdAt: now + 313 },
      { id: "macbook-pro-m4-pro-16", name: "MacBook Pro 16-inch M4 Pro", parent: "macbook-pro-series", createdAt: now + 314 },
      { id: "macbook-pro-m4-max-16", name: "MacBook Pro 16-inch M4 Max", parent: "macbook-pro-series", createdAt: now + 315 },
    ];
    saveFolders(defaultFolders);
    return defaultFolders;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveFolders(folders) {
  localStorage.setItem(FOLDER_STORAGE_KEY, JSON.stringify(folders));
}

function loadSpecs() {
  const raw = localStorage.getItem(SPECS_STORAGE_KEY);
  if (!raw) {
    // 如果localStorage中没有数据，直接返回空对象
    // 数据会在initSpecs中异步加载
    return {};
  }
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveSpecs(specs) {
  localStorage.setItem(SPECS_STORAGE_KEY, JSON.stringify(specs));
}

function chunkArray(arr, size = 12) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

function createSpecCard(title, bodyHtml) {
  return `
    <article class="spec-card">
      <h4 class="spec-card-title">${title}</h4>
      <div class="spec-card-body">${bodyHtml}</div>
    </article>
  `;
}

function renderSpecLines(items) {
  const arr = Array.isArray(items) ? items : [items];
  return arr
    .filter((x) => x !== null && x !== undefined && String(x).trim() !== "")
    .map((x) => `<div class="spec-line">${String(x).replace(/^\*\s+/, "")}</div>`)
    .join("");
}

// 生成规格表格HTML
function generateSpecTable(modelName, modelSpec) {
  const specs = loadSpecs();
  if (!modelSpec) {
    // 搜索所有品类规格集
    const allSpecSets = [
      specs.iPhone规格集, specs.iphone_specs,
      specs.iPad规格集,
      specs.MacBook规格集,
      specs.Watch规格集
    ];
    for (const specSet of allSpecSets) {
      if (specSet && specSet[modelName]) {
        modelSpec = specSet[modelName];
        break;
      }
    }
  }

  if (!modelSpec) {
    return `<div class="spec-notice">暂无 ${modelName} 的规格数据</div>`;
  }

  const official = modelSpec?.official_data;

  // 如果有 official_data.sections，使用卡片式详细显示
  if (official?.sections && Array.isArray(official.sections)) {
    const heroImage = official?.image_og;

    // 分类图标映射
    const sectionIcons = {
      '外观': '🎨',
      '容量': '💾',
      '尺寸与重量': '📐',
      '显示屏': '📱',
      '防溅抗水防尘': '💧',
      '芯片': '⚡',
      'Apple 智能': '🧠',
      '摄像头': '📷',
      '视频拍摄': '🎬',
      '前置摄像头': '🤳',
      '电源和电池': '🔋',
      'USB-C': '🔌',
      '面容 ID': '👤',
      '安全功能': '🛡️',
      '蜂窝网络和连接': '📡',
      'MagSafe 无线充电': '🔮',
      '定位': '📍',
      '在盒内的配件': '📦',
      '音频播放': '🎵',
      '视频播放': '🎥',
      '按键与接口': '🔘',
      '传感器': '🔬',
      '操作系统': '💻',
      '操作环境': '🌍',
      '环保特性': '🌱',
      '语言支持': '🌐'
    };

    let html = `
      <div class="spec-table-container">
        <h3>${modelName} 详细规格</h3>
        ${heroImage ? `<div class="spec-hero"><img src="${heroImage}" alt="${modelName}" class="spec-hero-img" /></div>` : ""}
        <div class="spec-controls" style="display: flex; gap: 8px; margin-bottom: 16px;">
          <button class="ghost" onclick="expandAllSpecCards()">📂 展开所有</button>
          <button class="ghost" onclick="collapseAllSpecCards()">📁 收起所有</button>
        </div>
        <div class="spec-card-grid">
    `;

    // 每个功能分类成为一张独立卡片
    official.sections.forEach((section, index) => {
      const title = section.title || '';
      const items = section.items || [];
      const lines = items.filter((x) => String(x || "").trim() !== "");
      if (lines.length === 0) return;

      // 获取对应图标
      const icon = Object.keys(sectionIcons).find(key => title.includes(key)) ? 
        sectionIcons[Object.keys(sectionIcons).find(key => title.includes(key))] : '📋';

      html += `
        <div class="spec-card" id="spec-card-${index}">
          <h4 class="spec-card-title" onclick="toggleSpecCard(${index})">
            <span class="spec-card-title-text"><span class="spec-icon">${icon}</span> ${title}</span>
            <span class="spec-card-toggle" id="spec-toggle-${index}">▼</span>
          </h4>
          <div class="spec-card-body" id="spec-body-${index}">
      `;

      lines.forEach((line) => {
        html += `<div class="spec-line">${line}</div>`;
      });

      html += `</div></div>`;
    });

    html += `</div></div>`;

    return html;
  }

  // 否则使用简化表格显示
  let html = `
    <div class="spec-table-container">
      <h3>${modelName} 详细规格</h3>
      <table class="spec-table">
        <tbody>
  `;

  const categoryOrder = ['屏幕', '处理器', '存储', '相机', '电池与充电', '设计', '颜色', '起售价'];

  for (const category of categoryOrder) {
    if (modelSpec[category]) {
      const categoryData = modelSpec[category];
      html += `<tr><th colspan="2">${category}</th></tr>`;
      if (typeof categoryData === 'object') {
        if (Array.isArray(categoryData)) {
          html += `<tr><td>${category}</td><td>${categoryData.join(', ')}</td></tr>`;
        } else {
          for (const [key, value] of Object.entries(categoryData)) {
            let displayValue = '';
            if (typeof value === 'boolean') {
              displayValue = value ? '支持' : '不支持';
            } else if (Array.isArray(value)) {
              displayValue = value.join(', ');
            } else if (typeof value === 'object') {
              displayValue = JSON.stringify(value).replace(/[{}\"]/g, '');
            } else {
              displayValue = value;
            }
            if (displayValue) {
              html += `<tr><td>${key}</td><td>${displayValue}</td></tr>`;
            }
          }
        }
      } else {
        html += `<tr><td>${category}</td><td>${categoryData}</td></tr>`;
      }
    }
  }

  html += `</tbody></table></div>`;
  return html;
}

// 更新日志功能
let changelogContent = '';

async function loadChangelog() {
  try {
    const response = await fetch('./CHANGELOG.md?t=' + Date.now());
    if (response.ok) {
      changelogContent = await response.text();
    } else {
      changelogContent = '# 更新日志\n\n暂无更新记录。';
    }
  } catch (e) {
    changelogContent = '# 更新日志\n\n无法加载更新记录。';
  }
}

function showChangelog() {
  const panel = document.getElementById('changelogPanel');
  const content = document.getElementById('changelogContent');
  if (panel && content) {
    // 将 Markdown 转换为 HTML
    const html = markdownToHtml(changelogContent);
    content.innerHTML = html;
    panel.style.display = 'flex';
  }
}

function hideChangelog() {
  const panel = document.getElementById('changelogPanel');
  if (panel) {
    panel.style.display = 'none';
  }
}

function markdownToHtml(md) {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/^--- (.+)$/gm, '<hr><p class="changelog-signature">$1</p>')
    .replace(/\n{2,}/g, '<br>');
}

// 页面加载时获取更新日志
loadChangelog();

// 展开/收起规格卡片
function toggleSpecCard(index) {
  const body = document.getElementById(`spec-body-${index}`);
  const toggle = document.getElementById(`spec-toggle-${index}`);
  if (!body) return;

  body.classList.toggle('collapsed');
  if (toggle) {
    toggle.classList.toggle('collapsed');
  }
}

function expandAllSpecCards() {
  const bodies = document.querySelectorAll('.spec-card-body');
  const toggles = document.querySelectorAll('.spec-card-toggle');
  bodies.forEach(body => body.classList.remove('collapsed'));
  toggles.forEach(toggle => toggle.classList.remove('collapsed'));
}

function collapseAllSpecCards() {
  const bodies = document.querySelectorAll('.spec-card-body');
  const toggles = document.querySelectorAll('.spec-card-toggle');
  bodies.forEach(body => body.classList.add('collapsed'));
  toggles.forEach(toggle => toggle.classList.add('collapsed'));
}

function resetFolders() {
  localStorage.removeItem(FOLDER_STORAGE_KEY);
  renderFolderTree();
}

// 展开/收起所有目录
let allFoldersExpanded = false;

function toggleAllFolders() {
  const folders = loadFolders();
  allFoldersExpanded = !allFoldersExpanded;
  folders.forEach(folder => {
    expandedFolders[folder.id] = allFoldersExpanded;
  });
  const icon = document.getElementById('toggleFoldersIcon');
  const text = document.getElementById('toggleFoldersText');
  if (icon) {
    icon.textContent = allFoldersExpanded ? '📁' : '📂';
  }
  if (text) {
    text.textContent = allFoldersExpanded ? '收起' : '展开';
  }
  renderFolderTree();
}

// 绑定展开/收起所有目录按钮
const toggleFoldersBtn = document.getElementById('toggleFoldersBtn');
if (toggleFoldersBtn) {
  toggleFoldersBtn.addEventListener('click', toggleAllFolders);
}

function deleteFolder(folderId) {
  const folders = loadFolders();
  const notes = loadNotes();

  // 递归删除文件夹及其子文件夹
  const foldersToDelete = [];
  const getFoldersToDelete = (id) => {
    foldersToDelete.push(id);
    folders.filter(f => f.parent === id).forEach(child => {
      getFoldersToDelete(child.id);
    });
  };
  getFoldersToDelete(folderId);

  // 删除相关的笔记
  const filteredNotes = notes.filter(note => !foldersToDelete.includes(note.folderId));

  // 删除文件夹
  const filteredFolders = folders.filter(folder => !foldersToDelete.includes(folder.id));

  saveFolders(filteredFolders);
  saveNotes(filteredNotes);

  // 如果删除的是当前选中的文件夹，切换到根目录
  if (currentFolderId === folderId || foldersToDelete.includes(currentFolderId)) {
    selectFolder("all");
  } else {
    renderFolderTree();
    renderNotes(loadNotes());
  }
}

function validateFolderStructure() {
  const folders = loadFolders();
  console.log("=== 当前文件夹结构验证 ===");

  const series = folders.filter(f => f.parent === "all" && f.id !== "all");
  console.log(`总系列/目录数量: ${series.length}`);

  // 定义预期的iPhone系列和型号（基于苹果官网2026年产品线）
  const expectedSeries = {
    "iPhone 17 系列": ["iPhone 17", "iPhone 17 Pro", "iPhone 17 Pro Max", "iPhone 17e"],
    "iPhone Air 系列": ["iPhone Air"],
    "iPhone 16 系列": ["iPhone 16", "iPhone 16 Pro", "iPhone 16 Pro Max"],
    "iPhone 15 系列": ["iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max"],
    "iPhone 14 系列": ["iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max"],
    "iPhone 13 系列": ["iPhone 13", "iPhone 13 mini", "iPhone 13 Pro", "iPhone 13 Pro Max"],
    "iPhone 12 系列": ["iPhone 12", "iPhone 12 mini", "iPhone 12 Pro", "iPhone 12 Pro Max"],
    "iPhone 11 系列": ["iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max"],
    "iPhone X 及早期系列": ["iPhone X", "iPhone XS", "iPhone XS Max", "iPhone XR", "iPhone 8", "iPhone 8 Plus", "iPhone SE (第二代)"]
  };

  let customFoldersCount = 0;

  series.forEach(serie => {
    const models = folders.filter(f => f.parent === serie.id);
    const isIPhoneSeries = serie.name.includes("iPhone") && serie.name.includes("系列");

    if (isIPhoneSeries) {
      console.log(`\n📱 ${serie.name} (${models.length} 个型号):`);

      const expectedModels = expectedSeries[serie.name] || [];
      console.log(`  预期型号: ${expectedModels.join(", ")}`);
      console.log(`  实际型号: ${models.map(m => m.name).join(", ")}`);

      // 检查是否有缺失的型号
      const missingModels = expectedModels.filter(em => !models.some(m => m.name === em));
      if (missingModels.length > 0) {
        console.warn(`  ⚠️ 缺失型号: ${missingModels.join(", ")}`);
      }

      // 检查是否有额外的型号
      const extraModels = models.filter(m => !expectedModels.includes(m.name));
      if (extraModels.length > 0) {
        console.warn(`  ⚠️ 额外型号: ${extraModels.map(m => m.name).join(", ")}`);
      }

      if (missingModels.length === 0 && extraModels.length === 0) {
        console.log(`  ✓ 分类正确`);
      }
    } else {
      // 用户自定义的目录
      customFoldersCount++;
      console.log(`\n📁 自定义目录: ${serie.name} (${models.length} 个子目录) [右键可删除]`);
      if (models.length > 0) {
        console.log(`  子目录: ${models.map(m => m.name).join(", ")}`);
      }
    }
  });

  console.log(`\n📊 统计信息:`);
  console.log(`  iPhone系列: ${series.length - customFoldersCount} 个`);
  console.log(`  自定义目录: ${customFoldersCount} 个`);

  // 检查是否有重复的型号名称
  const allModelNames = folders.filter(f => f.parent !== "all" && f.parent !== null).map(f => f.name);
  const duplicates = allModelNames.filter((name, index) => allModelNames.indexOf(name) !== index);
  if (duplicates.length > 0) {
    console.error("❌ 发现重复型号:", duplicates);
  } else {
    console.log("✓ 没有重复的型号名称");
  }

  // 检查是否有型号没有被分配到系列中
  const rootModels = folders.filter(f => f.parent === "all" && f.id !== "all" && !f.name.includes("系列"));
  if (rootModels.length > 0) {
    console.warn("⚠️ 发现直接在根目录下的型号（应该在系列中）:", rootModels.map(m => m.name));
  }

  console.log("\n=== 验证完成 ===");
  return folders;
}

// 更新数据统计
function updateStats(folders) {
  const statsBar = document.getElementById('statsBar');
  if (!statsBar) return;
  
  const notes = loadNotes();
  const specs = loadSpecs();
  
  // 统计数据
  const totalFolders = folders.filter(f => f.id !== "all").length;
  const totalNotes = notes.length;
  const totalModels = Object.keys(specs.iPhone规格集 || specs.iphone_specs || {}).length;
  
  // 获取当前选中的文件夹的笔记数量
  const currentNotesCount = notes.length; // 简化处理，显示总数
  
  statsBar.innerHTML = `
    <div class="stats-item">
      <span class="stats-number">${totalFolders}</span>
      <span class="stats-label">目录</span>
    </div>
    <div class="stats-item">
      <span class="stats-number">${totalNotes}</span>
      <span class="stats-label">笔记</span>
    </div>
    <div class="stats-item">
      <span class="stats-number">${totalModels}</span>
      <span class="stats-label">型号</span>
    </div>
  `;
}

function renderFolderTree() {
  const folders = loadFolders();
  folderTreeEl.innerHTML = "";
  
  // 更新数据统计
  updateStats(folders);

  const buildTree = (parentId, level = 0) => {
    const ul = document.createElement("ul");
    ul.classList.add("folder-tree");

    // 获取子文件夹并排序
    let children = folders.filter(f => f.parent === parentId);
    if (sortOrder === "name") {
      children.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "date-desc") {
      children.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } else if (sortOrder === "date-asc") {
      children.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    }

    children.forEach(folder => {
      const li = document.createElement("li");
      li.classList.add("folder-item");

      // 检查是否有子文件夹
      const hasChildren = folders.some(f => f.parent === folder.id);
      const isExpanded = expandedFolders[folder.id];

      // 创建按钮
      const btn = document.createElement("button");
      btn.classList.add("folder-btn");
      if (folder.id === currentFolderId) btn.classList.add("active");

      // 展开图标
      const expandIcon = hasChildren ? (isExpanded ? "▼" : "▶") : "•";
      
      btn.innerHTML = `
        <span class="expand-icon">${expandIcon}</span>
        <span class="folder-name">${folder.name}</span>
      `;

      // 点击逻辑：有子目录就展开/收起，没有就进入
      btn.onclick = (e) => {
        e.stopPropagation();
        if (hasChildren) {
          // 有子目录：切换展开/收起
          expandedFolders[folder.id] = !expandedFolders[folder.id];
          renderFolderTree();
        }
        // 无论有没有子目录，都进入该目录
        selectFolder(folder.id);
      };

      // 右键菜单（收藏/删除）
      btn.oncontextmenu = (e) => {
        e.preventDefault();

        const isFav = isFavorite(folder.id);
        const favAction = isFav ? '取消收藏' : '收藏';

        if (folder.id.startsWith("f_")) {
          // 自定义目录：收藏 + 删除
          if (confirm(`确定要${favAction}目录 "${folder.name}" 吗？`)) {
            if (!isFav) {
              toggleFavorite(folder.id, folder.name);
            } else {
              if (confirm(`确定要删除目录 "${folder.name}" 吗？\n\n注意：这将同时删除该目录下的所有笔记和子目录！`)) {
                deleteFolder(folder.id);
              }
            }
          }
        } else {
          // 系统目录：只切换收藏状态
          toggleFavorite(folder.id, folder.name);
        }
      };

      li.appendChild(btn);

      // 递归添加子文件夹（如果展开）
      if (hasChildren && isExpanded) {
        const childrenUl = buildTree(folder.id, level + 1);
        if (childrenUl.children.length > 0) {
          li.appendChild(childrenUl);
        }
      }

      ul.appendChild(li);
    });

    return ul;
  };
  
  const tree = buildTree("all", 0);
  folderTreeEl.appendChild(tree);
}

function selectFolder(folderId) {
  currentFolderId = folderId;
  const folders = loadFolders();
  const folder = folders.find(f => f.id === folderId);
  if (folder) {
    currentFolderEl.textContent = folder.name;
    updateBreadcrumb(folders, folderId);
  }
  renderFolderTree();
  renderNotes(loadNotes());

  // 显示规格表格（支持 iPhone / iPad / MacBook / Watch）
  const specsContainer = document.getElementById("specsContainer");
  if (specsContainer) {
    const modelName = folder ? folder.name : "";
    const specs = loadSpecs();

    // 搜索所有品类规格集
    let modelSpec = null;
    const allSpecSets = [
      specs.iPhone规格集, specs.iphone_specs,
      specs.iPad规格集,
      specs.MacBook规格集,
      specs.Watch规格集
    ];
    
    for (const specSet of allSpecSets) {
      if (specSet && specSet[modelName]) {
        modelSpec = specSet[modelName];
        break;
      }
    }

    if (modelSpec) {
      specsContainer.innerHTML = generateSpecTable(modelName, modelSpec);
      specsContainer.style.display = "block";
    } else {
      specsContainer.style.display = "none";
    }
  }
}

// 更新面包屑导航
function updateBreadcrumb(folders, folderId) {
  const breadcrumb = document.getElementById('breadcrumb');
  if (!breadcrumb) return;

  const path = [];
  let currentId = folderId;

  while (currentId && currentId !== "all") {
    const folder = folders.find(f => f.id === currentId);
    if (folder) {
      path.unshift(folder);
      currentId = folder.parent;
    } else {
      break;
    }
  }

  // 添加"所有笔记"
  path.unshift({ id: "all", name: "所有笔记" });

  let html = '';
  path.forEach((folder, index) => {
    if (index > 0) {
      html += '<span class="breadcrumb-separator">›</span>';
    }
    if (folder.id === "all") {
      html += `<a href="#" class="breadcrumb-link" data-folder="all">${folder.name}</a>`;
    } else if (index === path.length - 1) {
      html += `<span class="breadcrumb-current">${folder.name}</span>`;
    } else {
      html += `<a href="#" class="breadcrumb-link" data-folder="${folder.id}">${folder.name}</a>`;
    }
  });

  breadcrumb.innerHTML = html;

  // 绑定点击事件
  breadcrumb.querySelectorAll('.breadcrumb-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const folderId = e.target.dataset.folder;
      if (folderId) {
        selectFolder(folderId);
      }
    });
  });
}

function formatTime(ts) {
  const date = new Date(ts);
  return date.toLocaleString();
}

function renderNotes(notes, isSearchResult = false) {
  notesEl.innerHTML = "";

  // 如果不是"所有笔记"，需要过滤笔记
  let filteredNotes = notes;
  if (currentFolderId !== "all") {
    // 这里可以根据folderId过滤笔记，暂时显示所有
    filteredNotes = notes;
  }

  if (filteredNotes.length === 0) {
    if (isSearchResult) {
      notesEl.innerHTML = "<div class=\"note\"><p>没有找到匹配的笔记，请尝试其他关键词。</p></div>";
    } else {
      notesEl.innerHTML = "<div class=\"note\"><p>还没有笔记，先写一条吧。</p></div>";
    }
    return;
  }

  filteredNotes.forEach((note, index) => {
    const card = document.createElement("div");
    card.className = "note";
    card.innerHTML = `
      <div class="note-header">
        <h3 contenteditable="true" data-field="title" data-index="${index}">${note.title}</h3>
        <button class="note-copy-btn" title="复制内容">📋</button>
      </div>
      <p contenteditable="true" data-field="content" data-index="${index}">${note.content}</p>
      <div class="meta">${formatTime(note.updatedAt)}</div>
    `;
    
    // 绑定复制按钮
    const copyBtn = card.querySelector('.note-copy-btn');
    copyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(note.content).then(() => {
        copyBtn.textContent = '✅';
        setTimeout(() => {
          copyBtn.textContent = '📋';
        }, 1500);
      }).catch(() => {
        // 降级方案：使用传统复制方法
        const textarea = document.createElement('textarea');
        textarea.value = note.content;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        copyBtn.textContent = '✅';
        setTimeout(() => {
          copyBtn.textContent = '📋';
        }, 1500);
      });
    });
    
    notesEl.appendChild(card);
  });
}

function addNote() {
  const title = titleInput.value.trim() || "未命名";
  const content = contentInput.value.trim();
  if (!content) return;

  const notes = loadNotes();
  notes.unshift({
    title,
    content,
    updatedAt: Date.now(),
  });
  saveNotes(notes);
  titleInput.value = "";
  contentInput.value = "";
  renderNotes(notes);
}

function updateNote(index, field, value) {
  const notes = loadNotes();
  if (!notes[index]) return;
  notes[index][field] = value;
  notes[index].updatedAt = Date.now();
  saveNotes(notes);
  renderNotes(notes);
}

function clearNotes() {
  localStorage.removeItem(STORAGE_KEY);
  renderNotes([]);
}

addBtn.addEventListener("click", addNote);
clearBtn.addEventListener("click", clearNotes);

const sortSelect = document.getElementById("sortSelect");
sortSelect.addEventListener("change", (e) => {
  sortOrder = e.target.value;
  renderFolderTree();
});

const resetFoldersBtn = document.getElementById("resetFoldersBtn");
resetFoldersBtn.addEventListener("click", () => {
  if (confirm("确定要重置目录结构吗？这将清除所有自定义目录。")) {
    resetFolders();
  }
});

const validateBtn = document.getElementById("validateBtn");
validateBtn.addEventListener("click", () => {
  validateFolderStructure();
  alert("目录结构验证完成，请查看浏览器控制台 (F12) 查看详细结果。");
});

addFolderBtn.addEventListener("click", () => {
  // 首先让用户选择添加的级别
  const levelChoice = prompt("选择目录级别：\n1. 一级目录（添加到根目录）\n2. 二级目录（添加到当前目录下）\n\n请输入 1 或 2：");

  if (levelChoice !== "1" && levelChoice !== "2") {
    alert("请输入有效的选择（1 或 2）");
    return;
  }

  const name = prompt("输入目录名称:");
  if (!name || !name.trim()) return;

  const folders = loadFolders();
  let parentId;

  if (levelChoice === "1") {
    // 添加一级目录
    parentId = "all";
  } else {
    // 添加二级目录
    parentId = currentFolderId;
  }

  const newFolder = {
    id: "f_" + Date.now(),
    name: name.trim(),
    parent: parentId,
    createdAt: Date.now()
  };

  folders.push(newFolder);
  saveFolders(folders);
  renderFolderTree();
});

notesEl.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  const target = event.target;
  if (!target.dataset) return;
  event.preventDefault();
  const index = Number(target.dataset.index);
  const field = target.dataset.field;
  updateNote(index, field, target.textContent.trim());
});

// 收藏功能
function loadFavorites() {
  const raw = localStorage.getItem(FAVORITES_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function toggleFavorite(folderId, folderName) {
  const favorites = loadFavorites();
  const index = favorites.findIndex(f => f.id === folderId);
  
  if (index >= 0) {
    // 已收藏，取消收藏
    favorites.splice(index, 1);
    console.log(`已取消收藏: ${folderName}`);
  } else {
    // 未收藏，添加收藏
    favorites.push({ id: folderId, name: folderName, addedAt: Date.now() });
    console.log(`已收藏: ${folderName}`);
  }
  
  saveFavorites(favorites);
  renderFavorites();
  renderFolderTree();
}

function isFavorite(folderId) {
  const favorites = loadFavorites();
  return favorites.some(f => f.id === folderId);
}

function renderFavorites() {
  const favorites = loadFavorites();
  const favoritesContainer = document.getElementById('favoritesContainer');
  if (!favoritesContainer) return;
  
  if (favorites.length === 0) {
    favoritesContainer.innerHTML = '<div class="favorites-empty">暂无收藏，右键目录添加收藏</div>';
    return;
  }
  
  let html = '<div class="favorites-list">';
  favorites.forEach(fav => {
    const isCurrentFolder = fav.id === currentFolderId;
    html += `
      <div class="favorite-item ${isCurrentFolder ? 'active' : ''}" data-folder-id="${fav.id}">
        <button class="favorite-btn" title="点击跳转">${fav.name}</button>
        <button class="unfavorite-btn" title="取消收藏" data-folder-id="${fav.id}">✕</button>
      </div>
    `;
  });
  html += '</div>';
  
  favoritesContainer.innerHTML = html;
  
  // 绑定事件
  favoritesContainer.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const folderId = e.target.closest('.favorite-item').dataset.folderId;
      if (folderId) {
        selectFolder(folderId);
      }
    });
  });
  
  favoritesContainer.querySelectorAll('.unfavorite-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const folderId = e.target.dataset.folderId;
      const fav = favorites.find(f => f.id === folderId);
      if (fav) {
        toggleFavorite(folderId, fav.name);
      }
    });
  });
}

// 搜索功能优化：实时搜索、规格数据搜索、高亮匹配
let searchTimeout = null;

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  
  // 清除之前的延迟搜索
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  // 如果搜索词为空，显示所有笔记
  if (query === "") {
    renderNotes(loadNotes());
    renderFolderTree();
    return;
  }
  
  // 延迟 300ms 执行搜索（防抖）
  searchTimeout = setTimeout(() => {
    performSearch(query.toLowerCase());
  }, 300);
});

function performSearch(query) {
  const results = {
    notes: [],
    folders: [],
    specs: []
  };
  
  // 1. 搜索笔记
  const notes = loadNotes();
  results.notes = notes.filter((note) => {
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });
  
  // 2. 搜索目录
  const folders = loadFolders();
  results.folders = folders.filter((folder) => {
    return folder.name.toLowerCase().includes(query) && folder.id !== "all";
  });
  
  // 3. 搜索规格数据（深度搜索规格内容）
  results.specs = searchSpecsData(query);
  
  // 渲染搜索结果
  renderSearchResults(results, query);
}

function searchSpecsData(query) {
  const specs = loadSpecs();
  const matchingModels = [];
  
  // 搜索所有品类规格集
  const allSpecSets = [
    specs.iPhone规格集, specs.iphone_specs,
    specs.iPad规格集,
    specs.MacBook规格集,
    specs.Watch规格集
  ];
  
  for (const specsData of allSpecSets) {
    if (!specsData) continue;
    for (const [modelName, modelData] of Object.entries(specsData)) {
      let isMatch = false;
      let matchDetails = [];
      
      // 搜索型号名称
      if (modelName.toLowerCase().includes(query)) {
        isMatch = true;
      }
      
      // 深度搜索 official_data.sections 中的规格内容
      const official = modelData?.official_data;
      if (official?.sections) {
        official.sections.forEach(section => {
          if (section.title && section.title.toLowerCase().includes(query)) {
            isMatch = true;
            matchDetails.push({ type: 'section', title: section.title });
          }
          
          if (section.items) {
            section.items.forEach(item => {
              const itemStr = String(item || '');
              if (itemStr.toLowerCase().includes(query)) {
                isMatch = true;
                if (!matchDetails.find(d => d.type === 'content')) {
                  matchDetails.push({ type: 'content', text: itemStr.substring(0, 50) });
                }
              }
            });
          }
        });
      }
      
      if (isMatch) {
        matchingModels.push({ modelName, modelData, matchDetails });
      }
    }
  }
  
  return matchingModels;
}

function renderSearchResults(results, query) {
  notesEl.innerHTML = "";
  
  const hasResults = results.notes.length > 0 || results.folders.length > 0 || results.specs.length > 0;
  
  if (!hasResults) {
    notesEl.innerHTML = `<div class="note"><p>没有找到匹配"${query}"的结果</p></div>`;
    return;
  }
  
  // 显示统计信息
  const statsDiv = document.createElement("div");
  statsDiv.className = "search-stats";
  const totalResults = results.notes.length + results.folders.length + results.specs.length;
  statsDiv.innerHTML = `找到 ${totalResults} 个结果 (${results.notes.length} 笔记, ${results.folders.length} 目录, ${results.specs.length} 型号)`;
  notesEl.appendChild(statsDiv);
  
  // 显示匹配的目录
  if (results.folders.length > 0) {
    const folderHeader = document.createElement("div");
    folderHeader.className = "search-section-header";
    folderHeader.textContent = `📁 目录 (${results.folders.length})`;
    notesEl.appendChild(folderHeader);
    
    results.folders.forEach(folder => {
      const card = document.createElement("div");
      card.className = "note search-folder-result";
      card.innerHTML = `
        <h3>${highlightText(folder.name, query)}</h3>
        <div class="meta">点击跳转到目录</div>
      `;
      card.addEventListener("click", () => {
        selectFolder(folder.id);
        searchInput.value = "";
      });
      notesEl.appendChild(card);
    });
  }
  
  // 显示匹配的笔记
  if (results.notes.length > 0) {
    const noteHeader = document.createElement("div");
    noteHeader.className = "search-section-header";
    noteHeader.textContent = `📝 笔记 (${results.notes.length})`;
    notesEl.appendChild(noteHeader);
    
    results.notes.forEach((note, index) => {
      const card = document.createElement("div");
      card.className = "note search-note-result";
      card.innerHTML = `
        <h3>${highlightText(note.title, query)}</h3>
        <p>${highlightText(note.content, query)}</p>
        <div class="meta">${formatTime(note.updatedAt)}</div>
      `;
      notesEl.appendChild(card);
    });
  }
  
  // 显示匹配的型号
  if (results.specs.length > 0) {
    const specHeader = document.createElement("div");
    specHeader.className = "search-section-header";
    specHeader.textContent = `📱 型号规格 (${results.specs.length})`;
    notesEl.appendChild(specHeader);
    
    results.specs.forEach(({ modelName, modelData, matchDetails }) => {
      const card = document.createElement("div");
      card.className = "note search-spec-result";
      
      // 获取简要信息
      const official = modelData?.official_data;
      let briefInfo = '';
      if (official?.image_og) {
        briefInfo = `<img src="${official.image_og}" alt="${modelName}" class="search-spec-thumb" />`;
      }
      
      // 显示匹配详情
      let matchInfo = '';
      if (matchDetails.length > 0) {
        const preview = matchDetails.slice(0, 2).map(d => {
          if (d.type === 'section') return `📌 ${d.title}`;
          if (d.type === 'content') return `"${d.text}..."`;
          return '';
        }).join(' · ');
        matchInfo = `<div class="search-spec-match">${preview}</div>`;
      }
      
      card.innerHTML = `
        <h3>${highlightText(modelName, query)}</h3>
        ${briefInfo}
        ${matchInfo}
        <div class="meta">点击查看完整规格</div>
      `;
      card.addEventListener("click", () => {
        selectFolder(modelName);
        searchInput.value = "";
      });
      notesEl.appendChild(card);
    });
  }
}

function highlightText(text, query) {
  if (!query || !text) return String(text);
  const textStr = String(text);
  const regex = new RegExp(`(${query})`, 'gi');
  return textStr.replace(regex, '<mark class="search-highlight">$1</mark>');
}

// 验证文件夹结构
validateFolderStructure();

// 编辑模式功能
const editModeBtn = document.getElementById("editModeBtn");
const resetBtn = document.getElementById("resetBtn");
const app = document.querySelector(".app");
const sidebar = document.querySelector(".sidebar");
const mainContent = document.querySelector(".main-content");

let draggedElement = null;
let resizeElement = null;
let startX, startY, startWidth, startHeight;

// 加载保存的布局
function loadLayout() {
  const saved = localStorage.getItem(LAYOUT_STORAGE_KEY);
  if (saved) {
    const layout = JSON.parse(saved);
    
    if (layout.sidebar) {
      sidebar.style.width = layout.sidebar.width || '240px';
      sidebar.style.position = 'relative';
      sidebar.style.left = layout.sidebar.left || '0px';
      sidebar.style.top = layout.sidebar.top || '0px';
    }
    
    if (layout.mainContent) {
      mainContent.style.width = layout.mainContent.width || 'auto';
      mainContent.style.position = 'relative';
      mainContent.style.left = layout.mainContent.left || '0px';
      mainContent.style.top = layout.mainContent.top || '0px';
    }
  }
}

// 保存当前布局
function saveLayout() {
  const layout = {
    sidebar: {
      width: sidebar.style.width,
      left: sidebar.style.left,
      top: sidebar.style.top
    },
    mainContent: {
      width: mainContent.style.width,
      left: mainContent.style.left,
      top: mainContent.style.top
    }
  };
  localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layout));
}

// 重置布局
function resetLayout() {
  localStorage.removeItem(LAYOUT_STORAGE_KEY);
  sidebar.style.width = '';
  sidebar.style.position = '';
  sidebar.style.left = '';
  sidebar.style.top = '';
  mainContent.style.width = '';
  mainContent.style.position = '';
  mainContent.style.left = '';
  mainContent.style.top = '';
}

// 显示布局信息（调试用）
function showLayoutInfo() {
  const layout = JSON.parse(localStorage.getItem(LAYOUT_STORAGE_KEY) || '{}');
  console.log('当前布局信息:', layout);
  
  if (Object.keys(layout).length === 0) {
    console.log('使用默认布局');
  } else {
    console.log('使用自定义布局');
  }
}

// 在编辑模式切换时显示布局信息
function toggleEditMode() {
  isEditMode = !isEditMode;
  
  if (isEditMode) {
    app.classList.add('edit-mode');
    editModeBtn.textContent = '✅ 保存布局 (ESC退出)';
    editModeBtn.classList.add('active');
    
    showEditNotification();
    makeDraggable(sidebar);
    makeDraggable(mainContent);
    makeResizable(sidebar);
    makeResizable(mainContent);
    
  } else {
    app.classList.remove('edit-mode');
    editModeBtn.textContent = '✏️ 编辑界面';
    editModeBtn.classList.remove('active');
    
    saveLayout();
    showLayoutInfo(); // 显示保存的布局信息
    
    removeDraggable(sidebar);
    removeDraggable(mainContent);
    removeResizable(sidebar);
    removeResizable(mainContent);
    
    hideEditNotification();
  }
}

// 显示编辑模式通知
function showEditNotification() {
  const notification = document.createElement('div');
  notification.className = 'edit-mode-notification';
  notification.innerHTML = `
    <div style="margin-bottom: 8px;"><strong>编辑模式已启用</strong></div>
    <div style="font-size: 12px; color: #666;">
      • 拖拽元素移动位置<br>
      • 拖拽右侧手柄调整宽度<br>
      • ESC键或点击按钮保存退出
    </div>
    <button onclick="resetLayout(); hideEditNotification(); showLayoutResetNotification();">重置布局</button>
  `;
  document.body.appendChild(notification);
  
  // 5秒后自动隐藏
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}

// 显示布局重置通知
function showLayoutResetNotification() {
  const notification = document.createElement('div');
  notification.className = 'edit-mode-notification';
  notification.innerHTML = `
    <div><strong>布局已重置</strong></div>
    <div style="font-size: 12px; color: #666; margin-top: 4px;">
      刷新页面查看默认布局
    </div>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);
}

// 隐藏编辑模式通知
function hideEditNotification() {
  const notification = document.querySelector('.edit-mode-notification');
  if (notification) {
    notification.remove();
  }
}

// 使元素可拖拽
function makeDraggable(element) {
  element.style.cursor = 'move';
  
  element.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', endDrag);
}

// 移除拖拽功能
function removeDraggable(element) {
  element.style.cursor = '';
  element.removeEventListener('mousedown', startDrag);
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', endDrag);
}

// 开始拖拽
function startDrag(e) {
  // 防止在编辑模式下拖拽时触发其他事件
  if (!isEditMode) return;
  
  // 忽略按钮、输入框、文本框等交互元素
  if (e.target.closest('button') || 
      e.target.closest('input') || 
      e.target.closest('textarea') || 
      e.target.closest('select') ||
      e.target.closest('.folder-btn') ||
      e.target.closest('.edit-mode-btn')) {
    return;
  }
  
  draggedElement = e.currentTarget;
  startX = e.clientX - (parseInt(draggedElement.style.left) || 0);
  startY = e.clientY - (parseInt(draggedElement.style.top) || 0);
  
  draggedElement.style.zIndex = '1000';
  e.preventDefault();
}

// 拖拽过程
function drag(e) {
  if (!draggedElement) return;
  
  const newLeft = e.clientX - startX;
  const newTop = e.clientY - startY;
  
  draggedElement.style.left = newLeft + 'px';
  draggedElement.style.top = newTop + 'px';
}

// 结束拖拽
function endDrag() {
  if (draggedElement) {
    draggedElement.style.zIndex = '';
    draggedElement = null;
  }
}

// 使元素可调整大小
function makeResizable(element) {
  // 使用CSS ::before 伪元素作为调整大小的手柄
  element.addEventListener('mousedown', handleResizeStart);
}

// 移除调整大小功能
function removeResizable(element) {
  element.removeEventListener('mousedown', handleResizeStart);
}

// 处理调整大小开始
function handleResizeStart(e) {
  // 检查是否点击了调整大小手柄（通过位置判断）
  const rect = e.currentTarget.getBoundingClientRect();
  const isResizeHandle = e.clientX > rect.right - 30 && 
                        e.clientY > rect.top + rect.height / 2 - 15 && 
                        e.clientY < rect.top + rect.height / 2 + 15;
  
  if (isResizeHandle && isEditMode) {
    e.stopPropagation();
    resizeElement = e.currentTarget;
    startX = e.clientX;
    startWidth = resizeElement.offsetWidth;
    
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleResizeEnd);
  }
}

// 处理调整大小
function handleResize(e) {
  if (!resizeElement) return;
  
  const newWidth = startWidth + (e.clientX - startX);
  if (newWidth > 200 && newWidth < 800) { // 限制最小和最大宽度
    resizeElement.style.width = newWidth + 'px';
  }
}

// 结束调整大小
function handleResizeEnd() {
  resizeElement = null;
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', handleResizeEnd);
}

// 绑定编辑模式按钮
editModeBtn.addEventListener('click', toggleEditMode);

// 绑定更新日志按钮
const changelogBtn = document.getElementById('changelogBtn');
const changelogClose = document.getElementById('changelogClose');

if (changelogBtn) {
  changelogBtn.addEventListener('click', showChangelog);
}

if (changelogClose) {
  changelogClose.addEventListener('click', hideChangelog);
}

// 点击面板外部关闭更新日志
const changelogPanel = document.getElementById('changelogPanel');
if (changelogPanel) {
  changelogPanel.addEventListener('click', (e) => {
    if (e.target === changelogPanel) {
      hideChangelog();
    }
  });
}

// 还原模板功能
function resetToTemplate() {
  if (confirm('确定要还原到初始模板吗？这将清除所有自定义布局和文件夹结构。')) {
    // 重置布局
    resetLayout();
    
    // 重置文件夹结构
    resetFolders();
    
    // 重新加载页面以应用默认布局
    location.reload();
  }
}

// 绑定还原按钮
resetBtn.addEventListener('click', resetToTemplate);

// 添加键盘快捷键
document.addEventListener('keydown', (e) => {
  // ESC键退出编辑模式或关闭面板
  if (e.key === 'Escape') {
    if (isEditMode) {
      toggleEditMode();
    }
    const changelogPanel = document.getElementById('changelogPanel');
    if (changelogPanel && changelogPanel.style.display === 'flex') {
      hideChangelog();
    }
    const composePanel = document.getElementById('composePanel');
    if (composePanel && composePanel.style.display === 'flex') {
      hideComposePanel();
    }
  }
  
  // Ctrl/Cmd + F 聚焦搜索框
  if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
  
  // Ctrl/Cmd + N 新建笔记
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault();
    titleInput.focus();
  }
  
  // Ctrl/Cmd + D 切换深色模式
  if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
    e.preventDefault();
    toggleDarkMode();
  }
});

// 最近访问记录
function loadRecent() {
  const raw = localStorage.getItem(RECENT_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveRecent(recent) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
}

function addToRecent(folderId, folderName) {
  let recent = loadRecent();
  // 移除已存在的相同项
  recent = recent.filter(r => r.id !== folderId);
  // 添加到开头
  recent.unshift({ id: folderId, name: folderName, visitedAt: Date.now() });
  // 只保留最近 10 个
  recent = recent.slice(0, 10);
  saveRecent(recent);
}

function renderRecent() {
  const recent = loadRecent();
  const recentContainer = document.getElementById('recentContainer');
  if (!recentContainer) return;
  
  if (recent.length === 0) {
    recentContainer.innerHTML = '<div class="recent-empty">暂无最近访问</div>';
    return;
  }
  
  let html = '<div class="recent-list">';
  recent.forEach(item => {
    const isCurrentFolder = item.id === currentFolderId;
    const timeAgo = getTimeAgo(item.visitedAt);
    html += `
      <div class="recent-item ${isCurrentFolder ? 'active' : ''}" data-folder-id="${item.id}">
        <span class="recent-time">${timeAgo}</span>
        <span class="recent-name">${item.name}</span>
      </div>
    `;
  });
  html += '</div>';
  
  recentContainer.innerHTML = html;
  
  // 绑定点击事件
  recentContainer.querySelectorAll('.recent-item').forEach(item => {
    item.addEventListener('click', () => {
      const folderId = item.dataset.folderId;
      if (folderId) {
        selectFolder(folderId);
      }
    });
  });
}

function getTimeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (seconds < 60) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  return `${Math.floor(hours / 24)}天前`;
}

// 深色模式
function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem(DARK_MODE_KEY, isDark);
  updateDarkModeButton(isDark);
}

function updateDarkModeButton(isDark) {
  const darkModeBtn = document.getElementById('darkModeBtn');
  if (darkModeBtn) {
    darkModeBtn.textContent = isDark ? '☀️ 浅色模式' : '🌙 深色模式';
  }
}

function initDarkMode() {
  const isDark = localStorage.getItem(DARK_MODE_KEY) === 'true';
  if (isDark) {
    document.body.classList.add('dark-mode');
  }
  updateDarkModeButton(isDark);
}

// 修改 selectFolder 函数，添加最近访问记录
const originalSelectFolder = selectFolder;
selectFolder = function(folderId) {
  const folders = loadFolders();
  const folder = folders.find(f => f.id === folderId);
  if (folder) {
    addToRecent(folder.id, folder.name);
    renderRecent();
  }
  originalSelectFolder(folderId);
};

// 页面加载时恢复布局
loadLayout();

// 导出功能
function exportNotes() {
  const notes = loadNotes();
  const folders = loadFolders();
  
  // 生成 Markdown 格式的笔记
  let markdown = '# 轻量笔记 - 导出\n\n';
  markdown += `> 导出时间：${new Date().toLocaleString('zh-CN')}\n\n`;
  markdown += `> 笔记数量：${notes.length} | 目录数量：${folders.length}\n\n`;
  markdown += '---\n\n';
  
  // 按目录组织笔记
  const notesByFolder = {};
  notes.forEach(note => {
    const folderId = note.folderId || 'uncategorized';
    if (!notesByFolder[folderId]) {
      notesByFolder[folderId] = [];
    }
    notesByFolder[folderId].push(note);
  });
  
  // 输出每个目录的笔记
  for (const [folderId, folderNotes] of Object.entries(notesByFolder)) {
    const folder = folders.find(f => f.id === folderId);
    const folderName = folder ? folder.name : '未分类';
    
    markdown += `## ${folderName}\n\n`;
    
    folderNotes.forEach(note => {
      markdown += `### ${note.title}\n\n`;
      markdown += `${note.content}\n\n`;
      markdown += `*更新时间：${new Date(note.updatedAt).toLocaleString('zh-CN')}*\n\n`;
      markdown += '---\n\n';
    });
  }
  
  // 创建下载链接
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `轻量笔记_${new Date().toISOString().slice(0, 10)}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 绑定导出按钮
const exportBtn = document.getElementById('exportBtn');
if (exportBtn) {
  exportBtn.addEventListener('click', exportNotes);
}

// 深色模式按钮
const darkModeBtn = document.getElementById('darkModeBtn');
if (darkModeBtn) {
  darkModeBtn.addEventListener('click', toggleDarkMode);
}

// 新增笔记悬浮窗切换
function toggleComposePanel() {
  const panel = document.getElementById('composePanel');
  if (!panel) return;
  const isVisible = panel.style.display === 'flex';
  panel.style.display = isVisible ? 'none' : 'flex';
  if (!isVisible) {
    titleInput.focus();
  }
}

function hideComposePanel() {
  const panel = document.getElementById('composePanel');
  if (panel) panel.style.display = 'none';
}

const composeToggleBtn = document.getElementById('composeToggleBtn');
if (composeToggleBtn) {
  composeToggleBtn.addEventListener('click', toggleComposePanel);
}

const composeCloseBtn = document.getElementById('composeClose');
if (composeCloseBtn) {
  composeCloseBtn.addEventListener('click', hideComposePanel);
}

// 点击面板外部关闭
const composePanel = document.getElementById('composePanel');
if (composePanel) {
  composePanel.addEventListener('click', (e) => {
    if (e.target === composePanel) {
      hideComposePanel();
    }
  });
}

// 返回顶部按钮
const scrollToTopBtn = document.getElementById('scrollToTop');
if (scrollToTopBtn) {
  // 监听滚动事件
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });
  
  // 点击返回顶部
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// 页面初始化：渲染文件夹树和笔记
initDarkMode();
renderFolderTree();
renderFavorites();
renderRecent();
renderNotes(loadNotes());

// 等待DOM加载完成后初始化specs数据
document.addEventListener('DOMContentLoaded', async () => {
  await initSpecs();
});

// 初始化specs数据
async function initSpecs() {
  // 强制清除旧缓存，每次都重新加载最新数据
  localStorage.removeItem(SPECS_STORAGE_KEY);
  console.log('已清除旧 specs 缓存，开始加载最新数据...');

  try {
    console.log('尝试加载specs.json...');
    const response = await fetch('./data/specs.json?t=' + Date.now(), { cache: 'no-store' });
    console.log('fetch响应状态:', response.status);
    if (response.ok) {
      const data = await response.json();
      console.log('加载的数据keys:', Object.keys(data.iPhone规格集 || data.iphone_specs || {}));
      saveSpecs(data);
      console.log('已保存最新规格数据');

      // 验证数据是否正确保存
      const saved = loadSpecs();
      console.log('验证保存的数据:', saved.iPhone规格集 ? Object.keys(saved.iPhone规格集) : '无数据');
    } else {
      console.log('无法加载specs.json文件，响应状态:', response.status);
    }
  } catch (e) {
    console.log('无法加载默认specs数据:', e);
  }
}
