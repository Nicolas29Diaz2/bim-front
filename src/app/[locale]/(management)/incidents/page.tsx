import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function IncidentsPage() {
  const session = await auth();
  if (!session) redirect("/login");
  return <div>This is incidents page</div>;
}

export default IncidentsPage;
