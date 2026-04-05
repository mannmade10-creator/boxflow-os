"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [fleet, setFleet] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  async function loadAll() {
    const [o, l, f, a] = await Promise.all([
      supabase.from("orders").select("*"),
      supabase.from("production_lines").select("*"),
      supabase.from("fleet").select("*"),
      supabase.from("machine_alerts").select("*").eq("resolved", false),
    ]);

    setOrders(o.data || []);
    setLines(l.data || []);
    setFleet(f.data || []);
    setAlerts(a.data || []);
  }

  useEffect(() => {
    loadAll();

    const channel = supabase
      .channel("admin-live")
      .on("postgres_changes", { event: "*", schema: "public" }, () => {
        loadAll();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 🔥 AI GLOBAL ACTIONS

  async function aiFixProduction() {
    setMessage("AI optimizing production...");

    await supabase
      .from("production_lines")
      .update({ status: "Running", downtime_minutes: 0 });

    await supabase
      .from("machine_alerts")
      .update({ resolved: true })
      .eq("resolved", false);

    setMessage("Production stabilized by AI.");
  }

  async function aiDispatchAll() {
    setMessage("AI dispatching all orders...");

    const availableTruck = fleet[0];

    if (!availableTruck) {
      setMessage("No trucks available.");
      return;
    }

    for (let order of orders) {
      await supabase
        .from("orders")
        .update({
          assigned_truck: availableTruck.truck_name,
          dispatch_status: "Assigned",
        })
        .eq("id", order.id);
    }

    setMessage("All orders dispatched.");
  }

  async function aiBoostRush() {
    setMessage("Boosting rush orders...");

    await supabase
      .from("orders")
      .update({ priority: "Rush" })
      .eq("priority", "High");

    setMessage("Rush priority boosted.");
  }

  async function emergencyReset() {
    setMessage("SYSTEM RESET INITIATED...");

    await supabase.from("machine_alerts").update({ resolved: true });

    await supabase.from("production_lines").update({
      downtime_minutes: 0,
      status: "Running",
    });

    await supabase.from("orders").update({
      dispatch_status: "Pending",
    });

    setMessage("System reset complete.");
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.nav}>
          <NavButton href="/command-center" label="Command Center" />
          <NavButton href="/production" label="Production Flow" />
          <NavButton href="/analytics" label="Analytics" />
          <NavButton href="/fleet" label="Fleet" />
          <NavButton href="/dispatch" label="Dispatch" />
        </div>

        <h1 style={styles.title}>Admin Control Center</h1>

        {message && <Panel>{message}</Panel>}

        {/* METRICS */}
        <div style={styles.grid}>
          <Card title="Orders" value={orders.length} />
          <Card title="Production Lines" value={lines.length} />
          <Card title="Fleet Units" value={fleet.length} />
          <Card title="Active Alerts" value={alerts.length} />
        </div>

        {/* AI CONTROL */}
        <div style={styles.section}>
          <h2>AI Control Panel</h2>

          <div style={styles.buttonRow}>
            <Action label="Fix Production" color="#22c55e" onClick={aiFixProduction} />
            <Action label="Dispatch All Orders" color="#2563eb" onClick={aiDispatchAll} />
            <Action label="Boost Rush Orders" color="#f59e0b" onClick={aiBoostRush} />
            <Action label="Emergency Reset" color="#ef4444" onClick={emergencyReset} />
          </div>
        </div>

        {/* SYSTEM OVERVIEW */}
        <div style={styles.section}>
          <h2>System Overview</h2>

          <p>Total Orders: {orders.length}</p>
          <p>Active Production Lines: {lines.length}</p>
          <p>Fleet Size: {fleet.length}</p>
          <p>Open Alerts: {alerts.length}</p>
        </div>
      </div>
    </main>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "#04112b",
    color: "white",
    padding: 24,
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
  },
  nav: {
    display: "flex",
    gap: 12,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  title: {
    fontSize: 34,
    marginBottom: 20,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
    gap: 16,
    marginBottom: 24,
  },
  section: {
    background: "#091a3c",
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
  },
  buttonRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 10,
  },
};

function NavButton({ href, label }: any) {
  return (
    <a href={href} style={btnStyle}>
      {label}
    </a>
  );
}

function Action({ label, color, onClick }: any) {
  return (
    <button
      onClick={onClick}
      style={{ ...btnStyle, background: color }}
    >
      {label}
    </button>
  );
}

function Card({ title, value }: any) {
  return (
    <div style={panelStyle}>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

function Panel({ children }: any) {
  return <div style={panelStyle}>{children}</div>;
}

const btnStyle = {
  padding: "10px 16px",
  background: "#2563eb",
  borderRadius: 8,
  textDecoration: "none",
  color: "white",
  fontWeight: 600,
  border: "none",
  cursor: "pointer",
};

const panelStyle = {
  background: "#091a3c",
  border: "1px solid #334155",
  borderRadius: 16,
  padding: 18,
};