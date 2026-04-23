import { bookingService } from "../../services/toyshare.service.js";
import { useFetch } from "../../hooks/useFetch.js";
import { StatCard, Badge } from "../../components/common/UI.jsx";

export default function AdminRevenue() {
  const { data, loading } = useFetch(() => bookingService.getAll());
  const bookings = data?.bookings || [];

  const total       = bookings.reduce((s, b) => s + b.rentalAmount, 0);
  const depositHeld = bookings.filter(b => ["Active", "Overdue"].includes(b.status)).reduce((s, b) => s + b.depositPaid, 0);
  const overduePending = bookings.filter(b => b.status === "Overdue").reduce((s, b) => s + b.rentalAmount, 0);
  const avgBooking  = bookings.length ? Math.round(total / bookings.length) : 0;

  const byMode = bookings.reduce((acc, b) => { acc[b.paymentMode] = (acc[b.paymentMode] || 0) + b.rentalAmount; return acc; }, {});
  const byCat  = bookings.reduce((acc, b) => { const cat = b.toy?.category || "Other"; acc[cat] = (acc[cat] || 0) + b.rentalAmount; return acc; }, {});
  const colors = ["#7B90FF", "#FF6B9D", "#4CAF50", "#FF9800", "#9C27B0", "#00BCD4"];

  return (
    <div className="fade-up">
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--navy)", marginBottom: 24 }}>💰 Revenue</h1>

      {loading ? <div className="spinner" /> : (
        <>
          {/* Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 18, marginBottom: 32 }}>
            <StatCard label="Total Revenue"    value={`₹${total.toLocaleString()}`} icon="💰" color="#4CAF50" bg="#E8F5E9" sub="All time rentals" />
            <StatCard label="Deposits Held"    value={`₹${depositHeld.toLocaleString()}`} icon="🔒" color="#7B90FF" bg="#EEF0FF" sub="Active & overdue" />
            <StatCard label="Overdue Amount"   value={`₹${overduePending.toLocaleString()}`} icon="⚠️" color="#FF6B00" bg="#FFF3E0" sub="Needs collection" />
            <StatCard label="Avg per Booking"  value={`₹${avgBooking}`} icon="📈" color="#E91E63" bg="#FCE4EC" sub={`${bookings.length} total bookings`} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            {/* By Payment Mode */}
            <div style={{ background: "#fff", borderRadius: 18, padding: 24, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--navy)", marginBottom: 18 }}>💳 Revenue by Payment Mode</h3>
              {Object.entries(byMode).map(([mode, amt], i) => (
                <div key={mode} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#333" }}>{mode}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: colors[i % colors.length] }}>₹{amt} · {Math.round((amt / total) * 100)}%</span>
                  </div>
                  <div style={{ height: 10, background: "#F0F4FF", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ width: `${(amt / total) * 100}%`, height: "100%", background: colors[i % colors.length], borderRadius: 10 }} />
                  </div>
                </div>
              ))}
              {Object.keys(byMode).length === 0 && <p style={{ color: "#aaa", fontSize: 13 }}>No data yet</p>}
            </div>

            {/* By Category */}
            <div style={{ background: "#fff", borderRadius: 18, padding: 24, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--navy)", marginBottom: 18 }}>🧸 Revenue by Category</h3>
              {Object.entries(byCat).map(([cat, amt], i) => (
                <div key={cat} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#333" }}>{cat}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: colors[i % colors.length] }}>₹{amt}</span>
                  </div>
                  <div style={{ height: 10, background: "#F0F4FF", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ width: `${(amt / total) * 100}%`, height: "100%", background: colors[i % colors.length], borderRadius: 10 }} />
                  </div>
                </div>
              ))}
              {Object.keys(byCat).length === 0 && <p style={{ color: "#aaa", fontSize: 13 }}>No data yet</p>}
            </div>
          </div>

          {/* All Transactions Table */}
          <div style={{ background: "#fff", borderRadius: 18, padding: 24, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--navy)", marginBottom: 18 }}>📜 All Transactions</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#F8F9FF" }}>
                    {["Customer", "Toy", "Days", "Rental", "Deposit", "Total", "Mode", "Status"].map(h => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "#888", fontWeight: 700, fontSize: 11, textTransform: "uppercase", borderBottom: "2px solid #EEF0FF" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b._id} style={{ borderBottom: "1px solid #FAFAFA" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#FAFBFF"}
                      onMouseLeave={e => e.currentTarget.style.background = ""}>
                      <td style={{ padding: "11px 12px", fontWeight: 600 }}>{b.user?.name}</td>
                      <td style={{ padding: "11px 12px" }}>{b.toy?.image} {b.toy?.name?.slice(0, 16)}</td>
                      <td style={{ padding: "11px 12px" }}>{b.days}d</td>
                      <td style={{ padding: "11px 12px", fontWeight: 700, color: "#2E7D32" }}>₹{b.rentalAmount}</td>
                      <td style={{ padding: "11px 12px", color: "#555" }}>₹{b.depositPaid}</td>
                      <td style={{ padding: "11px 12px", fontWeight: 700, color: "var(--navy)" }}>₹{b.totalAmount}</td>
                      <td style={{ padding: "11px 12px", color: "#555" }}>{b.paymentMode}</td>
                      <td style={{ padding: "11px 12px" }}><Badge label={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#aaa", fontSize: 13 }}>No transactions yet</div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
