import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { Btn, EmptyState, PageWrap } from "../components/common/UI.jsx";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateDays, cartTotal, depositTotal, totalAmount } = useCart();

  if (cart.length === 0) return (
    <PageWrap>
      <EmptyState icon="🛒" title="Your cart is empty" message="Browse toys and add them to your cart!" />
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Btn onClick={() => navigate("/browse")} size="lg">Browse Toys →</Btn>
      </div>
    </PageWrap>
  );

  return (
    <PageWrap>
      <h1 style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, color: "var(--navy)", marginBottom: 28 }}>🛒 Your Cart</h1>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 28, alignItems: "start" }} className="cart-grid">
        {/* Cart Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {cart.map(item => (
            <div key={item._id} style={{ background: "#fff", borderRadius: 18, padding: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid var(--border)", display: "flex", gap: 20, alignItems: "center" }}>
              {/* Emoji */}
              <div style={{ width: 72, height: 72, borderRadius: 14, background: "linear-gradient(135deg,#FFF0F5,#F0F4FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, flexShrink: 0 }}>
                {item.image}
              </div>

              {/* Details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</h3>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>{item.category} · ₹{item.dailyRate}/day · Deposit ₹{item.deposit}</div>

                {/* Days control */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>Days:</span>
                  <button onClick={() => updateDays(item._id, item.days - 1)}
                    style={{ width: 28, height: 28, borderRadius: 8, background: "#FFE5EC", color: "var(--pink)", border: "none", fontSize: 16, cursor: "pointer", fontWeight: 700 }}>−</button>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "var(--navy)", minWidth: 24, textAlign: "center" }}>{item.days}</span>
                  <button onClick={() => updateDays(item._id, item.days + 1)}
                    style={{ width: 28, height: 28, borderRadius: 8, background: "#FFE5EC", color: "var(--pink)", border: "none", fontSize: 16, cursor: "pointer", fontWeight: 700 }}>+</button>
                </div>
              </div>

              {/* Price + Remove */}
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--pink)", marginBottom: 4 }}>₹{item.dailyRate * item.days}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 10 }}>+₹{item.deposit} deposit</div>
                <button onClick={() => removeFromCart(item._id)}
                  style={{ background: "#FFF0F0", color: "#E53935", border: "none", padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{ background: "#fff", borderRadius: 18, padding: 24, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid var(--border)", position: "sticky", top: 80 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--navy)", marginBottom: 20 }}>Order Summary</h2>

          <div style={{ fontSize: 14, color: "#555" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span>Rental Total</span><span style={{ fontWeight: 700 }}>₹{cartTotal}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span>Security Deposits</span><span style={{ fontWeight: 700, color: "var(--indigo)" }}>₹{depositTotal}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 800, color: "var(--navy)", paddingTop: 14, borderTop: "2px solid var(--border)" }}>
              <span>Total Payable</span><span style={{ color: "var(--pink)" }}>₹{totalAmount}</span>
            </div>
          </div>

          <div style={{ background: "#FFF9E6", border: "1px solid #FFD700", borderRadius: 10, padding: 10, marginTop: 16, fontSize: 12, color: "#7A6000" }}>
            💡 Deposit of ₹{depositTotal} will be refunded when you return the toys.
          </div>

          <Btn onClick={() => navigate("/checkout")} size="lg" style={{ width: "100%", justifyContent: "center", marginTop: 20 }}>
            Proceed to Checkout →
          </Btn>
          <Btn onClick={() => navigate("/browse")} variant="ghost" style={{ width: "100%", justifyContent: "center", marginTop: 10, color: "var(--muted)", fontSize: 13 }}>
            + Add More Toys
          </Btn>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .cart-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </PageWrap>
  );
}
