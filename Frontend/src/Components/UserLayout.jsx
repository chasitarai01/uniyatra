import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, GraduationCap, Award, Video, FileText, 
  Calculator, Clock, ShieldCheck, CheckSquare, Heart, 
  Bell, MessageSquare, LogOut, Search, User, Menu, X
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Overview",       path: "/dashboard" },
  { icon: GraduationCap,  label: "Universities",   path: "/dashboard/universities" },
  { icon: Award,          label: "Scholarships",   path: "/dashboard/scholarships" },
  { icon: Video,          label: "My Classes",     path: "/classes" },
  { icon: FileText,       label: "Applications",   path: "/file" },
  { icon: Calculator,     label: "Cost Estimator", path: "/cost-estimator" },
  { icon: Clock,          label: "Reminders",      path: "/reminder" },
  { icon: ShieldCheck,    label: "Eligibility",    path: "/test" },
  { icon: CheckSquare,    label: "Checklist",      path: "/checklist" },
  { icon: Heart,          label: "Favorites",      path: "/fav" },
];

const UserLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => {
    navigate("/logout");
  };

  const activeItem = navItems.find(item => 
    item.path === "/dashboard" 
      ? location.pathname === "/dashboard" 
      : location.pathname.startsWith(item.path)
  ) || { label: "Dashboard" };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-[#0f172a] text-white flex flex-col relative z-50 shadow-2xl transition-all duration-300 ease-in-out"
      >
        {/* Logo Section */}
        <div className="p-6 flex items-center justify-between overflow-hidden whitespace-nowrap">
          <Link to="/home" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <GraduationCap className="text-white" size={24} />
            </div>
            {isSidebarOpen && (
              <span className="text-xl font-black tracking-tighter text-white">UniYatra</span>
            )}
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors hidden lg:block"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = item.path === "/dashboard" 
              ? location.pathname === "/dashboard" 
              : location.pathname.startsWith(item.path);
              
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                  isActive 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-white" : "group-hover:scale-110 transition-transform"} />
                {isSidebarOpen && (
                  <span className="font-bold text-sm tracking-wide">{item.label}</span>
                )}
                {isActive && isSidebarOpen && (
                  <motion.div layoutId="activeInd" className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                )}
                {!isSidebarOpen && (
                  <div className="absolute left-20 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-white/10 shadow-xl">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-800 overflow-hidden">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all font-bold group ${!isSidebarOpen && "justify-center"}`}
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1.5 bg-indigo-600 rounded-full lg:hidden"></div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight capitalize">{activeItem.label}</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="bg-slate-100 border-none rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium w-64 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            
            <Link to="/notification" className="relative p-2.5 bg-slate-100 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </Link>

            <Link to="/support-chat" className="p-2.5 bg-slate-100 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
              <MessageSquare size={18} />
            </Link>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-800 leading-none">{user?.name || "Student"}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Free Tier</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0) || <User size={20} />}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
