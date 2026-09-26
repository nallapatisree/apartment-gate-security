"use client";

import React, { useEffect, useState } from "react";
import { AuthProvider } from "@/lib/auth";
import { useGateStore } from "@/lib/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.resolve(useGateStore.persist.rehydrate()).finally(() => {
      if (active) setHydrated(true);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <p className="font-mono text-sm text-ink-400 tracking-wide">Loading gate records…</p>
      </div>
    );
  }

  return <AuthProvider>{children}</AuthProvider>;
}
