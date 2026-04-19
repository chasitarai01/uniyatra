import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, GraduationCap, Award, CheckCircle2, XCircle,
  Loader2, Sparkles, ChevronRight, User, AlertTriangle, Star,
  TrendingUp, Globe, BookOpen
} from "lucide-react";
import { API_BASE_URL } from "../../config";

const TIER_CONFIG = {
  Elite:       { color: "amber",  bg: "bg-amber-50",  border: "border-amber-200",  badge: "bg-amber-100 text-amber-700",  icon: "🏆" },
  Excellence:  { color: "violet", bg: "bg-violet-50", border: "border-violet-200", badge: "bg-violet-100 text-violet-700", icon: "⭐" },
  Merit:       { color: "blue",   bg: "bg-blue-50",   border: "border-blue-200",   badge: "bg-blue-100 text-blue-700",   icon: "🎯" },
  Standard:    { color: "emerald",bg: "bg-emerald-50",border: "border-emerald-200",badge: "bg-emerald-100 text-emerald-700",icon: "✅" },
  Entry:       { color: "teal",   bg: "bg-teal-50",   border: "border-teal-200",   badge: "bg-teal-100 text-teal-700",   icon: "🌱" },
};

const MIN_IELTS = 6.0;
const MIN_GRADE = 50;

