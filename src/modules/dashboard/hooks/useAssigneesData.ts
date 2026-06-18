"use client";

import { useMemo } from "react";
import { useDashboardStore } from "../store/useDashboardStore";
import type { AssigneeRow } from "../types/dashboard";
import type { Incident } from "@/modules/incidents/types/incidents";
import { differenceInDays, parseISO } from "date-fns";

function computeAssigneesData(incidents: Incident[]): AssigneeRow[] {
  const assigneeMap = new Map<
    string,
    {
      name: string;
      avatarUrl: string;
      totalAssigned: number;
      openCount: number;
      closedCount: number;
      totalResolutionDays: number;
      resolvedCount: number;
    }
  >();

  for (const inc of incidents) {
    for (const assignee of inc.assignees) {
      const existing = assigneeMap.get(assignee.id);

      if (!existing) {
        assigneeMap.set(assignee.id, {
          name: assignee.name,
          avatarUrl: assignee.avatarUrl,
          totalAssigned: 1,
          openCount: inc.status === "open" ? 1 : 0,
          closedCount: inc.status === "closed" ? 1 : 0,
          totalResolutionDays:
            inc.status === "closed" && inc.closingDate
              ? Math.max(
                  0,
                  differenceInDays(
                    parseISO(inc.closingDate),
                    parseISO(inc.createdAt),
                  ),
                )
              : 0,
          resolvedCount: inc.status === "closed" && inc.closingDate ? 1 : 0,
        });
      } else {
        existing.totalAssigned++;
        if (inc.status === "open") existing.openCount++;
        if (inc.status === "closed") existing.closedCount++;
        if (inc.status === "closed" && inc.closingDate) {
          existing.totalResolutionDays += Math.max(
            0,
            differenceInDays(
              parseISO(inc.closingDate),
              parseISO(inc.createdAt),
            ),
          );
          existing.resolvedCount++;
        }
      }
    }
  }

  return Array.from(assigneeMap.entries())
    .map(([id, data]) => ({
      id,
      name: data.name,
      avatarUrl: data.avatarUrl,
      totalAssigned: data.totalAssigned,
      openCount: data.openCount,
      closedCount: data.closedCount,
      avgResolutionDays:
        data.resolvedCount > 0
          ? data.totalResolutionDays / data.resolvedCount
          : null,
    }))
    .sort((a, b) => b.totalAssigned - a.totalAssigned);
}

export function useAssigneesData(): AssigneeRow[] {
  const filteredIncidents = useDashboardStore((s) => s.filteredIncidents);
  return useMemo(
    () => computeAssigneesData(filteredIncidents),
    [filteredIncidents],
  );
}
