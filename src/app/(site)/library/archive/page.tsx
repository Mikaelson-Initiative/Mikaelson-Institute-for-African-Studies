import type { Metadata } from "next";
import ArchiveClient from "./archive-client";

export const metadata: Metadata = {
  title: "Published Papers & Archive",
  description:
    "The permanent, citable record of scholarship accepted by the Mikaelson Institute for African Studies, organised by research area.",
  alternates: { canonical: "/library/archive" },
};

export default function ArchivePage() {
  return <ArchiveClient />;
}
