import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
