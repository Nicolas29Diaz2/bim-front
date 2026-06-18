import { auth } from "@/auth";
import { isErr } from "@/common/api/result";
import { IncidentsWorkspace } from "@/modules/incidents/components/IncidentsWorkspace";
import { getIncidentsByProject } from "@/modules/incidents/services/getIncidentsByProject.service";
import { redirect } from "next/navigation";

async function IncidentsPage({
  params,
}: {
  params: Promise<{ locale: string; project_slug: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session) redirect(`/${locale}/login`);

  const incidents = await getIncidentsByProject();
  const finalIncidents = isErr(incidents) ? [] : incidents.value;

  return <IncidentsWorkspace initialIncidents={finalIncidents} />;
}

export default IncidentsPage;
