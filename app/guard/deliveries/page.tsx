"use client";

import React, { useState } from "react";
import { useGateStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { flatLabel } from "@/lib/helpers";
import { Card, Field, Input, Select, Button, Badge, EmptyState, formatTime, Modal } from "@/components/ui";
import { Delivery } from "@/lib/types";

const deliveryTypes: Delivery["deliveryType"][] = ["Courier", "Food", "E-commerce", "Local", "Other"];

export default function DeliveriesPage() {
  const { user } = useAuth();
  const flats = useGateStore((s) => s.flats);
  const deliveries = useGateStore((s) => s.deliveries);
  const registerDelivery = useGateStore((s) => s.registerDelivery);
  const recordDeliveryExit = useGateStore((s) => s.recordDeliveryExit);

  const [open, setOpen] = useState(false);
  const [personName, setPersonName] = useState("");
  const [company, setCompany] = useState("");
  const [mobile, setMobile] = useState("");
  const [flatId, setFlatId] = useState(flats[0]?.id ?? "");
  const [deliveryType, setDeliveryType] = useState<Delivery["deliveryType"]>("E-commerce");
  const [vehicleNumber, setVehicleNumber] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!personName.trim() || !company.trim() || !flatId) return;
    registerDelivery(
      { personName: personName.trim(), company: company.trim(), mobile: mobile.trim(), flatId, deliveryType, vehicleNumber: vehicleNumber.trim() || undefined },
      user?.name ?? "Guard"
    );
    setPersonName("");
    setCompany("");
    setMobile("");
    setVehicleNumber("");
    setOpen(false);
  }

  const sorted = [...deliveries].sort((a, b) => new Date(b.entryAt).getTime() - new Date(a.entryAt).getTime());

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-head text-xl font-semibold text-ink-800 mb-1">Deliveries</h1>
          <p className="text-sm text-ink-400">Register couriers, food delivery and e-commerce drop-offs.</p>
        </div>
        <Button onClick={() => setOpen(true)}>Register delivery</Button>
      </div>

      <Card>
        {sorted.length === 0 ? (
          <EmptyState text="No deliveries logged yet." />
        ) : (
          <div className="overflow-x-auto ledger-scroll">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-400 border-b border-line">
                  <th className="py-2 pr-4">Delivery person</th>
                  <th className="py-2 pr-4">Company</th>
                  <th className="py-2 pr-4">Flat</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Entry</th>
                  <th className="py-2 pr-4">Exit</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((d) => (
                  <tr key={d.id} className="border-b border-line last:border-0">
                    <td className="py-2 pr-4 font-medium text-ink-800">{d.personName}</td>
                    <td className="py-2 pr-4">{d.company}</td>
                    <td className="py-2 pr-4">{flatLabel(flats, d.flatId)}</td>
                    <td className="py-2 pr-4 text-ink-600">{d.deliveryType}</td>
                    <td className="py-2 pr-4 font-mono text-xs text-ink-400">{formatTime(d.entryAt)}</td>
                    <td className="py-2 pr-4 font-mono text-xs text-ink-400">{formatTime(d.exitAt)}</td>
                    <td className="py-2 pr-4">
                      {!d.exitAt ? (
                        <Button variant="secondary" onClick={() => recordDeliveryExit(d.id, user?.name ?? "Guard")}>
                          Record exit
                        </Button>
                      ) : (
                        <Badge kind="exited">Exited</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Register delivery">
        <form onSubmit={handleSubmit}>
          <Field label="Delivery person name">
            <Input value={personName} onChange={(e) => setPersonName(e.target.value)} required />
          </Field>
          <Field label="Company">
            <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Amazon, Swiggy" required />
          </Field>
          <Field label="Mobile number" hint="Optional">
            <Input value={mobile} onChange={(e) => setMobile(e.target.value)} />
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
            <Field label="Delivery type">
              <Select value={deliveryType} onChange={(e) => setDeliveryType(e.target.value as Delivery["deliveryType"])}>
                {deliveryTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Vehicle number" hint="Optional">
            <Input value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} />
          </Field>
          <Button type="submit" className="w-full mt-2">
            Log delivery
          </Button>
        </form>
      </Modal>
    </div>
  );
}
