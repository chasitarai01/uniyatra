// Check if we're running in a browser environment
const isBrowser = typeof window !== 'undefined';
const isLocalhost = isBrowser && window.location.hostname.includes("localhost");

// In production (Vercel), we use relative URLs and let Vercel rewrites handle proxying
// In development, we use the local backend server directly
export const API_BASE_URL = isLocalhost
  ? (import.meta.env.VITE_API_URL || "http://localhost:5001")
  : ""; // Empty string means relative URLs in production (Vercel handles proxying)

export const SOCKET_URL = isLocalhost
  ? (import.meta.env.VITE_SOCKET_URL || "http://localhost:5001")
  : window.location.origin; // Use current origin in production (Vercel handles WebSocket proxying)
