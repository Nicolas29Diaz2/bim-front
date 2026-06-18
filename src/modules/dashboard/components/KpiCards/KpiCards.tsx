"use client";

import { memo } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  AlertOctagon,
  Timer,
} from "lucide-react";
import { useKpiData, useOverdueKpi } from "../../hooks";
import styles from "./KpiCards.module.scss";

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function formatDays(days: number | null): string {
  if (days === null) return "N/A";
  if (days < 1) return "<1 day";
  return `${Math.round(days)}d`;
}

const KpiCards = memo(function KpiCards() {
  const kpi = useKpiData();
  const overdue = useOverdueKpi();

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <AlertTriangle size={20} />
        </div>
        <div className={styles.content}>
          <span className={styles.label}>Total Incidents</span>
          <span className={styles.value}>
            {formatNumber(kpi.totalIncidents)}
          </span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.iconWrapOpen}>
          <Clock size={20} />
        </div>
        <div className={styles.content}>
          <span className={styles.label}>Open / Closed</span>
          <span className={styles.value}>
            {formatNumber(kpi.openCount)}
            <span className={styles.separator}>/</span>
            {formatNumber(kpi.closedCount)}
          </span>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${kpi.completionRate}%` }}
            />
          </div>
          <span className={styles.badge}>
            {kpi.completionRate.toFixed(1)}% resolved
          </span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.iconWrapCritical}>
          <AlertOctagon size={20} />
        </div>
        <div className={styles.content}>
          <span className={styles.label}>Critical / High</span>
          <span className={styles.valueCritical}>
            {formatNumber(kpi.criticalHighCount)}
          </span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.iconWrapSuccess}>
          <CheckCircle2 size={20} />
        </div>
        <div className={styles.content}>
          <span className={styles.label}>Avg. Resolution</span>
          <span className={styles.value}>
            {formatDays(kpi.avgResolutionDays)}
          </span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.iconWrapOverdue}>
          <Timer size={20} />
        </div>
        <div className={styles.content}>
          <span className={styles.label}>Overdue</span>
          <span className={styles.valueOverdue}>
            {formatNumber(overdue.count)}
          </span>
          <span className={styles.detail}>
            of {formatNumber(overdue.totalOpen)} open
          </span>
        </div>
      </div>
    </div>
  );
});

export { KpiCards };
