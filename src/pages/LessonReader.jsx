import { useContext, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, ArrowRight, Clock, Loader2 } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { axiosSecure } from "../api/axiosInstance";
import LessonSidebar from "../components/lessons/LessonSidebar";
import LessonCard from "../components/lessons/LessonCard";
import Seo from "../components/common/Seo";
import NotFound from "./NotFound";
import { seoLesson } from "../lib/seo";
import { usePreload } from "../lib/preload";
import { API_URL, getClass } from "../config/site";
import axios from "axios";

// SweetAlert2 শুধু বাটন চাপলে লাগে, তাই প্রথম লোডে ডাউনলোড করা হয় না
const loadSwal = () => import("sweetalert2").then((m) => m.default);

const LessonReader = () => {
  const { lessonId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const preload = usePreload();
  const pre =
    preload?.type === "lesson" && preload.id === lessonId ? preload : null;

  const [lesson, setLesson] = useState(pre?.lesson ?? null);
  const [allLessons, setAllLessons] = useState(pre?.siblings ?? []);
  const [userData, setUserData] = useState(null);
  const [loadedId, setLoadedId] = useState(pre ? lessonId : null);
  const loading = loadedId !== lessonId;
  const [completing, setCompleting] = useState(false);

  // ১. লেসন ফেচ: প্রিলোড ডেটা থাকলে সাথে সাথে দেখানো হয়, পেছনে নতুন ডেটা এনে আপডেট হয়
  useEffect(() => {
    let cancelled = false;

    axios
      .get(`${API_URL}/lesson/${lessonId}`)
      .then((res) => {
        const currentLesson = res.data;
        if (cancelled) return;
        setLesson(currentLesson);

        if (currentLesson?.classLevel) {
          return axios.get(`${API_URL}/lessons/${currentLesson.classLevel}`);
        }
      })
      .then((res) => {
        if (cancelled) return;
        if (res?.data) setAllLessons(res.data);
        setLoadedId(lessonId);
      })
      .catch((err) => {
        console.log(err);
        if (!cancelled) setLoadedId(lessonId);
      });

    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  // ২. ইউজারের প্রোগ্রেস ডেটা ফেচ করা
  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/users/${user.email}`)
        .then((res) => setUserData(res.data))
        .catch((err) => console.log(err));
    }
  }, [user]);

  const currentIndex = allLessons.findIndex((l) => l._id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;

  // ৩. কমপ্লিট বাটন হ্যান্ডলার (প্রোগ্রেস সেভ + অটো নেক্সট)
  const handleCompleteAndNext = () => {
    if (!user) {
      loadSwal().then((Swal) =>
        Swal.fire({
          icon: "warning",
          title: "লগইন করতে হবে",
          text: "প্রোগ্রেস সেভ করতে দয়া করে আগে লগইন করো।",
          confirmButtonColor: "#0d9488",
        }),
      );
      navigate("/login");
      return;
    }

    setCompleting(true);
    const progressData = { email: user.email, lessonId: lessonId };

    axiosSecure
      .patch("/users/progress", progressData)
      .then(() => {
        setCompleting(false);
        setUserData((prev) => ({
          ...prev,
          completedLessons: [...(prev?.completedLessons || []), lessonId],
        }));

        loadSwal().then((Swal) =>
          Swal.fire({
            icon: "success",
            title: "অভিনন্দন! 🎉",
            text: "লেসনটি সম্পন্ন হয়েছে।",
            confirmButtonColor: "#0d9488",
            timer: 1000,
            showConfirmButton: false,
          }),
        );

        if (nextLesson) {
          navigate(`/lesson/${nextLesson._id}`);
        } else {
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        setCompleting(false);
        console.log(err);
      });
  };

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

  // লেসন না পাওয়া গেলে ফাঁকা পেজ নয়, সঠিক 404 কনটেন্ট (noindex)
  if (!lesson || !lesson._id) return <NotFound />;

  const cls = getClass(lesson.classLevel);

  return (
    <div className="max-w-350 mx-auto sm:px-6 lg:px-12 py-8">
      <Seo seo={seoLesson(lesson)} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 lg:order-2 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link to="/" className="hover:text-teal-600">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    to={`/class/${lesson.classLevel}`}
                    className="hover:text-teal-600"
                  >
                    {cls ? cls.short : lesson.classLevel}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li
                  aria-current="page"
                  className="text-slate-700 font-medium truncate max-w-[16rem]"
                >
                  {lesson.title}
                </li>
              </ol>
            </nav>
            <p className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 uppercase">
                {lesson.classLevel}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock size={13} aria-hidden="true" />{" "}
                {lesson.duration || "৫ মিনিট"}
              </span>
            </p>
          </div>

          <LessonCard lesson={lesson} />

          <nav
            aria-label="লেসন নেভিগেশন"
            className="flex items-center justify-between pt-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm"
          >
            {prevLesson ? (
              <Link
                to={`/lesson/${prevLesson._id}`}
                rel="prev"
                className="btn btn-outline border-slate-300 text-slate-700 rounded-xl gap-2"
              >
                <ArrowLeft size={16} aria-hidden="true" /> আগের লেসন
              </Link>
            ) : (
              <span />
            )}

            <button
              type="button"
              onClick={handleCompleteAndNext}
              disabled={completing}
              className="btn bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md shadow-teal-100 border-none gap-2 px-6"
            >
              {completing ? (
                <>
                  <Loader2
                    className="animate-spin"
                    size={16}
                    aria-hidden="true"
                  />{" "}
                  সেভ হচ্ছে...
                </>
              ) : (
                <>
                  সম্পন্ন করে এগিয়ে যাও{" "}
                  <ArrowRight size={16} aria-hidden="true" />
                </>
              )}
            </button>
          </nav>
        </div>

        <aside className="lg:col-span-1 lg:order-1">
          <div className="sticky top-24">
            <LessonSidebar
              lessons={allLessons}
              currentLessonId={lessonId}
              completedLessons={userData?.completedLessons || []}
              classLevel={lesson.classLevel}
            />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LessonReader;
