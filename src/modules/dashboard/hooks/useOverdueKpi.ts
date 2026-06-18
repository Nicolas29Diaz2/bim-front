"use client";

import { useMemo } from "react";
import { useDashboardStore } from "../store/useDashboardStore";
import type { OverdueKpiData } from "../types/dashboard";
import type { Incident } from "@/modules/incidents/types/incidents";
import { isBefore, parseISO, startOfDay } from "date-fns";

function computeOverdueKpi(incidents: Incident[]): OverdueKpiData {
  const today = startOfDay(new Date());
  const openIncidents = incidents.filter((i) => i.status !== "closed");

  const count = openIncidents.filter((i) => {
    if (!i.dueDate) return false;
    return isBefore(parseISO(i.dueDate), today);
  }).length;

  const totalOpen = openIncidents.length;
  const ratio = totalOpen > 0 ? (count / totalOpen) * 100 : 0;

  return { count, totalOpen, ratio };
}

export function useOverdueKpi(): OverdueKpiData {
  const filteredIncidents = useDashboardStore((s) => s.filteredIncidents);
  return useMemo(
    () => computeOverdueKpi(filteredIncidents),
    [filteredIncidents],
  );
}
