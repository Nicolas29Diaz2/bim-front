import { auth } from "@/auth";
import { isErr } from "@/common/api/result";
import { DashboardPage } from "@/modules/dashboard/components/DashboardPage";
import { getIncidentsByProject } from "@/modules/incidents/services/getIncidentsByProject.service";
import { redirect } from "next/navigation";

async function DashboardPageRoute({
  params,
}: {
  params: Promise<{ locale: string; project_slug: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session) redirect(`/${locale}/login`);

  const incidents = await getIncidentsByProject();
  const finalIncidents = isErr(incidents) ? [] : incidents.value;

  return <DashboardPage incidents={finalIncidents} />;
}

export default DashboardPageRoute;
