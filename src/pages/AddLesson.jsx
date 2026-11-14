import { useState, useContext } from "react";
import { useNavigate } from "react-router"; // ১. useNavigate ইম্পোর্ট করা হলো
import { AuthContext } from "../context/AuthContext";
import { axiosSecure } from "../api/axiosInstance";
import { BookPlus, PlusCircle, Loader2, Sparkles } from "lucide-react";
import Swal from "sweetalert2";

const AddLesson = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // ২. useNavigate হুক ইনিশিয়ালাইজ করা হলো
  const [loading, setLoading] = useState(false);

  // ডিফল্ট বা ডেমো হিসেবে তোমার দেওয়া "Parts of Speech" ডেটা দিয়ে ফর্ম প্রি-ফিল করা
  const [formData, setFormData] = useState({
    classLevel: "class-6",
    lessonNumber: "1",
    title: "Parts of Speech (পদ পরিচিতি)",
    duration: "১০ মিনিট",
    shortDescription:
      "ইংরেজি বাক্যে ব্যবহৃত প্রতিটি শব্দের কাজ ও প্রকারভেদ একদম সহজভাবে শিখে নাও।",
    learningObjectives:
      "Parts of Speech কী, তা বুঝতে পারবে\nইংরেজি বাক্যে শব্দের ভূমিকা চিনতে পারবে।\nParts of Speech-এর আটটি প্রকারের নাম বলতে পারবে।",
    content: `Unit 1: Parts of Speech (পদ পরিচিতি)
চলো, Parts of Speech শিখে নিই!
ইংরেজি শেখার শুরুতেই তোমাকে একটি গুরুত্বপূর্ণ বিষয় জানতে হবে। সেটি হলো Parts of Speech।
আমরা যখন কোনো বাক্য তৈরি করি, তখন সেখানে বিভিন্ন ধরনের শব্দ ব্যবহার করি। প্রতিটি শব্দের বাক্যের মধ্যে আলাদা আলাদা কাজ থাকে...`,
    exercise:
      "1. নিচের বাক্যগুলোতে Bold করা শব্দগুলোর Parts of Speech শনাক্ত করো:\nRahim is my friend.\n2. She is a beautiful girl.\n3. I play football.",
    isPopular: false, // নতুন পপুলার চেকবাক্স ফিল্ড
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
      isPopular: formData.isPopular, // ব্যাকএন্ডে পপুলার স্ট্যাটাস পাঠানো
    };

    setLoading(true);
    axiosSecure
      .post("/lessons", lessonPayload)
      .then((res) => {
        setLoading(false);
        if (res.data.insertedId) {
          Swal.fire({
            icon: "success",
            title: "সফল হয়েছে! 🎉",
            text: "লেসনটি সফলভাবে ডাটাবেজে সেভ হয়েছে।",
            confirmButtonColor: "#0d9488",
          }).then(() => {
            // ৩. অ্যালার্টের ওকে বাটনে ক্লিক করার পর ড্যাশবোর্ডে রিডাইরেক্ট হবে
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
      <form
        onSubmit={handleAddLesson}
        className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl space-y-6"
      >
        {/* Header */}
        <div className="space-y-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-teal-600 font-bold text-sm">
            <BookPlus size={20} /> শিক্ষক প্যানেল (Teacher Panel)
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            নতুন লেসন ও গ্রামার কনটেন্ট যুক্ত করো
          </h1>
          <p className="text-xs text-slate-500">
            তোমার দেওয়া স্ট্রাকচার অনুযায়ী লেসনটি সরাসরি MongoDB-তে সংরক্ষিত
            হবে।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* শ্রেণি */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              শ্রেণি (Class Level)
            </label>
            <select
              name="classLevel"
              value={formData.classLevel}
              onChange={handleInputChange}
              className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-600 text-sm font-medium"
              required
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
            <label className="text-xs font-bold text-slate-700">
              Lesson Number
            </label>
            <input
              type="number"
              name="lessonNumber"
              value={formData.lessonNumber}
              onChange={handleInputChange}
              placeholder="যেমন: 1"
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 text-sm"
              required
            />
          </div>
        </div>

        {/* Lesson Title */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Lesson Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="যেমন: Parts of Speech (পদ পরিচিতি)"
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 text-sm font-bold text-slate-800"
            required
          />
        </div>

        {/* Short Description */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Short Description (সংক্ষিপ্ত বিবরণ)
          </label>
          <input
            type="text"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleInputChange}
            placeholder="লেসন সম্পর্কে এক লাইনে বিবরণ..."
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 text-sm"
          />
        </div>

        {/* learning objectives */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Learning Objectives
          </label>
          <textarea
            name="learningObjectives"
            value={formData.learningObjectives}
            onChange={handleInputChange}
            placeholder="Learning objectives এখানে লেখো..."
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 text-sm h-32 font-sans leading-relaxed"
            required
          ></textarea>
        </div>

        {/* Duration */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            পড়ার সময় (Duration)
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            placeholder="যেমন: ১০ মিনিট"
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 text-sm"
            required
          />
        </div>

        {/* Main Content */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Main Lesson Content (বাংলা ও ইংরেজি মিলিয়ে মূল পাঠ)
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="এখানে সম্পূর্ণ লেসনটি পেস্ট করো..."
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 text-sm h-64 font-sans leading-relaxed"
            required
          ></textarea>
        </div>

        {/* Exercise / Quiz Section */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Lesson Exercise / Quiz (অনুশীলন)
          </label>
          <textarea
            name="exercise"
            value={formData.exercise}
            onChange={handleInputChange}
            placeholder="অনুশীলনের প্রশ্নগুলো এখানে লেখো..."
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 text-sm h-32"
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
            className="text-sm font-bold text-slate-700 cursor-pointer"
          >
            এই লেসনটিকে হোমপেজে "Popular Lessons" সেকশনে দেখাও (সর্বোচ্চ ৬টি
            পর্যন্ত দেখাতে পারো)
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md shadow-teal-100 border-none gap-2 disabled:bg-teal-400 py-3.5 text-base font-bold"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} /> ডাটাবেজে সেভ
              হচ্ছে...
            </>
          ) : (
            <>
              <PlusCircle size={20} /> লেসন ডাটাবেজে সংরক্ষণ করো
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddLesson;