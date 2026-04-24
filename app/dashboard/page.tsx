import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { getServerSession } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    redirect("/login");
  }

  return <DashboardClient userId={session.user.email} />;
}
