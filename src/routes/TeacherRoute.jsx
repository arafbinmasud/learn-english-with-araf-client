import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const TeacherRoute = ({ children }) => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-teal-600" size={40} />
      </div>
    );
  }

  // তোমার ইমেইল দিয়ে সরাসরি চেক করা হচ্ছে
  if (user && user.email === "araf357300@gmail.com") {
    return children;
  }

  // শিক্ষক না হলে হোমপেজে পাঠিয়ে দেবে
  return <Navigate to="/" state={{ from: location }} replace></Navigate>;
};

export default TeacherRoute;