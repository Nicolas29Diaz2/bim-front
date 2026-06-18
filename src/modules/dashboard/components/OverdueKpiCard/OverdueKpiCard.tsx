"use client";

import { memo } from "react";
import { Timer } from "lucide-react";
import { useOverdueKpi } from "../../hooks";
import styles from "./OverdueKpiCard.module.scss";

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

const OverdueKpiCard = memo(function OverdueKpiCard() {
  const { count, totalOpen, ratio } = useOverdueKpi();

  return (
    <div className={styles.card}>
      <div className={styles.iconWrap}>
        <Timer size={20} />
      </div>
      <div className={styles.content}>
        <span className={styles.label}>Overdue Incidents</span>
        <span className={styles.value}>{formatNumber(count)}</span>
        <span className={styles.detail}>
          of {formatNumber(totalOpen)} open ({ratio.toFixed(1)}%)
        </span>
      </div>
    </div>
  );
});

export { OverdueKpiCard };
