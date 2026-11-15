import { createContext } from "react";

// prerender-এর সময় true থাকে: তখন <head> আলাদা স্ট্রিং হিসেবে বসানো হয়, তাই Seo কম্পোনেন্ট কিছু রেন্ডার করে না।
export const SeoSsrContext = createContext(false);
