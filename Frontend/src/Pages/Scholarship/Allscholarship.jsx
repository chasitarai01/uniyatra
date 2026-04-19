import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, GraduationCap, Globe, BookOpen, Banknote, MapPin, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Award, ExternalLink } from "lucide-react";

export default function AllScholarship() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedFaculty, setSelectedFaculty] = useState("All");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchScholarships();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCountry, selectedLevel, selectedFaculty]);

  const fetchScholarships = async () => {
    try {
      const res = await axios.get("/api/scholarships");
      if (res.data.success && Array.isArray(res.data.scholarships)) {
        setScholarships(res.data.scholarships);
      } else {
        setScholarships([]);
      }
    } catch (err) {
      setError("Failed to load scholarships");
    } finally {
      setLoading(false);
    }
  };

  const countries = ["All", ...new Set(scholarships.map(s => s.country || s.Country).filter(Boolean))].sort();
  const levels = ["All", ...new Set(scholarships.map(s => s.level || s.Level).filter(Boolean))].sort();
  const faculties = ["All", ...new Set(scholarships.map(s => s.faculty || s.Faculty).filter(Boolean))].sort();

  const filteredScholarships = scholarships.filter(s => {
    const sName = s.scholarshipName || s.ScholarshipName || "";
    const sUni = s.university || s.University || "";
    const sFac = s.faculty || s.Faculty || "";
    const sCoun = s.country || s.Country || "";
    const sLev = s.level || s.Level || "";

    const searchMatch = sName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        sUni.toLowerCase().includes(searchTerm.toLowerCase());
    
    const countryMatch = selectedCountry === "All" || sCoun === selectedCountry;
    const levelMatch = selectedLevel === "All" || sLev === selectedLevel;
    const facultyMatch = selectedFaculty === "All" || sFac === selectedFaculty;

    return searchMatch && countryMatch && levelMatch && facultyMatch;
  });

  const totalPages = Math.ceil(filteredScholarships.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentScholarships = filteredScholarships.slice(startIndex, startIndex + itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-pulse flex flex-col h-[400px]">
      <div className="h-24 bg-slate-200"></div>
      <div className="p-6 space-y-4 flex-1">
        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        <div className="space-y-3 pt-4">
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
        </div>
      </div>
      <div className="p-6 pt-0 mt-auto">
        <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Hero Section */}
      <div className="bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-slate-900/90 mix-blend-multiply"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-24 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-purple-500/20 text-purple-300 font-medium text-sm mb-4 border border-purple-500/30 backdrop-blur-sm">
            Financial Aid
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Fund Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Education</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Discover thousands of scholarships designed to help you achieve your dreams without the financial burden.
          </p>

          {/* Search & Filter Bar */}
          <div className="max-w-4xl mx-auto bg-white/10 p-2 rounded-3xl backdrop-blur-md border border-white/20 flex flex-col lg:flex-row gap-2">
            
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search scholarship or university..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
              />
            </div>
            
            {/* Dropdowns */}
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedCountry}
                onChange={e => setSelectedCountry(e.target.value)}
                className="bg-white rounded-2xl px-4 py-3.5 text-slate-900 outline-none focus:ring-2 focus:ring-purple-500 sm:w-40 appearance-none font-medium"
              >
                {countries.map(c => <option key={c} value={c}>{c === "All" ? "All Countries" : c}</option>)}
              </select>
              
              <select
                value={selectedLevel}
                onChange={e => setSelectedLevel(e.target.value)}
                className="bg-white rounded-2xl px-4 py-3.5 text-slate-900 outline-none focus:ring-2 focus:ring-purple-500 sm:w-40 appearance-none font-medium"
              >
                {levels.map(l => <option key={l} value={l}>{l === "All" ? "All Levels" : l}</option>)}
              </select>

              <select
                value={selectedFaculty}
                onChange={e => setSelectedFaculty(e.target.value)}
                className="bg-white rounded-2xl px-4 py-3.5 text-slate-900 outline-none focus:ring-2 focus:ring-purple-500 sm:w-44 appearance-none font-medium"
              >
                {faculties.map(f => <option key={f} value={f}>{f === "All" ? "All Faculties" : f}</option>)}
              </select>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100 flex flex-col items-center">
            <p className="font-semibold mb-4 text-lg">{error}</p>
            <button onClick={fetchScholarships} className="bg-red-600 text-white px-6 py-2.5 rounded-xl hover:bg-red-700 transition">Try Again</button>
          </div>
        ) : loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : currentScholarships.length === 0 ? (
          <div className="text-center py-20">
            <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-700 mb-2">No Scholarships Found</h3>
            <p className="text-slate-500">Try adjusting your filters or search term.</p>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedCountry('All'); setSelectedFaculty('All'); setSelectedLevel('All');}} 
              className="mt-6 text-purple-600 font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-slate-800">
                {filteredScholarships.length} Available Scholarships
              </h2>
            </div>

            {/* Results Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentScholarships.map((s) => {
                const sName = s.scholarshipName || s.ScholarshipName;
                const sUni = s.university || s.University;
                const sVal = s.scholarshipValue || s.ScholarshipValue;
                const sCoun = s.country || s.Country;
                const sFac = s.faculty || s.Faculty;
                const sLev = s.level || s.Level;
                const sLink = s.link || s.Link;

                return (
                  <div key={s._id} className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col relative">
                    
                    {/* Top Accent Bar */}
                    <div className="h-2 w-full bg-gradient-to-r from-purple-500 to-pink-500 absolute top-0 left-0"></div>

                    {/* Card Header */}
                    <div className="p-6 pb-4 border-b border-slate-100 mt-2">
                      <div className="inline-block px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg mb-3">
                        {sLev}
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-purple-600 transition-colors mb-1">
                        {sName}
                      </h2>
                      <div className="flex items-center text-slate-500 text-sm font-medium">
                        <GraduationCap className="w-4 h-4 mr-1.5" />
                        {sUni}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-1 flex flex-col gap-4">
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <Banknote className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Value</p>
                          <p className="text-sm font-semibold text-slate-800">{sVal}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Faculty</p>
                          <p className="text-sm font-medium text-slate-700">{sFac}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Location</p>
                          <p className="text-sm font-medium text-slate-700">{sCoun}</p>
                        </div>
                      </div>
                      
                    </div>

                    {/* Card Footer */}
                    <div className="p-6 pt-0 mt-auto">
                      <a href={sLink} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-purple-600 text-white py-3 rounded-xl font-medium transition-colors">
                        View & Apply <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 border border-slate-200 hover:border-purple-600 hover:text-purple-600 disabled:opacity-30 transition-all bg-white shadow-sm">
                  <ChevronsLeft className="w-5 h-5" />
                </button>
                <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 border border-slate-200 hover:border-purple-600 hover:text-purple-600 disabled:opacity-30 transition-all bg-white shadow-sm">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="hidden sm:flex items-center gap-2 px-2">
                  {getPageNumbers().map((page, i) => (
                    page === '...' ? (
                      <span key={i} className="px-2 text-slate-400">...</span>
                    ) : (
                      <button key={i} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-xl font-medium transition-all shadow-sm ${currentPage === page ? 'bg-purple-600 text-white border-purple-600 shadow-purple-200' : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-600 hover:text-purple-600'}`}>
                        {page}
                      </button>
                    )
                  ))}
                </div>

                <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 border border-slate-200 hover:border-purple-600 hover:text-purple-600 disabled:opacity-30 transition-all bg-white shadow-sm">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 border border-slate-200 hover:border-purple-600 hover:text-purple-600 disabled:opacity-30 transition-all bg-white shadow-sm">
                  <ChevronsRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
