import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaGraduationCap, FaTrash, FaEdit, FaPlus, FaSearch, 
  FaFilter, FaTimes, FaLayerGroup, FaDollarSign, FaClock
} from "react-icons/fa";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    CourseName: "",
    UniversityCode: "",
    Country: "",
    Overview: "",
    Faculty: "",
    Level: "Undergraduate",
    Mode: "Full-time",
    StartDate: "",
    Duration: "",
    TuitionFee: "",
    TotalFee: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, unisRes] = await Promise.all([
        fetch("/api/courses"),
        fetch("/api/universities")
      ]);
      const coursesData = await coursesRes.json();
      const unisData = await unisRes.json();
      setCourses(coursesData.data || []);
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

  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        CourseName: course.CourseName || "",
        UniversityCode: course.UniversityCode || "",
        Country: course.Country || "",
        Overview: course.Overview || "",
        Faculty: course.Faculty || "",
        Level: course.Level || "Undergraduate",
        Mode: course.Mode || "Full-time",
        StartDate: course.StartDate || "",
        Duration: course.Duration || "",
        TuitionFee: course.TuitionFee || "",
        TotalFee: course.TotalFee || ""
      });
    } else {
      setEditingCourse(null);
      setFormData({
        CourseName: "",
        UniversityCode: "",
        Country: "",
        Overview: "",
        Faculty: "",
        Level: "Undergraduate",
        Mode: "Full-time",
        StartDate: "",
        Duration: "",
        TuitionFee: "",
        TotalFee: ""
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingCourse 
      ? `/api/courses/${editingCourse._id}`
      : "/api/courses";
    
    const method = editingCourse ? "PUT" : "POST";

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
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "DELETE"
      });
      if (response.ok) fetchData();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const filteredCourses = courses.filter(course => 
    course.CourseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.UniversityCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Course Management</h1>
          <p className="text-slate-500 font-medium">Define educational programs and curriculum</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5"
        >
          <FaPlus />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by course name or university code..."
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
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Course & Faculty</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">University</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Fee</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredCourses.map((course) => (
                  <motion.tr 
                    layout
                    key={course._id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <FaGraduationCap className="text-xl" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{course.CourseName}</p>
                          <p className="text-xs font-semibold text-slate-400 uppercase mt-0.5">{course.Faculty}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 uppercase tracking-tighter">
                        {course.UniversityCode}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-black text-slate-700">{course.TuitionFee}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Tuition</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(course)}
                          className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        >
                          <FaEdit className="text-sm" />
                        </button>
                        <button 
                          onClick={() => handleDelete(course._id)}
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
                  {editingCourse ? "Edit Course" : "Add New Course"}
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
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Course Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.CourseName}
                      onChange={(e) => setFormData({...formData, CourseName: e.target.value})}
                      className="w-full bg-slate-50 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">University</label>
                    <select 
                      required
                      value={formData.UniversityCode}
                      onChange={(e) => setFormData({...formData, UniversityCode: e.target.value})}
                      className="w-full bg-slate-50 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all border"
                    >
                      <option value="">Select University</option>
                      {universities.map(uni => (
                        <option key={uni._id} value={uni.UniversityCode}>{uni.University} ({uni.UniversityCode})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Faculty / Department</label>
                    <input 
                      required
                      type="text" 
                      value={formData.Faculty}
                      onChange={(e) => setFormData({...formData, Faculty: e.target.value})}
                      className="w-full bg-slate-50 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Level</label>
                    <select 
                      value={formData.Level}
                      onChange={(e) => setFormData({...formData, Level: e.target.value})}
                      className="w-full bg-slate-50 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all border"
                    >
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Postgraduate">Postgraduate</option>
                      <option value="Doctoral">Doctoral</option>
                      <option value="Diploma">Diploma</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 4 Years"
                      value={formData.Duration}
                      onChange={(e) => setFormData({...formData, Duration: e.target.value})}
                      className="w-full bg-slate-50 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Sep 2026"
                      value={formData.StartDate}
                      onChange={(e) => setFormData({...formData, StartDate: e.target.value})}
                      className="w-full bg-slate-50 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tuition Fee (Annual)</label>
                    <input 
                      type="text" 
                      value={formData.TuitionFee}
                      onChange={(e) => setFormData({...formData, TuitionFee: e.target.value})}
                      className="w-full bg-slate-50 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Fee (Estimated)</label>
                    <input 
                      type="text" 
                      value={formData.TotalFee}
                      onChange={(e) => setFormData({...formData, TotalFee: e.target.value})}
                      className="w-full bg-slate-50 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all border"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Course Overview</label>
                    <textarea 
                      rows={4}
                      value={formData.Overview}
                      onChange={(e) => setFormData({...formData, Overview: e.target.value})}
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
                    {editingCourse ? "Update Course" : "Create Course"}
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

export default CourseManagement;
