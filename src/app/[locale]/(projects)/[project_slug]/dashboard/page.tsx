import { auth } from "@/auth";
import { isErr } from "@/common/api/result";
import { Role } from "@/common/types/role";
import { DashboardPage } from "@/modules/dashboard/components/DashboardPage";
import { getIncidentsByProject } from "@/modules/incidents/services/getIncidentsByProject.service";
import { redirect } from "next/navigation";

async function DashboardPageRoute({
  params,
}: Readonly<{
  params: Promise<{ locale: string; project_slug: string }>;
}>) {
  const { locale } = await params;
  const session = await auth();
  if (!session) redirect(`/${locale}/login`);

  const isFieldEngineer = session.user.role === Role.FIELD_ENGINEER;

  const incidents = await getIncidentsByProject();
  const allIncidents = isErr(incidents) ? [] : incidents.value;

  const finalIncidents = isFieldEngineer
    ? allIncidents.filter((inc) =>
        inc.assignees.some((a) => a.id === session.user.id),
      )
    : allIncidents;

  return <DashboardPage incidents={finalIncidents} />;
}

export default DashboardPageRoute;
