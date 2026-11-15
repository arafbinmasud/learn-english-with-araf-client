import { Link } from "react-router";
import { CLASSES, SITE_NAME } from "../../config/site";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 mt-16 py-10">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-12 grid gap-8 sm:grid-cols-2 text-sm text-slate-500">
        <div className="space-y-2">
          <p className="text-base font-bold text-slate-800">{SITE_NAME}</p>
          <p>
            ষষ্ঠ শ্রেণি থেকে এইচএসসি পর্যন্ত ইংরেজি গ্রামার, সহজ বাংলায় সম্পূর্ণ ফ্রি।
          </p>
          <p className="font-medium text-teal-600">
            NCTB Syllabus Based Free Learning Platform
          </p>
        </div>

        <nav aria-label="ফুটার মেনু" className="sm:justify-self-end">
          <p className="text-base font-bold text-slate-800 mb-2">
            ক্লাস অনুযায়ী লেসন
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {CLASSES.map((c) => (
              <li key={c.slug}>
                <Link
                  to={`/class/${c.slug}`}
                  className="hover:text-teal-600 transition-colors"
                >
                  {c.short}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="sm:col-span-2 pt-4 border-t border-slate-100">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
