import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import Seo from "../components/common/Seo";
import { seoNoindex } from "../lib/seo";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { loginUser, loginWithGoogle } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const onSubmit = (data) => {
    setLoading(true);
    loginUser(data.email, data.password)
      .then((result) => {
        const loggedUser = result.user;
        const userInfo = {
          name: loggedUser.displayName || "Student",
          email: loggedUser.email,
          photoURL: loggedUser.photoURL || "",
        };

        axios
          .put(
            "https://learn-english-with-araf-server.onrender.com/users",
            userInfo,
          )
          .then(() => {
            setLoading(false);
            Swal.fire({
              icon: "success",
              title: "স্বাগতম!",
              text: "সফলভাবে লগইন হয়েছে।",
              confirmButtonColor: "#0d9488",
              timer: 1500,
              showConfirmButton: false,
            });
            navigate(from, { replace: true });
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "লগইন ব্যর্থ হয়েছে",
          text: "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়। দয়া করে আবার চেষ্টা করো।",
          confirmButtonColor: "#0d9488",
        });
      });
  };

  const handleGoogleLogin = () => {
    loginWithGoogle()
      .then((result) => {
        const loggedUser = result.user;
        const userInfo = {
          name: loggedUser.displayName,
          email: loggedUser.email,
          photoURL: loggedUser.photoURL,
        };

        axios
          .put(
            "https://learn-english-with-araf-server.onrender.com/users",
            userInfo,
          )
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "স্বাগতম!",
              text: "গুগল দিয়ে সফলভাবে লগইন হয়েছে।",
              confirmButtonColor: "#0d9488",
              timer: 1500,
              showConfirmButton: false,
            });
            navigate(from, { replace: true });
          });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "গুগল লগইন ব্যর্থ",
          text: error.message,
          confirmButtonColor: "#0d9488",
        });
      });
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <Seo seo={seoNoindex("Login")} />
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-extrabold text-slate-900">
            ফিরে আসার জন্য স্বাগতম
          </h1>
          <p className="text-sm text-slate-500">
            তোমার অ্যাকাউন্টে লগইন করে পড়াশোনা চালিয়ে যাও
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full btn btn-outline border-slate-300 hover:border-teal-600 text-slate-700 rounded-xl flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.19v3.15C3.17 21.36 7.23 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.19C.43 8.1 0 9.8 0 12s.43 3.9 1.19 5.42l4.09-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.17 2.64 1.19 6.58l4.09 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          গুগল দিয়ে লগইন করো
        </button>

        <div className="flex items-center my-4">
          <div className="grow border-t border-slate-200"></div>
          <span className="px-3 text-xs text-slate-400 uppercase">অথবা</span>
          <div className="grow border-t border-slate-200"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              ইমেইল ঠিকানা
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 text-sm"
                {...register("email", { required: "ইমেইল দেওয়া বাধ্যতামূলক" })}
              />
            </div>
            {errors.email && (
              <span className="text-xs text-rose-500">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 text-sm"
                {...register("password", {
                  required: "পাসওয়ার্ড দেওয়া বাধ্যতামূলক",
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-rose-500">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md shadow-teal-100 border-none gap-2 mt-2 disabled:bg-teal-400"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} /> লগইন হচ্ছে...
              </>
            ) : (
              <>
                লগইন করো <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            to="/register"
            className="text-teal-600 font-bold hover:underline"
          >
            ফ্রি অ্যাকাউন্ট তৈরি করো
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
