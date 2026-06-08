"use client";

import { useState } from "react";
import { Lock, Mail, Sparkles } from "lucide-react";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { createSupabaseBrowserClient } from "@/lib/supabase";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );
}

export function AuthPanel() {
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin");
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState("Demo mode: add Supabase env vars to enable live auth.");

  async function handleEmailAuth(formData: FormData) {
    setLoading(mode);
    const supabase = createSupabaseBrowserClient();
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    if (!supabase) {
      setMessage("Supabase credentials are not configured yet.");
      setLoading(null);
      return;
    }
    const action = mode === "signup" ? supabase.auth.signUp({ email, password }) : mode === "reset" ? supabase.auth.resetPasswordForEmail(email) : supabase.auth.signInWithPassword({ email, password });
    const { error } = await action;
    setMessage(error?.message ?? "Check your inbox or session state to continue.");
    setLoading(null);
  }

  async function handleGoogle() {
    setLoading("google");
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Supabase credentials are not configured yet.");
      setLoading(null);
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/auth/callback` } });
    if (error) setMessage(error.message);
    setLoading(null);
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="relative space-y-5">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white"><Sparkles /></div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-300">Secure portal</p>
          <h2 className="mt-2 text-3xl font-bold">{mode === "signup" ? "Create your PetGalaxy" : mode === "reset" ? "Reset password" : "Welcome back"}</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Email, password, and Google OAuth are wired through Supabase Auth with production-ready loading states.</p>
        </div>
        <form action={handleEmailAuth} className="space-y-4">
          <Field label="Email"><div className="relative"><Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" /><input className={`${inputClass} pl-11`} name="email" type="email" required placeholder="you@example.com" /></div></Field>
          {mode !== "reset" ? <Field label="Password"><div className="relative"><Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" /><input className={`${inputClass} pl-11`} name="password" type="password" required minLength={8} placeholder="••••••••" /></div></Field> : null}
          <Button className="w-full" disabled={Boolean(loading)}>{loading === mode ? "Please wait..." : mode === "signup" ? "Sign Up" : mode === "reset" ? "Send reset link" : "Sign In"}</Button>
        </form>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="outline" onClick={handleGoogle} disabled={Boolean(loading)}><GoogleIcon /> Sign In with Google</Button>
          <Button variant="outline" onClick={handleGoogle} disabled={Boolean(loading)}><GoogleIcon /> Sign Up with Google</Button>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
          <button className="font-semibold text-blue-600 dark:text-blue-300" onClick={() => setMode(mode === "signup" ? "signin" : "signup")}>{mode === "signup" ? "Have an account? Sign in" : "New here? Sign up"}</button>
          <button className="font-semibold text-violet-600 dark:text-violet-300" onClick={() => setMode("reset")}>Forgot password?</button>
        </div>
        <p className="rounded-2xl bg-slate-950/5 p-3 text-xs text-slate-600 dark:bg-white/10 dark:text-slate-300">{message}</p>
      </div>
    </Card>
  );
}
