import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUniversity, FaGlobeAmericas, FaCity, FaTrash, FaEdit, 
  FaPlus, FaSearch, FaFilter, FaExternalLinkAlt, FaTimes, FaEye 
} from "react-icons/fa";
import { Link } from "react-router-dom";

const UniversityManagement = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUni, setEditingUni] = useState(null);
  const [formData, setFormData] = useState({
    University: "",
    UniversityCode: "",
    Country: "",
    City: "",
    Website: "",
    QSWorldRank: "",
    "International Students": "",
    Logo: ""
  });

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/universities");
      const data = await response.json();
      setUniversities(data.data || []);
    } catch (err) {
      console.error("Failed to fetch universities", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  const handleOpenModal = (uni = null) => {
    if (uni) {
      setEditingUni(uni);
      setFormData({
        University: uni.University || "",
        UniversityCode: uni.UniversityCode || "",
        Country: uni.Country || "",
        City: uni.City || "",
        Website: uni.Website || "",
        QSWorldRank: uni.QSWorldRank || "",
        "International Students": uni["International Students"] || "",
        Logo: uni.Logo || ""
      });
    } else {
      setEditingUni(null);
      setFormData({
        University: "",
        UniversityCode: "",
        Country: "",
        City: "",
        Website: "",
        QSWorldRank: "",
        "International Students": "",
        Logo: ""
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingUni 
      ? `/api/universities/${editingUni._id}`
      : "/api/universities";
    
    const method = editingUni ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setShowModal(false);
        fetchUniversities();
      }
    } catch (err) {
      console.error("Save error", err);
    }
  };

  const handleDelete = async (code) => {
    if (!window.confirm("Are you sure you want to delete this university?")) return;
    
    try {
      const response = await fetch(`/api/universities/${code}`, {
        method: "DELETE"
      });
      if (response.ok) fetchUniversities();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const filteredUnis = universities.filter(uni => 
    uni.University.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.Country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">University Management</h1>
          <p className="text-slate-500 font-medium">Add, update, or remove partner institutions</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5"
        >
          <FaPlus />
          <span>Register University</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, country or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 border transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all">
          <FaFilter className="text-xs" />
          <span>Filters</span>
        </button>
      </div>

      {/* Table Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-white/40 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">University Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Location</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">QS Rank</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredUnis.map((uni) => (
                  <motion.tr 
                    layout
                    key={uni._id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 p-2 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          {uni.Logo ? (
                            <img 
                              src={uni.Logo} 
                              alt="" 
                              className="w-full h-full object-contain" 
                              onError={(e) => {
                                e.target.src = "https://cdn-icons-png.flaticon.com/512/167/167707.png";
                              }}
                            />
                          ) : (
                            <FaUniversity className="text-slate-300 text-xl" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{uni.University}</p>
                          <p className="text-xs font-semibold text-indigo-500 uppercase tracking-tighter mt-0.5">{uni.UniversityCode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                          <FaGlobeAmericas className="text-indigo-400 text-xs" /> {uni.Country}
                        </div>
                        <div className="text-xs font-medium text-slate-400 ml-4">
                          {uni.City}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-black">
                        #{uni.QSWorldRank || "N/A"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/admin/universities/${uni._id}`}
                          className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        >
                          <FaEye className="text-sm" />
                        </Link>
                        <button 
                          onClick={() => handleOpenModal(uni)}
                          className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                        >
                          <FaEdit className="text-sm" />
                        </button>
                        <button 
                          onClick={() => handleDelete(uni.UniversityCode)}
                          className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredUnis.length === 0 && !loading && (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-slate-300 text-2xl" />
              </div>
              <p className="text-slate-500 font-bold">No universities found</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-xl font-black text-slate-800">
                  {editingUni ? "Edit University" : "New University Registration"}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">University Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.University}
                      onChange={(e) => setFormData({...formData, University: e.target.value})}
                      className="w-full bg-slate-50 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">University Code</label>
                    <input 
                      required
                      type="text" 
                      value={formData.UniversityCode}
                      onChange={(e) => setFormData({...formData, UniversityCode: e.target.value})}
                      className="w-full bg-slate-50 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Country</label>
                    <input 
                      required
                      type="text" 
                      value={formData.Country}
                      onChange={(e) => setFormData({...formData, Country: e.target.value})}
                      className="w-full bg-slate-50 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                    <input 
                      type="text" 
                      value={formData.City}
                      onChange={(e) => setFormData({...formData, City: e.target.value})}
                      className="w-full bg-slate-50 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">QS World Rank</label>
                    <input 
                      type="number" 
                      value={formData.QSWorldRank}
                      onChange={(e) => setFormData({...formData, QSWorldRank: e.target.value})}
                      className="w-full bg-slate-50 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Website URL</label>
                    <input 
                      type="url" 
                      value={formData.Website}
                      onChange={(e) => setFormData({...formData, Website: e.target.value})}
                      className="w-full bg-slate-50 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all border"
                    />
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    {editingUni ? "Update University" : "Create University Profile"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UniversityManagement;
