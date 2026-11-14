import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BookOpen,
  Clock,
  Flame,
  XCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import axios from "axios";
import heroImg from "../assets/images/website-hero.webp";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const [popularLessons, setPopularLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(true);

  // ব্যাকএন্ড থেকে শুধুমাত্র isPopular: true লেসনগুলো ফেচ করা (সর্বোচ্চ ৬টি)
  useEffect(() => {
    axios
      .get(
        "https://learn-english-with-araf-server.onrender.com/lessons/popular",
      )
      .then((res) => {
        setPopularLessons(res.data);
        setLoadingLessons(false);
      })
      .catch((err) => {
        console.log("Error fetching popular lessons:", err);
        setLoadingLessons(false);
      });
  }, []);

  const classesList = [
    {
      title: "Class VI",
      path: "/class/class-6",
      desc: "ইংরেজির ভিত্তি মজবুত করতে শুরু করো একদম গোড়া থেকে।",
      bg: "bg-teal-50 text-teal-700 border-teal-200",
    },
    {
      title: "Class VII",
      path: "/class/class-7",
      desc: "ইংরেজি গ্রামার ও পাঠ্যবইয়ের প্রতিটি বিষয় বুঝে নাও সহজ ব্যাখ্যার মাধ্যমে।",
      bg: "bg-sky-50 text-sky-700 border-sky-200",
    },
    {
      title: "Class VIII",
      path: "/class/class-8",
      desc: "ইংরেজির কঠিন বিষয়গুলো বুঝে নাও সহজ ব্যাখ্যা ও উদাহরণের মাধ্যমে।",
      bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    {
      title: "SSC",
      path: "/class/ssc",
      desc: "এসএসসি প্রস্তুতির জন্য প্রয়োজনীয় গ্রামার, পাঠ্যবই ও গুরুত্বপূর্ণ অনুশীলন।",
      bg: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      title: "HSC",
      path: "/class/hsc",
      desc: "এইচএসসি ইংরেজির প্রতিটি গুরুত্বপূর্ণ বিষয় শেখো সহজ ও গোছানোভাবে।",
      bg: "bg-rose-50 text-rose-700 border-rose-200",
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      <Helmet>
        <title>Home | Learn English With Araf</title>
        <meta
          name="description"
          content="ষষ্ঠ শ্রেণি থেকে এইচএসসি পর্যন্ত ইংরেজি শেখার সেরা ফ্রি প্ল্যাটফর্ম।"
        />
      </Helmet>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6 lg:pt-10">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-semibold">
            <Sparkles size={14} /> সম্পূর্ণ বিনামূল্যে ইংরেজি শেখার নির্ভরযোগ্য
            প্ল্যাটফর্ম
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.2]">
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
              চলো, শেখা শুরু করি <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6 gap-5 items-center">
          <div className="relative w-full max-w-xl bg-white p-5 rounded-3xl shadow-xl border border-slate-100 group">
            <div className="absolute -top-3 -right-3 bg-teal-600 text-white text-xs px-3.5 py-1.5 rounded-full font-semibold shadow-md flex items-center gap-1 z-10">
              <CheckCircle2 size={14} /> তোমার শেখার সঙ্গী
            </div>

            <div className="w-full h-72 rounded-2xl bg-linear-to-b from-slate-50 to-teal-50/30 overflow-hidden flex flex-col items-center justify-center border border-slate-200/80 relative">
              <img
                src={heroImg}
                alt="Araf Bin Masud - Founder and English Mentor at Learn English With Araf"
                className="w-full h-full object-cover rounded-2xl"
                loading="lazy"
              />

              <div className="absolute bottom-0 inset-x-0 h-28 bg-linear-to-t from-slate-950 via-slate-950/70 to-transparent p-4 flex flex-col justify-end items-center text-center">
                <h3 className="text-lg font-bold text-white tracking-wide drop-shadow-md">
                  Araf Bin Masud
                </h3>
                <p className="text-xs text-teal-300 font-semibold tracking-wider uppercase mt-0.5 drop-shadow">
                  Founder & Mentor
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" max-w-250 mx-auto bg-slate-900 text-slate-200 p-4 rounded-2xl shadow-lg  text-sm space-y-2">
        <div className="text-teal-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles size={13} /> Common Mistakes and Correction:
        </div>
        <div className="space-y-1.5 font-mono text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <XCircle size={15} className="text-rose-500 shrink-0" />
            <span>
              He <span className="text-rose-400 line-through">go</span>{" "}
              <span className="text-emerald-400 font-bold underline">goes</span>{" "}
              to school.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle size={15} className="text-rose-500 shrink-0" />
            <span>
              She is <span className="text-rose-400 line-through">an</span>{" "}
              <span className="text-emerald-400 font-bold underline">a</span>{" "}
              university student.
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            তোমার Class বেছে নাও
          </h2>
          <p className="text-sm text-slate-500">
            প্রতিটি লেসন ধাপে ধাপে শেখো এবং নিজের প্রস্তুতিকে আরও শক্ত করো।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classesList.map((cls, idx) => (
            <Link
              to={cls.path}
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-xl transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base border ${cls.bg}`}
                >
                  {cls.title.replace("Class ", "")}
                </div>
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-teal-600 transition-colors">
                  {cls.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {cls.desc}
                </p>
              </div>
              <div className="pt-6 flex items-center text-teal-600 font-semibold text-sm gap-1 group-hover:gap-2 transition-all">
                শেখা শুরু করো <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ডাইনামিক পপুলার লেসন সেকশন (সর্বোচ্চ ৬টি) */}
      <div className="space-y-8 bg-slate-50 border border-slate-200/60 rounded-3xl p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-teal-700 text-xs font-bold uppercase tracking-wider bg-teal-100/60 px-3 py-1 rounded-full">
              <Flame size={14} /> ট্রেন্ডিং টপিক
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
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
            Explore All <ArrowRight size={16} />
          </Link>
        </div>

        {loadingLessons ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-teal-600" size={35} />
          </div>
        ) : popularLessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularLessons.map((lesson) => (
              <Link
                to={`/lesson/${lesson._id}`}
                key={lesson._id}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 uppercase">
                      {lesson.classLevel}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={13} /> {lesson.duration || "৫ মিনিট"}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-800 group-hover:text-teal-600 transition-colors leading-snug">
                    {lesson.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2">
                    {lesson.shortDescription}
                  </p>
                </div>
                <div className="pt-6 flex items-center justify-between text-sm font-semibold text-slate-500 border-t border-slate-100 mt-4">
                  <span className="flex items-center gap-1 text-teal-600">
                    <BookOpen size={14} /> পড়া শুরু করো
                  </span>
                  <ArrowRight
                    size={15}
                    className="group-hover:translate-x-1 transition-transform text-teal-600"
                  />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            বর্তমানে কোনো পপুলার লেসন Available নেই। খুব শীঘ্রই লেসনগুলো যুক্ত
            করা হবে
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
