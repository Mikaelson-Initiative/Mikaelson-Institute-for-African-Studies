import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
  },
  async headers() {
    // Static media under /public gets Vercel's default `max-age=0,
    // must-revalidate` — every repeat visit re-downloads the hero/library
    // videos and images from scratch. These are content-addressed by
    // convention here (a changed asset gets a new filename, not an
    // overwrite), so it's safe to cache them for a year.
    const longLivedCache = { key: "Cache-Control", value: "public, max-age=31536000, immutable" };

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
      { source: "/hero/:path*", headers: [longLivedCache] },
      { source: "/library/:path*", headers: [longLivedCache] },
      { source: "/logos/:path*", headers: [longLivedCache] },
      { source: "/team/:path*", headers: [longLivedCache] },
      { source: "/images/:path*", headers: [longLivedCache] },
      { source: "/framework/:path*", headers: [longLivedCache] },
    ];
  },
};

export default nextConfig;
