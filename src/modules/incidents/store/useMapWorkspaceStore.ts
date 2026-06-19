import { create } from "zustand";
import type { Incident } from "../types/incidents";

export type ViewMode = "markers" | "heatmap";

interface MapWorkspaceState {
  viewMode: ViewMode;
  is3D: boolean;
  selectedIncidentId: string | null;
  filteredIncidents: Incident[];

  setViewMode: (mode: ViewMode) => void;
  toggle3D: () => void;
  setSelectedIncidentId: (id: string | null) => void;
  setFilteredIncidents: (incidents: Incident[]) => void;
  nextIncident: () => void;
  prevIncident: () => void;
}

export const useMapWorkspaceStore = create<MapWorkspaceState>((set, get) => ({
  viewMode: "markers",
  is3D: false,
  selectedIncidentId: null,
  filteredIncidents: [],

  setViewMode: (viewMode) => set({ viewMode }),
  toggle3D: () => set((s) => ({ is3D: !s.is3D })),
  setSelectedIncidentId: (selectedIncidentId) => set({ selectedIncidentId }),
  setFilteredIncidents: (filteredIncidents) => set({ filteredIncidents }),

  nextIncident: () => {
    const { filteredIncidents, selectedIncidentId } = get();
    if (filteredIncidents.length === 0) return;

    if (!selectedIncidentId) {
      set({ selectedIncidentId: filteredIncidents[0].id });
      return;
    }

    const idx = filteredIncidents.findIndex(
      (inc) => inc.id === selectedIncidentId,
    );
    const next =
      idx === -1 || idx >= filteredIncidents.length - 1 ? 0 : idx + 1;
    set({ selectedIncidentId: filteredIncidents[next].id });
  },

  prevIncident: () => {
    const { filteredIncidents, selectedIncidentId } = get();
    if (filteredIncidents.length === 0) return;

    if (!selectedIncidentId) {
      set({
        selectedIncidentId: filteredIncidents.at(-1)?.id ?? null,
      });
      return;
    }

    const idx = filteredIncidents.findIndex(
      (inc) => inc.id === selectedIncidentId,
    );
    const prev = idx <= 0 ? filteredIncidents.length - 1 : idx - 1;
    set({ selectedIncidentId: filteredIncidents[prev].id });
  },
}));

// ── Derived selectors (recompute on every state change) ──

export function selectTotal(state: MapWorkspaceState): number {
  return state.filteredIncidents.length;
}

export function selectCurrentIndex(state: MapWorkspaceState): number {
  if (!state.selectedIncidentId) return -1;
  return state.filteredIncidents.findIndex(
    (inc) => inc.id === state.selectedIncidentId,
  );
}

export function selectSelectedIncident(
  state: MapWorkspaceState,
): Incident | null {
  if (!state.selectedIncidentId) return null;
  return (
    state.filteredIncidents.find(
      (inc) => inc.id === state.selectedIncidentId,
    ) ?? null
  );
}
