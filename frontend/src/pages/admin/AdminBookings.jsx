import { useState } from "react";
import { bookingService } from "../../services/toyshare.service.js";
import { useFetch } from "../../hooks/useFetch.js";
import { Badge, EmptyState } from "../../components/common/UI.jsx";

const FILTERS = ["All", "Active", "Returned", "Overdue", "Cancelled"];

export default function AdminBookings() {
  const [filter, setFilter] = useState("All");
  const [notif, setNotif]   = useState("");
  const { data, loading, refetch } = useFetch(() => bookingService.getAll());
  const all = data?.bookings || [];
  const shown = filter === "All" ? all : all.filter(b => b.status === filter);

  const showNotif = (msg) => { setNotif(msg); setTimeout(() => setNotif(""), 3000); };

  const updateStatus = async (id, status) => {
    try {
      await bookingService.updateStatus(id, status);
      showNotif(`✅ Booking marked as ${status}`);
      refetch();
    } catch (e) { showNotif("❌ Failed to update"); }
  };

  return (
    <div className="fade-up">
      {notif && <div style={{ position: "fixed", top: 20, right: 20, zIndex: 999, background: notif.startsWith("❌") ? "#C62828" : "#2E7D32", color: "#fff", padding: "12px 20px", borderRadius: 12, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.2)", fontSize: 14 }}>{notif}</div>}

      <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--navy)", marginBottom: 24 }}>📋 Bookings</h1>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: "7px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13,
              background: filter === f ? "linear-gradient(135deg,#7B90FF,#FF6B9D)" : "#fff",
              color: filter === f ? "#fff" : "var(--text)",
              boxShadow: filter === f ? "0 4px 14px rgba(123,144,255,0.4)" : "0 2px 8px rgba(0,0,0,0.06)",
            }}>
            {f} ({f === "All" ? all.length : all.filter(b => b.status === f).length})
          </button>
        ))}
      </div>

      {loading ? <div className="spinner" /> : shown.length === 0 ? <EmptyState icon="📋" title="No bookings" message="No bookings for this filter." /> : (
        <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F8F9FF", borderBottom: "2px solid #EEF0FF" }}>
                  {["Customer", "Toy", "Duration", "Rental", "Deposit", "Payment", "Status", "Actions"].map(h => (
                    <th key={h} style={{ padding: "13px 14px", textAlign: "left", color: "#888", fontWeight: 700, fontSize: 11, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map(b => (
                  <tr key={b._id} style={{ borderBottom: "1px solid #FAFAFA" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#FAFBFF"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}>
                    <td style={{ padding: "13px 14px" }}>
                      <div style={{ fontWeight: 700, color: "var(--navy)" }}>{b.user?.name}</div>
                      <div style={{ fontSize: 11, color: "#aaa" }}>{b.user?.email}</div>
                    </td>
                    <td style={{ padding: "13px 14px" }}>{b.toy?.image} {b.toy?.name?.slice(0, 16)}{b.toy?.name?.length > 16 ? "…" : ""}</td>
                    <td style={{ padding: "13px 14px", color: "#555", fontSize: 12 }}>
                      {b.days}d<br />
                      <span style={{ color: "#bbb" }}>{b.startDate?.slice(0, 10)} →<br />{b.endDate?.slice(0, 10)}</span>
                    </td>
                    <td style={{ padding: "13px 14px", fontWeight: 700, color: "#2E7D32" }}>₹{b.rentalAmount}</td>
                    <td style={{ padding: "13px 14px", color: "#555" }}>₹{b.depositPaid}</td>
                    <td style={{ padding: "13px 14px", color: "#555" }}>{b.paymentMode}</td>
                    <td style={{ padding: "13px 14px" }}><Badge label={b.status} /></td>
                    <td style={{ padding: "13px 14px" }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {b.status === "Active" && <>
                          <button onClick={() => updateStatus(b._id, "Returned")} style={{ padding: "4px 10px", borderRadius: 8, background: "#E8F5E9", color: "#388E3C", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>✅ Return</button>
                          <button onClick={() => updateStatus(b._id, "Cancelled")} style={{ padding: "4px 10px", borderRadius: 8, background: "#FFF0F0", color: "#E53935", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>❌ Cancel</button>
                        </>}
                        {b.status === "Overdue" && (
                          <button onClick={() => updateStatus(b._id, "Returned")} style={{ padding: "4px 10px", borderRadius: 8, background: "#E8F5E9", color: "#388E3C", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>✅ Mark Returned</button>
                        )}
                        {["Returned", "Cancelled"].includes(b.status) && <span style={{ fontSize: 11, color: "#ccc" }}>Closed</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
