/**
 * fetch-specs.js
 * 批量抓取苹果官网 iPhone 机型 specs 数据
 *
 * 用法:
 *   node scripts/fetch-specs.js              # 抓取所有机型
 *   node scripts/fetch-specs.js --dry-run    # 仅显示计划，不实际抓取
 *   node scripts/fetch-specs.js --models "iPhone 16,iPhone 15"  # 仅抓取指定机型
 *
 * 依赖:
 *   npm install cheerio
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

// ---------- 配置 ----------

const PROJECT_ROOT = path.resolve(__dirname, "..");
const SPECS_FILE = path.join(PROJECT_ROOT, "data", "specs.json");
const CATEGORY_KEY = "iphone_specs";
const REQUEST_TIMEOUT = 30000; // 30s
const REQUEST_DELAY = 1500; // 请求间隔(ms)，避免被限流
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// ---------- iPhone 机型 URL 定义 ----------
//
// 早期机型（iPhone 12 及更早）的 specs 页面已从官网移除，
// 这里尝试使用 Apple Archive (web.archive.org) 的快照 URL。
// 如果 archive 也拿不到，脚本会标记为 skip 并记录日志。

const MODELS = [
  // iPhone 17 系列
  {
    name: "iPhone 17",
    url: "https://www.apple.com.cn/iphone-17/specs/"
  },
  {
    name: "iPhone 17 Pro",
    url: "https://www.apple.com.cn/iphone-17-pro/specs/"
  },
  {
    name: "iPhone 17 Pro Max",
    url: "https://www.apple.com.cn/iphone-17-pro/specs/"
  },
  {
    name: "iPhone 17e",
    url: "https://www.apple.com.cn/iphone-17e/specs/"
  },

  // iPhone Air 系列
  {
    name: "iPhone Air",
    url: "https://www.apple.com.cn/iphone-air/specs/"
  },

  // iPhone 16 系列
  {
    name: "iPhone 16",
    url: "https://www.apple.com.cn/iphone-16/specs/"
  },
  {
    name: "iPhone 16 Plus",
    url: "https://www.apple.com.cn/iphone-16/specs/"
  },
  {
    name: "iPhone 16 Pro",
    url: "https://www.apple.com.cn/iphone-16-pro/specs/"
  },
  {
    name: "iPhone 16 Pro Max",
    url: "https://www.apple.com.cn/iphone-16-pro/specs/"
  },

  // iPhone 15 系列
  {
    name: "iPhone 15",
    url: "https://www.apple.com.cn/iphone-15/specs/"
  },
  {
    name: "iPhone 15 Plus",
    url: "https://www.apple.com.cn/iphone-15/specs/"
  },
  {
    name: "iPhone 15 Pro",
    url: "https://www.apple.com.cn/iphone-15-pro/specs/"
  },
  {
    name: "iPhone 15 Pro Max",
    url: "https://www.apple.com.cn/iphone-15-pro/specs/"
  },

  // iPhone 14 系列
  {
    name: "iPhone 14",
    url: "https://www.apple.com.cn/iphone-14/specs/"
  },
  {
    name: "iPhone 14 Plus",
    url: "https://www.apple.com.cn/iphone-14/specs/"
  },
  {
    name: "iPhone 14 Pro",
    url: "https://www.apple.com.cn/iphone-14-pro/specs/"
  },
  {
    name: "iPhone 14 Pro Max",
    url: "https://www.apple.com.cn/iphone-14-pro/specs/"
  },

  // iPhone 13 系列
  {
    name: "iPhone 13",
    url: "https://www.apple.com.cn/iphone-13/specs/"
  },
  {
    name: "iPhone 13 mini",
    url: "https://www.apple.com.cn/iphone-13/specs/"
  },
  {
    name: "iPhone 13 Pro",
    url: "https://www.apple.com.cn/iphone-13-pro/specs/"
  },
  {
    name: "iPhone 13 Pro Max",
    url: "https://www.apple.com.cn/iphone-13-pro/specs/"
  },

  // iPhone 12 系列 — 官网已移除，尝试 archive
  {
    name: "iPhone 12",
    url: "https://web.archive.org/web/2022/https://www.apple.com.cn/iphone-12/specs/",
    archive: true
  },
  {
    name: "iPhone 12 mini",
    url: "https://web.archive.org/web/2022/https://www.apple.com.cn/iphone-12/specs/",
    archive: true
  },
  {
    name: "iPhone 12 Pro",
    url: "https://web.archive.org/web/2022/https://www.apple.com.cn/iphone-12-pro/specs/",
    archive: true
  },
  {
    name: "iPhone 12 Pro Max",
    url: "https://web.archive.org/web/2022/https://www.apple.com.cn/iphone-12-pro/specs/",
    archive: true
  },

  // iPhone 11 系列
  {
    name: "iPhone 11",
    url: "https://web.archive.org/web/2021/https://www.apple.com.cn/iphone-11/specs/",
    archive: true
  },
  {
    name: "iPhone 11 Pro",
    url: "https://web.archive.org/web/2021/https://www.apple.com.cn/iphone-11-pro/specs/",
    archive: true
  },
  {
    name: "iPhone 11 Pro Max",
    url: "https://web.archive.org/web/2021/https://www.apple.com.cn/iphone-11-pro/specs/",
    archive: true
  },

  // iPhone X / XS / XR / SE
  {
    name: "iPhone X",
    url: "https://web.archive.org/web/2020/https://www.apple.com.cn/iphone-x/specs/",
    archive: true
  },
  {
    name: "iPhone XS",
    url: "https://web.archive.org/web/2020/https://www.apple.com.cn/iphone-xs/specs/",
    archive: true
  },
  {
    name: "iPhone XS Max",
    url: "https://web.archive.org/web/2020/https://www.apple.com.cn/iphone-xs-max/specs/",
    archive: true
  },
  {
    name: "iPhone XR",
    url: "https://web.archive.org/web/2020/https://www.apple.com.cn/iphone-xr/specs/",
    archive: true
  },
  {
    name: "iPhone SE (第二代)",
    url: "https://web.archive.org/web/2021/https://www.apple.com.cn/iphone-se-2nd-gen/specs/",
    archive: true
  },
  {
    name: "iPhone SE (第三代)",
    url: "https://www.apple.com.cn/iphone-se-3/specs/"
  }
];

// ---------- 工具函数 ----------

function log(msg, level = "info") {
  const ts = new Date().toLocaleTimeString("zh-CN", { hour12: false });
  const prefix = level === "error" ? "ERROR" : level === "warn" ? "WARN " : "INFO ";
  console.log(`[${ts}] [${prefix}] ${msg}`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 通过原生 https/http 模块获取页面 HTML
 */
