import React, { useState } from "react";
import { FaEnvelope, FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Sparkles } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!email) {
      setError("Please provide your registered email address");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.msg || "Account not found or system error");
        setLoading(false);
        return;
      }

      setMessage("Check your inbox! We've sent a recovery link.");
    } catch (err) {
      setError("Connection failed. Please check your internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 font-sans overflow-hidden">
      {/* Left Side: Illustration & Branding */}
      <div className="hidden lg:flex relative bg-slate-900 items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop')] bg-cover"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 to-purple-900/60 mix-blend-multiply"></div>
        
        <div className="relative z-10 max-w-lg text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/20"
          >
            <FaShieldAlt className="text-white text-4xl" />
          </motion.div>
          <h1 className="text-5xl font-black text-white mb-6 tracking-tight leading-tight">
            Security <br />
            <span className="text-indigo-400">Simplified.</span>
          </h1>
          <p className="text-indigo-100 text-lg font-medium leading-relaxed opacity-80">
            Don't worry, even the best travelers lose their way sometimes. We'll help you get back on track to your global education goals.
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
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Password Recovery</h2>
            <p className="text-slate-500 font-medium">Enter your email and we'll send instructions.</p>
          </div>

          <div className="bg-white/80 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/60">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-xs font-bold border border-rose-100 flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
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
                    <Sparkles size={14} className="text-emerald-500" />
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-4.5 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-500/25 hover:bg-indigo-700 hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Send Instructions <Sparkles size={16} /></>
                )}
              </button>
            </form>

            <div className="mt-8 text-center border-t border-slate-100 pt-8">
              <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                <FaArrowLeft size={12} /> Back to Sign In
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
