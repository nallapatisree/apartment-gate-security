"use client";

import React from "react";
import { useGateStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { isSameDay } from "@/lib/helpers";
import { StatCard, Card, Badge, EmptyState, Button, formatTime, timeAgo } from "@/components/ui";

export default function ResidentDashboard() {
  const { user } = useAuth();
  const visitors = useGateStore((s) => s.visitors);
  const deliveries = useGateStore((s) => s.deliveries);
  const respondToVisitor = useGateStore((s) => s.respondToVisitor);
  const notifications = useGateStore((s) => s.notifications);

  const flatId = user?.flatId;
  const myVisitors = visitors.filter((v) => v.flatId === flatId);
  const pending = myVisitors.filter((v) => v.status === "pending");
  const insideToday = myVisitors.filter((v) => v.status === "inside");
  const todayVisitorCount = myVisitors.filter((v) => isSameDay(v.createdAt)).length;
  const myDeliveries = deliveries.filter((d) => d.flatId === flatId);
  const todayDeliveries = myDeliveries.filter((d) => isSameDay(d.entryAt));
  const recentNotifications = notifications.filter((n) => n.toFlatId === flatId).slice(0, 5);

  return (
    <div className="max-w-4xl">
      <h1 className="font-head text-xl font-semibold text-ink-800 mb-1">Welcome, {user?.name}</h1>
      <p className="text-sm text-ink-400 mb-6">Here's what's happening at your gate today.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Visitors today" value={todayVisitorCount} />
        <StatCard label="Currently inside" value={insideToday.length} accent="blue" />
        <StatCard label="Pending approvals" value={pending.length} accent="amber" />
        <StatCard label="Deliveries today" value={todayDeliveries.length} />
      </div>

      <Card title="Visitors waiting for your approval">
        {pending.length === 0 ? (
          <EmptyState text="No one is waiting at the gate." />
        ) : (
          <ul className="space-y-3">
            {pending.map((v) => (
              <li key={v.id} className="border border-line rounded-sm px-4 py-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-ink-800">{v.name}</p>
                    <p className="text-xs text-ink-400 mt-0.5">
                      {v.type} · {v.purpose} · {v.peopleCount} {v.peopleCount > 1 ? "people" : "person"}
                      {v.vehicleNumber ? ` · ${v.vehicleNumber}` : ""}
                    </p>
                    <p className="text-xs text-ink-300 mt-0.5 font-mono">Arrived {timeAgo(v.createdAt)}</p>
                  </div>
                  <Badge kind="pending">Waiting</Badge>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button onClick={() => respondToVisitor(v.id, "approved", user?.name ?? "Resident")}>Approve</Button>
                  <Button variant="danger" onClick={() => respondToVisitor(v.id, "rejected", user?.name ?? "Resident")}>
                    Reject
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Recent notifications" className="mt-4">
        {recentNotifications.length === 0 ? (
          <EmptyState text="No notifications yet." />
        ) : (
          <ul className="divide-y divide-line">
            {recentNotifications.map((n) => (
              <li key={n.id} className="py-2.5 first:pt-0 last:pb-0">
                <p className="text-sm font-medium text-ink-800">{n.title}</p>
                <p className="text-xs text-ink-600">{n.body}</p>
                <p className="text-xs text-ink-400 font-mono mt-0.5">{formatTime(n.createdAt)}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
