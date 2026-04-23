import { useState } from "react";
import { toyService } from "../../services/toyshare.service.js";
import { useFetch } from "../../hooks/useFetch.js";
import { Btn, Badge, Modal, Input, Select, EmptyState } from "../../components/common/UI.jsx";

const CATEGORIES = ["Building Sets", "Dolls", "Vehicles", "Action Toys", "Creative Play", "Educational", "Outdoor"];
const AGES = ["3+", "5+", "6+", "8+", "9+", "10+", "12+", "16+"];
const EMPTY = { name: "", category: "Building Sets", dailyRate: "", deposit: "", stock: "", age: "3+", image: "🧸", description: "" };

export default function AdminToys() {
  const [search, setSearch] = useState("");
  const [modal, setModal]   = useState(null); // null | "add" | toy
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [notif, setNotif]   = useState("");

  const { data, loading, refetch } = useFetch(() => toyService.getAll());
  const toys = (data?.toys || []).filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const showNotif = (msg) => { setNotif(msg); setTimeout(() => setNotif(""), 3000); };

  const openAdd  = () => { setForm(EMPTY); setModal("add"); };
  const openEdit = (toy) => { setForm({ ...toy, dailyRate: toy.dailyRate, deposit: toy.deposit, stock: toy.stock }); setModal(toy); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (modal === "add") {
        await toyService.create(form);
        showNotif("✅ Toy added!");
      } else {
        await toyService.update(modal._id, form);
        showNotif("✅ Toy updated!");
      }
      setModal(null); refetch();
    } catch (e) { showNotif("❌ " + (e.response?.data?.message || "Error")); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this toy?")) return;
    await toyService.delete(id);
    showNotif("🗑️ Toy removed.");
    refetch();
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="fade-up">
      {notif && <div style={{ position: "fixed", top: 20, right: 20, zIndex: 999, background: notif.startsWith("❌") ? "#C62828" : "#2E7D32", color: "#fff", padding: "12px 20px", borderRadius: 12, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.2)", fontSize: 14 }}>{notif}</div>}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--navy)" }}>🧸 Toy Inventory</h1>
        <Btn onClick={openAdd}>+ Add New Toy</Btn>
      </div>

      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search toys..."
        style={{ width: "100%", maxWidth: 380, padding: "10px 16px", borderRadius: 12, border: "2px solid #E8EBFF", outline: "none", fontSize: 14, marginBottom: 24, background: "#fff" }} />

      {loading ? <div className="spinner" /> : toys.length === 0 ? <EmptyState icon="🧸" title="No toys found" message="Add your first toy!" /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 18 }}>
          {toys.map(toy => (
            <div key={toy._id} style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #F0F4FF", transition: "transform 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{ background: "linear-gradient(135deg,#EEF0FF,#FFF0F8)", padding: "28px", textAlign: "center", fontSize: 52 }}>{toy.image}</div>
              <div style={{ padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, gap: 8 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 800, color: "var(--navy)", lineHeight: 1.3, flex: 1 }}>{toy.name}</h3>
                  <Badge label={toy.stock === 0 ? "Out of Stock" : "Available"} />
                </div>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 12 }}>{toy.category} · Age {toy.age} · ⭐ {toy.rating}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 14 }}>
                  {[["Rate/Day", `₹${toy.dailyRate}`], ["Deposit", `₹${toy.deposit}`], ["Stock", toy.stock]].map(([l, v]) => (
                    <div key={l} style={{ background: "#F8F9FF", borderRadius: 8, padding: "7px", textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: "#aaa", marginBottom: 1 }}>{l}</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "var(--navy)" }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn onClick={() => openEdit(toy)} variant="secondary" size="sm" style={{ flex: 1, justifyContent: "center" }}>✏️ Edit</Btn>
                  <Btn onClick={() => handleDelete(toy._id)} variant="danger" size="sm" style={{ flex: 1, justifyContent: "center" }}>🗑️ Delete</Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <Modal title={modal === "add" ? "➕ Add New Toy" : "✏️ Edit Toy"} onClose={() => setModal(null)} width={520}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <div style={{ gridColumn: "1 / -1" }}><Input label="Toy Name *" value={form.name} onChange={set("name")} placeholder="e.g. LEGO Star Wars" /></div>
            <Select label="Category *" value={form.category} onChange={set("category")} options={CATEGORIES} />
            <Input label="Emoji Icon" value={form.image} onChange={set("image")} placeholder="🧸" />
            <Input label="Daily Rate (₹) *" type="number" value={form.dailyRate} onChange={set("dailyRate")} placeholder="50" />
            <Input label="Security Deposit (₹) *" type="number" value={form.deposit} onChange={set("deposit")} placeholder="500" />
            <Input label="Stock / Quantity *" type="number" value={form.stock} onChange={set("stock")} placeholder="5" />
            <Select label="Age Group" value={form.age} onChange={set("age")} options={AGES} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6 }}>Description</label>
            <textarea value={form.description} onChange={set("description")} rows={2}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid #FFE5EC", outline: "none", fontSize: 14, resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={() => setModal(null)} variant="secondary" style={{ flex: 1, justifyContent: "center" }}>Cancel</Btn>
            <Btn onClick={handleSave} disabled={saving} style={{ flex: 2, justifyContent: "center" }}>
              {saving ? "Saving…" : modal === "add" ? "✅ Add Toy" : "💾 Save Changes"}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
