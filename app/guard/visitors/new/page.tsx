"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useGateStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { VisitorType } from "@/lib/types";
import { Card, Field, Input, Select, Button } from "@/components/ui";
import { AlertTriangle } from "lucide-react";

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

export default function NewVisitorPage() {
  const router = useRouter();
  const { user } = useAuth();
  const flats = useGateStore((s) => s.flats);
  const blocked = useGateStore((s) => s.blocked);
  const registerVisitor = useGateStore((s) => s.registerVisitor);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [purpose, setPurpose] = useState("");
  const [flatId, setFlatId] = useState(flats[0]?.id ?? "");
  const [type, setType] = useState<VisitorType>("Guest");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [peopleCount, setPeopleCount] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const blockMatch = useMemo(
    () => blocked.find((b) => b.mobile === mobile.trim() && mobile.trim().length > 0),
    [blocked, mobile]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !purpose.trim() || !flatId) return;
    registerVisitor(
      {
        name: name.trim(),
        mobile: mobile.trim(),
        purpose: purpose.trim(),
        flatId,
        type,
        vehicleNumber: vehicleNumber.trim() || undefined,
        peopleCount,
      },
      user?.name ?? "Guard"
    );
    setSubmitted(true);
    setTimeout(() => router.push("/guard/visitors"), 900);
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-head text-xl font-semibold text-ink-800 mb-1">Register visitor</h1>
      <p className="text-sm text-ink-400 mb-6">An approval request goes straight to the resident's dashboard.</p>

      {blockMatch && (
        <div className="flex items-start gap-2 border border-signal-red/40 bg-signal-red/10 text-signal-redDark rounded-sm px-3 py-2.5 mb-4 text-sm">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>
            This mobile number is on the block list — reason: {blockMatch.reason}. Verify identity carefully before proceeding.
          </span>
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit}>
          <Field label="Visitor name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required />
          </Field>
          <Field label="Mobile number">
            <Input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="10-digit number" required />
          </Field>
          <Field label="Purpose of visit">
            <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Personal visit" required />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Flat">
              <Select value={flatId} onChange={(e) => setFlatId(e.target.value)}>
                {flats.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.number}
                  </option>
                ))}
              </Select>
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
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Vehicle number" hint="Optional">
              <Input value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} placeholder="AP 03 XX 0000" />
            </Field>
            <Field label="Number of people">
              <Input
                type="number"
                min={1}
                value={peopleCount}
                onChange={(e) => setPeopleCount(Math.max(1, Number(e.target.value)))}
              />
            </Field>
          </div>

          <Button type="submit" className="w-full mt-2" disabled={submitted}>
            {submitted ? "Approval request sent ✓" : "Send approval request"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
