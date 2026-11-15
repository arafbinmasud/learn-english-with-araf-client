import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { axiosSecure } from "../api/axiosInstance";
import { BookPlus, PlusCircle, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import Seo from "../components/common/Seo";
import { seoNoindex } from "../lib/seo";

const AddLesson = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    classLevel: "",
    lessonNumber: "",
    title: "",
    duration: "",
    shortDescription: "",
    learningObjectives: "",
    content: "",
    exercise: "",
    isPopular: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddLesson = (e) => {
    e.preventDefault();

    const lessonPayload = {
      classLevel: formData.classLevel,
      lessonNumber: Number(formData.lessonNumber),
      title: formData.title,
      duration: formData.duration,
      shortDescription: formData.shortDescription,
      learningObjectives: formData.learningObjectives,
      content: formData.content,
      exercise: formData.exercise,
      isPopular: formData.isPopular,
    };

    setLoading(true);
    axiosSecure
      .post("/lessons", lessonPayload)
      .then((res) => {
        setLoading(false);
        if (res.data.insertedId) {
          setFormData({
            classLevel: "",
            lessonNumber: "",
            title: "",
            duration: "",
            shortDescription: "",
            learningObjectives: "",
            content: "",
            exercise: "",
            isPopular: false,
          });

          Swal.fire({
            icon: "success",
            title: "সফল হয়েছে! 🎉",
            text: "লেসনটি সফলভাবে ডাটাবেজে সেভ হয়েছে।",
            confirmButtonColor: "#0d9488",
          }).then(() => {
            navigate("/dashboard");
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "সমস্যা হয়েছে",
          text: "লেসন সেভ করা যায়নি। আবার চেষ্টা করো।",
          confirmButtonColor: "#0d9488",
        });
      });
  };

  return (
    <div className="max-w-350 mx-auto py-12 px-4">
      <Seo seo={seoNoindex("Add Lesson")} />
      <form
        onSubmit={handleAddLesson}
        className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl space-y-6"
      >
        {/* Header */}
        <div className="space-y-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-teal-600 font-bold text-base">
            <BookPlus size={22} /> শিক্ষক প্যানেল (Teacher Panel)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            নতুন লেসন ও গ্রামার কনটেন্ট যুক্ত করো
          </h1>
          <p className="text-sm text-slate-600">
            তোমার দেওয়া স্ট্রাকচার অনুযায়ী লেসনটি সরাসরি MongoDB-তে সংরক্ষিত
            হবে।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* শ্রেণি */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              শ্রেণি (Class Level)
            </label>
            <select
              name="classLevel"
              value={formData.classLevel}
              onChange={handleInputChange}
              className="w-full p-3.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-teal-600 text-base font-medium text-slate-700"
              required
            >
              <option value="" disabled>
                শ্রেণি সিলেক্ট করো...
              </option>
              <option value="class-6">Class VI</option>
              <option value="class-7">Class VII</option>
              <option value="class-8">Class VIII</option>
              <option value="ssc">SSC English</option>
              <option value="hsc">HSC English</option>
            </select>
          </div>

          {/* Lesson Number */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Lesson Number
            </label>
            <input
              type="number"
              name="lessonNumber"
              value={formData.lessonNumber}
              onChange={handleInputChange}
              placeholder="যেমন: 1"
              className="w-full p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-600 text-base"
              required
            />
          </div>
        </div>

        {/* Lesson Title */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">
            Lesson Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="যেমন: Parts of Speech (পদ পরিচিতি)"
            className="w-full p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-600 text-base font-bold text-slate-800"
            required
          />
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">
            Short Description (সংক্ষিপ্ত বিবরণ)
          </label>
          <input
            type="text"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleInputChange}
            placeholder="লেসন সম্পর্কে এক লাইনে বিবরণ..."
            className="w-full p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-600 text-base"
          />
        </div>

        {/* learning objectives */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">
            Learning Objectives
          </label>
          <textarea
            name="learningObjectives"
            value={formData.learningObjectives}
            onChange={handleInputChange}
            placeholder="Learning objectives এখানে লেখো..."
            className="w-full p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-600 text-base h-36 font-sans leading-relaxed"
            required
          ></textarea>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">
            পড়ার সময় (Duration)
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            placeholder="যেমন: ১০ মিনিট"
            className="w-full p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-600 text-base"
            required
          />
        </div>

        {/* Main Content */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">
            Main Lesson Content (বাংলা ও ইংরেজি মিলিয়ে মূল পাঠ)
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="এখানে সম্পূর্ণ লেসনটি পেস্ট করো..."
            className="w-full p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-600 text-base h-72 font-sans leading-relaxed"
            required
          ></textarea>
        </div>

        {/* Exercise / Quiz Section */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">
            Lesson Exercise / Quiz (অনুশীলন)
          </label>
          <textarea
            name="exercise"
            value={formData.exercise}
            onChange={handleInputChange}
            placeholder="অনুশীলনের প্রশ্নগুলো এখানে লেখো..."
            className="w-full p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-600 text-base h-36"
          ></textarea>
        </div>

        {/* Popular Lesson Checkbox */}
        <div className="flex items-center gap-3 p-4 bg-teal-50/50 border border-teal-100 rounded-xl cursor-pointer select-none">
          <input
            type="checkbox"
            name="isPopular"
            id="isPopular"
            checked={formData.isPopular}
            onChange={handleInputChange}
            className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
          />
          <label
            htmlFor="isPopular"
            className="text-base font-bold text-slate-700 cursor-pointer"
          >
            এই লেসনটিকে হোমপেজে "Popular Lessons" সেকশনে দেখাও (সর্বোচ্চ ৬টি
            পর্যন্ত দেখাতে পারো)
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md shadow-teal-100 border-none gap-2 disabled:bg-teal-400 py-4 text-lg font-bold"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={22} /> ডাটাবেজে সেভ
              হচ্ছে...
            </>
          ) : (
            <>
              <PlusCircle size={22} /> লেসন ডাটাবেজে সংরক্ষণ করো
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddLesson;