"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="bg-cream text-ink flex min-h-screen items-center justify-center px-5">
      <div className="max-w-lg text-center">
        <p className="editorial-kicker text-gold">SSAROMA</p>
        <h1 className="font-display mt-6 text-5xl font-light">This page did not load.</h1>
        <p className="text-ink/60 mt-5 text-sm leading-relaxed">
          Please try again, or return to the house.
        </p>
        <div className="mt-9 flex justify-center gap-7">
          <button onClick={reset} className="link-underlined editorial-kicker">
            Try again
          </button>
          <Link href="/" className="link-rule editorial-kicker text-ink/60">
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
