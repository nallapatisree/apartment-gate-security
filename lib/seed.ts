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
} from "./types";

export const APARTMENT_NAME = "Green Valley Residency";

export const seedFlats: Flat[] = [
  { id: "flat-a101", block: "A", floor: 1, number: "A-101" },
  { id: "flat-a102", block: "A", floor: 1, number: "A-102" },
  { id: "flat-a203", block: "A", floor: 2, number: "A-203" },
  { id: "flat-b101", block: "B", floor: 1, number: "B-101" },
  { id: "flat-b205", block: "B", floor: 2, number: "B-205" },
  { id: "flat-c304", block: "C", floor: 3, number: "C-304" },
];

export const seedResidents: Resident[] = [
  { id: "res-1", name: "Rahul Kumar", mobile: "9876500001", flatId: "flat-a203", isPrimary: true, active: true },
  { id: "res-2", name: "Priya Nair", mobile: "9876500002", flatId: "flat-a101", isPrimary: true, active: true },
  { id: "res-3", name: "Arjun Reddy", mobile: "9876500003", flatId: "flat-b101", isPrimary: true, active: true },
  { id: "res-4", name: "Sneha Rao", mobile: "9876500004", flatId: "flat-b205", isPrimary: true, active: true },
  { id: "res-5", name: "Vikram Singh", mobile: "9876500005", flatId: "flat-c304", isPrimary: true, active: true },
];

export const seedGuards: Guard[] = [
  { id: "guard-1", name: "Manoj Yadav", mobile: "9998800001", username: "guard.manoj", gate: "Main Gate", shift: "Morning 6AM-2PM", joined: "2024-01-10", active: true },
  { id: "guard-2", name: "Suresh Pillai", mobile: "9998800002", username: "guard.suresh", gate: "Main Gate", shift: "Evening 2PM-10PM", joined: "2024-03-22", active: true },
];

export const seedVehicles: Vehicle[] = [
  { id: "veh-1", number: "AP 03 CD 4521", type: "Car", brand: "Hyundai Creta", ownerName: "Rahul Kumar", flatId: "flat-a203", parkingSlot: "A-12", active: true },
  { id: "veh-2", number: "AP 03 EF 7788", type: "Bike", brand: "Royal Enfield", ownerName: "Arjun Reddy", flatId: "flat-b101", parkingSlot: "B-04", active: true },
  { id: "veh-3", number: "AP 03 GH 1122", type: "Car", brand: "Maruti Baleno", ownerName: "Sneha Rao", flatId: "flat-b205", parkingSlot: "B-20", active: true },
];

export const seedStaff: ServiceStaff[] = [
  { id: "staff-1", name: "Kamala", mobile: "9111100001", type: "Maid", flatId: "flat-a203", validUntil: "2027-01-01", active: true },
  { id: "staff-2", name: "Ravi", mobile: "9111100002", type: "Driver", flatId: "flat-b101", validUntil: "2027-01-01", active: true },
];

export const seedBlocked: BlockedVisitor[] = [
  { id: "block-1", name: "Unknown Vendor", mobile: "9000011111", reason: "Reported for unsolicited sales visits", addedAt: "2026-08-14T10:00:00Z" },
];

export const seedVisitors: Visitor[] = [
  {
    id: "vis-seed-1",
    name: "Kiran Mehta",
    mobile: "9887766554",
    purpose: "Personal Visit",
    flatId: "flat-a203",
    type: "Friend / Relative",
    vehicleNumber: "AP 09 XY 3344",
    peopleCount: 2,
    status: "pending",
    createdAt: new Date().toISOString(),
  },
];

export const seedDeliveries: Delivery[] = [];

export const seedNotifications: Notification[] = [
  {
    id: "note-seed-1",
    toRole: "resident",
    toFlatId: "flat-a203",
    title: "Visitor waiting for approval",
    body: "Kiran Mehta is waiting at the main gate for personal visit.",
    createdAt: new Date().toISOString(),
    read: false,
    kind: "approval",
  },
];

export const seedAudit: AuditLog[] = [
  { id: "log-seed-1", actor: "System", action: "Seeded", detail: "Demo data initialised", at: new Date().toISOString() },
];
