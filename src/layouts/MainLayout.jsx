import { Outlet } from "react-router";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:bg-white focus:text-teal-700 focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
      >
        মূল কনটেন্টে যাও
      </a>
      <Navbar />
      <main
        id="main-content"
        className="flex-grow w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-6"
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
