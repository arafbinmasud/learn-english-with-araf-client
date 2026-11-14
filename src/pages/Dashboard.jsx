import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { axiosSecure } from "../api/axiosInstance";
import {
  BookOpen,
  CheckCircle2,
  PlusCircle,
  UserCheck,
  GraduationCap,
  Flame,
  Loader2,
  ArrowRight,
  Edit3,
  Trash2,
  X,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router";
import Swal from "sweetalert2";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [lessons, setLessons] = useState([]);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // এডিট করার জন্য মোডালের স্টেট
  const [isEditing, setIsEditing] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);

  // টিচার ইমেইল চেক
  const isTeacher =
    user?.email === "araf357300@gmail.com" || user?.role === "teacher";

  // লেসন ও ইউজারের প্রোগ্রেস ফেচ করা
  const fetchData = () => {
    setLoading(true);
    Promise.all([
      axiosSecure.get("/lessons"),
      user?.email
        ? axiosSecure.get(`/users/${user.email}`)
        : Promise.resolve({ data: null }),
    ])
      .then(([lessonsRes, userRes]) => {
        setLessons(lessonsRes.data);
        setDbUser(userRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error loading dashboard data:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // লেসন ডিলিট করার ফাংশন (SweetAlert সহ)
  const handleDelete = (id, title) => {
    Swal.fire({
      title: "Are You Sure?",
      text: `"${title}" লেসনটি চিরতরে মুছে ফেলা হবে!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d9488",
      cancelButtonColor: "#e11d48",
      confirmButtonText: "হ্যাঁ, ডিলিট করো",
      cancelButtonText: "বাতিল",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/lessons/${id}`)
          .then((res) => {
            if (res.data.deletedCount > 0 || res.data.success) {
              Swal.fire({
                title: "ডিলিট সফল!",
                text: "লেসনটি সফলভাবে মুছে ফেলা হয়েছে।",
                icon: "success",
                confirmButtonColor: "#0d9488",
              });
              fetchData();
            }
          })
          .catch((err) => {
            console.log(err);
            Swal.fire({
              icon: "error",
              title: "সমস্যা হয়েছে",
              text: "লেসন ডিলিট করা যায়নি। Try Again।",
              confirmButtonColor: "#0d9488",
            });
          });
      }
    });
  };

  // এডিট মোডাল ওপেন করার ফাংশন
  const handleOpenEditModal = (lesson) => {
    setCurrentLesson(lesson);
    setIsEditing(true);
  };

  // এডিট সাবমিট করার ফাংশন
  const handleUpdateLesson = (e) => {
    e.preventDefault();
    axiosSecure
      .put(`/lessons/${currentLesson._id}`, currentLesson)
      .then((res) => {
        if (res.data.modifiedCount > 0 || res.data.success) {
          setIsEditing(false);
          Swal.fire({
            icon: "success",
            title: "আপডেট সফল! 🎉",
            text: "লেসনটির তথ্য সফলভাবে আপডেট করা হয়েছে।",
            confirmButtonColor: "#0d9488",
          });
          fetchData();
        }
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "সমস্যা হয়েছে",
          text: "আপডেট করা যায়নি।",
          confirmButtonColor: "#0d9488",
        });
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-teal-600" size={45} />
      </div>
    );
  }

  // স্টুডেন্টের কমপ্লিট করা লেসনগুলোর লিস্ট
  const completedLessonIds = dbUser?.completedLessons || [];
  const completedLessonsList = lessons.filter((l) =>
    completedLessonIds.includes(l._id),
  );

  // শিক্ষকের জন্য সর্বশেষ ৬টি লেসন (রিভার্স করে বা যেভাবে ডাটা আছে তার শেষ ৬টি)
  const teacherLessons = [...lessons].reverse().slice(0, 6);

  return (
    <div className="max-w-350 mx-auto py-10 px-4 space-y-10">
      {/* ওয়েলকাম ব্যানার */}
      <div className="bg-linear-to-r from-teal-700 to-teal-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-teal-600/60 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
            {isTeacher ? <UserCheck size={14} /> : <GraduationCap size={14} />}
            {isTeacher ? "Teacher Panel" : "Student Dashboard"}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
            স্বাগতম, {user?.displayName}!
          </h1>
          <p className="text-teal-100 text-sm max-w-xl">
            {isTeacher
              ? "এখান থেকে আপনার তৈরি করা সমস্ত লেসন দেখতে পারবেন, এডিট করতে পারবেন অথবা প্রয়োজনে ডিলিট করতে পারবেন।"
              : "তোমার পড়ালেখার অগ্রগতি ট্র্যাক করো এবং যেকোনো সময় তোমার পছন্দের লেসনগুলো পড়ে নাও।"}
          </p>
        </div>

        {isTeacher && (
          <Link
            to="/add-lesson"
            className="btn bg-white text-teal-800 hover:bg-teal-50 border-none font-bold shadow-md rounded-xl gap-2"
          >
            <PlusCircle size={18} /> Add New Lesson
          </Link>
        )}
      </div>

      {/* স্ট্যাটিস্টিক্স কার্ড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="font-bold uppercase tracking-wider">মোট লেসন</span>
            <BookOpen className="text-teal-600" size={20} />
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900">
            {lessons.length}
          </h3>
          <p className="text-slate-400">প্ল্যাটফর্মে সংরক্ষিত মোট লেসন</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="font-bold uppercase tracking-wider">
              পপুলার লেসন
            </span>
            <Flame className="text-amber-500" size={20} />
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900">
            {lessons.filter((l) => l.isPopular).length}
          </h3>
          <p className="text-slate-400">হোমপেজে পপুলার হিসেবে প্রদর্শিত</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">
              অ্যাকাউন্ট স্ট্যাটাস
            </span>
            <CheckCircle2 className="text-emerald-500" size={20} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Active</h3>
          <p className="text-xs text-slate-400">{user?.email}</p>
        </div>
      </div>

      {/* --- TEACHER VIEW: সর্বশেষ ৬টি লেসন ও ম্যানেজমেন্ট সেকশন --- */}
      {isTeacher && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">
              শিক্ষক হিসেবে আপনার সাম্প্রতিক লেসনসমূহ (Manage Lessons)
            </h2>
            <Link
              to="/class/class-6"
              className="text-sm font-semibold text-teal-600 flex items-center gap-1 hover:underline"
            >
              All Lessons <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teacherLessons.map((lesson) => (
              <div
                key={lesson._id}
                className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 uppercase">
                      {lesson.classLevel}
                    </span>
                    {lesson.isPopular && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-1">
                        <Flame size={12} /> Popular
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-800 text-base line-clamp-1">
                    {lesson.title}
                  </h3>
                  <p className="text-slate-500 line-clamp-2">
                    {lesson.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                  <Link
                    to={`/lesson/${lesson._id}`}
                    className="text-xs font-bold text-teal-600 hover:underline"
                  >
                    Read →
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(lesson)}
                      className="p-2 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
                      title="Edit Lesson"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(lesson._id, lesson.title)}
                      className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                      title="Delete Lesson"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- STUDENT VIEW: সম্পন্ন করা লেসনসমূহ --- */}
      {!isTeacher && (
        <div className="space-y-6 pt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="text-emerald-600" size={22} /> তোমার
              সম্পন্ন করা লেসনসমূহ ({completedLessonsList.length})
            </h2>
            <Link
              to="/class/class-6"
              className="text-sm font-semibold text-teal-600 flex items-center gap-1 hover:underline"
            >
              All Lessons <ArrowRight size={16} />
            </Link>
          </div>

          {completedLessonsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedLessonsList.map((lesson) => (
                <div
                  key={lesson._id}
                  className="bg-emerald-50/40 p-6 rounded-2xl border border-emerald-200 space-y-3 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 uppercase">
                        {lesson.classLevel}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-600 text-white flex items-center gap-1">
                        <CheckCircle2 size={12} /> Completed
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-base line-clamp-1">
                      {lesson.title}
                    </h3>
                    <p className="text-slate-500 line-clamp-2">
                      {lesson.shortDescription}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-emerald-100 flex items-center justify-between mt-4">
                    <Link
                      to={`/lesson/${lesson._id}`}
                      className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      পুনরায় পড়ো <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-10 text-center space-y-2">
              <p className="text-slate-700 font-bold text-base">
                No completed lessons yet!
              </p>
              <p className="text-slate-500 text-sm">
                তুমি এখনো কোনো লেসন সম্পন্ন করোনি। ক্লাস থেকে পড়া শুরু করো এবং
                লেসন কমপ্লিট করো।
              </p>
            </div>
          )}
        </div>
      )}

      {/* --- EDIT LESSON MODAL --- */}
      {isEditing && currentLesson && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-350 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900">
                লেসনের সব তথ্য এডিট করুন
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateLesson} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* শ্রেণি */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">
                    শ্রেণি (Class Level)
                  </label>
                  <select
                    value={currentLesson.classLevel}
                    onChange={(e) =>
                      setCurrentLesson({
                        ...currentLesson,
                        classLevel: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    <option value="class-6">Class VI</option>
                    <option value="class-7">Class VII</option>
                    <option value="class-8">Class VIII</option>
                    <option value="ssc">SSC English</option>
                    <option value="hsc">HSC English</option>
                  </select>
                </div>

                {/* Lesson Number */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">
                    Lesson Number
                  </label>
                  <input
                    type="number"
                    value={currentLesson.lessonNumber || ""}
                    onChange={(e) =>
                      setCurrentLesson({
                        ...currentLesson,
                        lessonNumber: Number(e.target.value),
                      })
                    }
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Lesson Title */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">
                  Lesson Title
                </label>
                <input
                  type="text"
                  value={currentLesson.title}
                  onChange={(e) =>
                    setCurrentLesson({
                      ...currentLesson,
                      title: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold"
                  required
                />
              </div>

              {/* Short Description */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">
                  Short Description (সংক্ষিপ্ত বিবরণ)
                </label>
                <input
                  type="text"
                  value={currentLesson.shortDescription || ""}
                  onChange={(e) =>
                    setCurrentLesson({
                      ...currentLesson,
                      shortDescription: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              {/* Learning Objectives */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">
                  Learning Objectives
                </label>
                <textarea
                  value={currentLesson.learningObjectives || ""}
                  onChange={(e) =>
                    setCurrentLesson({
                      ...currentLesson,
                      learningObjectives: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm h-28 font-sans leading-relaxed"
                  required
                ></textarea>
              </div>

              {/* Duration */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">
                  পড়ার সময় (Duration)
                </label>
                <input
                  type="text"
                  value={currentLesson.duration || ""}
                  onChange={(e) =>
                    setCurrentLesson({
                      ...currentLesson,
                      duration: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                  required
                />
              </div>

              {/* Main Content */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">
                  Main Lesson Content (মূল পাঠ)
                </label>
                <textarea
                  value={currentLesson.content}
                  onChange={(e) =>
                    setCurrentLesson({
                      ...currentLesson,
                      content: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm h-48 font-sans leading-relaxed"
                  required
                ></textarea>
              </div>

              {/* Exercise / Quiz */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">
                  Lesson Exercise / Quiz (অনুশীলন)
                </label>
                <textarea
                  value={currentLesson.exercise || ""}
                  onChange={(e) =>
                    setCurrentLesson({
                      ...currentLesson,
                      exercise: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm h-28"
                ></textarea>
              </div>

              {/* Popular Checkbox */}
              <div className="flex items-center gap-3 p-4 bg-teal-50/50 border border-teal-100 rounded-xl">
                <input
                  type="checkbox"
                  id="editPopular"
                  checked={currentLesson.isPopular || false}
                  onChange={(e) =>
                    setCurrentLesson({
                      ...currentLesson,
                      isPopular: e.target.checked,
                    })
                  }
                  className="checkbox checkbox-teal w-5 h-5"
                />
                <label
                  htmlFor="editPopular"
                  className="text-sm font-bold text-slate-700 cursor-pointer"
                >
                  এই লেসনটিকে হোমপেজে "Popular Lessons" সেকশনে দেখাও
                </label>
              </div>

              {/* Lower Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-sm btn-outline border-slate-300 rounded-xl px-5"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="btn btn-sm bg-teal-600 hover:bg-teal-700 text-white rounded-xl border-none px-6 font-bold"
                >
                  আপডেট করো
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
