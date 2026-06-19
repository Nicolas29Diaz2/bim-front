"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
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

const KpiCards = memo(function KpiCards() {
  const t = useTranslations();
  const kpi = useKpiData();
  const overdue = useOverdueKpi();

  function formatDays(days: number | null): string {
    if (days === null) return t("dashboard.kpiCards.na");
    if (days < 1) return t("dashboard.kpiCards.lessThanDay");
    return `${Math.round(days)}d`;
  }

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <AlertTriangle size={20} />
        </div>
        <div className={styles.content}>
          <span className={styles.label}>
            {t("dashboard.kpiCards.totalIncidents")}
          </span>
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
          <span className={styles.label}>
            {t("dashboard.kpiCards.openClosed")}
          </span>
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
            {kpi.completionRate.toFixed(1)}% {t("dashboard.kpiCards.resolved")}
          </span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.iconWrapCritical}>
          <AlertOctagon size={20} />
        </div>
        <div className={styles.content}>
          <span className={styles.label}>
            {t("dashboard.kpiCards.criticalHigh")}
          </span>
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
          <span className={styles.label}>
            {t("dashboard.kpiCards.avgResolution")}
          </span>
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
          <span className={styles.label}>
            {t("dashboard.kpiCards.overdue")}
          </span>
          <span className={styles.valueOverdue}>
            {formatNumber(overdue.count)}
          </span>
          <span className={styles.detail}>
            {t("dashboard.kpiCards.ofOpen", {
              count: formatNumber(overdue.totalOpen),
            })}
          </span>
        </div>
      </div>
    </div>
  );
});

export { KpiCards };
