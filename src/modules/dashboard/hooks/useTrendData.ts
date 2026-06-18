"use client";

import { useMemo } from "react";
import { useDashboardStore } from "../store/useDashboardStore";
import type { TrendDataPoint } from "../types/dashboard";
import type { Incident } from "@/modules/incidents/types/incidents";
import {
  eachDayOfInterval,
  format,
  parseISO,
  startOfDay,
  subDays,
} from "date-fns";

function computeTrendData(incidents: Incident[]): TrendDataPoint[] {
  if (incidents.length === 0) return [];

  const dates = incidents.map((i) => parseISO(i.createdAt));
  const earliest = dates.reduce((min, d) => (d < min ? d : min), dates[0]);
  const latest = dates.reduce((max, d) => (d > max ? d : max), dates[0]);

  const days = eachDayOfInterval({
    start: subDays(startOfDay(earliest), 1),
    end: startOfDay(latest),
  });

  const dateCounts = new Map<string, number>();
  for (const inc of incidents) {
    const key = format(parseISO(inc.createdAt), "yyyy-MM-dd");
    dateCounts.set(key, (dateCounts.get(key) ?? 0) + 1);
  }

  let cumulative = 0;
  return days.map((day) => {
    const key = format(day, "yyyy-MM-dd");
    const count = dateCounts.get(key) ?? 0;
    cumulative += count;
    return {
      date: format(day, "MMM dd"),
      count,
      cumulative,
    };
  });
}

export function useTrendData(): TrendDataPoint[] {
  const filteredIncidents = useDashboardStore((s) => s.filteredIncidents);
  return useMemo(
    () => computeTrendData(filteredIncidents),
    [filteredIncidents],
  );
}
