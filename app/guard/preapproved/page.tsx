"use client";

import React, { useMemo, useState } from "react";
import { useGateStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { flatLabel } from "@/lib/helpers";
import { Card, Input, Badge, Button, EmptyState, formatTime } from "@/components/ui";

export default function PreApprovedPage() {
  const { user } = useAuth();
  const visitors = useGateStore((s) => s.visitors);
  const flats = useGateStore((s) => s.flats);
  const checkIn = useGateStore((s) => s.checkInPreApproved);

  const [query, setQuery] = useState("");

  const preApproved = useMemo(
    () =>
      visitors
        .filter((v) => v.preApproved)
        .filter((v) => {
          const notExpired = !v.validUntil || new Date(v.validUntil) >= new Date();
          if (!query.trim()) return notExpired;
          const q = query.toLowerCase();
          return notExpired && (v.name.toLowerCase().includes(q) || v.mobile.includes(q) || flatLabel(flats, v.flatId).toLowerCase().includes(q));
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [visitors, query, flats]
  );

  return (
    <div>
      <h1 className="font-head text-xl font-semibold text-ink-800 mb-1">Pre-approved visitors</h1>
      <p className="text-sm text-ink-400 mb-4">Verify against the resident's advance registration, then check them in.</p>

      <Input placeholder="Search by name, mobile or flat…" value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-xs mb-4" />

      <Card>
        {preApproved.length === 0 ? (
          <EmptyState text="No active pre-approved visitors." />
        ) : (
          <ul className="space-y-2">
            {preApproved.map((v) => (
              <li key={v.id} className="flex items-center justify-between border border-line rounded-sm px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-ink-800">{v.name}</p>
                  <p className="text-xs text-ink-400">
                    {flatLabel(flats, v.flatId)} · {v.purpose} · valid until {v.validUntil ? formatTime(v.validUntil) : "no expiry"}
                  </p>
                </div>
                {v.status === "inside" ? (
                  <Badge kind="inside">Checked in</Badge>
                ) : (
                  <Button variant="secondary" onClick={() => checkIn(v.id, user?.name ?? "Guard")}>
                    Check in
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
