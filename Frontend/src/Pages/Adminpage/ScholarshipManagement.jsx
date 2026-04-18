import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaGraduationCap, FaTrash, FaEdit, FaPlus, FaSearch, 
  FaFilter, FaTimes, FaCalendarAlt, FaAward, FaBuilding, FaEye 
} from "react-icons/fa";
import { Link } from "react-router-dom";

const ScholarshipManagement = () => {
  const [scholarships, setScholarships] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState(null);
  const [formData, setFormData] = useState({
    ScholarshipName: "",
    University: "",
    Description: "",
    Eligibility: "",
    Benefit: "",
    Deadline: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [scholarRes, unisRes] = await Promise.all([
        fetch("http://localhost:5001/api/scholarships"),
        fetch("http://localhost:5001/api/universities")
      ]);
      const scholarData = await scholarRes.json();
      const unisData = await unisRes.json();
      setScholarships(scholarData.data || scholarData || []); // Handle different API response formats
      setUniversities(unisData.data || []);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (scholarship = null) => {
    if (scholarship) {
      setEditingScholarship(scholarship);
      setFormData({
        ScholarshipName: scholarship.ScholarshipName || "",
        University: scholarship.University || "",
        Description: scholarship.Description || "",
        Eligibility: scholarship.Eligibility || "",
        Benefit: scholarship.Benefit || "",
        Deadline: scholarship.Deadline || ""
      });
    } else {
      setEditingScholarship(null);
      setFormData({
        ScholarshipName: "",
        University: "",
        Description: "",
        Eligibility: "",
        Benefit: "",
        Deadline: ""
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingScholarship 
      ? `http://localhost:5001/api/scholarships/${editingScholarship._id}`
      : "http://localhost:5001/api/scholarships";
    
    const method = editingScholarship ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setShowModal(false);
        fetchData();
      }
    } catch (err) {
      console.error("Save error", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scholarship?")) return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/scholarships/${id}`, {
        method: "DELETE"
      });
      if (response.ok) fetchData();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const filteredScholarships = Array.isArray(scholarships) ? scholarships.filter(s => 
    s.ScholarshipName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.University.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Scholarship Management</h1>
          <p className="text-slate-500 font-medium">Manage financial aid and funding opportunities</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5"
        >
          <FaPlus />
          <span>Grant Scholarship</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by scholarship name or university..."
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
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Scholarship & Reward</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Provider</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Deadline</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredScholarships.map((s) => (
                  <motion.tr 
                    layout
                    key={s._id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                          <FaAward className="text-xl" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{s.ScholarshipName}</p>
                          <p className="text-xs font-semibold text-purple-500 mt-0.5">{s.Benefit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                        <FaBuilding className="text-slate-300" />
                        {s.University}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg">
                        <FaCalendarAlt className="text-[10px]" />
                        {s.Deadline || "No Date"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/admin/scholarships/${s._id}`}
                          className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        >
                          <FaEye className="text-sm" />
                        </Link>
                        <button 
                          onClick={() => handleOpenModal(s)}
                          className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                        >
                          <FaEdit className="text-sm" />
                        </button>
                        <button 
                          onClick={() => handleDelete(s._id)}
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
              className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-xl font-black text-slate-800">
                  {editingScholarship ? "Edit Scholarship" : "Add New Scholarship"}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Scholarship Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.ScholarshipName}
                      onChange={(e) => setFormData({...formData, ScholarshipName: e.target.value})}
                      className="w-full bg-slate-50 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">University / Provider</label>
                    <select 
                      required
                      value={formData.University}
                      onChange={(e) => setFormData({...formData, University: e.target.value})}
                      className="w-full bg-slate-50 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all border"
                    >
                      <option value="">Select University</option>
                      {universities.map(uni => (
                        <option key={uni._id} value={uni.UniversityCode}>{uni.University} ({uni.UniversityCode})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Benefit Amount/Type</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. $10,000 or Full Tuition"
                      value={formData.Benefit}
                      onChange={(e) => setFormData({...formData, Benefit: e.target.value})}
                      className="w-full bg-slate-50 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deadline</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 2026-12-31"
                      value={formData.Deadline}
                      onChange={(e) => setFormData({...formData, Deadline: e.target.value})}
                      className="w-full bg-slate-50 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all border"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Eligibility Criteria</label>
                    <textarea 
                      rows={3}
                      value={formData.Eligibility}
                      onChange={(e) => setFormData({...formData, Eligibility: e.target.value})}
                      className="w-full bg-slate-50 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all border"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                    <textarea 
                      rows={4}
                      value={formData.Description}
                      onChange={(e) => setFormData({...formData, Description: e.target.value})}
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
                    {editingScholarship ? "Update Scholarship" : "Publish Scholarship"}
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

export default ScholarshipManagement;
