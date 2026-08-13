// The real production domain hasn't been confirmed yet (see
// docs/backend-services-plan.md open questions) — set NEXT_PUBLIC_SITE_URL
// once it is. Falls back to the Vercel-provided deployment URL so preview/
// production builds still generate a valid absolute sitemap in the meantime.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
