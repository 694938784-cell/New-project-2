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
let currentFolderId = "all";
let expandedFolders = {}; // 跟踪展开的文件夹
let sortOrder = "name"; // 默认按名称排序
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
      
      // 当前在售系列（一级菜单）
      { id: "iphone17-series", name: "iPhone 17 系列", parent: "all", createdAt: now + 1 },
      { id: "iphone17", name: "iPhone 17", parent: "iphone17-series", createdAt: now + 2 },
      { id: "iphone17-pro", name: "iPhone 17 Pro", parent: "iphone17-series", createdAt: now + 3 },
      { id: "iphone17-promax", name: "iPhone 17 Pro Max", parent: "iphone17-series", createdAt: now + 4 },
      { id: "iphone17e", name: "iPhone 17e", parent: "iphone17-series", createdAt: now + 5 },
      
      { id: "iphone-air-series", name: "iPhone Air 系列", parent: "all", createdAt: now + 6 },
      { id: "iphone-air", name: "iPhone Air", parent: "iphone-air-series", createdAt: now + 7 },
      
      { id: "iphone16-series", name: "iPhone 16 系列", parent: "all", createdAt: now + 10 },
      { id: "iphone16", name: "iPhone 16", parent: "iphone16-series", createdAt: now + 11 },
      { id: "iphone16-pro", name: "iPhone 16 Pro", parent: "iphone16-series", createdAt: now + 12 },
      { id: "iphone16-promax", name: "iPhone 16 Pro Max", parent: "iphone16-series", createdAt: now + 13 },
      
      // 历史系列（二级菜单较少的）
      { id: "iphone15-series", name: "iPhone 15 系列", parent: "all", createdAt: now + 14 },
      { id: "iphone15", name: "iPhone 15", parent: "iphone15-series", createdAt: now + 15 },
      { id: "iphone15plus", name: "iPhone 15 Plus", parent: "iphone15-series", createdAt: now + 16 },
      { id: "iphone15pro", name: "iPhone 15 Pro", parent: "iphone15-series", createdAt: now + 17 },
      { id: "iphone15promax", name: "iPhone 15 Pro Max", parent: "iphone15-series", createdAt: now + 18 },
      
      { id: "iphone14-series", name: "iPhone 14 系列", parent: "all", createdAt: now + 19 },
      { id: "iphone14", name: "iPhone 14", parent: "iphone14-series", createdAt: now + 20 },
      { id: "iphone14plus", name: "iPhone 14 Plus", parent: "iphone14-series", createdAt: now + 21 },
      { id: "iphone14pro", name: "iPhone 14 Pro", parent: "iphone14-series", createdAt: now + 22 },
      { id: "iphone14promax", name: "iPhone 14 Pro Max", parent: "iphone14-series", createdAt: now + 23 },
      
      { id: "iphone13-series", name: "iPhone 13 系列", parent: "all", createdAt: now + 24 },
      { id: "iphone13", name: "iPhone 13", parent: "iphone13-series", createdAt: now + 25 },
      { id: "iphone13mini", name: "iPhone 13 mini", parent: "iphone13-series", createdAt: now + 26 },
      { id: "iphone13pro", name: "iPhone 13 Pro", parent: "iphone13-series", createdAt: now + 27 },
      { id: "iphone13promax", name: "iPhone 13 Pro Max", parent: "iphone13-series", createdAt: now + 28 },
      
      { id: "iphone12-series", name: "iPhone 12 系列", parent: "all", createdAt: now + 29 },
      { id: "iphone12", name: "iPhone 12", parent: "iphone12-series", createdAt: now + 30 },
      { id: "iphone12mini", name: "iPhone 12 mini", parent: "iphone12-series", createdAt: now + 31 },
      { id: "iphone12pro", name: "iPhone 12 Pro", parent: "iphone12-series", createdAt: now + 32 },
      { id: "iphone12promax", name: "iPhone 12 Pro Max", parent: "iphone12-series", createdAt: now + 33 },
      
      { id: "iphone11-series", name: "iPhone 11 系列", parent: "all", createdAt: now + 34 },
      { id: "iphone11", name: "iPhone 11", parent: "iphone11-series", createdAt: now + 35 },
      { id: "iphone11pro", name: "iPhone 11 Pro", parent: "iphone11-series", createdAt: now + 36 },
      { id: "iphone11promax", name: "iPhone 11 Pro Max", parent: "iphone11-series", createdAt: now + 37 },
      
      // 早期系列合并
      { id: "iphonex-early-series", name: "iPhone X 及早期系列", parent: "all", createdAt: now + 38 },
      { id: "iphonex", name: "iPhone X", parent: "iphonex-early-series", createdAt: now + 39 },
      { id: "iphonexs", name: "iPhone XS", parent: "iphonex-early-series", createdAt: now + 40 },
      { id: "iphonexsmax", name: "iPhone XS Max", parent: "iphonex-early-series", createdAt: now + 41 },
      { id: "iphonexr", name: "iPhone XR", parent: "iphonex-early-series", createdAt: now + 42 },
      { id: "iphone8", name: "iPhone 8", parent: "iphonex-early-series", createdAt: now + 43 },
      { id: "iphone8plus", name: "iPhone 8 Plus", parent: "iphonex-early-series", createdAt: now + 44 },
      { id: "iphonese-2nd", name: "iPhone SE (第二代)", parent: "iphonex-early-series", createdAt: now + 45 }
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

