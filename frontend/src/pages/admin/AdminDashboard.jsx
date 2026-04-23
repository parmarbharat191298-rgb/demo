import { adminService, bookingService } from "../../services/toyshare.service.js";
import { useFetch } from "../../hooks/useFetch.js";
import { StatCard, Badge } from "../../components/common/UI.jsx";

export default function AdminDashboard() {
  const { data: statsData, loading: sLoading } = useFetch(() => adminService.getStats());
  const { data: bookingsData, loading: bLoading } = useFetch(() => bookingService.getAll());

  const stats  = statsData?.stats;
  const recent = bookingsData?.bookings?.slice(0, 6) || [];

  if (sLoading || bLoading) return <div className="spinner" />;

  const cards = [
    { label: "Total Revenue",    value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`, icon: "💰", color: "#7B90FF", bg: "#EEF0FF", sub: "All time rentals" },
    { label: "Active Bookings",  value: stats?.activeBookings || 0, icon: "📋", color: "#4CAF50", bg: "#E8F5E9", sub: `${stats?.overdueBookings || 0} overdue` },
    { label: "Total Users",      value: stats?.totalUsers || 0, icon: "👥", color: "#FF9800", bg: "#FFF3E0", sub: "Registered customers" },
    { label: "Total Toys",       value: stats?.totalToys || 0, icon: "🧸", color: "#E91E63", bg: "#FCE4EC", sub: "In inventory" },
    { label: "Deposit Held",     value: `₹${stats?.depositHeld?.toLocaleString() || 0}`, icon: "🔒", color: "#9C27B0", bg: "#F3E5F5", sub: "Refundable on return" },
    { label: "Total Bookings",   value: stats?.totalBookings || 0, icon: "📈", color: "#00BCD4", bg: "#E0F7FA", sub: "All time" },
  ];

  const catColors = ["#7B90FF", "#FF6B9D", "#4CAF50", "#FF9800", "#9C27B0", "#00BCD4"];
  const totalRev = stats?.totalRevenue || 1;

  return (
    <div className="fade-up">
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--navy)", marginBottom: 24 }}>📊 Dashboard</h1>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 18, marginBottom: 32 }}>
        {cards.map(c => <StatCard key={c.label} {...c} />)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, alignItems: "start" }}>
        {/* Recent Bookings */}
        <div style={{ background: "#fff", borderRadius: 18, padding: 24, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--navy)", marginBottom: 18 }}>📋 Recent Bookings</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #F0F4FF" }}>
                  {["Customer", "Toy", "Amount", "Mode", "Status"].map(h => (
                    <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "#888", fontWeight: 700, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(b => (
                  <tr key={b._id} style={{ borderBottom: "1px solid #FAFAFA" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#FAFBFF"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}>
                    <td style={{ padding: "12px" }}>
                      <div style={{ fontWeight: 700, color: "var(--navy)" }}>{b.user?.name}</div>
                      <div style={{ fontSize: 11, color: "#aaa" }}>{b.user?.email}</div>
                    </td>
                    <td style={{ padding: "12px" }}>{b.toy?.image} {b.toy?.name?.slice(0, 18)}{b.toy?.name?.length > 18 ? "…" : ""}</td>
                    <td style={{ padding: "12px", fontWeight: 700, color: "#2E7D32" }}>₹{b.rentalAmount}</td>
                    <td style={{ padding: "12px", color: "#555" }}>{b.paymentMode}</td>
                    <td style={{ padding: "12px" }}><Badge label={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue by Category */}
        <div style={{ background: "#fff", borderRadius: 18, padding: 24, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--navy)", marginBottom: 18 }}>🧸 Revenue by Category</h3>
          {Object.entries(stats?.revenueByCategory || {}).map(([cat, amt], i) => (
            <div key={cat} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{cat}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: catColors[i % catColors.length] }}>₹{amt}</span>
              </div>
              <div style={{ height: 8, background: "#F0F4FF", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ width: `${(amt / totalRev) * 100}%`, height: "100%", background: catColors[i % catColors.length], borderRadius: 10, transition: "width 0.8s ease" }} />
              </div>
            </div>
          ))}
          {Object.keys(stats?.revenueByCategory || {}).length === 0 && (
            <div style={{ textAlign: "center", color: "#aaa", fontSize: 13, padding: 20 }}>No revenue data yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
