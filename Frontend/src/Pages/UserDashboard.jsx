import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../api/axios.js';
import { 
  GraduationCap, Award, Video, FileText, 
  ArrowRight, Sparkles, TrendingUp, Target, 
  Calendar, CheckCircle2, BookOpen, DollarSign, ChevronRight
} from 'lucide-react';

const Widget = ({ title, value, icon: Icon, color, delay, path }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-white rounded-[2rem] shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-300"
  >
    <Link to={path} className="p-6 block h-full">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon size={22} />
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100" />
          ))}
        </div>
      </div>
      <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-black text-slate-800 tracking-tight">{value}</p>
        <span className="text-emerald-500 text-xs font-bold flex items-center gap-0.5">
          <TrendingUp size={10} /> +5%
        </span>
      </div>
    </Link>
  </motion.div>
);

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState('');
  const [scholarships, setScholarships] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Fetch sidebar data
    const fetchSidebarData = async () => {
      try {
        const [scholarRes, courseRes] = await Promise.all([
          axios.get('/api/scholarships'),
          axios.get('/api/courses')
        ]);
        
        const fetchedScholarships = scholarRes.data.scholarships || Array.isArray(scholarRes.data) ? scholarRes.data : [];
        const fetchedCourses = courseRes.data.data || [];
        
        setScholarships(fetchedScholarships.slice(0, 3)); // Top 3
        setCourses(fetchedCourses.slice(0, 2)); // Top 2
      } catch (err) {
        console.error("Error fetching dashboard sidebar data:", err);
      }
    };
    
    fetchSidebarData();
  }, []);

  return (
    <div className="space-y-10 pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {greeting}, <span className="text-indigo-600">{user?.name?.split(' ')[0] || "Student"}</span> 👋
          </h1>
          <p className="text-slate-500 font-medium mt-1">Here's what's happening with your education journey today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-5 py-2.5 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-600 text-sm font-bold flex items-center gap-2">
            <Sparkles size={16} />
            <span>AI Assistant Ready</span>
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all">
            <Calendar size={18} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Widget title="Applied Unis" value="04" icon={GraduationCap} color="bg-indigo-600" delay={0.1} path="/dashboard/universities" />
        <Widget title="Scholarships" value="12" icon={Award} color="bg-purple-600" delay={0.2} path="/dashboard/scholarships" />
        <Widget title="Active Classes" value="02" icon={Video} color="bg-rose-500" delay={0.3} path="/classes" />
        <Widget title="Documents" value="08" icon={FileText} color="bg-blue-500" delay={0.4} path="/file" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Journey Section */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-[#0f172a] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-indigo-200 text-xs font-black uppercase tracking-widest mb-6">
                  <Target size={14} /> Next Milestone
                </span>
                <h2 className="text-3xl font-black mb-4 leading-tight">Complete your <br /> Eligibility Test</h2>
                <p className="text-slate-400 font-medium mb-8 leading-relaxed">
                  Unlock personalized university recommendations based on your unique academic background and preferences.
                </p>
                <Link to="/test" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-all">
                  Start Test Now <ArrowRight size={18} />
                </Link>
              </div>
              <div className="w-full md:w-64 aspect-square bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[3rem] p-8 relative">
                <div className="absolute inset-4 border-2 border-white/20 rounded-[2.2rem]"></div>
                <div className="h-full flex flex-col justify-center items-center text-center">
                  <p className="text-6xl font-black mb-2 italic">75%</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Profile Strength</p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Shortcuts */}
          <section>
            <h2 className="text-xl font-black text-slate-800 tracking-tight mb-6 px-2">Quick Access</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: "Universities", path: "/dashboard/universities", color: "hover:bg-indigo-50 text-indigo-600" },
                { label: "Scholarships", path: "/dashboard/scholarships", color: "hover:bg-purple-50 text-purple-600" },
                { label: "Estimator", path: "/cost-estimator", color: "hover:bg-emerald-50 text-emerald-600" },
                { label: "Checklist", path: "/checklist", color: "hover:bg-orange-50 text-orange-600" },
                { label: "Favorites", path: "/fav", color: "hover:bg-pink-50 text-pink-600" },
                { label: "Documents", path: "/file", color: "hover:bg-blue-50 text-blue-600" },
              ].map((item) => (
                <Link 
                  key={item.label}
                  to={item.path}
                  className={`bg-white border border-slate-100 p-4 rounded-2xl text-center transition-all hover:border-transparent hover:shadow-xl ${item.color}`}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          
          {/* Recommended Courses Widget */}
          {courses.length > 0 && (
            <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[40px] rounded-full"></div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Recommended</h3>
                <Link to="/courses" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All</Link>
              </div>
              <div className="space-y-4">
                {courses.map((course) => (
                  <Link to={`/courses/${course.UniversityCode}`} key={course._id} className="block group">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:border-blue-200 group-hover:bg-blue-50/50 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <BookOpen size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                            {course.CourseName}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate">
                            {course.Faculty}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Latest Scholarships Widget */}
          {scholarships.length > 0 && (
            <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[40px] rounded-full"></div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Financial Aid</h3>
                <Link to="/dashboard/scholarships" className="text-[10px] font-black text-purple-600 uppercase tracking-widest hover:underline">Explore</Link>
              </div>
              <div className="space-y-4">
                {scholarships.map((s) => (
                  <Link to={`/dashboard/scholarship/${s._id}`} key={s._id} className="block group">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 group-hover:border-purple-300 group-hover:shadow-md transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 text-[9px] font-black uppercase tracking-widest rounded mb-2">
                            {s.level || s.Level || "All"}
                          </span>
                          <p className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-purple-700 transition-colors">
                            {s.scholarshipName || s.ScholarshipName}
                          </p>
                          <div className="flex items-center gap-1.5 mt-2 text-slate-500 font-semibold text-xs">
                            <DollarSign size={12} className="text-emerald-500" />
                            <span className="truncate">{s.scholarshipValue || s.ScholarshipValue}</span>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:bg-purple-600 group-hover:text-white transition-all shrink-0 shadow-sm border border-slate-100">
                          <ChevronRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Progress Tracker */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 tracking-tight mb-6">Upcoming Tasks</h3>
            <div className="space-y-6">
              {[
                { title: "Upload IELTS Result", date: "Tomorrow, 10:00 AM", status: "Urgent" },
                { title: "Review Scholarship", date: "Apr 20, 2026", status: "New" },
                { title: "Live Q&A Session", date: "Apr 22, 2026", status: "Reminder" },
              ].map((task, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 text-slate-300 group-hover:text-indigo-500 transition-colors">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{task.date}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">{task.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Promotion Card */}
          <section className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[2.5rem] p-8 text-white text-center shadow-xl shadow-indigo-500/20">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-black mb-2 tracking-tight">Need Support?</h3>
            <p className="text-indigo-100 text-xs font-medium mb-8 leading-relaxed">Our education consultants are available for a 1-on-1 discovery call.</p>
            <Link to="/support-chat" className="block w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-sm hover:scale-105 transition-transform shadow-lg">
              Chat with Expert
            </Link>
          </section>

        </div>
      </div>
    </div>
  );
}