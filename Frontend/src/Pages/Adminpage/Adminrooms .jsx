import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaVideo, FaTrash, FaCopy, FaCheck, FaTimes, FaUsers, FaCalendarAlt, FaDoorOpen } from "react-icons/fa";

const getUser = () => {
  try {
    const t = localStorage.getItem("token");
    if (!t) return null;
    return JSON.parse(atob(t.split(".")[1]));
  } catch { return null; }
};

const fmt = (d) => d
  ? new Date(d).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
  : "—";

export default function AdminRooms() {
  const [rooms, setRooms]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newRoom, setNewRoom]       = useState(null);
  const [toast, setToast]           = useState("");
  const [form, setForm]             = useState({ title: "", scheduledAt: "", maxParticipants: 15 });

  const navigate = useNavigate();
  const user     = getUser();
  const token    = localStorage.getItem("token");

  useEffect(() => {
    if (user && user.role !== "admin") navigate("/");
  }, [user, navigate]);

  const load = async () => {
    setLoading(true);
    try {
      const res  = await fetch("http://localhost:5001/api/rooms", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setRooms(data.rooms || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const createRoom = async () => {
    if (!form.title.trim()) return;
    try {
      const res  = await fetch("http://localhost:5001/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setShowCreate(false);
        setForm({ title: "", scheduledAt: "", maxParticipants: 15 });
        setNewRoom(data.room);
        load();
      }
    } catch (e) { console.error(e); }
  };

  const closeRoom = async (code) => {
    await fetch(`http://localhost:5001/api/rooms/${code}/close`, {
      method: "PUT", headers: { Authorization: `Bearer ${token}` },
    });
    load(); showToast("Room closed");
  };

  const deleteRoom = async (code) => {
    if (!window.confirm("Delete this room permanently?")) return;
    await fetch(`http://localhost:5001/api/rooms/${code}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` },
    });
    load(); showToast("Room deleted");
  };

  const copyLink = (code) => {
    navigator.clipboard.writeText(`${window.location.origin}/room/${code}`);
    showToast("Link copied!");
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

  const live = rooms.filter(r => r.isActive);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Class Management</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Create rooms, share codes, and manage live sessions.</p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold shadow-sm shadow-indigo-500/30 transition-all flex items-center gap-2 hover:-translate-y-0.5"
        >
          <FaPlus /> New Class Room
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Rooms</p>
            <p className="text-3xl font-black text-slate-800">{rooms.length}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500">
            <FaDoorOpen className="text-xl" />
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Live Now</p>
            <p className="text-3xl font-black text-emerald-600">{live.length}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
            <FaVideo className="text-xl" />
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Participants</p>
            <p className="text-3xl font-black text-indigo-600">
              {rooms.reduce((s, r) => s + (r.participants?.length || 0), 0)}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
            <FaUsers className="text-xl" />
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <FaVideo className="text-3xl" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No Rooms Found</h3>
          <p className="text-slate-500 mb-6">You haven't created any class rooms yet.</p>
          <button 
            onClick={() => setShowCreate(true)}
            className="text-indigo-600 font-bold hover:underline"
          >
            Create your first room
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {rooms.map(room => (
              <motion.div 
                key={room._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-shadow flex flex-col relative overflow-hidden"
              >
                {/* Status Indicator */}
                <div className={`absolute top-0 left-0 w-full h-1.5 ${room.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>

                <div className="flex justify-between items-start mb-4 mt-2">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${room.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {room.isActive ? "● LIVE" : "CLOSED"}
                  </span>
                  <span className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{room.roomCode}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-4 line-clamp-2">{room.title}</h3>

                <div className="space-y-2 mb-6 flex-1">
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <FaUsers className="text-slate-400" /> {room.participants?.length || 0} / {room.maxParticipants} Joined
                  </div>
                  {room.scheduledAt && (
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                      <FaCalendarAlt className="text-slate-400" /> {fmt(room.scheduledAt)}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100 mb-4">
                  <input type="text" readOnly value={`${window.location.origin}/room/${room.roomCode}`} className="bg-transparent text-xs text-slate-500 font-mono flex-1 outline-none px-2" />
                  <button onClick={() => copyLink(room.roomCode)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <FaCopy />
                  </button>
                </div>

                <div className="flex gap-2 border-t border-slate-100 pt-4">
                  {room.isActive && (
                    <button onClick={() => navigate(`/room/${room.roomCode}`)} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-sm font-bold transition-colors">
                      Join
                    </button>
                  )}
                  {room.isActive && (
                    <button onClick={() => closeRoom(room.roomCode)} className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-xl transition-colors tooltip" title="Close Room">
                      <FaTimes />
                    </button>
                  )}
                  <button onClick={() => deleteRoom(room.roomCode)} className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors tooltip" title="Delete Room">
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl w-full max-w-md p-8 relative z-10 shadow-2xl">
              <h2 className="text-2xl font-bold text-slate-800 mb-1">New Class Room</h2>
              <p className="text-sm font-medium text-slate-500 mb-6">A unique secure code will be generated.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Class Title *</label>
                  <input autoFocus value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} onKeyDown={e => e.key === "Enter" && createRoom()} placeholder="e.g. Advanced AI 101" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Schedule (Optional)</label>
                  <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm({ ...form, scheduledAt: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Max Participants</label>
                  <input type="number" min={2} max={100} value={form.maxParticipants} onChange={e => setForm({ ...form, maxParticipants: Number(e.target.value) })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700" />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowCreate(false)} className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50">Cancel</button>
                <button onClick={createRoom} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-500/30">Create Room</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {newRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl w-full max-w-sm p-8 relative z-10 shadow-2xl text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"><FaCheck /></div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Room Created!</h2>
              <p className="text-sm font-medium text-slate-500 mb-6">Share this code with your students.</p>
              
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6">
                <p className="font-mono text-3xl font-black text-indigo-600 tracking-wider">{newRoom.roomCode}</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setNewRoom(null)} className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50">Close</button>
                <button onClick={() => { setNewRoom(null); navigate(`/room/${newRoom.roomCode}`); }} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-500/30">Join Now</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-8 right-8 bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm z-50 flex items-center gap-2">
            <FaCheck className="text-emerald-400" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}