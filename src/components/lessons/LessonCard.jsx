import { BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ---------- Shared markdown styles (inline, Tailwind reset-proof) ----------
const s = {
  wrap: {
    overflowX: "auto",
    margin: "1.5rem 0",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    background: "#ffffff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.95rem",
  },
  th: {
    padding: "14px 20px",
    textAlign: "left",
    background: "#eef2ff",
    color: "#1e293b",
    borderBottom: "2px solid #c7d2fe",
    whiteSpace: "nowrap",
    fontWeight: 700,
  },
  td: {
    padding: "14px 20px",
    textAlign: "left",
    borderBottom: "1px solid #e2e8f0",
    lineHeight: 1.7,
    verticalAlign: "top",
  },
  blockquote: {
    margin: "1.25rem 0",
    padding: "14px 18px",
    background: "#fff7ed",
    borderLeft: "4px solid #f59e0b",
    borderRadius: "8px",
  },
  ul: { listStyleType: "disc", paddingLeft: "1.5rem", margin: "0.75rem 0" },
  ol: { listStyleType: "decimal", paddingLeft: "1.5rem", margin: "0.75rem 0" },
  li: { margin: "0.4rem 0" },
  h1: {
    fontSize: "1.75rem",
    fontWeight: 800,
    margin: "2.5rem 0 1rem",
    color: "#0f172a",
  },
  h2: {
    fontSize: "1.4rem",
    fontWeight: 700,
    margin: "2rem 0 0.8rem",
    color: "#0f172a",
  },
  h3: {
    fontSize: "1.2rem",
    fontWeight: 700,
    margin: "1.5rem 0 0.6rem",
    color: "#0f172a",
  },
  p: { margin: "0.8rem 0" },
  hr: { margin: "2rem 0", border: "none", borderTop: "1px solid #e2e8f0" },
  code: {
    background: "#f1f5f9",
    padding: "2px 6px",
    borderRadius: "6px",
    fontSize: "0.9em",
  },
};

const markdownComponents = {
  table: ({ node, ...props }) => (
    <div style={s.wrap}>
      <table style={s.table} {...props} />
    </div>
  ),
  th: ({ node, ...props }) => <th style={s.th} {...props} />,
  td: ({ node, ...props }) => <td style={s.td} {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote style={s.blockquote} {...props} />
  ),
  ul: ({ node, ...props }) => <ul style={s.ul} {...props} />,
  ol: ({ node, ...props }) => <ol style={s.ol} {...props} />,
  li: ({ node, ...props }) => <li style={s.li} {...props} />,
  h1: ({ node, ...props }) => <h2 style={s.h1} {...props} />,
  h2: ({ node, ...props }) => <h3 style={s.h2} {...props} />,
  h3: ({ node, ...props }) => <h4 style={s.h3} {...props} />,
  h4: ({ node, ...props }) => <h5 style={s.h3} {...props} />,
  p: ({ node, ...props }) => <p style={s.p} {...props} />,
  hr: ({ node, ...props }) => <hr style={s.hr} {...props} />,
  code: ({ node, inline, ...props }) => <code style={s.code} {...props} />,
};

// ---------- Reusable renderer ----------
const Markdown = ({ children }) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
    {children}
  </ReactMarkdown>
);

// ---------- Lesson card ----------
const LessonCard = ({ lesson }) => {
  if (!lesson) return null;

  return (
    <article className="bg-white p-4 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
      <header className="space-y-2 border-b border-slate-100 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {lesson.title}
        </h1>
        <p className="text-sm text-slate-500 flex items-center gap-1.5">
          <BookOpen size={15} className="text-teal-600" aria-hidden="true" />{" "}
          মনোযোগ দিয়ে পুরো লেসনটি পড়ে নাও।
        </p>
      </header>

      {lesson.learningObjectives && (
        <section aria-labelledby="objectives-heading" className="space-y-4">
          <h2
            id="objectives-heading"
            className="text-xl sm:text-2xl font-extrabold text-slate-900"
          >
            এই লেসন শেষে যা যা শিখবেঃ-
          </h2>
          <div className="text-slate-700 text-base sm:text-lg leading-relaxed">
            <Markdown>{lesson.learningObjectives}</Markdown>
          </div>
        </section>
      )}

      <section className="text-slate-700 text-base sm:text-lg leading-relaxed">
        <Markdown>{lesson.content}</Markdown>
      </section>

      {lesson.exercise && (
        <section
          aria-labelledby="exercise-heading"
          className="bg-teal-50/70 border border-teal-100 rounded-2xl p-6 space-y-3"
        >
          <h2
            id="exercise-heading"
            className="font-bold text-teal-900 text-lg flex items-center gap-2"
          >
            <span aria-hidden="true">📝</span> অনুশীলন:
          </h2>
          <div className="text-base text-slate-700 font-medium">
            <Markdown>{lesson.exercise}</Markdown>
          </div>
        </section>
      )}
    </article>
  );
};

export default LessonCard;
