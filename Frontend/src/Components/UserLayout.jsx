import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, GraduationCap, Award, Video, FileText, 
  Calculator, Clock, ShieldCheck, CheckSquare, Heart, 
  Bell, MessageSquare, LogOut, Search, User, Menu, X,
  ChevronRight, Sparkles, BookOpen, Settings
} from "lucide-react";

const navSections = [
  {
    title: "General",
    items: [
      { icon: LayoutDashboard, label: "Overview",       path: "/dashboard" },
    ]
  },
  {
    title: "Education",
    items: [
      { icon: GraduationCap,  label: "Universities",   path: "/dashboard/universities" },
      { icon: Award,          label: "Scholarships",   path: "/dashboard/scholarships" },
      { icon: Video,          label: "Live Classes",   path: "/classes", isLive: true },
    ]
  },
  {
    title: "Tools & Planning",
    items: [
      { icon: FileText,       label: "Applications",   path: "/file" },
      { icon: Calculator,     label: "Cost Estimator", path: "/cost-estimator" },
      { icon: Clock,          label: "Reminders",      path: "/reminder" },
    ]
  },
  {
    title: "Assessment",
    items: [
      { icon: ShieldCheck,    label: "Eligibility",    path: "/test" },
      { icon: CheckSquare,    label: "Checklist",      path: "/checklist" },
      { icon: Heart,          label: "Favorites",      path: "/fav" },
    ]
  }
];

const UserLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => navigate("/logout");

  const allItems = navSections.flatMap(s => s.items);
  const activeItem = allItems.find(item => 
    item.path === "/dashboard" 
      ? location.pathname === "/dashboard" 
      : location.pathname.startsWith(item.path)
  ) || { label: "Dashboard" };

  const greeting = () => {
    const h = time.getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* ── SIDEBAR ── */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 272 : 76 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative z-50 flex flex-col h-full overflow-hidden"
        style={{ background: "linear-gradient(180deg, #0f172a 0%, #111827 100%)" }}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at top left, rgba(99,102,241,0.08) 0%, transparent 60%)"
        }} />

        {/* ── Logo / Brand ── */}
        <div className={`relative flex items-center gap-3 px-5 pt-6 pb-4 ${!isSidebarOpen ? "justify-center" : ""}`}>
          <Link to="/home" className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0">
              <GraduationCap size={20} className="text-white" />
            </div>
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="text-white font-black text-base tracking-tight leading-none">UniYatra</p>
                  <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-[0.18em] mt-0.5">Student Portal</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>

          {isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="ml-auto p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Collapse toggle when closed */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="mx-auto mb-2 p-2 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
          >
            <Menu size={18} />
          </button>
        )}

        {/* ── User Profile Card ── */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mx-4 mb-4 overflow-hidden"
            >
              <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/20">
                      {avatarLetter}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-800 shadow-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-black text-sm leading-none truncate">{user?.name || "Student"}</p>
                    <p className="text-slate-400 text-[10px] font-medium mt-1 truncate">{user?.email || "student@uniyatra.com"}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{greeting()}</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-400">
                    <Sparkles size={10} />
                    Active
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed avatar */}
        {!isSidebarOpen && (
          <div className="flex justify-center mb-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-sm">
                {avatarLetter}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#111827]" />
            </div>
          </div>
        )}

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 space-y-6 pb-4" style={{ scrollbarWidth: "none" }}>
          {navSections.map((section) => (
            <div key={section.title}>
              {isSidebarOpen && (
                <div className="flex items-center gap-2 px-3 mb-2">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.22em] whitespace-nowrap">
                    {section.title}
                  </span>
                  <div className="flex-1 h-px bg-slate-800" />
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = item.path === "/dashboard"
                    ? location.pathname === "/dashboard"
                    : location.pathname.startsWith(item.path);

                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      title={!isSidebarOpen ? item.label : undefined}
                      className={`relative flex items-center gap-3 rounded-xl transition-all duration-200 group
                        ${isSidebarOpen ? "px-3 py-2.5" : "justify-center px-0 py-2.5 mx-1"}
                        ${isActive
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                          : "text-slate-400 hover:bg-slate-800/70 hover:text-white"
                        }`}
                    >
                      {/* Active left indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="sidebarActive"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/40 rounded-r-full"
                        />
                      )}

                      <item.icon
                        size={18}
                        className={`shrink-0 transition-all duration-200 ${
                          isActive ? "text-white" : "group-hover:text-indigo-400 group-hover:scale-110"
                        }`}
                      />

                      {isSidebarOpen && (
                        <div className="flex items-center justify-between flex-1 min-w-0">
                          <span className={`text-sm truncate ${isActive ? "font-bold" : "font-semibold"}`}>
                            {item.label}
                          </span>
                          {item.isLive && (
                            <span className="flex items-center gap-1.5 ml-2">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500" />
                              </span>
                              <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Live</span>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Tooltip when collapsed */}
                      {!isSidebarOpen && (
                        <div className="absolute left-14 bg-slate-900 border border-slate-700 text-white text-xs font-bold px-3 py-2 rounded-xl
                          opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50
                          translate-x-[-4px] group-hover:translate-x-0 transition-all duration-200 shadow-xl">
                          {item.label}
                          <div className="absolute left-0 top-1/2 -translate-x-1.5 -translate-y-1/2 w-2 h-2 bg-slate-900 border-l border-b border-slate-700 rotate-45" />
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Bottom: Logout ── */}
        <div className={`p-3 border-t border-slate-800/60 ${!isSidebarOpen ? "flex justify-center" : ""}`}>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all group
              ${isSidebarOpen ? "w-full" : "justify-center"}`}
          >
            <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-rose-500/20 transition-all">
              <LogOut size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            </div>
            {isSidebarOpen && (
              <span className="text-sm font-semibold">Sign Out</span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* ── Topbar ── */}
        <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between z-40 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-base font-black text-slate-800 leading-none">{activeItem.label}</h2>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                {time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden md:flex items-center">
              <Search size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm font-medium w-48 focus:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Notifications */}
            <Link
              to="/notification"
              className="relative p-2 rounded-xl text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white animate-pulse" />
            </Link>

            {/* Support Chat */}
            <Link
              to="/support-chat"
              className="p-2 rounded-xl text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
            >
              <MessageSquare size={18} />
            </Link>

            {/* Divider */}
            <div className="w-px h-8 bg-slate-200 mx-1" />

            {/* User */}
            <div className="flex items-center gap-2.5 pl-1">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-800 leading-none">{user?.name || "Student"}</p>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5 uppercase tracking-wider">Student</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-200 cursor-pointer hover:scale-105 transition-transform">
                {avatarLetter}
              </div>
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}>
          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
