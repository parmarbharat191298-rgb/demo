import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ background: "var(--navy)", color: "rgba(255,255,255,0.7)", padding: "40px clamp(16px,4vw,48px) 24px", marginTop: 60 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🧸 <span style={{ color: "#fff", fontWeight: 800 }}>ToyShare</span></div>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>Rent premium toys for your kids. Affordable, clean & delivered to your door.</p>
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, marginBottom: 12 }}>Quick Links</div>
            {[["Home", "/"], ["Browse Toys", "/browse"], ["My Bookings", "/bookings"], ["Profile", "/profile"]].map(([l, to]) => (
              <div key={l} style={{ marginBottom: 6 }}><Link to={to} style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", transition: "color 0.2s" }}>{l}</Link></div>
            ))}
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, marginBottom: 12 }}>Categories</div>
            {["Building Sets", "Dolls", "Vehicles", "Action Toys", "Creative Play", "Outdoor"].map(c => (
              <div key={c} style={{ marginBottom: 6, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{c}</div>
            ))}
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, marginBottom: 12 }}>Contact</div>
            <p style={{ fontSize: 13, lineHeight: 1.8 }}>📧 hello@toyshare.in<br />📞 +91 98765 43210<br />📍 Ahmedabad, Gujarat</p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20, textAlign: "center", fontSize: 13 }}>
          © {new Date().getFullYear()} ToyShare. Made with in India.
        </div>
      </div>
    </footer>
  );
}
