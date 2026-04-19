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
  FaTimesCircle
} from "react-icons/fa";
import { MdDescription, MdOndemandVideo } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

export const SingleUni = () => {
  const { id } = useParams();
  const location = useLocation();
  const [university, setUniversity] = useState(null);
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

  // Fetch university data
  useEffect(() => {
    const fetchSingleUniversity = async () => {
      try {
        const { data } = await axios.get(`/api/universities/${id}`);
        setUniversity(data.data);
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

      console.log("RAW favorites response:", response.data); // 👈 check console

      // ✅ Handle any shape the API returns
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
      console.error("Error fetching favorites:", error.response?.data || error.message);
      setFavorites([]); // ✅ always keep array even on error
    }
  }, []);

  useEffect(() => {
    if (user) fetchFavorites();
  }, [user, fetchFavorites]);

  // ✅ Safe isFavorite with array guard + all field name variants
  const isFavorite = Array.isArray(favorites) && favorites.some(
    (fav) =>
      fav.universityId === university?._id ||
      fav.universityId?._id === university?._id ||
      fav.university === university?._id ||
      fav.university?._id === university?._id
  );

  // Add favorite
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
      console.error("Error adding favorite:", error.response?.data || error.message);
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

  // Remove favorite
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
      console.error("Error removing favorite:", error.response?.data || error.message);
      showToast("Failed to remove favorite. Please try again.", "error");
    } finally {
      setFavLoading(false);
      setClickCount(0);
    }
  };

  // Handle single vs double click
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

  // Reset click count after 3s
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* ✅ Toast Notification */}
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
      <div className="relative h-64 md:h-80 rounded-t-xl overflow-hidden">
        <img
          src={university.Cover}
          alt="University Cover"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-end p-6">
          <div className="text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{university.University}</h1>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <FaMapMarkerAlt className="mr-1" />
                {university.City}, {university.Country}
              </span>
              {university.CountryRank && (
                <span className="flex items-center">
                  <FaTrophy className="mr-1" />
                  #{university.CountryRank} in Country
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="absolute top-4 left-4 md:top-6 md:left-6 w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
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

      {/* University Name + Favorite Button */}
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold text-gray-800">{university.University}</h2>

        {/* ✅ Favorite Button */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={handleFavClick}
            disabled={favLoading}
            className={`relative inline-flex items-center px-6 py-2.5 rounded-full shadow-md font-medium transition-all duration-300
              ${favLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              ${isFavorite
                ? clickCount === 1
                  ? "bg-red-600 text-white ring-4 ring-red-300 ring-offset-1 scale-105"
                  : "bg-red-500 text-white"
                : "bg-red-100 text-red-600 hover:bg-red-200"
              }`}
          >
            {isFavorite && clickCount === 1 && (
              <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-30" />
            )}
            {favLoading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : isFavorite ? (
              <FaHeart className="mr-2" />
            ) : (
              <FaRegHeart className="mr-2" />
            )}
            {favLoading
              ? "Updating..."
              : isFavorite
                ? clickCount === 1
                  ? "Click again to remove ✕"
                  : "Saved to Favorites"
                : "Add to Favorites"}
          </motion.button>

          <AnimatePresence>
            {isFavorite && clickCount === 0 && !favLoading && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-gray-400"
              >
                Double-click to remove
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {university.QSWorldRank && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
              <FaTrophy className="mr-1" /> QS World Rank: #{university.QSWorldRank}
            </span>
          )}
          {university.CountryRank && (
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center">
              <FaTrophy className="mr-1" /> Country Rank: #{university.CountryRank}
            </span>
          )}
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
            <FaUniversity className="mr-1" /> {university.Type}
          </span>
        </div>
      </div>

      {/* Video */}
      {university.IntroVideo && (
        <div className="mt-8">
          {showVideo ? (
            <div className="relative pt-4 h-96 rounded-lg overflow-hidden">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={university.IntroVideo}
                title={`${university.University} Introduction Video`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-2 right-2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 z-10"
              >
                Close
              </button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowVideo(true)}
              className="w-full bg-gray-100 hover:bg-gray-200 p-4 rounded-lg flex items-center justify-center gap-2 text-gray-700 transition-colors"
            >
              <MdOndemandVideo className="text-xl" />
              <span>Watch University Introduction Video</span>
            </motion.button>
          )}
        </div>
      )}

      {/* Description */}
      <div className="mt-8 space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-3 text-gray-700">
            <MdDescription className="text-xl mr-2" />
            <h3 className="text-lg font-semibold">About the University</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">{university.Description}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <Link to={location.pathname.startsWith("/dashboard")
          ? `/dashboard/university/${university._id}/courses`
          : `/courses/${university.UniversityCode}`}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors"
          >
            View Courses
          </motion.button>
        </Link>
        <Link to={location.pathname.startsWith("/dashboard")
          ? `/dashboard/university/${university._id}/scholarships`
          : `/uni/${university._id}/scholarships`}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md"
          >
            View Scholarships
          </motion.button>
        </Link>
        {university.InternationalStudentLink && (
          <motion.a
            whileHover={{ scale: 1.05 }}
            href={university.InternationalStudentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-colors flex items-center"
          >
            <FaGraduationCap className="mr-2" />
            University link
            <FaExternalLinkAlt className="ml-2 text-xs" />
          </motion.a>
        )}
      </div>

      {/* Socials */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">Connect With Us</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {university.Facebook && (
            <motion.a whileHover={{ scale: 1.05 }} href={university.Facebook} target="_blank" rel="noopener noreferrer"
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors">
              <FaFacebook className="mr-2" /> Facebook
            </motion.a>
          )}
          {university.Twitter && (
            <motion.a whileHover={{ scale: 1.05 }} href={university.Twitter} target="_blank" rel="noopener noreferrer"
              className="flex items-center bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md transition-colors">
              <FaTwitter className="mr-2" /> Twitter
            </motion.a>
          )}
          {university.Instagram && (
            <motion.a whileHover={{ scale: 1.05 }} href={university.Instagram} target="_blank" rel="noopener noreferrer"
              className="flex items-center bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors">
              <FaInstagram className="mr-2" /> Instagram
            </motion.a>
          )}
          {university.LinkedIn && (
            <motion.a whileHover={{ scale: 1.05 }} href={university.LinkedIn} target="_blank" rel="noopener noreferrer"
              className="flex items-center bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow-md transition-colors">
              <FaLinkedin className="mr-2" /> LinkedIn
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};