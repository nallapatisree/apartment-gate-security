"use client";

import React, { useMemo, useState } from "react";
import { useGateStore } from "@/lib/store";
import { flatLabel } from "@/lib/helpers";
import { Card, Field, Input, Select, Button, EmptyState, formatTime } from "@/components/ui";

type ReportType = "visitors" | "deliveries" | "vehicles" | "activity";

function toCsv(rows: Record<string, string | number>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (val: string | number) => `"${String(val).replace(/"/g, '""')}"`;
  const lines = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h] ?? "")).join(","))];
  return lines.join("\n");
}

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const flats = useGateStore((s) => s.flats);
  const visitors = useGateStore((s) => s.visitors);
  const deliveries = useGateStore((s) => s.deliveries);
  const vehicles = useGateStore((s) => s.vehicles);
  const audit = useGateStore((s) => s.audit);

  const [type, setType] = useState<ReportType>("visitors");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const inRange = (iso?: string) => {
    if (!iso) return false;
    const d = new Date(iso).getTime();
    if (from && d < new Date(from).getTime()) return false;
    if (to && d > new Date(to).getTime() + 86400000) return false;
    return true;
  };

  const rows = useMemo(() => {
    const hasRange = Boolean(from || to);
    if (type === "visitors") {
      return visitors
        .filter((v) => (hasRange ? inRange(v.createdAt) : true))
        .map((v) => ({
          Name: v.name,
          Mobile: v.mobile,
          Flat: flatLabel(flats, v.flatId),
          Type: v.type,
          Status: v.status,
          Requested: formatTime(v.createdAt),
        }));
    }
    if (type === "deliveries") {
      return deliveries
        .filter((d) => (hasRange ? inRange(d.entryAt) : true))
        .map((d) => ({
          Person: d.personName,
          Company: d.company,
          Flat: flatLabel(flats, d.flatId),
          Type: d.deliveryType,
          Entry: formatTime(d.entryAt),
          Exit: formatTime(d.exitAt),
        }));
    }
    if (type === "vehicles") {
      return vehicles.map((v) => ({
        Number: v.number,
        Owner: v.ownerName,
        Flat: flatLabel(flats, v.flatId),
        Type: v.type,
        Status: v.active ? "Active" : "Inactive",
      }));
    }
    return audit
      .filter((a) => (hasRange ? inRange(a.at) : true))
      .map((a) => ({ Actor: a.actor, Action: a.action, Detail: a.detail, At: formatTime(a.at) }));
  }, [type, visitors, deliveries, vehicles, audit, flats, from, to]);

  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <div>
      <h1 className="font-head text-xl font-semibold text-ink-800 mb-1">Reports</h1>
      <p className="text-sm text-ink-400 mb-4">Filter and export gate activity records.</p>

      <div className="flex flex-wrap items-end gap-3 mb-4">
        <Field label="Report">
          <Select value={type} onChange={(e) => setType(e.target.value as ReportType)} className="w-48">
            <option value="visitors">Visitor report</option>
            <option value="deliveries">Delivery report</option>
            <option value="vehicles">Vehicle report</option>
            <option value="activity">Gate activity log</option>
          </Select>
        </Field>
        <Field label="From">
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </Field>
        <Field label="To">
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </Field>
        <Button
          variant="secondary"
          className="mb-3"
          onClick={() => download(`${type}-report.csv`, toCsv(rows))}
          disabled={rows.length === 0}
        >
          Export CSV
        </Button>
      </div>

      <Card>
        {rows.length === 0 ? (
          <EmptyState text="No records match this filter." />
        ) : (
          <div className="overflow-x-auto ledger-scroll">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-400 border-b border-line">
                  {columns.map((c) => (
                    <th key={c} className="py-2 pr-4">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 100).map((r, i) => (
                  <tr key={i} className="border-b border-line last:border-0">
                    {columns.map((c) => (
                      <td key={c} className="py-2 pr-4 text-ink-800">
                        {r[c]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length > 100 && <p className="text-xs text-ink-400 mt-2">Showing first 100 of {rows.length} rows. Export CSV for the full set.</p>}
          </div>
        )}
      </Card>
    </div>
  );
}
