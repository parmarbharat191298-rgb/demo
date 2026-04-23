import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { Btn, Badge } from "../common/UI.jsx";

export default function ToyCard({ toy }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!user) { navigate("/login"); return; }
    addToCart(toy, 3);
  };

  return (
    <div
      onClick={() => navigate(`/toy/${toy._id}`)}
      style={{
        background: "#fff", borderRadius: 18,
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        border: "1px solid var(--border)",
        cursor: "pointer", overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 14px 36px rgba(255,107,157,0.2)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)"; }}
    >
      {/* Emoji area */}
      <div style={{ background: "linear-gradient(135deg,#FFF0F5,#F0F4FF)", padding: 28, textAlign: "center", fontSize: 64 }}>
        {toy.image}
      </div>

      <div style={{ padding: "16px 18px" }}>
        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--navy)", lineHeight: 1.3, flex: 1, marginRight: 8 }}>{toy.name}</h3>
          <Badge label={toy.stock === 0 ? "Out of Stock" : "Available"} />
        </div>

        {/* Meta */}
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>
          {toy.category} · Age {toy.age} · ⭐ {toy.rating}
        </div>

        {/* Pricing */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <div style={{ flex: 1, background: "#FFF5F7", borderRadius: 10, padding: "8px", textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 2 }}>Per Day</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--pink)" }}>₹{toy.dailyRate}</div>
          </div>
          <div style={{ flex: 1, background: "#F8F9FF", borderRadius: 10, padding: "8px", textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 2 }}>Deposit</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--indigo)" }}>₹{toy.deposit}</div>
          </div>
        </div>

        {/* CTA */}
        <Btn onClick={handleAdd} disabled={toy.stock === 0} style={{ width: "100%", justifyContent: "center" }}>
          {toy.stock === 0 ? "Out of Stock" : "🛒 Add to Cart"}
        </Btn>
      </div>
    </div>
  );
}
