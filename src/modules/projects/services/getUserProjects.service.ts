import type { Result } from "@/common/api/result";
import { ok, err } from "@/common/api/result";
import { createAppError, type AppError } from "@/common/api/errors";
import type { Project } from "../types/projects";
import { MOCK_PROJECTS } from "../constants/projectsMock";

export async function getUserProjects(): Promise<
  Result<readonly Project[], AppError>
> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (MOCK_PROJECTS.length === 0) {
    return err(
      createAppError("UNKNOWN_ERROR", "No projects found for this user."),
    );
  }

  return ok(MOCK_PROJECTS);
}
