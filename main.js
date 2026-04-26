const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");

const APPLE_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
};

const CAPACITY_ORDER = ["64GB", "128GB", "256GB", "512GB", "1TB", "2TB"];
const DEFAULT_VARIANT_LABEL = "基础配置";

const CATEGORIES = [
  { id: "iphone", label: "iPhone" },
  { id: "ipad", label: "iPad" },
  { id: "watch", label: "Watch" },
  { id: "mac", label: "Mac" },
];

const REGIONS = [
  {
    id: "cn",
    label: "中国大陆",
    domain: "https://www.apple.com.cn",
    currencyCode: "CNY",
    locale: "zh-CN",
    isDefault: true,
    includeInComparison: false,
  },
  {
    id: "hk",
    label: "中国香港",
    domain: "https://www.apple.com/hk",
    currencyCode: "HKD",
    locale: "zh-HK",
    includeInComparison: true,
  },
  {
    id: "us",
    label: "美国",
    domain: "https://www.apple.com/us",
    currencyCode: "USD",
    locale: "en-US",
    includeInComparison: true,
  },
  {
    id: "uk",
    label: "英国",
    domain: "https://www.apple.com/uk",
    currencyCode: "GBP",
    locale: "en-GB",
    includeInComparison: true,
  },
  {
    id: "br",
    label: "巴西",
    domain: "https://www.apple.com/br",
    currencyCode: "BRL",
    locale: "pt-BR",
    includeInComparison: true,
  },
  {
    id: "ca",
    label: "加拿大",
    domain: "https://www.apple.com/ca",
    currencyCode: "CAD",
    locale: "en-CA",
    includeInComparison: true,
  },
  {
    id: "de",
    label: "德国",
    domain: "https://www.apple.com/de",
    currencyCode: "EUR",
    locale: "de-DE",
    includeInComparison: true,
  },
  {
    id: "au",
    label: "澳大利亚",
    domain: "https://www.apple.com/au",
    currencyCode: "AUD",
    locale: "en-AU",
    includeInComparison: true,
  },
  {
    id: "jp",
    label: "日本",
    domain: "https://www.apple.com/jp",
    currencyCode: "JPY",
    locale: "ja-JP",
    includeInComparison: true,
  },
  {
    id: "sg",
    label: "新加坡",
    domain: "https://www.apple.com/sg",
    currencyCode: "SGD",
    locale: "en-SG",
    includeInComparison: true,
  },
  {
    id: "tr",
    label: "土耳其",
    domain: "https://www.apple.com/tr",
    currencyCode: "TRY",
    locale: "tr-TR",
    includeInComparison: true,
  },
];

