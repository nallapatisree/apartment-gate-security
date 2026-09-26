"use client";

import React, { useMemo, useState } from "react";
import { useGateStore } from "@/lib/store";
import { Card, Field, Input, Button, EmptyState, Modal } from "@/components/ui";

export default function AdminFlatsPage() {
  const flats = useGateStore((s) => s.flats);
  const residents = useGateStore((s) => s.residents);
  const addFlat = useGateStore((s) => s.addFlat);

  const [open, setOpen] = useState(false);
  const [block, setBlock] = useState("");
  const [floor, setFloor] = useState(1);
  const [number, setNumber] = useState("");

  const grouped = useMemo(() => {
    const map = new Map<string, typeof flats>();
    for (const f of flats) {
      const list = map.get(f.block) ?? [];
      list.push(f);
      map.set(f.block, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [flats]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!block.trim() || !number.trim()) return;
    addFlat({ block: block.trim().toUpperCase(), floor, number: number.trim().toUpperCase() });
    setBlock("");
    setNumber("");
    setFloor(1);
    setOpen(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-head text-xl font-semibold text-ink-800 mb-1">Blocks & flats</h1>
          <p className="text-sm text-ink-400">The apartment structure that visitor requests and vehicles attach to.</p>
        </div>
        <Button onClick={() => setOpen(true)}>Add flat</Button>
      </div>

      {grouped.length === 0 ? (
        <EmptyState text="No flats configured yet." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {grouped.map(([block, list]) => (
            <Card key={block} title={`Block ${block}`}>
              <ul className="divide-y divide-line">
                {list
                  .sort((a, b) => a.number.localeCompare(b.number))
                  .map((f) => {
                    const occupants = residents.filter((r) => r.flatId === f.id).length;
                    return (
                      <li key={f.id} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-sm">
                        <span className="font-medium text-ink-800">{f.number}</span>
                        <span className="text-ink-400 text-xs">
                          Floor {f.floor} · {occupants} resident{occupants === 1 ? "" : "s"}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add flat">
        <form onSubmit={handleSubmit}>
          <Field label="Block">
            <Input value={block} onChange={(e) => setBlock(e.target.value)} placeholder="e.g. A" required />
          </Field>
          <Field label="Floor">
            <Input type="number" min={0} value={floor} onChange={(e) => setFloor(Number(e.target.value))} />
          </Field>
          <Field label="Flat number">
            <Input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="e.g. A-104" required />
          </Field>
          <Button type="submit" className="w-full mt-2">
            Add flat
          </Button>
        </form>
      </Modal>
    </div>
  );
}
