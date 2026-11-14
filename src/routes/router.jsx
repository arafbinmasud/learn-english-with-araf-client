import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import PrivateRoute from "./PrivateRoute";
import TeacherRoute from "./TeacherRoute";
import { Loader2 } from "lucide-react";

// ১. পেজগুলোকে lazy লোড করা হলো (সাইট সুপার ফাস্ট করার জন্য)
const Home = lazy(() => import("../pages/Home"));
const ClassSyllabus = lazy(() => import("../pages/ClassSyllabus"));
const LessonReader = lazy(() => import("../pages/LessonReader"));
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
        element: (
          <Suspense fallback={<PageLoader />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "class/:classLevel",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ClassSyllabus />
          </Suspense>
        ),
      },
      {
        path: "lesson/:lessonId",
        element: (
          <Suspense fallback={<PageLoader />}>
            <LessonReader />
          </Suspense>
        ),
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
    ],
  },
]);