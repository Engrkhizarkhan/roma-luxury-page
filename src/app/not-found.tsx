import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-cream text-ink flex min-h-screen items-center justify-center px-5">
      <div className="max-w-lg text-center">
        <p className="editorial-kicker text-gold">404</p>
        <h1 className="font-display mt-6 text-6xl font-light">This trail ends here.</h1>
        <p className="text-ink/60 mt-5 text-sm leading-relaxed">
          The page you were looking for is no longer available.
        </p>
        <Link
          href="/"
          className="link-underlined editorial-kicker text-ink hover:text-gold mt-9 inline-block"
        >
          Return to SSAROMA →
        </Link>
      </div>
    </main>
  );
}
