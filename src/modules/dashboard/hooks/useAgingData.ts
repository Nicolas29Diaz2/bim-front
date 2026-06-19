"use client";

import { useMemo } from "react";
import { useDashboardStore } from "../store/useDashboardStore";
import type { AgingBucket } from "../types/dashboard";
import type { Incident } from "@/modules/incidents/types/incidents";
import { differenceInDays, parseISO } from "date-fns";

const BUCKETS: Array<{ label: string; min: number; max: number | null }> = [
  { label: "0-7 days", min: 0, max: 7 },
  { label: "8-15 days", min: 8, max: 15 },
  { label: "16-30 days", min: 16, max: 30 },
  { label: "30+ days", min: 31, max: null },
];

function computeAgingData(incidents: Incident[]): AgingBucket[] {
  const today = new Date();
  const openIncidents = incidents.filter((i) => i.status !== "closed");

  const counts = BUCKETS.map(() => 0);

  for (const inc of openIncidents) {
    const daysOpen = differenceInDays(today, parseISO(inc.createdAt));

    for (let i = 0; i < BUCKETS.length; i++) {
      const bucket = BUCKETS[i];
      if (
        daysOpen >= bucket.min &&
        (bucket.max === null || daysOpen <= bucket.max)
      ) {
        counts[i]++;
        break;
      }
    }
  }

  return BUCKETS.map((bucket, i) => ({
    bucket: bucket.label,
    count: counts[i],
    sortKey: bucket.min,
  }));
}

export function useAgingData(): AgingBucket[] {
  const filteredIncidents = useDashboardStore((s) => s.filteredIncidents);
  return useMemo(
    () => computeAgingData(filteredIncidents),
    [filteredIncidents],
  );
}
