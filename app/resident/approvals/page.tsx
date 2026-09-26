"use client";

import React from "react";
import { useGateStore, visitorStatusLabel } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { Card, Badge, EmptyState, Button, formatTime } from "@/components/ui";

export default function ApprovalsPage() {
  const { user } = useAuth();
  const visitors = useGateStore((s) => s.visitors);
  const respondToVisitor = useGateStore((s) => s.respondToVisitor);

  const mine = [...visitors]
    .filter((v) => v.flatId === user?.flatId && !v.preApproved)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div>
      <h1 className="font-head text-xl font-semibold text-ink-800 mb-1">Approvals</h1>
      <p className="text-sm text-ink-400 mb-4">Every visitor request sent to your flat, and how you responded.</p>

      <Card>
        {mine.length === 0 ? (
          <EmptyState text="No visitor requests yet." />
        ) : (
          <div className="overflow-x-auto ledger-scroll">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-400 border-b border-line">
                  <th className="py-2 pr-4">Visitor</th>
                  <th className="py-2 pr-4">Purpose</th>
                  <th className="py-2 pr-4">Requested</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {mine.map((v) => (
                  <tr key={v.id} className="border-b border-line last:border-0">
                    <td className="py-2 pr-4">
                      <p className="font-medium text-ink-800">{v.name}</p>
                      <p className="text-xs text-ink-400">{v.type}</p>
                    </td>
                    <td className="py-2 pr-4 text-ink-600">{v.purpose}</td>
                    <td className="py-2 pr-4 font-mono text-xs text-ink-400">{formatTime(v.createdAt)}</td>
                    <td className="py-2 pr-4">
                      <Badge kind={v.status}>{visitorStatusLabel(v.status)}</Badge>
                    </td>
                    <td className="py-2 pr-4">
                      {v.status === "pending" && (
                        <div className="flex gap-2">
                          <Button onClick={() => respondToVisitor(v.id, "approved", user?.name ?? "Resident")}>Approve</Button>
                          <Button variant="danger" onClick={() => respondToVisitor(v.id, "rejected", user?.name ?? "Resident")}>
                            Reject
                          </Button>
                        </div>
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
