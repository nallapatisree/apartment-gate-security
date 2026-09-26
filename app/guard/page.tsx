"use client";

import React from "react";
import Link from "next/link";
import { useGateStore, visitorStatusLabel } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { flatLabel, isSameDay } from "@/lib/helpers";
import { StatCard, Card, Badge, EmptyState, Button, formatTime } from "@/components/ui";

export default function GuardDashboard() {
  const { user } = useAuth();
  const visitors = useGateStore((s) => s.visitors);
  const deliveries = useGateStore((s) => s.deliveries);
  const flats = useGateStore((s) => s.flats);
  const recordExit = useGateStore((s) => s.recordVisitorExit);
  const recordEntry = useGateStore((s) => s.recordVisitorEntry);

  const todayVisitors = visitors.filter((v) => isSameDay(v.createdAt));
  const inside = visitors.filter((v) => v.status === "inside");
  const exited = visitors.filter((v) => v.status === "exited" && isSameDay(v.exitAt));
  const pending = visitors.filter((v) => v.status === "pending");
  const todayDeliveries = deliveries.filter((d) => isSameDay(d.entryAt));

  const recent = [...visitors]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-head text-xl font-semibold text-ink-800">Gate dashboard</h1>
          <p className="text-sm text-ink-400">Welcome back, {user?.name}. Here's today at the gate.</p>
        </div>
        <Link href="/guard/visitors/new">
          <Button>Register visitor</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatCard label="Visitors today" value={todayVisitors.length} />
        <StatCard label="Currently inside" value={inside.length} accent="blue" />
        <StatCard label="Exited today" value={exited.length} accent="green" />
        <StatCard label="Deliveries today" value={todayDeliveries.length} />
        <StatCard label="Pending approvals" value={pending.length} accent="amber" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Approvals awaiting resident response">
          {pending.length === 0 ? (
            <EmptyState text="No visitors waiting on approval." />
          ) : (
            <ul className="space-y-2">
              {pending.map((v) => (
                <li key={v.id} className="flex items-center justify-between border border-line rounded-sm px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-ink-800">{v.name}</p>
                    <p className="text-xs text-ink-400">{flatLabel(flats, v.flatId)} · {v.type}</p>
                  </div>
                  <Badge kind="pending">Waiting</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Inside the community">
          {inside.length === 0 ? (
            <EmptyState text="No visitors currently inside." />
          ) : (
            <ul className="space-y-2">
              {inside.map((v) => (
                <li key={v.id} className="flex items-center justify-between border border-line rounded-sm px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-ink-800">{v.name}</p>
                    <p className="text-xs text-ink-400 font-mono">{flatLabel(flats, v.flatId)} · in at {formatTime(v.entryAt)}</p>
                  </div>
                  <Button variant="secondary" onClick={() => recordExit(v.id, user?.name ?? "Guard")}>
                    Record exit
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card title="Recent gate activity" className="mt-4">
        {recent.length === 0 ? (
          <EmptyState text="No activity yet." />
        ) : (
          <div className="overflow-x-auto ledger-scroll">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-400 border-b border-line">
                  <th className="py-2 pr-4">Visitor</th>
                  <th className="py-2 pr-4">Flat</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Logged</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {recent.map((v) => (
                  <tr key={v.id} className="border-b border-line last:border-0">
                    <td className="py-2 pr-4 font-medium text-ink-800">{v.name}</td>
                    <td className="py-2 pr-4">{flatLabel(flats, v.flatId)}</td>
                    <td className="py-2 pr-4 text-ink-600">{v.type}</td>
                    <td className="py-2 pr-4">
                      <Badge kind={v.status}>{visitorStatusLabel(v.status)}</Badge>
                    </td>
                    <td className="py-2 pr-4 font-mono text-xs text-ink-400">{formatTime(v.createdAt)}</td>
                    <td className="py-2 pr-4">
                      {v.status === "approved" && (
                        <Button variant="secondary" onClick={() => recordEntry(v.id, user?.name ?? "Guard")}>
                          Record entry
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
