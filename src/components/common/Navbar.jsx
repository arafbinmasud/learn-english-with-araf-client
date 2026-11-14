import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { Menu, X, LogOut, User, LayoutDashboard } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

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

  const navLinkStyle = ({ isActive }) =>
    isActive
      ? "text-teal-600 font-semibold border-b-2 border-teal-600 pb-1 transition-all"
      : "text-slate-600 hover:text-teal-600 font-medium transition-all";

  const mobileNavLinkStyle = ({ isActive }) =>
    isActive
      ? "text-teal-600 font-semibold bg-teal-50 px-4 py-2.5 rounded-xl"
      : "text-slate-600 hover:bg-slate-50 px-4 py-2.5 rounded-xl font-medium";

  return (
    <div className="w-full bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 shadow-xs">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold brand-gradient tracking-tight">
              Learn English
            </span>
            <span className="text-[15px] tracking-widest uppercase text-slate-400 font-semibold -mt-1">
              With Araf
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden lg:flex items-center gap-7 text-sm font-medium">
          <li>
            <NavLink to="/" className={navLinkStyle}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/class/class-6" className={navLinkStyle}>
              Class VI
            </NavLink>
          </li>
          <li>
            <NavLink to="/class/class-7" className={navLinkStyle}>
              Class VII
            </NavLink>
          </li>
          <li>
            <NavLink to="/class/class-8" className={navLinkStyle}>
              Class VIII
            </NavLink>
          </li>
          <li>
            <NavLink to="/class/ssc" className={navLinkStyle}>
              SSC
            </NavLink>
          </li>
          <li>
            <NavLink to="/class/hsc" className={navLinkStyle}>
              HSC
            </NavLink>
          </li>
          {/* ইউজার লগইন করা থাকলে ড্যাশবোর্ড মেনু দেখাবে */}
          {user && (
            <li>
              <NavLink to="/dashboard" className={navLinkStyle}>
                Dashboard
              </NavLink>
            </li>
          )}
          {user && user.email === "araf357300@gmail.com" && (
            <li>
              <NavLink to="/add-lesson" className={navLinkStyle}>
                Add Lesson
              </NavLink>
            </li>
          )}
        </ul>

        {/* Desktop User Section */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* প্রোফাইল বা নামের ওপর ক্লিক করলেও ড্যাশবোর্ডে যাওয়া যাবে */}
              <Link
                to="/dashboard"
                className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 pl-1.5 pr-3.5 py-1 rounded-full hover:border-teal-500 transition-colors"
                title="ড্যাশবোর্ডে যাও"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-8 h-8 rounded-full object-cover border border-teal-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                    {user.displayName ? (
                      user.displayName.charAt(0).toUpperCase()
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                )}
                <span className="text-sm font-semibold text-slate-700 max-w-32 truncate">
                  {user.displayName || "Student"}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-sm bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200 rounded-xl gap-1.5 font-semibold"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 px-6 py-6 space-y-3 shadow-xl animate-fadeIn">
          <ul className="flex flex-col gap-2 text-base">
            <li>
              <NavLink
                to="/"
                onClick={() => setIsOpen(false)}
                className={mobileNavLinkStyle}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/class/class-6"
                onClick={() => setIsOpen(false)}
                className={mobileNavLinkStyle}
              >
                Class VI
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/class/class-7"
                onClick={() => setIsOpen(false)}
                className={mobileNavLinkStyle}
              >
                Class VII
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/class/class-8"
                onClick={() => setIsOpen(false)}
                className={mobileNavLinkStyle}
              >
                Class VIII
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/class/ssc"
                onClick={() => setIsOpen(false)}
                className={mobileNavLinkStyle}
              >
                SSC
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/class/hsc"
                onClick={() => setIsOpen(false)}
                className={mobileNavLinkStyle}
              >
                HSC
              </NavLink>
            </li>
            {user && (
              <li>
                <NavLink
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={mobileNavLinkStyle}
                >
                  Dashboard
                </NavLink>
              </li>
            )}
            {user && user.email === "araf357300@gmail.com" && (
              <li>
                <NavLink
                  to="/add-lesson"
                  onClick={() => setIsOpen(false)}
                  className={mobileNavLinkStyle}
                >
                  Add Lesson
                </NavLink>
              </li>
            )}
          </ul>

          <div className="pt-4 border-t border-slate-100">
            {user ? (
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="w-10 h-10 rounded-full object-cover border border-teal-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                      {user.displayName ? (
                        user.displayName.charAt(0).toUpperCase()
                      ) : (
                        <User size={18} />
                      )}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">
                      {user.displayName || "Student"}
                    </span>
                    <span className="text-xs text-slate-500 truncate max-w-45">
                      {user.email}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200 rounded-xl gap-1"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="btn btn-outline btn-sm flex-1 text-slate-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="btn btn-sm bg-teal-600 hover:bg-teal-700 text-white border-none flex-1"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
