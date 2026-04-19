import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaGraduationCap, FaAward, FaBuilding, FaCalendarAlt, 
  FaArrowLeft, FaEdit, FaTrash, FaExternalLinkAlt,
  FaCheckCircle, FaInfoCircle, FaDollarSign
} from "react-icons/fa";

const AdminScholarshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        const response = await fetch(`/api/scholarships/${id}`);
        const result = await response.json();
        setScholarship(result.data || result);
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchScholarship();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  if (!scholarship) return (
    <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
      <FaGraduationCap className="text-slate-200 text-6xl mx-auto mb-6" />
      <h2 className="text-2xl font-black text-slate-800 mb-2">Scholarship Not Found</h2>
      <p className="text-slate-500 mb-8 font-medium">This scholarship record no longer exists or the ID is invalid.</p>
      <Link to="/admin/scholarships" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline">
        <FaArrowLeft /> Back to Management
      </Link>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors"
        >
          <FaArrowLeft /> Back to List
        </button>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-600/20">
             <FaEdit size={12} /> Edit Details
           </button>
        </div>
      </div>

      {/* Main Info Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-bl-[5rem]"></div>
        
        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-24 h-24 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 shadow-inner">
             <FaAward size={40} />
          </div>
          <div className="flex-1">
             <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                  Active Opportunity
                </span>
                <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">
                  Global Access
                </span>
             </div>
             <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 tracking-tight">{scholarship.ScholarshipName}</h1>
             <div className="flex flex-wrap items-center gap-6 text-slate-500 font-bold">
                <div className="flex items-center gap-2">
                  <FaBuilding className="text-indigo-500" /> {scholarship.University}
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-rose-500" /> Deadline: {scholarship.Deadline || "TBA"}
                </div>
                <div className="flex items-center gap-2">
                  <FaDollarSign className="text-emerald-500" /> {scholarship.Benefit || "Full Funding"}
                </div>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <FaInfoCircle className="text-indigo-600" />
              Program Description
            </h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              {scholarship.Description || "Detailed program description is currently pending. This scholarship aims to provide financial support to exceptional international students pursuing their academic goals at partner institutions."}
            </p>
          </section>

          <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <FaCheckCircle className="text-emerald-500" />
              Eligibility Criteria
            </h3>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 font-medium text-slate-700">
              {scholarship.Eligibility || "Standard international student eligibility criteria apply. Applicants must demonstrate academic excellence and financial need."}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <section className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-xl shadow-slate-900/20">
            <h3 className="text-xl font-black mb-8 tracking-tight">Administrative Control</h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-slate-400 font-bold text-sm">Visibility</span>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-black uppercase">Published</span>
               </div>
               <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-slate-400 font-bold text-sm">Applicant Volume</span>
                  <span className="font-black text-indigo-400">High Impact</span>
               </div>
               <div className="pt-4 space-y-3">
                  <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all">
                    Generate Report
                  </button>
                  <button className="w-full py-4 bg-rose-500 hover:bg-rose-600 rounded-2xl font-black text-sm shadow-lg shadow-rose-900/20 transition-all">
                    Remove Opportunity
                  </button>
               </div>
            </div>
          </section>

          <section className="bg-indigo-600 p-10 rounded-[2.5rem] text-white relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full group-hover:scale-110 transition-transform"></div>
             <h3 className="text-lg font-black mb-2">Provider Website</h3>
             <p className="text-indigo-100/70 text-sm font-medium mb-6">Redirect to the official university scholarship portal for verification.</p>
             <button className="flex items-center gap-2 text-white font-black hover:translate-x-1 transition-transform">
                Visit Portal <FaExternalLinkAlt size={12} />
             </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminScholarshipDetails;
