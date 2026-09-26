"use client";

import React, { useMemo, useState } from "react";
import { useGateStore, visitorStatusLabel } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { flatLabel } from "@/lib/helpers";
import { Card, Field, Input, Select, Badge, Button, EmptyState, Modal, formatTime } from "@/components/ui";
import { VisitorStatus } from "@/lib/types";

export default function AdminVisitorsPage() {
  const { user } = useAuth();
  const visitors = useGateStore((s) => s.visitors);
  const flats = useGateStore((s) => s.flats);
  const blocked = useGateStore((s) => s.blocked);
  const addBlocked = useGateStore((s) => s.addBlocked);
  const removeBlocked = useGateStore((s) => s.removeBlocked);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<VisitorStatus | "all">("all");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [reason, setReason] = useState("");

  const filtered = useMemo(
    () =>
      visitors
        .filter((v) => (status === "all" ? true : v.status === status))
        .filter((v) => {
          if (!query.trim()) return true;
          const q = query.toLowerCase();
          return v.name.toLowerCase().includes(q) || v.mobile.includes(q) || flatLabel(flats, v.flatId).toLowerCase().includes(q);
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [visitors, status, query, flats]
  );

  function handleBlock(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !reason.trim()) return;
    addBlocked({ name: name.trim(), mobile: mobile.trim(), reason: reason.trim() }, user?.name ?? "Admin");
    setName("");
    setMobile("");
    setReason("");
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-head text-xl font-semibold text-ink-800 mb-1">Visitor log</h1>
        <p className="text-sm text-ink-400 mb-4">Full community visitor history, searchable by name, mobile or flat.</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <Input placeholder="Search visitor…" value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-xs" />
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
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Logged</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((v) => (
                    <tr key={v.id} className="border-b border-line last:border-0">
                      <td className="py-2 pr-4 font-medium text-ink-800">{v.name}</td>
                      <td className="py-2 pr-4">{flatLabel(flats, v.flatId)}</td>
                      <td className="py-2 pr-4 text-ink-600">{v.type}</td>
                      <td className="py-2 pr-4">
                        <Badge kind={v.status}>{visitorStatusLabel(v.status)}</Badge>
                      </td>
                      <td className="py-2 pr-4 font-mono text-xs text-ink-400">{formatTime(v.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-head text-base font-semibold text-ink-800">Block list</h2>
            <p className="text-sm text-ink-400">Guards see a warning when a blocked mobile number is entered at the gate.</p>
          </div>
          <Button variant="danger" onClick={() => setOpen(true)}>
            Block a visitor
          </Button>
        </div>
        <Card>
          {blocked.length === 0 ? (
            <EmptyState text="No one is currently blocked." />
          ) : (
            <ul className="divide-y divide-line">
              {blocked.map((b) => (
                <li key={b.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-800">
                      {b.name} <span className="text-ink-400 font-normal font-mono">· {b.mobile}</span>
                    </p>
                    <p className="text-xs text-ink-400">{b.reason}</p>
                  </div>
                  <Button variant="ghost" onClick={() => removeBlocked(b.id, user?.name ?? "Admin")}>
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Block a visitor">
        <form onSubmit={handleBlock}>
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Mobile number">
            <Input value={mobile} onChange={(e) => setMobile(e.target.value)} required />
          </Field>
          <Field label="Reason">
            <Input value={reason} onChange={(e) => setReason(e.target.value)} required />
          </Field>
          <Button type="submit" variant="danger" className="w-full mt-2">
            Add to block list
          </Button>
        </form>
      </Modal>
    </div>
  );
}
