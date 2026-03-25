export default function ROIPage() {
  const container: React.CSSProperties = {
    padding: 24,
    color: "white",
  };

  const card: React.CSSProperties = {
    background: "#111827",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  };

  const title: React.CSSProperties = {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 10,
  };

  const big: React.CSSProperties = {
    fontSize: 32,
    fontWeight: 800,
    color: "#22c55e",
  };

  return (
    <div style={container}>
      <h1 style={{ fontSize: 32, fontWeight: 900 }}>
        ROI Impact Dashboard
      </h1>

      <div style={card}>
        <div style={title}>Operational Gains</div>
        <p>• 15–25% improvement in routing efficiency</p>
        <p>• 10–18% reduction in fuel + idle waste</p>
        <p>• 20% faster dispatch decision making</p>
      </div>

      <div style={card}>
        <div style={title}>Financial Impact</div>
        <p>Estimated Monthly Savings:</p>
        <div style={big}>$180,000 – $420,000</div>
      </div>

      <div style={card}>
        <div style={title}>Investment Structure</div>
        <p>Pilot Program:</p>
        <p>• $50,000 one-time setup</p>
        <p>• $15,000/month (pilot phase)</p>

        <br />

        <p>Enterprise Rollout:</p>
        <p style={{ fontWeight: 700 }}>
          $35,000 – $75,000 / facility / month
        </p>
      </div>

      <div style={card}>
        <div style={title}>Return Timeline</div>
        <p>
          Most operations recover full investment within{" "}
          <strong>30–90 days</strong> of deployment.
        </p>
      </div>
    </div>
  );
}