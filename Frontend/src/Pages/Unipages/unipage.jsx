import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, Globe, Award, ExternalLink,
  Facebook, Twitter, Linkedin, Youtube, Instagram,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, BookOpen, Building2, TrendingUp
} from 'lucide-react';

export default function UniversityListing() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // 3x3 grid

  useEffect(() => {
    fetchUniversities();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCountry]);

  const fetchUniversities = async () => {
    try {
      const response = await fetch('/api/universities');
      if (!response.ok) throw new Error('Failed to fetch universities');
      const result = await response.json();
      const uniArray = Array.isArray(result) ? result : Array.isArray(result.data) ? result.data : [];
      setUniversities(uniArray);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const countries = ['All', ...new Set(universities.map(u => u.Country).filter(Boolean))];

  const filteredUniversities = universities.filter(uni => {
    const searchMatch = uni.University?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        uni.City?.toLowerCase().includes(searchTerm.toLowerCase());
    const countryMatch = selectedCountry === 'All' || uni.Country === selectedCountry;
    return searchMatch && countryMatch;
  });

  const totalPages = Math.ceil(filteredUniversities.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUniversities = filteredUniversities.slice(startIndex, startIndex + itemsPerPage);

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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-slate-200"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 rounded w-full"></div>
          <div className="h-3 bg-slate-200 rounded w-5/6"></div>
        </div>
        <div className="pt-4 flex justify-between items-center">
          <div className="h-8 bg-slate-200 rounded-full w-24"></div>
          <div className="h-8 bg-slate-200 rounded-full w-8"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Hero Section */}
      <div className="bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')] opacity-20 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-24 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 text-indigo-300 font-medium text-sm mb-4 border border-indigo-500/30 backdrop-blur-sm">
            Global Network
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Discover Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Universities</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Find the perfect institution to ignite your academic journey. Explore prestigious universities across the globe.
          </p>

          {/* Search & Filter Bar */}
          <div className="max-w-3xl mx-auto bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/20 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search universities or cities..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white rounded-xl pl-12 pr-4 py-3.5 text-slate-900 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
            </div>
            <div className="relative sm:w-64">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
              <select
                value={selectedCountry}
                onChange={e => setSelectedCountry(e.target.value)}
                className="w-full bg-white rounded-xl pl-12 pr-10 py-3.5 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
              >
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100 flex flex-col items-center">
            <p className="font-semibold mb-4 text-lg">Error loading universities: {error}</p>
            <button onClick={fetchUniversities} className="bg-red-600 text-white px-6 py-2.5 rounded-xl hover:bg-red-700 transition">Try Again</button>
          </div>
        ) : loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : currentUniversities.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-700 mb-2">No Universities Found</h3>
            <p className="text-slate-500">We couldn't find anything matching your search criteria.</p>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedCountry('All');}} 
              className="mt-6 text-indigo-600 font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            {/* Results Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentUniversities.map((uni) => (
                <div key={uni._id} className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  
                  {/* Image Header */}
                  <div className="relative h-56 bg-slate-100 overflow-hidden">
                    {uni.Cover ? (
                      <img 
                        src={uni.Cover} 
                        alt={uni.University} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Building2 className="w-16 h-16 text-white/50" />
                      </div>
                    )}
                    
                    {/* Floating Badges */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      {uni.QSWorldRank && (
                        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1.5 border border-white/20">
                          <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                          QS #{uni.QSWorldRank}
                        </div>
                      )}
                      {uni.CountryRank && (
                        <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1.5 border border-white/10">
                          <Award className="w-3.5 h-3.5 text-indigo-400" />
                          Rank #{uni.CountryRank}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h2 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                        {uni.University}
                      </h2>
                      {uni.Logo && (
                        <img 
                          src={uni.Logo} 
                          alt="logo" 
                          className="w-10 h-10 rounded-lg object-contain bg-white shadow-sm border border-slate-100 p-1 flex-shrink-0" 
                          onError={(e) => {
                            e.target.src = "https://cdn-icons-png.flaticon.com/512/167/167707.png";
                          }}
                        />
                      )}
                    </div>
                    
                    <div className="flex items-center text-slate-500 text-sm mb-4 font-medium">
                      <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                      {uni.City}, {uni.Country}
                    </div>

                    <p className="text-slate-600 text-sm line-clamp-3 mb-6 leading-relaxed">
                      {uni.Description || "No description available for this university. Visit their website to learn more about their programs and campus life."}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                      {/* Socials */}
                      <div className="flex gap-2">
                        {[
                          { url: uni.Facebook, icon: Facebook },
                          { url: uni.Twitter, icon: Twitter },
                          { url: uni.LinkedIn, icon: Linkedin },
                          { url: uni.Instagram, icon: Instagram }
                        ].map((social, idx) => social.url ? (
                          <a key={idx} href={social.url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                            <social.icon className="w-4 h-4" />
                          </a>
                        ) : null)}
                      </div>

                      <div className="flex gap-2">
                        {uni.InternationalStudentLink && (
                          <a href={uni.InternationalStudentLink} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors tooltip" title="Visit Website">
                            <Globe className="w-5 h-5" />
                          </a>
                        )}
                        <Link to={`/uni/${uni._id}`} className="bg-slate-900 hover:bg-indigo-600 text-white p-2 rounded-xl transition-all shadow-sm flex items-center justify-center">
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Premium Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-30 transition-all bg-white shadow-sm">
                  <ChevronsLeft className="w-5 h-5" />
                </button>
                <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-30 transition-all bg-white shadow-sm">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="hidden sm:flex items-center gap-2 px-2">
                  {getPageNumbers().map((page, i) => (
                    page === '...' ? (
                      <span key={i} className="px-2 text-slate-400">...</span>
                    ) : (
                      <button key={i} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-xl font-medium transition-all shadow-sm ${currentPage === page ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-200' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-600 hover:text-indigo-600'}`}>
                        {page}
                      </button>
                    )
                  ))}
                </div>

                <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-30 transition-all bg-white shadow-sm">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-30 transition-all bg-white shadow-sm">
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