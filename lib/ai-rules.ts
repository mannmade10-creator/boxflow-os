export type AISeverity = "info" | "warning" | "critical";
export type AISource = "fleet" | "production";

export type AIEvent = {
  id: string;
  source: AISource;
  severity: AISeverity;
  title: string;
  message: string;
  target?: string;
  createdAt: string;
};

export type FleetSignal = {
  truckId: string;
  truckName: string;
  status: "On Time" | "Delayed" | "Critical";
  alert?: string;
};

export type ProductionSignal = {
  lineId: string;
  lineName: string;
  status: "Running" | "Warning" | "Down";
  alert?: string;
};

export function buildFleetAIEvents(signals: FleetSignal[]): AIEvent[] {
  return signals.map((item) => ({
    id: `fleet-${item.truckId}`,
    source: "fleet",
    severity:
      item.status === "Critical"
        ? "critical"
        : item.status === "Delayed"
          ? "warning"
          : "info",
    title:
      item.status === "Critical"
        ? `${item.truckName} needs intervention`
        : item.status === "Delayed"
          ? `${item.truckName} is delayed`
          : `${item.truckName} is stable`,
    message:
      item.alert ||
      (item.status === "Critical"
        ? "Critical fleet issue detected."
        : item.status === "Delayed"
          ? "Fleet delay detected."
          : "Fleet operating normally."),
    target: item.truckName,
    createdAt: new Date().toISOString(),
  }));
}

export function buildProductionAIEvents(
  signals: ProductionSignal[]
): AIEvent[] {
  return signals.map((item) => ({
    id: `production-${item.lineId}`,
    source: "production",
    severity:
      item.status === "Down"
        ? "critical"
        : item.status === "Warning"
          ? "warning"
          : "info",
    title:
      item.status === "Down"
        ? `${item.lineName} is down`
        : item.status === "Warning"
          ? `${item.lineName} needs attention`
          : `${item.lineName} is stable`,
    message:
      item.alert ||
      (item.status === "Down"
        ? "Production downtime detected."
        : item.status === "Warning"
          ? "Production warning detected."
          : "Production operating normally."),
    target: item.lineName,
    createdAt: new Date().toISOString(),
  }));
}

export function mergeAIEvents(
  fleetEvents: AIEvent[],
  productionEvents: AIEvent[]
) {
  const priority = { critical: 0, warning: 1, info: 2 };

  return [...fleetEvents, ...productionEvents].sort((a, b) => {
    const p = priority[a.severity] - priority[b.severity];
    if (p !== 0) return p;
    return a.title.localeCompare(b.title);
  });
}

export function getAISeverityStyles(severity: AISeverity) {
  if (severity === "critical") {
    return {
      bg: "rgba(239,68,68,0.14)",
      border: "1px solid rgba(239,68,68,0.35)",
      color: "#fecaca",
      label: "Critical",
    };
  }

  if (severity === "warning") {
    return {
      bg: "rgba(245,158,11,0.14)",
      border: "1px solid rgba(245,158,11,0.35)",
      color: "#fde68a",
      label: "Warning",
    };
  }

  return {
    bg: "rgba(59,130,246,0.12)",
    border: "1px solid rgba(59,130,246,0.30)",
    color: "#bfdbfe",
    label: "Info",
  };
}