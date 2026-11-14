import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  BookOpen,
  Loader2,
} from "lucide-react";
import axios from "axios";

const ClassSyllabus = () => {
  const { classLevel } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // ক্লাস অনুযায়ী শিরোনাম ও বিবরণ ম্যাপ করার জন্য
  const classInfo = {
    "class-6": {
      title: "Class VI English",
      desc: "ষষ্ঠ শ্রেণির সম্পূর্ণ ইংরেজি পাঠ্যবই ও গ্রামার লেসনসমূহ।",
    },
    "class-7": {
      title: "Class VII English",
      desc: "সপ্তম শ্রেণির ইংরেজি পাঠ ও গ্রামারের গোছানো পাঠসমূহ।",
    },
    "class-8": {
      title: "Class VIII English",
      desc: "অষ্টম শ্রেণির ইংরেজি পাঠ ও প্রস্তুতিমূলক লেসন।",
    },
    ssc: {
      title: "SSC English Preparation",
      desc: "এসএসসি পরীক্ষার জন্য স্পেশাল গ্রামার ও টেক্সট লেসন।",
    },
    hsc: {
      title: "HSC English Guide",
      desc: "এইচএসসি ইংরেজি কনটেন্ট, গ্রামার ও মডেল টেস্ট।",
    },
  };

  const currentClass = classInfo[classLevel] || {
    title: "Class Content",
    desc: "ইংরেজি গ্রামার ও পাঠ্যবই।",
  };

  // ব্যাকএন্ড থেকে নির্দিষ্ট ক্লাসের লেসন ফেচ করা
  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `https://learn-english-with-araf-server.onrender.com/lessons/${classLevel}`,
      )
      .then((res) => {
        setLessons(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [classLevel]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-teal-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 uppercase tracking-wider">
          NCTB Syllabus
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          {currentClass.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          {currentClass.desc}
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800">
          সকল লেসনসমূহ ({lessons.length})
        </h2>

        <div className="space-y-3">
          {lessons.length > 0 ? (
            lessons.map((lesson, idx) => (
              <Link
                to={`/lesson/${lesson._id}`}
                key={lesson._id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 font-bold flex items-center justify-center border border-teal-100 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 group-hover:text-teal-600 transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock size={12} /> পাঠের সময়:{" "}
                      {lesson.duration || "৫ মিনিট"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-sm">
              <BookOpen
                size={40}
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
        </div>
      </div>
    </div>
  );
};

export default ClassSyllabus;
