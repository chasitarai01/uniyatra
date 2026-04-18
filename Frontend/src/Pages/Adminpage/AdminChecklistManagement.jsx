import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardList, Plus, Trash2, Edit2, CheckCircle2, 
  Search, Filter, Save, X, GripVertical, MoreVertical,
  PlusCircle, FileText, ShieldCheck
} from "lucide-react";

const AdminChecklistManagement = () => {
  const [checklists, setChecklists] = useState([
    { 
      _id: "1", 
      title: "Master's Application Essentials", 
      category: "Admission", 
      items: [
        { id: "1-1", task: "Certified Academic Transcripts", required: true },
        { id: "1-2", task: "Statement of Purpose (SOP)", required: true },
        { id: "1-3", task: "Letters of Recommendation (2)", required: true }
      ],
      updatedAt: "2026-03-10"
    },
    { 
      _id: "2", 
      title: "Student Visa Requirements (Australia)", 
      category: "Visa", 
      items: [
        { id: "2-1", task: "Passport-sized Photographs", required: true },
        { id: "2-2", task: "Proof of Financial Funds", required: true },
        { id: "2-3", task: "Health Insurance (OSHC)", required: true }
      ],
      updatedAt: "2026-04-01"
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenModal = (checklist = null) => {
    if (checklist) {
      setEditingChecklist({ ...checklist });
    } else {
      setEditingChecklist({
        title: "",
        category: "General",
        items: [{ id: Date.now().toString(), task: "", required: true }]
      });
    }
    setIsModalOpen(true);
  };

  const handleAddItem = () => {
    setEditingChecklist({
      ...editingChecklist,
      items: [...editingChecklist.items, { id: Date.now().toString(), task: "", required: true }]
    });
  };

  const handleRemoveItem = (id) => {
    setEditingChecklist({
      ...editingChecklist,
      items: editingChecklist.items.filter(item => item.id !== id)
    });
  };

  const handleItemChange = (id, value) => {
    setEditingChecklist({
      ...editingChecklist,
      items: editingChecklist.items.map(item => item.id === id ? { ...item, task: value } : item)
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Checklist Management</h1>
          <p className="text-slate-500 font-medium mt-1">Design and manage mandatory document checklists for students.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
        >
          <PlusCircle size={18} />
          <span>Create Checklist</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search checklists by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-[1.5rem] py-4 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm">
             <Filter size={18} />
             <span>Categories</span>
           </button>
        </div>
      </div>

      {/* Checklist Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatePresence>
          {checklists.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())).map((checklist, idx) => (
            <motion.div 
              key={checklist._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                      <ClipboardList size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800 leading-tight">{checklist.title}</h3>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">
                         {checklist.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button 
                       onClick={() => handleOpenModal(checklist)}
                       className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                     >
                       <Edit2 size={16} />
                     </button>
                     <button className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                       <Trash2 size={16} />
                     </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {checklist.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-50 group/item hover:border-indigo-100 transition-colors">
                      <CheckCircle2 size={16} className={item.required ? "text-indigo-400" : "text-slate-300"} />
                      <span className="text-sm font-bold text-slate-700">{item.task}</span>
                      {item.required && (
                        <span className="ml-auto text-[8px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">Mandatory</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Updated: {checklist.updatedAt}</p>
                   <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">AJ</div>
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-600">SY</div>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                <h2 className="text-xl font-black text-slate-800">
                  {editingChecklist?._id ? "Edit Checklist Blueprint" : "Create New Checklist"}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Checklist Title</label>
                    <input 
                      type="text" 
                      value={editingChecklist.title}
                      onChange={(e) => setEditingChecklist({...editingChecklist, title: e.target.value})}
                      placeholder="e.g. Visa Master Doc List"
                      className="w-full bg-slate-50 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                    <select 
                      value={editingChecklist.category}
                      onChange={(e) => setEditingChecklist({...editingChecklist, category: e.target.value})}
                      className="w-full bg-slate-50 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all border appearance-none cursor-pointer"
                    >
                      <option>General</option>
                      <option>Admission</option>
                      <option>Visa</option>
                      <option>Accommodation</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                       <FileText size={16} className="text-indigo-500" /> Checklist Items
                    </h3>
                    <button 
                      onClick={handleAddItem}
                      className="text-xs font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
                    >
                      <Plus size={14} /> Add Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {editingChecklist.items.map((item, index) => (
                      <div key={item.id} className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0 border border-slate-100">
                           {index + 1}
                         </div>
                         <input 
                           type="text" 
                           value={item.task}
                           onChange={(e) => handleItemChange(item.id, e.target.value)}
                           placeholder="Enter task description..."
                           className="flex-1 bg-slate-50 border-transparent rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all border"
                         />
                         <button 
                           onClick={() => handleRemoveItem(item.id)}
                           className="p-3 text-slate-300 hover:text-rose-500 transition-colors"
                         >
                           <Trash2 size={16} />
                         </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 border-t border-slate-100 flex gap-4 bg-slate-50/50 shrink-0">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  className="flex-[2] px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Save Blueprint
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminChecklistManagement;
