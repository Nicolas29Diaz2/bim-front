"use client";

import { useEffect } from "react";
import type { Incident } from "@/modules/incidents/types/incidents";
import styles from "./DashboardPage.module.scss";
import { useDashboardStore } from "../store/useDashboardStore";
import { KpiCards } from "./KpiCards";
import { FilterBar } from "./FilterBar";
import { StatusDonutChart } from "./StatusDonutChart";
import { CategoryBarChart } from "./CategoryBarChart";
import { TrendAreaChart } from "./TrendAreaChart";
import { IncidentsDatatable } from "./IncidentsDatatable";

interface DashboardPageProps {
  incidents: Incident[];
}

function DashboardPage({ incidents }: Readonly<DashboardPageProps>) {
  const setIncidents = useDashboardStore((s) => s.setIncidents);

  useEffect(() => {
    setIncidents(incidents);
  }, [incidents, setIncidents]);

  return (
    <div className={styles.page}>
      <div className={styles.topRow}>
        <KpiCards />
      </div>

      <div className={styles.filtersRow}>
        <FilterBar />
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCell}>
          <StatusDonutChart />
        </div>
        <div className={styles.chartCellWide}>
          <CategoryBarChart />
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCellFull}>
          <TrendAreaChart />
        </div>
      </div>

      <div className={styles.tableRow}>
        <IncidentsDatatable />
      </div>
    </div>
  );
}

export { DashboardPage };
