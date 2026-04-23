import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { userService } from "../services/toyshare.service.js";
import { Btn, Input, PageWrap } from "../components/common/UI.jsx";

export default function ProfilePage() {
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing]     = useState(false);
  const [name, setName]           = useState(user?.name || "");
  const [phone, setPhone]         = useState(user?.phone || "");
  const [walletAmt, setWalletAmt] = useState("");
  const [saving, setSaving]       = useState(false);
  const [addingWallet, setAddingWallet] = useState(false);
  const [msg, setMsg]             = useState("");

  const saveProfile = async () => {
    setSaving(true);
    try {
      await userService.updateProfile({ name, phone });
      await refreshUser();
      setEditing(false);
      setMsg("Profile updated!");
      setTimeout(() => setMsg(""), 3000);
    } finally { setSaving(false); }
  };

  const addWallet = async () => {
    if (!walletAmt || Number(walletAmt) < 1) return;
    setAddingWallet(true);
    try {
      await userService.addWallet(Number(walletAmt));
      await refreshUser();
      setWalletAmt("");
      setMsg(`₹${walletAmt} added to wallet!`);
      setTimeout(() => setMsg(""), 3000);
    } finally { setAddingWallet(false); }
  };

  return (
    <PageWrap>
      <h1 style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, color: "var(--navy)", marginBottom: 28 }}>👤 My Profile</h1>

      {msg && <div style={{ background: "#E8F5E9", borderRadius: 12, padding: "12px 18px", marginBottom: 20, color: "#2E7D32", fontWeight: 600, fontSize: 14 }}>✅ {msg}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }} className="profile-grid">
        {/* Profile Card */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid var(--border)" }}>
          {/* Avatar */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#FF6B9D,#C06C84)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 34, margin: "0 auto 12px", border: "4px solid var(--border)" }}>
              {user?.name?.[0]}
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--navy)", marginBottom: 2 }}>{user?.name}</h2>
            <p style={{ color: "var(--muted)", fontSize: 13 }}>{user?.email}</p>
          </div>

          {/* Edit Form */}
          {editing ? (
            <div>
              <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} />
              <Input label="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
              <div style={{ display: "flex", gap: 10 }}>
                <Btn onClick={saveProfile} disabled={saving} style={{ flex: 1, justifyContent: "center" }}>{saving ? "Saving…" : "💾 Save"}</Btn>
                <Btn onClick={() => setEditing(false)} variant="secondary" style={{ flex: 1, justifyContent: "center" }}>Cancel</Btn>
              </div>
            </div>
          ) : (
            <div>
              {[["Email", user?.email, "✉️"], ["Phone", user?.phone || "Not set", "📱"], ["Role", user?.role === "admin" ? "Admin" : "Customer", "🎭"]].map(([l, v, icon]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--bg)", fontSize: 14 }}>
                  <span style={{ color: "var(--muted)", fontWeight: 500 }}>{icon} {l}</span>
                  <span style={{ fontWeight: 700, color: "var(--navy)" }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <Btn onClick={() => setEditing(true)} variant="secondary" style={{ flex: 1, justifyContent: "center" }}>✏️ Edit Profile</Btn>
                {user?.role === "admin" && (
                  <Btn onClick={() => navigate("/admin")} variant="dark" style={{ flex: 1, justifyContent: "center" }}>⚙️ Admin Panel</Btn>
                )}
              </div>
              <Btn onClick={() => { logout(); navigate("/"); }} variant="danger" style={{ width: "100%", justifyContent: "center", marginTop: 10 }}>Logout</Btn>
            </div>
          )}
        </div>

        {/* Wallet + Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Wallet */}
          <div style={{ background: "linear-gradient(135deg,#FF6B9D,#C06C84)", borderRadius: 20, padding: 24, color: "#fff" }}>
            <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.85, marginBottom: 6 }}>💰 WALLET BALANCE</div>
            <div style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>₹{user?.wallet}</div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input type="number" value={walletAmt} onChange={e => setWalletAmt(e.target.value)} placeholder="Enter amount"
                style={{ flex: 1, padding: "9px 14px", borderRadius: 10, border: "none", fontSize: 14, outline: "none", color: "var(--navy)" }} />
              <button onClick={addWallet} disabled={addingWallet}
                style={{ background: "#fff", color: "var(--pink)", border: "none", padding: "9px 18px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                {addingWallet ? "…" : "+ Add"}
              </button>
            </div>
          </div>

          {/* Points */}
          <div style={{ background: "#FFF9E6", border: "2px solid #FFD700", borderRadius: 18, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#7A6000", marginBottom: 4 }}>🌟 REWARD POINTS</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#F59E0B" }}>{user?.points}</div>
            <div style={{ fontSize: 12, color: "#7A6000", marginTop: 4 }}>Earn 1 point for every ₹10 spent on rentals</div>
          </div>

          {/* Quick Links */}
          <div style={{ background: "#fff", borderRadius: 18, padding: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid var(--border)" }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "var(--navy)", marginBottom: 14 }}>Quick Actions</div>
            {[["📋 View My Bookings", "/bookings"], ["🧸 Browse More Toys", "/browse"], ["🛒 Go to Cart", "/cart"]].map(([l, to]) => (
              <button key={l} onClick={() => navigate(to)}
                style={{ display: "block", width: "100%", textAlign: "left", background: "var(--bg)", border: "none", padding: "10px 14px", borderRadius: 10, marginBottom: 8, fontSize: 14, fontWeight: 600, color: "var(--navy)", cursor: "pointer", transition: "background 0.2s" }}
                onMouseEnter={e => e.target.style.background = "#FFE5EC"}
                onMouseLeave={e => e.target.style.background = "var(--bg)"}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .profile-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </PageWrap>
  );
}
