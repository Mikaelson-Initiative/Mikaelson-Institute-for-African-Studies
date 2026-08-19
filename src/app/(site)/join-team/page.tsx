import type { Metadata } from "next";
import JoinTeamClient from "./join-team-client";

export const metadata: Metadata = {
  title: "Join Our Team",
  description:
    "Volunteer with the Mikaelson Institute for African Studies — research and editorial, design and technology, community and outreach, or operations and administration.",
  alternates: { canonical: "/join-team" },
};

export default function JoinTeamPage() {
  return <JoinTeamClient />;
}