const PRODUCTS = [
  {
    id: "iphone-17-pro",
    categoryId: "iphone",
    label: "iPhone 17 Pro",
    buyPath: "/shop/buy-iphone/iphone-17-pro",
    parser: "metrics",
    matchType: "prefix",
    matchValue: "iPhone 17 Pro ",
    variantKind: "capacity",
  },
  {
    id: "iphone-17-pro-max",
    categoryId: "iphone",
    label: "iPhone 17 Pro Max",
    buyPath: "/shop/buy-iphone/iphone-17-pro",
    parser: "metrics",
    matchType: "prefix",
    matchValue: "iPhone 17 Pro Max ",
    variantKind: "capacity",
  },
  {
    id: "iphone-17",
    categoryId: "iphone",
    label: "iPhone 17",
    buyPath: "/shop/buy-iphone/iphone-17",
    parser: "metrics",
    matchType: "prefix",
    matchValue: "iPhone 17 ",
    variantKind: "capacity",
  },
  {
    id: "iphone-air",
    categoryId: "iphone",
    label: "iPhone Air",
    buyPath: "/shop/buy-iphone/iphone-air",
    parser: "metrics",
    matchType: "prefix",
    matchValue: "iPhone Air ",
    variantKind: "capacity",
  },
  {
    id: "iphone-17e",
    categoryId: "iphone",
    label: "iPhone 17e",
    buyPath: "/shop/buy-iphone/iphone-17e",
    parser: "metrics",
    matchType: "prefix",
    matchValue: "iPhone 17e ",
    variantKind: "capacity",
  },
  {
    id: "ipad-pro",
    categoryId: "ipad",
    label: "iPad Pro",
    buyPath: "/shop/buy-ipad/ipad-pro",
    parser: "metrics",
    matchType: "includes",
    matchValue: "iPad Pro",
    variantKind: "ipad",
  },
  {
    id: "ipad-air",
    categoryId: "ipad",
    label: "iPad Air",
    buyPath: "/shop/buy-ipad/ipad-air",
    parser: "metrics",
    matchType: "includes",
    matchValue: "iPad Air",
    variantKind: "ipad",
  },
  {
    id: "ipad-mini",
    categoryId: "ipad",
    label: "iPad mini",
    buyPath: "/shop/buy-ipad/ipad-mini",
    parser: "metrics",
    matchType: "includes",
    matchValue: "iPad mini",
    variantKind: "capacity",
  },
  {
    id: "ipad",
    categoryId: "ipad",
    label: "iPad",
    buyPath: "/shop/buy-ipad/ipad",
    parser: "metrics",
    matchType: "includes",
    matchValue: "iPad ",
    variantKind: "capacity",
  },
  {
    id: "apple-watch",
    categoryId: "watch",
    label: "Apple Watch Series 11",
    buyPath: "/shop/buy-watch/apple-watch",
    parser: "watchPage",
    variantKind: "fixed",
    fixedVariantLabel: "基础款",
  },
  {
    id: "apple-watch-se",
    categoryId: "watch",
    label: "Apple Watch SE 3",
    buyPath: "/shop/buy-watch/apple-watch-se",
    parser: "watchPage",
    variantKind: "fixed",
    fixedVariantLabel: "基础款",
  },
  {
    id: "apple-watch-ultra",
    categoryId: "watch",
    label: "Apple Watch Ultra 3",
    buyPath: "/shop/buy-watch/apple-watch-ultra/CASE_ULTRA_3_TI_C49",
    parser: "watchPage",
    variantKind: "fixed",
    fixedVariantLabel: "基础款",
  },
  {
    id: "macbook-neo",
    categoryId: "mac",
    label: "MacBook Neo",
    buyPath: "/shop/buy-mac/macbook-neo",
    parser: "macPageSeo",
    variantKind: "fixed",
    fixedVariantLabel: DEFAULT_VARIANT_LABEL,
  },
  {
    id: "macbook-air",
    categoryId: "mac",
    label: "MacBook Air 13 英寸",
    buyPath: "/shop/buy-mac/macbook-air",
    parser: "macPageSeo",
    defaultPriceKeyPrefix: "13inch-",
    variantKind: "fixed",
    fixedVariantLabel: DEFAULT_VARIANT_LABEL,
  },
  {
    id: "macbook-air-15",
    categoryId: "mac",
    label: "MacBook Air 15 英寸",
    buyPath: "/shop/buy-mac/macbook-air",
    parser: "macPageSeo",
    defaultPriceKeyPrefix: "15inch-",
    variantKind: "fixed",
    fixedVariantLabel: DEFAULT_VARIANT_LABEL,
  },
  {
    id: "macbook-pro",
    categoryId: "mac",
    label: "MacBook Pro 14 英寸",
    buyPath: "/shop/buy-mac/macbook-pro",
    parser: "macPageSeo",
    defaultPriceKeyPrefix: "14inch-",
    variantKind: "fixed",
    fixedVariantLabel: DEFAULT_VARIANT_LABEL,
  },
  {
    id: "macbook-pro-16",
    categoryId: "mac",
    label: "MacBook Pro 16 英寸",
    buyPath: "/shop/buy-mac/macbook-pro",
    parser: "macPageSeo",
    defaultPriceKeyPrefix: "16inch-",
    variantKind: "fixed",
    fixedVariantLabel: DEFAULT_VARIANT_LABEL,
  },
  {
    id: "imac",
    categoryId: "mac",
    label: "iMac",
    buyPath: "/shop/buy-mac/imac",
    parser: "macPageSeo",
    variantKind: "fixed",
    fixedVariantLabel: DEFAULT_VARIANT_LABEL,
  },
  {
    id: "mac-mini",
    categoryId: "mac",
    label: "Mac mini",
    buyPath: "/shop/buy-mac/mac-mini",
    parser: "macPageSeo",
    variantKind: "fixed",
    fixedVariantLabel: DEFAULT_VARIANT_LABEL,
  },
];

