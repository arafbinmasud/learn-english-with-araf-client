import { createContext, useContext } from "react";

// বিল্ডের সময় (prerender) প্রতিটি পেজের ডেটা HTML-এ বসিয়ে দেওয়া হয়।
// ব্রাউজারে অ্যাপ চালু হলে সেই ডেটা দিয়েই সাথে সাথে পেজ দেখানো যায়,
// Render সার্ভার ঘুম থেকে ওঠার জন্য অপেক্ষা করতে হয় না।
export const PreloadContext = createContext(null);
export const usePreload = () => useContext(PreloadContext);

export const readPreloadFromDom = () => {
  try {
    const el = document.getElementById("__PRELOAD__");
    return el ? JSON.parse(el.textContent) : null;
  } catch {
    return null;
  }
};

// SSR-এ <script> ভেতরে JSON নিরাপদে বসানোর জন্য
export const safeJson = (value) =>
  JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
