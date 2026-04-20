import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, CheckCircle2, Circle, AlertCircle, FileText, 
  Award, Video, MessageSquare, Trash2 
} from "lucide-react";

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [tab, setTab]         = useState("all");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split(".")[1]));
          setUser(decoded);
        } catch (err) {
          console.error("Invalid token", err);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        
        const userId = user._id || user.id || user.userId;
        const mine = data.filter((n) => n.userId === userId);
        mine.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotifications(mine);
      } catch {
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user]);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`/api/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error("Error marking as read", err);
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    await Promise.all(unread.map((n) => markAsRead(n._id)));
  };

  const filtered = notifications.filter((n) => {
    if (tab === "unread") return !n.isRead;
    if (tab === "read")   return n.isRead;
    return true;
  });

  const getIconForType = (type, message) => {
    const msgLower = (message || "").toLowerCase();
    if (msgLower.includes("document") || type === "document" || msgLower.includes("file")) {
      return { icon: FileText, color: "text-blue-500", bg: "bg-blue-50" };
    }
    if (msgLower.includes("scholarship") || type === "scholarship") {
      return { icon: Award, color: "text-purple-600", bg: "bg-purple-50" };
    }
    if (msgLower.includes("class") || msgLower.includes("room") || type === "room") {
      return { icon: Video, color: "text-rose-500", bg: "bg-rose-50" };
    }
    return { icon: Bell, color: "text-indigo-600", bg: "bg-indigo-50" };
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Your <span className="text-indigo-600">Notifications</span> 🔔
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {unreadCount > 0 
              ? `You have ${unreadCount} unread message${unreadCount > 1 ? 's' : ''} waiting for you.` 
              : "You're all caught up! No new alerts."}
          </p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllRead}
            className="px-5 py-2.5 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-600 text-sm font-bold flex items-center gap-2 hover:bg-indigo-100 transition-all"
          >
            <CheckCircle2 size={16} />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Notifications Feed */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tabs */}
          <div className="flex bg-white rounded-2xl p-1.5 border border-slate-100 shadow-sm w-fit">
            {["all", "unread", "read"].map((key) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all capitalize ${
                  tab === key 
                  ? "bg-slate-900 text-white shadow-md" 
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {loading && (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-white border border-slate-100 shadow-sm animate-pulse rounded-[2rem] w-full"></div>
              ))
            )}

            {!loading && error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 p-8 rounded-[2rem] font-bold text-center flex flex-col items-center gap-3">
                <AlertCircle size={32} />
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="bg-white border border-slate-100 shadow-sm p-16 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
                  <Bell size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-800">Inbox Zero</h3>
                <p className="text-slate-500 font-medium mt-2 max-w-sm">
                  {tab === "unread" ? "Great job! You don't have any unread messages." :
                   tab === "read"   ? "You haven't read any messages yet." :
                   "You're completely caught up! We'll notify you when something important happens."}
                </p>
              </div>
            )}

            {!loading && !error && filtered.length > 0 && (
              <AnimatePresence mode="popLayout">
                {filtered.map((n) => {
                  const { icon: Icon, color, bg } = getIconForType(n.type, n.message);
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={n._id}
                      onClick={() => !n.isRead && markAsRead(n._id)}
                      className={`group relative p-6 rounded-[2rem] border transition-all cursor-pointer flex flex-col sm:flex-row gap-5 ${
                        n.isRead 
                        ? "bg-white border-slate-100 shadow-sm hover:shadow-md" 
                        : "bg-indigo-50/50 border-indigo-100 shadow-md hover:shadow-lg"
                      }`}
                    >
                      {/* Icon */}
                      <div className="shrink-0">
                        <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-inner relative ${bg} ${color}`}>
                          <Icon size={24} />
                          {!n.isRead && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-white rounded-full animate-pulse"></span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <p className={`text-sm md:text-base leading-relaxed pr-8 ${
                            n.isRead ? "text-slate-600 font-medium" : "text-slate-900 font-black"
                          }`}>
                            {/* If the message contains a colon (like Title: Message), bold the title */}
                            {n.message.includes(":") ? (
                              <>
                                <span className="mr-1">{n.message.split(":")[0]}:</span>
                                <span className={n.isRead ? "font-normal" : "font-medium"}>{n.message.split(":").slice(1).join(":")}</span>
                              </>
                            ) : n.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md inline-flex w-fit ${
                            n.isRead ? "bg-slate-100 text-slate-500" : "bg-indigo-100 text-indigo-700"
                          }`}>
                            {n.isRead ? "Read" : "New Message"}
                          </span>
                          <span className="text-[11px] font-bold text-slate-400">
                            {timeAgo(n.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Action (Read mark) */}
                      {!n.isRead && (
                        <div className="hidden sm:flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-100 text-slate-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors tooltip-trigger relative">
                          <CheckCircle2 size={18} />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-[#0f172a] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare size={20} className="text-indigo-300" />
              </div>
              <h3 className="text-xl font-black mb-2 leading-tight">Stay Updated</h3>
              <p className="text-slate-400 text-sm font-medium mb-6 leading-relaxed">
                Check this page regularly. We'll post all important updates regarding your applications, documents, and classes here.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Color Guide</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center"><FileText size={14}/></div>
                <span className="text-sm font-bold text-slate-700">Documents</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><Award size={14}/></div>
                <span className="text-sm font-bold text-slate-700">Scholarships</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center"><Video size={14}/></div>
                <span className="text-sm font-bold text-slate-700">Classes & Rooms</span>
              </li>
            </ul>
          </section>
        </div>

      </div>
    </div>
  );
};

export default UserNotifications;