let mainWindow = null;

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildBuyUrl(region, product) {
  return `${region.domain}${product.buyPath}`;
}

function findProduct(productId) {
  return PRODUCTS.find((item) => item.id === productId) || PRODUCTS[0];
}

function extractMetricsJson(html) {
  const metricsMatch = html.match(
    /<script[^>]*type="application\/json"[^>]*id="metrics"[^>]*>([\s\S]*?)<\/script>/i,
  );

  if (!metricsMatch || !metricsMatch[1]) {
    throw new Error("未找到 Apple 官方页面中的 metrics 数据。");
  }

  return JSON.parse(metricsMatch[1]);
}

function extractLdJsonObjects(html) {
  const scripts = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];

  return scripts.flatMap((match) => {
    try {
      const parsed = JSON.parse(match[1]);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [];
    }
  });
}

function extractBalancedJsonBlock(source, startIndex) {
  const openingChar = source[startIndex];
  const closingChar = openingChar === "{" ? "}" : "]";

  let depth = 0;
  let inString = false;
  let isEscaped = false;

  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index];

    if (inString) {
      if (isEscaped) {
        isEscaped = false;
        continue;
      }

      if (char === "\\") {
        isEscaped = true;
        continue;
      }

      if (char === "\"") {
        inString = false;
      }

      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }

    if (char === openingChar) {
      depth += 1;
      continue;
    }

    if (char === closingChar) {
      depth -= 1;
      if (depth === 0) {
        return source.slice(startIndex, index + 1);
      }
    }
  }

  return null;
}

function extractJsonBlockAfterKey(source, key, openingChar) {
  const keyIndex = source.indexOf(key);
  if (keyIndex === -1) {
    return null;
  }

  const startIndex = source.indexOf(openingChar, keyIndex + key.length);
  if (startIndex === -1) {
    return null;
  }

  return extractBalancedJsonBlock(source, startIndex);
}

function extractCapacityVariant(name) {
  const match = String(name).match(/(\d+(?:GB|TB))/i);
  return match ? match[1].toUpperCase() : null;
}

function extractIpadVariant(name) {
  const text = String(name);
  const sizeMatch = text.match(/(\d{1,2}-inch)/i);
  const capacityMatch = text.match(/(\d+(?:GB|TB))/i);

  if (sizeMatch && capacityMatch) {
    return `${sizeMatch[1]} ${capacityMatch[1].toUpperCase()}`;
  }

  return capacityMatch ? capacityMatch[1].toUpperCase() : null;
}

function extractVariant(product, name) {
  if (product.variantKind === "capacity") {
    return extractCapacityVariant(name);
  }

  if (product.variantKind === "ipad") {
    return extractIpadVariant(name);
  }

  return product.fixedVariantLabel || DEFAULT_VARIANT_LABEL;
}

function sortVariants(variants) {
  return [...variants].sort((left, right) => {
    const leftIpadMatch = String(left).match(/(\d{1,2})-inch\s+(\d+(?:GB|TB))/i);
    const rightIpadMatch = String(right).match(/(\d{1,2})-inch\s+(\d+(?:GB|TB))/i);

    if (leftIpadMatch && rightIpadMatch) {
      const sizeDelta = Number(leftIpadMatch[1]) - Number(rightIpadMatch[1]);
      if (sizeDelta !== 0) {
        return sizeDelta;
      }

      return CAPACITY_ORDER.indexOf(leftIpadMatch[2].toUpperCase()) - CAPACITY_ORDER.indexOf(rightIpadMatch[2].toUpperCase());
    }

    const leftCapacityIndex = CAPACITY_ORDER.indexOf(String(left).toUpperCase());
    const rightCapacityIndex = CAPACITY_ORDER.indexOf(String(right).toUpperCase());
    const normalizedLeft = leftCapacityIndex === -1 ? Number.MAX_SAFE_INTEGER : leftCapacityIndex;
    const normalizedRight = rightCapacityIndex === -1 ? Number.MAX_SAFE_INTEGER : rightCapacityIndex;

    if (normalizedLeft !== normalizedRight) {
      return normalizedLeft - normalizedRight;
    }

    return String(left).localeCompare(String(right), "en");
  });
}

