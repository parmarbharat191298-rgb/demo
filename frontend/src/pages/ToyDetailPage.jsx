import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toyService } from "../services/toyshare.service.js";
import { useFetch } from "../hooks/useFetch.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Btn, Badge, PageWrap } from "../components/common/UI.jsx";

export default function ToyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [days, setDays] = useState(3);
  const [added, setAdded] = useState(false);

  const { data, loading } = useFetch(() => toyService.getById(id), [id]);
  const toy = data?.toy;

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  if (!toy) return <div style={{ textAlign: "center", padding: 80, color: "var(--muted)" }}>Toy not found</div>;

  const rental = toy.dailyRate * days;
  const total  = rental + toy.deposit;

  const handleAddToCart = () => {
    if (!user) { navigate("/login"); return; }
    addToCart(toy, days);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <PageWrap>
      <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 14, marginBottom: 24, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
        ← Back
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }} className="toy-detail-grid">
        {/* Left */}
        <div>
          <div style={{ background: "linear-gradient(135deg,#FFF0F5,#F0F4FF)", borderRadius: 24, padding: 60, textAlign: "center", fontSize: 110, marginBottom: 24 }}>
            {toy.image}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {toy.features?.map(f => (
              <span key={f} style={{ background: "#F0F4FF", color: "var(--indigo)", padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>✓ {f}</span>
            ))}
          </div>
        </div>

        {/* Right */}
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <Badge label={toy.category} />
            <Badge label={toy.stock === 0 ? "Out of Stock" : "Available"} />
          </div>

          <h1 style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, color: "var(--navy)", marginBottom: 10 }}>{toy.name}</h1>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 20, color: "#FFB300" }}>⭐</span>
            <span style={{ fontWeight: 700, fontSize: 16 }}>{toy.rating}</span>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>({toy.reviews} reviews)</span>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>· Age {toy.age}+</span>
          </div>

          <p style={{ color: "#555", fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>{toy.description}</p>

          {/* Pricing Box */}
          <div style={{ background: "var(--bg)", border: "2px solid var(--border)", borderRadius: 18, padding: 24, marginBottom: 24 }}>
            <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4, textTransform: "uppercase", fontWeight: 600 }}>Daily Rate</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--pink)" }}>₹{toy.dailyRate}</div>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4, textTransform: "uppercase", fontWeight: 600 }}>Deposit</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--indigo)" }}>₹{toy.deposit}</div>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4, textTransform: "uppercase", fontWeight: 600 }}>Stock</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: toy.stock === 0 ? "#E53935" : "#4CAF50" }}>{toy.stock}</div>
              </div>
            </div>

            {/* Days Selector */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)", display: "block", marginBottom: 8 }}>Select Rental Duration</label>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={() => setDays(d => Math.max(1, d - 1))} style={{ width: 36, height: 36, borderRadius: 10, background: "#FFE5EC", color: "var(--pink)", border: "none", fontSize: 20, cursor: "pointer", fontWeight: 700 }}>−</button>
                <span style={{ fontSize: 20, fontWeight: 800, color: "var(--navy)", minWidth: 40, textAlign: "center" }}>{days}d</span>
                <button onClick={() => setDays(d => d + 1)} style={{ width: 36, height: 36, borderRadius: 10, background: "#FFE5EC", color: "var(--pink)", border: "none", fontSize: 20, cursor: "pointer", fontWeight: 700 }}>+</button>
              </div>
            </div>

            {/* Summary */}
            <div style={{ background: "#fff", borderRadius: 12, padding: "12px 16px", fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, color: "#555" }}>
                <span>Rental ({days} days × ₹{toy.dailyRate})</span><span>₹{rental}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#555" }}>
                <span>Security Deposit (refundable)</span><span>₹{toy.deposit}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16, color: "var(--navy)", paddingTop: 8, borderTop: "1px solid var(--border)" }}>
                <span>Total Payable</span><span style={{ color: "var(--pink)" }}>₹{total}</span>
              </div>
            </div>
          </div>

          <Btn onClick={handleAddToCart} disabled={toy.stock === 0} size="lg" style={{ width: "100%", justifyContent: "center" }}>
            {added ? "✅ Added to Cart!" : toy.stock === 0 ? "Out of Stock" : "🛒 Add to Cart"}
          </Btn>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .toy-detail-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </PageWrap>
  );
}
