import React, { useState, useEffect } from "react";
import { GraduationCap } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.role) {
          setUserRole(user.role);
        }
      } catch (e) {
        console.error("Error parsing user from local storage");
      }
    }
  }, [location]);

  return (
    <nav style={{ background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,0.05)", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>

        {/* Logo */}
        <Link to="/home" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #4f46e5, #9333ea)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GraduationCap size={20} color="#fff" />
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#1e293b", letterSpacing: "-0.03em" }}>Uni<span style={{ color: "#4f46e5" }}>Yatra</span></span>
        </Link>
        
        {/* Public Links */}
        <div style={{ display: "flex", gap: 32, alignItems: "center", fontWeight: 600 }}>
          {[
            { label: "Home", href: "/home" },
            { label: "Universities", href: "/uni" },
            { label: "Courses", href: "/courses" },
            { label: "Scholarships", href: "/scholarship" }
          ].map((item) => (
            <Link
              key={item.href}
              to={item.href}
              style={{ 
                fontSize: 15, 
                color: location.pathname === item.href ? "#4f46e5" : "#64748b", 
                textDecoration: "none", 
                transition: "color 0.2s" 
              }}
              onMouseEnter={(e) => (e.target.style.color = "#4f46e5")}
              onMouseLeave={(e) => (e.target.style.color = location.pathname === item.href ? "#4f46e5" : "#64748b")}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Auth Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          {isLoggedIn ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ textAlign: "right", display: "none" }} className="md:block">
                <p style={{ fontSize: 12, fontWeight: 700, color: "#1e293b", margin: 0 }}>Student</p>
                <p style={{ fontSize: 10, fontWeight: 500, color: "#64748b", margin: 0 }}>Online</p>
              </div>
              <Link to={userRole === "admin" ? "/admin" : "/dashboard"} style={{
                width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #4f46e5, #9333ea)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", textDecoration: "none",
                boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)"
              }}>
                <GraduationCap size={20} />
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: 14, fontWeight: 600, color: "#64748b", textDecoration: "none" }}
                onMouseEnter={(e) => (e.target.style.color = "#4f46e5")}
                onMouseLeave={(e) => (e.target.style.color = "#64748b")}>
                Login
              </Link>
              <Link to="/register" style={{
                fontSize: 14, fontWeight: 700, color: "#4f46e5", textDecoration: "none",
                background: "#eef2ff", padding: "10px 20px", borderRadius: 8,
              }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;