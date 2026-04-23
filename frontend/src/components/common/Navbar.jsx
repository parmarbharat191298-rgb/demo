import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link to={to} onClick={() => setMenuOpen(false)} style={{
      color: isActive(to) ? "var(--white)" : "rgba(255,255,255,0.8)",
      fontWeight: isActive(to) ? 700 : 500,
      fontSize: 15,
      padding: "6px 14px",
      borderRadius: 20,
      background: isActive(to) ? "rgba(255,255,255,0.2)" : "transparent",
      transition: "all 0.2s",
    }}>{label}</Link>
  );

  return (
    <nav style={{
      background: "linear-gradient(135deg, #FF6B9D 0%, #C06C84 100%)",
      padding: "0 clamp(16px, 4vw, 48px)",
      position: "sticky", top: 0, zIndex: 100,
      boxShadow: "0 4px 30px rgba(255,107,157,0.3)",
    }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 30 }}>🧸</span>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 22, letterSpacing: "-0.5px" }}>ToyShare</span>
        </Link>

        {/* Desktop Nav */}
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {user?.role !== "admin" && navLink("/", "Home")}
          {user?.role !== "admin" && navLink("/browse", "Browse")}
          {user?.role === "user" && navLink("/bookings", "My Bookings")}
          {user?.role === "admin" && navLink("/admin", "Dashboard")}
          {user?.role === "admin" && navLink("/admin/toys", "Manage Toys")}
          {user?.role === "admin" && navLink("/admin/bookings", "Manage Bookings")}
        </div>

        {/* Right Side */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Cart */}
          {user && user.role === "user" && (
            <Link to="/cart" style={{ position: "relative", color: "#fff", fontSize: 22 }}>
              🛒
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: -6, right: -8,
                  background: "#fff", color: "var(--pink)",
                  width: 18, height: 18, borderRadius: "50%",
                  fontSize: 10, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{cartCount}</span>
              )}
            </Link>
          )}

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {user.role === "admin" && (
                <div style={{ background: "rgba(0,0,0,0.15)", color: "#fff", padding: "4px 12px", borderRadius: 12, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  ADMIN MODE
                </div>
              )}
              <Link to="/profile">
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15, border: "2px solid rgba(255,255,255,0.5)" }}>
                  {user.name[0]}
                </div>
              </Link>
              <button onClick={() => { logout(); navigate("/"); }} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", padding: "6px 14px", borderRadius: 20, fontWeight: 600, fontSize: 13 }}>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <Link to="/login" style={{ color: "#fff", fontWeight: 600, fontSize: 14, padding: "7px 16px", borderRadius: 20, border: "2px solid rgba(255,255,255,0.5)" }}>Login</Link>
              <Link to="/register" style={{ background: "#fff", color: "var(--pink)", fontWeight: 700, fontSize: 14, padding: "7px 16px", borderRadius: 20 }}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
