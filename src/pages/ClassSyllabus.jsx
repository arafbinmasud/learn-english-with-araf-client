import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ArrowRight, Clock, BookOpen, Loader2 } from "lucide-react";
import axios from "axios";
import Seo from "../components/common/Seo";
import NotFound from "./NotFound";
import { seoClass } from "../lib/seo";
import { usePreload } from "../lib/preload";
import { API_URL, getClass } from "../config/site";

const ClassSyllabus = () => {
  const { classLevel } = useParams();
  const preload = usePreload();
  const pre =
    preload?.type === "class" && preload.slug === classLevel ? preload : null;

  const [lessons, setLessons] = useState(pre?.lessons ?? []);
  const [loadedSlug, setLoadedSlug] = useState(pre ? classLevel : null);
  const loading = loadedSlug !== classLevel;
  const currentClass = getClass(classLevel);

  useEffect(() => {
    if (!currentClass) return;
    axios
      .get(`${API_URL}/lessons/${classLevel}`)
      .then((res) => {
        setLessons(res.data);
        setLoadedSlug(classLevel);
      })
      .catch((err) => {
        console.log(err);
        setLoadedSlug(classLevel);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classLevel]);

  if (!currentClass) return <NotFound />;

  if (loading) {
    return (
      <div
        className="min-h-[70vh] flex items-center justify-center"
        role="status"
        aria-label="লোড হচ্ছে"
      >
        <Loader2 className="animate-spin text-teal-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-8">
      <Seo seo={seoClass(classLevel, lessons)} />

      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <ol className="flex items-center gap-2">
          <li>
            <Link to="/" className="hover:text-teal-600">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-slate-700 font-medium">
            {currentClass.short}
          </li>
        </ol>
      </nav>

      <header className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
        <p className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 uppercase tracking-wider">
          NCTB Syllabus
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          {currentClass.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          {currentClass.desc}
        </p>
      </header>

      <section aria-labelledby="lessons-heading" className="space-y-4">
        <h2 id="lessons-heading" className="text-lg font-bold text-slate-800">
          সকল লেসনসমূহ ({lessons.length})
        </h2>

        {lessons.length > 0 ? (
          <ol className="space-y-3">
            {lessons.map((lesson, idx) => (
              <li key={lesson._id}>
                <article>
                  <Link
                    to={`/lesson/${lesson._id}`}
                    className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-4">
                      <span
                        aria-hidden="true"
                        className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 font-bold flex items-center justify-center border border-teal-100 group-hover:bg-teal-600 group-hover:text-white transition-colors"
                      >
                        {idx + 1}
                      </span>
                      <span>
                        <h3 className="text-base font-bold text-slate-800 group-hover:text-teal-600 transition-colors">
                          {lesson.title}
                        </h3>
                        <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock size={12} aria-hidden="true" /> পাঠের সময়:{" "}
                          {lesson.duration || "৫ মিনিট"}
                        </span>
                      </span>
                    </span>

                    <span
                      aria-hidden="true"
                      className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors"
                    >
                      <ArrowRight size={18} />
                    </span>
                  </Link>
                </article>
              </li>
            ))}
          </ol>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-sm">
            <BookOpen
              size={40}
              aria-hidden="true"
              className="mx-auto text-teal-600 opacity-60"
            />
            <h3 className="text-lg font-bold text-slate-800">
              খুব শীঘ্রই লেসন যুক্ত করা হবে!
            </h3>
            <p className="text-sm text-slate-500">
              এই ক্লাসের জন্য নতুন লেসন তৈরির কাজ চলছে। একটু অপেক্ষা করো।
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ClassSyllabus;
