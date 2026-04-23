import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Btn, Input } from "../components/common/UI.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError("");
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#FF6B9D20,#7B90FF20)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="fade-up" style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 40 }}>🧸</span>
            <span style={{ fontSize: 28, fontWeight: 800, color: "var(--navy)" }}>ToyShare</span>
          </Link>
          <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 8 }}>Create your account and start renting!</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 22, padding: 32, boxShadow: "0 8px 40px rgba(255,107,157,0.15)", border: "1px solid var(--border)" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--navy)", marginBottom: 24, textAlign: "center" }}>Create Account</h2>

          <form onSubmit={handleSubmit}>
            <Input label="Full Name" name="name" value={form.name} onChange={set("name")} placeholder="Riya Shah" required />
            <Input label="Email Address" name="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} placeholder="you@example.com" required />
            <Input label="Phone Number" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} placeholder="9876543210" />
            <Input label="Password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={set("password")} placeholder="Min 6 characters" required />
            <Input label="Confirm Password" name="confirm" type="password" autoComplete="new-password" value={form.confirm} onChange={set("confirm")} placeholder="Re-enter password" required />

            {error && <div style={{ background: "#FFF0F0", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#E53935", fontWeight: 600 }}>❌ {error}</div>}

            <Btn type="submit" disabled={loading} size="lg" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
              {loading ? "Creating account…" : "Create Account →"}
            </Btn>
          </form>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--muted)" }}>
            Already have an account? <Link to="/login" style={{ color: "var(--pink)", fontWeight: 700 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
