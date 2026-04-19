import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Award, Building2, Calendar, 
  ChevronRight, Filter, Sparkles, DollarSign,
  Briefcase, GraduationCap
} from "lucide-react";
import { Link } from "react-router-dom";

const UserScholarshipList = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/scholarships");
      const result = await response.json();
      setScholarships(result.data || result || []);
    } catch (err) {
      console.error("Error fetching scholarships", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredScholarships = (Array.isArray(scholarships) ? scholarships : []).filter(s => {
    const searchMatch = s.ScholarshipName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        s.University?.toLowerCase().includes(searchTerm.toLowerCase());
    return searchMatch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Financial Aid & Scholarships</h1>
          <p className="text-slate-500 font-medium mt-1">Unlock funding opportunities for your global education.</p>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-600/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h2 className="text-3xl font-black mb-4 tracking-tight leading-tight">Fund Your Dreams with <br/> Targeted Scholarships.</h2>
            <p className="text-indigo-100 font-medium max-w-lg mb-8 opacity-80">Our platform matches you with the best financial aid programs based on your academic profile and country of interest.</p>
            <button className="px-8 py-3.5 bg-white text-indigo-600 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
              Check Your Eligibility <Sparkles size={16} />
            </button>
          </div>
          <div className="w-48 h-48 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 flex items-center justify-center shadow-inner group">
             <Award size={80} className="text-white group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search programs, benefits or universities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-[1.5rem] py-4 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm">
          <Filter size={18} />
          <span>Advanced Filters</span>
        </button>
      </div>

      {/* Scholarship Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        <AnimatePresence mode="popLayout">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-[2.5rem] h-[350px] animate-pulse border border-slate-100 shadow-sm"></div>
            ))
          ) : filteredScholarships.map((s, idx) => (
            <motion.div 
              key={s._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500 flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-[4rem] -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 shrink-0 shadow-inner">
                  <GraduationCap size={28} />
                </div>

                <div className="mb-6 flex-1">
                  <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors mb-2">{s.ScholarshipName}</h3>
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                    <Building2 size={12} className="text-indigo-400" />
                    {s.University}
                  </div>
                </div>

                <div className="space-y-4 mb-8 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <DollarSign size={14} className="text-emerald-500" /> Reward
                     </div>
                     <span className="text-sm font-black text-slate-800">{s.Benefit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Calendar size={14} className="text-rose-500" /> Deadline
                     </div>
                     <span className="text-xs font-black text-rose-500 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100">{s.Deadline || "Open"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                   <button className="flex-1 py-3.5 bg-indigo-600 text-white rounded-xl font-black text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                      Apply Now
                   </button>
                   <Link 
                     to={`/dashboard/scholarship/${s._id}`}
                     className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center text-slate-600 transition-all"
                   >
                      <ChevronRight size={18} />
                   </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserScholarshipList;
