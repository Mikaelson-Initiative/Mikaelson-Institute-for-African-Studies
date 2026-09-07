import type { Metadata } from "next";
import SignupClient from "./signup-client";

export const metadata: Metadata = {
  title: "Apply to Cohort 01",
  description:
    "Apply to Ubuntu, the Mikaelson Institute's cohort-based learning program in African history.",
  alternates: { canonical: "/signup" },
};

export default function SignupPage() {
  return <SignupClient />;
}
