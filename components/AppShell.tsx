"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Bell, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useGateStore } from "@/lib/store";
import { timeAgo } from "@/components/ui";
import { APARTMENT_NAME } from "@/lib/seed";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function AppShell({
  navItems,
  roleLabel,
  children,
}: {
  navItems: NavItem[];
  roleLabel: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const notifications = useGateStore((s) => s.notifications);
  const markRead = useGateStore((s) => s.markNotificationRead);
  const [bellOpen, setBellOpen] = useState(false);

  const relevant = useMemo(() => {
    if (!user) return [];
    return notifications.filter((n) => {
      if (n.toRole !== user.role) return false;
      if (user.role === "resident" && n.toFlatId && n.toFlatId !== user.flatId) return false;
      return true;
    });
  }, [notifications, user]);

  const unread = relevant.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 shrink-0 bg-ink-800 text-paper flex flex-col">
        <div className="px-5 py-5 border-b border-ink-600">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-signal-amber" />
            <span className="font-head text-sm font-semibold leading-tight">{APARTMENT_NAME}</span>
          </div>
          <p className="text-xs text-ink-300 mt-1 font-mono">{roleLabel} console</p>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-0.5">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm transition-colors ${
                  active ? "bg-paper text-ink-800 font-medium" : "text-ink-300 hover:bg-ink-700 hover:text-paper"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-ink-600">
          <p className="px-2 text-xs text-ink-300 truncate">{user?.name}</p>
          <button
            onClick={logout}
            className="mt-2 flex items-center gap-2 w-full rounded-sm px-2 py-2 text-sm text-ink-300 hover:bg-ink-700 hover:text-paper"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 border-b border-line bg-white flex items-center justify-end px-6 relative shrink-0">
          <button
            onClick={() => setBellOpen((o) => !o)}
            className="relative p-2 rounded-sm hover:bg-paper2 text-ink-600"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-signal-red" />
            )}
          </button>
          {bellOpen && (
            <div className="absolute right-4 top-14 w-80 bg-white border border-line rounded-sm shadow-lg z-40 max-h-96 overflow-y-auto">
              <div className="px-4 py-2.5 border-b border-line font-head text-sm font-semibold">Notifications</div>
              {relevant.length === 0 ? (
                <p className="px-4 py-6 text-sm text-ink-400 text-center">Nothing new.</p>
              ) : (
                relevant.slice(0, 20).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`block w-full text-left px-4 py-2.5 border-b border-line last:border-0 hover:bg-paper2 ${
                      n.read ? "opacity-60" : ""
                    }`}
                  >
                    <p className="text-sm font-medium text-ink-800">{n.title}</p>
                    <p className="text-xs text-ink-600 mt-0.5">{n.body}</p>
                    <p className="text-xs text-ink-400 mt-1 font-mono">{timeAgo(n.createdAt)}</p>
                  </button>
                ))
              )}
            </div>
          )}
        </header>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
