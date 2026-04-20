import React, { useEffect, useState } from "react";
import axios from "../../api/axios.js";
import { Link } from "react-router-dom";
import { Search, GraduationCap, Clock, Banknote, Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, BookOpen, Star, ArrowRight } from "lucide-react";

export default function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFaculty, selectedLevel]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("/api/courses");
      if (res.data.success && Array.isArray(res.data.data)) {
        setCourses(res.data.data);
      } else {
        setCourses([]);
      }
    } catch (err) {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const faculties = ["All", ...new Set(courses.map(c => c.Faculty).filter(Boolean))].sort();
  const levels = ["All", ...new Set(courses.map(c => c.Level).filter(Boolean))].sort();

  const filteredCourses = courses.filter(course => {
    const searchMatch = course.CourseName?.toLowerCase().includes(searchTerm.toLowerCase());
    const facultyMatch = selectedFaculty === "All" || course.Faculty === selectedFaculty;
    const levelMatch = selectedLevel === "All" || course.Level === selectedLevel;
    return searchMatch && facultyMatch && levelMatch;
  });

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage);

  // Recommendation logic: Pick top 3 courses (can be randomized or based on a specific logic)
  const recommendedCourses = courses.slice(0, 3);

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
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">

      {/* Hero Section */}
      <div className="bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-slate-900/90 mix-blend-multiply"></div>

        <div className="max-w-7xl mx-auto px-4 py-24 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 font-medium text-sm mb-4 border border-blue-500/30 backdrop-blur-sm">
            Academic Programs
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Future</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Explore thousands of degrees, diplomas, and certifications tailored for international students worldwide.
          </p>

          {/* Search & Filter Bar */}
          <div className="max-w-4xl mx-auto bg-white/10 p-2 rounded-3xl backdrop-blur-md border border-white/20 flex flex-col lg:flex-row gap-2">
            
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for a course or degree..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
            </div>

            {/* Dropdowns */}
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedLevel}
                onChange={e => setSelectedLevel(e.target.value)}
                className="bg-white rounded-2xl px-4 py-3.5 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 sm:w-40 appearance-none font-medium"
              >
                {levels.map(l => <option key={l} value={l}>{l === "All" ? "All Levels" : l}</option>)}
              </select>

              <select
                value={selectedFaculty}
                onChange={e => setSelectedFaculty(e.target.value)}
                className="bg-white rounded-2xl px-4 py-3.5 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 sm:w-44 appearance-none font-medium"
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
            <button onClick={fetchCourses} className="bg-red-600 text-white px-6 py-2.5 rounded-xl hover:bg-red-700 transition">Try Again</button>
          </div>
        ) : loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            {/* Top Recommended Section */}
            {searchTerm === "" && selectedFaculty === "All" && selectedLevel === "All" && recommendedCourses.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-500 flex items-center justify-center">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800">Recommended For You</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {recommendedCourses.map(course => (
                    <div key={course._id} className="bg-gradient-to-br from-slate-900 to-blue-900 text-white rounded-[2rem] p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform shadow-xl">
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 blur-[30px] rounded-full"></div>
                      <span className="inline-block px-3 py-1 bg-white/10 text-blue-200 text-xs font-bold rounded-lg mb-3 backdrop-blur-sm border border-white/10">
                        Top Pick
                      </span>
                      <h3 className="text-xl font-bold mb-4 line-clamp-2">{course.CourseName}</h3>
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-blue-100 text-sm">
                          <BookOpen className="w-4 h-4 mr-2" /> {course.Faculty}
                        </div>
                        <div className="flex items-center text-blue-100 text-sm">
                          <Banknote className="w-4 h-4 mr-2" /> {course.TuitionFee || `$${course.TotalFee?.toLocaleString()}` || "Fee info unavailable"}
                        </div>
                      </div>
                      <Link to={`/courses/${course.UniversityCode}`} className="inline-flex items-center text-sm font-bold text-white hover:text-blue-300 transition-colors">
                        Explore Program <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-slate-800">
                {filteredCourses.length} Available Programs
              </h2>
            </div>

            {filteredCourses.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-700 mb-2">No Courses Found</h3>
                <p className="text-slate-500">Try adjusting your filters or search term.</p>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedFaculty('All'); setSelectedLevel('All'); }}
                  className="mt-6 text-blue-600 font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                {/* Results Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {currentCourses.map((course) => (
                    <div key={course._id} className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col relative">

                      {/* Top Accent Bar */}
                      <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-cyan-500 absolute top-0 left-0"></div>

                      {/* Card Header */}
                      <div className="p-6 pb-4 border-b border-slate-100 mt-2">
                        <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg mb-3">
                          {course.Level || "Undergraduate"}
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors mb-2">
                          {course.CourseName}
                        </h2>
                        <p className="text-sm text-slate-500 font-medium">Uni Code: {course.UniversityCode}</p>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 flex-1 flex flex-col gap-4">

                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
                            <GraduationCap className="w-4 h-4 text-slate-600" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Faculty</p>
                            <p className="text-sm font-medium text-slate-700">{course.Faculty}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                            <Banknote className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Tuition Fee</p>
                            <p className="text-sm font-semibold text-slate-800">{course.TuitionFee || `$${course.TotalFee?.toLocaleString()}` || "N/A"}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-2 rounded-xl">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium">{course.Duration || "3 Years"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-2 rounded-xl">
                            <Calendar className="w-4 h-4 text-purple-500" />
                            <span className="text-sm font-medium">{course.StartDate || "Flexible"}</span>
                          </div>
                        </div>

                      </div>

                      {/* Card Footer */}
                      <div className="p-6 pt-0 mt-auto">
                        <Link to={`/courses/${course.UniversityCode}`} className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white py-3 rounded-xl font-medium transition-colors">
                          View Program Details <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 border border-slate-200 hover:border-blue-600 hover:text-blue-600 disabled:opacity-30 transition-all bg-white shadow-sm">
                      <ChevronsLeft className="w-5 h-5" />
                    </button>
                    <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 border border-slate-200 hover:border-blue-600 hover:text-blue-600 disabled:opacity-30 transition-all bg-white shadow-sm">
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="hidden sm:flex items-center gap-2 px-2">
                      {getPageNumbers().map((page, i) => (
                        page === '...' ? (
                          <span key={i} className="px-2 text-slate-400">...</span>
                        ) : (
                          <button key={i} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-xl font-medium transition-all shadow-sm ${currentPage === page ? 'bg-blue-600 text-white border-blue-600 shadow-blue-200' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-600 hover:text-blue-600'}`}>
                            {page}
                          </button>
                        )
                      ))}
                    </div>

                    <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 border border-slate-200 hover:border-blue-600 hover:text-blue-600 disabled:opacity-30 transition-all bg-white shadow-sm">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 border border-slate-200 hover:border-blue-600 hover:text-blue-600 disabled:opacity-30 transition-all bg-white shadow-sm">
                      <ChevronsRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
