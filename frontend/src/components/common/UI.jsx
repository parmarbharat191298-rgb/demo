// ─── Button ───────────────────────────────────────────────────────────────────
export function Btn({ children, onClick, variant = "primary", size = "md", disabled, style: s = {}, type = "button" }) {
  const base = { borderRadius: 12, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s", border: "none", display: "inline-flex", alignItems: "center", gap: 6, opacity: disabled ? 0.6 : 1 };
  const sizes = { sm: { padding: "7px 14px", fontSize: 13 }, md: { padding: "10px 22px", fontSize: 14 }, lg: { padding: "14px 30px", fontSize: 16 } };
  const variants = {
    primary: { background: "linear-gradient(135deg,#FF6B9D,#C06C84)", color: "#fff", boxShadow: "0 4px 14px rgba(255,107,157,0.4)" },
    secondary: { background: "#FFE5EC", color: "var(--pink)", boxShadow: "none" },
    outline: { background: "transparent", color: "var(--pink)", border: "2px solid var(--pink)", boxShadow: "none" },
    ghost: { background: "transparent", color: "var(--text)", boxShadow: "none" },
    danger: { background: "#FFF0F0", color: "#E53935", boxShadow: "none" },
    dark: { background: "var(--navy)", color: "#fff", boxShadow: "0 4px 14px rgba(26,26,46,0.3)" },
  };
  return <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...sizes[size], ...variants[variant], ...s }}>{children}</button>;
}

// ─── Badge ────────────────────────────────────────────────────────────────────
const badgeMap = {
  Active:         { bg: "#E8F5E9", color: "#2E7D32" },
  Returned:       { bg: "#E3F2FD", color: "#1565C0" },
  Overdue:        { bg: "#FFF3E0", color: "#E65100" },
  Cancelled:      { bg: "#FCE4EC", color: "#C62828" },
  Available:      { bg: "#E8F5E9", color: "#2E7D32" },
  "Out of Stock": { bg: "#FFF3E0", color: "#E65100" },
  Inactive:       { bg: "#F5F5F5", color: "#757575" },
  Admin:          { bg: "#EEF0FF", color: "#5C6BC0" },
  Customer:       { bg: "#F5F5F5", color: "#555" },
};
export function Badge({ label }) {
  const c = badgeMap[label] || { bg: "#F5F5F5", color: "#555" };
  return <span style={{ background: c.bg, color: c.color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>{label}</span>;
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, style: s = {}, hover = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid var(--border)", transform: hovered ? "translateY(-4px)" : "none", transition: "transform 0.2s, box-shadow 0.2s", boxShadow: hovered ? "0 12px 32px rgba(255,107,157,0.18)" : "0 2px 16px rgba(0,0,0,0.06)", ...s }}>
      {children}
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input({ label, error, ...props }) {
  return (
    <div style={{ marginBottom: 18 }}>
      {label && <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6 }}>{label}</label>}
      <input {...props} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `2px solid ${error ? "#E53935" : "#FFE5EC"}`, outline: "none", fontSize: 14, background: "#fff", transition: "border-color 0.2s", ...props.style }}
        onFocus={e => e.target.style.borderColor = "var(--pink)"}
        onBlur={e => e.target.style.borderColor = error ? "#E53935" : "#FFE5EC"} />
      {error && <span style={{ fontSize: 12, color: "#E53935", marginTop: 4, display: "block" }}>{error}</span>}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
export function Select({ label, options, ...props }) {
  return (
    <div style={{ marginBottom: 18 }}>
      {label && <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6 }}>{label}</label>}
      <select {...props} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid #FFE5EC", outline: "none", fontSize: 14, background: "#fff", cursor: "pointer" }}>
        {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children, width = 500 }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="slide-in" style={{ background: "#fff", borderRadius: 20, padding: 32, width: "100%", maxWidth: width, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "var(--navy)" }}>{title}</h2>
          <button onClick={onClose} style={{ background: "#F5F5F5", border: "none", width: 34, height: 34, borderRadius: 10, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon, color, bg, sub }) {
  return (
    <div style={{ background: "#fff", borderRadius: 18, padding: "22px 20px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #F0F4FF" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 11, color: "#888", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
          {sub && <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>{sub}</div>}
        </div>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{icon}</div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon = "🔍", title, message }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 60, marginBottom: 16 }}>{icon}</div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--navy)", marginBottom: 8 }}>{title}</h3>
      <p style={{ color: "var(--muted)", fontSize: 14 }}>{message}</p>
    </div>
  );
}

// ─── Page Wrapper ─────────────────────────────────────────────────────────────
export function PageWrap({ children }) {
  return <div className="fade-up" style={{ maxWidth: 1400, margin: "0 auto", padding: "32px clamp(16px,4vw,48px)" }}>{children}</div>;
}

// need useState for Card
import { useState } from "react";
