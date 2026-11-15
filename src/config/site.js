// সাইটের সব গুরুত্বপূর্ণ কনফিগ এক জায়গায়।
// কাস্টম ডোমেইন নিলে .env.local এ VITE_SITE_URL=https://yourdomain.com দিলেই canonical, sitemap, OG সব বদলে যাবে।
const env = (typeof import.meta !== "undefined" && import.meta.env) || {};

export const SITE_URL = (
  env.VITE_SITE_URL || "https://learn-english-with-araf.web.app"
).replace(/\/+$/, "");

export const API_URL = (
  env.VITE_API_URL || "https://learn-english-with-araf-server.onrender.com"
).replace(/\/+$/, "");

export const SITE_NAME = "Learn English With Araf";
export const AUTHOR_NAME = "Araf Bin Masud";
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const DEFAULT_DESCRIPTION =
  "ষষ্ঠ শ্রেণি থেকে এইচএসসি পর্যন্ত ইংরেজি গ্রামার ও পাঠ্যবইয়ের লেসন, সহজ বাংলায়, সম্পূর্ণ বিনামূল্যে।";

export const CLASSES = [
  {
    slug: "class-6",
    short: "Class VI",
    title: "Class VI English",
    name: "ষষ্ঠ শ্রেণি",
    homeDesc: "ইংরেজির ভিত্তি মজবুত করতে শুরু করো একদম গোড়া থেকে।",
    desc: "ষষ্ঠ শ্রেণির সম্পূর্ণ ইংরেজি পাঠ্যবই ও গ্রামার লেসনসমূহ।",
    color: "bg-teal-50 text-teal-700 border-teal-200",
  },
  {
    slug: "class-7",
    short: "Class VII",
    title: "Class VII English",
    name: "সপ্তম শ্রেণি",
    homeDesc:
      "ইংরেজি গ্রামার ও পাঠ্যবইয়ের প্রতিটি বিষয় বুঝে নাও সহজ ব্যাখ্যার মাধ্যমে।",
    desc: "সপ্তম শ্রেণির ইংরেজি পাঠ ও গ্রামারের গোছানো পাঠসমূহ।",
    color: "bg-sky-50 text-sky-700 border-sky-200",
  },
  {
    slug: "class-8",
    short: "Class VIII",
    title: "Class VIII English",
    name: "অষ্টম শ্রেণি",
    homeDesc: "ইংরেজির কঠিন বিষয়গুলো বুঝে নাও সহজ ব্যাখ্যা ও উদাহরণের মাধ্যমে।",
    desc: "অষ্টম শ্রেণির ইংরেজি পাঠ ও প্রস্তুতিমূলক লেসন।",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    slug: "ssc",
    short: "SSC",
    title: "SSC English Preparation",
    name: "এসএসসি",
    homeDesc: "এসএসসি প্রস্তুতির জন্য প্রয়োজনীয় গ্রামার, পাঠ্যবই ও গুরুত্বপূর্ণ অনুশীলন।",
    desc: "এসএসসি পরীক্ষার জন্য স্পেশাল গ্রামার ও টেক্সট লেসন।",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    slug: "hsc",
    short: "HSC",
    title: "HSC English Guide",
    name: "এইচএসসি",
    homeDesc: "এইচএসসি ইংরেজির প্রতিটি গুরুত্বপূর্ণ বিষয় শেখো সহজ ও গোছানোভাবে।",
    desc: "এইচএসসি ইংরেজি কনটেন্ট, গ্রামার ও মডেল টেস্ট।",
    color: "bg-rose-50 text-rose-700 border-rose-200",
  },
];

export const getClass = (slug) => CLASSES.find((c) => c.slug === slug) || null;
