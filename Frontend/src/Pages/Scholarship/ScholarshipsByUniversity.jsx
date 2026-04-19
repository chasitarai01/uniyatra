import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "../../api/axios.js";
import { Award, GraduationCap, DollarSign, Calendar, ChevronRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ScholarshipsByUniversity = () => {
  const { id } = useParams();
  const location = useLocation();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await axios.get(`/api/scholarships/university/${id}`);
        const data = Array.isArray(res.data.scholarships)
          ? res.data.scholarships
          : res.data.scholarships ? [res.data.scholarships] : [];
        setScholarships(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchScholarships();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">University Scholarships</h1>
          <p className="text-slate-500 font-medium mt-1">Available financial aid programs for this institution.</p>
        </div>
        <Link
          to={location.pathname.startsWith("/dashboard") ? `/dashboard/university/${id}` : `/uni/${id}`}
          className="flex items-center gap-2 text-indigo-600 font-bold hover:underline"
        >
          <ArrowLeft size={16} /> Back to University
        </Link>
      </div>

      {!scholarships.length ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-100 shadow-sm">
          <Award size={48} className="text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 font-bold">No scholarships currently listed for this university.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {scholarships.map((s, idx) => (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all flex flex-col relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 shadow-inner">
                    <GraduationCap size={28} />
                  </div>

                  <h3 className="text-xl font-black text-slate-800 leading-tight mb-6 group-hover:text-indigo-600 transition-colors">
                    {s.ScholarshipName || s.scholarshipName}
                  </h3>

                  <div className="space-y-4 mb-8 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <DollarSign size={14} className="text-emerald-500" /> Value
                      </div>
                      <span className="text-sm font-black text-slate-800">{s.ScholarshipValue || s.scholarshipValue || "Check Details"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Calendar size={14} className="text-rose-500" /> Deadline
                      </div>
                      <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100">{s.Deadline || "Open"}</span>
                    </div>
                  </div>

                  <Link
                    to={location.pathname.startsWith("/dashboard") ? `/dashboard/scholarship/${s._id}` : `/scholarship/${s._id}`}
                    className="flex items-center justify-between w-full p-4 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-indigo-600 transition-all shadow-lg"
                  >
                    View Details <ChevronRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ScholarshipsByUniversity;
