"use client";
import { useState, useEffect, useRef } from "react";

// ── Inline styles & keyframes injected once ──────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
    --bg: #020818;
    --surface: #070f24;
    --card: #0c1a38;
    --border: rgba(14,165,233,0.18);
    --blue: #0ea5e9;
    --blue-dim: rgba(14,165,233,0.12);
    --blue-glow: rgba(14,165,233,0.35);
    --cyan: #22d3ee;
    --green: #10b981;
    --amber: #f59e0b;
    --red: #ef4444;
    --purple: #8b5cf6;
    --text: #f0f6ff;
    --muted: #94a3b8;
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .roi-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--font-body);
    color: var(--text);
    position: relative;
    overflow-x: hidden;
  }

  .roi-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 50% at 20% -10%, rgba(14,165,233,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 110%, rgba(139,92,246,0.06) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  .roi-inner {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 24px 80px;
  }

  /* ── HEADER ── */
  .roi-header {
    padding: 48px 0 40px;
    text-align: center;
  }
  .roi-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--blue-dim);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 6px 16px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--blue);
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  .roi-badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--blue);
    animation: pulse-dot 2s ease-in-out infinite;
  }
  @keyframes pulse-dot {
    0%,100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }
  .roi-title {
    font-family: var(--font-display);
    font-size: clamp(32px, 5vw, 52px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 16px;
  }
  .roi-title span { color: var(--blue); }
  .roi-subtitle {
    font-size: 17px;
    color: var(--muted);
    max-width: 520px;
    margin: 0 auto;
    line-height: 1.6;
    font-weight: 300;
  }

  /* ── INDUSTRY PILLS ── */
  .industry-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    margin: 32px 0 40px;
  }
  .industry-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 100px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--muted);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-family: var(--font-body);
  }
  .industry-pill:hover { border-color: var(--blue); color: var(--text); }
  .industry-pill.active {
    background: var(--blue-dim);
    border-color: var(--blue);
    color: var(--blue);
  }
  .industry-pill .pill-icon { font-size: 16px; }

  /* ── MAIN GRID ── */
  .roi-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: start;
  }
  @media (max-width: 768px) {
    .roi-grid { grid-template-columns: 1fr; }
  }

  /* ── CARDS ── */
  .roi-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px;
    position: relative;
    overflow: hidden;
  }
  .roi-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--blue-glow), transparent);
  }
  .roi-card-title {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .roi-card-title-icon {
    width: 28px; height: 28px;
    border-radius: 8px;
    background: var(--blue-dim);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
  }

  /* ── SLIDERS ── */
  .slider-group { margin-bottom: 24px; }
  .slider-group:last-child { margin-bottom: 0; }
  .slider-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .slider-label-text {
    font-size: 14px;
    color: var(--text);
    font-weight: 500;
  }
  .slider-label-value {
    font-family: var(--font-display);
    font-size: 15px;
    font-weight: 700;
    color: var(--blue);
    background: var(--blue-dim);
    padding: 3px 10px;
    border-radius: 6px;
    border: 1px solid var(--border);
    min-width: 70px;
    text-align: center;
  }
  .slider-track {
    position: relative;
    height: 6px;
    background: rgba(255,255,255,0.08);
    border-radius: 100px;
    cursor: pointer;
  }
  .slider-fill {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    background: linear-gradient(90deg, var(--blue), var(--cyan));
    border-radius: 100px;
    transition: width 0.05s;
  }
  input[type=range].styled-range {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 6px;
    background: transparent;
    outline: none;
    cursor: pointer;
  }
  input[type=range].styled-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px; height: 20px;
    border-radius: 50%;
    background: var(--bg);
    border: 2px solid var(--blue);
    box-shadow: 0 0 12px var(--blue-glow);
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  input[type=range].styled-range::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 0 20px var(--blue-glow);
  }
  input[type=range].styled-range::-moz-range-thumb {
    width: 20px; height: 20px;
    border-radius: 50%;
    background: var(--bg);
    border: 2px solid var(--blue);
    cursor: pointer;
  }

  /* ── CURRENT SPEND BREAKDOWN ── */
  .spend-list { display: flex; flex-direction: column; gap: 10px; }
  .spend-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    border-radius: 10px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.05);
    font-size: 13px;
    transition: border-color 0.2s;
  }
  .spend-row:hover { border-color: var(--border); }
  .spend-row-name { color: var(--muted); display: flex; align-items: center; gap: 8px; }
  .spend-row-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--blue); }
  .spend-row-amount { font-weight: 600; color: var(--text); font-family: var(--font-display); }
  .spend-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px;
    border-radius: 10px;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    margin-top: 4px;
  }
  .spend-total-label { font-size: 13px; font-weight: 600; color: var(--red); }
  .spend-total-value { font-family: var(--font-display); font-weight: 800; font-size: 18px; color: var(--red); }

  /* ── RESULTS PANEL ── */
  .results-full {
    grid-column: 1 / -1;
  }
  .results-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 20px;
  }
  @media (max-width: 768px) {
    .results-grid { grid-template-columns: repeat(2, 1fr); }
  }
  .result-stat {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px;
    position: relative;
    overflow: hidden;
    text-align: center;
    transition: border-color 0.2s, transform 0.2s;
  }
  .result-stat:hover { border-color: var(--blue); transform: translateY(-2px); }
  .result-stat-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }
  .result-stat-value {
    font-family: var(--font-display);
    font-size: clamp(22px, 3vw, 30px);
    font-weight: 800;
    line-height: 1;
    margin-bottom: 6px;
  }
  .result-stat-sub { font-size: 12px; color: var(--muted); }
  .result-stat.highlight { border-color: var(--green); background: rgba(16,185,129,0.06); }
  .result-stat.highlight .result-stat-value { color: var(--green); }

  /* ── COMPARISON BAR ── */
  .comparison-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 20px;
  }
  .comparison-title {
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 700;
    color: var(--muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  .comp-row { margin-bottom: 16px; }
  .comp-row:last-child { margin-bottom: 0; }
  .comp-row-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 13px;
  }
  .comp-row-label { color: var(--muted); }
  .comp-row-value { font-weight: 600; font-family: var(--font-display); }
  .comp-bar-track {
    height: 10px;
    background: rgba(255,255,255,0.06);
    border-radius: 100px;
    overflow: hidden;
  }
  .comp-bar-fill {
    height: 100%;
    border-radius: 100px;
    transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* ── EMAIL CAPTURE ── */
  .email-card {
    background: linear-gradient(135deg, rgba(14,165,233,0.08), rgba(139,92,246,0.06));
    border: 1px solid var(--blue-glow);
    border-radius: 20px;
    padding: 28px;
    margin-bottom: 20px;
    text-align: center;
  }
  .email-card-title {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 800;
    margin-bottom: 8px;
  }
  .email-card-sub { font-size: 14px; color: var(--muted); margin-bottom: 20px; line-height: 1.5; }
  .email-form {
    display: flex;
    gap: 10px;
    max-width: 480px;
    margin: 0 auto;
  }
  @media (max-width: 540px) { .email-form { flex-direction: column; } }
  .email-input {
    flex: 1;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 14px;
    color: var(--text);
    font-family: var(--font-body);
    outline: none;
    transition: border-color 0.2s;
  }
  .email-input::placeholder { color: var(--muted); }
  .email-input:focus { border-color: var(--blue); }
  .email-btn {
    background: var(--blue);
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 12px 22px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    font-family: var(--font-display);
    white-space: nowrap;
    transition: background 0.2s, transform 0.15s;
    letter-spacing: 0.02em;
  }
  .email-btn:hover { background: var(--cyan); transform: scale(1.02); }
  .email-sent { color: var(--green); font-weight: 600; font-size: 14px; margin-top: 10px; }

  /* ── DEMO MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(2,8,24,0.85);
    backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal-box {
    background: var(--card);
    border: 1px solid var(--blue-glow);
    border-radius: 24px;
    padding: 40px;
    max-width: 480px;
    width: 100%;
    position: relative;
    animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes slideUp { from { opacity: 0; transform: translateY(40px) scale(0.95); } to { opacity: 1; transform: none; } }
  .modal-close {
    position: absolute; top: 16px; right: 16px;
    width: 32px; height: 32px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--border);
    color: var(--muted);
    font-size: 16px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .modal-close:hover { background: rgba(255,255,255,0.12); }
  .modal-savings-banner {
    background: rgba(16,185,129,0.1);
    border: 1px solid rgba(16,185,129,0.3);
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    margin-bottom: 24px;
  }
  .modal-savings-amt {
    font-family: var(--font-display);
    font-size: 36px;
    font-weight: 800;
    color: var(--green);
  }
  .modal-savings-label { font-size: 13px; color: var(--muted); margin-top: 4px; }
  .modal-title {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 800;
    margin-bottom: 8px;
    text-align: center;
  }
  .modal-sub { font-size: 14px; color: var(--muted); text-align: center; margin-bottom: 24px; line-height: 1.5; }
  .modal-field { margin-bottom: 14px; }
  .modal-label { font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; display: block; }
  .modal-input {
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 14px;
    font-size: 14px;
    color: var(--text);
    font-family: var(--font-body);
    outline: none;
    transition: border-color 0.2s;
  }
  .modal-input:focus { border-color: var(--blue); }
  .modal-cta {
    width: 100%;
    background: linear-gradient(135deg, var(--blue), var(--cyan));
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 16px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    font-family: var(--font-display);
    margin-top: 8px;
    transition: opacity 0.2s, transform 0.15s;
    letter-spacing: 0.02em;
  }
  .modal-cta:hover { opacity: 0.9; transform: scale(1.01); }
  .modal-terms { font-size: 11px; color: var(--muted); text-align: center; margin-top: 12px; }
`;

// ── Industry presets ────────────────────────────────────────────────────────
const INDUSTRIES = [
  { id: "logistics", label: "Logistics", icon: "🚚", trucks: 40, employees: 120, locations: 3, orders: 2000, otherSpend: 80000 },
  { id: "manufacturing", label: "Manufacturing", icon: "🏭", trucks: 15, employees: 250, locations: 2, orders: 1500, otherSpend: 120000 },
  { id: "healthcare", label: "Healthcare", icon: "🏥", trucks: 20, employees: 80, locations: 4, orders: 3000, otherSpend: 60000 },
  { id: "distribution", label: "Distribution", icon: "📦", trucks: 60, employees: 180, locations: 6, orders: 5000, otherSpend: 100000 },
  { id: "warehouse", label: "Warehouse", icon: "🏗️", trucks: 10, employees: 90, locations: 1, orders: 800, otherSpend: 40000 },
];

// ── Helpers ─────────────────────────────────────────────────────────────────
function fmt(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${Math.round(n)}`;
}
function fmtFull(n) {
  return "$" + Math.round(n).toLocaleString();
}

function calcSpend(trucks, employees, locations, orders, otherSpend) {
  const dispatch = Math.max(6000, trucks * 600);
  const fleet = Math.max(4800, trucks * 450);
  const hr = Math.max(3600, employees * 240);
  const analytics = Math.max(6000, locations * 8000);
  const portal = Math.max(4800, locations * 6000);
  const production = Math.max(9600, (orders / 1000) * 14400 + locations * 4800);
  return { dispatch, fleet, hr, analytics, portal, production, other: otherSpend };
}

function calcResults(spend) {
  const total = Object.values(spend).reduce((a, b) => a + b, 0);
  const boxflowCost = Math.max(24000, total * 0.19);
  const savings = total - boxflowCost;
  const productivity = savings * 0.42;
  const totalBenefit = savings + productivity;
  const paybackMonths = Math.max(1, Math.round((boxflowCost / 12) / (savings / 12) * 2));
  return { total, boxflowCost, savings, productivity, totalBenefit, paybackMonths };
}

// ── Animated number ──────────────────────────────────────────────────────────
function AnimNum({ value, prefix = "$", suffix = "" }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef(value);
  useEffect(() => {
    const start = ref.current;
    const end = value;
    const dur = 600;
    const startTime = performance.now();
    const step = (now) => {
      const p = Math.min((now - startTime) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (p < 1) requestAnimationFrame(step);
      else ref.current = end;
    };
    requestAnimationFrame(step);
  }, [value]);

  const formatted = display >= 1000000
    ? `${prefix}${(display / 1000000).toFixed(1)}M${suffix}`
    : display >= 1000
    ? `${prefix}${Math.round(display / 1000)}K${suffix}`
    : `${prefix}${display}${suffix}`;
  return <span>{formatted}</span>;
}

// ── Slider component ─────────────────────────────────────────────────────────
function Slider({ label, value, min, max, step, format, onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="slider-group">
      <div className="slider-label">
        <span className="slider-label-text">{label}</span>
        <span className="slider-label-value">{format(value)}</span>
      </div>
      <div style={{ position: "relative" }}>
        <div className="slider-track">
          <div className="slider-fill" style={{ width: `${pct}%` }} />
        </div>
        <input
          type="range" className="styled-range"
          min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ position: "absolute", inset: 0, opacity: 0, height: "100%", cursor: "pointer" }}
        />
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function ROICalculator() {
  const [industry, setIndustry] = useState(null);
  const [trucks, setTrucks] = useState(20);
  const [employees, setEmployees] = useState(50);
  const [locations, setLocations] = useState(3);
  const [orders, setOrders] = useState(200);
  const [otherSpend, setOtherSpend] = useState(500000);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalShown, setModalShown] = useState(false);
  const [demoName, setDemoName] = useState("");
  const [demoEmail, setDemoEmail] = useState("");
  const [demoCompany, setDemoCompany] = useState("");
  const [demoBooked, setDemoBooked] = useState(false);
  const resultsRef = useRef(null);

  const spend = calcSpend(trucks, employees, locations, orders, otherSpend);
  const results = calcResults(spend);

  // Fire modal after user interacts (once)
  useEffect(() => {
    if (!modalShown && (trucks !== 20 || employees !== 50 || locations !== 3)) {
      const timer = setTimeout(() => { setShowModal(true); setModalShown(true); }, 1200);
      return () => clearTimeout(timer);
    }
  }, [trucks, employees, locations, modalShown]);

  function applyIndustry(ind) {
    setIndustry(ind.id);
    setTrucks(ind.trucks);
    setEmployees(ind.employees);
    setLocations(ind.locations);
    setOrders(ind.orders);
    setOtherSpend(ind.otherSpend);
  }

  function handleEmailSend() {
    if (!email.includes("@")) return;
    setEmailSent(true);
  }

  function handleDemoBook() {
    if (!demoEmail.includes("@") || !demoName) return;
    setDemoBooked(true);
    setTimeout(() => setShowModal(false), 2000);
  }

  const spendItems = [
    { label: "Dispatch Software", value: spend.dispatch },
    { label: "Fleet Tracking", value: spend.fleet },
    { label: "HR Systems", value: spend.hr },
    { label: "Analytics Tools", value: spend.analytics },
    { label: "Client Portal", value: spend.portal },
    { label: "Production Mgmt", value: spend.production },
    { label: "Other Software", value: spend.other },
  ];

  const maxSpend = Math.max(results.total, results.boxflowCost);

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <div className="roi-root">
        <div className="roi-inner">

          {/* HEADER */}
          <div className="roi-header">
            <div className="roi-badge">
              <div className="roi-badge-dot" />
              Live ROI Calculator
            </div>
            <h1 className="roi-title">
              Stop Overpaying for<br />
              <span>Disconnected Software.</span>
            </h1>
            <p className="roi-subtitle">
              Tell us about your operation and see exactly how much BoxFlow OS saves you — every year.
            </p>
          </div>

          {/* INDUSTRY SELECTOR */}
          <div className="industry-row">
            {INDUSTRIES.map(ind => (
              <button
                key={ind.id}
                className={`industry-pill${industry === ind.id ? " active" : ""}`}
                onClick={() => applyIndustry(ind)}
              >
                <span className="pill-icon">{ind.icon}</span>
                {ind.label}
              </button>
            ))}
          </div>

          {/* MAIN GRID */}
          <div className="roi-grid">

            {/* SLIDERS */}
            <div className="roi-card">
              <div className="roi-card-title">
                <div className="roi-card-title-icon">⚙️</div>
                Your Operation
              </div>
              <Slider label="Number of Trucks / Vehicles" value={trucks} min={1} max={200} step={1} format={v => v} onChange={setTrucks} />
              <Slider label="Number of Employees" value={employees} min={5} max={500} step={5} format={v => v} onChange={setEmployees} />
              <Slider label="Number of Locations" value={locations} min={1} max={50} step={1} format={v => v} onChange={setLocations} />
              <Slider label="Orders Per Month" value={orders} min={10} max={10000} step={10} format={v => v >= 1000 ? `${(v/1000).toFixed(1)}K` : v} onChange={setOrders} />
              <Slider label="Other Annual Software Spend" value={otherSpend} min={0} max={10000000} step={10000} format={v => fmt(v)} onChange={setOtherSpend} />
            </div>

            {/* CURRENT SPEND BREAKDOWN */}
            <div className="roi-card">
              <div className="roi-card-title">
                <div className="roi-card-title-icon">💸</div>
                Estimated Current Annual Spend
              </div>
              <div className="spend-list">
                {spendItems.map(item => (
                  <div className="spend-row" key={item.label}>
                    <span className="spend-row-name">
                      <span className="spend-row-dot" />
                      {item.label}
                    </span>
                    <span className="spend-row-amount">{fmt(item.value)}/yr</span>
                  </div>
                ))}
                <div className="spend-total">
                  <span className="spend-total-label">Total Current Spend</span>
                  <span className="spend-total-value"><AnimNum value={results.total} /></span>
                </div>
              </div>
            </div>

            {/* RESULTS — full width */}
            <div className="roi-card results-full" ref={resultsRef}>
              <div className="roi-card-title">
                <div className="roi-card-title-icon">📈</div>
                Your Annual Savings with BoxFlow OS
              </div>

              <div className="results-grid">
                <div className="result-stat highlight">
                  <div className="result-stat-label">Annual Savings</div>
                  <div className="result-stat-value" style={{ color: "var(--green)" }}>
                    <AnimNum value={results.savings} />
                  </div>
                  <div className="result-stat-sub">per year</div>
                </div>
                <div className="result-stat">
                  <div className="result-stat-label">Monthly Savings</div>
                  <div className="result-stat-value" style={{ color: "var(--blue)" }}>
                    <AnimNum value={Math.round(results.savings / 12)} />
                  </div>
                  <div className="result-stat-sub">per month</div>
                </div>
                <div className="result-stat">
                  <div className="result-stat-label">Payback Period</div>
                  <div className="result-stat-value" style={{ color: "var(--amber)" }}>
                    {results.paybackMonths} mo
                  </div>
                  <div className="result-stat-sub">to break even</div>
                </div>
                <div className="result-stat">
                  <div className="result-stat-label">Total Annual Benefit</div>
                  <div className="result-stat-value" style={{ color: "var(--purple)" }}>
                    <AnimNum value={results.totalBenefit} />
                  </div>
                  <div className="result-stat-sub">incl. productivity gains</div>
                </div>
              </div>

              {/* COMPARISON BARS */}
              <div className="comparison-card">
                <div className="comparison-title">BoxFlow OS vs Your Current Stack</div>
                <div className="comp-row">
                  <div className="comp-row-header">
                    <span className="comp-row-label">Current Software Stack</span>
                    <span className="comp-row-value" style={{ color: "var(--red)" }}>{fmtFull(results.total)}/yr</span>
                  </div>
                  <div className="comp-bar-track">
                    <div className="comp-bar-fill" style={{ width: "100%", background: "linear-gradient(90deg, #ef4444, #f97316)" }} />
                  </div>
                </div>
                <div className="comp-row">
                  <div className="comp-row-header">
                    <span className="comp-row-label">BoxFlow OS</span>
                    <span className="comp-row-value" style={{ color: "var(--green)" }}>{fmtFull(results.boxflowCost)}/yr</span>
                  </div>
                  <div className="comp-bar-track">
                    <div className="comp-bar-fill"
                      style={{
                        width: `${(results.boxflowCost / results.total) * 100}%`,
                        background: "linear-gradient(90deg, var(--green), var(--cyan))"
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* EMAIL CAPTURE — full width */}
            <div className="email-card results-full">
              <h3 className="email-card-title">📩 Send Your Results to Your Inbox</h3>
              <p className="email-card-sub">
                Get a personalized savings report — with your exact numbers — sent directly to you.<br />
                Share it with your team or leadership before your demo call.
              </p>
              {!emailSent ? (
                <div className="email-form">
                  <input
                    className="email-input"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <button className="email-btn" onClick={handleEmailSend}>
                    Send My Report →
                  </button>
                </div>
              ) : (
                <p className="email-sent">✅ Report sent! Check your inbox.</p>
              )}
            </div>

            {/* BOOK DEMO CTA — full width */}
            <div className="results-full" style={{ textAlign: "center" }}>
              <button
                className="email-btn"
                style={{ padding: "18px 48px", fontSize: "16px", borderRadius: "14px", background: "linear-gradient(135deg, var(--blue), var(--cyan))" }}
                onClick={() => setShowModal(true)}
              >
                🚀 Book a Live Demo — See BoxFlow OS in Action
              </button>
              <p style={{ color: "var(--muted)", fontSize: "13px", marginTop: "12px" }}>
                No credit card required · 14-day free trial · Setup in 48 hours
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* DEMO MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal-box">
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>

            <div className="modal-savings-banner">
              <div className="modal-savings-amt">{fmtFull(results.savings)}/yr</div>
              <div className="modal-savings-label">estimated annual savings with BoxFlow OS</div>
            </div>

            {!demoBooked ? (
              <>
                <h2 className="modal-title">See It Live in Your Operation</h2>
                <p className="modal-sub">
                  Book a 30-minute demo. We'll show you BoxFlow OS running inside a business like yours — and give you a custom ROI breakdown before you hang up.
                </p>
                <div className="modal-field">
                  <label className="modal-label">Your Name</label>
                  <input className="modal-input" placeholder="Kenneth Covington" value={demoName} onChange={e => setDemoName(e.target.value)} />
                </div>
                <div className="modal-field">
                  <label className="modal-label">Work Email</label>
                  <input className="modal-input" type="email" placeholder="you@company.com" value={demoEmail} onChange={e => setDemoEmail(e.target.value)} />
                </div>
                <div className="modal-field">
                  <label className="modal-label">Company Name</label>
                  <input className="modal-input" placeholder="Acme Logistics" value={demoCompany} onChange={e => setDemoCompany(e.target.value)} />
                </div>
                <button className="modal-cta" onClick={handleDemoBook}>
                  Book My Free Demo →
                </button>
                <p className="modal-terms">No spam. No pressure. Just a 30-minute demo on your schedule.</p>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
                <h2 className="modal-title">You're Booked!</h2>
                <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.6" }}>
                  Check your inbox for confirmation. We'll see you on the call, {demoName.split(" ")[0] || "there"}.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}