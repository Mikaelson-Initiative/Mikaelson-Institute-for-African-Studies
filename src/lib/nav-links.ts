export type NavLink = {
  href: string;
  label: string;
};

// Direct top-level links.
// Publications/Archive is Phase 3 (MIAS_PRD.md Sec. 9 Build Order) — added
// here once its pages exist so this list never links somewhere unbuilt.
export const primaryNavLinks: NavLink[] = [
  { href: "/focus-areas", label: "Focus Areas" },
  { href: "/framework", label: "Framework" },
  { href: "/call-for-papers", label: "Call for Papers" },
];

// Grouped under the "About" dropdown in the header (desktop) — shown as a
// flat continuation of the mobile menu instead of a nested submenu there.
export const aboutDropdownLinks: NavLink[] = [
  { href: "/about", label: "About Us" },
  { href: "/team", label: "Team" },
  { href: "/community", label: "Community" },
  { href: "/contact", label: "Contact" },
];

export const footerNavLinks: NavLink[] = [
  ...primaryNavLinks,
  ...aboutDropdownLinks,
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Submission" },
];
