const isProd = !window.location.hostname.includes("localhost");

export const API_BASE_URL = isProd 
  ? "https://uniyatra.onrender.com" 
  : (import.meta.env.VITE_API_URL || "http://localhost:5001");

export const SOCKET_URL = isProd 
  ? "https://uniyatra.onrender.com" 
  : (import.meta.env.VITE_SOCKET_URL || "http://localhost:5001");
