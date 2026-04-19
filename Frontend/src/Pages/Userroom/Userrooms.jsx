import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Search, User, ArrowRight, Play } from "lucide-react";

const getUser = () => {
  try { return JSON.parse(atob(localStorage.getItem("token").split(".")[1])); }
  catch { return null; }
};

const fmt = (d) => d
  ? new Date(d).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
  : null;

export default function UserRooms() {
  const [rooms, setRooms]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [codeErr, setCodeErr]   = useState("");
  const navigate = useNavigate();
  const token    = localStorage.getItem("token");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res  = await fetch("http://localhost:5001/api/rooms", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setRooms((data.rooms || []).filter(r => r.isActive));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [token]);

  const joinByCode = async () => {
    const code = codeInput.trim().toUpperCase();
    if (!code) return;
    setCodeErr("");
    try {
      const res  = await fetch(`http://localhost:5001/api/rooms/${code}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) navigate(`/room/${code}`);
      else setCodeErr(data.message || "Room not found");
    } catch { setCodeErr("Cannot reach server"); }
  };

  const filtered = rooms.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.roomCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></div>
            Virtual Classrooms
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Interactive <span className="text-indigo-600">Learning</span></h1>
          <p className="text-slate-500 font-medium max-w-lg">Access live sessions hosted by top educators. Enter a room code to join your scheduled class.</p>
        </div>

        {/* Join by code widget */}
        <div className="bg-white p-2 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 flex-1 md:flex-none">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Code</span>
            <input
              className="bg-transparent border-none outline-none font-black text-slate-800 w-24 uppercase tracking-widest"
              placeholder="JOIN..."
              value={codeInput}
              maxLength={6}
              onChange={e => { setCodeInput(e.target.value.toUpperCase()); setCodeErr(""); }}
              onKeyDown={e => e.key === "Enter" && joinByCode()}
            />
          </div>
          <button 
            onClick={joinByCode}
            className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {codeErr && <p className="text-rose-500 text-xs font-bold text-right -mt-8 mr-2">{codeErr}</p>}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-slate-100">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input
            className="w-full bg-white border border-slate-200 rounded-[1.5rem] py-4 pl-14 pr-6 font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all"
            placeholder="Search for subjects or instructors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="px-6 py-4 bg-slate-900 rounded-[1.5rem] text-white flex items-center gap-3 whitespace-nowrap">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-black tracking-tight">{filtered.length} Live Now</span>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="h-80 bg-slate-100 animate-pulse rounded-[2.5rem]"></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-slate-200 rounded-[3rem] text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
            <Video size={40} />
          </div>
          <h3 className="text-xl font-black text-slate-800">Quiet for now...</h3>
          <p className="text-slate-500 font-medium max-w-xs mt-2">
            {search ? "No classes match your search criteria." : "There are no live classes at the moment. Check back later!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map(room => {
              const pct  = Math.round(((room.participants?.length || 0) / room.maxParticipants) * 100);
              const full = (room.participants?.length || 0) >= room.maxParticipants;
              
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={room._id}
                  className="group bg-white rounded-[2.5rem] border border-slate-200 p-8 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all relative overflow-hidden flex flex-col"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="flex items-start justify-between mb-8 relative z-10">
                    <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full flex items-center gap-2 border border-emerald-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Active Class</span>
                    </div>
                    <span className="text-xs font-black text-slate-300 group-hover:text-indigo-400 transition-colors uppercase tracking-widest">{room.roomCode}</span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-800 leading-tight mb-4 group-hover:text-indigo-600 transition-colors">{room.title}</h3>
                  
                  <div className="space-y-4 mb-8 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <User size={14} />
                      </div>
                      <div className="text-xs">
                        <p className="text-slate-400 font-bold uppercase tracking-tighter">Instructor</p>
                        <p className="text-slate-800 font-black">{room.createdBy?.username || "Global Educator"}</p>
                      </div>
                    </div>
                    {room.scheduledAt && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <Play size={14} />
                        </div>
                        <div className="text-xs">
                          <p className="text-slate-400 font-bold uppercase tracking-tighter">Started At</p>
                          <p className="text-slate-800 font-black">{fmt(room.scheduledAt)}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Capacity Indicator */}
                  <div className="space-y-2 mb-8">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance</span>
                      <span className="text-xs font-black text-slate-800">{room.participants?.length || 0} / {room.maxParticipants}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        className={`h-full rounded-full ${full ? 'bg-rose-500' : 'bg-indigo-600'}`}
                      />
                    </div>
                  </div>

                  <button
                    disabled={full}
                    onClick={() => navigate(`/room/${room.roomCode}`)}
                    className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm tracking-tight transition-all ${
                      full 
                        ? "bg-slate-50 text-slate-300 cursor-not-allowed" 
                        : "bg-slate-900 text-white hover:bg-indigo-600 shadow-lg shadow-slate-900/10 hover:shadow-indigo-600/20"
                    }`}
                  >
                    {full ? "Room at Capacity" : "Enter Classroom"}
                    {!full && <ArrowRight size={18} />}
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}