import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const ROOM_OPTIONS = ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Office", "Garage"];

const TYPE_OPTIONS = [
  { value: "ac",     label: "Air Conditioner",  icon: "❄️",  defaultW: 1800 },
  { value: "fan",    label: "Fan",               icon: "🌀",  defaultW: 75   },
  { value: "light",  label: "Light",             icon: "💡",  defaultW: 20   },
  { value: "heater", label: "Heater",            icon: "🔥",  defaultW: 2000 },
  { value: "fridge", label: "Refrigerator",      icon: "🧊",  defaultW: 150  },
  { value: "tv",     label: "Television",        icon: "📺",  defaultW: 120  },
  { value: "washer", label: "Washing Machine",   icon: "🫧",  defaultW: 500  },
  { value: "other",  label: "Other",             icon: "🔌",  defaultW: 100  },
];

const iconMap = { ac:"❄️", fan:"🌀", light:"💡", heater:"🔥", fridge:"🧊", tv:"📺", washer:"🫧", other:"🔌" };

const ELECTRICITY_RATE = 8;

export default function Devices() {
  const { user } = useAuth();
  const [devices, setDevices]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState({ name: "", room: "Living Room", type: "ac", power_w: 1800 });

  const token   = localStorage.getItem("vs_token");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  const API     = process.env.REACT_APP_API_URL;

  // ── Fetch on mount ──────────────────────────────────────────────
  useEffect(() => { fetchDevices(); }, []);

  // ── Agent event listener ────────────────────────────────────────
  useEffect(() => {
    const handleAgentUpdate = () => fetchDevices();
    window.addEventListener("agent:device:updated", handleAgentUpdate);
    return () => window.removeEventListener("agent:device:updated", handleAgentUpdate);
  }, []);



  async function fetchDevices() {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/devices/`, { headers });
      const data = await res.json();
      setDevices(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    setLoading(false);
  }

  async function handleAdd() {
    setSaving(true);
    try {
      const res  = await fetch(`${API}/api/devices/`, { method: "POST", headers, body: JSON.stringify(form) });
      const data = await res.json();
      setDevices((prev) => [...prev, data]);
      setShowModal(false);
      setForm({ name: "", room: "Living Room", type: "ac", power_w: 1800 });
    } catch (err) { console.error(err); }
    setSaving(false);
  }

  async function handleToggle(device) {
    try {
      await fetch(`${API}/api/devices/${device.id}`, {
        method: "PATCH", headers,
        body: JSON.stringify({ status: !device.status }),
      });
      setDevices((prev) => prev.map((d) => d.id === device.id ? { ...d, status: !d.status } : d));
    } catch (err) { console.error(err); }
  }

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      await fetch(`${API}/api/devices/${id}`, { method: "DELETE", headers });
      setDevices((prev) => prev.filter((d) => d.id !== id));
    } catch (err) { console.error(err); }
    setDeletingId(null);
  }

  const activeDevices   = devices.filter((d) => d.status);
  const totalLoad       = activeDevices.reduce((s, d) => s + d.power_w, 0) / 1000;
  const totalHourlyCost = activeDevices.reduce((s, d) => s + (d.power_w / 1000) * ELECTRICITY_RATE, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#050a12", color: "#fff", fontFamily: "'DM Sans','SF Pro Display',system-ui,sans-serif" }}>

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
        .dev-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .dev-card:hover { transform: translateY(-3px); }
        .toggle-btn { transition: background 0.25s ease; }
        .toggle-thumb { transition: left 0.2s cubic-bezier(0.34,1.56,0.64,1); }
        .del-btn { transition: all 0.15s; }
        .del-btn:hover { color: #f87171 !important; background: rgba(248,113,113,0.1) !important; }
        .add-btn { transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1); }
        .add-btn:hover { transform: scale(1.04); box-shadow: 0 8px 28px rgba(6,182,212,0.35) !important; }
        .stat-card { transition: transform 0.2s, border-color 0.2s; }
        .stat-card:hover { transform: translateY(-2px); }
        .modal-overlay { animation: fadeIn 0.18s ease; }
        .modal-box { animation: slideUp 0.22s cubic-bezier(0.34,1.2,0.64,1); }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:none} }
        .type-btn { transition: all 0.15s; }
        .type-btn:hover { border-color: rgba(6,182,212,0.5) !important; background: rgba(6,182,212,0.08) !important; }
        .pulse { animation: pulseAnim 2s infinite; }
        @keyframes pulseAnim { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .dev-card-enter { animation: cardIn 0.3s cubic-bezier(0.34,1.2,0.64,1) both; }
        @keyframes cardIn { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:none} }
      `}</style>

      {/* Background blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-10%", left: "10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", top: "40%", right: "30%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(20,184,166,0.05) 0%, transparent 70%)", borderRadius: "50%" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "32px 28px", maxWidth: "1400px", margin: "0 auto" }}>

        {/* ── HEADER ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "14px",
                background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.2rem",
                boxShadow: "0 4px 16px rgba(14,165,233,0.35)",
              }}>🏠</div>
              <div>
                <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "800", letterSpacing: "-0.03em", background: "linear-gradient(135deg, #e2e8f0, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Device Control Center
                </h1>
                <p style={{ margin: 0, color: "#b1e9fb", fontSize: "0.82rem", marginTop: "2px" }}>
                  Monitor energy usage and manage smart devices
                </p>
              </div>
            </div>
          </div>

          <button className="add-btn" onClick={() => setShowModal(true)} style={{
            padding: "11px 22px", borderRadius: "12px", border: "none",
            background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
            color: "#fdfdfd", fontWeight: "700", fontSize: "0.85rem",
            cursor: "pointer", letterSpacing: "0.01em",
            boxShadow: "0 4px 18px rgba(228, 204, 204, 0.25)",
            display: "flex", alignItems: "center", gap: "7px",
          }}>
            <span style={{ fontSize: "1rem" }}>+</span> Add Device
          </button>
        </div>

        {/* ── STATS ── */} 
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "28px" }}>
          {[
            { label: "Total Devices",  value: devices.length,               icon: "🔌", color: "#38bdf8" },
            { label: "Active Now",     value: activeDevices.length,          icon: "✅", color: "#4ade80" },
            { label: "Current Load",   value: `${totalLoad.toFixed(2)} kW`,  icon: "⚡", color: "#f59e0b" },
            { label: "Hourly Cost",    value: `₹${totalHourlyCost.toFixed(2)}`, icon: "💰", color: "#c084fc" },
          ].map((s, i) => (
            <div key={i} className="stat-card" style={{
              padding: "18px 20px", borderRadius: "16px",
              background: "rgba(255,255,255,0.03)",
              border: `1px solid rgba(255,255,255,0.07)`,
              backdropFilter: "blur(12px)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span style={{ fontSize: "1.1rem" }}>{s.icon}</span>
                <span style={{ color: "#fcfeff", fontSize: "0.72rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.label}</span>
              </div>
              <div style={{ fontSize: "1.9rem",  fontWeight: "800", color: s.color, letterSpacing: "-0.03em", lineHeight: 1 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* ── DEVICES GRID ── */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "280px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              border: "3px solid rgba(6,182,212,0.15)",
              borderTop: "3px solid #0ea5e9",
              animation: "spin 0.8s linear infinite",
            }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : devices.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🔌</div>
            <h2 style={{ color: "#334155", fontWeight: "700", margin: "0 0 8px" }}>No Devices Added</h2>
            <p style={{ color: "#1e293b", margin: 0 }}>Start building your smart energy ecosystem</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "16px" }}>
            {devices.map((device, idx) => {
              const hourlyCost = (device.power_w / 1000) * ELECTRICITY_RATE;
              const isOn = device.status;

              return (
                <div key={device.id} className="dev-card dev-card-enter" style={{
                  borderRadius: "20px", padding: "20px",
                  background: isOn
                    ? "linear-gradient(145deg, rgba(22,163,74,0.12), rgba(14,184,134,0.06))"
                    : "rgba(255,255,255,0.02)",
                  border: isOn
                    ? "1px solid rgba(74,222,128,0.25)"
                    : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: isOn ? "0 8px 32px rgba(22,163,74,0.12)" : "none",
                  animationDelay: `${idx * 0.04}s`,
                }}>

                  {/* Card top */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                    <div style={{
                      width: "46px", height: "46px", borderRadius: "14px",
                      background: isOn ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.05)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.4rem",
                      border: isOn ? "1px solid rgba(74,222,128,0.2)" : "1px solid rgba(255,255,255,0.07)",
                    }}>{iconMap[device.type] || "🔌"}</div>

                    <button className="del-btn" onClick={() => handleDelete(device.id)}
                      disabled={deletingId === device.id}
                      style={{
                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "8px", width: "28px", height: "28px",
                        color: "#475569", cursor: "pointer", fontSize: "0.7rem",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        opacity: deletingId === device.id ? 0.5 : 1,
                      }}>✕</button>
                  </div>

                  {/* Name & room */}
                  <h3 style={{ margin: "0 0 3px", fontSize: "1rem", fontWeight: "700", color: "#f1f5f9", letterSpacing: "-0.01em" }}>{device.name}</h3>
                  <p style={{ margin: "0 0 14px", color: "#475569", fontSize: "0.75rem", fontWeight: "500" }}>{device.room}</p>

                  {/* Stats */}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "7px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#334155", fontSize: "0.74rem" }}>Power</span>
                      <span style={{ color: "#94a3b8", fontSize: "0.74rem", fontWeight: "600" }}>{device.power_w}W</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#334155", fontSize: "0.74rem" }}>Hourly Cost</span>
                      <span style={{ color: "#38bdf8", fontSize: "0.74rem", fontWeight: "700" }}>₹{hourlyCost.toFixed(2)}</span>
                    </div>

                    {/* Status + Toggle */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div className={isOn ? "pulse" : ""} style={{
                          width: "7px", height: "7px", borderRadius: "50%",
                          background: isOn ? "#4ade80" : "#ef4444",
                        }} />
                        <span style={{ fontSize: "0.7rem", fontWeight: "700", color: isOn ? "#4ade80" : "#ef4444", letterSpacing: "0.06em" }}>
                          {isOn ? "ACTIVE" : "OFFLINE"}
                        </span>
                      </div>

                      {/* Toggle switch */}
                      <button className="toggle-btn" onClick={() => handleToggle(device)} style={{
                        position: "relative", width: "44px", height: "24px", borderRadius: "12px",
                        background: isOn ? "#16a34a" : "rgba(255,255,255,0.1)",
                        border: isOn ? "1px solid rgba(74,222,128,0.4)" : "1px solid rgba(255,255,255,0.1)",
                        cursor: "pointer", padding: 0,
                        boxShadow: isOn ? "0 0 12px rgba(22,163,74,0.4)" : "none",
                      }}>
                        <span className="toggle-thumb" style={{
                          position: "absolute", top: "3px",
                          left: isOn ? "22px" : "3px",
                          width: "16px", height: "16px", borderRadius: "50%",
                          background: "#fff",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                        }} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── ADD DEVICE MODAL ── */}
      {showModal && (
        <div className="modal-overlay" style={{
          position: "fixed", inset: 0, zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)",
          padding: "16px",
        }} onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal-box" style={{
            width: "100%", maxWidth: "420px",
            background: "linear-gradient(145deg, #0d1627, #0a1020)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "24px", padding: "28px",
            boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(6,182,212,0.1)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: "800", letterSpacing: "-0.02em" }}>Add Device</h2>
                <p style={{ margin: "3px 0 0", color: "#475569", fontSize: "0.75rem" }}>Register a new smart device</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px", width: "32px", height: "32px",
                color: "#64748b", cursor: "pointer", fontSize: "0.8rem",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Name */}
              <input type="text" placeholder="Device Name (e.g. Bedroom AC)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: "12px",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)",
                  color: "#fff", fontSize: "0.85rem", outline: "none",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => e.target.style.borderColor = "rgba(6,182,212,0.5)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
              />

              {/* Room */}
              <select value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })}
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: "12px",
                  background: "#0d1627", border: "1px solid rgba(255,255,255,0.09)",
                  color: "#fff", fontSize: "0.85rem", outline: "none",
                  fontFamily: "inherit", cursor: "pointer",
                }}>
                {ROOM_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>

              {/* Type grid */}
              <div>
                <p style={{ margin: "0 0 8px", color: "#475569", fontSize: "0.72rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>Device Type</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                  {TYPE_OPTIONS.map((t) => (
                    <button key={t.value} className="type-btn"
                      onClick={() => setForm({ ...form, type: t.value, power_w: t.defaultW })}
                      title={t.label}
                      style={{
                        padding: "10px 6px", borderRadius: "12px", border: "none", cursor: "pointer",
                        background: form.type === t.value ? "rgba(6,182,212,0.15)" : "rgba(255,255,255,0.04)",
                        border: form.type === t.value ? "1px solid rgba(6,182,212,0.45)" : "1px solid rgba(255,255,255,0.07)",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                      }}>
                      <span style={{ fontSize: "1.3rem" }}>{t.icon}</span>
                      <span style={{ color: form.type === t.value ? "#38bdf8" : "#475569", fontSize: "0.6rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        {t.value === "washer" ? "Washer" : t.label.split(" ")[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wattage */}
              <div>
                <p style={{ margin: "0 0 6px", color: "#475569", fontSize: "0.72rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>Power (Watts)</p>
                <input type="number" value={form.power_w}
                  onChange={(e) => setForm({ ...form, power_w: parseInt(e.target.value) || 0 })}
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: "12px",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)",
                    color: "#fff", fontSize: "0.85rem", outline: "none",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(6,182,212,0.5)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
                />
              </div>

              {/* Submit */}
              <button onClick={handleAdd} disabled={!form.name.trim() || saving}
                style={{
                  width: "100%", padding: "13px", borderRadius: "12px", border: "none",
                  background: form.name.trim() && !saving
                    ? "linear-gradient(135deg, #0ea5e9, #6366f1)"
                    : "rgba(255,255,255,0.06)",
                  color: form.name.trim() && !saving ? "#fff" : "#334155",
                  fontWeight: "700", fontSize: "0.88rem", cursor: form.name.trim() && !saving ? "pointer" : "default",
                  transition: "all 0.2s", letterSpacing: "0.01em",
                  boxShadow: form.name.trim() && !saving ? "0 6px 20px rgba(14,165,233,0.3)" : "none",
                  fontFamily: "inherit",
                }}>
                {saving ? "Adding..." : `Add ${TYPE_OPTIONS.find(t => t.value === form.type)?.icon || ""} ${form.name || "Device"}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}