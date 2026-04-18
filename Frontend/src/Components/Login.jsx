import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ShieldCheck } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden shadow-2xl relative z-10 m-4">
        
        {/* Left Side: Brand/Visual */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 to-purple-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
                <GraduationCap className="text-white" size={28} />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">UniYatra</span>
            </div>
            
            <h2 className="text-5xl font-black text-white leading-tight mb-6">
              Empowering Your <br /> 
              <span className="text-indigo-200 text-6xl">Global Journey.</span>
            </h2>
            <p className="text-indigo-100 text-lg font-medium leading-relaxed max-w-sm">
              Access thousands of universities and scholarships with a single, secure login. Your future starts here.
            </p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <ShieldCheck className="text-white" size={20} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Enterprise Security</p>
                <p className="text-indigo-200 text-xs">Your data is protected with 256-bit encryption</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 lg:p-16 bg-white">
          <div className="mb-10">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Sign In</h3>
            <p className="text-slate-500 font-medium">Please enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  placeholder="name@university.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-indigo-600/20 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Password</label>
                <Link to="/forgot-password" size={12} className="text-xs font-black text-indigo-600 hover:text-indigo-800 transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold focus:outline-none focus:border-indigo-600/20 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-xs font-black border border-rose-100 flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-600"></div>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm shadow-2xl shadow-slate-900/20 hover:bg-indigo-600 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-sm font-bold text-slate-400">
              New to UniYatra?{" "}
              <Link to="/register" className="text-indigo-600 hover:text-indigo-800 transition-colors">Create your student profile</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;