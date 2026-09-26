"use client";

import React, { useState } from "react";
import { useGateStore } from "@/lib/store";
import { flatLabel } from "@/lib/helpers";
import { Card, Input, Badge, Button, EmptyState } from "@/components/ui";

export default function AdminVehiclesPage() {
  const flats = useGateStore((s) => s.flats);
  const vehicles = useGateStore((s) => s.vehicles);
  const toggleActive = useGateStore((s) => s.toggleVehicleActive);
  const [query, setQuery] = useState("");

  const filtered = vehicles.filter((v) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return v.number.toLowerCase().includes(q) || v.ownerName.toLowerCase().includes(q) || flatLabel(flats, v.flatId).toLowerCase().includes(q);
  });

  return (
    <div>
      <h1 className="font-head text-xl font-semibold text-ink-800 mb-1">Registered vehicles</h1>
      <p className="text-sm text-ink-400 mb-4">Every resident vehicle across the community.</p>

      <Input placeholder="Search by number, owner or flat…" value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-xs mb-4" />

      <Card>
        {filtered.length === 0 ? (
          <EmptyState text="No vehicles match." />
        ) : (
          <div className="overflow-x-auto ledger-scroll">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-400 border-b border-line">
                  <th className="py-2 pr-4">Number</th>
                  <th className="py-2 pr-4">Owner</th>
                  <th className="py-2 pr-4">Flat</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Slot</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.id} className="border-b border-line last:border-0">
                    <td className="py-2 pr-4 font-mono font-medium text-ink-800">{v.number}</td>
                    <td className="py-2 pr-4">{v.ownerName}</td>
                    <td className="py-2 pr-4">{flatLabel(flats, v.flatId)}</td>
                    <td className="py-2 pr-4 text-ink-600">{v.type}{v.brand ? ` · ${v.brand}` : ""}</td>
                    <td className="py-2 pr-4 font-mono text-xs">{v.parkingSlot ?? "—"}</td>
                    <td className="py-2 pr-4">
                      <Badge kind={v.active ? "approved" : "neutral"}>{v.active ? "Active" : "Inactive"}</Badge>
                    </td>
                    <td className="py-2 pr-4">
                      <Button variant="ghost" onClick={() => toggleActive(v.id)}>
                        {v.active ? "Deactivate" : "Activate"}
                      </Button>
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
