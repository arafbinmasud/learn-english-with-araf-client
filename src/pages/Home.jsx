import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BookOpen,
  Clock,
  Flame,
  XCircle,
  Loader2,
} from "lucide-react";
import axios from "axios";
import heroImg from "../assets/images/website-hero.webp";
import Seo from "../components/common/Seo";
import { seoHome } from "../lib/seo";
import { usePreload } from "../lib/preload";
import { API_URL, CLASSES } from "../config/site";

const Home = () => {
  const preload = usePreload();
  const pre = preload?.type === "home" ? preload : null;

  const [popularLessons, setPopularLessons] = useState(pre?.popular ?? []);
  const [loadingLessons, setLoadingLessons] = useState(!pre);

  // প্রিলোড ডেটা থাকলে সাথে সাথে দেখানো হয়, পেছনে নতুন ডেটা এনে আপডেট করা হয়
  useEffect(() => {
    axios
      .get(`${API_URL}/lessons/popular`)
      .then((res) => {
        setPopularLessons(res.data);
        setLoadingLessons(false);
      })
      .catch((err) => {
        console.log("Error fetching popular lessons:", err);
        setLoadingLessons(false);
      });
  }, []);

  return (
    <div className="space-y-20 pb-16">
      <Seo seo={seoHome()} />

      <section
        aria-labelledby="hero-heading"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6 lg:pt-10"
      >
        <div className="lg:col-span-6 space-y-6">
          <p className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-semibold">
            <Sparkles size={14} aria-hidden="true" /> সম্পূর্ণ বিনামূল্যে ইংরেজি
            শেখার নির্ভরযোগ্য প্ল্যাটফর্ম
          </p>

          <h1
            id="hero-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.2]"
          >
            ইংরেজি আর কঠিন নয়! প্রতিটি বিষয়{" "}
            <span className="brand-gradient">বুঝে শেখো,</span> নিজের মতো করে।
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            ষষ্ঠ শ্রেণি থেকে এইচএসসি পর্যন্ত ইংরেজির প্রতিটি গুরুত্বপূর্ণ বিষয়
            এখানে সাজানো হয়েছে একদম সহজ বাংলায়। ধাপে ধাপে লেসনগুলো শেখো,
            অনুশীলন করো এবং নিজের অগ্রগতি নিজেই যাচাই করো।
          </p>

          <div className="pt-2">
            <Link
              to="/class/class-6"
              className="btn bg-teal-600 hover:bg-teal-700 text-white px-6 rounded-xl shadow-md shadow-teal-100 border-none"
            >
              চলো, শেখা শুরু করি <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6 gap-5 items-center">
          <figure className="relative w-full max-w-xl bg-white p-5 rounded-3xl shadow-xl border border-slate-100 group">
            <span className="absolute -top-3 -right-3 bg-teal-600 text-white text-xs px-3.5 py-1.5 rounded-full font-semibold shadow-md flex items-center gap-1 z-10">
              <CheckCircle2 size={14} aria-hidden="true" /> তোমার শেখার সঙ্গী
            </span>

            <div className="w-full h-72 rounded-2xl bg-linear-to-b from-slate-50 to-teal-50/30 overflow-hidden flex flex-col items-center justify-center border border-slate-200/80 relative">
              {/* এটাই পেজের সবচেয়ে বড় ছবি (LCP), তাই lazy নয়, বরং high priority */}
              <img
                src={heroImg}
                alt="Araf Bin Masud - Founder and English Mentor at Learn English With Araf"
                width="1672"
                height="941"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover rounded-2xl"
              />

              <figcaption className="absolute bottom-0 inset-x-0 h-28 bg-linear-to-t from-slate-950 via-slate-950/70 to-transparent p-4 flex flex-col justify-end items-center text-center">
                <span className="text-lg font-bold text-white tracking-wide drop-shadow-md">
                  Araf Bin Masud
                </span>
                <span className="text-xs text-teal-300 font-semibold tracking-wider uppercase mt-0.5 drop-shadow">
                  Founder & Mentor
                </span>
              </figcaption>
            </div>
          </figure>
        </div>
      </section>

      <aside
        aria-label="সাধারণ ভুল ও সংশোধন"
        className="max-w-250 mx-auto bg-slate-900 text-slate-200 p-4 rounded-2xl shadow-lg text-sm space-y-2"
      >
        <p className="text-teal-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles size={13} aria-hidden="true" /> Common Mistakes and
          Correction:
        </p>
        <ul className="space-y-1.5 font-mono">
          <li className="flex items-center gap-2">
            <XCircle
              size={15}
              className="text-rose-500 shrink-0"
              aria-hidden="true"
            />
            <span>
              He <del className="text-rose-400">go</del>{" "}
              <ins className="text-emerald-400 font-bold">goes</ins> to school.
            </span>
          </li>
          <li className="flex items-center gap-2">
            <XCircle
              size={15}
              className="text-rose-500 shrink-0"
              aria-hidden="true"
            />
            <span>
              She is <del className="text-rose-400">an</del>{" "}
              <ins className="text-emerald-400 font-bold">a</ins> university
              student.
            </span>
          </li>
        </ul>
      </aside>

      <section aria-labelledby="classes-heading" className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2
            id="classes-heading"
            className="text-2xl sm:text-3xl font-bold text-slate-900"
          >
            তোমার Class বেছে নাও
          </h2>
          <p className="text-slate-500">
            প্রতিটি লেসন ধাপে ধাপে শেখো এবং নিজের প্রস্তুতিকে আরও শক্ত করো।
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CLASSES.map((cls) => (
            <li key={cls.slug} className="flex">
              <Link
                to={`/class/${cls.slug}`}
                className="w-full bg-white p-6 rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-xl transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div
                    aria-hidden="true"
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base border ${cls.color}`}
                  >
                    {cls.short.replace("Class ", "")}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-teal-600 transition-colors">
                    {cls.short}
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    {cls.homeDesc}
                  </p>
                </div>
                <span className="pt-6 flex items-center text-teal-600 font-semibold text-sm gap-1 group-hover:gap-2 transition-all">
                  শেখা শুরু করো <ArrowRight size={16} aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="popular-heading" className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <p className="inline-flex items-center gap-1.5 text-teal-700 text-xs font-bold uppercase tracking-wider bg-teal-100/60 px-3 py-1 rounded-full">
              <Flame size={14} aria-hidden="true" /> ট্রেন্ডিং টপিক
            </p>
            <h2
              id="popular-heading"
              className="text-2xl sm:text-3xl font-bold text-slate-900"
            >
              Popular Lessons
            </h2>
            <p className="text-slate-500">
              যে লেসনগুলো শিক্ষার্থীরা সবচেয়ে বেশি পড়ছে ও অনুশীলন করছে
            </p>
          </div>
          <Link
            to="/class/class-6"
            className="btn btn-sm btn-outline border-slate-300 hover:border-teal-600 text-slate-700"
          >
            Explore All <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {loadingLessons ? (
          <div
            className="flex justify-center items-center py-12"
            role="status"
            aria-label="লোড হচ্ছে"
          >
            <Loader2 className="animate-spin text-teal-600" size={35} />
          </div>
        ) : popularLessons.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularLessons.map((lesson) => (
              <li key={lesson._id} className="flex">
                <article className="w-full">
                  <Link
                    to={`/lesson/${lesson._id}`}
                    className="h-full bg-white p-6 rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-lg transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 uppercase">
                          {lesson.classLevel}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock size={13} aria-hidden="true" />{" "}
                          {lesson.duration || "৫ মিনিট"}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-800 group-hover:text-teal-600 transition-colors leading-snug">
                        {lesson.title}
                      </h3>
                      <p className="text-slate-500 line-clamp-2">
                        {lesson.shortDescription}
                      </p>
                    </div>
                    <span className="pt-6 flex items-center justify-between text-sm font-semibold text-slate-500 border-t border-slate-100 mt-4">
                      <span className="flex items-center gap-1 text-teal-600">
                        <BookOpen size={14} aria-hidden="true" /> পড়া শুরু করো
                      </span>
                      <ArrowRight
                        size={15}
                        aria-hidden="true"
                        className="group-hover:translate-x-1 transition-transform text-teal-600"
                      />
                    </span>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-8 text-slate-500">
            বর্তমানে কোনো পপুলার লেসন Available নেই। খুব শীঘ্রই লেসনগুলো যুক্ত
            করা হবে
          </p>
        )}
      </section>
    </div>
  );
};

export default Home;