function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const options = {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Accept-Encoding": "identity"
      },
      timeout: REQUEST_TIMEOUT,
      // archive 页面可能有重定向
      followRedirects: true
    };

    const req = client.get(url, options, (res) => {
      // 处理重定向
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        log(`  -> 重定向到: ${res.headers.location}`, "warn");
        resolve(fetchHtml(res.headers.location));
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }

      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
      res.on("error", reject);
    });

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error(`请求超时 (${REQUEST_TIMEOUT}ms): ${url}`));
    });
  });
}

/**
 * 简易 HTML 解析器 — 不依赖外部库
 *
 * 苹果 specs 页面的结构:
 *   <section class="section"> 或类似
 *   每个 section 有标题 (h2/h3) 和列表内容
 *
 * 我们通过正则提取 section 标题和其下的文本内容。
 */
function parseSpecsSections(html) {
  const sections = {};
  let currentSection = null;

  // 提取 <section> 或带 id 的标题区块
  // 苹果specs页面通常使用 <h2> 或 <h3> 作为section标题
  // 后面跟随 <ul>, <p>, <div> 等包含具体内容

  // 方法1: 查找所有 h2/h3 标题及其后续内容
  const headingRegex = /<(h[23])[^>]*>(.*?)<\/\1>/gis;
  let match;

  // 先将 HTML 中的所有文本区块按 section 拆分
  // 苹果页面的典型模式: 每个specs区块由标题 + 内容组成
  const sectionBlockRegex = /(?:<section[^>]*>|<div[^>]*class="[^"]*(?:section|specs|technical)[^"]*"[^>]*>)([\s\S]*?)(?:<\/section>|<\/div>)/gi;

  // 尝试更精确的方法: 直接分析 HTML 中的数据结构
  // Apple specs 页面有时将数据放在 JSON-LD 或 data-attribute 中

  // 尝试查找 JSON 数据块 (某些苹果页面会将结构化数据嵌入)
  const jsonMatch = html.match(/"sections"\s*:\s*(\{[\s\S]*?\})\s*[,}]/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1]);
    } catch (e) {
      // JSON 解析失败，继续用 HTML 解析
    }
  }

  // 主解析逻辑: 提取标题和对应的文本列表
  // 查找所有类似 <h2>标题</h2> 后面跟内容的模式
  const blocks = html.split(/<\/?h[23][^>]*>/gi).filter(Boolean);

  for (let i = 1; i < blocks.length; i += 2) {
    const title = stripHtml(blocks[i]).trim();
    if (!title || title.length < 2) continue;

    const contentBlock = blocks[i + 1] || "";
    const items = extractTextItems(contentBlock);

    if (items.length > 0) {
      // 清理标题
      const cleanTitle = title
        .replace(/\s+/g, " ")
        .replace(/\[.*?\]/g, "") // 移除 footnote 引用标记
        .trim();

      if (cleanTitle) {
        sections[cleanTitle] = items;
      }
    }
  }

  // 如果上面的方法没有找到数据，尝试备用方法
  if (Object.keys(sections).length === 0) {
    // 备用方法: 查找 <h2> 后跟 <ul> 或 <p> 的模式
    const h2Regex = /<h[23][^>]*>(.*?)<\/h[23]>[\s\S]*?(?=<h[23][^>]*>|$)/gi;
    let h2Match;
    while ((h2Match = h2Regex.exec(html)) !== null) {
      const title = stripHtml(h2Match[1]).trim();
      const content = h2Match[0];
      const items = extractTextItems(content);

      if (title && items.length > 0) {
        sections[title] = items;
      }
    }
  }

  // 如果还是没有数据，尝试更宽松的正则
  if (Object.keys(sections).length === 0) {
    // 查找包含规格数据的 div 区块
    const dataDivRegex = /<div[^>]*class="[^"]*(?:specs|technical|section)[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
    let divMatch;
    let sectionCounter = 0;
    while ((divMatch = dataDivRegex.exec(html)) !== null) {
      sectionCounter++;
      const items = extractTextItems(divMatch[1]);
      if (items.length > 0) {
        sections[`数据区块 ${sectionCounter}`] = items;
      }
    }
  }

  return sections;
}

