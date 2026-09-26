"use client";

import React from "react";
import { LayoutDashboard, CheckSquare, CalendarPlus, History, Car, Users } from "lucide-react";
import { useRequireRole } from "@/lib/auth";
import AppShell from "@/components/AppShell";

const navItems = [
  { href: "/resident", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { href: "/resident/approvals", label: "Approvals", icon: <CheckSquare size={16} /> },
  { href: "/resident/preapprove", label: "Pre-approve visitor", icon: <CalendarPlus size={16} /> },
  { href: "/resident/history", label: "History", icon: <History size={16} /> },
  { href: "/resident/vehicles", label: "My vehicles", icon: <Car size={16} /> },
  { href: "/resident/staff", label: "Household staff", icon: <Users size={16} /> },
];

export default function ResidentLayout({ children }: { children: React.ReactNode }) {
  const { user, ready } = useRequireRole("resident");
  if (!ready || !user) return null;

  return (
    <AppShell navItems={navItems} roleLabel="Resident">
      {children}
    </AppShell>
  );
}
