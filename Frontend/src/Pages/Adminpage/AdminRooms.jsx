import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, Users, Calendar, Trash2, Copy, Check, 
  X, Plus, DoorOpen, Shield, Send, Search,
  CheckCircle, AlertCircle, Clock
} from "lucide-react";

const getUser = () => {
  try {
    const t = localStorage.getItem("token");
    if (!t) return null;
    return JSON.parse(atob(t.split(".")[1]));
  } catch { return null; }
};

const fmt = (d) => d
  ? new Date(d).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
  : "Not Scheduled";

export default function AdminRooms() {
  const [rooms, setRooms]           = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newRoom, setNewRoom]       = useState(null);
  const [toast, setToast]           = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  
  const [form, setForm] = useState({ 
    title: "", 
    scheduledAt: "", 
    maxParticipants: 15,
    description: ""
  });

  const navigate = useNavigate();
  const user     = getUser();
  const token    = localStorage.getItem("token");

  useEffect(() => {
    if (user && user.role !== "admin") navigate("/");
  }, [user, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [roomRes, userRes] = await Promise.all([
        fetch("/api/rooms", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/auth/users", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      const roomData = await roomRes.json();
      const userData = await userRes.json();
      
      setRooms(roomData.rooms || []);
      // Handle the case where backend returns { total, users }
      setAvailableUsers(userData.users || userData.data || (Array.isArray(userData) ? userData : []));
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { loadData(); }, []);

  const createRoom = async () => {
    if (!form.title.trim()) return;
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      
      if (data.success) {
        // Send notifications to selected users
        if (selectedUsers.length > 0) {
          await Promise.all(selectedUsers.map(userId => 
            fetch("/api/notifications", {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                recipient: userId,
                title: "New Class Room Invitation",
                message: `You've been invited to join the class: ${form.title}. Room Code: ${data.room.roomCode}`,
                type: "class"
              })
            })
          ));
        }

        setShowCreate(false);
        setForm({ title: "", scheduledAt: "", maxParticipants: 15, description: "" });
        setSelectedUsers([]);
        setNewRoom(data.room);
        loadData();
        showToast("Class created and invitations sent!");
      }
    } catch (e) { 
      console.error(e); 
      showToast("Error creating room");
    }
  };

  const closeRoom = async (code) => {
    try {
      await fetch(`/api/rooms/${code}/close`, {
        method: "PUT", headers: { Authorization: `Bearer ${token}` },
      });
      loadData(); 
      showToast("Room closed successfully");
    } catch (e) { console.error(e); }
  };

  const deleteRoom = async (code) => {
    if (!window.confirm("Delete this room permanently?")) return;
    try {
      await fetch(`/api/rooms/${code}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      });
      loadData(); 
      showToast("Room removed");
    } catch (e) { console.error(e); }
  };

  const copyLink = (code) => {
    navigator.clipboard.writeText(`${window.location.origin}/room/${code}`);
    showToast("Join link copied!");
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const filteredUsers = (Array.isArray(availableUsers) ? availableUsers : []).filter(u => 
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const toggleUser = (id) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-10 pb-20 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Virtual Classrooms</h1>
          <p className="text-slate-500 font-medium mt-1">Orchestrate live learning sessions and manage student access.</p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-[2rem] font-bold shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2 hover:-translate-y-1 active:scale-95"
        >
          <Plus size={20} /> Create New Class
        </button>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: DoorOpen, label: "Total Sessions", value: rooms.length, color: "bg-indigo-600", light: "bg-indigo-50", text: "text-indigo-600" },
          { icon: Video, label: "Active Now", value: rooms.filter(r => r.isActive).length, color: "bg-emerald-600", light: "bg-emerald-50", text: "text-emerald-600" },
          { icon: Users, label: "Total Students", value: rooms.reduce((s, r) => s + (r.participants?.length || 0), 0), color: "bg-amber-500", light: "bg-amber-50", text: "text-amber-600" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all"
          >
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-4xl font-black ${stat.text}`}>{stat.value}</p>
            </div>
            <div className={`w-14 h-14 rounded-2xl ${stat.light} ${stat.text} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold text-sm">Synchronizing classroom data...</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <Video size={48} />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">No Active Classrooms</h3>
          <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">Create your first virtual classroom and invite students to begin the learning session.</p>
          <button 
            onClick={() => setShowCreate(true)}
            className="text-indigo-600 font-black hover:underline flex items-center gap-2 mx-auto"
          >
            Launch First Room <Plus size={18} />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence>
            {rooms.map(room => (
              <motion.div 
                key={room._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all flex flex-col relative overflow-hidden"
              >
                {/* Status Bar */}
                <div className={`absolute top-0 left-0 w-full h-1.5 ${room.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>

                <div className="flex justify-between items-start mb-6 mt-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest ${room.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                    {room.isActive ? <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> LIVE SESSION</> : "ARCHIVED"}
                  </div>
                  <span className="font-mono text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">{room.roomCode}</span>
                </div>

                <h3 className="text-xl font-black text-slate-800 mb-6 line-clamp-2 group-hover:text-indigo-600 transition-colors">{room.title}</h3>

                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-center gap-3 text-sm text-slate-500 font-bold">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                      <Users size={16} />
                    </div>
                    {room.participants?.length || 0} / {room.maxParticipants} Students Joined
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500 font-bold">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                      <Clock size={16} />
                    </div>
                    {fmt(room.scheduledAt)}
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-6">
                  <input 
                    type="text" 
                    readOnly 
                    value={`${window.location.origin}/room/${room.roomCode}`} 
                    className="bg-transparent text-[10px] text-slate-400 font-mono flex-1 outline-none px-2" 
                  />
                  <button onClick={() => copyLink(room.roomCode)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all">
                    <Copy size={14} />
                  </button>
                </div>

                <div className="flex gap-3 pt-6 border-t border-slate-50">
                  {room.isActive ? (
                    <>
                      <button 
                        onClick={() => navigate(`/room/${room.roomCode}`)} 
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl text-xs font-black transition-all shadow-lg shadow-indigo-600/20"
                      >
                        Join Class
                      </button>
                      <button 
                        onClick={() => closeRoom(room.roomCode)} 
                        className="p-3 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-2xl transition-all border border-amber-100"
                        title="End Session"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <div className="flex-1 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       Session Completed
                    </div>
                  )}
                  <button 
                    onClick={() => deleteRoom(room.roomCode)} 
                    className="p-3 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-2xl transition-all border border-rose-100"
                    title="Delete Record"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Creation Wizard Modal */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowCreate(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }} 
              className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col md:flex-row"
            >
              {/* Sidebar Info */}
              <div className="md:w-1/3 bg-slate-900 p-10 text-white flex flex-col">
                 <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-indigo-600/40">
                    <Shield size={32} />
                 </div>
                 <h2 className="text-3xl font-black mb-6 leading-tight">Create & <br/> Invite.</h2>
                 <p className="text-slate-400 font-medium text-sm leading-relaxed mb-10">Set up a secure virtual space and choose which students can access the class code immediately.</p>
                 
                 <div className="mt-auto space-y-4">
                    <div className="flex items-center gap-3 text-indigo-400 font-black text-xs uppercase">
                       <CheckCircle size={16} /> Secure Encryption
                    </div>
                    <div className="flex items-center gap-3 text-indigo-400 font-black text-xs uppercase">
                       <CheckCircle size={16} /> Instant Notifications
                    </div>
                 </div>
              </div>

              {/* Form Area */}
              <div className="flex-1 p-10 overflow-y-auto custom-scrollbar flex flex-col">
                <div className="space-y-8 flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Classroom Title</label>
                      <input 
                        autoFocus 
                        value={form.title} 
                        onChange={e => setForm({ ...form, title: e.target.value })} 
                        placeholder="e.g. Advanced Global Economics" 
                        className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-800 transition-all border" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Schedule At</label>
                      <input 
                        type="datetime-local" 
                        value={form.scheduledAt} 
                        onChange={e => setForm({ ...form, scheduledAt: e.target.value })} 
                        className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-800 transition-all border" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacity</label>
                      <input 
                        type="number" 
                        min={2} 
                        max={100} 
                        value={form.maxParticipants} 
                        onChange={e => setForm({ ...form, maxParticipants: Number(e.target.value) })} 
                        className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-800 transition-all border" 
                      />
                    </div>
                  </div>

                  {/* User Selection Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Students</label>
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{selectedUsers.length} Selected</span>
                    </div>
                    <div className="relative mb-4">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                       <input 
                         type="text" 
                         placeholder="Search students to invite..."
                         value={userSearch}
                         onChange={(e) => setUserSearch(e.target.value)}
                         className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none border transition-all"
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                       {filteredUsers.map(user => (
                         <button
                           key={user._id}
                           onClick={() => toggleUser(user._id)}
                           className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${selectedUsers.includes(user._id) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white border-slate-100 text-slate-700 hover:border-indigo-200'}`}
                         >
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] ${selectedUsers.includes(user._id) ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>
                              {user.name?.charAt(0)}
                           </div>
                           <div className="flex-1 overflow-hidden">
                              <p className="text-[10px] font-black truncate">{user.name}</p>
                              <p className={`text-[8px] font-bold truncate ${selectedUsers.includes(user._id) ? 'text-white/60' : 'text-slate-400'}`}>{user.email}</p>
                           </div>
                         </button>
                       ))}
                       {filteredUsers.length === 0 && (
                         <div className="col-span-2 text-center py-6 text-slate-400 text-xs font-bold">No students found.</div>
                       )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-10">
                  <button 
                    onClick={() => setShowCreate(false)} 
                    className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all text-sm"
                  >
                    Discard
                  </button>
                  <button 
                    onClick={createRoom} 
                    className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all text-sm flex items-center justify-center gap-2"
                  >
                    Launch & Invite <Send size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Animation Modal */}
      <AnimatePresence>
        {newRoom && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="bg-white rounded-[3rem] w-full max-w-sm p-10 relative z-10 shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-inner">
                 <CheckCircle size={40} />
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-2">Ready to Go!</h2>
              <p className="text-sm font-medium text-slate-500 mb-10">The classroom is live and invitations have been sent to your selected students.</p>
              
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 mb-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Room Access Code</p>
                <p className="font-mono text-4xl font-black text-indigo-600 tracking-wider leading-none">{newRoom.roomCode}</p>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { setNewRoom(null); navigate(`/admin/room/${newRoom.roomCode}`); }} 
                  className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all"
                >
                  Join the Session
                </button>
                <button 
                  onClick={() => setNewRoom(null)} 
                  className="w-full py-4 bg-white text-slate-400 font-bold rounded-2xl hover:text-slate-600 transition-all text-sm"
                >
                  Return to Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 50, scale: 0.9 }} 
            className="fixed bottom-10 right-10 bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl font-bold text-sm z-[200] flex items-center gap-3 border border-white/10"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
               <CheckCircle size={14} />
            </div>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}