/**
 * 从 HTML 片段中提取纯文本项列表
 */
function extractTextItems(htmlBlock) {
  const items = [];

  // 提取 <li> 内容
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let liMatch;
  while ((liMatch = liRegex.exec(htmlBlock)) !== null) {
    const text = stripHtml(liMatch[1]).trim();
    if (text) items.push(text);
  }

  // 提取 <p> 内容 (如果没有 li)
  if (items.length === 0) {
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let pMatch;
    while ((pMatch = pRegex.exec(htmlBlock)) !== null) {
      const text = stripHtml(pMatch[1]).trim();
      if (text) items.push(text);
    }
  }

  // 如果还是没有，提取所有文本行
  if (items.length === 0) {
    const text = stripHtml(htmlBlock)
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    items.push(...text);
  }

  return items;
}

/**
 * 去除 HTML 标签，保留纯文本
 */
function stripHtml(htmlStr) {
  return htmlStr
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * 从 Apple specs 页面提取 og:image URL (用于标识页面版本)
 */
function extractOgImage(html) {
  const match = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i) ||
                html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i);
  return match ? match[1] : null;
}

/**
 * 从 Apple specs 页面提取 <title>
 */
function extractPageTitle(html) {
  const match = html.match(/<title>(.*?)<\/title>/i);
  return match ? stripHtml(match[1]) : null;
}

