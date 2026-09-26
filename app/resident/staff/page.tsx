"use client";

import React, { useState } from "react";
import { useGateStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { Card, Field, Input, Select, Button, EmptyState, Badge, Modal } from "@/components/ui";
import { StaffType } from "@/lib/types";

const staffTypes: StaffType[] = ["Maid", "Cook", "Driver", "Cleaner", "Electrician", "Plumber", "Technician", "Newspaper / Milk", "Other"];

export default function ResidentStaffPage() {
  const { user } = useAuth();
  const staff = useGateStore((s) => s.staff);
  const addStaff = useGateStore((s) => s.addStaff);
  const toggleActive = useGateStore((s) => s.toggleStaffActive);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [type, setType] = useState<StaffType>("Maid");
  const [validUntil, setValidUntil] = useState("");

  const mine = staff.filter((s) => s.flatId === user?.flatId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !user?.flatId) return;
    addStaff({ name: name.trim(), mobile: mobile.trim(), type, flatId: user.flatId, validUntil: validUntil || undefined, active: true });
    setName("");
    setMobile("");
    setValidUntil("");
    setOpen(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-head text-xl font-semibold text-ink-800 mb-1">Household staff</h1>
          <p className="text-sm text-ink-400">Regular maids, drivers and service staff who visit often.</p>
        </div>
        <Button onClick={() => setOpen(true)}>Add staff</Button>
      </div>

      <Card>
        {mine.length === 0 ? (
          <EmptyState text="No regular staff registered yet." />
        ) : (
          <ul className="divide-y divide-line">
            {mine.map((s) => (
              <li key={s.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink-800">{s.name}</p>
                  <p className="text-xs text-ink-400">
                    {s.type} · {s.mobile || "no mobile on file"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge kind={s.active ? "approved" : "neutral"}>{s.active ? "Active" : "Inactive"}</Badge>
                  <Button variant="ghost" onClick={() => toggleActive(s.id)}>
                    {s.active ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add household staff">
        <form onSubmit={handleSubmit}>
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Mobile number" hint="Optional">
            <Input value={mobile} onChange={(e) => setMobile(e.target.value)} />
          </Field>
          <Field label="Type">
            <Select value={type} onChange={(e) => setType(e.target.value as StaffType)}>
              {staffTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Valid until" hint="Optional">
            <Input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
          </Field>
          <Button type="submit" className="w-full mt-2">
            Save
          </Button>
        </form>
      </Modal>
    </div>
  );
}
