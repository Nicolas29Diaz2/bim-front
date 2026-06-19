import { create } from "zustand";
import type { Incident } from "@/modules/incidents/types/incidents";
import type {
  DashboardFilters,
  PriorityFilter,
  StatusFilter,
  AssigneeFilter,
} from "../types/dashboard";
import { parseISO, startOfDay } from "date-fns";

// ── Store Shape ───────────────────────────────────────
interface DashboardStore {
  allIncidents: Incident[];
  filteredIncidents: Incident[];
  filters: DashboardFilters;
  searchQuery: string;

  setIncidents: (incidents: Incident[]) => void;
  setDateRange: (from: string | null, to: string | null) => void;
  setCategories: (categories: string[]) => void;
  setPriorities: (priorities: PriorityFilter[]) => void;
  setStatus: (status: StatusFilter) => void;
  setAssignees: (assignees: AssigneeFilter[]) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

// ── Pure Helper ───────────────────────────────────────
const DEFAULT_FILTERS: DashboardFilters = {
  dateFrom: null,
  dateTo: null,
  categories: [],
  priorities: [],
  status: "all",
  assignees: [],
};

export function applyFilters(
  incidents: Incident[],
  filters: DashboardFilters,
): Incident[] {
  return incidents.filter((inc) => {
    if (filters.assignees.length > 0) {
      if (
        !filters.assignees.some((aid) =>
          inc.assignees.some((a) => a.id === aid),
        )
      )
        return false;
    }

    if (filters.dateFrom) {
      if (parseISO(inc.createdAt) < startOfDay(parseISO(filters.dateFrom)))
        return false;
    }
    if (filters.dateTo) {
      const toEnd = startOfDay(parseISO(filters.dateTo));
      toEnd.setHours(23, 59, 59, 999);
      if (parseISO(inc.createdAt) > toEnd) return false;
    }
    if (filters.categories.length > 0) {
      if (!filters.categories.includes(inc.type.key)) return false;
    }
    if (filters.priorities.length > 0) {
      if (!filters.priorities.includes(inc.priority as PriorityFilter))
        return false;
    }
    if (filters.status !== "all") {
      if (inc.status !== filters.status) return false;
    }
    return true;
  });
}

// ── Store ─────────────────────────────────────────────
export const useDashboardStore = create<DashboardStore>((set) => ({
  allIncidents: [],
  filteredIncidents: [],
  filters: { ...DEFAULT_FILTERS },
  searchQuery: "",

  setIncidents: (incidents) =>
    set((state) => ({
      allIncidents: incidents,
      filteredIncidents: applyFilters(incidents, state.filters),
    })),

  setDateRange: (from, to) =>
    set((state) => {
      const nextFilters = { ...state.filters, dateFrom: from, dateTo: to };
      return {
        filters: nextFilters,
        filteredIncidents: applyFilters(state.allIncidents, nextFilters),
      };
    }),

  setCategories: (categories) =>
    set((state) => {
      const nextFilters = { ...state.filters, categories };
      return {
        filters: nextFilters,
        filteredIncidents: applyFilters(state.allIncidents, nextFilters),
      };
    }),

  setPriorities: (priorities) =>
    set((state) => {
      const nextFilters = { ...state.filters, priorities };
      return {
        filters: nextFilters,
        filteredIncidents: applyFilters(state.allIncidents, nextFilters),
      };
    }),

  setStatus: (status) =>
    set((state) => {
      const nextFilters = { ...state.filters, status };
      return {
        filters: nextFilters,
        filteredIncidents: applyFilters(state.allIncidents, nextFilters),
      };
    }),

  setAssignees: (assignees) =>
    set((state) => {
      const nextFilters = { ...state.filters, assignees };
      return {
        filters: nextFilters,
        filteredIncidents: applyFilters(state.allIncidents, nextFilters),
      };
    }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  resetFilters: () =>
    set((state) => ({
      filters: { ...DEFAULT_FILTERS },
      filteredIncidents: applyFilters(state.allIncidents, DEFAULT_FILTERS),
    })),
}));
