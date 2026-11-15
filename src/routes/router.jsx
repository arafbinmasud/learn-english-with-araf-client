import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import PrivateRoute from "./PrivateRoute";
import TeacherRoute from "./TeacherRoute";
import { Loader2 } from "lucide-react";

// প্রবেশের পেজগুলো (হোম, ক্লাস, লেসন) সরাসরি ইম্পোর্ট: এগুলো আগে থেকেই prerender করা HTML হিসেবে আসে,
// lazy করলে JS চাঙ্ক লোডের সময় সেই কনটেন্ট স্পিনারে ঢেকে যেত।
import Home from "../pages/Home";
import ClassSyllabus from "../pages/ClassSyllabus";
import LessonReader from "../pages/LessonReader";
import NotFound from "../pages/NotFound";

// বাকি পেজগুলো (লগইন, ড্যাশবোর্ড ইত্যাদি) lazy লোড হয়
const Profile = lazy(() => import("../pages/Profile"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const AddLesson = lazy(() => import("../pages/AddLesson"));

// ২. পেজ লোড হওয়ার সময় দেখানোর জন্য সুন্দর স্পিনার কম্পোনেন্ট
const PageLoader = () => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <Loader2 className="animate-spin text-teal-600" size={45} />
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "class/:classLevel",
        element: <ClassSyllabus />,
      },
      {
        path: "lesson/:lessonId",
        element: <LessonReader />,
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Profile />
          </Suspense>
        ),
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Register />
          </Suspense>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: "/add-lesson",
        element: (
          <TeacherRoute>
            <Suspense fallback={<PageLoader />}>
              <AddLesson />
            </Suspense>
          </TeacherRoute>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);