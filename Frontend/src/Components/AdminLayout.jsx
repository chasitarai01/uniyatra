import React from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUniversity, FaUsers, FaHeart, FaClipboardList,
  FaGraduationCap, FaChartBar, FaCog, FaSignOutAlt,
  FaBell, FaSearch, FaLayerGroup, FaSchool
} from "react-icons/fa";
import { MdDashboard, MdSchool, MdPeopleAlt } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";

const navItems = [
  { icon: MdDashboard,        label: "Dashboard",     path: "/admin" },
  { icon: FaUniversity,       label: "Universities",  path: "/admin/universities" },
  { icon: MdSchool,           label: "Courses",       path: "/admin/courses" },
  { icon: FaGraduationCap,    label: "Scholarships",  path: "/admin/scholarships" },
  { icon: FaClipboardList,    label: "Checklists",    path: "/admin/checklists" },
  { icon: IoIosNotifications, label: "Notifications", path: "/admin/notifications" },
  { icon: FaSchool,           label: "Class Rooms",   path: "/admin/rooms" }, 
  { icon: MdPeopleAlt,        label: "Users",         path: "/admin/users" },
  { icon: FaChartBar,         label: "Analytics",     path: "/admin/analytics" },
  { icon: FaCog,              label: "Settings",      path: "/admin/settings" },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const handleLogout = () => {
    navigate("/logout");
  };

  let activeLabel = "Dashboard"; 
  for (const item of navItems) {
    if (item.path === "/admin") {
      if (currentPath === "/admin") activeLabel = item.label;
    } else if (item.path && currentPath.startsWith(item.path)) {
      activeLabel = item.label;
    }
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col relative z-20 shadow-2xl">
        <div className="p-8 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/40 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <FaLayerGroup className="text-2xl text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-white">UniYatra</span>
            <span className="text-[10px] font-black tracking-[0.2em] text-indigo-400 uppercase leading-none">Management</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = item.path === "/admin" 
              ? currentPath === "/admin" 
              : currentPath.startsWith(item.path);
              
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon className={`text-xl ${isActive ? "text-white" : "group-hover:scale-110 transition-transform"}`} />
                <span className="font-bold text-sm tracking-wide">{item.label}</span>
                {isActive && (
                  <motion.div layoutId="activeInd" className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all font-bold group"
          >
            <FaSignOutAlt className="text-xl group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Topbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1.5 bg-indigo-600 rounded-full"></div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">{activeLabel}</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search analytics..." 
                className="bg-slate-100 border-none rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium w-64 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            <button className="relative p-2.5 bg-slate-100 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
              <FaBell />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-800 leading-none">Admin User</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-white shadow-md"></div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
