// এই ফাইলটা শুধু বিল্ডের সময় scripts/prerender.mjs চালায় (ব্রাউজারে যায় না)।
// আসল পেজ কম্পোনেন্টগুলোই সার্ভারে রেন্ডার করে স্ট্যাটিক HTML বানানো হয়, তাই ক্লায়েন্ট আর সার্ভারের মার্কআপ একই।
import { renderToString } from "react-dom/server";
import { StaticRouter, Routes, Route } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import ClassSyllabus from "../pages/ClassSyllabus";
import LessonReader from "../pages/LessonReader";
import NotFound from "../pages/NotFound";
import { AuthContext } from "../context/AuthContext";
import { PreloadContext } from "../lib/preload";
import { SeoSsrContext } from "../lib/seoContext";
import {
  seoHome,
  seoClass,
  seoLesson,
  seoNoindex,
  seoToHtml,
} from "../lib/seo";

const guestAuth = {
  user: null,
  loading: false,
  logoutUser: () => Promise.resolve(),
};

const seoFor = (preload) => {
  switch (preload?.type) {
    case "home":
      return seoHome();
    case "class":
      return seoClass(preload.slug, preload.lessons);
    case "lesson":
      return seoLesson(preload.lesson);
    default:
      return seoNoindex("পেজটি পাওয়া যায়নি (404)");
  }
};

export function renderPage({ url, preload }) {
  const html = renderToString(
    <SeoSsrContext.Provider value={true}>
      <PreloadContext.Provider value={preload}>
        <AuthContext.Provider value={guestAuth}>
          <StaticRouter location={url}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="class/:classLevel" element={<ClassSyllabus />} />
                <Route path="lesson/:lessonId" element={<LessonReader />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </StaticRouter>
        </AuthContext.Provider>
      </PreloadContext.Provider>
    </SeoSsrContext.Provider>,
  );
  return { html, headHtml: seoToHtml(seoFor(preload)) };
}
