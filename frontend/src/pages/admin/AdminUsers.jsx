import { useState } from "react";
import { userService } from "../../services/toyshare.service.js";
import { bookingService } from "../../services/toyshare.service.js";
import { useFetch } from "../../hooks/useFetch.js";
import { Badge, Modal, EmptyState } from "../../components/common/UI.jsx";

export default function AdminUsers() {
  const [search, setSearch]     = useState("");
  const [viewUser, setViewUser] = useState(null);
  const [notif, setNotif]       = useState("");

  const { data, loading, refetch } = useFetch(() => userService.getAll());
  const { data: bData } = useFetch(() => bookingService.getAll());

  const users = (data?.users || []).filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const showNotif = (msg) => { setNotif(msg); setTimeout(() => setNotif(""), 3000); };

  const toggleStatus = async (id) => {
    await userService.toggleStatus(id);
    showNotif("✅ User status updated.");
    refetch();
  };

  const userBookings = (uid) => (bData?.bookings || []).filter(b => b.user?._id === uid);

  return (
    <div className="fade-up">
      {notif && <div style={{ position: "fixed", top: 20, right: 20, zIndex: 999, background: "#2E7D32", color: "#fff", padding: "12px 20px", borderRadius: 12, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.2)", fontSize: 14 }}>{notif}</div>}

      <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--navy)", marginBottom: 24 }}>👥 Users</h1>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search by name or email..."
        style={{ width: "100%", maxWidth: 380, padding: "10px 16px", borderRadius: 12, border: "2px solid #E8EBFF", outline: "none", fontSize: 14, marginBottom: 24, background: "#fff" }} />

      {loading ? <div className="spinner" /> : users.length === 0 ? <EmptyState icon="👥" title="No users found" message="No users match your search." /> : (
        <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F8F9FF", borderBottom: "2px solid #EEF0FF" }}>
                  {["User", "Contact", "Wallet", "Points", "Role", "Status", "Actions"].map(h => (
                    <th key={h} style={{ padding: "13px 14px", textAlign: "left", color: "#888", fontWeight: 700, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{ borderBottom: "1px solid #FAFAFA" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#FAFBFF"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}>
                    <td style={{ padding: "13px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#7B90FF,#FF6B9D)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                          {u.name[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: "var(--navy)" }}>{u.name}</div>
                          <div style={{ fontSize: 11, color: "#aaa" }}>Joined {u.createdAt?.slice(0, 10)}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "13px 14px" }}>
                      <div style={{ color: "#555" }}>{u.email}</div>
                      <div style={{ fontSize: 11, color: "#aaa" }}>{u.phone || "—"}</div>
                    </td>
                    <td style={{ padding: "13px 14px", fontWeight: 700, color: "#2E7D32" }}>₹{u.wallet}</td>
                    <td style={{ padding: "13px 14px", fontWeight: 700, color: "#FF9800" }}>🌟 {u.points}</td>
                    <td style={{ padding: "13px 14px" }}><Badge label={u.role === "admin" ? "Admin" : "Customer"} /></td>
                    <td style={{ padding: "13px 14px" }}><Badge label={u.isActive ? "Active" : "Inactive"} /></td>
                    <td style={{ padding: "13px 14px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => setViewUser(u)} style={{ padding: "4px 10px", borderRadius: 8, background: "#EEF0FF", color: "#5C6BC0", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>👁 View</button>
                        {u.role !== "admin" && (
                          <button onClick={() => toggleStatus(u._id)}
                            style={{ padding: "4px 10px", borderRadius: 8, background: u.isActive ? "#FFF0F0" : "#E8F5E9", color: u.isActive ? "#E53935" : "#388E3C", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>
                            {u.isActive ? "🔒 Block" : "🔓 Unblock"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {viewUser && (
        <Modal title="👤 User Details" onClose={() => setViewUser(null)} width={520}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "linear-gradient(135deg,#7B90FF,#FF6B9D)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 28, margin: "0 auto 12px" }}>{viewUser.name[0]}</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{viewUser.name}</h3>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>{viewUser.email} · {viewUser.phone || "No phone"}</p>
            <Badge label={viewUser.isActive ? "Active" : "Inactive"} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
            {[["Wallet", `₹${viewUser.wallet}`, "#4CAF50"], ["Points", `🌟 ${viewUser.points}`, "#FF9800"], ["Bookings", userBookings(viewUser._id).length, "#7B90FF"]].map(([l, v, c]) => (
              <div key={l} style={{ background: "#F8F9FF", borderRadius: 12, padding: 14, textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#aaa", marginBottom: 4, textTransform: "uppercase" }}>{l}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: c }}>{v}</div>
              </div>
            ))}
          </div>

          <h4 style={{ fontSize: 14, fontWeight: 800, color: "var(--navy)", marginBottom: 12 }}>📋 Booking History</h4>
          {userBookings(viewUser._id).length === 0 ? (
            <p style={{ color: "#aaa", fontSize: 13, textAlign: "center", padding: 20 }}>No bookings yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 240, overflowY: "auto" }}>
              {userBookings(viewUser._id).map(b => (
                <div key={b._id} style={{ background: "#F8F9FF", borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{b.toy?.image} {b.toy?.name}</div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>{b.startDate?.slice(0, 10)} · {b.days} days</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, color: "#4CAF50", fontSize: 13 }}>₹{b.rentalAmount}</div>
                    <Badge label={b.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
