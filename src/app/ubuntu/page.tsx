import { redirect } from "next/navigation";
import { requireCohortAccess } from "@/lib/require-cohort-access";

// The bare /ubuntu root has no content of its own — it's the entry point
// the site's "Ubuntu" nav link and CTAs point at (learn.mikaelsoninitiative.org/ubuntu).
// Signed-in, admitted students land in their Space; everyone else lands on
// login, exactly like every other /ubuntu/(protected) page already does.
export default async function UbuntuEntryPage() {
  const { error } = await requireCohortAccess();
  redirect(error ? "/ubuntu/login" : "/ubuntu/space");
}
