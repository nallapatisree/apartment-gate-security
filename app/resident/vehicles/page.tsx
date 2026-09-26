"use client";

import React, { useState } from "react";
import { useGateStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { Card, Field, Input, Select, Button, EmptyState, Badge, Modal } from "@/components/ui";
import { Vehicle } from "@/lib/types";

const vehicleTypes: Vehicle["type"][] = ["Car", "Bike", "Auto", "Other"];

export default function ResidentVehiclesPage() {
  const { user } = useAuth();
  const vehicles = useGateStore((s) => s.vehicles);
  const addVehicle = useGateStore((s) => s.addVehicle);
  const toggleActive = useGateStore((s) => s.toggleVehicleActive);

  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState("");
  const [type, setType] = useState<Vehicle["type"]>("Car");
  const [brand, setBrand] = useState("");
  const [parkingSlot, setParkingSlot] = useState("");

  const mine = vehicles.filter((v) => v.flatId === user?.flatId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!number.trim() || !user?.flatId) return;
    addVehicle({
      number: number.trim().toUpperCase(),
      type,
      brand: brand.trim() || undefined,
      ownerName: user.name,
      flatId: user.flatId,
      parkingSlot: parkingSlot.trim() || undefined,
      active: true,
    });
    setNumber("");
    setBrand("");
    setParkingSlot("");
    setOpen(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-head text-xl font-semibold text-ink-800 mb-1">My vehicles</h1>
          <p className="text-sm text-ink-400">Registered vehicles are recognised faster at the gate.</p>
        </div>
        <Button onClick={() => setOpen(true)}>Add vehicle</Button>
      </div>

      <Card>
        {mine.length === 0 ? (
          <EmptyState text="No vehicles registered yet." />
        ) : (
          <ul className="divide-y divide-line">
            {mine.map((v) => (
              <li key={v.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink-800 font-mono">{v.number}</p>
                  <p className="text-xs text-ink-400">
                    {v.type}
                    {v.brand ? ` · ${v.brand}` : ""}
                    {v.parkingSlot ? ` · Slot ${v.parkingSlot}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge kind={v.active ? "approved" : "neutral"}>{v.active ? "Active" : "Inactive"}</Badge>
                  <Button variant="ghost" onClick={() => toggleActive(v.id)}>
                    {v.active ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add vehicle">
        <form onSubmit={handleSubmit}>
          <Field label="Vehicle number">
            <Input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="AP 03 XX 0000" required />
          </Field>
          <Field label="Type">
            <Select value={type} onChange={(e) => setType(e.target.value as Vehicle["type"])}>
              {vehicleTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Brand / model" hint="Optional">
            <Input value={brand} onChange={(e) => setBrand(e.target.value)} />
          </Field>
          <Field label="Parking slot" hint="Optional">
            <Input value={parkingSlot} onChange={(e) => setParkingSlot(e.target.value)} />
          </Field>
          <Button type="submit" className="w-full mt-2">
            Save vehicle
          </Button>
        </form>
      </Modal>
    </div>
  );
}
