export default function ClosePage() {
  const container: React.CSSProperties = {
    padding: 32,
    color: "white",
    maxWidth: 900,
    margin: "0 auto",
  };

  const card: React.CSSProperties = {
    background: "#111827",
    borderRadius: 14,
    padding: 24,
    marginBottom: 24,
  };

  const title: React.CSSProperties = {
    fontSize: 28,
    fontWeight: 900,
    marginBottom: 12,
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 10,
  };

  const highlight: React.CSSProperties = {
    fontSize: 26,
    fontWeight: 800,
    color: "#22c55e",
    marginTop: 10,
  };

  const button: React.CSSProperties = {
    marginTop: 20,
    padding: "14px 20px",
    borderRadius: 10,
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 16,
  };

  return (
    <div style={container}>
      <h1 style={title}>Executive Approval & Pilot Launch</h1>

      {/* VALUE SUMMARY */}
      <div style={card}>
        <div style={sectionTitle}>What This System Delivers</div>
        <p>• Real-time operational visibility across fleet + production</p>
        <p>• Faster dispatch and decision-making</p>
        <p>• Reduced fuel, idle time, and inefficiencies</p>
        <p>• Centralized control system for logistics + workflow</p>
      </div>

      {/* ROI */}
      <div style={card}>
        <div style={sectionTitle}>Expected Business Impact</div>
        <p>• 15–25% increase in operational efficiency</p>
        <p>• 10–18% cost reduction in logistics + fuel</p>
        <p>• Improved delivery speed + system visibility</p>

        <div style={highlight}>
          $180K – $420K Monthly Impact Potential
        </div>
      </div>

      {/* INVESTMENT */}
      <div style={card}>
        <div style={sectionTitle}>Pilot Investment</div>
        <p>• $50,000 One-Time Setup</p>
        <p>• $15,000 / Month (Pilot Phase)</p>

        <br />

        <div style={sectionTitle}>Enterprise Rollout</div>
        <p style={{ fontWeight: 700 }}>
          $35,000 – $75,000 / facility / month
        </p>
      </div>

      {/* STRATEGY */}
      <div style={card}>
        <div style={sectionTitle}>Recommended Next Step</div>
        <p>
          Launch a single-location pilot to validate performance,
          measure ROI, and establish operational benchmarks.
        </p>

        <br />

        <p>
          Upon validation, scale across additional facilities
          to maximize efficiency and profitability.
        </p>
      </div>

      {/* CLOSE BUTTONS */}
      <div style={card}>
        <div style={sectionTitle}>Next Action</div>

        <button
          style={{ ...button, background: "#22c55e", color: "black" }}
          onClick={() => alert("Pilot Approved")}
        >
          Approve Pilot Program
        </button>

        <button
          style={{ ...button, background: "#3b82f6", color: "white", marginLeft: 10 }}
          onClick={() => alert("Schedule Follow-Up")}
        >
          Schedule Follow-Up
        </button>
      </div>
    </div>
  );
}