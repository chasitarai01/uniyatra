import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  GraduationCap,
  ClipboardList,
  FileText,
  Bell,
  MonitorPlay,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Search,
  ChevronRight,
  ShieldCheck,
  Menu,
  X,
  Plus
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",     path: "/admin" },
  { icon: Building2,       label: "Universities",  path: "/admin/universities" },
  { icon: BookOpen,        label: "Courses",       path: "/admin/courses" },
  { icon: GraduationCap,    label: "Scholarships",  path: "/admin/scholarships" },
  { icon: ClipboardList,    label: "Checklists",    path: "/admin/checklists" },
  { icon: FileText,         label: "Documents",     path: "/admin/files" },
  { icon: Bell,             label: "Notifications", path: "/admin/notifications" },
  { icon: MonitorPlay,      label: "Class Rooms",   path: "/admin/rooms" }, 
  { icon: Users,            label: "Users",         path: "/admin/users" },
  { icon: BarChart3,        label: "Analytics",     path: "/admin/analytics" },
  { icon: Settings,         label: "Settings",      path: "/admin/settings" },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => navigate("/logout");

  const getActiveLabel = () => {
    const active = navItems.find(item => 
      item.path === "/admin" ? currentPath === "/admin" : currentPath.startsWith(item.path)
    );
    return active ? active.label : "Management";
  };

  const adminName = "Admin User";
  const adminEmail = "admin@uniyatra.com";

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-900 overflow-hidden">
      
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex w-[280px] flex-col bg-slate-900 text-white shadow-2xl relative z-30">
        
        {/* Logo Section */}
        <div className="p-8">
          <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => navigate("/admin")}>
            <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 transform group-hover:rotate-12 transition-all duration-500">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">UniYatra</h1>
              <p className="text-[10px] font-black tracking-[0.25em] text-indigo-400 uppercase mt-1">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = item.path === "/admin" 
              ? currentPath === "/admin" 
              : currentPath.startsWith(item.path);
              
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                  isActive 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "group-hover:scale-110 transition-transform text-slate-500"}`} />
                <span className="font-bold text-[13px] tracking-wide">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="adminNavIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin Profile Card */}
        <div className="p-6 border-t border-slate-800/50">
          <div className="bg-slate-800/40 rounded-[2rem] p-4 border border-slate-700/30 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-black text-white text-sm border border-white/10 shadow-lg">
                AU
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black truncate">{adminName}</p>
                <p className="text-[10px] font-bold text-slate-500 truncate uppercase tracking-tight">Super Admin</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all font-black text-xs uppercase tracking-widest group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Header */}
        <header className={`h-20 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-20 transition-all duration-300 ${
          scrolled ? "bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm" : "bg-transparent"
        }`}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 bg-white border border-slate-100 rounded-xl text-slate-600 shadow-sm"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-indigo-600 rounded-full hidden sm:block"></div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">{getActiveLabel()}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="relative hidden md:block group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Global admin search..." 
                className="bg-white border border-slate-100 rounded-2xl py-2.5 pl-11 pr-4 text-xs font-bold w-64 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all outline-none shadow-sm"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button className="relative p-3 bg-white border border-slate-100 rounded-2xl text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm group">
                <Bell size={18} className="group-hover:rotate-12 transition-transform" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
              </button>
            </div>

            <div className="h-10 w-[1px] bg-slate-200 hidden sm:block"></div>

            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-[11px] font-black text-slate-800 leading-none">System Active</p>
                <div className="flex items-center justify-end gap-1.5 mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Online</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-12">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </div>

        {/* Floating Action Button (Optional for Admin) */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-10 right-10 w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-slate-900/40 z-40 lg:hidden"
        >
          <Plus size={28} />
        </motion.button>
      </main>

      {/* ── Mobile Side Drawer ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-slate-900 text-white z-[101] lg:hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="text-white w-5 h-5" />
                  </div>
                  <h1 className="text-lg font-black tracking-tight">UniYatra</h1>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-800 rounded-xl text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = item.path === "/admin" 
                    ? currentPath === "/admin" 
                    : currentPath.startsWith(item.path);
                  return (
                    <button
                      key={item.label}
                      onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                        isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-400"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-bold text-sm tracking-wide">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="p-6 border-t border-slate-800">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-rose-400 font-bold"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;
