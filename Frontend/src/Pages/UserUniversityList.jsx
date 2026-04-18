import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, Globe, Award, ChevronRight, 
  Building2, TrendingUp, Filter, Heart 
} from "lucide-react";
import { Link } from "react-router-dom";

const UserUniversityList = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/universities");
      const result = await response.json();
      setUniversities(result.data || []);
    } catch (err) {
      console.error("Error fetching universities", err);
    } finally {
      setLoading(false);
    }
  };

  const countries = ["All", ...new Set(universities.map(u => u.Country).filter(Boolean))];

  const filteredUnis = universities.filter(uni => {
    const searchMatch = uni.University?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        uni.City?.toLowerCase().includes(searchTerm.toLowerCase());
    const countryMatch = selectedCountry === "All" || uni.Country === selectedCountry;
    return searchMatch && countryMatch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Explore Universities</h1>
          <p className="text-slate-500 font-medium mt-1">Discover your future at world-class institutions.</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search universities, cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-[1.5rem] py-4 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select 
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl py-4 pl-10 pr-10 text-sm font-bold appearance-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm cursor-pointer min-w-[160px]"
            >
              {countries.map(c => <option key={c} value={c}>{c === "All" ? "All Countries" : c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-[2.5rem] h-[400px] animate-pulse border border-slate-100 shadow-sm"></div>
            ))
          ) : filteredUnis.map((uni, idx) => (
            <motion.div 
              key={uni._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500 flex flex-col overflow-hidden"
            >
              {/* Cover */}
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img 
                  src={uni.Cover || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop"} 
                  alt="" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => e.target.src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop"}
                />
                <div className="absolute top-4 right-4">
                  <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-rose-500 transition-all">
                    <Heart size={18} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-800 border border-white/20">
                    QS Rank #{uni.QSWorldRank || "N/A"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{uni.University}</h3>
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs mt-2 uppercase tracking-wide">
                      <MapPin size={12} className="text-indigo-500" />
                      {uni.City}, {uni.Country}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 p-2 shadow-sm shrink-0 flex items-center justify-center">
                    <img 
                      src={uni.Logo || "https://cdn-icons-png.flaticon.com/512/167/167707.png"} 
                      alt="" 
                      className="w-full h-full object-contain"
                      onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/167/167707.png"}
                    />
                  </div>
                </div>

                <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-6 leading-relaxed flex-1">
                  {uni.Description || "Explore world-class programs and research opportunities at this prestigious institution."}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <TrendingUp size={14} />
                    </div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Growth Track</span>
                  </div>
                  <Link 
                    to={`/uni/${uni._id}`}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-indigo-600 transition-all shadow-lg shadow-black/5"
                  >
                    View Portal <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!loading && filteredUnis.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
           <Building2 size={48} className="text-slate-200 mx-auto mb-4" />
           <p className="text-slate-500 font-bold">No universities matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default UserUniversityList;
