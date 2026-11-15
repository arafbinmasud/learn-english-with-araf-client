import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./routes/router.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { PreloadContext, readPreloadFromDom } from "./lib/preload.js";

// prerender করা HTML-এর <head> ট্যাগগুলো (data-seo) সরিয়ে ফেলা হয়,
// কারণ React এখন একই ট্যাগ নিজে বসাবে। না সরালে SPA-তে পেজ বদলালে পুরনো canonical/title থেকে যেত।
document.head.querySelectorAll("[data-seo]").forEach((el) => el.remove());

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PreloadContext.Provider value={readPreloadFromDom()}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </PreloadContext.Provider>
  </StrictMode>,
);
