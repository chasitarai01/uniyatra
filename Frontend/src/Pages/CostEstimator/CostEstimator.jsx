import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, Plane, Home, GraduationCap, 
  FileText, HeartPulse, DollarSign, PieChart,
  Globe, TrendingUp, Info, ArrowRight,
  ShieldCheck, Sparkles, Download, Save
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function CostEstimator() {
  const [configs, setConfigs] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [costs, setCosts] = useState({
    tuition: 0,
    living: 0,
    visa: 0,
    medical: 0,
    flights: 0,
    insurance: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/cost-estimator`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setConfigs(data.data);
          // Set USA as default if available
          const usa = data.data.find(c => c.country === "United States");
          if (usa) handleCountrySelect(usa);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCountrySelect = (config) => {
    setSelectedCountry(config.country);
    setCosts(config.rates);
  };

  const handleInputChange = (field, value) => {
    setCosts(prev => ({ ...prev, [field]: Number(value) || 0 }));
  };

  const total = Object.values(costs).reduce((a, b) => a + b, 0);

  const categories = [
    { id: 'tuition', label: 'Tuition Fees', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50', bar: 'bg-indigo-600' },
    { id: 'living', label: 'Living Expenses', icon: Home, color: 'text-emerald-600', bg: 'bg-emerald-50', bar: 'bg-emerald-600' },
    { id: 'flights', label: 'Airfare & Travel', icon: Plane, color: 'text-sky-600', bg: 'bg-sky-50', bar: 'bg-sky-600' },
    { id: 'medical', label: 'Medical Checkup', icon: HeartPulse, color: 'text-rose-600', bg: 'bg-rose-50', bar: 'bg-rose-600' },
    { id: 'visa', label: 'Visa Fees', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50', bar: 'bg-amber-600' },
    { id: 'insurance', label: 'Health Insurance', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50', bar: 'bg-purple-600' }
  ];

  return (
    <div className="min-h-screen bg-white rounded-[3rem] p-8 lg:p-12 shadow-sm border border-slate-100 overflow-hidden relative">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 blur-[120px] rounded-full -mr-48 -mt-48 animate-pulse"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest mb-4">
              <Sparkles size={14} /> Intelligence Powered Planning
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              Financial <span className="text-indigo-600">Roadmap.</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium">
              Get precise, country-specific financial projections for your global education journey. Use our market benchmarks or customize your own.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95">
              <Download size={18} /> Export PDF
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95">
              <Save size={18} /> Save Plan
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Controls */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Country Selector */}
            <section className="bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black text-slate-800 flex items-center gap-3">
                  <Globe size={20} className="text-indigo-500" /> Select Destination
                </h2>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Benchmarks</div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {configs.map((config) => (
                  <button
                    key={config.country}
                    onClick={() => handleCountrySelect(config)}
                    className={`p-4 rounded-3xl text-center transition-all border-2 ${
                      selectedCountry === config.country
                        ? "bg-white border-indigo-600 shadow-xl shadow-indigo-600/10 scale-105"
                        : "bg-white border-transparent hover:border-slate-200 text-slate-600"
                    }`}
                  >
                    <p className="text-sm font-black truncate">{config.country}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Estimates Ready</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Input Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((cat) => (
                <div key={cat.id} className="group p-6 bg-white border-2 border-slate-50 rounded-[2.5rem] hover:border-indigo-100 transition-all hover:shadow-xl hover:shadow-indigo-500/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`${cat.bg} ${cat.color} p-3 rounded-2xl shadow-inner`}>
                        <cat.icon size={20} />
                      </div>
                      <span className="text-sm font-black text-slate-700">{cat.label}</span>
                    </div>
                    <Info size={14} className="text-slate-300 cursor-help" />
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      type="number"
                      value={costs[cat.id]}
                      onChange={(e) => handleInputChange(cat.id, e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-base font-black text-slate-900 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                    />
                  </div>
                </div>
              ))}
            </section>
          </div>

          {/* Sidebar / Summary */}
          <div className="lg:col-span-4">
            <aside className="sticky top-8 space-y-6">
              
              <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[60px] rounded-full"></div>
                
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Total Estimate</h3>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-5xl font-black tracking-tighter">${total.toLocaleString()}</span>
                  <span className="text-indigo-400 font-bold uppercase tracking-widest text-xs">/ Year</span>
                </div>

                <div className="space-y-5">
                  {categories.map((cat) => (
                    <div key={cat.id} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-400">{cat.label}</span>
                        <span className="text-white">${costs[cat.id].toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(costs[cat.id] / (total || 1)) * 100}%` }}
                          className={`h-full ${cat.bar}`}
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <TrendingUp className="text-emerald-400" size={24} />
                  </div>
                  <p className="text-[10px] font-bold text-slate-300 leading-relaxed uppercase tracking-widest">
                    Based on current market data for <span className="text-white">{selectedCountry || "selected region"}</span>.
                  </p>
                </div>
              </div>

              <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-600/20">
                <h4 className="text-lg font-black mb-2 flex items-center gap-2">
                   Next Steps <ArrowRight size={20} />
                </h4>
                <p className="text-sm text-indigo-100 font-medium mb-6 leading-relaxed">
                  Start your application to your favorite universities based on these estimates.
                </p>
                <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all shadow-lg shadow-black/10 active:scale-95">
                  Browse Universities
                </button>
              </div>

            </aside>
          </div>

        </div>
      </div>
    </div>
  );
}
