import { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { useAuth } from "../context/AuthContext";

// ── Icons ──────────────────────────────────────────────────────────────────
const Icons = {
  Download:   () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>,
  Zap:        () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
  Solar:      () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7a5 5 0 100 10A5 5 0 0012 7zM2 13h2M20 13h2M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  Leaf:       () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 19.9L5.71 21l1-1.9A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s-1 4-3 7z"/></svg>,
  Battery:    () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>,
  Cost:       () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>,
  TrendUp:    () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.29 4.29-4-4L2 16.59 3.41 18 10 11.41l4 4 6.3-6.29L22 12V6z"/></svg>,
  Shield:     () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>,
  Clock:      () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 5v5.25l4.5 2.67-.75 1.23L11 13V7h1.5z"/></svg>,
  Print:      () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>,
};

// ── Gauge Component ────────────────────────────────────────────────────────
function Gauge({ value, max, color, label, unit }) {
  const pct = Math.min((value / max) * 100, 100);
  const r = 52, cx = 60, cy = 60;
  const circ = 2 * Math.PI * r;
  const stroke = circ * 0.75;
  const offset = stroke - (pct / 100) * stroke;
  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="80" viewBox="0 0 120 90">
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy}`}
          fill="none" stroke="#1e293b" strokeWidth="10" strokeLinecap="round"/>
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy}`}
          fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={stroke} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease" }}/>
        <text x={cx} y={cy - 2} textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
          {value}{unit}
        </text>
      </svg>
      <p className="text-xs text-gray-500 -mt-1">{label}</p>
    </div>
  );
}

// ── Score Ring ─────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const r = 70, cx = 80, cy = 80;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  const grade = score >= 90 ? "A+" : score >= 80 ? "A" : score >= 70 ? "B" : score >= 60 ? "C" : "D";
  return (
    <div className="relative flex items-center justify-center">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth="12"/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="12"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: "stroke-dashoffset 1.5s ease" }}/>
        <text x={cx} y={cy - 8} textAnchor="middle" fill="white" fontSize="28" fontWeight="bold">{score}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill={color} fontSize="13" fontWeight="600">Grade {grade}</text>
        <text x={cx} y={cy + 30} textAnchor="middle" fill="#64748b" fontSize="9">Efficiency Score</text>
      </svg>
    </div>
  );
}

