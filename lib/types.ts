export type Role = "admin" | "guard" | "resident";

export type VisitorType =
  | "Guest"
  | "Friend / Relative"
  | "Delivery"
  | "Cab / Auto"
  | "Domestic Worker"
  | "Maintenance Worker"
  | "Technician"
  | "Vendor"
  | "Other";

export type VisitorStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "inside"
  | "exited";

export interface Flat {
  id: string;
  block: string;
  floor: number;
  number: string; // e.g. A-203
}

export interface Resident {
  id: string;
  name: string;
  mobile: string;
  flatId: string;
  isPrimary: boolean;
  active: boolean;
}

export interface Guard {
  id: string;
  name: string;
  mobile: string;
  username: string;
  gate: string;
  shift: "Morning 6AM-2PM" | "Evening 2PM-10PM" | "Night 10PM-6AM";
  joined: string;
  active: boolean;
}

export interface Vehicle {
  id: string;
  number: string;
  type: "Car" | "Bike" | "Auto" | "Other";
  brand?: string;
  ownerName: string;
  flatId: string;
  parkingSlot?: string;
  active: boolean;
}

export interface Visitor {
  id: string;
  name: string;
  mobile: string;
  purpose: string;
  flatId: string;
  type: VisitorType;
  vehicleNumber?: string;
  peopleCount: number;
  status: VisitorStatus;
  entryAt?: string;
  exitAt?: string;
  createdAt: string;
  preApproved?: boolean;
  validUntil?: string;
}

export interface Delivery {
  id: string;
  personName: string;
  company: string;
  mobile: string;
  flatId: string;
  deliveryType: "Courier" | "Food" | "E-commerce" | "Local" | "Other";
  vehicleNumber?: string;
  entryAt: string;
  exitAt?: string;
}

export type StaffType =
  | "Maid"
  | "Cook"
  | "Driver"
  | "Cleaner"
  | "Electrician"
  | "Plumber"
  | "Technician"
  | "Newspaper / Milk"
  | "Other";

export interface ServiceStaff {
  id: string;
  name: string;
  mobile: string;
  type: StaffType;
  flatId: string;
  validUntil?: string;
  active: boolean;
}

export interface BlockedVisitor {
  id: string;
  name: string;
  mobile: string;
  reason: string;
  addedAt: string;
}

export interface Notification {
  id: string;
  toRole: Role;
  toFlatId?: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  kind: "approval" | "delivery" | "security" | "general";
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  detail: string;
  at: string;
}

export interface SessionUser {
  role: Role;
  id: string;
  name: string;
  flatId?: string; // for residents
}
