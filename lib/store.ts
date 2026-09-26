"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  Flat,
  Resident,
  Guard,
  Vehicle,
  Visitor,
  Delivery,
  ServiceStaff,
  BlockedVisitor,
  Notification,
  AuditLog,
  VisitorStatus,
  Role,
} from "./types";
import {
  seedFlats,
  seedResidents,
  seedGuards,
  seedVehicles,
  seedStaff,
  seedBlocked,
  seedVisitors,
  seedDeliveries,
  seedNotifications,
  seedAudit,
} from "./seed";

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

interface GateState {
  flats: Flat[];
  residents: Resident[];
  guards: Guard[];
  vehicles: Vehicle[];
  visitors: Visitor[];
  deliveries: Delivery[];
  staff: ServiceStaff[];
  blocked: BlockedVisitor[];
  notifications: Notification[];
  audit: AuditLog[];

  log: (actor: string, action: string, detail: string) => void;
  notify: (n: Omit<Notification, "id" | "createdAt" | "read">) => void;
  markNotificationRead: (id: string) => void;

  addFlat: (f: Omit<Flat, "id">) => void;
  addResident: (r: Omit<Resident, "id">) => void;
  toggleResidentActive: (id: string) => void;
  addGuard: (g: Omit<Guard, "id">) => void;
  toggleGuardActive: (id: string) => void;
  addVehicle: (v: Omit<Vehicle, "id">) => void;
  toggleVehicleActive: (id: string) => void;

  registerVisitor: (v: Omit<Visitor, "id" | "status" | "createdAt">, actor: string) => string;
  respondToVisitor: (id: string, decision: "approved" | "rejected", actor: string) => void;
  recordVisitorEntry: (id: string, actor: string) => void;
  recordVisitorExit: (id: string, actor: string) => void;
  createPreApproved: (v: Omit<Visitor, "id" | "status" | "createdAt" | "preApproved">, actor: string) => void;
  checkInPreApproved: (id: string, actor: string) => void;

  registerDelivery: (d: Omit<Delivery, "id" | "entryAt">, actor: string) => void;
  recordDeliveryExit: (id: string, actor: string) => void;

  addStaff: (s: Omit<ServiceStaff, "id">) => void;
  toggleStaffActive: (id: string) => void;

  addBlocked: (b: Omit<BlockedVisitor, "id" | "addedAt">, actor: string) => void;
  removeBlocked: (id: string, actor: string) => void;

  resetDemo: () => void;
}

const initialData = {
  flats: seedFlats,
  residents: seedResidents,
  guards: seedGuards,
  vehicles: seedVehicles,
  visitors: seedVisitors,
  deliveries: seedDeliveries,
  staff: seedStaff,
  blocked: seedBlocked,
  notifications: seedNotifications,
  audit: seedAudit,
};

