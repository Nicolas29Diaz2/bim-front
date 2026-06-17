"use client";

import { memo } from "react";
import { Search } from "lucide-react";
import { useSearchFilteredIncidents } from "../../hooks";
import { useDashboardStore } from "../../store/useDashboardStore";
import { cn } from "@/common/utils/cn";
import type { Incident } from "@/modules/incidents/types/incidents";
import styles from "./IncidentsDatatable.module.scss";

const PRIORITY_MAP: Record<string, { label: string; colorClass: string }> = {
  critical: { label: "Critical", colorClass: styles.pillCritical },
  high: { label: "High", colorClass: styles.pillHigh },
  medium: { label: "Medium", colorClass: styles.pillMedium },
  low: { label: "Low", colorClass: styles.pillLow },
};

const STATUS_MAP: Record<string, { label: string; colorClass: string }> = {
  open: { label: "Open", colorClass: styles.statusOpen },
  closed: { label: "Closed", colorClass: styles.statusClosed },
  on_pause: { label: "Paused", colorClass: styles.statusPaused },
};

function AssigneeAvatars({ assignees }: { assignees: Incident["assignees"] }) {
  const shown = assignees.slice(0, 3);
  const extra = assignees.length - shown.length;

  return (
    <div className={styles.avatars}>
      {shown.map((a, i) => (
        <img
          key={a.id}
          src={a.avatarUrl}
          alt={a.name}
          className={styles.avatar}
          style={{ zIndex: 3 - i }}
          title={a.name}
        />
      ))}
      {extra > 0 && <span className={styles.avatarMore}>+{extra}</span>}
    </div>
  );
}

const IncidentsDatatable = memo(function IncidentsDatatable() {
  const rows = useSearchFilteredIncidents();
  const searchQuery = useDashboardStore((s) => s.searchQuery);
  const setSearchQuery = useDashboardStore((s) => s.setSearchQuery);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Incidents Detail</h3>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>ID</th>
              <th className={styles.th}>Title</th>
              <th className={styles.th}>Category</th>
              <th className={styles.th}>Priority</th>
              <th className={styles.th}>Assignees</th>
              <th className={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  No incidents match your filters.
                </td>
              </tr>
            ) : (
              rows.map((inc) => {
                const p = PRIORITY_MAP[inc.priority] ?? PRIORITY_MAP.medium;
                const s = STATUS_MAP[inc.status] ?? STATUS_MAP.open;
                return (
                  <tr key={inc.id} className={styles.row}>
                    <td className={styles.tdId}>#{inc.sequenceId}</td>
                    <td className={styles.tdTitle}>
                      <span className={styles.titleText}>{inc.title}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.categoryTag}>
                        {inc.type.name}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={cn(styles.pill, p.colorClass)}>
                        {p.label}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <AssigneeAvatars assignees={inc.assignees} />
                    </td>
                    <td className={styles.td}>
                      <span className={cn(styles.statusBadge, s.colorClass)}>
                        {s.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <span className={styles.count}>
          {rows.length} incident{rows.length !== 1 ? "s" : ""} found
        </span>
      </div>
    </div>
  );
});

export { IncidentsDatatable };
