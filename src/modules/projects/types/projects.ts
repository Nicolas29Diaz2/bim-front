export type ProjectStatus =
  | "en_curso"
  | "planificacion"
  | "completado"
  | "pausado";

export interface Project {
  id: string;
  name: string;
  slug: string;
  location: string;
  country: string;
  status: ProjectStatus;
  progress: number;
  imageUrl: string;
  incidentCount: number;
  lastActivity: string;
}
