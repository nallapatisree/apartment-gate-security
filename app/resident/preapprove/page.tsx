"use client";

import React, { useState } from "react";
import { useGateStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { Card, Field, Input, Select, Button, EmptyState, Badge, formatTime } from "@/components/ui";
import { VisitorType } from "@/lib/types";

const visitorTypes: VisitorType[] = [
  "Guest",
  "Friend / Relative",
  "Delivery",
  "Cab / Auto",
  "Domestic Worker",
  "Maintenance Worker",
  "Technician",
  "Vendor",
  "Other",
];

export default function PreApprovePage() {
  const { user } = useAuth();
  const visitors = useGateStore((s) => s.visitors);
  const createPreApproved = useGateStore((s) => s.createPreApproved);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [purpose, setPurpose] = useState("");
  const [type, setType] = useState<VisitorType>("Guest");
  const [validUntil, setValidUntil] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !user?.flatId) return;
    createPreApproved(
      {
        name: name.trim(),
        mobile: mobile.trim(),
        purpose: purpose.trim() || "Pre-approved visit",
        flatId: user.flatId,
        type,
        peopleCount: 1,
        validUntil: validUntil || undefined,
      },
      user.name
    );
    setName("");
    setMobile("");
    setPurpose("");
    setValidUntil("");
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 2500);
  }

  const mine = visitors.filter((v) => v.preApproved && v.flatId === user?.flatId);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h1 className="font-head text-xl font-semibold text-ink-800 mb-1">Pre-approve a visitor</h1>
        <p className="text-sm text-ink-400 mb-4">The guard can verify and check them in directly, without another approval step.</p>
        <Card>
          <form onSubmit={handleSubmit}>
            <Field label="Visitor name">
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </Field>
            <Field label="Mobile number">
              <Input value={mobile} onChange={(e) => setMobile(e.target.value)} required />
            </Field>
            <Field label="Purpose">
              <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Weekend guest" />
            </Field>
            <Field label="Visitor type">
              <Select value={type} onChange={(e) => setType(e.target.value as VisitorType)}>
                {visitorTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Valid until" hint="Leave blank for no expiry">
              <Input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
            </Field>
            <Button type="submit" className="w-full mt-2">
              {confirmed ? "Saved ✓" : "Create pre-approval"}
            </Button>
          </form>
        </Card>
      </div>

      <div>
        <h2 className="font-head text-sm font-semibold text-ink-800 mb-3 mt-1">Your pre-approved visitors</h2>
        <Card>
          {mine.length === 0 ? (
            <EmptyState text="None created yet." />
          ) : (
            <ul className="space-y-2">
              {mine.map((v) => (
                <li key={v.id} className="flex items-center justify-between border border-line rounded-sm px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-ink-800">{v.name}</p>
                    <p className="text-xs text-ink-400">
                      {v.type} · valid until {v.validUntil ? formatTime(v.validUntil) : "no expiry"}
                    </p>
                  </div>
                  <Badge kind={v.status}>{v.status === "inside" ? "Checked in" : "Active"}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
