import { useContext, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { axiosSecure } from "../api/axiosInstance";
import LessonSidebar from "../components/lessons/LessonSidebar";
import LessonCard from "../components/lessons/LessonCard";
import axios from "axios";
import Swal from "sweetalert2";

const LessonReader = () => {
  const { lessonId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  // ১. নির্দিষ্ট লেসন ফেচ করা
  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `https://learn-english-with-araf-server.onrender.com/lesson/${lessonId}`,
      )
      .then((res) => {
        const currentLesson = res.data;
        setLesson(currentLesson);

        // ওই ক্লাসের বাকি লেসনগুলো সাইডবারের জন্য ফেচ করা
        if (currentLesson?.classLevel) {
          return axios.get(
            `https://learn-english-with-araf-server.onrender.com/lessons/${currentLesson.classLevel}`,
          );
        }
      })
      .then((res) => {
        if (res?.data) {
          setAllLessons(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
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
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // ৩. কমপ্লিট বাটন হ্যান্ডলার (প্রোগ্রেস সেভ + অটো নেক্সট)
  const handleCompleteAndNext = () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "লগইন করতে হবে",
        text: "প্রোগ্রেস সেভ করতে দয়া করে আগে লগইন করো।",
        confirmButtonColor: "#0d9488",
      });
      navigate("/login");
      return;
    }

    setCompleting(true);
    const progressData = {
      email: user.email,
      lessonId: lessonId,
    };

    axiosSecure
      .patch("/users/progress", progressData)
      .then(() => {
        setCompleting(false);
        setUserData((prev) => ({
          ...prev,
          completedLessons: [...(prev?.completedLessons || []), lessonId],
        }));

        Swal.fire({
          icon: "success",
          title: "অভিনন্দন! 🎉",
          text: "লেসনটি সম্পন্ন হয়েছে।",
          confirmButtonColor: "#0d9488",
          timer: 1000,
          showConfirmButton: false,
        });

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
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-teal-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-12 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* বাম পাশে সাইডবার */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <LessonSidebar
              lessons={allLessons}
              currentLessonId={lessonId}
              completedLessons={userData?.completedLessons || []}
              classLevel={lesson?.classLevel}
            />
          </div>
        </div>

        {/* ডান পাশে মূল লেসন কার্ড ও নেভিগেশন */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between">
            <Link
              to={-1}
              className="btn btn-sm btn-outline border-slate-300 hover:border-teal-600 text-slate-700 gap-1 rounded-xl"
            >
              <ArrowLeft size={16} /> পেছনে ফিরে যাও
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 uppercase">
                {lesson?.classLevel}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock size={13} /> {lesson?.duration || "৫ মিনিট"}
              </span>
            </div>
          </div>

          {/* মূল লেসন কার্ড */}
          <LessonCard lesson={lesson} />

          {/* নিচে নেভিগেশন ও কমপ্লিট বাটন */}
          <div className="flex items-center justify-between pt-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            {prevLesson ? (
              <Link
                to={`/lesson/${prevLesson._id}`}
                className="btn btn-outline border-slate-300 text-slate-700 rounded-xl gap-2"
              >
                <ArrowLeft size={16} /> আগের লেসন
              </Link>
            ) : (
              <div></div>
            )}

            <button
              onClick={handleCompleteAndNext}
              disabled={completing}
              className="btn bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md shadow-teal-100 border-none gap-2 px-6"
            >
              {completing ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> সেভ হচ্ছে...
                </>
              ) : (
                <>
                  সম্পন্ন করে এগিয়ে যাও <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonReader;