function matchesProductName(name, product) {
  if (product.matchType === "prefix") {
    return String(name).startsWith(product.matchValue);
  }

  if (product.matchType === "includes") {
    return String(name).includes(product.matchValue);
  }

  return false;
}

function groupEntriesByVariant(entries) {
  const grouped = new Map();

  for (const entry of entries) {
    if (!grouped.has(entry.variant)) {
      grouped.set(entry.variant, entry.amount);
      continue;
    }

    grouped.set(entry.variant, Math.min(grouped.get(entry.variant), entry.amount));
  }

  return grouped;
}

function parseMetricsCatalog(html, product) {
  const metrics = extractMetricsJson(html);
  const entries = (metrics?.data?.products || [])
    .filter((entry) => matchesProductName(entry?.name || "", product))
    .map((entry) => ({
      variant: extractVariant(product, entry?.name || ""),
      amount: Number(entry?.price?.fullPrice),
    }))
    .filter((entry) => entry.variant && Number.isFinite(entry.amount));

  const grouped = groupEntriesByVariant(entries);
  const currencyCode =
    metrics?.data?.currency || metrics?.data?.properties?.currencyCode || null;

  if (!grouped.size) {
    throw new Error("当前产品未解析到有效价格。");
  }

  return {
    currencyCode,
    variants: sortVariants([...grouped.keys()]),
    pricesByVariant: Object.fromEntries(grouped.entries()),
  };
}

function parseAggregateOfferCatalog(html, product) {
  const offers = extractLdJsonObjects(html).filter(
    (item) =>
      item &&
      item["@type"] === "Product" &&
      String(item.name || "").includes(product.offerName || product.label),
  );

  const offer = offers.find((item) => Array.isArray(item.offers) && item.offers.length) || offers[0];
  const aggregateOffer = Array.isArray(offer?.offers) ? offer.offers[0] : offer?.offers;
  const lowPrice = Number(aggregateOffer?.lowPrice);
  const currencyCode = aggregateOffer?.priceCurrency || null;

  if (!Number.isFinite(lowPrice)) {
    throw new Error("未找到基础配置价格。");
  }

  const variant = product.fixedVariantLabel || DEFAULT_VARIANT_LABEL;
  return {
    currencyCode,
    variants: [variant],
    pricesByVariant: { [variant]: lowPrice },
  };
}

function parseWatchCardsCatalog(html, product) {
  const pattern = new RegExp(
    `${escapeRegex(product.watchHrefHint)}[\\s\\S]{0,4000}`,
    "i",
  );
  const match = html.match(pattern);
  const cardChunk = match?.[0] || "";
  const visiblePriceMatch = cardChunk.match(/RMB\s*([\d,]+(?:\.\d+)?)/i);
  const rawPriceMatch = cardChunk.match(/"raw":\{"price":"([\d.]+)"\}/i);
  const amount = Number(
    visiblePriceMatch?.[1]?.replaceAll(",", "") || rawPriceMatch?.[1],
  );

  if (!Number.isFinite(amount)) {
    throw new Error("未找到 Watch 基础款价格。");
  }

  return {
    currencyCode: null,
    variants: [product.fixedVariantLabel || "基础款"],
    pricesByVariant: { [product.fixedVariantLabel || "基础款"]: amount },
  };
}

function parseWatchPageCatalog(html, product) {
  const selectionJson = extractJsonBlockAfterKey(html, "productSelectionData:", "{");

  if (!selectionJson) {
    throw new Error("未找到 Watch 产品页选择数据。");
  }

  let selectionData = {};
  try {
    selectionData = JSON.parse(selectionJson);
  } catch (error) {
    throw new Error(`Watch 产品页选择数据解析失败：${error.message}`);
  }

  const amounts = Object.values(selectionData?.displayValues?.prices || {})
    .map((entry) =>
      Number(
        entry?.amount ??
          entry?.seoPrice ??
          entry?.currentPrice?.raw_amount ??
          entry?.currentPrice?.amount?.replace?.(/[^\d.]/g, ""),
      ),
    )
    .filter((value) => Number.isFinite(value));

  const lowPrice = Math.min(...amounts);
  if (!Number.isFinite(lowPrice)) {
    throw new Error("未找到 Watch 默认配置价格。");
  }

  const variant = product.fixedVariantLabel || DEFAULT_VARIANT_LABEL;
  return {
    currencyCode: "CNY",
    variants: [variant],
    pricesByVariant: { [variant]: lowPrice },
  };
}

