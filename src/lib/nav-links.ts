export type NavLink = {
  href: string;
  label: string;
};

export type NavGroup = {
  label: string;
  links: NavLink[];
};

// Three grouped dropdowns replace the old flat top-level links + single
// About dropdown. Framework and Community were removed from here on
// request — their pages still exist, just unlinked from navigation.
export const navGroups: NavGroup[] = [
  {
    label: "Research Community",
    links: [
      { href: "/focus-areas", label: "Focus Areas" },
      { href: "/call-for-papers", label: "Call for Papers" },
      { href: "/submit", label: "Submit a Paper" },
      { href: "/ubuntu", label: "Ubuntu" },
    ],
  },
  {
    label: "Library",
    links: [
      { href: "/library/books", label: "Books" },
      { href: "/library/archive", label: "Published Papers / Archive" },
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
  { href: "/library", label: "Library" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Submission" },
];
