import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "../../api/axios.js";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaTrophy,
  FaMapMarkerAlt,
  FaUniversity,
  FaSpinner,
  FaHeart,
  FaRegHeart,
  FaExternalLinkAlt,
  FaGraduationCap,
  FaCheckCircle,
  FaTimesCircle,
  FaBookOpen,
  FaMoneyBillWave,
  FaClock
} from "react-icons/fa";
import { MdDescription, MdOndemandVideo } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

export const SingleUni = () => {
  const { id } = useParams();
  const location = useLocation();
  const [university, setUniversity] = useState(null);
  const [courses, setCourses] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showVideo, setShowVideo] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [clickCount, setClickCount] = useState(0);

  // Show toast helper
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Extract user info from JWT token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  // Fetch university data + related
  useEffect(() => {
    const fetchSingleUniversity = async () => {
      try {
        const { data } = await axios.get(`/api/universities/${id}`);
        setUniversity(data.data);

        if (data.data) {
           const [courseRes, scholarRes] = await Promise.allSettled([
             axios.get(`/api/courses/university/${data.data.UniversityCode}`),
             axios.get(`/api/scholarships/university/${data.data._id}`)
           ]);
           
           if (courseRes.status === "fulfilled") {
             setCourses(courseRes.value.data?.data || []);
           }
           if (scholarRes.status === "fulfilled") {
             setScholarships(scholarRes.value.data?.data || scholarRes.value.data?.scholarships || []);
           }
        }

      } catch (err) {
        setError("Failed to fetch university data");
      } finally {
        setLoading(false);
      }
    };
    fetchSingleUniversity();
  }, [id]);

  // Fetch favorites
  const fetchFavorites = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.get("/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;
      if (Array.isArray(data)) {
        setFavorites(data);
      } else if (Array.isArray(data?.favorites)) {
        setFavorites(data.favorites);
      } else if (Array.isArray(data?.data)) {
        setFavorites(data.data);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    if (user) fetchFavorites();
  }, [user, fetchFavorites]);

  const isFavorite = Array.isArray(favorites) && favorites.some(
    (fav) =>
      fav.universityId === university?._id ||
      fav.universityId?._id === university?._id ||
      fav.university === university?._id ||
      fav.university?._id === university?._id
  );

  const addFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please log in to add favorites", "error");
      return;
    }
    setFavLoading(true);
    try {
      await axios.post(
        "/api/favorites",
        { universityId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchFavorites();
      showToast(`${university?.University} added to favorites! 🎉`, "success");
    } catch (error) {
      if (error.response?.data?.message === "Already in favorites") {
        await fetchFavorites();
        showToast("Already in your favorites!", "info");
      } else {
        showToast("Failed to add favorite. Please try again.", "error");
      }
    } finally {
      setFavLoading(false);
    }
  };

  const removeFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please log in to manage favorites", "error");
      return;
    }
    setFavLoading(true);
    try {
      await axios.delete("/api/favorites", {
        data: { universityId: id },
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchFavorites();
      showToast(`${university?.University} removed from favorites`, "error");
    } catch (error) {
      showToast("Failed to remove favorite. Please try again.", "error");
    } finally {
      setFavLoading(false);
      setClickCount(0);
    }
  };

  const handleFavClick = () => {
    if (!isFavorite) {
      addFavorite();
      return;
    }
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount === 1) {
      showToast("Click again to remove from favorites", "info");
    } else if (newCount >= 2) {
      removeFavorite();
    }
  };

  useEffect(() => {
    if (clickCount === 1) {
      const timer = setTimeout(() => setClickCount(0), 3000);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );

  if (error)
    return <div className="text-red-500 text-center mt-6 text-lg font-medium">{error}</div>;

  if (!university)
    return <div className="text-center mt-6 text-lg text-gray-600">No data available for this university</div>;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto p-4 md:p-6 bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden"
      >
        <AnimatePresence>
          {toast && (
            <motion.div
              key="toast"
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.3 }}
              className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-full shadow-lg text-white text-sm font-medium
                ${toast.type === "success"
                  ? "bg-green-500"
                  : toast.type === "info"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
            >
              {toast.type === "success" && <FaCheckCircle />}
              {toast.type === "error" && <FaTimesCircle />}
              {toast.type === "info" && <FaHeart />}
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* University Cover */}
        <div className="relative h-72 md:h-96 rounded-[2rem] overflow-hidden">
          <img
            src={university.Cover}
            alt="University Cover"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
            <div className="text-white w-full">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">{university.University}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-slate-200 font-medium">
                    <span className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-indigo-400" />
                      {university.City}, {university.Country}
                    </span>
                    {university.CountryRank && (
                      <span className="flex items-center">
                        <FaTrophy className="mr-2 text-yellow-400" />
                        #{university.CountryRank} in Country
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Favorite Button Overlay */}
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  onClick={handleFavClick}
                  disabled={favLoading}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg backdrop-blur-md border ${
                    favLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  } ${
                    isFavorite
                      ? clickCount === 1
                        ? "bg-rose-600 border-rose-500 text-white scale-105"
                        : "bg-rose-500/90 border-rose-400 text-white"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  {favLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : isFavorite ? (
                    <FaHeart />
                  ) : (
                    <FaRegHeart />
                  )}
                  {favLoading
                    ? "Updating..."
                    : isFavorite
                      ? clickCount === 1
                        ? "Confirm Remove"
                        : "Saved"
                      : "Save"}
                </motion.button>
              </div>
            </div>
          </div>
          <div className="absolute top-6 left-6 w-24 h-24 md:w-32 md:h-32 rounded-3xl border-4 border-white bg-white shadow-2xl overflow-hidden">
            <img
              src={university.Logo}
              alt={university.University}
              className="w-full h-full object-contain p-2"
              onError={(e) => {
                e.target.src = "https://cdn-icons-png.flaticon.com/512/167/167707.png";
              }}
            />
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mt-6 px-4">
          <div className="flex flex-wrap gap-2">
            {university.QSWorldRank && (
              <span className="bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2 rounded-xl text-sm font-bold flex items-center">
                <FaTrophy className="mr-2 text-blue-500" /> QS Rank #{university.QSWorldRank}
              </span>
            )}
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-2 rounded-xl text-sm font-bold flex items-center">
              <FaUniversity className="mr-2 text-emerald-500" /> {university.Type}
            </span>
          </div>
          {university.InternationalStudentLink && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              href={university.InternationalStudentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl shadow-md transition-colors flex items-center font-bold text-sm"
            >
              <FaGraduationCap className="mr-2" /> Official Website <FaExternalLinkAlt className="ml-2 text-[10px]" />
            </motion.a>
          )}
        </div>

        {/* Video & Description */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10 px-4">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
              <div className="flex items-center mb-4 text-slate-800">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mr-4">
                  <MdDescription className="text-xl" />
                </div>
                <h3 className="text-2xl font-black">About {university.University}</h3>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">{university.Description}</p>
            </div>
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            {university.IntroVideo && (
              <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                {showVideo ? (
                  <div className="relative pt-4 h-64 bg-black">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={university.IntroVideo}
                      title="Video"
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                    <button
                      onClick={() => setShowVideo(false)}
                      className="absolute top-2 right-2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 rounded-xl z-10"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="p-6 text-center bg-slate-900 text-white relative overflow-hidden h-64 flex flex-col items-center justify-center">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-[50px]"></div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowVideo(true)}
                      className="w-16 h-16 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-2xl relative z-10 mb-4"
                    >
                      <MdOndemandVideo className="text-3xl ml-1" />
                    </motion.button>
                    <span className="relative z-10 font-bold">Watch Campus Tour</span>
                  </div>
                )}
              </div>
            )}

            {/* Socials Box */}
            <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 text-center">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Connect</h3>
              <div className="flex justify-center gap-3">
                {university.Facebook && <a href={university.Facebook} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><FaFacebook size={20}/></a>}
                {university.Twitter && <a href={university.Twitter} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-sky-100 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all"><FaTwitter size={20}/></a>}
                {university.Instagram && <a href={university.Instagram} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all"><FaInstagram size={20}/></a>}
                {university.LinkedIn && <a href={university.LinkedIn} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all"><FaLinkedin size={20}/></a>}
              </div>
            </div>
          </div>
        </div>

        {/* Available Programs Section */}
        <div className="mt-16 px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <FaBookOpen size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Available Programs</h2>
                <p className="text-slate-500 font-medium">Explore top courses offered at {university.University}</p>
              </div>
            </div>
            {courses.length > 3 && (
              <Link 
                to={location.pathname.startsWith("/dashboard") 
                  ? `/dashboard/university/${university._id}/courses` 
                  : `/courses/${university.UniversityCode}`
                }
                className="px-6 py-3 bg-white border border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600 rounded-xl font-bold transition-all shadow-sm hidden md:block"
              >
                View All {courses.length} Courses
              </Link>
            )}
          </div>

          {courses.length === 0 ? (
            <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-10 text-center">
              <p className="text-slate-500 font-bold">No courses published for this university yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 3).map((course) => (
                <div key={course._id} className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-xl hover:border-blue-200 transition-all group">
                  <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg mb-3">
                    {course.Level || "Degree"}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {course.CourseName}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm font-medium text-slate-600">
                      <FaMoneyBillWave className="w-4 h-4 mr-3 text-emerald-500" />
                      {course.TuitionFee || `$${course.TotalFee?.toLocaleString()}` || "N/A"}
                    </div>
                    <div className="flex items-center text-sm font-medium text-slate-600">
                      <FaClock className="w-4 h-4 mr-3 text-amber-500" />
                      {course.Duration || "Not specified"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {courses.length > 3 && (
            <div className="mt-6 md:hidden">
              <Link 
                to={`/courses/${university.UniversityCode}`}
                className="block w-full text-center px-6 py-4 bg-blue-50 text-blue-600 rounded-2xl font-bold"
              >
                View All Courses
              </Link>
            </div>
          )}
        </div>

        {/* Scholarships Section */}
        <div className="mt-16 px-4 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <FaTrophy size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Financial Aid</h2>
                <p className="text-slate-500 font-medium">Scholarships and grants available</p>
              </div>
            </div>
            {scholarships.length > 2 && (
              <Link 
                to={location.pathname.startsWith("/dashboard") 
                  ? `/dashboard/university/${university._id}/scholarships` 
                  : `/uni/${university._id}/scholarships`
                }
                className="px-6 py-3 bg-white border border-slate-200 text-slate-700 hover:border-purple-600 hover:text-purple-600 rounded-xl font-bold transition-all shadow-sm hidden md:block"
              >
                View All {scholarships.length} Grants
              </Link>
            )}
          </div>

          {scholarships.length === 0 ? (
            <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-10 text-center">
              <p className="text-slate-500 font-bold">No active scholarships listed for this institution.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {scholarships.slice(0, 2).map((s) => (
                <div key={s._id} className="bg-gradient-to-br from-purple-900 to-slate-900 text-white rounded-[2rem] p-8 relative overflow-hidden hover:shadow-2xl hover:shadow-purple-900/30 transition-all">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/30 blur-[40px] rounded-full"></div>
                  <div className="relative z-10">
                    <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 text-purple-200 text-xs font-bold rounded-lg mb-4">
                      {s.level || s.Level || "All Levels"}
                    </span>
                    <h3 className="text-xl font-black mb-2">{s.scholarshipName || s.ScholarshipName}</h3>
                    <p className="text-purple-200 font-medium text-sm mb-6 flex items-center">
                      <FaMoneyBillWave className="mr-2" /> {s.scholarshipValue || s.ScholarshipValue}
                    </p>
                    <a 
                      href={s.link || s.Link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-white text-purple-900 px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform"
                    >
                      Apply Now <FaExternalLinkAlt size={10} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
          {scholarships.length > 2 && (
            <div className="mt-6 md:hidden">
              <Link 
                to={`/uni/${university._id}/scholarships`}
                className="block w-full text-center px-6 py-4 bg-purple-50 text-purple-600 rounded-2xl font-bold"
              >
                View All Scholarships
              </Link>
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
};