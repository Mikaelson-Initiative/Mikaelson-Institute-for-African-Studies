import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// globe-test is a dev scratch page (no metadata, not linked in nav) —
// deliberately excluded, along with anything under /api.
const routes = [
  "",
  "/about",
  "/call-for-papers",
  "/contact",
  "/framework",
  "/library",
  "/library/archive",
  "/library/books",
  "/partners",
  "/privacy",
  "/submit",
  "/team",
  "/terms",
  "/ubuntu",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
