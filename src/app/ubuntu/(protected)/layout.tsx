import { redirect } from "next/navigation";
import { requireCohortAccess } from "@/lib/require-cohort-access";
import { computeCohortPercent, getCompletedStepIds } from "@/lib/module-progress";
import { LearnTopNav } from "@/components/learn/top-nav";
import { BreadcrumbProvider } from "@/components/learn/breadcrumb-context";

export default async function LearnProtectedLayout({ children }: { children: React.ReactNode }) {
  const { session, application, error } = await requireCohortAccess();
  if (error || !session?.user?.id || !application) redirect("/ubuntu/login?denied=1");

  const modules = application.cohort!.modules;
  const completedStepIds = await getCompletedStepIds(session.user.id, modules.map((m) => m.id));
  const progressPercent = computeCohortPercent(modules, completedStepIds);

  return (
    <div className="min-h-screen bg-[#faf9f8]">
      <BreadcrumbProvider>
        <LearnTopNav cohortTitle={application.cohort!.title} progressPercent={progressPercent} />
        {children}
      </BreadcrumbProvider>
    </div>
  );
}
