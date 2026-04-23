import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookingService } from "../services/toyshare.service.js";
import { useFetch } from "../hooks/useFetch.js";
import { Badge, Btn, EmptyState, PageWrap } from "../components/common/UI.jsx";

const FILTERS = ["All", "Active", "Returned", "Overdue", "Cancelled"];

export default function BookingsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const { data, loading, refetch } = useFetch(() => bookingService.getMy());
  const bookings = data?.bookings || [];
  const filtered = filter === "All" ? bookings : bookings.filter(b => b.status === filter);

  return (
    <PageWrap>
      <h1 style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, color: "var(--navy)", marginBottom: 24 }}>📋 My Bookings</h1>

      {/* Filter Pills */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: "7px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, transition: "all 0.2s",
              background: filter === f ? "linear-gradient(135deg,#FF6B9D,#C06C84)" : "#fff",
              color: filter === f ? "#fff" : "var(--text)",
              boxShadow: filter === f ? "0 4px 14px rgba(255,107,157,0.4)" : "0 2px 8px rgba(0,0,0,0.06)",
            }}>
            {f} ({f === "All" ? bookings.length : bookings.filter(b => b.status === f).length})
          </button>
        ))}
      </div>

      {loading ? <div className="spinner" /> : filtered.length === 0 ? (
        <>
          <EmptyState icon="📦" title="No bookings yet" message="Start renting toys for your little ones!" />
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Btn onClick={() => navigate("/browse")} size="lg">Browse Toys →</Btn>
          </div>
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {filtered.map(b => (
            <div key={b._id} className="fade-up" style={{ background: "#fff", borderRadius: 18, padding: 22, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
                {/* Emoji */}
                <div style={{ width: 68, height: 68, borderRadius: 14, background: "linear-gradient(135deg,#FFF0F5,#F0F4FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, flexShrink: 0 }}>
                  {b.toy?.image}
                </div>

                {/* Main Info */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)", margin: 0 }}>{b.toy?.name}</h3>
                    <Badge label={b.status} />
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>
                    📅 {b.startDate?.slice(0, 10)} → {b.endDate?.slice(0, 10)} · {b.days} days · {b.paymentMode}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 10 }}>
                    {[["Rental Paid", `₹${b.rentalAmount}`], ["Deposit Paid", `₹${b.depositPaid}`], ["Booking ID", b._id?.slice(-6).toUpperCase()]].map(([l, v]) => (
                      <div key={l} style={{ background: "var(--bg)", borderRadius: 10, padding: "8px 10px" }}>
                        <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 2, textTransform: "uppercase" }}>{l}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--navy)" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "var(--pink)", marginBottom: 4 }}>₹{b.totalAmount}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>total paid</div>
                </div>
              </div>

              {b.status === "Returned" && (
                <div style={{ marginTop: 12, background: "#E8F5E9", borderRadius: 10, padding: "8px 14px", fontSize: 12, color: "#2E7D32", fontWeight: 600 }}>
                  ✅ Deposit of ₹{b.depositPaid} has been refunded to your wallet.
                </div>
              )}
              {b.status === "Overdue" && (
                <div style={{ marginTop: 12, background: "#FFF3E0", borderRadius: 10, padding: "8px 14px", fontSize: 12, color: "#E65100", fontWeight: 600 }}>
                  ⚠️ This rental is overdue. Please return the toy as soon as possible.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </PageWrap>
  );
}