function parseMacPageSeoCatalog(html, product) {
  const productsJson = extractJsonBlockAfterKey(html, "\"products\":", "[");
  const pricesJson = extractJsonBlockAfterKey(html, "\"prices\":", "{");

  if (!pricesJson) {
    throw new Error("未找到 Mac 产品页价格集合。");
  }

  let defaultPriceKey = null;
  let pricesByKey = {};
  try {
    pricesByKey = JSON.parse(pricesJson);
  } catch {
    pricesByKey = {};
  }

  if (productsJson) {
    try {
      const products = JSON.parse(productsJson);
      const availableProducts = products.filter(
        (item) => item && !item.isComingSoon && typeof item.priceKey === "string",
      );
      const scopedProducts = product.defaultPriceKeyPrefix
        ? availableProducts.filter((item) => item.priceKey.startsWith(product.defaultPriceKeyPrefix))
        : availableProducts;

      const rankedProducts = scopedProducts
        .map((item) => ({
          priceKey: item.priceKey,
          amount: Number(pricesByKey?.[item.priceKey]?.seoPrice),
        }))
        .filter((item) => Number.isFinite(item.amount))
        .sort((left, right) => left.amount - right.amount);

      defaultPriceKey =
        rankedProducts[0]?.priceKey ||
        scopedProducts[0]?.priceKey ||
        availableProducts[0]?.priceKey ||
        null;
    } catch {
      defaultPriceKey = null;
    }
  }

  const defaultAmount = Number(pricesByKey?.[defaultPriceKey]?.seoPrice);
  const fallbackPrices = Object.values(pricesByKey)
    .map((item) => Number(item?.seoPrice))
    .filter((value) => Number.isFinite(value));
  const amount = Number.isFinite(defaultAmount)
    ? defaultAmount
    : fallbackPrices.length
      ? Math.min(...fallbackPrices)
      : NaN;

  if (!Number.isFinite(amount)) {
    throw new Error("未找到 Mac 默认配置价格。");
  }

  return {
    currencyCode: null,
    variants: [product.fixedVariantLabel || DEFAULT_VARIANT_LABEL],
    pricesByVariant: {
      [product.fixedVariantLabel || DEFAULT_VARIANT_LABEL]: amount,
    },
  };
}

function parseCatalogByProduct(html, product) {
  if (product.parser === "metrics") {
    return parseMetricsCatalog(html, product);
  }

  if (product.parser === "aggregateOffer") {
    return parseAggregateOfferCatalog(html, product);
  }

  if (product.parser === "watchCards") {
    return parseWatchCardsCatalog(html, product);
  }

  if (product.parser === "watchPage") {
    return parseWatchPageCatalog(html, product);
  }

  if (product.parser === "macPageSeo") {
    return parseMacPageSeoCatalog(html, product);
  }

  throw new Error("未知的产品解析方式。");
}

async function fetchRegionCatalog(region, product) {
  const url = buildBuyUrl(region, product);
  const response = await fetch(url, { headers: APPLE_HEADERS, redirect: "follow" });

  if (!response.ok) {
    throw new Error(`Apple ${region.label} 返回 ${response.status}`);
  }

  const html = await response.text();
  const catalog = parseCatalogByProduct(html, product);

  return {
    buyUrl: url,
    currencyCode: catalog.currencyCode || region.currencyCode,
    variants: catalog.variants,
    pricesByVariant: catalog.pricesByVariant,
    fetchedAt: new Date().toISOString(),
  };
}

