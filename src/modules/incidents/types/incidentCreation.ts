export enum IncidentCreationStep {
  BasicInfo = 1,
  Environment = 2,
  Location = 3,
  Attachments = 4,
}

export enum IncidentPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
  Critical = "critical",
}

export enum IncidentCategory {
  Coordination = "coordination",
  Electrical = "electrical",
  Plumbing = "plumbing",
  Safety = "safety",
  Structure = "structure",
}

export interface IncidentCoordinates {
  lat: number;
  lng: number;
}

export interface IncidentParticipant {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface IncidentTagDraft {
  id: string;
  name: string;
  color: string;
}

export interface IncidentAttachmentDraft {
  id: string;
  name: string;
  type: string;
  size: number;
  file: File;
}

export interface IncidentCreationFormData {
  title: string;
  description: string;
  dueDate: string;
  category: IncidentCategory;
  priority: IncidentPriority;
  assignees: IncidentParticipant[];
  observers: IncidentParticipant[];
  tags: IncidentTagDraft[];
  coordinates: IncidentCoordinates | null;
  building: string;
  level: string;
  sectorDescription: string;
  attachments: IncidentAttachmentDraft[];
}

export interface IncidentCreationPayload extends IncidentCreationFormData {
  projectId: string;
  projectName: string;
}
