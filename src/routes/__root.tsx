import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="bg-cream text-ink flex min-h-screen items-center justify-center px-5">
      <div className="max-w-lg text-center">
        <p className="editorial-kicker text-gold">404</p>
        <h1 className="font-display mt-6 text-6xl font-light">This trail ends here.</h1>
        <p className="text-ink/60 mt-5 text-sm leading-relaxed">
          The page you were looking for is no longer available.
        </p>
        <Link
          to="/"
          className="link-underlined editorial-kicker text-ink hover:text-gold mt-9 inline-block"
        >
          Return to SSAROMA →
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="bg-cream text-ink flex min-h-screen items-center justify-center px-5">
      <div className="max-w-lg text-center">
        <p className="editorial-kicker text-gold">SSAROMA</p>
        <h1 className="font-display mt-6 text-5xl font-light">This page did not load.</h1>
        <p className="text-ink/60 mt-5 text-sm leading-relaxed">
          Please try again, or return to the house.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-7">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="link-underlined editorial-kicker text-ink hover:text-gold"
          >
            Try again
          </button>
          <a href="/" className="link-rule editorial-kicker text-ink/60 hover:text-ink">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SSAROMA | Fragrance Boutique" },
      {
        name: "description",
        content: "SSAROMA is an intimate fragrance boutique in Peshawar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Manrope:wght@400;500;600&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