async function fetchExchangeRates() {
  const response = await fetch("https://open.er-api.com/v6/latest/CNY", {
    headers: APPLE_HEADERS,
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`汇率服务返回 ${response.status}`);
  }

  const payload = await response.json();
  if (payload?.result !== "success" || !payload?.rates) {
    throw new Error("汇率服务未返回可用数据");
  }

  return {
    base: payload.base_code || "CNY",
    rates: payload.rates,
    provider: payload.provider || "https://open.er-api.com",
    updatedAt: payload.time_last_update_utc || new Date().toUTCString(),
  };
}

function convertToCny(amount, currencyCode, exchangeRates) {
  if (!Number.isFinite(amount)) {
    return null;
  }

  if (currencyCode === "CNY") {
    return amount;
  }

  const rate = exchangeRates?.rates?.[currencyCode];
  if (!Number.isFinite(rate) || rate <= 0) {
    return null;
  }

  return amount / rate;
}

async function fetchProductSnapshot(productId) {
  const product = findProduct(productId);
  const [exchangeRates, results] = await Promise.all([
    fetchExchangeRates().catch((error) => ({
      error: error instanceof Error ? error.message : "未知汇率错误",
      rates: null,
      base: "CNY",
      provider: null,
      updatedAt: null,
    })),
    Promise.all(
      REGIONS.map(async (region) => {
        try {
          const data = await fetchRegionCatalog(region, product);
          return { ok: true, region, data };
        } catch (error) {
          return {
            ok: false,
            region,
            error: error instanceof Error ? error.message : "未知错误",
          };
        }
      }),
    ),
  ]);

  const variants = sortVariants([
    ...new Set(results.flatMap((item) => (item.ok ? item.data.variants : []))),
  ]);

  const defaultRegionResult =
    results.find((item) => item.region.isDefault && item.ok) ||
    results.find((item) => item.ok) ||
    null;

  return {
    product,
    variants,
    defaultRegionId: "cn",
    fetchedAt: new Date().toISOString(),
    regions: results.map((item) => {
      if (item.ok) {
        const pricesInCny = Object.fromEntries(
          Object.entries(item.data.pricesByVariant).map(([variant, amount]) => [
            variant,
            convertToCny(Number(amount), item.data.currencyCode, exchangeRates),
          ]),
        );

        return {
          id: item.region.id,
          label: item.region.label,
          buyUrl: item.data.buyUrl,
          currencyCode: item.data.currencyCode,
          pricesByVariant: item.data.pricesByVariant,
          pricesInCny,
          variants: item.data.variants,
          fetchedAt: item.data.fetchedAt,
          ok: true,
          includeInComparison: item.region.includeInComparison,
        };
      }

      return {
        id: item.region.id,
        label: item.region.label,
        buyUrl: buildBuyUrl(item.region, product),
        currencyCode: item.region.currencyCode,
        pricesByVariant: {},
        pricesInCny: {},
        variants: [],
        fetchedAt: null,
        ok: false,
        error: item.error,
        includeInComparison: item.region.includeInComparison,
      };
    }),
    recommendedVariant:
      defaultRegionResult?.data?.variants[0] ||
      variants[0] ||
      product.fixedVariantLabel ||
      null,
    exchangeRates: {
      base: exchangeRates.base,
      provider: exchangeRates.provider,
      updatedAt: exchangeRates.updatedAt,
      ok: !exchangeRates.error,
      error: exchangeRates.error || null,
    },
  };
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 430,
    height: 932,
    minWidth: 390,
    minHeight: 720,
    backgroundColor: "#f5f5f7",
    title: "Apple Price Atlas",
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  ipcMain.handle("pricing:fetch-snapshot", async (_event, productId) => {
    return fetchProductSnapshot(productId);
  });

  ipcMain.handle("pricing:get-bootstrap", async () => ({
    categories: CATEGORIES,
    products: PRODUCTS.map((product) => ({
      id: product.id,
      categoryId: product.categoryId,
      label: product.label,
      variantKind: product.variantKind,
      fixedVariantLabel: product.fixedVariantLabel || null,
    })),
    defaultCategoryId: CATEGORIES[0].id,
    defaultProductId: PRODUCTS[0].id,
    regions: REGIONS,
  }));

  ipcMain.handle("app:open-external", async (_event, url) => shell.openExternal(url));

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
