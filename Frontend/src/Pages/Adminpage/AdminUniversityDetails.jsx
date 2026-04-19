import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUniversity, FaGlobeAmericas, FaCity, FaGraduationCap, 
  FaExternalLinkAlt, FaArrowLeft, FaEdit, FaChartLine, 
  FaUsers, FaAward, FaBuilding
} from "react-icons/fa";

const AdminUniversityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/universities/${id}`);
        const result = await response.json();
        setUniversity(result.data);
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversity();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  if (!university) return (
    <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
      <FaUniversity className="text-slate-200 text-6xl mx-auto mb-6" />
      <h2 className="text-2xl font-black text-slate-800 mb-2">University Not Found</h2>
      <p className="text-slate-500 mb-8 font-medium">The institution you're looking for doesn't exist or was removed.</p>
      <Link to="/admin/universities" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline">
        <FaArrowLeft /> Back to List
      </Link>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors"
        >
          <FaArrowLeft /> Back to Management
        </button>
        <div className="flex gap-3">
           <a 
             href={university.Website} 
             target="_blank" 
             rel="noreferrer"
             className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm"
           >
             <FaExternalLinkAlt size={12} /> Public Site
           </a>
        </div>
      </div>

      {/* Hero Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-slate-900 rounded-[3rem] p-10 overflow-hidden shadow-2xl shadow-indigo-900/20"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 bg-gradient-to-l from-indigo-500 to-transparent"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-40 h-40 rounded-[2.5rem] bg-white border-4 border-white/20 p-6 flex items-center justify-center shadow-2xl shrink-0">
             {university.Logo ? (
               <img 
                 src={university.Logo} 
                 alt="" 
                 className="w-full h-full object-contain" 
                 onError={(e) => {
                   e.target.src = "https://cdn-icons-png.flaticon.com/512/167/167707.png";
                 }}
               />
             ) : (
               <FaUniversity className="text-slate-200 text-6xl" />
             )}
          </div>
          <div className="text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/30">
                Partner Institution
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                Verified Profile
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">{university.University}</h1>
            <div className="flex items-center justify-center md:justify-start gap-6 text-indigo-100/60 font-bold">
              <div className="flex items-center gap-2">
                <FaGlobeAmericas className="text-indigo-400" /> {university.Country}
              </div>
              <div className="flex items-center gap-2">
                <FaCity className="text-indigo-400" /> {university.City}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: FaChartLine, label: "QS World Rank", value: `#${university.QSWorldRank || "N/A"}`, color: "text-blue-600", bg: "bg-blue-50" },
          { icon: FaUsers, label: "Intl. Students", value: university["International Students"] || "N/A", color: "text-purple-600", bg: "bg-purple-50" },
          { icon: FaAward, label: "University Code", value: university.UniversityCode, color: "text-emerald-600", bg: "bg-emerald-50" },
          { icon: FaBuilding, label: "Type", value: university.Type || "Public/Research", color: "text-amber-600", bg: "bg-amber-50" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
              <stat.icon size={20} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-800">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <FaGraduationCap className="text-indigo-600" />
              Academic Overview
            </h3>
            <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed">
              <p>
                {university.Description || "Detailed profile for this institution is currently being synchronized. This section will contain a comprehensive overview of the university's academic achievements, campus culture, and specialized research facilities."}
              </p>
            </div>
          </section>

          <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 mb-6">Internal Metadata</h3>
            <div className="grid grid-cols-2 gap-8">
               <div>
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Record ID</p>
                 <code className="bg-slate-50 px-3 py-1.5 rounded-lg text-indigo-600 font-bold text-xs">{university._id}</code>
               </div>
               <div>
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Last Synchronized</p>
                 <p className="text-sm font-bold text-slate-700">April 18, 2026</p>
               </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-gradient-to-br from-indigo-600 to-purple-700 p-10 rounded-[2.5rem] text-white shadow-xl shadow-indigo-600/20">
            <h3 className="text-lg font-black mb-6">Admin Quick Actions</h3>
            <div className="space-y-4">
               <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border border-white/10">
                 <FaEdit /> Edit Content
               </button>
               <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border border-white/10">
                 <FaExternalLinkAlt /> Manage Links
               </button>
               <button className="w-full py-4 bg-rose-500 hover:bg-rose-600 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-900/20">
                 Archive Institution
               </button>
            </div>
          </section>

          <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <h3 className="text-lg font-black text-slate-800 mb-6 tracking-tight">University Cover</h3>
             <div className="aspect-video rounded-3xl overflow-hidden bg-slate-100 relative group">
                {university.Cover ? (
                  <img 
                    src={university.Cover} 
                    alt="" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">No Cover Uploaded</div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="px-4 py-2 bg-white rounded-xl text-xs font-black text-slate-900 shadow-xl hover:scale-105 transition-transform">Update Cover Image</button>
                </div>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminUniversityDetails;
