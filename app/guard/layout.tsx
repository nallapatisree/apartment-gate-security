"use client";

import React from "react";
import { LayoutDashboard, UserPlus, ScrollText, Package, CalendarCheck } from "lucide-react";
import { useRequireRole } from "@/lib/auth";
import AppShell from "@/components/AppShell";

const navItems = [
  { href: "/guard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { href: "/guard/visitors/new", label: "New Visitor", icon: <UserPlus size={16} /> },
  { href: "/guard/visitors", label: "Visitor Log", icon: <ScrollText size={16} /> },
  { href: "/guard/deliveries", label: "Deliveries", icon: <Package size={16} /> },
  { href: "/guard/preapproved", label: "Pre-Approved", icon: <CalendarCheck size={16} /> },
];

export default function GuardLayout({ children }: { children: React.ReactNode }) {
  const { user, ready } = useRequireRole("guard");
  if (!ready || !user) return null;

  return (
    <AppShell navItems={navItems} roleLabel="Security guard">
      {children}
    </AppShell>
  );
}
