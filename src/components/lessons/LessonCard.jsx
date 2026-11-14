import { BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";

const LessonCard = ({ lesson }) => {
  if (!lesson) return null;

  return (
    <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
      <div className="space-y-2 border-b border-slate-100 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {lesson.title}
        </h1>
        <p className="text-sm text-slate-500 flex items-center gap-1.5">
          <BookOpen size={15} className="text-teal-600" /> মনোযোগ দিয়ে পুরো
          লেসনটি পড়ে নাও।
        </p>
      </div>

      {/* মূল কন্টেন্ট (ReactMarkdown ব্যবহার করে) */}
      <div className="text-slate-700 text-base sm:text-lg space-y-4 leading-relaxed">
        <ReactMarkdown>{lesson.content}</ReactMarkdown>
      </div>

      {/* অনুশীলন বা এক্সারসাইজ সেকশন */}
      {lesson.exercise && (
        <div className="bg-teal-50/70 border border-teal-100 rounded-2xl p-6 space-y-3">
          <h3 className="font-bold text-teal-900 text-lg flex items-center gap-2">
            📝 অনুশীলন:
          </h3>
          <div className="text-base text-slate-700 font-medium">
            <ReactMarkdown>{lesson.exercise}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonCard;