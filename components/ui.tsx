import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({ className, variant = "primary", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "outline" }) {
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.01]",
    secondary: "bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:scale-[1.01]",
    ghost: "hover:bg-slate-900/5 dark:hover:bg-white/10",
    outline: "border border-slate-200/80 bg-white/70 dark:border-white/10 dark:bg-white/5"
  };
  return <button className={cn("focus-ring inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50", variants[variant], className)} {...props} />;
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <section className={cn("glass rounded-[2rem] p-6 text-[color:var(--foreground)]", className)} {...props} />;
}

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-200", className)} {...props} />;
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
      <span>{label}</span>
      {children}
      {hint ? <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{hint}</span> : null}
    </label>
  );
}

const fieldControlBase =
  "focus-ring w-full rounded-2xl border px-4 py-3 text-sm shadow-inner shadow-slate-900/5 placeholder:text-slate-400 transition-colors";

export const inputClass =
  `${fieldControlBase} border-slate-200/80 bg-white/85 text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-white`;

export const selectClass =
  `${fieldControlBase} border-slate-200/80 bg-white/85 text-slate-950 dark:border-white/10 dark:bg-slate-900/95 dark:text-white`;
