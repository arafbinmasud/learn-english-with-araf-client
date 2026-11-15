import { Link } from "react-router";
import { CheckCircle2, BookOpen } from "lucide-react";
import { getClass } from "../../config/site";

const LessonSidebar = ({
  lessons,
  currentLessonId,
  completedLessons = [],
  classLevel,
}) => {
  const classLabel = getClass(classLevel)?.short || "this class";

  return (
    <nav
      aria-label="এই ক্লাসের সব লেসন"
      className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-sm"
    >
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <BookOpen size={20} className="text-teal-600" aria-hidden="true" />
        <h2 className="font-extrabold text-slate-800 text-base">
          All Lessons for {classLabel}
        </h2>
      </div>

      <ol className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
        {lessons?.map((lesson, idx) => {
          const isCurrent = lesson._id === currentLessonId;
          const isDone = completedLessons.includes(lesson._id);

          return (
            <li key={lesson._id}>
            <Link
              aria-current={isCurrent ? "page" : undefined}
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
                  aria-label="সম্পন্ন"
                  size={18}
                  className={isCurrent ? "text-white" : "text-emerald-600"}
                />
              )}
            </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default LessonSidebar;
