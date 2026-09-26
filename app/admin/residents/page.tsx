"use client";

import React, { useState } from "react";
import { useGateStore } from "@/lib/store";
import { flatLabel } from "@/lib/helpers";
import { Card, Field, Input, Select, Button, EmptyState, Badge, Modal } from "@/components/ui";

export default function AdminResidentsPage() {
  const flats = useGateStore((s) => s.flats);
  const residents = useGateStore((s) => s.residents);
  const addResident = useGateStore((s) => s.addResident);
  const toggleActive = useGateStore((s) => s.toggleResidentActive);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [flatId, setFlatId] = useState(flats[0]?.id ?? "");
  const [isPrimary, setIsPrimary] = useState(true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !flatId) return;
    addResident({ name: name.trim(), mobile: mobile.trim(), flatId, isPrimary, active: true });
    setName("");
    setMobile("");
    setOpen(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-head text-xl font-semibold text-ink-800 mb-1">Residents</h1>
          <p className="text-sm text-ink-400">Everyone with login access to a flat.</p>
        </div>
        <Button onClick={() => setOpen(true)}>Add resident</Button>
      </div>

      <Card>
        {residents.length === 0 ? (
          <EmptyState text="No residents added yet." />
        ) : (
          <div className="overflow-x-auto ledger-scroll">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-400 border-b border-line">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Mobile</th>
                  <th className="py-2 pr-4">Flat</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {residents.map((r) => (
                  <tr key={r.id} className="border-b border-line last:border-0">
                    <td className="py-2 pr-4 font-medium text-ink-800">{r.name}</td>
                    <td className="py-2 pr-4 font-mono text-xs">{r.mobile}</td>
                    <td className="py-2 pr-4">{flatLabel(flats, r.flatId)}</td>
                    <td className="py-2 pr-4 text-ink-600">{r.isPrimary ? "Primary" : "Family member"}</td>
                    <td className="py-2 pr-4">
                      <Badge kind={r.active ? "approved" : "neutral"}>{r.active ? "Active" : "Inactive"}</Badge>
                    </td>
                    <td className="py-2 pr-4">
                      <Button variant="ghost" onClick={() => toggleActive(r.id)}>
                        {r.active ? "Deactivate" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add resident">
        <form onSubmit={handleSubmit}>
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Mobile number">
            <Input value={mobile} onChange={(e) => setMobile(e.target.value)} required />
          </Field>
          <Field label="Flat">
            <Select value={flatId} onChange={(e) => setFlatId(e.target.value)}>
              {flats.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.number}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Household role">
            <Select value={isPrimary ? "primary" : "family"} onChange={(e) => setIsPrimary(e.target.value === "primary")}>
              <option value="primary">Primary resident</option>
              <option value="family">Family member</option>
            </Select>
          </Field>
          <Button type="submit" className="w-full mt-2">
            Add resident
          </Button>
        </form>
      </Modal>
    </div>
  );
}
