import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const NAV = [
  { to: "/admin",          icon: "📊", label: "Dashboard",   end: true },
  { to: "/admin/toys",     icon: "🧸", label: "Toy Inventory" },
  { to: "/admin/bookings", icon: "📋", label: "Bookings"     },
  { to: "/admin/users",    icon: "👥", label: "Users"        },
  { to: "/admin/revenue",  icon: "💰", label: "Revenue"      },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Sora', system-ui, sans-serif", background: "#F0F4FF" }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: collapsed ? 68 : 230, flexShrink: 0,
        background: "linear-gradient(180deg,#1A1A2E 0%,#16213E 60%,#0F3460 100%)",
        position: "sticky", top: 0, height: "100vh",
        display: "flex", flexDirection: "column",
        transition: "width 0.3s cubic-bezier(.4,0,.2,1)",
        overflow: "hidden", boxShadow: "4px 0 20px rgba(0,0,0,0.15)", zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10, minHeight: 64 }}>
          <span style={{ fontSize: 28, flexShrink: 0 }}>🧸</span>
          {!collapsed && (
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, lineHeight: 1.2 }}>ToyShare</div>
              <div style={{ color: "#7B90FF", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Admin Panel</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          {NAV.map(({ to, icon, label, end }) => (
            <NavLink key={to} to={to} end={end} style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: 10,
              padding: "11px 12px", borderRadius: 12, marginBottom: 3,
              textDecoration: "none", fontWeight: isActive ? 700 : 500,
              fontSize: 14, transition: "all 0.2s",
              background: isActive ? "linear-gradient(135deg,#7B90FF,#FF6B9D)" : "transparent",
              color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
              boxShadow: isActive ? "0 4px 14px rgba(123,144,255,0.35)" : "none",
              whiteSpace: "nowrap", overflow: "hidden",
            })}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#7B90FF,#FF6B9D)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                {user?.name?.[0]}
              </div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
                <div style={{ color: "#7B90FF", fontSize: 11 }}>Administrator</div>
              </div>
            </div>
          )}
          <button onClick={() => navigate("/")}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 10, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 8, justifyContent: collapsed ? "center" : "flex-start" }}>
            <span>🏠</span>{!collapsed && "View Site"}
          </button>
          <button onClick={() => { logout(); navigate("/login"); }}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 10, background: "rgba(255,0,0,0.1)", color: "#FF8A8A", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, justifyContent: collapsed ? "center" : "flex-start" }}>
            <span>🚪</span>{!collapsed && "Logout"}
          </button>
          <button onClick={() => setCollapsed(c => !c)}
            style={{ width: "100%", marginTop: 6, padding: "8px", borderRadius: 10, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", fontSize: 14 }}>
            {collapsed ? "▶" : "◀"}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <div style={{ background: "#fff", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", position: "sticky", top: 0, zIndex: 9, flexShrink: 0 }}>
          <div style={{ fontSize: 14, color: "var(--muted)", fontWeight: 500 }}>
            👋 Welcome back, <strong style={{ color: "var(--navy)" }}>{user?.name}</strong>
          </div>
          <div style={{ background: "#F0F4FF", padding: "6px 14px", borderRadius: 20, fontSize: 12, color: "#555", fontWeight: 500 }}>
            📅 {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
