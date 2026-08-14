export type NavLink = {
  href: string;
  label: string;
};

export type NavGroup = {
  label: string;
  links: NavLink[];
};

// Three grouped dropdowns replace the old flat top-level links + single
// About dropdown. Community was removed from here on request — its page
// still exists, just unlinked from navigation. Framework was reinstated
// and Submit a Paper removed in its place: Ubuntu (cohort-based learning)
// is the current priority, not paper submissions (2026-08-14).
export const navGroups: NavGroup[] = [
  {
    label: "Research Community",
    links: [
      { href: "/call-for-papers", label: "Call for Papers" },
      { href: "/framework", label: "Framework" },
      { href: "/ubuntu", label: "Ubuntu" },
      { href: "/stem-and-metaphysics", label: "STEM & Metaphysics" },
    ],
  },
  {
    label: "Library",
    links: [
      { href: "/library/books", label: "Books" },
      { href: "/library/archive", label: "Published Papers / Archive" },
      { href: "/library/gallery", label: "Gallery" },
    ],
  },
  {
    label: "About",
    links: [
      { href: "/about", label: "Mission" },
      { href: "/team", label: "Team" },
      { href: "/partners", label: "Partners" },
    ],
  },
];

export const footerNavLinks: NavLink[] = [
  ...navGroups.flatMap((group) => group.links),
  // Submit a Paper was removed from the Research Community dropdown above
  // (2026-08-14) but kept here — the footer link wasn't asked to change.
  { href: "/submit", label: "Submit a Paper" },
  { href: "/library", label: "Library" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Submission" },
];
