import { useState } from "react";
import { toyService } from "../services/toyshare.service.js";
import { useFetch } from "../hooks/useFetch.js";
import ToyCard from "../components/user/ToyCard.jsx";
import { PageWrap, EmptyState } from "../components/common/UI.jsx";

const CATEGORIES = ["All", "Building Sets", "Dolls", "Vehicles", "Action Toys", "Creative Play", "Educational", "Outdoor"];

export default function BrowsePage() {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [onlyAvail, setOnlyAvail] = useState(false);

  const { data, loading } = useFetch(
    () => toyService.getAll({ search, category: category === "All" ? undefined : category, available: onlyAvail ? "true" : undefined }),
    [search, category, onlyAvail]
  );
  const toys = data?.toys || [];

  return (
    <PageWrap>
      <h1 style={{ fontSize: "clamp(24px,5vw,36px)", fontWeight: 800, color: "var(--navy)", marginBottom: 24 }}>🧸 Browse Toys</h1>

      {/* Filters */}
      <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search by name..."
          style={{ flex: "1 1 220px", padding: "10px 16px", borderRadius: 12, border: "2px solid var(--border)", outline: "none", fontSize: 14, background: "#fff" }}
        />
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "var(--navy)", cursor: "pointer" }}>
          <input type="checkbox" checked={onlyAvail} onChange={e => setOnlyAvail(e.target.checked)} style={{ width: 16, height: 16, accentColor: "var(--pink)" }} />
          Available only
        </label>
      </div>

      {/* Category Pills */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            style={{
              padding: "7px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, transition: "all 0.2s",
              background: category === c ? "linear-gradient(135deg,#FF6B9D,#C06C84)" : "#fff",
              color: category === c ? "#fff" : "var(--text)",
              boxShadow: category === c ? "0 4px 14px rgba(255,107,157,0.4)" : "0 2px 8px rgba(0,0,0,0.06)",
            }}>
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? <div className="spinner" /> : toys.length === 0 ? (
        <EmptyState icon="🔍" title="No toys found" message="Try changing your search or filters." />
      ) : (
        <>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>{toys.length} toys found</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 22 }}>
            {toys.map(t => <ToyCard key={t._id} toy={t} />)}
          </div>
        </>
      )}
    </PageWrap>
  );
}
