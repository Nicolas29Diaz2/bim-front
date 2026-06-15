import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");
  return <div>This is the dashboard page</div>;
}

export default DashboardPage;
