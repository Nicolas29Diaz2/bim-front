import type { Result } from "@/common/api/result";
import { ok, err } from "@/common/api/result";
import { createAppError, type AppError } from "@/common/api/errors";
import type { Project } from "../types/projects";
import { MOCK_PROJECTS } from "../constants/projectsMock";

export async function getProjectBySlug(
  slug: string,
): Promise<Result<Project, AppError>> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const project = MOCK_PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return err(
      createAppError("NOT_FOUND", `Project "${slug}" does not exist.`, {
        status: 404,
      }),
    );
  }

  return ok(project);
}
