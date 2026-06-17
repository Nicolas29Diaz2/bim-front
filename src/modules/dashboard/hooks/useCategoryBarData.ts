"use client";

import { useMemo } from "react";
import { useDashboardStore } from "../store/useDashboardStore";
import type { CategoryBarDataPoint } from "../types/dashboard";
import type { Incident } from "@/modules/incidents/types/incidents";

function computeCategoryBarData(incidents: Incident[]): CategoryBarDataPoint[] {
  const categoryMap = new Map<
    string,
    { low: number; medium: number; high: number; critical: number }
  >();

  for (const inc of incidents) {
    const cat = inc.type.name;
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, { low: 0, medium: 0, high: 0, critical: 0 });
    }
    const bucket = categoryMap.get(cat)!;
    const p = inc.priority as "low" | "medium" | "high" | "critical";
    if (p in bucket) {
      bucket[p]++;
    }
  }

  return Array.from(categoryMap.entries()).map(([category, counts]) => ({
    category,
    ...counts,
  }));
}

export function useCategoryBarData(): CategoryBarDataPoint[] {
  const filteredIncidents = useDashboardStore((s) => s.filteredIncidents);
  return useMemo(
    () => computeCategoryBarData(filteredIncidents),
    [filteredIncidents],
  );
}
