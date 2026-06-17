import { auth } from "@/auth";
import { isErr } from "@/common/api/result";
import { DashboardPage } from "@/modules/dashboard/components/DashboardPage";
import { getIncidentsByProject } from "@/modules/incidents/services/getIncidentsByProject.service";
import { redirect } from "next/navigation";

async function DashboardPageRoute() {
  const session = await auth();
  if (!session) redirect("/login");

  const incidents = await getIncidentsByProject();
  const finalIncidents = isErr(incidents) ? [] : incidents.value;

  return <DashboardPage incidents={finalIncidents} />;
}

export default DashboardPageRoute;
