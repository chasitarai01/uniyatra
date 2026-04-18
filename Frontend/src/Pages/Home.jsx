import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Globe, Shield, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-500/10 blur-[100px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-6 border border-indigo-100">
              Future of Global Education
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
              Your Journey to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Global Excellence</span> Starts Here.
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
              Explore thousands of universities, secure life-changing scholarships, and manage your entire application journey with AI-powered precision.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/25 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                Start Your Journey <ArrowRight size={20} />
              </Link>
              <Link to="/uni" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
                Explore Universities
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: '10K+', lbl: 'Universities' },
              { val: '500+', lbl: 'Scholarships' },
              { val: '25K+', lbl: 'Active Students' },
              { val: '98%', lbl: 'Success Rate' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-black text-indigo-600 mb-2">{s.val}</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black text-slate-900 mb-4">Everything You Need to Succeed</h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">One unified platform for your entire international education lifecycle.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: <Globe className="text-indigo-500" />, 
              title: 'Global Directory', 
              desc: 'Detailed profiles of institutions from 50+ countries with real-time ranking data.' 
            },
            { 
              icon: <Zap className="text-purple-500" />, 
              title: 'AI Eligibility', 
              desc: 'Instantly check your chances of admission with our advanced matching algorithms.' 
            },
            { 
              icon: <Shield className="text-emerald-500" />, 
              title: 'Secure Applications', 
              desc: 'Manage all your documents and application statuses in one centralized secure vault.' 
            }
          ].map((f, i) => (
            <div key={i} className="p-10 bg-white border border-slate-100 rounded-[32px] hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed text-lg">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-32 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Ready to Shape Your Future?</h2>
            <p className="text-indigo-100 text-xl mb-12 max-w-2xl mx-auto">Join thousands of students who have successfully secured their global education through UniYatra.</p>
            <Link to="/register" className="inline-block px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-xl">
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-slate-100 text-center">
        <div className="flex items-center justify-center gap-2 mb-6 opacity-60">
           <GraduationCap size={24} color="#111" />
           <span className="font-black text-xl text-slate-900 tracking-tight">UniYatra</span>
        </div>
        <p className="text-slate-400 text-sm font-medium">© 2026 UniYatra Global Education Suite. All rights reserved.</p>
      </footer>
    </div>
  );
}