/**
 * 尝试从页面中提取摘要文本 (页面顶部的 summary 区块)
 */
function extractSummaryExcerpt(html) {
  // Apple specs 页面通常在顶部有一个 summary 区块
  // 查找包含 "技术规格" 的大段文本
  const summaryRegex = /(?:技术规格|Technical Specifications)([\s\S]*?)(?=<h[123]|<section|<div[^>]*class="[^"]*(?:section|specs))/i;
  const match = html.match(summaryRegex);
  if (match) {
    return stripHtml(match[1]).substring(0, 2000).trim();
  }
  return null;
}

// ---------- 核心逻辑 ----------

/**
 * 加载现有 specs 数据
 */
function loadExistingSpecs() {
  if (!fs.existsSync(SPECS_FILE)) {
    log("specs.json 不存在，将创建新文件", "warn");
    return {
      data_updated: new Date().toISOString().split("T")[0],
      source: "Apple Official Website (CN compare+specs pages)",
      [CATEGORY_KEY]: {}
    };
  }

  try {
    const raw = fs.readFileSync(SPECS_FILE, "utf8");
    const data = JSON.parse(raw);
    if (!data[CATEGORY_KEY]) {
      data[CATEGORY_KEY] = {};
    }
    return data;
  } catch (err) {
    log(`读取 specs.json 失败: ${err.message}`, "error");
    return {
      data_updated: new Date().toISOString().split("T")[0],
      source: "Apple Official Website (CN compare+specs pages)",
      [CATEGORY_KEY]: {}
    };
  }
}

/**
 * 保存 specs 数据
 */
