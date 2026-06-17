"use client";

import { useMemo } from "react";
import { useDashboardStore } from "../store/useDashboardStore";
import type { Incident } from "@/modules/incidents/types/incidents";

export function useSearchFilteredIncidents(): Incident[] {
  const filteredIncidents = useDashboardStore((s) => s.filteredIncidents);
  const searchQuery = useDashboardStore((s) => s.searchQuery);

  return useMemo(() => {
    if (!searchQuery.trim()) return filteredIncidents;
    const q = searchQuery.toLowerCase();
    return filteredIncidents.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q),
    );
  }, [filteredIncidents, searchQuery]);
}
