import type { Result } from "@/common/api/result";
import { err, ok } from "@/common/api/result";
import { createAppError, type AppError } from "@/common/api/errors";
import { INCIDENTS_MOCK } from "../constants/incidentsMock";
import { CATEGORY_OPTIONS } from "../constants/incidentCreationOptions";
import type { Incident } from "../types/incidents";
import type { IncidentCreationPayload } from "../types/incidentCreation";

const DEFAULT_PROJECT_ID = "mock-project-current";

function createSequence(order: number): string {
  return String(order).padStart(4, "0");
}

function getFormat(fileName: string): string {
  const [, extension = "file"] = fileName.split(/\.([^.]*)$/);
  return extension.toLowerCase();
}

function resolveCategory(payload: IncidentCreationPayload) {
  const match = CATEGORY_OPTIONS.find(
    (item) => item.value === payload.category,
  );
  const name = match?.label ?? "Incidencia";
  return {
    id: `type-${payload.category}`,
    key: payload.category,
    name,
    name_en: name,
  };
}

export async function createIncident(
  payload: IncidentCreationPayload,
): Promise<Result<Incident, AppError>> {
  await new Promise((resolve) => setTimeout(resolve, 650));

  if (!payload.coordinates) {
    return err(createAppError("UNKNOWN_ERROR", "Select a map location first."));
  }

  const now = new Date().toISOString();
  const order = INCIDENTS_MOCK.length + 1;
  const incident: Incident = {
    id: crypto.randomUUID(),
    sequenceId: createSequence(order),
    order,
    title: payload.title,
    description: payload.description,
    type: resolveCategory(payload),
    priority: payload.priority,
    status: "open",
    approval: false,
    project: {
      id: payload.projectId || DEFAULT_PROJECT_ID,
      name: payload.projectName,
    },
    owner: null,
    whatsappOwner: null,
    assignees: payload.assignees,
    observers: payload.observers,
    coordinates: payload.coordinates,
    locationDescription: `${payload.building} / ${payload.level} - ${payload.sectorDescription}`,
    dueDate: payload.dueDate ? new Date(payload.dueDate).toISOString() : null,
    closingDate: null,
    media: payload.attachments.map((file) => ({
      id: file.id,
      name: file.name,
      type: file.type.startsWith("image/") ? "image" : "document",
      format: getFormat(file.name),
      size: file.size,
      status: "queued",
      url: "",
    })),
    tags: payload.tags,
    deleted: null,
    createdAt: now,
    updatedAt: now,
  };

  INCIDENTS_MOCK.unshift(incident);
  return ok(incident);
}