function saveSpecs(data) {
  const dir = path.dirname(SPECS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(SPECS_FILE, JSON.stringify(data, null, 2) + "\n", "utf8");
  log(`已保存到 ${SPECS_FILE}`);
}

/**
 * 抓取单个机型的 specs
 */
async function fetchModelSpecs(model) {
  const { name, url, archive } = model;
  const label = archive ? `[archive]` : `[官网]`;

  log(`开始抓取 ${label} ${name}`);
  log(`  URL: ${url}`);

  try {
    const html = await fetchHtml(url);
    log(`  页面大小: ${(html.length / 1024).toFixed(1)} KB`);

    const title = extractPageTitle(html);
    if (title) {
      log(`  页面标题: ${title}`);
    }

    const sections = parseSpecsSections(html);
    const sectionCount = Object.keys(sections).length;

    if (sectionCount === 0) {
      log(`  未能解析到任何 sections 数据`, "warn");
      return {
        name,
        success: false,
        reason: "no_sections_parsed",
        sections: {},
        pageTitle: title,
        url
      };
    }

    log(`  解析到 ${sectionCount} 个 section: ${Object.keys(sections).join(", ")}`);

    const ogImage = extractOgImage(html);
    const summaryExcerpt = extractSummaryExcerpt(html);

    return {
      name,
      success: true,
      sections,
      ogImage,
      summaryExcerpt,
      pageTitle: title,
      url,
      fetchedAt: new Date().toISOString(),
      isArchive: !!archive
    };
  } catch (err) {
    log(`  抓取失败: ${err.message}`, "error");
    return {
      name,
      success: false,
      reason: err.message,
      url,
      isArchive: !!archive
    };
  }
}

/**
 * 将抓取结果合并到 specs 数据中
 */
function mergeIntoSpecs(specsData, result) {
  const { name, success, sections, ogImage, summaryExcerpt, fetchedAt, url, isArchive } = result;

  if (!success) {
    log(`跳过 ${name} (失败: ${result.reason})`, "warn");
    return false;
  }

  const category = specsData[CATEGORY_KEY];

  // 如果机型已存在，保留已有的结构化数据 (screen, processor, camera 等)
  const existing = category[name] || {};
  const structuredData = {};
  for (const key of ["screen", "processor", "storage", "camera", "battery", "design", "colors", "price_starting"]) {
    if (existing[key]) {
      structuredData[key] = existing[key];
    }
  }

  // 构建 official_data
  category[name] = {
    ...structuredData,
    official_data: {
      source: isArchive ? "Apple CN official specs page (via web.archive.org)" : "Apple CN official specs page",
      specs_page: url,
      fetched_at: fetchedAt || new Date().toISOString(),
      sections: sections,
      ...(ogImage ? { image_og: ogImage } : {}),
      ...(summaryExcerpt ? { summary_excerpt: summaryExcerpt } : {})
    }
  };

  log(`已合并 ${name} 到 specs.json`);
  return true;
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");

  // 解析 --models 参数
  let targetModels = null;
  const modelsIdx = args.indexOf("--models");
  if (modelsIdx !== -1 && args[modelsIdx + 1]) {
    targetModels = args[modelsIdx + 1].split(",").map((s) => s.trim());
    log(`指定机型: ${targetModels.join(", ")}`);
  }

  // 筛选要抓取的机型
  const modelsToFetch = targetModels
    ? MODELS.filter((m) => targetModels.includes(m.name))
    : MODELS;

  if (modelsToFetch.length === 0) {
    log("没有找到匹配的机型", "error");
    process.exit(1);
  }

  log(`共 ${modelsToFetch.length} 个机型待抓取`);

  if (dryRun) {
    log("--- Dry Run 模式 ---");
    modelsToFetch.forEach((m, i) => {
      log(`  ${i + 1}. ${m.name}${m.archive ? " [archive]" : ""}: ${m.url}`);
    });
    log("--- Dry Run 结束 ---");
    return;
  }

  // 加载现有数据
  const specsData = loadExistingSpecs();
  const existingCount = Object.keys(specsData[CATEGORY_KEY] || {}).length;
  log(`现有 ${existingCount} 个机型数据`);

  // 逐个抓取
  let successCount = 0;
  let failCount = 0;
  let mergeCount = 0;

  for (let i = 0; i < modelsToFetch.length; i++) {
    const model = modelsToFetch[i];
    log(`\n--- 进度: ${i + 1}/${modelsToFetch.length} ---`);

    const result = await fetchModelSpecs(model);

    if (result.success) {
      successCount++;
      if (mergeIntoSpecs(specsData, result)) {
        mergeCount++;
      }
    } else {
      failCount++;
    }

    // 请求间隔，避免被限流
    if (i < modelsToFetch.length - 1) {
      await sleep(REQUEST_DELAY);
    }
  }

  // 更新时间戳并保存
  specsData.data_updated = new Date().toISOString().split("T")[0];
  saveSpecs(specsData);

  // 输出统计
  log("\n========== 抓取完成 ==========");
  log(`总计: ${modelsToFetch.length} 个机型`);
  log(`成功: ${successCount}`);
  log(`失败: ${failCount}`);
  log(`合并: ${mergeCount}`);
  log(`现有: ${Object.keys(specsData[CATEGORY_KEY]).length} 个机型`);
  log("================================");
}

// ---------- 执行 ----------

main().catch((err) => {
  log(`未捕获的错误: ${err.message}`, "error");
  console.error(err);
  process.exit(1);
});
