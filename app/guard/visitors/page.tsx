"use client";

import React, { useMemo, useState } from "react";
import { useGateStore, visitorStatusLabel } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { flatLabel } from "@/lib/helpers";
import { Card, Input, Select, Badge, Button, EmptyState, formatTime } from "@/components/ui";
import { VisitorStatus } from "@/lib/types";

export default function GuardVisitorLog() {
  const { user } = useAuth();
  const visitors = useGateStore((s) => s.visitors);
  const flats = useGateStore((s) => s.flats);
  const recordEntry = useGateStore((s) => s.recordVisitorEntry);
  const recordExit = useGateStore((s) => s.recordVisitorExit);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<VisitorStatus | "all">("all");

  const filtered = useMemo(() => {
    return visitors
      .filter((v) => (status === "all" ? true : v.status === status))
      .filter((v) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          v.name.toLowerCase().includes(q) ||
          v.mobile.includes(q) ||
          flatLabel(flats, v.flatId).toLowerCase().includes(q) ||
          (v.vehicleNumber ?? "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [visitors, status, query, flats]);

  return (
    <div>
      <h1 className="font-head text-xl font-semibold text-ink-800 mb-1">Visitor log</h1>
      <p className="text-sm text-ink-400 mb-4">Search by name, mobile, flat number or vehicle number.</p>

      <div className="flex flex-wrap gap-2 mb-4">
        <Input
          placeholder="Search visitor…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs"
        />
        <Select value={status} onChange={(e) => setStatus(e.target.value as VisitorStatus | "all")} className="max-w-[180px]">
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="inside">Inside</option>
          <option value="exited">Exited</option>
        </Select>
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState text="No visitor records match." />
        ) : (
          <div className="overflow-x-auto ledger-scroll">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-400 border-b border-line">
                  <th className="py-2 pr-4">Visitor</th>
                  <th className="py-2 pr-4">Flat</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Vehicle</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Entry</th>
                  <th className="py-2 pr-4">Exit</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.id} className="border-b border-line last:border-0">
                    <td className="py-2 pr-4">
                      <p className="font-medium text-ink-800">{v.name}</p>
                      <p className="text-xs text-ink-400 font-mono">{v.mobile}</p>
                    </td>
                    <td className="py-2 pr-4">{flatLabel(flats, v.flatId)}</td>
                    <td className="py-2 pr-4 text-ink-600">{v.type}</td>
                    <td className="py-2 pr-4 font-mono text-xs">{v.vehicleNumber ?? "—"}</td>
                    <td className="py-2 pr-4">
                      <Badge kind={v.status}>{visitorStatusLabel(v.status)}</Badge>
                    </td>
                    <td className="py-2 pr-4 font-mono text-xs text-ink-400">{formatTime(v.entryAt)}</td>
                    <td className="py-2 pr-4 font-mono text-xs text-ink-400">{formatTime(v.exitAt)}</td>
                    <td className="py-2 pr-4">
                      {v.status === "approved" && (
                        <Button variant="secondary" onClick={() => recordEntry(v.id, user?.name ?? "Guard")}>
                          Record entry
                        </Button>
                      )}
                      {v.status === "inside" && (
                        <Button variant="secondary" onClick={() => recordExit(v.id, user?.name ?? "Guard")}>
                          Record exit
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
