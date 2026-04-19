import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Search, MessageSquare, MoreVertical, 
  User, Shield, Clock, CheckCircle2, 
  Sparkles, Hash, Paperclip, Smile,
  Bot, AlertCircle, Trash2, X
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "";
const API = `${BASE_URL}/api/support-chat`;
const token = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token()}`,
});

function decodeJwt() {
  const t = token();
  if (!t) return {};
  try {
    return JSON.parse(atob(t.split(".")[1]));
  } catch { return {}; }
}

async function jsonFetch(url, options = {}) {
  const res = await fetch(url, { ...options, headers: { ...headers(), ...options.headers } });
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const txt = await res.text();
    throw new Error(txt.slice(0, 120) || `HTTP ${res.status}`);
  }
  return res.json();
}

export default function SupportDashboard() {
  const claims = decodeJwt();
  const isAdmin = claims.role === "admin";

  const [threads, setThreads] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  const loadThreads = useCallback(async () => {
    if (!token()) return;
    setLoading(true);
    try {
      const path = isAdmin ? `${API}/threads/all` : `${API}/threads/me`;
      const res = await jsonFetch(path);
      setThreads(res.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const loadMessages = useCallback(async (threadId) => {
    if (!threadId) return;
    try {
      const res = await jsonFetch(`${API}/threads/${threadId}/messages`);
      setMessages(res.data || []);
    } catch (e) {
      console.error("Load messages failed", e);
    }
  }, []);

  useEffect(() => { loadThreads(); }, [loadThreads]);

  useEffect(() => {
    if (!activeId) return;
    loadMessages(activeId);
  }, [activeId, loadMessages]);

  useEffect(() => {
    if (!activeId || !token()) return;
    const s = io(BASE_URL, {
      transports: ["websocket", "polling"],
      auth: { token: token() },
    });
    socketRef.current = s;
    s.on("connect", () => {
      s.emit("support:join-thread", { threadId: activeId, token: token() });
    });
    s.on("support:new-message", (msg) => {
      if (msg.threadId === activeId) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    });
    return () => {
      s.emit("support:leave-thread", { threadId: activeId });
      s.disconnect();
    };
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const trimmed = text.trim();
    if (!trimmed || !activeId) return;
    setText("");
    try {
      const res = await jsonFetch(`${API}/threads/${activeId}/messages`, {
        method: "POST",
        body: JSON.stringify({ text: trimmed }),
      });
      setMessages((prev) => [...prev, res.data]);
    } catch (e) {
      setError(e.message);
    }
  };

  const createThread = async () => {
    try {
      const res = await jsonFetch(`${API}/threads`, {
        method: "POST",
        body: JSON.stringify({ topic: "General Inquiry" }),
      });
      await loadThreads();
      setActiveId(res.data._id);
    } catch (e) {
      setError(e.message);
    }
  };

  const activeThread = threads.find(t => t._id === activeId);
  const filteredThreads = threads.filter(t => 
    (isAdmin ? (t.studentId?.fullName || t.studentId?.email) : t.topic)
    ?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/30">
        <div className="p-8 border-b border-slate-100 bg-white/50 backdrop-blur-xl shrink-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-black text-slate-800 tracking-tight">Support Hub</h1>
            {!isAdmin && (
              <button 
                onClick={createThread}
                className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
              >
                <Plus size={16} />
              </button>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none shadow-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="h-16 bg-white animate-pulse rounded-2xl border border-slate-100"></div>)
          ) : (
            filteredThreads.map((t) => (
              <button
                key={t._id}
                onClick={() => setActiveId(t._id)}
                className={`w-full text-left p-4 rounded-2xl transition-all border ${
                  activeId === t._id
                    ? "bg-white border-indigo-100 shadow-xl shadow-indigo-500/5 ring-1 ring-indigo-50"
                    : "hover:bg-white border-transparent text-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${activeId === t._id ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {(isAdmin ? t.studentId?.fullName : t.topic)?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                       <p className={`text-sm font-black truncate ${activeId === t._id ? 'text-slate-800' : 'text-slate-600'}`}>
                         {isAdmin ? (t.studentId?.fullName || "Student") : (t.topic || "Support Request")}
                       </p>
                       <span className="text-[9px] font-bold text-slate-400">{new Date(t.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'open' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.status}</p>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-white">
        {!activeId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50/10">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-300 mb-6 shadow-inner">
               <MessageSquare size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Secure Message Center</h2>
            <p className="text-slate-500 font-medium max-w-sm">Select a conversation from the sidebar to begin chatting with our support specialists.</p>
          </div>
        ) : (
          <>
            {/* Thread Header */}
            <header className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-xl shrink-0">
              <div className="flex items-center gap-4">
                 <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                       <User size={24} />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                 </div>
                 <div>
                    <h3 className="text-base font-black text-slate-800 leading-tight">
                      {isAdmin ? (activeThread?.studentId?.fullName || "Student") : "Support Assistant"}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                       <Shield size={10} className="text-indigo-400" /> Fully Encrypted Session
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                    <Clock size={18} />
                 </button>
                 <button className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                    <Trash2 size={18} />
                 </button>
              </div>
            </header>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-slate-50/20">
              <div className="flex justify-center mb-8">
                 <div className="px-4 py-1.5 bg-white rounded-full text-[10px] font-black text-slate-400 border border-slate-100 shadow-sm uppercase tracking-widest">
                    Chat initialized — {new Date(activeThread?.createdAt).toLocaleDateString()}
                 </div>
              </div>

              {messages.map((m, idx) => {
                const isMine = m.senderId === (claims.userId || claims.id || claims.sub);
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    key={m._id || idx}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex gap-3 max-w-[75%] ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                      <div className={`w-8 h-8 rounded-lg shrink-0 mt-auto flex items-center justify-center text-[10px] font-black ${isMine ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-100 text-slate-400 shadow-sm'}`}>
                         {m.senderRole === "admin" ? <Bot size={14} /> : <User size={14} />}
                      </div>
                      <div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                        <div className={`px-5 py-3.5 rounded-3xl text-sm font-medium leading-relaxed shadow-sm ${
                          isMine 
                            ? "bg-slate-900 text-white rounded-br-none" 
                            : "bg-white border border-slate-100 text-slate-800 rounded-bl-none"
                        }`}>
                          {m.text}
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 mt-1.5 px-1">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-slate-100 shrink-0">
              <div className="bg-slate-50 rounded-[2rem] p-3 border border-slate-200 shadow-inner focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 transition-all">
                <div className="flex items-center gap-2">
                  <button className="p-2.5 text-slate-400 hover:text-indigo-600 transition-all">
                     <Paperclip size={18} />
                  </button>
                  <input 
                    type="text" 
                    placeholder="Describe your issue in detail..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                    className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-800 py-2"
                  />
                  <button className="p-2.5 text-slate-400 hover:text-amber-500 transition-all">
                     <Smile size={18} />
                  </button>
                  <button 
                    onClick={send}
                    disabled={!text.trim()}
                    className="bg-indigo-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50 disabled:shadow-none"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                 <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <CheckCircle2 size={10} className="text-emerald-500" /> Pro Support
                 </div>
                 <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <Sparkles size={10} className="text-amber-500" /> AI Enhanced
                 </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
