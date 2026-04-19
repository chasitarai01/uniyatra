import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaBuilding, FaGlobeAmericas, FaCity, FaUsers, FaChartLine } from "react-icons/fa";

const UniversityTable = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch("/api/universities");
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch universities");
          setLoading(false);
          return;
        }

        setUniversities(data.data || []); 
        setLoading(false);
      } catch (err) {
        setError("Network error. Please try again.");
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  if (loading) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center items-center h-64">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </motion.div>
  );
  
  if (error) return (
    <div className="bg-rose-50 text-rose-500 p-4 rounded-2xl border border-rose-100 font-medium">
      {error}
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/40 overflow-hidden"
    >
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">University Directory</h2>
          <p className="text-sm font-medium text-slate-500">Manage {universities.length} institutions</p>
        </div>
        <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-indigo-500/30 transition-colors">
          Add University
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Institution</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Location</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Ranking</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Intl. Students</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {universities.map((uni) => (
              <tr key={uni._id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl border border-slate-200 bg-white p-1 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                      {uni.Logo ? (
                        <img src={uni.Logo} alt={uni.University} className="w-full h-full object-contain" />
                      ) : (
                        <FaBuilding className="text-slate-300 text-xl" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{uni.University}</p>
                      <p className="text-xs font-medium text-slate-500 line-clamp-1">{uni.Website || "No website listed"}</p>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                      <FaGlobeAmericas className="text-indigo-400" /> {uni.Country}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <FaCity className="text-slate-400" /> {uni.City}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <FaChartLine className="text-xs" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">
                      {uni.QSWorldRank ? `#${uni.QSWorldRank}` : "N/A"}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-600">
                      {uni["International Students"] || "N/A"}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <a
                    href={uni.InternationalStudentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <FaExternalLinkAlt />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default UniversityTable;