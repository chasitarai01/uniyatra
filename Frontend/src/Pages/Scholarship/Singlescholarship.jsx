import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { 
  Award, Building2, MapPin, GraduationCap, 
  DollarSign, Users, Info, ExternalLink, ArrowLeft 
} from "lucide-react";
import { motion } from "framer-motion";

const SingleScholarship = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/scholarships/${id}`);
        if (res.data.success && res.data.data) {
          setScholarship(res.data.data);
        } else {
          setScholarship(null);
        }
      } catch (err) {
        console.error("Error fetching scholarship:", err);
        setError("Failed to load scholarship details");
      } finally {
        setLoading(false);
      }
    };
    fetchScholarship();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  if (error || !scholarship) return (
    <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
      <Award size={48} className="text-slate-200 mx-auto mb-4" />
      <h2 className="text-xl font-black text-slate-800 mb-2">{error || "Scholarship Not Found"}</h2>
      <button onClick={() => navigate(-1)} className="text-indigo-600 font-bold hover:underline">Go Back</button>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-20"
    >
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all"
      >
        <ArrowLeft size={16} /> Back to Search
      </button>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="bg-slate-900 p-10 text-white relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <Award size={40} />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">{scholarship.ScholarshipName}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-indigo-100/60 font-bold text-sm">
                <span className="flex items-center gap-2"><Building2 size={16} /> {scholarship.University}</span>
                <span className="flex items-center gap-2"><MapPin size={16} /> {scholarship.Country}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <section>
                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                  <Info className="text-indigo-600" /> Description & Criteria
                </h3>
                <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed">
                   {scholarship.Criteria?.split("\\n").map((line, index) => (
                    <p key={index} className="mb-4">{line}</p>
                  ))}
                </div>
              </section>

              <section className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                <h3 className="text-lg font-black text-slate-800 mb-6">How to Apply</h3>
                <p className="text-slate-600 font-medium leading-relaxed mb-6">
                  {scholarship["How to Apply"] || "Contact the university's financial aid office for detailed application instructions."}
                </p>
                {scholarship.Link && (
                  <a 
                    href={scholarship.Link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all"
                  >
                    Official Scholarship Link <ExternalLink size={16} />
                  </a>
                )}
              </section>
            </div>

            <div className="space-y-6">
               {[
                 { label: "Faculty", value: scholarship.Faculty, icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
                 { label: "Level", value: scholarship.Level, icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-50" },
                 { label: "Benefit", value: scholarship.ScholarshipValue, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
                 { label: "Awards", value: scholarship.NoOfAwardsAvailable, icon: Users, color: "text-amber-600", bg: "bg-amber-50" },
               ].map((item, i) => (
                 <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                   <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center shrink-0`}>
                     <item.icon size={20} />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                     <p className="text-sm font-black text-slate-800">{item.value || "Not Specified"}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SingleScholarship;
