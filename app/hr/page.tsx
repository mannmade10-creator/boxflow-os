"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Employee = {
  id: string;
  name: string;
  role: string;
  department: string;
  shift: string;
  status: string;
  attendance: string;
  hours: number;
  pay_rate: number;
  performance: number;
  created_at?: string;
};

type EmployeeForm = {
  name: string;
  role: string;
  department: string;
  shift: string;
  status: string;
  attendance: string;
  hours: number;
  pay_rate: number;
  performance: number;
};

const emptyForm: EmployeeForm = {
  name: "",
  role: "",
  department: "Production",
  shift: "Day",
  status: "On Shift",
  attendance: "Present",
  hours: 40,
  pay_rate: 20,
  performance: 85,
};

export default function HRPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [form, setForm] = useState<EmployeeForm>(emptyForm);

  async function fetchEmployees() {
    setLoading(true);

    const { data, error } = await supabase
      .from("hr_employees")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch employees:", error.message);
      setEmployees([]);
    } else {
      setEmployees((data as Employee[]) || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function addEmployee() {
    setSaving(true);

    const newEmployee = {
      name: `New Employee ${employees.length + 1}`,
      role: "Operator",
      department: "Production",
      shift: "Day",
      status: "On Shift",
      attendance: "Present",
      hours: 40,
      pay_rate: 20,
      performance: 85,
    };

    const { error } = await supabase.from("hr_employees").insert([newEmployee]);

    if (error) {
      console.error("Failed to add employee:", error.message);
      alert(`Add employee failed: ${error.message}`);
    } else {
      await fetchEmployees();
    }

    setSaving(false);
  }

  async function deleteEmployee(id: string) {
    const confirmed = window.confirm("Delete this employee?");
    if (!confirmed) return;

    setDeletingId(id);

    const { error } = await supabase.from("hr_employees").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete employee:", error.message);
      alert(`Delete failed: ${error.message}`);
    } else {
      await fetchEmployees();
    }

    setDeletingId(null);
  }

  function openEditModal(employee: Employee) {
    setEditingId(employee.id);
    setForm({
      name: employee.name,
      role: employee.role,
      department: employee.department,
      shift: employee.shift,
      status: employee.status,
      attendance: employee.attendance,
      hours: Number(employee.hours || 0),
      pay_rate: Number(employee.pay_rate || 0),
      performance: Number(employee.performance || 0),
    });
    setEditOpen(true);
  }

  function closeEditModal() {
    setEditOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function saveEmployeeEdit() {
    if (!editingId) return;

    setEditSaving(true);

    const payload = {
      name: form.name,
      role: form.role,
      department: form.department,
      shift: form.shift,
      status: form.status,
      attendance: form.attendance,
      hours: Number(form.hours),
      pay_rate: Number(form.pay_rate),
      performance: Number(form.performance),
    };

    const { error } = await supabase
      .from("hr_employees")
      .update(payload)
      .eq("id", editingId);

    if (error) {
      console.error("Failed to update employee:", error.message);
      alert(`Update failed: ${error.message}`);
    } else {
      await fetchEmployees();
      closeEditModal();
    }

    setEditSaving(false);
  }

  const totalStaff = employees.length;
  const onShift = employees.filter((e) => e.status === "On Shift").length;
  const late = employees.filter((e) => e.status === "Late").length;
  const onLeave = employees.filter((e) => e.status === "On Leave").length;

  const payroll = useMemo(() => {
    return employees.reduce(
      (sum, emp) => sum + Number(emp.hours || 0) * Number(emp.pay_rate || 0),
      0
    );
  }, [employees]);

  const aiAlerts = useMemo(() => {
    const alerts: {
      level: "high" | "medium" | "low";
      title: string;
      detail: string;
    }[] = [];

    const lateEmployees = employees.filter((e) => e.status === "Late");
    lateEmployees.forEach((emp) => {
      alerts.push({
        level: "high",
        title: "Attendance Alert",
        detail: `${emp.name} is flagged late on ${emp.shift} shift.`,
      });
    });

    const overtimeEmployees = employees.filter((e) => Number(e.hours) > 45);
    overtimeEmployees.forEach((emp) => {
      alerts.push({
        level: "medium",
        title: "Overtime Risk",
        detail: `${emp.name} has ${emp.hours} hours logged this cycle.`,
      });
    });

    const lowPerformance = employees.filter((e) => Number(e.performance) < 80);
    lowPerformance.forEach((emp) => {
      alerts.push({
        level: "medium",
        title: "Performance Flag",
        detail: `${emp.name} performance is ${emp.performance}%.`,
      });
    });

    const leaveEmployees = employees.filter((e) => e.status === "On Leave");
    leaveEmployees.forEach((emp) => {
      alerts.push({
        level: "low",
        title: "Leave Tracking",
        detail: `${emp.name} is currently on approved leave.`,
      });
    });

    return alerts.slice(0, 6);
  }, [employees]);

  function alertStyle(level: "high" | "medium" | "low") {
    if (level === "high") {
      return {
        background: "rgba(239,68,68,0.14)",
        border: "1px solid rgba(239,68,68,0.35)",
      };
    }
    if (level === "medium") {
      return {
        background: "rgba(245,158,11,0.14)",
        border: "1px solid rgba(245,158,11,0.35)",
      };
    }
    return {
      background: "rgba(14,165,233,0.14)",
      border: "1px solid rgba(14,165,233,0.35)",
    };
  }

  function statusBadge(status: string) {
    const background =
      status === "Late"
        ? "#ef4444"
        : status === "On Leave"
        ? "#f59e0b"
        : status === "Off Duty"
        ? "#64748b"
        : "#10b981";

    return (
      <span
        style={{
          padding: "4px 10px",
          borderRadius: 6,
          background,
          color: "white",
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {status}
      </span>
    );
  }

  return (
    <main style={{ padding: "30px", color: "white" }}>
      <h1 style={{ fontSize: "32px", marginBottom: 10 }}>
        HR + Payroll Command
      </h1>

      <p style={{ opacity: 0.7, marginBottom: 25 }}>
        Workforce visibility across staffing, attendance, payroll, and performance.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 15,
          marginBottom: 25,
        }}
      >
        {[
          { label: "Total Staff", value: totalStaff },
          { label: "On Shift", value: onShift },
          { label: "Late", value: late },
          { label: "On Leave", value: onLeave },
          { label: "Payroll", value: `$${payroll.toLocaleString()}` },
        ].map((card, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.05)",
              padding: 20,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div style={{ opacity: 0.6 }}>{card.label}</div>
            <div style={{ fontSize: 24, fontWeight: "bold" }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginBottom: 24,
          background: "rgba(255,255,255,0.05)",
          borderRadius: 12,
          padding: 18,
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          AI Alerts
        </div>

        {aiAlerts.length === 0 ? (
          <div style={{ opacity: 0.7 }}>No active workforce alerts.</div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            {aiAlerts.map((alert, index) => (
              <div
                key={`${alert.title}-${index}`}
                style={{
                  borderRadius: 10,
                  padding: 14,
                  ...alertStyle(alert.level),
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{alert.title}</div>
                <div style={{ opacity: 0.85, fontSize: 14 }}>{alert.detail}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button
          onClick={addEmployee}
          disabled={saving}
          style={{
            padding: "10px 18px",
            borderRadius: 8,
            background: "#0ea5e9",
            border: "none",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Adding..." : "+ Add New Employee"}
        </button>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "rgba(255,255,255,0.08)" }}>
            <tr>
              {[
                "Name",
                "Role",
                "Department",
                "Shift",
                "Status",
                "Hours",
                "Rate",
                "Performance",
                "Action",
              ].map((h, i) => (
                <th
                  key={i}
                  style={{
                    padding: 12,
                    textAlign: "left",
                    fontSize: 12,
                    opacity: 0.7,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} style={{ padding: 16 }}>
                  Loading employees...
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: 16 }}>
                  No employees found. Click Add New Employee to create one.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr
                  key={emp.id}
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <td style={{ padding: 12 }}>{emp.name}</td>
                  <td>{emp.role}</td>
                  <td>{emp.department}</td>
                  <td>{emp.shift}</td>
                  <td>{statusBadge(emp.status)}</td>
                  <td>{emp.hours}</td>
                  <td>${Number(emp.pay_rate).toFixed(2)}/hr</td>
                  <td>{emp.performance}%</td>
                  <td style={{ padding: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      onClick={() => openEditModal(emp)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "none",
                        background: "#2563eb",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEmployee(emp.id)}
                      disabled={deletingId === emp.id}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "none",
                        background: "#dc2626",
                        color: "white",
                        cursor: "pointer",
                        opacity: deletingId === emp.id ? 0.7 : 1,
                      }}
                    >
                      {deletingId === emp.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2,6,23,0.72)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 720,
              background: "#0f172a",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.1)",
              padding: 22,
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                marginBottom: 18,
              }}
            >
              Edit Employee
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 14,
              }}
            >
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                style={inputStyle}
              />
              <input
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="Role"
                style={inputStyle}
              />
              <select
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                style={inputStyle}
              >
                <option>Production</option>
                <option>Fleet</option>
                <option>Dispatch</option>
                <option>Equipment</option>
                <option>HR</option>
                <option>Clients</option>
              </select>
              <select
                value={form.shift}
                onChange={(e) => setForm({ ...form, shift: e.target.value })}
                style={inputStyle}
              >
                <option>Day</option>
                <option>Night</option>
                <option>Swing</option>
              </select>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                style={inputStyle}
              >
                <option>On Shift</option>
                <option>Late</option>
                <option>On Leave</option>
                <option>Off Duty</option>
              </select>
              <input
                value={form.attendance}
                onChange={(e) => setForm({ ...form, attendance: e.target.value })}
                placeholder="Attendance"
                style={inputStyle}
              />
              <input
                type="number"
                value={form.hours}
                onChange={(e) =>
                  setForm({ ...form, hours: Number(e.target.value) })
                }
                placeholder="Hours"
                style={inputStyle}
              />
              <input
                type="number"
                step="0.01"
                value={form.pay_rate}
                onChange={(e) =>
                  setForm({ ...form, pay_rate: Number(e.target.value) })
                }
                placeholder="Pay Rate"
                style={inputStyle}
              />
              <input
                type="number"
                value={form.performance}
                onChange={(e) =>
                  setForm({ ...form, performance: Number(e.target.value) })
                }
                placeholder="Performance"
                style={{
                  ...inputStyle,
                  gridColumn: "span 2",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 20,
              }}
            >
              <button
                onClick={closeEditModal}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "transparent",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveEmployeeEdit}
                disabled={editSaving}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "none",
                  background: "#0ea5e9",
                  color: "white",
                  fontWeight: 700,
                  cursor: "pointer",
                  opacity: editSaving ? 0.7 : 1,
                }}
              >
                {editSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.04)",
  color: "white",
  outline: "none",
};