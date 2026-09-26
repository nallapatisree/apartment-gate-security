"use client";

import React, { useState } from "react";
import { useGateStore } from "@/lib/store";
import { Card, Field, Input, Select, Button, EmptyState, Badge, Modal } from "@/components/ui";
import { Guard } from "@/lib/types";

const shifts: Guard["shift"][] = ["Morning 6AM-2PM", "Evening 2PM-10PM", "Night 10PM-6AM"];

export default function AdminGuardsPage() {
  const guards = useGateStore((s) => s.guards);
  const addGuard = useGateStore((s) => s.addGuard);
  const toggleActive = useGateStore((s) => s.toggleGuardActive);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [gate, setGate] = useState("Main Gate");
  const [shift, setShift] = useState<Guard["shift"]>("Morning 6AM-2PM");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !username.trim()) return;
    addGuard({
      name: name.trim(),
      mobile: mobile.trim(),
      username: username.trim(),
      gate: gate.trim() || "Main Gate",
      shift,
      joined: new Date().toISOString().slice(0, 10),
      active: true,
    });
    setName("");
    setMobile("");
    setUsername("");
    setOpen(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-head text-xl font-semibold text-ink-800 mb-1">Guards & shifts</h1>
          <p className="text-sm text-ink-400">Security personnel with gate console access.</p>
        </div>
        <Button onClick={() => setOpen(true)}>Add guard</Button>
      </div>

      <Card>
        {guards.length === 0 ? (
          <EmptyState text="No guards added yet." />
        ) : (
          <div className="overflow-x-auto ledger-scroll">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-400 border-b border-line">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Gate</th>
                  <th className="py-2 pr-4">Shift</th>
                  <th className="py-2 pr-4">Joined</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {guards.map((g) => (
                  <tr key={g.id} className="border-b border-line last:border-0">
                    <td className="py-2 pr-4">
                      <p className="font-medium text-ink-800">{g.name}</p>
                      <p className="text-xs text-ink-400 font-mono">{g.username}</p>
                    </td>
                    <td className="py-2 pr-4">{g.gate}</td>
                    <td className="py-2 pr-4 text-ink-600 text-xs">{g.shift}</td>
                    <td className="py-2 pr-4 font-mono text-xs text-ink-400">{g.joined}</td>
                    <td className="py-2 pr-4">
                      <Badge kind={g.active ? "approved" : "neutral"}>{g.active ? "Active" : "Inactive"}</Badge>
                    </td>
                    <td className="py-2 pr-4">
                      <Button variant="ghost" onClick={() => toggleActive(g.id)}>
                        {g.active ? "Deactivate" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add guard">
        <form onSubmit={handleSubmit}>
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Mobile number">
            <Input value={mobile} onChange={(e) => setMobile(e.target.value)} />
          </Field>
          <Field label="Username">
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. guard.ramesh" required />
          </Field>
          <Field label="Gate">
            <Input value={gate} onChange={(e) => setGate(e.target.value)} />
          </Field>
          <Field label="Shift">
            <Select value={shift} onChange={(e) => setShift(e.target.value as Guard["shift"])}>
              {shifts.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
          <Button type="submit" className="w-full mt-2">
            Add guard
          </Button>
        </form>
      </Modal>
    </div>
  );
}
