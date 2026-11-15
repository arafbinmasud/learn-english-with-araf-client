import { Link } from "react-router";
import Seo from "../components/common/Seo";
import { seoNoindex } from "../lib/seo";
import { CLASSES } from "../config/site";

const NotFound = () => (
  <section className="max-w-2xl mx-auto py-20 text-center space-y-6">
    <Seo seo={seoNoindex("পেজটি পাওয়া যায়নি (404)")} />
    <p className="text-6xl font-extrabold brand-gradient">404</p>
    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
      দুঃখিত, পেজটি খুঁজে পাওয়া যায়নি
    </h1>
    <p className="text-slate-600">
      লিংকটি ভুল হতে পারে অথবা পেজটি সরিয়ে ফেলা হয়েছে। নিচের ক্লাস থেকে তোমার লেসন
      বেছে নাও।
    </p>
    <ul className="flex flex-wrap justify-center gap-3">
      {CLASSES.map((c) => (
        <li key={c.slug}>
          <Link
            to={`/class/${c.slug}`}
            className="btn btn-outline border-slate-300 hover:border-teal-600 rounded-xl"
          >
            {c.short}
          </Link>
        </li>
      ))}
    </ul>
    <Link
      to="/"
      className="btn bg-teal-600 hover:bg-teal-700 text-white border-none rounded-xl"
    >
      হোমে ফিরে যাও
    </Link>
  </section>
);

export default NotFound;
