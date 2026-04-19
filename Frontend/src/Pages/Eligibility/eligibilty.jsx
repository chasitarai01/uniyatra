import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, GraduationCap, Award, CheckCircle2, XCircle, Loader2, Sparkles, ChevronRight, User } from "lucide-react";
import { API_BASE_URL } from "../../config";

const EligibilityTest = () => {
  const [ieltsScore, setIeltsScore] = useState("");
  const [gradeScore, setGradeScore] = useState("");
  const [eligibility, setEligibility] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEligibility(null);
    setUniversities([]);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Session expired. Please login again.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/eligibility/test`,
        { ieltsScore: Number(ieltsScore), gradeScore: Number(gradeScore) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEligibility(res.data);

      const uniRes = await axios.get(`${API_BASE_URL}/api/universities`);
      const uniArray = Array.isArray(uniRes.data)
        ? uniRes.data
        : Array.isArray(uniRes.data.universities)
        ? uniRes.data.universities
        : [];
      setUniversities(uniArray.slice(0, 3));
    } catch (err) {
      setError(err.response?.data?.message || "Assessment failed. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  const ieltsPercent = ieltsScore ? (Number(ieltsScore) / 9) * 100 : 0;
  const gradePercent = gradeScore ? Number(gradeScore) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest">
            <Sparkles className="w-3 h-3 animate-pulse" />
            Smart Assessment Engine
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Academic <span className="text-indigo-600">Eligibility</span></h1>
          <p className="text-slate-500 font-medium max-w-lg">Our AI-driven engine analyzes your academic credentials to match you with global institutions and scholarship opportunities.</p>
        </div>

        {user && (
          <div className="flex items-center gap-4 bg-white p-3 pr-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black">
              {user.name?.charAt(0) || <User size={18} />}
            </div>
            <div>
              <p className="text-xs font-black text-slate-800">{user.name}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Input Card */}
        <div className="lg:col-span-5">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm sticky top-10"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                {/* IELTS Input */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">IELTS Proficiency</label>
                    <span className="text-lg font-black text-indigo-600">{ieltsScore || "0.0"} <span className="text-[10px] text-slate-300">/ 9.0</span></span>
                  </div>
                  <div className="relative group">
                    <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="9"
                      value={ieltsScore}
                      onChange={(e) => setIeltsScore(e.target.value)}
                      placeholder="Enter Score"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 font-black text-slate-800 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${ieltsPercent}%` }}
                      className="h-full bg-indigo-600 rounded-full"
                    />
                  </div>
                </div>

                {/* Grade Input */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate Grade (%)</label>
                    <span className="text-lg font-black text-indigo-600">{gradeScore || "0"} <span className="text-[10px] text-slate-300">%</span></span>
                  </div>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={gradeScore}
                      onChange={(e) => setGradeScore(e.target.value)}
                      placeholder="Enter Percentage"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 font-black text-slate-800 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${gradePercent}%` }}
                      className="h-full bg-indigo-600 rounded-full"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black tracking-tight text-sm hover:bg-indigo-600 shadow-xl shadow-slate-900/10 hover:shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Analyzing Credentials...
                    </>
                  ) : (
                    <>
                      Run Smart Assessment
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 text-xs font-bold flex gap-3"
              >
                <XCircle size={16} className="shrink-0" />
                {error}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Right: Results Section */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!eligibility && !loading ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-20 border-2 border-dashed border-slate-200 rounded-[3rem] bg-white/50"
              >
                <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-300 mb-8">
                  <ShieldCheck size={48} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-4">Ready for Analysis</h3>
                <p className="text-slate-500 font-medium max-w-sm">
                  Complete the form to generate your academic compatibility report and recommended institutions.
                </p>
              </motion.div>
            ) : loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-20"
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin"></div>
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600 animate-pulse" size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-800 mt-8">Calculating Potential...</h3>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Checking 500+ Global Partners</p>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                {/* Status Card */}
                {(() => {
                  const msg = (eligibility.message || "").toLowerCase();
                  const isEligible = eligibility.eligible === true || eligibility.status === "eligible" || msg.includes("congratulations");
                  
                  return (
                    <div className={`p-10 rounded-[3rem] border shadow-2xl shadow-indigo-500/5 ${isEligible ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                      <div className="flex items-start gap-8">
                        <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-lg ${isEligible ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                          {isEligible ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
                        </div>
                        <div className="flex-1 space-y-2">
                          <h2 className={`text-4xl font-black tracking-tight ${isEligible ? 'text-emerald-900' : 'text-rose-900'}`}>
                            {isEligible ? 'Verified Eligible' : 'Ineligible Status'}
                          </h2>
                          <p className={`text-lg font-medium leading-relaxed ${isEligible ? 'text-emerald-700/80' : 'text-rose-700/80'}`}>
                            {eligibility.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Recommendations */}
                {universities.length > 0 && (
                  <div className="bg-white rounded-[3rem] border border-slate-200 p-10 space-y-8 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                      <div className="flex items-center gap-3">
                        <GraduationCap className="text-indigo-600" size={24} />
                        <h3 className="text-xl font-black text-slate-800">Top Matches</h3>
                      </div>
                      <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Based on Scores
                      </span>
                    </div>

                    <div className="grid gap-4">
                      {universities.map((uni, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="group p-6 bg-slate-50 hover:bg-white border border-transparent hover:border-indigo-100 rounded-3xl transition-all flex items-center justify-between"
                        >
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-slate-300 border border-slate-100 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all shadow-sm">
                              0{i + 1}
                            </div>
                            <div>
                              <p className="font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{uni.name || uni.UniversityName}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                                <Award size={10} /> {uni.type || "Premier Institution"}
                              </p>
                            </div>
                          </div>
                          <button className="p-3 bg-white text-slate-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                            <ChevronRight size={18} />
                          </button>
                        </motion.div>
                      ))}
                    </div>

                    <div className="pt-4 text-center">
                      <p className="text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
                        <Sparkles size={14} className="text-amber-400" />
                        Explore 50+ more matches in the <span className="text-indigo-600 underline cursor-pointer">University Directory</span>
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default EligibilityTest;
