"use client";

import { useMemo } from "react";
import { useDashboardStore } from "../store/useDashboardStore";
import type { KpiData } from "../types/dashboard";
import type { Incident } from "@/modules/incidents/types/incidents";
import { differenceInDays, parseISO } from "date-fns";

function computeKpiData(incidents: Incident[]): KpiData {
  const totalIncidents = incidents.length;
  const openCount = incidents.filter((i) => i.status === "open").length;
  const closedCount = incidents.filter((i) => i.status === "closed").length;
  const completionRate =
    totalIncidents > 0 ? (closedCount / totalIncidents) * 100 : 0;

  const criticalHighCount = incidents.filter(
    (i) => i.priority === "high" || i.priority === "critical",
  ).length;

  const resolvedWithDates = incidents.filter(
    (i) => i.status === "closed" && i.closingDate && i.createdAt,
  );
  const avgResolutionDays =
    resolvedWithDates.length > 0
      ? resolvedWithDates.reduce((sum, i) => {
          const days = differenceInDays(
            parseISO(i.closingDate!),
            parseISO(i.createdAt),
          );
          return sum + Math.max(0, days);
        }, 0) / resolvedWithDates.length
      : null;

  return {
    totalIncidents,
    openCount,
    closedCount,
    completionRate,
    criticalHighCount,
    avgResolutionDays,
  };
}

export function useKpiData(): KpiData {
  const filteredIncidents = useDashboardStore((s) => s.filteredIncidents);
  return useMemo(() => computeKpiData(filteredIncidents), [filteredIncidents]);
}
