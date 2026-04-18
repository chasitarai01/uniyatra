import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Search, Filter, Trash, Edit, Plus, 
  Mail, Shield, CheckCircle, XCircle, MoreVertical,
  UserPlus, Download
} from "lucide-react";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([
    // Mock data for initial professional feel
    { _id: "1", name: "Alex Johnson", email: "alex@example.com", role: "student", status: "active", joined: "2026-01-12" },
    { _id: "2", name: "Sarah Williams", email: "sarah@edu.com", role: "admin", status: "active", joined: "2025-11-20" },
    { _id: "3", name: "David Chen", email: "david.c@uni.edu", role: "student", status: "pending", joined: "2026-03-05" },
    { _id: "4", name: "Elena Rodriguez", email: "elena@global.org", role: "student", status: "suspended", joined: "2026-02-15" },
  ]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  const filteredUsers = users.filter(u => {
    const searchMatch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const roleMatch = selectedRole === "All" || u.role === selectedRole;
    return searchMatch && roleMatch;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "active": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "pending": return "bg-amber-50 text-amber-600 border-amber-100";
      case "suspended": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium mt-1">Monitor and manage access controls for the platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all">
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
            <UserPlus size={18} />
            <span>Invite User</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name, email or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 transition-all"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="flex-1 md:flex-none bg-slate-50 border-none rounded-2xl py-3.5 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 cursor-pointer min-w-[140px]"
          >
            <option value="All">All Roles</option>
            <option value="admin">Administrators</option>
            <option value="student">Students</option>
          </select>
          <button className="p-3.5 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Users Table Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">User Identity</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Access Level</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">System Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Joined Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredUsers.map((user) => (
                  <motion.tr 
                    layout
                    key={user._id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center font-black text-slate-500 shadow-sm group-hover:scale-105 transition-transform">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{user.name}</p>
                          <div className="flex items-center gap-1 text-slate-400 font-medium text-xs mt-0.5">
                            <Mail size={10} /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${user.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-600'}`}>
                          <Shield size={14} />
                        </div>
                        <span className="text-xs font-bold text-slate-700 capitalize">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(user.status)}`}>
                        {user.status === 'active' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-slate-400 tracking-tighter">
                      {new Date(user.joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                          <Edit size={16} />
                        </button>
                        <button className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                          <Trash size={16} />
                        </button>
                        <button className="p-2.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="py-20 text-center">
              <Users className="w-16 h-16 text-slate-100 mx-auto mb-4" />
              <p className="text-slate-400 font-bold">No users found matching your search</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminUserManagement;
