"use client";

import React from "react";
import { useGateStore } from "@/lib/store";
import { isSameDay } from "@/lib/helpers";
import { StatCard, Card, EmptyState, formatTime } from "@/components/ui";

export default function AdminDashboard() {
  const flats = useGateStore((s) => s.flats);
  const residents = useGateStore((s) => s.residents);
  const guards = useGateStore((s) => s.guards);
  const vehicles = useGateStore((s) => s.vehicles);
  const visitors = useGateStore((s) => s.visitors);
  const deliveries = useGateStore((s) => s.deliveries);
  const audit = useGateStore((s) => s.audit);

  const occupiedFlats = new Set(residents.map((r) => r.flatId)).size;
  const todayVisitors = visitors.filter((v) => isSameDay(v.createdAt)).length;
  const todayDeliveries = deliveries.filter((d) => isSameDay(d.entryAt)).length;
  const activeGuards = guards.filter((g) => g.active).length;
  const pendingApprovals = visitors.filter((v) => v.status === "pending").length;

  return (
    <div className="max-w-5xl">
      <h1 className="font-head text-xl font-semibold text-ink-800 mb-1">Community overview</h1>
      <p className="text-sm text-ink-400 mb-6">A snapshot of gate activity across every block.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard label="Total flats" value={flats.length} />
        <StatCard label="Occupied flats" value={occupiedFlats} />
        <StatCard label="Total residents" value={residents.length} />
        <StatCard label="Registered vehicles" value={vehicles.length} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Visitors today" value={todayVisitors} />
        <StatCard label="Deliveries today" value={todayDeliveries} />
        <StatCard label="Active guards" value={activeGuards} />
        <StatCard label="Pending approvals" value={pendingApprovals} accent="amber" />
      </div>

      <Card title="Recent gate activity log">
        {audit.length === 0 ? (
          <EmptyState text="No activity recorded yet." />
        ) : (
          <ul className="divide-y divide-line max-h-96 overflow-y-auto ledger-scroll">
            {audit.slice(0, 30).map((a) => (
              <li key={a.id} className="py-2 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-ink-800">
                    <span className="font-medium">{a.actor}</span> — {a.action}
                  </p>
                  <p className="text-xs text-ink-400">{a.detail}</p>
                </div>
                <p className="text-xs text-ink-300 font-mono shrink-0">{formatTime(a.at)}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
