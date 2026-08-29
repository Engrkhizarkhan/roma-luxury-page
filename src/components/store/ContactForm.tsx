"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("sending");
    setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      form.reset();
      setState("sent");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Your message could not be sent.");
      setState("idle");
    }
  };
  if (state === "sent")
    return (
      <div className="border-ink/14 border-y py-16 text-center">
        <p className="editorial-kicker text-gold">Message received</p>
        <h2 className="font-display mt-5 text-5xl font-light">We will be in touch.</h2>
        <button onClick={() => setState("idle")} className="link-underlined editorial-kicker mt-7">
          Send another message
        </button>
      </div>
    );
  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name">
          <Input name="name" required />
        </Field>
        <Field label="Email">
          <Input name="email" type="email" required />
        </Field>
        <Field label="Phone (optional)">
          <Input name="phone" type="tel" />
        </Field>
        <Field label="Subject">
          <Input name="subject" required />
        </Field>
      </div>
      <Field label="Message">
        <Textarea name="message" required minLength={10} rows={7} />
      </Field>
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px]"
        aria-hidden="true"
      />
      {error && (
        <p className="text-sm text-red-800" role="alert">
          {error}
        </p>
      )}
      <Button disabled={state === "sending"} className="h-13 w-full sm:w-auto sm:px-10">
        {state === "sending" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="editorial-kicker text-ink/50 mb-2 block">{label}</span>
      {children}
    </label>
  );
}
