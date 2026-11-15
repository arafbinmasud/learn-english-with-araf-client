import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { Menu, X, LogOut, User } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { CLASSES } from "../../config/site";

const TEACHER_EMAIL = "araf357300@gmail.com";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser()
      .then(() => {
        setIsOpen(false);
        navigate("/");
      })
      .catch((error) => console.log(error));
  };

  const links = [
    { to: "/", label: "Home", end: true },
    ...CLASSES.map((c) => ({ to: `/class/${c.slug}`, label: c.short })),
    ...(user ? [{ to: "/dashboard", label: "Dashboard" }] : []),
    ...(user && user.email === TEACHER_EMAIL
      ? [{ to: "/add-lesson", label: "Add Lesson" }]
      : []),
  ];

  const navLinkStyle = ({ isActive }) =>
    isActive
      ? "text-teal-600 font-semibold border-b-2 border-teal-600 pb-1 transition-all"
      : "text-slate-600 hover:text-teal-600 font-medium transition-all";

  const mobileNavLinkStyle = ({ isActive }) =>
    isActive
      ? "block text-teal-600 font-semibold bg-teal-50 px-4 py-2.5 rounded-xl"
      : "block text-slate-600 hover:bg-slate-50 px-4 py-2.5 rounded-xl font-medium";

  const renderAvatar = (size) =>
    user.photoURL ? (
      <img
        src={user.photoURL}
        alt=""
        width={size}
        height={size}
        className={`${size === 32 ? "w-8 h-8" : "w-10 h-10"} rounded-full object-cover border border-teal-500`}
        referrerPolicy="no-referrer"
      />
    ) : (
      <span
        aria-hidden="true"
        className={`${size === 32 ? "w-8 h-8 text-sm" : "w-10 h-10"} rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold`}
      >
        {user.displayName ? (
          user.displayName.charAt(0).toUpperCase()
        ) : (
          <User size={16} />
        )}
      </span>
    );

  return (
    <header className="w-full bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 shadow-xs">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between">
        <Link
          to="/"
          className="flex flex-col"
          aria-label="Learn English With Araf, হোম পেজ"
        >
          <span className="text-2xl font-extrabold brand-gradient tracking-tight">
            Learn English
          </span>
          <span className="text-[15px] tracking-widest uppercase text-slate-400 font-semibold -mt-1">
            With Araf
          </span>
        </Link>

        <nav aria-label="প্রধান মেনু" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-sm font-medium">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end} className={navLinkStyle}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 pl-1.5 pr-3.5 py-1 rounded-full hover:border-teal-500 transition-colors"
                title="ড্যাশবোর্ডে যাও"
              >
                {renderAvatar(32)}
                <span className="text-sm font-semibold text-slate-700 max-w-32 truncate">
                  {user.displayName || "Student"}
                </span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-sm bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200 rounded-xl gap-1.5 font-semibold"
              >
                <LogOut size={16} aria-hidden="true" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-ghost text-slate-700 hover:text-teal-600 font-semibold"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn bg-teal-600 hover:bg-teal-700 text-white border-none shadow-md shadow-teal-100 px-5"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label={isOpen ? "মেনু বন্ধ করো" : "মেনু খোলো"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? (
            <X size={26} aria-hidden="true" />
          ) : (
            <Menu size={26} aria-hidden="true" />
          )}
        </button>
      </div>

      {isOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 px-6 py-6 space-y-3 shadow-xl animate-fadeIn"
        >
          <nav aria-label="মোবাইল মেনু">
            <ul className="flex flex-col gap-2 text-base">
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.end}
                    onClick={() => setIsOpen(false)}
                    className={mobileNavLinkStyle}
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="pt-4 border-t border-slate-100">
            {user ? (
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3"
                >
                  {renderAvatar(40)}
                  <span className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">
                      {user.displayName || "Student"}
                    </span>
                    <span className="text-xs text-slate-500 truncate max-w-45">
                      {user.email}
                    </span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-sm bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200 rounded-xl gap-1"
                >
                  <LogOut size={16} aria-hidden="true" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="btn btn-outline flex-1 border-slate-300 text-slate-700 rounded-xl"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="btn flex-1 bg-teal-600 hover:bg-teal-700 text-white border-none rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
