import {
  SITE_URL,
  SITE_NAME,
  AUTHOR_NAME,
  OG_IMAGE,
  DEFAULT_DESCRIPTION,
  CLASSES,
  getClass,
} from "../config/site";

export const absUrl = (path = "/") => `${SITE_URL}${path}`;

const clip = (text = "", max = 160) => {
  const clean = String(text)
    .replace(/[#>*_`|-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return clean.length > max ? clean.slice(0, max - 1).trimEnd() + "…" : clean;
};

// MongoDB ObjectId-এর প্রথম ৪ বাইট তৈরির সময়, এটা সঠিক datePublished
export const dateFromObjectId = (id) => {
  if (typeof id !== "string" || !/^[0-9a-f]{24}$/i.test(id)) return undefined;
  return new Date(parseInt(id.slice(0, 8), 16) * 1000).toISOString();
};

const personLd = {
  "@type": "Person",
  name: AUTHOR_NAME,
  url: SITE_URL,
};

const orgLd = {
  "@type": "EducationalOrganization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  founder: personLd,
};

const breadcrumb = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: it.url,
  })),
});

// ---- প্রতিটি পেজের SEO অবজেক্ট ----

export const seoHome = () => ({
  title: `${SITE_NAME} | ষষ্ঠ থেকে এইচএসসি ইংরেজি গ্রামার, ফ্রি`,
  description: DEFAULT_DESCRIPTION,
  path: "/",
  jsonLd: [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      inLanguage: "bn",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    { "@context": "https://schema.org", ...orgLd },
  ],
});

export const seoClass = (slug, lessons = []) => {
  const cls = getClass(slug);
  if (!cls) return seoNoindex("পেজটি পাওয়া যায়নি");
  const path = `/class/${cls.slug}`;
  return {
    title: `${cls.name}র ইংরেজি গ্রামার ও লেসন (${cls.short}) | ${SITE_NAME}`,
    description: `${cls.desc} সহজ বাংলায় ব্যাখ্যা, উদাহরণ ও অনুশীলনসহ সম্পূর্ণ ফ্রি।`,
    path,
    // লেসন না থাকলে পাতলা (thin) পেজ গুগলে ইনডেক্স করার দরকার নেই
    noindex: lessons.length === 0,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: cls.title,
        description: cls.desc,
        url: absUrl(path),
        inLanguage: "bn",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: lessons.map((l, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: l.title,
            url: absUrl(`/lesson/${l._id}`),
          })),
        },
      },
      breadcrumb([
        { name: "Home", url: absUrl("/") },
        { name: cls.short, url: absUrl(path) },
      ]),
    ],
  };
};

export const seoLesson = (lesson) => {
  if (!lesson) return seoNoindex("লেসন পাওয়া যায়নি");
  const cls = getClass(lesson.classLevel);
  const path = `/lesson/${lesson._id}`;
  const description = clip(
    lesson.shortDescription || lesson.learningObjectives || lesson.content,
    160,
  );
  const published = dateFromObjectId(lesson._id);
  const crumbs = [{ name: "Home", url: absUrl("/") }];
  if (cls) crumbs.push({ name: cls.short, url: absUrl(`/class/${cls.slug}`) });
  crumbs.push({ name: lesson.title, url: absUrl(path) });

  return {
    title: `${lesson.title} | ${cls ? cls.short : "English"} | ${SITE_NAME}`,
    description,
    path,
    type: "article",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: String(lesson.title).slice(0, 110),
        description,
        inLanguage: "bn",
        image: [OG_IMAGE],
        ...(published ? { datePublished: published } : {}),
        ...(cls
          ? { educationalLevel: cls.name, articleSection: cls.short }
          : {}),
        author: personLd,
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntityOfPage: { "@type": "WebPage", "@id": absUrl(path) },
      },
      breadcrumb(crumbs),
    ],
  };
};

export const seoNoindex = (title) => ({
  title: `${title} | ${SITE_NAME}`,
  description: DEFAULT_DESCRIPTION,
  noindex: true,
  path: null,
  jsonLd: [],
});

// ---- SEO অবজেক্ট থেকে <head> ট্যাগের HTML স্ট্রিং (শুধু prerender-এ ব্যবহার হয়) ----

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export const seoToHtml = (seo) => {
  const t = [];
  const meta = (attrs) =>
    t.push(
      `<meta ${Object.entries(attrs)
        .map(([k, v]) => `${k}="${esc(v)}"`)
        .join(" ")} data-seo />`,
    );
  t.push(`<title data-seo>${esc(seo.title)}</title>`);
  meta({ name: "description", content: seo.description });
  meta({
    name: "robots",
    content: seo.noindex
      ? "noindex, nofollow"
      : "index, follow, max-image-preview:large",
  });
  if (!seo.noindex && seo.path) {
    const url = absUrl(seo.path);
    t.push(`<link rel="canonical" href="${esc(url)}" data-seo />`);
    meta({ property: "og:url", content: url });
  }
  meta({ property: "og:type", content: seo.type || "website" });
  meta({ property: "og:site_name", content: SITE_NAME });
  meta({ property: "og:locale", content: "bn_BD" });
  meta({ property: "og:title", content: seo.title });
  meta({ property: "og:description", content: seo.description });
  meta({ property: "og:image", content: OG_IMAGE });
  meta({ property: "og:image:width", content: "1200" });
  meta({ property: "og:image:height", content: "630" });
  meta({ property: "og:image:alt", content: SITE_NAME });
  meta({ name: "twitter:card", content: "summary_large_image" });
  meta({ name: "twitter:title", content: seo.title });
  meta({ name: "twitter:description", content: seo.description });
  meta({ name: "twitter:image", content: OG_IMAGE });
  for (const ld of seo.jsonLd || []) {
    t.push(
      `<script type="application/ld+json" data-seo>${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>`,
    );
  }
  return t.join("\n    ");
};

export { CLASSES };
