"use client";

import React from "react";

type StatusKind = "pending" | "approved" | "rejected" | "inside" | "exited" | "neutral" | "blocked";

const statusStyles: Record<StatusKind, string> = {
  pending: "bg-signal-amber/15 text-signal-amberDark border-signal-amber/40",
  approved: "bg-signal-green/15 text-signal-greenDark border-signal-green/40",
  inside: "bg-signal-blue/15 text-signal-blue border-signal-blue/40",
  exited: "bg-ink-300/20 text-ink-600 border-ink-300/40",
  rejected: "bg-signal-red/15 text-signal-redDark border-signal-red/40",
  blocked: "bg-signal-red/15 text-signal-redDark border-signal-red/40",
  neutral: "bg-ink-300/15 text-ink-600 border-ink-300/40",
};

export function Badge({ kind = "neutral", children }: { kind?: StatusKind; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${statusStyles[kind]}`}
    >
      {children}
    </span>
  );
}

export function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: "amber" | "green" | "red" | "blue" | "none";
}) {
  const borderColor =
    accent === "amber"
      ? "border-l-signal-amber"
      : accent === "green"
      ? "border-l-signal-green"
      : accent === "red"
      ? "border-l-signal-red"
      : accent === "blue"
      ? "border-l-signal-blue"
      : "border-l-line";
  return (
    <div className={`bg-white border border-line ${borderColor} border-l-[3px] rounded-sm px-4 py-3`}>
      <p className="text-xs text-ink-400 mb-1">{label}</p>
      <p className="font-head text-2xl font-semibold text-ink-800 font-tab">{value}</p>
    </div>
  );
}

export function Card({ title, action, children, className = "" }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-line rounded-sm ${className}`}>
      {title && (
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h3 className="font-head text-sm font-semibold text-ink-800">{title}</h3>
          {action}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="py-8 text-center text-sm text-ink-400 border border-dashed border-line rounded-sm">
      {text}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "ghost" }) {
  const base = "inline-flex items-center justify-center gap-1.5 rounded-sm text-sm font-medium px-3.5 py-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const styles = {
    primary: "bg-ink-800 text-paper hover:bg-ink-700",
    secondary: "bg-white text-ink-800 border border-line hover:border-ink-400",
    danger: "bg-signal-red text-white hover:bg-signal-redDark",
    ghost: "text-ink-600 hover:bg-paper2",
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block mb-3">
      <span className="block text-xs font-medium text-ink-600 mb-1">{label}</span>
      {children}
      {hint && <span className="block text-xs text-ink-400 mt-1">{hint}</span>}
    </label>
  );
}

const inputBase =
  "w-full rounded-sm border border-line bg-white px-3 py-2 text-sm text-ink-800 placeholder:text-ink-300 focus:border-signal-blue";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBase} ${props.className ?? ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputBase} ${props.className ?? ""}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputBase} ${props.className ?? ""}`} />;
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-800/40 px-4" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-paper border border-line rounded-sm shadow-xl max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-3 sticky top-0 bg-paper">
          <h3 className="font-head text-base font-semibold text-ink-800">{title}</h3>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-800 text-xl leading-none px-1">
            ×
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function timeAgo(iso?: string): string {
  if (!iso) return "—";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function formatTime(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}