const EligibilityTest = () => {
  const [ieltsScore, setIeltsScore] = useState("");
  const [gradeScore, setGradeScore] = useState("");
  const [result, setResult]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [user, setUser]             = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    const token = localStorage.getItem("token");
    if (!token) { setError("Session expired. Please login again."); return; }

    try {
      setLoading(true);
      const res = await axios.post(
        `/api/eligibility/test`,
        { ieltsScore: Number(ieltsScore), gradeScore: Number(gradeScore) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Assessment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const ieltsVal    = Number(ieltsScore) || 0;
  const gradeVal    = Number(gradeScore) || 0;
  const ieltsOk     = ieltsVal >= MIN_IELTS;
  const gradeOk     = gradeVal >= MIN_GRADE;
  const ieltsPercent = (ieltsVal / 9) * 100;
  const gradePercent = gradeVal;

  const tier = result?.tier ? TIER_CONFIG[result.tier] : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">
            <Sparkles className="w-3 h-3 animate-pulse" />
            Smart Assessment Engine
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Academic <span className="text-indigo-600">Eligibility</span> Test
          </h1>
          <p className="text-slate-500 font-medium text-sm max-w-lg">
            Enter your IELTS and academic grade to instantly discover which global universities you qualify for.
          </p>
        </div>

        {/* Minimum requirements badge */}
        <div className="flex gap-3 shrink-0">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-sm font-bold ${ieltsOk && ieltsScore ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-500"}`}>
            <span className="text-base">{ieltsOk && ieltsScore ? "✅" : "📝"}</span>
            IELTS min <strong>{MIN_IELTS}</strong>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-sm font-bold ${gradeOk && gradeScore ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-500"}`}>
            <span className="text-base">{gradeOk && gradeScore ? "✅" : "📝"}</span>
            Grade min <strong>{MIN_GRADE}%</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ── LEFT: Input Form ── */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-8"
          >
            {/* User greeting */}
            {user && (
              <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
                  {user.name?.charAt(0) || <User size={16} />}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800">{user.name}</p>
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Student Assessment</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* IELTS Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">IELTS Band Score</label>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-black ${ieltsOk && ieltsScore ? "text-emerald-600" : ieltsScore ? "text-rose-500" : "text-slate-300"}`}>
                      {ieltsScore || "—"}
                    </span>
                    <span className="text-xs text-slate-300 font-bold">/ 9.0</span>
                  </div>
                </div>
                <div className="relative group">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input
                    type="number" step="0.1" min="0" max="9"
                    value={ieltsScore}
                    onChange={e => setIeltsScore(e.target.value)}
                    placeholder={`Min ${MIN_IELTS} required`}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 font-bold text-slate-800 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                    required
                  />
                </div>
                {/* Progress bar */}
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${ieltsPercent}%` }}
                    transition={{ duration: 0.4 }}
                    className={`h-full rounded-full ${ieltsOk ? "bg-emerald-500" : "bg-rose-400"}`}
                  />
                </div>
                {ieltsScore && !ieltsOk && (
                  <p className="text-xs text-rose-500 font-bold flex items-center gap-1">
                    <AlertTriangle size={11} /> Score must be at least {MIN_IELTS}
                  </p>
                )}
              </div>

              {/* Grade Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Aggregate Grade</label>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-black ${gradeOk && gradeScore ? "text-emerald-600" : gradeScore ? "text-rose-500" : "text-slate-300"}`}>
                      {gradeScore || "—"}
                    </span>
                    <span className="text-xs text-slate-300 font-bold">%</span>
                  </div>
                </div>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input
                    type="number" min="0" max="100"
                    value={gradeScore}
                    onChange={e => setGradeScore(e.target.value)}
                    placeholder={`Min ${MIN_GRADE}% required`}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 font-bold text-slate-800 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                    required
                  />
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${gradePercent}%` }}
                    transition={{ duration: 0.4 }}
                    className={`h-full rounded-full ${gradeOk ? "bg-emerald-500" : "bg-rose-400"}`}
                  />
                </div>
                {gradeScore && !gradeOk && (
                  <p className="text-xs text-rose-500 font-bold flex items-center gap-1">
                    <AlertTriangle size={11} /> Grade must be at least {MIN_GRADE}%
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm tracking-tight hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60"
              >
                {loading ? (
                  <><Loader2 className="animate-spin" size={17} /> Analyzing credentials...</>
                ) : (
                  <><Sparkles size={17} /> Run Eligibility Assessment</>
                )}
              </button>
            </form>

            {/* Inline error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold"
              >
                <XCircle size={16} className="shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* ── RIGHT: Results ── */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">

            {/* Empty state */}
            {!result && !loading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center py-24 border-2 border-dashed border-slate-200 rounded-3xl bg-white/60 min-h-[400px]"
              >
                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-300 mb-6">
                  <ShieldCheck size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-700 mb-2">Ready to Assess</h3>
                <p className="text-slate-400 font-medium text-sm max-w-xs">
                  Enter your IELTS score and academic grade on the left to discover your university matches.
                </p>
                <div className="mt-6 flex gap-3 text-xs">
                  <span className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-full font-bold">Min IELTS: {MIN_IELTS}</span>
                  <span className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-full font-bold">Min Grade: {MIN_GRADE}%</span>
                </div>
              </motion.div>
            )}

            {/* Loading */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center text-center py-24 min-h-[400px]"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto text-indigo-600 animate-pulse" size={28} />
                </div>
                <h3 className="text-lg font-black text-slate-700">Analyzing your profile...</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Matching with 500+ global partners</p>
              </motion.div>
            )}

            {/* Ineligible result */}
            {result && !result.eligible && (
              <motion.div
                key="ineligible"
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8">
                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20 shrink-0">
                      <XCircle size={32} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-rose-900 leading-tight">Requirements Not Met</h2>
                      <p className="text-rose-700/80 font-medium mt-1 text-sm">{result.message}</p>
                    </div>
                  </div>

                  {/* Failure reasons */}
                  {result.reasons?.length > 0 && (
                    <div className="mt-6 space-y-3">
                      {result.reasons.map((reason, i) => (
                        <div key={i} className="flex gap-3 p-4 bg-white/70 rounded-2xl border border-rose-100">
                          <AlertTriangle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                          <p className="text-sm font-medium text-rose-800">{reason}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Score comparison */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    {[
                      { label: "Your IELTS", value: result.submittedScores?.ielts, min: result.minRequirements?.ielts, suffix: "" },
                      { label: "Your Grade", value: result.submittedScores?.grade, min: result.minRequirements?.grade, suffix: "%" },
                    ].map(({ label, value, min, suffix }) => {
                      const pass = value >= min;
                      return (
                        <div key={label} className={`p-4 rounded-2xl border ${pass ? "bg-emerald-50 border-emerald-100" : "bg-rose-100/50 border-rose-200"}`}>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{label}</p>
                          <p className={`text-2xl font-black ${pass ? "text-emerald-600" : "text-rose-600"}`}>{value}{suffix}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-1">Min required: {min}{suffix}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Eligible result */}
            {result && result.eligible && (
              <motion.div
                key="eligible"
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                className="space-y-5"
              >
                {/* Status card */}
                <div className={`${tier?.bg || "bg-emerald-50"} ${tier?.border || "border-emerald-100"} border rounded-3xl p-8`}>
                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0 text-3xl">
                      {tier?.icon || "✅"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-2xl font-black text-slate-800">Eligible!</h2>
                        <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${tier?.badge || "bg-emerald-100 text-emerald-700"}`}>
                          {result.tier} Tier
                        </span>
                      </div>
                      <p className="text-slate-600 font-medium mt-1.5 text-sm leading-relaxed">{result.message}</p>
                    </div>
                  </div>

                  {/* Score tiles */}
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="bg-white/70 rounded-2xl p-4 border border-white">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">IELTS</p>
                      <p className="text-2xl font-black text-slate-800">{result.submittedScores?.ielts}</p>
                    </div>
                    <div className="bg-white/70 rounded-2xl p-4 border border-white">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Grade</p>
                      <p className="text-2xl font-black text-slate-800">{result.submittedScores?.grade}%</p>
                    </div>
                    <div className="bg-white/70 rounded-2xl p-4 border border-white">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Matches</p>
                      <p className="text-2xl font-black text-indigo-600">{result.totalMatches}</p>
                    </div>
                  </div>
                </div>

                {/* University recommendations */}
                {result.results?.length > 0 && (
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2.5">
                        <Globe size={20} className="text-indigo-600" />
                        <h3 className="text-base font-black text-slate-800">Recommended Universities</h3>
                      </div>
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
                        {result.rankRange}
                      </span>
                    </div>

                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
                      {result.results.map((uni, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-2xl transition-all group cursor-pointer"
                          onClick={() => uni.internationalStudentLink && window.open(uni.internationalStudentLink, "_blank")}
                        >
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-black text-slate-300 text-sm group-hover:text-indigo-600 group-hover:border-indigo-100 shadow-sm shrink-0 transition-all">
                            {String(i + 1).padStart(2, "0")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-slate-800 text-sm truncate group-hover:text-indigo-700 transition-colors">{uni.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
                              <Award size={9} />
                              {uni.city || uni.country} · World Rank #{uni.qsWorldRank || "N/A"}
                            </p>
                          </div>
                          <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-all group-hover:translate-x-0.5" />
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-50 text-center">
                      <p className="text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
                        <Sparkles size={12} className="text-amber-400" />
                        Showing top {result.results.length} of {result.totalMatches} matches for your profile
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
