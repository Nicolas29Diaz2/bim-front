import type { Result } from "@/common/api/result";
import { ok, err } from "@/common/api/result";
import { createAppError, type AppError } from "@/common/api/errors";
import { Incident } from "../types/incidents";
import { INCIDENTS_MOCK } from "../constants/incidentsMock";

export async function getIncidentsByProject(): Promise<
  Result<Incident[], AppError>
> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (INCIDENTS_MOCK.length === 0) {
    return err(
      createAppError("UNKNOWN_ERROR", "No projects found for this user."),
    );
  }

  return ok(INCIDENTS_MOCK);
}