// 生成规格表格HTML
function generateSpecTable(modelName) {
  const specs = loadSpecs();
  const modelSpec = specs.iphone_specs && specs.iphone_specs[modelName];
  
  if (!modelSpec) {
    return `<div class="spec-notice">暂无 ${modelName} 的规格数据</div>`;
  }
  
  return `
    <div class="spec-table-container">
      <h3>${modelName} 详细规格</h3>
      <table class="spec-table">
        <tbody>
          <tr>
            <th colspan="2">屏幕</th>
          </tr>
          <tr>
            <td>尺寸</td>
            <td>${modelSpec.screen.size}</td>
          </tr>
          <tr>
            <td>类型</td>
            <td>${modelSpec.screen.type}</td>
          </tr>
          <tr>
            <td>技术</td>
            <td>${modelSpec.screen.technology}</td>
          </tr>
          ${modelSpec.screen.always_on !== undefined ? `
          <tr>
            <td>常亮显示</td>
            <td>${modelSpec.screen.always_on ? '支持' : '不支持'}</td>
          </tr>
          ` : ''}
          ${modelSpec.screen.dynamic_island !== undefined ? `
          <tr>
            <td>灵动岛</td>
            <td>${modelSpec.screen.dynamic_island ? '支持' : '不支持'}</td>
          </tr>
          ` : ''}
          
          <tr>
            <th colspan="2">处理器</th>
          </tr>
          <tr>
            <td>芯片</td>
            <td>${modelSpec.processor.chip}</td>
          </tr>
          ${modelSpec.processor.cores ? `
          <tr>
            <td>CPU</td>
            <td>${modelSpec.processor.cores}</td>
          </tr>
          ` : ''}
          ${modelSpec.processor.graphics ? `
          <tr>
            <td>图形处理器</td>
            <td>${modelSpec.processor.graphics}</td>
          </tr>
          ` : ''}
          ${modelSpec.processor.features ? `
          <tr>
            <td>特性</td>
            <td>${modelSpec.processor.features.join(', ')}</td>
          </tr>
          ` : ''}
          
          <tr>
            <th colspan="2">存储容量</th>
          </tr>
          <tr>
            <td>可选容量</td>
            <td>${modelSpec.storage.join(', ')}</td>
          </tr>
          
          <tr>
            <th colspan="2">摄像头</th>
          </tr>
          <tr>
            <td>后置系统</td>
            <td>${modelSpec.camera.rear.system}</td>
          </tr>
          <tr>
            <td>主摄</td>
            <td>${modelSpec.camera.rear.main}</td>
          </tr>
          ${modelSpec.camera.rear.ultra_wide ? `
          <tr>
            <td>超广角</td>
            <td>${modelSpec.camera.rear.ultra_wide}</td>
          </tr>
          ` : ''}
          ${modelSpec.camera.rear.telephoto ? `
          <tr>
            <td>长焦</td>
            <td>${modelSpec.camera.rear.telephoto}</td>
          </tr>
          ` : ''}
          ${modelSpec.camera.rear.zoom ? `
          <tr>
            <td>变焦</td>
            <td>${modelSpec.camera.rear.zoom}</td>
          </tr>
          ` : ''}
          <tr>
            <td>前置</td>
            <td>${modelSpec.camera.front.type || modelSpec.camera.front}</td>
          </tr>
          ${modelSpec.camera.front.features ? `
          <tr>
            <td>前置特性</td>
            <td>${Array.isArray(modelSpec.camera.front.features) ? modelSpec.camera.front.features.join(', ') : modelSpec.camera.front.features}</td>
          </tr>
          ` : ''}
          
          <tr>
            <th colspan="2">电池</th>
          </tr>
          <tr>
            <td>视频播放</td>
            <td>${modelSpec.battery.video_playback}</td>
          </tr>
          ${modelSpec.battery.wireless_charging ? `
          <tr>
            <td>无线充电</td>
            <td>${modelSpec.battery.wireless_charging}</td>
          </tr>
          ` : ''}
          
          <tr>
            <th colspan="2">设计</th>
          </tr>
          <tr>
            <td>材质</td>
            <td>${modelSpec.design.material}</td>
          </tr>
          <tr>
            <td>特性</td>
            <td>${modelSpec.design.features.join(', ')}</td>
          </tr>
          <tr>
            <td>防水等级</td>
            <td>${modelSpec.design.water_resistance}</td>
          </tr>
          
          <tr>
            <th colspan="2">颜色</th>
          </tr>
          <tr>
            <td>可选颜色</td>
            <td>${modelSpec.colors.join(', ')}</td>
          </tr>
          
          <tr>
            <th colspan="2">价格</th>
          </tr>
          <tr>
            <td>起售价</td>
            <td>${modelSpec.price_starting}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function resetFolders() {
  localStorage.removeItem(FOLDER_STORAGE_KEY);
  renderFolderTree();
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

function renderFolderTree() {
  const folders = loadFolders();
  folderTreeEl.innerHTML = "";
  
  const buildTree = (parentId, level = 0) => {
    const ul = document.createElement("ul");
    ul.classList.add("folder-tree");
    
    // 获取子文件夹并排序
    let children = folders.filter(f => f.parent === parentId);
    if (sortOrder === "name") {
      children.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "date") {
      children.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    }
    
    children.forEach(folder => {
      const li = document.createElement("li");
      li.classList.add("folder-item");
      
      const btn = document.createElement("button");
      btn.classList.add("folder-btn");
      if (folder.id === currentFolderId) btn.classList.add("active");
      
      // 检查是否有子文件夹
      const hasChildren = folders.some(f => f.parent === folder.id);
      
      // 添加层级标识和展开图标
      const levelText = level === 0 ? "一级" : level === 1 ? "二级" : "三级";
      const expandIcon = hasChildren ? (expandedFolders[folder.id] ? "▼" : "▶") : "";
      
      btn.innerHTML = `
        <span class="folder-content">
          <span class="expand-icon">${expandIcon}</span>
          <span>${folder.name}</span>
        </span>
        <span class="folder-level">${levelText}</span>
      `;
      
      btn.onclick = (e) => {
        e.stopPropagation();
        if (hasChildren) {
          // 切换展开状态
          expandedFolders[folder.id] = !expandedFolders[folder.id];
          renderFolderTree();
        } else {
          selectFolder(folder.id);
        }
      };
      
      // 添加右键菜单用于删除自定义目录
      if (folder.id.startsWith("f_")) { // 只为用户自定义的目录添加删除功能
        btn.oncontextmenu = (e) => {
          e.preventDefault();
          if (confirm(`确定要删除目录 "${folder.name}" 吗？\n\n注意：这将同时删除该目录下的所有笔记和子目录！`)) {
            deleteFolder(folder.id);
          }
        };
      }
      
      li.appendChild(btn);
      
      // 递归添加子文件夹（如果展开）
      if (hasChildren && expandedFolders[folder.id]) {
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
  }
  renderFolderTree();
  renderNotes(loadNotes());
  
  // 如果是具体的iPhone型号，显示规格表格
  const specsContainer = document.getElementById("specsContainer");
  if (specsContainer) {
    const modelName = folder ? folder.name : "";
    const specs = loadSpecs();
    console.log('检查型号:', modelName, '规格数据:', specs.iphone_specs ? specs.iphone_specs[modelName] : '未找到');
    const hasSpec = specs.iphone_specs && specs.iphone_specs[modelName];
    
    if (hasSpec) {
      specsContainer.innerHTML = generateSpecTable(modelName);
      specsContainer.style.display = "block";
      console.log('显示规格表格 for', modelName);
    } else {
      specsContainer.style.display = "none";
      console.log('隐藏规格表格 for', modelName);
    }
  }
}

function formatTime(ts) {
  const date = new Date(ts);
  return date.toLocaleString();
}

function renderNotes(notes) {
  notesEl.innerHTML = "";
  
  // 如果不是"所有笔记"，需要过滤笔记
  let filteredNotes = notes;
  if (currentFolderId !== "all") {
    // 这里可以根据folderId过滤笔记，暂时显示所有
    filteredNotes = notes;
  }
  
  if (filteredNotes.length === 0) {
    notesEl.innerHTML = "<div class=\"note\"><p>还没有笔记，先写一条吧。</p></div>";
    return;
  }

  filteredNotes.forEach((note, index) => {
    const card = document.createElement("div");
    card.className = "note";
    card.innerHTML = `
      <h3 contenteditable="true" data-field="title" data-index="${index}">${note.title}</h3>
      <p contenteditable="true" data-field="content" data-index="${index}">${note.content}</p>
      <div class="meta">${formatTime(note.updatedAt)}</div>
    `;
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

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  const notes = loadNotes();
  const filtered = notes.filter((note) => {
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });
  renderNotes(filtered);
});

renderFolderTree();
renderNotes(loadNotes());

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
  if (e.key === 'Escape' && isEditMode) {
    // ESC键退出编辑模式
    toggleEditMode();
  }
});

// 页面加载时恢复布局
loadLayout();

// 等待DOM加载完成后初始化specs数据
document.addEventListener('DOMContentLoaded', async () => {
  await initSpecs();
});

// 初始化specs数据
async function initSpecs() {
  // 强制重新加载specs数据进行测试
  localStorage.removeItem(SPECS_STORAGE_KEY);
  
  const specs = loadSpecs();
  console.log('当前specs数据:', specs);
  if (!specs.iphone_specs || Object.keys(specs.iphone_specs).length === 0) {
    try {
      console.log('尝试加载specs.json...');
      const response = await fetch('./data/specs.json');
      console.log('fetch响应状态:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('加载的数据keys:', Object.keys(data.iphone_specs || {}));
        saveSpecs(data);
        console.log('已加载并保存默认specs数据');
        
        // 验证数据是否正确保存
        const saved = loadSpecs();
        console.log('验证保存的数据:', saved.iphone_specs ? Object.keys(saved.iphone_specs) : '无数据');
      } else {
        console.log('无法加载specs.json文件，响应状态:', response.status);
      }
    } catch (e) {
      console.log('无法加载默认specs数据:', e);
    }
  } else {
    console.log('specs数据已存在，无需重新加载');
  }
}
