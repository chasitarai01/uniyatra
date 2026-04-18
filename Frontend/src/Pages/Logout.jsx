import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all session data
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    
    // Optional: wait a moment to show the nice logout screen
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 blur-[150px] rounded-full"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/20 mb-10">
          <GraduationCap size={48} className="text-white" />
        </div>
        
        <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Signing Out Securely</h2>
        <p className="text-indigo-200/60 font-medium text-lg mb-12">Thank you for using UniYatra. See you soon!</p>
        
        <div className="flex items-center justify-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0 }}
            className="w-2 h-2 rounded-full bg-indigo-400"
          />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
            className="w-2 h-2 rounded-full bg-indigo-400"
          />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
            className="w-2 h-2 rounded-full bg-indigo-400"
          />
        </div>
      </motion.div>

      <div className="absolute bottom-12 text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">
        UniYatra Global Education Suite
      </div>
    </div>
  );
};

export default Logout;
