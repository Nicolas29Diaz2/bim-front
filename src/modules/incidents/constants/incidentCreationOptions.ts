import {
  IncidentCategory,
  IncidentCreationStep,
  IncidentPriority,
  type IncidentParticipant,
  type IncidentTagDraft,
} from "../types/incidentCreation";

export const INCIDENT_STEPS = [
  {
    step: IncidentCreationStep.BasicInfo,
    label: "incidents.creationModal.steps.info",
  },
  {
    step: IncidentCreationStep.Environment,
    label: "incidents.creationModal.steps.assignment",
  },
  {
    step: IncidentCreationStep.Location,
    label: "incidents.creationModal.steps.location",
  },
  {
    step: IncidentCreationStep.Attachments,
    label: "incidents.creationModal.steps.attachments",
  },
] as const;

export const CATEGORY_OPTIONS = [
  {
    value: IncidentCategory.Coordination,
    label: "incidents.creationModal.categories.coordination",
  },
  {
    value: IncidentCategory.Electrical,
    label: "incidents.creationModal.categories.electrical",
  },
  {
    value: IncidentCategory.Plumbing,
    label: "incidents.creationModal.categories.plumbing",
  },
  {
    value: IncidentCategory.Safety,
    label: "incidents.creationModal.categories.safety",
  },
  {
    value: IncidentCategory.Structure,
    label: "incidents.creationModal.categories.structure",
  },
] as const;

export const PRIORITY_OPTIONS = [
  {
    value: IncidentPriority.Low,
    label: "incidents.creationModal.priorities.low",
    tone: "blue",
  },
  {
    value: IncidentPriority.Medium,
    label: "incidents.creationModal.priorities.medium",
    tone: "green",
  },
  {
    value: IncidentPriority.High,
    label: "incidents.creationModal.priorities.high",
    tone: "orange",
  },
  {
    value: IncidentPriority.Critical,
    label: "incidents.creationModal.priorities.critical",
    tone: "red",
  },
] as const;

export const MOCK_INCIDENT_USERS: IncidentParticipant[] = [
  {
    id: "u1",
    name: "Paula Pardo",
    email: "paula@site.com",
    avatarUrl: "https://i.pravatar.cc/120?u=paula",
  },
  {
    id: "u2",
    name: "Mateo Soto",
    email: "mateo@site.com",
    avatarUrl: "https://i.pravatar.cc/120?u=mateo",
  },
  {
    id: "u3",
    name: "Valentina Ramírez",
    email: "valentina@site.com",
    avatarUrl: "https://i.pravatar.cc/120?u=valentina",
  },
  {
    id: "u4",
    name: "Sebastián Castro",
    email: "sebastian@site.com",
    avatarUrl: "https://i.pravatar.cc/120?u=sebastian",
  },
];

export const TAG_OPTIONS: IncidentTagDraft[] = [
  { id: "tag-risk", name: "Riesgo", color: "#BA1A1A" },
  { id: "tag-rfi", name: "RFI", color: "#2563EB" },
  { id: "tag-rework", name: "Reproceso", color: "#F97316" },
  { id: "tag-bim", name: "BIM", color: "#10B981" },
];

export const BUILDING_OPTIONS = ["Torre Norte", "Torre Sur", "Podio", "Sótano"];
export const LEVEL_OPTIONS = [
  "Nivel -2",
  "Nivel -1",
  "Nivel 1",
  "Nivel 4",
  "Nivel 7",
  "Cubierta",
];
