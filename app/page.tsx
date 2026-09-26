"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
    } else {
      router.replace(`/${user.role}`);
    }
  }, [ready, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-mono text-sm text-ink-400">Checking gate pass…</p>
    </div>
  );
}
