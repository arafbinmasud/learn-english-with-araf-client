import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (data) => {
    setLoading(true);
    createUser(data.email, data.password)
      .then((result) => {
        const loggedUser = result.user;
        updateUserProfile(data.name, "")
          .then(() => {
            // ব্যাকএন্ডে ইউজার ডেটা সেভ করা
            const userInfo = {
              name: data.name,
              email: data.email,
              photoURL: "",
            };
            axios
              .put(
                "https://learn-english-with-araf-server.onrender.com/users",
                userInfo,
              )
              .then((res) => {
                if (
                  res.data.insertedId ||
                  res.data.modifiedCount > 0 ||
                  res.data.upsertedId
                ) {
                  setLoading(false);
                  Swal.fire({
                    icon: "success",
                    title: "অভিনন্দন!",
                    text: "সফলভাবে অ্যাকাউন্ট তৈরি হয়েছে।",
                    confirmButtonColor: "#0d9488",
                  });
                  navigate("/");
                }
              })
              .catch((err) => {
                setLoading(false);
                console.log(err);
              });
          })
          .catch((error) => {
            setLoading(false);
            console.log(error);
          });
      })
      .catch((error) => {
        setLoading(false);
        if (error.code === "auth/email-already-in-use") {
          Swal.fire({
            icon: "error",
            title: "ইমেইল ইতিমধ্যে ব্যবহৃত!",
            text: "এই ইমেইল দিয়ে আগেই একটি অ্যাকাউন্ট খোলা হয়েছে। দয়া করে লগইন করো।",
            confirmButtonColor: "#0d9488",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "সমস্যা হয়েছে",
            text: error.message,
            confirmButtonColor: "#0d9488",
          });
        }
      });
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-extrabold text-slate-900">
            অ্যাকাউন্ট তৈরি করো
          </h1>
          <p className="text-sm text-slate-500">
            তোমার পড়ার প্রোগ্রেস সেভ রাখতে ফ্রি রেজিস্টার করে নাও
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              তোমার নাম
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <User size={18} />
              </span>
              <input
                type="text"
                placeholder="যেমন: Araf Bin Masud"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 text-sm"
                {...register("name", { required: "নাম দেওয়া বাধ্যতামূলক" })}
              />
            </div>
            {errors.name && (
              <span className="text-xs text-rose-500">
                {errors.name.message}
              </span>
            )}
          </div>

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
                placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 text-sm"
                {...register("password", {
                  required: "পাসওয়ার্ড দেওয়া বাধ্যতামূলক",
                  minLength: { value: 6, message: "কমপক্ষে ৬ অক্ষরের হতে হবে" },
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
                <Loader2 className="animate-spin" size={18} /> তৈরি হচ্ছে...
              </>
            ) : (
              <>
                অ্যাকাউন্ট খোলো <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          অ্যাকাউন্ট আছে?{" "}
          <Link to="/login" className="text-teal-600 font-bold hover:underline">
            লগইন করো
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
