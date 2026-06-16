import { auth } from "@/auth";
import { isErr } from "@/common/api/result";
import { IncidentsMap } from "@/modules/incidents/components/IncidentsMap";
import { OverlayControls } from "@/modules/incidents/components/OverlayControls";
import { getIncidentsByProject } from "@/modules/incidents/services/getIncidentsByProject.service";
import { redirect } from "next/navigation";

async function IncidentsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const incidents = await getIncidentsByProject();
  const finalIncidents = isErr(incidents) ? [] : incidents.value;

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* <OverlayControls /> */}
      <IncidentsMap incidents={finalIncidents} />
    </div>
  );
}

export default IncidentsPage;
