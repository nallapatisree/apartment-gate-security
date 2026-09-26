"use client";

import React from "react";
import { useGateStore, visitorStatusLabel } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { Card, Badge, EmptyState, formatTime } from "@/components/ui";

export default function HistoryPage() {
  const { user } = useAuth();
  const visitors = useGateStore((s) => s.visitors);
  const deliveries = useGateStore((s) => s.deliveries);

  const myVisitors = visitors
    .filter((v) => v.flatId === user?.flatId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const myDeliveries = deliveries
    .filter((d) => d.flatId === user?.flatId)
    .sort((a, b) => new Date(b.entryAt).getTime() - new Date(a.entryAt).getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-head text-xl font-semibold text-ink-800 mb-1">History</h1>
        <p className="text-sm text-ink-400 mb-4">Everything recorded for your flat.</p>
      </div>

      <Card title="Visitors">
        {myVisitors.length === 0 ? (
          <EmptyState text="No visitor history yet." />
        ) : (
          <ul className="divide-y divide-line">
            {myVisitors.map((v) => (
              <li key={v.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink-800">{v.name}</p>
                  <p className="text-xs text-ink-400">
                    {v.type} · {v.purpose} · {formatTime(v.createdAt)}
                  </p>
                </div>
                <Badge kind={v.status}>{visitorStatusLabel(v.status)}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Deliveries">
        {myDeliveries.length === 0 ? (
          <EmptyState text="No delivery history yet." />
        ) : (
          <ul className="divide-y divide-line">
            {myDeliveries.map((d) => (
              <li key={d.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink-800">
                    {d.personName} <span className="text-ink-400 font-normal">· {d.company}</span>
                  </p>
                  <p className="text-xs text-ink-400">{d.deliveryType} · {formatTime(d.entryAt)}</p>
                </div>
                <Badge kind={d.exitAt ? "exited" : "inside"}>{d.exitAt ? "Exited" : "At gate"}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
