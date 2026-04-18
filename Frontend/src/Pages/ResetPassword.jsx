import React, { useState } from "react";
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Sparkles } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 8) return setError("Password must be at least 8 characters");
    if (password !== confirmPassword) return setError("Passwords do not match");

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5001/api/auth/reset-password/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.msg || "The reset link is invalid or has expired");
        setLoading(false);
        return;
      }

      setMessage("Success! Your password has been updated.");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 font-sans overflow-hidden">
      {/* Left Side: Secure Illustration */}
      <div className="hidden lg:flex relative bg-slate-900 items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/40 to-indigo-900/60 mix-blend-multiply"></div>
        
        <div className="relative z-10 max-w-lg text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/20"
          >
            <FaCheckCircle className="text-emerald-400 text-4xl" />
          </motion.div>
          <h1 className="text-5xl font-black text-white mb-6 tracking-tight leading-tight">
            Security <br />
            <span className="text-emerald-400">Restored.</span>
          </h1>
          <p className="text-indigo-100 text-lg font-medium opacity-80 leading-relaxed">
            Create a strong password that you'll remember. Your data is protected with our multi-layer encryption.
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex items-center justify-center p-8 relative">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="mb-10">
            <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 font-black text-2xl tracking-tighter mb-8">
               <GraduationCap size={32} />
               <span>UniYatra</span>
            </Link>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">New Password</h2>
            <p className="text-slate-500 font-medium">Set a strong password to secure your account.</p>
          </div>

          <div className="bg-white/80 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/60">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                <div className="relative group">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                <div className="relative group">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-xs font-bold border border-rose-100"
                  >
                    {error}
                  </motion.div>
                )}
                {message && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl text-xs font-bold border border-emerald-100 flex items-center gap-2"
                  >
                    <FaCheckCircle className="text-emerald-500" />
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-4.5 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-500/25 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
