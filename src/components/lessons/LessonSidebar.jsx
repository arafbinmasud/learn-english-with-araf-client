import { Link } from "react-router";
import { CheckCircle2, BookOpen } from "lucide-react";

const LessonSidebar = ({
  lessons,
  currentLessonId,
  completedLessons = [],
  classLevel,
}) => {
  // ক্লাস লেভেলকে সুন্দর নামে রূপান্তর করার ফাংশন
  const formatClassName = (level) => {
    switch (level) {
      case "class-6":
        return "Class VI";
      case "class-7":
        return "Class VII";
      case "class-8":
        return "Class VIII";
      case "ssc":
        return "SSC English";
      case "hsc":
        return "HSC English";
      default:
        return "this class";
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <BookOpen size={20} className="text-teal-600" />
        <h3 className="font-extrabold text-slate-800 text-base">
          All Lessons for {formatClassName(classLevel)}
        </h3>
      </div>

      <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
        {lessons?.map((lesson, idx) => {
          const isCurrent = lesson._id === currentLessonId;
          const isDone = completedLessons.includes(lesson._id);

          return (
            <Link
              key={lesson._id}
              to={`/lesson/${lesson._id}`}
              className={`flex items-center justify-between p-3.5 rounded-2xl text-sm font-medium transition-all ${
                isCurrent
                  ? "bg-teal-600 text-white shadow-md shadow-teal-100 font-bold"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700"
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${isCurrent ? "bg-white/20 text-white" : "bg-teal-50 text-teal-600"}`}
                >
                  {idx + 1}
                </span>
                <span className="truncate">{lesson.title}</span>
              </div>

              {isDone && (
                <CheckCircle2
                  size={18}
                  className={isCurrent ? "text-white" : "text-emerald-600"}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default LessonSidebar;
