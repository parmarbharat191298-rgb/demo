import { useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch.js";
import { toyService } from "../services/toyshare.service.js";
import ToyCard from "../components/user/ToyCard.jsx";
import { Btn, PageWrap } from "../components/common/UI.jsx";

const features = [
  { icon: "✅", title: "Sanitised & Safe", desc: "Every toy is cleaned and safety-checked before delivery." },
  { icon: "🚚", title: "Home Delivery", desc: "Pick up or get delivered right to your doorstep." },
  { icon: "💰", title: "Deposit Refunded", desc: "Full security deposit back when you return the toy." },
  { icon: "⭐", title: "Premium Brands", desc: "LEGO, Barbie, Nerf and 100+ top brands available." },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { data, loading } = useFetch(() => toyService.getAll({ available: "true" }));
  const popular = data?.toys?.slice(0, 4) || [];

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{
        background: "linear-gradient(135deg,#FF6B9D 0%,#C06C84 50%,#7B90FF 100%)",
        padding: "80px clamp(16px,6vw,80px) 100px",
        textAlign: "center", color: "#fff",
      }}>
        <div className="fade-up" style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🧸</div>
          <h1 style={{ fontSize: "clamp(32px,6vw,56px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
            Rent Toys.<br />Spark Joy.
          </h1>
          <p style={{ fontSize: "clamp(15px,2.5vw,18px)", opacity: 0.9, marginBottom: 36, lineHeight: 1.6 }}>
            Premium toy rentals for your little ones — sanitised, safe and delivered to your door. Pay only for the days you need!
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn onClick={() => navigate("/browse")} variant="dark" size="lg">Browse Toys →</Btn>
            <Btn onClick={() => navigate("/register")} size="lg" style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>Create Account</Btn>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <PageWrap>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20, marginBottom: 60 }}>
          {features.map(f => (
            <div key={f.title} className="fade-up" style={{ background: "#fff", borderRadius: 18, padding: 24, textAlign: "center", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: "var(--navy)" }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* ── POPULAR TOYS ── */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h2 style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, color: "var(--navy)" }}>🔥 Popular Toys</h2>
            <Btn onClick={() => navigate("/browse")} variant="secondary">View All →</Btn>
          </div>
          {loading ? <div className="spinner" /> : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
              {popular.map(t => <ToyCard key={t._id} toy={t} />)}
            </div>
          )}
        </div>

        {/* ── HOW IT WORKS ── */}
        <div style={{ background: "linear-gradient(135deg,#1A1A2E,#0F3460)", borderRadius: 24, padding: "48px 32px", marginBottom: 60, color: "#fff", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(20px,4vw,30px)", fontWeight: 800, marginBottom: 40 }}>How ToyShare Works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 32 }}>
            {[
              ["1️⃣", "Browse & Pick", "Choose from 100+ premium toys by age, category or brand."],
              ["2️⃣", "Book & Pay", "Select rental days and pay via wallet, UPI or card."],
              ["3️⃣", "Play & Enjoy", "Get the toy delivered. Kids play, parents relax!"],
              ["4️⃣", "Return & Refund", "Return the toy and get your full deposit back."],
            ].map(([num, t, d]) => (
              <div key={t}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{num}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{t}</h3>
                <p style={{ fontSize: 13, opacity: 0.7, lineHeight: 1.5 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </PageWrap>
    </div>
  );
}
