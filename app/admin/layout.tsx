"use client";

import React from "react";
import { LayoutDashboard, Users, Building2, ShieldQuestion, Car, ScrollText, FileBarChart } from "lucide-react";
import { useRequireRole } from "@/lib/auth";
import AppShell from "@/components/AppShell";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { href: "/admin/residents", label: "Residents", icon: <Users size={16} /> },
  { href: "/admin/flats", label: "Flats & blocks", icon: <Building2 size={16} /> },
  { href: "/admin/guards", label: "Guards & shifts", icon: <ShieldQuestion size={16} /> },
  { href: "/admin/vehicles", label: "Vehicles", icon: <Car size={16} /> },
  { href: "/admin/visitors", label: "Visitor log & block list", icon: <ScrollText size={16} /> },
  { href: "/admin/reports", label: "Reports", icon: <FileBarChart size={16} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, ready } = useRequireRole("admin");
  if (!ready || !user) return null;

  return (
    <AppShell navItems={navItems} roleLabel="Administrator">
      {children}
    </AppShell>
  );
}
