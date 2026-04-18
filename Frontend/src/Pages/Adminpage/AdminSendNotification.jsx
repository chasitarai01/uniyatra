import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaUserAlt, FaCommentAlt, FaCheckCircle } from "react-icons/fa";

export default function NotificationForm() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : data.users || []);
      } catch {
        // Fallback or empty if error
        setUsers([]);
      }
    };
    fetchUsers();
  }, [token]);

  const handleSubmit = async () => {
    if (!selectedUser || !message) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5001/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: selectedUser, message }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
      setMessage("");
      setSelectedUser("");
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Delivery failed. Please retry.");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/40 overflow-hidden relative">
        {/* Accent Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="p-8 md:p-10 relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 shadow-inner">
              <FaPaperPlane className="text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Dispatch Notification</h2>
              <p className="text-sm font-medium text-slate-500">Send direct system alerts to specific users.</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Recipient Select */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <FaUserAlt className="text-indigo-400" /> Recipient
              </label>
              <div className="relative">
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-medium py-3.5 px-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                >
                  <option value="" disabled>Select a user...</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Message Textarea */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <FaCommentAlt className="text-purple-400" /> Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your notification message here..."
                rows="4"
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-medium py-3.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm resize-none"
              ></textarea>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-rose-50 text-rose-500 px-4 py-3 rounded-xl border border-rose-100 text-sm font-bold">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!selectedUser || !message || sending}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Dispatching...
                </>
              ) : (
                <>
                  <FaPaperPlane /> Send Notification
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success Alert Overlay */}
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 left-6 right-6 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 font-bold z-20"
          >
            <FaCheckCircle className="text-xl" />
            Notification dispatched successfully.
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}