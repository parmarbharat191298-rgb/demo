import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { bookingService } from "../services/toyshare.service.js";
import { Btn, PageWrap } from "../components/common/UI.jsx";

export default function CheckoutPage() {
  const navigate  = useNavigate();
  const { cart, cartTotal, depositTotal, totalAmount, clearCart } = useCart();
  const { user, refreshUser } = useAuth();
  const [paymentMode, setPaymentMode] = useState("Wallet");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const today   = new Date().toISOString().split("T")[0];

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (paymentMode === "Wallet" && user.wallet < totalAmount) {
      setError("Insufficient wallet balance. Please add money to wallet."); return;
    }
    setLoading(true);
    setError("");
    try {
      for (const item of cart) {
        const start = new Date();
        const end   = new Date(Date.now() + item.days * 86400000);
        await bookingService.create({
          toyId: item._id,
          startDate: start.toISOString().split("T")[0],
          endDate:   end.toISOString().split("T")[0],
          paymentMode,
        });
      }
      await refreshUser();
      clearCart();
      navigate("/bookings");
    } catch (e) {
      setError(e.response?.data?.message || "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) { navigate("/cart"); return null; }

  return (
    <PageWrap>
      <h1 style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, color: "var(--navy)", marginBottom: 28 }}>✅ Checkout</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 28, alignItems: "start" }} className="checkout-grid">
        {/* Left: Order details */}
        <div>
          {/* Items */}
          <div style={{ background: "#fff", borderRadius: 18, padding: 24, marginBottom: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--navy)", marginBottom: 16 }}>📋 Order Items</h2>
            {cart.map(item => {
              const end = new Date(Date.now() + item.days * 86400000).toISOString().split("T")[0];
              return (
                <div key={item._id} style={{ display: "flex", gap: 14, alignItems: "center", paddingBottom: 14, borderBottom: "1px solid var(--bg)", marginBottom: 14 }}>
                  <span style={{ fontSize: 32 }}>{item.image}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--navy)", marginBottom: 2 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{today} → {end} · {item.days} days</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, color: "var(--pink)" }}>₹{item.dailyRate * item.days}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>+₹{item.deposit} dep.</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payment Mode */}
          <div style={{ background: "#fff", borderRadius: 18, padding: 24, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--navy)", marginBottom: 16 }}>💳 Payment Method</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[["Wallet", `💰 Wallet\n₹${user.wallet} balance`], ["UPI", "📱 UPI"], ["Card", "💳 Card"]].map(([mode, label]) => (
                <button key={mode} onClick={() => setPaymentMode(mode)}
                  style={{
                    padding: "14px 10px", borderRadius: 14,
                    border: `2px solid ${paymentMode === mode ? "var(--pink)" : "var(--border)"}`,
                    background: paymentMode === mode ? "#FFF0F5" : "#fff",
                    cursor: "pointer", fontWeight: 600, fontSize: 13,
                    color: paymentMode === mode ? "var(--pink)" : "var(--text)",
                    whiteSpace: "pre-line", lineHeight: 1.4,
                    transition: "all 0.2s",
                  }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div style={{ background: "#fff", borderRadius: 18, padding: 24, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid var(--border)", position: "sticky", top: 80 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--navy)", marginBottom: 20 }}>💰 Payment Summary</h2>

          <div style={{ fontSize: 14, color: "#555" }}>
            {[["Rental Amount", cartTotal], ["Security Deposit", depositTotal]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span>{l}</span><span style={{ fontWeight: 700 }}>₹{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 800, paddingTop: 14, borderTop: "2px solid var(--border)", color: "var(--navy)" }}>
              <span>Total</span><span style={{ color: "var(--pink)" }}>₹{totalAmount}</span>
            </div>
          </div>

          {paymentMode === "Wallet" && (
            <div style={{ background: user.wallet >= totalAmount ? "#E8F5E9" : "#FFF0F0", borderRadius: 10, padding: 12, marginTop: 16, fontSize: 13, color: user.wallet >= totalAmount ? "#2E7D32" : "#E53935", fontWeight: 600 }}>
              {user.wallet >= totalAmount ? `✅ Wallet balance: ₹${user.wallet} (sufficient)` : `❌ Insufficient balance. Need ₹${totalAmount - user.wallet} more.`}
            </div>
          )}

          {error && (
            <div style={{ background: "#FFF0F0", borderRadius: 10, padding: 12, marginTop: 12, fontSize: 13, color: "#E53935", fontWeight: 600 }}>❌ {error}</div>
          )}

          <Btn onClick={handleCheckout} disabled={loading} size="lg" style={{ width: "100%", justifyContent: "center", marginTop: 20 }}>
            {loading ? "Processing…" : `✅ Pay ₹${totalAmount}`}
          </Btn>
          <Btn onClick={() => navigate("/cart")} variant="ghost" style={{ width: "100%", justifyContent: "center", marginTop: 10, color: "var(--muted)", fontSize: 13 }}>
            ← Back to Cart
          </Btn>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .checkout-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </PageWrap>
  );
}
