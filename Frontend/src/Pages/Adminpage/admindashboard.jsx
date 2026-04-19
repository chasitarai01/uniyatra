import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  GraduationCap,
  MonitorPlay,
  Plus,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Award,
  Bell,
  Activity,
  Zap,
  BookOpen
} from "lucide-react";
import { API_BASE_URL } from "../../config";

const StatCard = ({ icon: Icon, label, value, color, delay, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    onClick={onClick}
    className={`relative overflow-hidden bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 group ${onClick ? "cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-500" : ""}`}
  >
    <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-[0.03] group-hover:scale-150 group-hover:opacity-[0.08] transition-all duration-700 ${color}`}></div>
    <div className="flex items-center justify-between mb-6 relative z-10">
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg shadow-black/5 ${color} text-white`}>
        <Icon size={24} />
      </div>
      {onClick && (
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300">
          <ArrowRight className="text-slate-400 group-hover:text-white transition-colors w-4 h-4" />
        </div>
      )}
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1 relative z-10">{label}</p>
    <div className="flex items-baseline gap-2 relative z-10">
      <p className="text-4xl font-black text-slate-800 tracking-tighter">{value}</p>
      <span className="text-emerald-500 text-[10px] font-black flex items-center gap-0.5">
        <TrendingUp size={10} /> +12.5%
      </span>
    </div>
  </motion.div>
);

const QuickAction = ({ icon: Icon, label, description, color, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group text-left"
  >
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform text-white`}>
      <Icon size={22} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-black text-slate-800 tracking-tight leading-tight mb-1 truncate">{label}</p>
      <p className="text-[11px] font-medium text-slate-500 leading-relaxed line-clamp-1">{description}</p>
    </div>
    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
      <Plus className="text-slate-400 w-4 h-4" />
    </div>
  </button>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    unis: 0,
    courses: 0,
    scholarships: 0,
    users: 3492
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [u, c, s] = await Promise.all([
          fetch(`${API_BASE_URL}/api/universities`).then(res => res.json()),
          fetch(`${API_BASE_URL}/api/courses`).then(res => res.json()),
          fetch(`${API_BASE_URL}/api/scholarships`).then(res => res.json())
        ]);
        setStats({
          unis: (u.data || []).length,
          courses: (c.data || []).length,
          scholarships: (Array.isArray(s) ? s.length : (s.data || []).length),
          users: 3492 
        });
      } catch (err) {
        console.error("Stats error", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System <span className="text-indigo-600">Overview.</span></h1>
          <div className="flex items-center gap-2 text-slate-500 font-bold text-xs mt-2 uppercase tracking-widest">
            <ShieldCheck className="text-indigo-500 w-4 h-4" />
            <span>Administrator Control Panel &nbsp;•&nbsp; v2.0.4</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <Activity className="text-emerald-500 w-4 h-4" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Server Healthy</span>
          </div>
          <button className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg shadow-slate-900/20 hover:scale-105 transition-all">
            <Zap size={18} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Building2}
          label="Universities"
          value={stats.unis}
          color="bg-indigo-600"
          delay={0.1}
          onClick={() => navigate("/admin/universities")}
        />
        <StatCard
          icon={BookOpen}
          label="Total Courses"
          value={stats.courses}
          color="bg-purple-600"
          delay={0.2}
          onClick={() => navigate("/admin/courses")}
        />
        <StatCard
          icon={Award}
          label="Scholarships"
          value={stats.scholarships}
          color="bg-amber-500"
          delay={0.3}
          onClick={() => navigate("/admin/scholarships")}
        />
        <StatCard
          icon={Users}
          label="Registered Users"
          value={stats.users.toLocaleString()}
          color="bg-slate-900"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Left Column: Quick Actions & Activity */}
        <div className="xl:col-span-2 space-y-10">
          <section>
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Management Suite</h2>
              <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View All Tools</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuickAction 
                icon={Building2} 
                label="New University" 
                description="Register a new educational partner"
                color="bg-indigo-500"
                onClick={() => navigate("/admin/universities")}
              />
              <QuickAction 
                icon={BookOpen} 
                label="New Course" 
                description="Create a curriculum or program"
                color="bg-purple-500"
                onClick={() => navigate("/admin/courses")}
              />
              <QuickAction 
                icon={Award} 
                label="Post Scholarship" 
                description="Announce a new financial aid"
                color="bg-amber-500"
                onClick={() => navigate("/admin/scholarships")}
              />
              <QuickAction 
                icon={Bell} 
                label="Broadcast" 
                description="Send system-wide notification"
                color="bg-rose-500"
                onClick={() => navigate("/admin/notifications")}
              />
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10 overflow-hidden relative">
            <div className="flex justify-between items-center mb-10 relative z-10">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Recent Activity</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Updates</span>
              </div>
            </div>
            
            <div className="space-y-10 relative z-10 before:absolute before:inset-0 before:ml-6 before:h-full before:w-px before:bg-slate-100">
              {[
                { icon: Building2, color: "bg-indigo-500", text: "Stanford University added to directory", sub: "Managed by System Admin • 5 mins ago" },
                { icon: Users, color: "bg-emerald-500", text: "Batch 2026 student registrations synced", sub: "128 records imported • 1 hour ago" },
                { icon: MonitorPlay, color: "bg-rose-500", text: "New virtual classroom created", sub: "Global Economics 101 • 3 hours ago" },
                { icon: BookOpen, color: "bg-purple-500", text: "Course curriculum updated", sub: "BSc Computer Science • 5 hours ago" },
              ].map((item, i) => (
                <div key={i} className="relative flex items-start gap-8 group">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${item.color} text-white shadow-lg shadow-black/5 shrink-0 z-10 group-hover:scale-110 transition-transform`}>
                    <item.icon size={20} />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{item.text}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Analytics & Maintenance */}
        <div className="space-y-10">
          <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full"></div>
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <Activity className="text-indigo-400 w-5 h-5" />
              <h2 className="text-lg font-black tracking-tight">Platform Load</h2>
            </div>
            
            <div className="space-y-8 relative z-10">
              {[
                { label: "Public Unis", value: "72%", color: "bg-indigo-500" },
                { label: "Private Unis", value: "48%", color: "bg-purple-500" },
                { label: "International", value: "85%", color: "bg-emerald-500" },
              ].map((item) => (
                <div key={item.label} className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span>{item.label}</span>
                    <span className="text-white">{item.value}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: item.value }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/10 relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={12} className="text-amber-400" />
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Technical Insight</p>
              </div>
              <p className="text-xs font-medium text-slate-400 leading-relaxed">System performance is at optimal levels. 12 background workers active.</p>
            </div>
          </section>

          <section className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white text-center shadow-xl shadow-indigo-500/20">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={28} />
            </div>
            <h3 className="font-black text-xl mb-3 tracking-tight">DevOps Support</h3>
            <p className="text-indigo-100 text-[11px] font-medium mb-8 leading-relaxed px-2">Having technical issues with the database or server clusters? Connect with DevOps.</p>
            <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-all">
              Open Support Ticket
            </button>
          </section>
        </div>
      </div>
    </motion.div>
  );
}