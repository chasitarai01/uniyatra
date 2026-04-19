import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUniversity, FaUsers, FaGraduationCap, FaSchool,
  FaPlus, FaArrowRight, FaChartLine, FaShieldAlt, FaAward
} from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";

const StatCard = ({ icon: Icon, label, value, color, delay, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    onClick={onClick}
    className={`relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-sm border border-white/40 group ${onClick ? "cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-500" : ""}`}
  >
    <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 group-hover:scale-150 group-hover:opacity-20 transition-all duration-700 ${color}`}></div>
    <div className="flex items-center justify-between mb-6 relative z-10">
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg shadow-black/5 ${color}`}>
        <Icon className="text-white text-2xl" />
      </div>
      {onClick && (
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300">
          <FaArrowRight className="text-slate-400 group-hover:text-white transition-colors" />
        </div>
      )}
    </div>
    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">{label}</p>
    <div className="flex items-baseline gap-2 relative z-10">
      <p className="text-4xl font-black text-slate-800 tracking-tighter">{value}</p>
      <span className="text-emerald-500 text-xs font-bold flex items-center gap-0.5">
        <FaChartLine className="text-[10px]" /> +12%
      </span>
    </div>
  </motion.div>
);

const QuickAction = ({ icon: Icon, label, description, color, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-3xl hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group text-left"
  >
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
      <Icon className="text-white text-xl" />
    </div>
    <div className="flex-1">
      <p className="font-black text-slate-800 tracking-tight">{label}</p>
      <p className="text-xs font-medium text-slate-500 leading-relaxed">{description}</p>
    </div>
    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
      <FaPlus className="text-slate-400 text-xs" />
    </div>
  </button>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    unis: 0,
    courses: 0,
    scholarships: 0,
    users: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [u, c, s] = await Promise.all([
          fetch("/api/universities").then(res => res.json()),
          fetch("/api/courses").then(res => res.json()),
          fetch("/api/scholarships").then(res => res.json())
        ]);
        setStats({
          unis: (u.data || []).length,
          courses: (c.data || []).length,
          scholarships: (s.data || s || []).length,
          users: 3492 
        });
      } catch (err) {
        console.error("Stats error", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
      
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Overview</h1>
          <div className="flex items-center gap-2 text-slate-500 font-medium mt-1">
            <FaShieldAlt className="text-indigo-400" />
            <span>Administrator Control Panel — v2.0.4</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <div className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600">Last Login: 10m ago</div>
          <div className="px-4 py-2 bg-indigo-50 rounded-xl text-xs font-bold text-indigo-600">Session: Active</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FaUniversity}
          label="Universities"
          value={stats.unis}
          color="bg-indigo-600"
          delay={0.1}
          onClick={() => navigate("/admin/universities")}
        />
        <StatCard
          icon={FaGraduationCap}
          label="Total Courses"
          value={stats.courses}
          color="bg-purple-600"
          delay={0.2}
          onClick={() => navigate("/admin/courses")}
        />
        <StatCard
          icon={FaAward}
          label="Scholarships"
          value={stats.scholarships}
          color="bg-amber-500"
          delay={0.3}
          onClick={() => navigate("/admin/scholarships")}
        />
        <StatCard
          icon={FaUsers}
          label="Registered Users"
          value={stats.users.toLocaleString()}
          color="bg-emerald-600"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-10">
          <section>
            <h2 className="text-lg font-black text-slate-800 tracking-tight mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuickAction 
                icon={FaUniversity} 
                label="New University" 
                description="Register a new educational partner"
                color="bg-indigo-500"
                onClick={() => navigate("/admin/universities")}
              />
              <QuickAction 
                icon={FaGraduationCap} 
                label="New Course" 
                description="Create a curriculum or program"
                color="bg-purple-500"
                onClick={() => navigate("/admin/courses")}
              />
              <QuickAction 
                icon={FaAward} 
                label="Post Scholarship" 
                description="Announce a new financial aid"
                color="bg-amber-500"
                onClick={() => navigate("/admin/scholarships")}
              />
              <QuickAction 
                icon={IoIosNotifications} 
                label="Broadcast" 
                description="Send system-wide notification"
                color="bg-rose-500"
                onClick={() => navigate("/admin/notifications")}
              />
            </div>
          </section>

          <section className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-sm border border-white/40 p-10">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Recent Activity</h2>
              <button className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-black text-slate-600 transition-colors">Audit Logs</button>
            </div>
            
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:h-full before:w-0.5 before:bg-slate-100">
              {[
                { icon: FaUniversity, color: "bg-indigo-500", text: "Stanford University added to directory", sub: "Managed by System Admin • 5 mins ago" },
                { icon: FaUsers, color: "bg-emerald-500", text: "Batch 2026 student registrations synced", sub: "128 records imported • 1 hour ago" },
                { icon: FaSchool, color: "bg-rose-500", text: "New virtual classroom created", sub: "Global Economics 101 • 3 hours ago" },
                { icon: FaGraduationCap, color: "bg-purple-500", text: "Course curriculum updated", sub: "BSc Computer Science • 5 hours ago" },
              ].map((item, i) => (
                <div key={i} className="relative flex items-start gap-8 group">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${item.color} text-white shadow-lg shadow-black/5 shrink-0 z-10 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm font-bold text-slate-800">{item.text}</p>
                    <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-tighter">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-10">
          <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full"></div>
            <h2 className="text-lg font-black tracking-tight mb-2 relative z-10">Traffic Overview</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8 relative z-10">Platform Analytics</p>
            
            <div className="space-y-6 relative z-10">
              {[
                { label: "Public Unis", value: "72%", color: "bg-indigo-500" },
                { label: "Private Unis", value: "48%", color: "bg-purple-500" },
                { label: "International", value: "85%", color: "bg-emerald-500" },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span>{item.label}</span>
                    <span className="text-white">{item.value}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: item.value }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/10 relative z-10">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Pro Insight</p>
              <p className="text-xs font-medium text-slate-300 leading-relaxed">System performance is at optimal levels. Resource allocation is balanced across all nodes.</p>
            </div>
          </section>

          <section className="bg-indigo-600 rounded-[2.5rem] p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <IoIosNotifications className="text-2xl" />
            </div>
            <h3 className="font-black text-lg mb-2">Need Assistance?</h3>
            <p className="text-indigo-100 text-xs font-medium mb-6 px-4">Our technical support team is available 24/7 for system maintenance.</p>
            <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm shadow-xl shadow-black/10 hover:bg-indigo-50 transition-colors">
              Contact DevOps
            </button>
          </section>
        </div>
      </div>
    </motion.div>
  );
}