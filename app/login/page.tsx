"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { seedGuards, seedResidents, seedFlats, APARTMENT_NAME } from "@/lib/seed";
import { Button, Input, Select, Field } from "@/components/ui";
import { Role } from "@/lib/types";

const ADMIN_USER = { username: "admin", password: "admin123" };

const ledgerPreview = [
  { time: "07:12", text: "Kiran Mehta checked in at Main Gate — Guest, Flat A-203" },
  { time: "07:04", text: "Swiggy delivery entered for Flat B-205" },
  { time: "06:58", text: "Ravi (Driver) exited — Flat B-101" },
  { time: "06:41", text: "Vehicle AP 03 CD 4521 logged at boom barrier" },
];

export default function LoginPage() {
  const [role, setRole] = useState<Role>("guard");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  // admin fields
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");

  // guard fields
  const [guardId, setGuardId] = useState(seedGuards[0]?.id ?? "");
  const [guardPass, setGuardPass] = useState("");

  // resident fields
  const [residentId, setResidentId] = useState(seedResidents[0]?.id ?? "");
  const [residentPass, setResidentPass] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (role === "admin") {
      if (adminUser.trim() !== ADMIN_USER.username || adminPass !== ADMIN_USER.password) {
        setError("Incorrect admin username or password.");
        return;
      }
      login({ role: "admin", id: "admin-1", name: "Community Admin" });
      router.push("/admin");
      return;
    }

    if (role === "guard") {
      const g = seedGuards.find((x) => x.id === guardId);
      if (!g || guardPass.length < 3) {
        setError("Select a guard and enter a password (min 3 characters for this demo).");
        return;
      }
      login({ role: "guard", id: g.id, name: g.name });
      router.push("/guard");
      return;
    }

    const r = seedResidents.find((x) => x.id === residentId);
    if (!r || residentPass.length < 3) {
      setError("Select your name and enter a password (min 3 characters for this demo).");
      return;
    }
    login({ role: "resident", id: r.id, name: r.name, flatId: r.flatId });
    router.push("/resident");
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between bg-ink-800 text-paper p-10">
        <div>
          <div className="flex items-center gap-2 mb-16">
            <ShieldCheck size={22} className="text-signal-amber" />
            <span className="font-head text-sm font-semibold">{APARTMENT_NAME}</span>
          </div>
          <h1 className="font-head text-4xl leading-tight font-semibold max-w-sm">
            Every visitor, delivery and vehicle — logged at the gate, approved from home.
          </h1>
          <p className="text-ink-300 mt-4 max-w-sm text-sm leading-relaxed">
            One gate register for security guards, residents and the management office. No more paper logbooks.
          </p>
        </div>

        <div className="border border-ink-600 rounded-sm bg-ink-700/60">
          <div className="px-4 py-2 border-b border-ink-600 font-mono text-xs text-ink-300">LIVE GATE LOG</div>
          <ul className="divide-y divide-ink-600">
            {ledgerPreview.map((row, i) => (
              <li key={i} className="flex gap-3 px-4 py-2.5 text-xs">
                <span className="font-mono text-signal-amber shrink-0">{row.time}</span>
                <span className="text-ink-300">{row.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="md:hidden flex items-center gap-2 mb-8">
            <ShieldCheck size={20} className="text-signal-amberDark" />
            <span className="font-head text-sm font-semibold text-ink-800">{APARTMENT_NAME}</span>
          </div>

          <h2 className="font-head text-2xl font-semibold text-ink-800">Sign in to the gate console</h2>
          <p className="text-sm text-ink-400 mt-1 mb-6">Choose your role to continue.</p>

          <div className="grid grid-cols-3 gap-1 bg-paper2 rounded-sm p-1 mb-6">
            {(["admin", "guard", "resident"] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRole(r);
                  setError("");
                }}
                className={`py-1.5 rounded-sm text-sm font-medium capitalize transition-colors ${
                  role === r ? "bg-white text-ink-800 shadow-sm" : "text-ink-400 hover:text-ink-600"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {role === "admin" && (
              <>
                <Field label="Username">
                  <Input value={adminUser} onChange={(e) => setAdminUser(e.target.value)} placeholder="admin" />
                </Field>
                <Field label="Password" hint="Demo credentials: admin / admin123">
                  <Input type="password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} placeholder="••••••••" />
                </Field>
              </>
            )}

            {role === "guard" && (
              <>
                <Field label="Guard">
                  <Select value={guardId} onChange={(e) => setGuardId(e.target.value)}>
                    {seedGuards.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} — {g.gate}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Password" hint="Any password works in this demo">
                  <Input type="password" value={guardPass} onChange={(e) => setGuardPass(e.target.value)} placeholder="••••••••" />
                </Field>
              </>
            )}

            {role === "resident" && (
              <>
                <Field label="Resident">
                  <Select value={residentId} onChange={(e) => setResidentId(e.target.value)}>
                    {seedResidents.map((r) => {
                      const flat = seedFlats.find((f) => f.id === r.flatId);
                      return (
                        <option key={r.id} value={r.id}>
                          {r.name} — {flat?.number}
                        </option>
                      );
                    })}
                  </Select>
                </Field>
                <Field label="Password" hint="Any password works in this demo">
                  <Input type="password" value={residentPass} onChange={(e) => setResidentPass(e.target.value)} placeholder="••••••••" />
                </Field>
              </>
            )}

            {error && <p className="text-sm text-signal-redDark mb-3">{error}</p>}

            <Button type="submit" className="w-full mt-2">
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
