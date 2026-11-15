// বিল্ডের পরে চলে (npm run build)। সব পাবলিক পেজের জন্য আসল কনটেন্টসহ স্ট্যাটিক HTML বানায়,
// সাথে sitemap.xml, robots.txt, 404.html ও app-shell.html তৈরি করে।
//
// ব্যবহার:
//   npm run build                          # সাধারণ বিল্ড (Render থেকে লেসন এনে)
//   PRERENDER_LESSONS_FILE=lessons.json npm run prerender   # অফলাইন/টেস্ট
//   PRERENDER_ALLOW_EMPTY=1 npm run build  # লেসন আনা না গেলেও বিল্ড চালিয়ে যাও (শুধু স্ট্যাটিক পেজ)

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

process.env.NODE_ENV = "production";
// সার্ভারে রেন্ডারের সময় Firebase আসলে ব্যবহার হয় না, শুধু ইম্পোর্ট ক্র্যাশ এড়াতে ডামি মান
for (const k of [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
]) {
  process.env[`VITE_${k}`] ||= "prerender-placeholder";
}

const vite = await createServer({
  root,
  mode: "production",
  appType: "custom",
  logLevel: "error",
  server: { middlewareMode: true },
  optimizeDeps: { noDiscovery: true, include: [] },
});

const fail = async (msg) => {
  console.error(`\n[prerender] ERROR: ${msg}\n`);
  await vite.close();
  process.exit(1);
};

