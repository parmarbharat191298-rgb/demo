import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Btn, Input } from "../components/common/UI.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const user = await login(email, password);
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#FF6B9D20,#7B90FF20)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="fade-up" style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <span style={{ fontSize: 40 }}>🧸</span>
            <span style={{ fontSize: 28, fontWeight: 800, color: "var(--navy)" }}>ToyShare</span>
          </Link>
          <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 8 }}>Welcome back! Sign in to continue.</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 22, padding: 32, boxShadow: "0 8px 40px rgba(255,107,157,0.15)", border: "1px solid var(--border)" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--navy)", marginBottom: 24, textAlign: "center" }}>Sign In</h2>

          <form onSubmit={handleSubmit}>
            <Input label="Email Address" name="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            <Input label="Password" name="password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required />

            {error && <div style={{ background: "#FFF0F0", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#E53935", fontWeight: 600 }}>❌ {error}</div>}

            <Btn type="submit" disabled={loading} size="lg" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
              {loading ? "Signing in…" : "Sign In →"}
            </Btn>
          </form>

          {/* Demo creds */}
          <div style={{ background: "#F0F4FF", borderRadius: 10, padding: 12, marginTop: 16, fontSize: 12 }}>
            <div style={{ fontWeight: 700, color: "var(--indigo)", marginBottom: 4 }}>🧪 Demo Accounts</div>
            <div style={{ color: "#555" }}>Admin: <strong>admin123@gmail.com</strong> / <strong>admin123</strong></div>
            <div style={{ color: "#555" }}>User: <strong>riya@gmail.com</strong> / <strong>user123</strong></div>
          </div>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--muted)" }}>
            Don't have an account? <Link to="/register" style={{ color: "var(--pink)", fontWeight: 700 }}>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