export const useGateStore = create<GateState>()(
  persist(
    (set, get) => ({
      ...initialData,

      log: (actor, action, detail) =>
        set((s) => ({
          audit: [{ id: uid("log"), actor, action, detail, at: new Date().toISOString() }, ...s.audit].slice(0, 300),
        })),

      notify: (n) =>
        set((s) => ({
          notifications: [
            { ...n, id: uid("note"), createdAt: new Date().toISOString(), read: false },
            ...s.notifications,
          ],
        })),

      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),

      addFlat: (f) => {
        set((s) => ({ flats: [...s.flats, { ...f, id: uid("flat") }] }));
        get().log("Admin", "Flat added", `${f.number} (Block ${f.block})`);
      },

      addResident: (r) => {
        set((s) => ({ residents: [...s.residents, { ...r, id: uid("res") }] }));
        get().log("Admin", "Resident added", r.name);
      },

      toggleResidentActive: (id) => {
        set((s) => ({
          residents: s.residents.map((r) => (r.id === id ? { ...r, active: !r.active } : r)),
        }));
      },

      addGuard: (g) => {
        set((s) => ({ guards: [...s.guards, { ...g, id: uid("guard") }] }));
        get().log("Admin", "Guard added", g.name);
      },

      toggleGuardActive: (id) => {
        set((s) => ({
          guards: s.guards.map((g) => (g.id === id ? { ...g, active: !g.active } : g)),
        }));
      },

      addVehicle: (v) => {
        set((s) => ({ vehicles: [...s.vehicles, { ...v, id: uid("veh") }] }));
        get().log(v.ownerName, "Vehicle registered", v.number);
      },

      toggleVehicleActive: (id) => {
        set((s) => ({
          vehicles: s.vehicles.map((v) => (v.id === id ? { ...v, active: !v.active } : v)),
        }));
      },

      registerVisitor: (v, actor) => {
        const id = uid("vis");
        set((s) => ({
          visitors: [{ ...v, id, status: "pending", createdAt: new Date().toISOString() }, ...s.visitors],
        }));
        get().log(actor, "Visitor registered", `${v.name} -> flat request sent`);
        get().notify({
          toRole: "resident",
          toFlatId: v.flatId,
          title: "Visitor waiting for approval",
          body: `${v.name} (${v.type}) is at the gate. Purpose: ${v.purpose}.`,
          kind: "approval",
        });
        return id;
      },

      respondToVisitor: (id, decision, actor) => {
        set((s) => ({
          visitors: s.visitors.map((v) => (v.id === id ? { ...v, status: decision } : v)),
        }));
        const v = get().visitors.find((x) => x.id === id);
        get().log(actor, `Visitor ${decision}`, v?.name ?? id);
        get().notify({
          toRole: "guard",
          title: `Visitor ${decision}`,
          body: `${v?.name ?? "Visitor"} was ${decision} by the resident.`,
          kind: "approval",
        });
      },

      recordVisitorEntry: (id, actor) => {
        set((s) => ({
          visitors: s.visitors.map((v) =>
            v.id === id ? { ...v, status: "inside", entryAt: new Date().toISOString() } : v
          ),
        }));
        get().log(actor, "Visitor entry recorded", id);
      },

      recordVisitorExit: (id, actor) => {
        set((s) => ({
          visitors: s.visitors.map((v) =>
            v.id === id ? { ...v, status: "exited", exitAt: new Date().toISOString() } : v
          ),
        }));
        get().log(actor, "Visitor exit recorded", id);
      },

      createPreApproved: (v, actor) => {
        set((s) => ({
          visitors: [
            {
              ...v,
              id: uid("pre"),
              status: "approved",
              createdAt: new Date().toISOString(),
              preApproved: true,
            },
            ...s.visitors,
          ],
        }));
        get().log(actor, "Pre-approved visitor created", v.name);
      },

      checkInPreApproved: (id, actor) => {
        set((s) => ({
          visitors: s.visitors.map((v) =>
            v.id === id ? { ...v, status: "inside", entryAt: new Date().toISOString() } : v
          ),
        }));
        get().log(actor, "Pre-approved visitor checked in", id);
      },

      registerDelivery: (d, actor) => {
        set((s) => ({
          deliveries: [{ ...d, id: uid("del"), entryAt: new Date().toISOString() }, ...s.deliveries],
        }));
        get().log(actor, "Delivery registered", `${d.personName} (${d.company})`);
        get().notify({
          toRole: "resident",
          toFlatId: d.flatId,
          title: "Delivery arrived",
          body: `${d.personName} from ${d.company} has arrived at the gate.`,
          kind: "delivery",
        });
      },

      recordDeliveryExit: (id, actor) => {
        set((s) => ({
          deliveries: s.deliveries.map((d) => (d.id === id ? { ...d, exitAt: new Date().toISOString() } : d)),
        }));
        get().log(actor, "Delivery exit recorded", id);
      },

      addStaff: (st) => {
        set((s) => ({ staff: [...s.staff, { ...st, id: uid("staff") }] }));
        get().log("Resident", "Service staff registered", st.name);
      },

      toggleStaffActive: (id) => {
        set((s) => ({
          staff: s.staff.map((st) => (st.id === id ? { ...st, active: !st.active } : st)),
        }));
      },

      addBlocked: (b, actor) => {
        set((s) => ({ blocked: [{ ...b, id: uid("blk"), addedAt: new Date().toISOString() }, ...s.blocked] }));
        get().log(actor, "Visitor blocked", `${b.name} (${b.mobile})`);
      },

      removeBlocked: (id, actor) => {
        const b = get().blocked.find((x) => x.id === id);
        set((s) => ({ blocked: s.blocked.filter((x) => x.id !== id) }));
        get().log(actor, "Block removed", b?.name ?? id);
      },

      resetDemo: () => set({ ...initialData }),
    }),
    {
      name: "gate-security-store-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);

export function visitorStatusLabel(status: VisitorStatus): string {
  switch (status) {
    case "pending":
      return "Pending approval";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    case "inside":
      return "Inside";
    case "exited":
      return "Exited";
  }
}
