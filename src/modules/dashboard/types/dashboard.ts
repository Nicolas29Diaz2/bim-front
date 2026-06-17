import type { Incident } from "@/modules/incidents/types/incidents";

export type PriorityFilter = "critical" | "high" | "medium" | "low";
export type StatusFilter = "all" | "open" | "closed";

export interface DashboardFilters {
  dateFrom: string | null;
  dateTo: string | null;
  categories: string[];
  priorities: PriorityFilter[];
  status: StatusFilter;
}

export interface KpiData {
  totalIncidents: number;
  openCount: number;
  closedCount: number;
  completionRate: number;
  criticalHighCount: number;
  avgResolutionDays: number | null;
}

export interface DonutDataPoint {
  name: string;
  value: number;
  fill: string;
}

export interface CategoryBarDataPoint {
  category: string;
  low: number;
  medium: number;
  high: number;
  critical: number;
}

export interface TrendDataPoint {
  date: string;
  count: number;
  cumulative: number;
}

export type IncidentRow = Pick<
  Incident,
  | "sequenceId"
  | "title"
  | "type"
  | "priority"
  | "status"
  | "assignees"
  | "createdAt"
>;
