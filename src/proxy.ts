import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LEARN_HOST = "learn.mikaelsoninitiative.org";

// Local dev and Vercel preview deployments don't have learn.* attached, so
// host-based routing would just break them — exempt entirely.
function isExemptHost(host: string) {
  return host.startsWith("localhost") || host.endsWith(".vercel.app");
}

function isUbuntuPath(pathname: string) {
  return pathname === "/ubuntu" || pathname.startsWith("/ubuntu/");
}

// Routes the LMS itself depends on that don't live under /ubuntu: NextAuth's
// own endpoints (session/csrf/callback — used by the email-code sign-in
// flow) and the cohort-gated send-code route. These must keep working on
// learn.mikaelsoninitiative.org even though their paths aren't /ubuntu/*.
function isSharedAuthPath(pathname: string) {
  return pathname.startsWith("/api/auth") || pathname.startsWith("/api/ubuntu");
}

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (isExemptHost(host)) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;

  if (host === LEARN_HOST) {
    // learn.mikaelsoninitiative.org is the LMS's own domain — for now that
    // means Ubuntu only. Anything else (the institute homepage, other site
    // pages) has no business rendering here; send it into the LMS instead
    // of exposing the main site under a second host. When a second learning
    // platform exists, its own path joins this allowlist alongside /ubuntu.
    if (isUbuntuPath(pathname) || isSharedAuthPath(pathname)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/ubuntu", request.url), 307);
  }

  // Any other host (the institute domain, or anything else) shouldn't serve
  // the LMS directly — redirect to the canonical learn domain instead of a
  // dead 404, and to avoid the same content being indexable at two hosts.
  if (isUbuntuPath(pathname)) {
    return NextResponse.redirect(new URL(pathname + search, `https://${LEARN_HOST}`), 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
