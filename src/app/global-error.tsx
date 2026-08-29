"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className="bg-cream text-ink flex min-h-screen items-center justify-center px-5">
          <div className="max-w-lg text-center">
            <p className="editorial-kicker text-gold">SSAROMA</p>
            <h1 className="font-display mt-6 text-5xl font-light">
              The house is temporarily unavailable.
            </h1>
            <p className="text-ink/60 mt-5 text-sm leading-relaxed">
              Please try once more. If the problem continues, return in a few minutes.
            </p>
            <button onClick={reset} className="link-underlined editorial-kicker mt-9">
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
