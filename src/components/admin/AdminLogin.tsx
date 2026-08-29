"use client";

import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: data.get("username"), password: data.get("password") }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      router.replace("/admin");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="bg-[#171713] text-[#f3efe5] grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden border-r border-white/10 p-12 lg:flex lg:flex-col lg:justify-between">
        <p className="wordmark text-lg">SSAROMA</p>
        <div>
          <p className="editorial-kicker text-gold">Private operations</p>
          <h1 className="font-display mt-7 max-w-lg text-7xl leading-[.9] font-light">
            The house, managed with intention.
          </h1>
          <p className="mt-7 max-w-md text-sm leading-7 text-white/50">
            Catalog, client orders, fulfillment, content, and commercial performance in one secure
            workspace.
          </p>
        </div>
        <p className="text-xs text-white/30">Peshawar · Pakistan</p>
      </section>
      <section className="bg-[#f1efe9] text-[#171713] flex items-center justify-center px-6 py-16">
        <form onSubmit={submit} className="w-full max-w-md">
          <span className="bg-ink text-cream flex h-12 w-12 items-center justify-center">
            <LockKeyhole className="h-5 w-5" />
          </span>
          <p className="editorial-kicker text-gold mt-8">Administrator access</p>
          <h2 className="font-display mt-4 text-5xl font-light">Welcome back.</h2>
          <div className="mt-9 space-y-5">
            <label className="block">
              <span className="editorial-kicker text-ink/50 mb-2 block">Username</span>
              <Input name="username" required autoComplete="username" className="h-12" />
            </label>
            <label className="block">
              <span className="editorial-kicker text-ink/50 mb-2 block">Password</span>
              <Input
                name="password"
                required
                type="password"
                autoComplete="current-password"
                className="h-12"
              />
            </label>
          </div>
          {error && (
            <p className="mt-4 text-sm text-red-800" role="alert">
              {error}
            </p>
          )}
          <Button disabled={loading} className="mt-7 h-12 w-full bg-ink text-cream">
            {loading ? "Signing in…" : "Sign in securely"}
          </Button>
        </form>
      </section>
    </main>
  );
}
