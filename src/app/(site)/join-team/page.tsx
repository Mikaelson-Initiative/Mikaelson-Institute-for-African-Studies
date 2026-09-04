import type { Metadata } from "next";
import JoinTeamClient from "./join-team-client";

export const metadata: Metadata = {
  title: "Join Our Team",
  description:
    "Volunteer with the Mikaelson Institute for African Studies as a curriculum historian, instructional designer, full-stack engineer, community manager, program lead, social media manager, or academic partnerships lead.",
  alternates: { canonical: "/join-team" },
};

export default function JoinTeamPage() {
  return <JoinTeamClient />;
}
