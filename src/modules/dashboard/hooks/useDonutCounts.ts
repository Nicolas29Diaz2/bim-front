"use client";

import { useMemo } from "react";
import { useDashboardStore } from "../store/useDashboardStore";
import type { Incident } from "@/modules/incidents/types/incidents";

interface DonutCounts {
  open: number;
  closed: number;
  other: number;
}

function computeDonutCounts(incidents: Incident[]): DonutCounts {
  const open = incidents.filter((i) => i.status === "open").length;
  const closed = incidents.filter((i) => i.status === "closed").length;
  return { open, closed, other: incidents.length - open - closed };
}

export function useDonutCounts(): DonutCounts {
  const filteredIncidents = useDashboardStore((s) => s.filteredIncidents);
  return useMemo(
    () => computeDonutCounts(filteredIncidents),
    [filteredIncidents],
  );
}