try {
  const site = await vite.ssrLoadModule("/src/config/site.js");
  const { renderPage } = await vite.ssrLoadModule("/src/prerender/entry.jsx");
  const { safeJson } = await vite.ssrLoadModule("/src/lib/preload.js");
  const { SITE_URL, API_URL, CLASSES } = site;

  // ---------- ১. লেসন ডেটা ----------
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function loadLessons() {
    if (process.env.PRERENDER_LESSONS_FILE) {
      const raw = JSON.parse(
        await fs.readFile(process.env.PRERENDER_LESSONS_FILE, "utf8"),
      );
      return Array.isArray(raw) ? raw : raw.result;
    }
    let lastErr;
    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        console.log(
          `[prerender] ${API_URL}/lessons আনছি (চেষ্টা ${attempt}/4, Render ঘুমিয়ে থাকলে ১ মিনিট লাগতে পারে)...`,
        );
        const res = await fetch(`${API_URL}/lessons`, {
          signal: AbortSignal.timeout(90_000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data.result))
          throw new Error("অপ্রত্যাশিত রেসপন্স ফরম্যাট");
        return data.result;
      } catch (e) {
        lastErr = e;
        console.warn(`[prerender] ব্যর্থ: ${e.message}`);
        await sleep(5000);
      }
    }
    throw lastErr;
  }

  let lessons = [];
  try {
    lessons = await loadLessons();
  } catch (e) {
    if (process.env.PRERENDER_ALLOW_EMPTY === "1") {
      console.warn(
        "[prerender] লেসন আনা যায়নি, শুধু স্ট্যাটিক পেজ বানানো হচ্ছে (ALLOW_EMPTY)",
      );
    } else {
      await fail(
        `লেসন আনা যায়নি (${e.message}). Render সার্ভার চালু আছে কি না দেখো, অথবা PRERENDER_ALLOW_EMPTY=1 দিয়ে আবার চালাও।`,
      );
    }
  }

  const validSlugs = new Set(CLASSES.map((c) => c.slug));
  lessons = lessons
    .filter((l) => {
      const ok =
        l &&
        typeof l._id === "string" &&
        l.title &&
        l.content &&
        validSlugs.has(l.classLevel);
      if (!ok)
        console.warn(
          `[prerender] বাদ দিলাম (ডেটা অসম্পূর্ণ বা ক্লাস অজানা): ${l?._id} ${l?.title ?? ""}`,
        );
      return ok;
    })
    // ObjectId সময়ক্রমে বাড়ে, অ্যাপের সাইডবারে যে ক্রমে দেখায় ঠিক সেই ক্রম
    .sort((a, b) => (a._id < b._id ? -1 : 1));

  const byClass = Object.fromEntries(CLASSES.map((c) => [c.slug, []]));
  for (const l of lessons) byClass[l.classLevel].push(l);

  // ---------- ২. টেমপ্লেট ও অ্যাসেট ----------
  const template = await fs.readFile(path.join(dist, "index.html"), "utf8");
  if (!template.includes('<div id="root"></div>'))
    await fail(
      "dist/index.html এ খালি #root পাওয়া যায়নি, আগে `vite build` চালাও।",
    );

  const assetFiles = await fs.readdir(path.join(dist, "assets"));
  const findAsset = (name, ext) =>
    assetFiles.find((f) => new RegExp(`^${name}-[\\w-]{6,}\\.${ext}$`).test(f));
  const fontFile = findAsset("kalpurush", "woff2");
  const heroFile = findAsset("website-hero", "webp");

  const preloadTags = (extra = "") =>
    [
      fontFile &&
        `<link rel="preload" href="/assets/${fontFile}" as="font" type="font/woff2" crossorigin />`,
      extra,
    ]
      .filter(Boolean)
      .join("\n    ");

  // SSR-এ ছবি/ফন্টের পাথ হয় /src/assets/..., বিল্ডের হ্যাশযুক্ত পাথে বদলানো হয়
  const fixAssetUrls = (html) =>
    html.replace(
      /\/src\/assets\/(?:images|fonts)\/([\w-]+)\.(\w+)/g,
      (m, name, ext) => {
        const f = findAsset(name, ext);
        return f ? `/assets/${f}` : m;
      },
    );

  const seoRe = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;
  const preloadRe = /<!--preload:start-->[\s\S]*?<!--preload:end-->/;

  const compose = ({
    headHtml,
    preloadExtra = "",
    bodyHtml = "",
    preload = null,
  }) => {
    let out = template;
    if (headHtml)
      out = out.replace(
        seoRe,
        () => `<!--seo:start-->\n    ${headHtml}\n    <!--seo:end-->`,
      );
    out = out.replace(
      preloadRe,
      () =>
        `<!--preload:start-->\n    ${preloadTags(preloadExtra)}\n    <!--preload:end-->`,
    );
    if (bodyHtml) {
      const data = preload
        ? `\n    <script id="__PRELOAD__" type="application/json">${safeJson(preload)}</script>`
        : "";
      out = out.replace(
        '<div id="root"></div>',
        () => `<div id="root">${bodyHtml}</div>${data}`,
      );
    }
    return fixAssetUrls(out);
  };

  const pick = (l, keys) => Object.fromEntries(keys.map((k) => [k, l[k]]));

  const write = async (relFile, content) => {
    const file = path.join(dist, relFile);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, content, "utf8");
  };

  const h1Count = (html) => (html.match(/<h1[\s>]/g) || []).length;
  const warnings = [];
  const renderRoute = async ({ url, file, preload, preloadExtra }) => {
    const { html, headHtml } = renderPage({ url, preload });
    const out = compose({ headHtml, preloadExtra, bodyHtml: html, preload });
    if (h1Count(html) !== 1)
      warnings.push(`${url}: h1 সংখ্যা ${h1Count(html)} (১টা হওয়া উচিত)`);
    await write(file, out);
  };

  // ---------- ৩. রুট বানানো ----------
  // সাধারণ SPA fallback (নতুন লেসন যা এখনো prerender হয়নি, লগইন/ড্যাশবোর্ড ইত্যাদির জন্য)
  await write("app-shell.html", compose({}));

  // হোম
  const popular = lessons
    .filter((l) => l.isPopular)
    .slice(0, 6)
    .map((l) =>
      pick(l, ["_id", "classLevel", "duration", "title", "shortDescription"]),
    );
  await renderRoute({
    url: "/",
    file: "index.html",
    preload: { type: "home", popular },
    preloadExtra: heroFile
      ? `<link rel="preload" href="/assets/${heroFile}" as="image" type="image/webp" fetchpriority="high" />`
      : "",
  });

  // ক্লাস পেজ
  for (const cls of CLASSES) {
    const list = byClass[cls.slug].map((l) =>
      pick(l, ["_id", "classLevel", "title", "duration"]),
    );
    await renderRoute({
      url: `/class/${cls.slug}`,
      file: `class/${cls.slug}/index.html`,
      preload: { type: "class", slug: cls.slug, lessons: list },
    });
  }

  // লেসন পেজ
  for (const cls of CLASSES) {
    const siblings = byClass[cls.slug].map((l) =>
      pick(l, ["_id", "classLevel", "title"]),
    );
    for (const lesson of byClass[cls.slug]) {
      await renderRoute({
        url: `/lesson/${lesson._id}`,
        file: `lesson/${lesson._id}/index.html`,
        preload: { type: "lesson", id: lesson._id, lesson, siblings },
      });
    }
  }

  // 404 (Firebase আপনা থেকেই অজানা URL-এ এটা 404 স্ট্যাটাসে দেখায়)
  {
    const { html, headHtml } = renderPage({ url: "/404", preload: null });
    await write("404.html", compose({ headHtml, bodyHtml: html }));
  }

  // ---------- ৪. sitemap.xml ও robots.txt ----------
  const urls = [`${SITE_URL}/`];
  for (const cls of CLASSES)
    if (byClass[cls.slug].length) urls.push(`${SITE_URL}/class/${cls.slug}`);
  for (const l of lessons) urls.push(`${SITE_URL}/lesson/${l._id}`);

  await write(
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n") +
      `\n</urlset>\n`,
  );
  await write(
    "robots.txt",
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
  );

  // ---------- ৫. রিপোর্ট ----------
  console.log(
    `\n[prerender] সম্পন্ন: হোম ১টা, ক্লাস পেজ ${CLASSES.length}টা, লেসন পেজ ${lessons.length}টা, sitemap এ ${urls.length}টা URL`,
  );
  console.log(`[prerender] সাইট URL: ${SITE_URL}`);
  warnings.forEach((w) => console.warn(`[prerender] সতর্কতা: ${w}`));
  await vite.close();
} catch (e) {
  console.error(e);
  await vite.close();
  process.exit(1);
}