// ── Stat Row ───────────────────────────────────────────────────────────────
function StatRow({ label, value, sub, accent }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <span className="text-gray-400 text-sm">{label}</span>
      <div className="text-right">
        <span className={`font-bold text-base ${accent}`}>{value}</span>
        {sub && <p className="text-xs text-gray-600">{sub}</p>}
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const reportRef = useRef(null);

  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchDashboard();
    const iv = setInterval(fetchDashboard, 30000);
    return () => clearInterval(iv);
  }, []);

  async function fetchDashboard() {
    try {
      const res = await fetch(`${API}/dashboard`);
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  function handleDownload() {
    window.print();
  }

  if (loading) return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto"/>
        <p className="text-gray-500 text-sm tracking-widest uppercase">Generating Report</p>
      </div>
    </div>
  );

  // ── Derived Metrics ──────────────────────────────────────────────────────
  const d = data || {};
  const solarCoverage = d.grid_power_kw > 0
    ? Math.min(((d.solar_generation_kw / d.grid_power_kw) * 100), 100).toFixed(0)
    : 0;
  const efficiencyScore = Math.round(
    (parseFloat(solarCoverage) * 0.4) +
    (d.battery_percent * 0.3) +
    (Math.min((d.co2_saved_kg / 10) * 100, 100) * 0.3)
  );
  const peakDemand = ((d.grid_power_kw || 0) + (d.solar_generation_kw || 0)).toFixed(1);
  const selfSufficiency = d.grid_power_kw > 0
    ? ((d.solar_generation_kw / (d.grid_power_kw + d.solar_generation_kw)) * 100).toFixed(0)
    : 0;
  const projMonthCost = ((d.today_cost_inr || 0) * 30).toFixed(0);
  const treesEquiv = ((d.co2_saved_kg || 0) * 45).toFixed(0);

  // ── Chart Data ───────────────────────────────────────────────────────────
  const energyMixData = [
    { name: "Solar",   value: parseFloat(d.solar_generation_kw) || 0,   color: "#f59e0b" },
    { name: "Grid",    value: parseFloat(d.grid_power_kw) || 0,         color: "#06b6d4" },
    { name: "Battery", value: ((d.battery_percent || 0) / 100) * 2,    color: "#10b981" },
  ];
  const hourlyTrend = [
    { t: "00:00", grid: 1.2, solar: 0 },
    { t: "04:00", grid: 0.9, solar: 0 },
    { t: "08:00", grid: 2.1, solar: 0.8 },
    { t: "10:00", grid: 2.4, solar: 1.6 },
    { t: "12:00", grid: 3.1, solar: 2.4 },
    { t: "14:00", grid: 3.4, solar: 2.1 },
    { t: "16:00", grid: 2.8, solar: 1.5 },
    { t: "18:00", grid: 3.2, solar: 0.3 },
    { t: "20:00", grid: 2.7, solar: 0 },
    { t: "Now",   grid: parseFloat(d.grid_power_kw) || 3.4, solar: parseFloat(d.solar_generation_kw) || 0 },
  ];
  const savingsBreakdown = [
    { name: "Solar Offset", value: 38, color: "#f59e0b" },
    { name: "Off-Peak Use", value: 27, color: "#06b6d4" },
    { name: "Efficiency",   value: 21, color: "#10b981" },
    { name: "Battery",      value: 14, color: "#8b5cf6" },
  ];

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const timeStr = lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* ── Print Styles ────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700;900&display=swap');
        @keyframes blob {
          0%,100%{transform:translate(0,0) scale(1)}
          33%{transform:translate(30px,-50px) scale(1.1)}
          66%{transform:translate(-20px,20px) scale(0.9)}
        }
        .animate-blob{animation:blob 7s infinite}
        .delay-2{animation-delay:2s}
        .delay-4{animation-delay:4s}
        .font-display { font-family: 'Playfair Display', serif; }
        .font-mono-custom { font-family: 'DM Mono', monospace; }

        @media print {
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-page { background: white !important; color: #0f172a !important; }
          .print-card {
            border: 1px solid #e2e8f0 !important;
            background: white !important;
            box-shadow: none !important;
            break-inside: avoid;
          }
          .print-text { color: #0f172a !important; }
          .print-sub { color: #475569 !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div ref={reportRef} className="w-full min-h-screen bg-[#030712] print-page">
        {/* ── Background ────────────────────────────────────────────────── */}
        <div className="fixed inset-0 pointer-events-none no-print">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-3xl animate-blob"/>
          <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-blob delay-2"/>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-blob delay-4"/>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.015)_1px,transparent_1px)] bg-[size:40px_40px]"/>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">

          {/* ── Report Header ─────────────────────────────────────────── */}
          <div className="flex items-start justify-between mb-10 pb-8 border-b border-white/5">
            <div>
              {/* Report label */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full"/>
                <span className="text-xs font-mono-custom tracking-[0.25em] text-cyan-400 uppercase">
                  Energy Intelligence Report
                </span>
              </div>
              <h1 className="font-display text-5xl font-black text-white leading-tight print-text">
                Home Energy<br/>
                <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Status Report
                </span>
              </h1>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Icons.Clock/> Generated {dateStr} at {timeStr}
                </span>
                <span className="w-1 h-1 bg-gray-600 rounded-full"/>
                <span>Account: {user?.name || "User"}</span>
                <span className="w-1 h-1 bg-gray-600 rounded-full"/>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"/>
                  Live Data
                </span>
              </div>
            </div>

            {/* Download button */}
            <div className="flex gap-3 no-print">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:border-cyan-500/40 hover:text-white text-sm transition-all"
              >
                <Icons.Print/> Print
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-105"
              >
                <Icons.Download/> Download PDF
              </button>
            </div>
          </div>

          {/* ── Section 1: Executive Summary ───────────────────────────── */}
          <div className="mb-8">
            <SectionLabel number="01" title="Executive Summary"/>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {[
                { icon: <Icons.Zap/>,    label: "Grid Power",       value: `${d.grid_power_kw} kW`,        sub: d.grid_status,          color: "text-cyan-400",    bg: "from-cyan-500/10 to-cyan-500/5",    border: "border-cyan-500/20" },
                { icon: <Icons.Solar/>,  label: "Solar Output",     value: `${d.solar_generation_kw} kW`,  sub: d.solar_status,         color: "text-amber-400",   bg: "from-amber-500/10 to-amber-500/5",  border: "border-amber-500/20" },
                { icon: <Icons.Cost/>,   label: "Today's Cost",     value: `₹${d.today_cost_inr}`,         sub: `₹${projMonthCost}/mo est.`,  color: "text-purple-400",  bg: "from-purple-500/10 to-purple-500/5", border: "border-purple-500/20" },
                { icon: <Icons.Leaf/>,   label: "CO₂ Saved",        value: `${d.co2_saved_kg} kg`,         sub: `≈ ${treesEquiv} mins of tree`, color: "text-emerald-400", bg: "from-emerald-500/10 to-emerald-500/5", border: "border-emerald-500/20" },
              ].map((c, i) => (
                <div key={i} className={`p-5 rounded-2xl border ${c.border} bg-gradient-to-br ${c.bg} backdrop-blur-sm print-card`}>
                  <div className={`${c.color} mb-3`}>{c.icon}</div>
                  <p className="text-gray-400 text-xs mb-1">{c.label}</p>
                  <p className={`text-2xl font-bold font-mono-custom ${c.color}`}>{c.value}</p>
                  <p className="text-gray-600 text-xs mt-1 capitalize">{c.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Section 2: Efficiency Score + Gauges ───────────────────── */}
          <div className="mb-8">
            <SectionLabel number="02" title="System Performance"/>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">

              {/* Score */}
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm flex flex-col items-center justify-center print-card">
                <p className="text-xs tracking-widest text-gray-500 uppercase mb-4">Overall Rating</p>
                <ScoreRing score={efficiencyScore}/>
                <div className="mt-4 text-center">
                  <p className="text-gray-400 text-xs">Based on solar coverage, battery health & CO₂ reduction</p>
                </div>
              </div>

              {/* Gauges */}
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm print-card">
                <p className="text-xs tracking-widest text-gray-500 uppercase mb-5">Live Gauges</p>
                <div className="grid grid-cols-2 gap-4">
                  <Gauge value={d.battery_percent || 0}   max={100} color="#10b981" label="Battery"      unit="%"/>
                  <Gauge value={parseInt(solarCoverage)}  max={100} color="#f59e0b" label="Solar Cover"  unit="%"/>
                  <Gauge value={parseFloat(peakDemand)}   max={10}  color="#06b6d4" label="Peak Demand"  unit="kW"/>
                  <Gauge value={parseInt(selfSufficiency)} max={100} color="#8b5cf6" label="Self-Suff."  unit="%"/>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm print-card">
                <p className="text-xs tracking-widest text-gray-500 uppercase mb-4">Key Indicators</p>
                <StatRow label="Today's Usage"       value={`${d.today_usage_kwh} kWh`}    accent="text-blue-400"/>
                <StatRow label="Solar Generated"     value={`${d.today_solar_kwh} kWh`}    accent="text-amber-400"/>
                <StatRow label="Net Consumption"     value={`${d.net_consumption_kw} kW`}   accent="text-purple-400"/>
                <StatRow label="Solar Coverage"      value={`${solarCoverage}%`}            accent="text-emerald-400"/>
                <StatRow label="Self-Sufficiency"    value={`${selfSufficiency}%`}          accent="text-cyan-400"/>
                <StatRow label="Peak Demand"         value={`${peakDemand} kW`}             accent="text-rose-400"/>
                <StatRow label="Projected Mo. Cost"  value={`₹${projMonthCost}`}           accent="text-purple-400"/>
              </div>
            </div>
          </div>

          {/* ── Section 3: Energy Flow Chart ───────────────────────────── */}
          <div className="mb-8">
            <SectionLabel number="03" title="24-Hour Energy Flow"/>
            <div className="mt-4 p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm print-card">
              <div className="flex items-center gap-6 mb-6 text-xs text-gray-500">
                <span className="flex items-center gap-2"><span className="w-3 h-1 bg-cyan-400 rounded inline-block"/>Grid Power</span>
                <span className="flex items-center gap-2"><span className="w-3 h-1 bg-amber-400 rounded inline-block"/>Solar Generation</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={hourlyTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                  <XAxis dataKey="t" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} unit=" kW"/>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#fff", fontSize: 12 }}
                    formatter={(v, n) => [`${v} kW`, n === "grid" ? "Grid" : "Solar"]}
                  />
                  <Area type="monotone" dataKey="grid"  stroke="#06b6d4" strokeWidth={2} fill="url(#gridGrad)"  dot={false}/>
                  <Area type="monotone" dataKey="solar" stroke="#f59e0b" strokeWidth={2} fill="url(#solarGrad)" dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Section 4: Energy Mix + Savings ────────────────────────── */}
          <div className="mb-8">
            <SectionLabel number="04" title="Energy Composition & Savings Analysis"/>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">

              {/* Pie — Energy Mix */}
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm print-card">
                <p className="text-sm font-semibold text-gray-300 mb-1">Live Energy Mix</p>
                <p className="text-xs text-gray-600 mb-4">Current power source distribution</p>
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie data={energyMixData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                        dataKey="value" paddingAngle={3}>
                        {energyMixData.map((e, i) => <Cell key={i} fill={e.color} strokeWidth={0}/>)}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", fontSize: 12 }}
                        formatter={(v) => [`${v} kW`]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3 flex-1">
                    {energyMixData.map((e, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.color }}/>
                          <span className="text-sm text-gray-400">{e.name}</span>
                        </div>
                        <span className="text-sm font-bold text-white font-mono-custom">{e.value.toFixed(1)} kW</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Renewable %</span>
                        <span className="text-sm font-bold text-emerald-400 font-mono-custom">{selfSufficiency}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pie — Savings */}
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm print-card">
                <p className="text-sm font-semibold text-gray-300 mb-1">Savings Breakdown</p>
                <p className="text-xs text-gray-600 mb-4">Where your cost savings come from</p>
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie data={savingsBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                        dataKey="value" paddingAngle={3}>
                        {savingsBreakdown.map((e, i) => <Cell key={i} fill={e.color} strokeWidth={0}/>)}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", fontSize: 12 }}
                        formatter={(v) => [`${v}%`]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3 flex-1">
                    {savingsBreakdown.map((e, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.color }}/>
                          <span className="text-sm text-gray-400">{e.name}</span>
                        </div>
                        <span className="text-sm font-bold text-white font-mono-custom">{e.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 5: Recommendations ─────────────────────────────── */}
          <div className="mb-8">
            <SectionLabel number="05" title="Recommendations & Insights"/>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {[
                {
                  icon: <Icons.TrendUp/>,
                  color: "text-cyan-400", border: "border-cyan-500/20", bg: "from-cyan-500/5",
                  title: "Shift Peak Load",
                  body: `Your grid draw peaks at ${peakDemand} kW. Schedule heavy appliances (washing machine, dishwasher) between 10 AM–2 PM to maximise solar offset.`
                },
                {
                  icon: <Icons.Battery/>,
                  color: "text-emerald-400", border: "border-emerald-500/20", bg: "from-emerald-500/5",
                  title: "Battery Optimisation",
                  body: `Battery at ${d.battery_percent}%. Consider charging to 90% during solar peak to avoid grid draw after sunset and cut evening costs by ~18%.`
                },
                {
                  icon: <Icons.Shield/>,
                  color: "text-amber-400", border: "border-amber-500/20", bg: "from-amber-500/5",
                  title: "Efficiency Target",
                  body: `Your self-sufficiency is ${selfSufficiency}%. Increasing solar panel capacity by 1 kW could push this above 70%, qualifying for Tier-2 green subsidies.`
                },
              ].map((r, i) => (
                <div key={i} className={`p-5 rounded-2xl border ${r.border} bg-gradient-to-br ${r.bg} to-transparent backdrop-blur-sm print-card`}>
                  <div className={`${r.color} mb-3`}>{r.icon}</div>
                  <p className="text-white font-semibold text-sm mb-2">{r.title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{r.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Section 6: Environmental Impact ────────────────────────── */}
          <div className="mb-8">
            <SectionLabel number="06" title="Environmental Impact"/>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {[
                { label: "CO₂ Avoided Today",    value: `${d.co2_saved_kg} kg`,         sub: "vs. grid-only usage",   color: "text-emerald-400" },
                { label: "Trees Equivalent",      value: `${treesEquiv} min`,            sub: "of O₂ production",      color: "text-green-400"   },
                { label: "Solar Units Generated", value: `${d.today_solar_kwh} kWh`,    sub: "clean energy today",    color: "text-amber-400"   },
                { label: "Green Score",           value: `${efficiencyScore}/100`,       sub: "household rating",      color: "text-cyan-400"    },
              ].map((e, i) => (
                <div key={i} className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] text-center print-card">
                  <p className={`text-2xl font-bold font-mono-custom ${e.color}`}>{e.value}</p>
                  <p className="text-white text-xs font-semibold mt-2">{e.label}</p>
                  <p className="text-gray-600 text-xs mt-1">{e.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Footer ─────────────────────────────────────────────────── */}
          <div className="border-t border-white/5 pt-6 flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded flex items-center justify-center">
                <Icons.Zap/>
              </div>
              <span className="font-semibold text-gray-400">VoltStream</span>
              <span>· Energy Intelligence Platform</span>
            </div>
            <span className="font-mono-custom">Report ID: VS-{now.getTime().toString(36).toUpperCase()}</span>
            <span>Data refreshes every 30s · {dateStr}</span>
          </div>

        </div>
      </div>
    </>
  );
}

// ── Section Label ──────────────────────────────────────────────────────────
function SectionLabel({ number, title }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono-custom text-xs text-cyan-500/60 tracking-widest">{number}</span>
      <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"/>
      <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">{title}</span>
      <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent"/>
    </div>
  );
}