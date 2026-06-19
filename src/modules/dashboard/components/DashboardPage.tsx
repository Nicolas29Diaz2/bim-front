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
import { AgingAnalysisChart } from "./AgingAnalysisChart";
import { TopAssigneesTable } from "./TopAssigneesTable";
import { IncidentsDatatable } from "./IncidentsDatatable";
import { useSession } from "next-auth/react";
import { Role } from "@/common/types/role";

interface DashboardPageProps {
  incidents: Incident[];
}

function DashboardPage({ incidents }: Readonly<DashboardPageProps>) {
  const setIncidents = useDashboardStore((s) => s.setIncidents);
  const { data: session } = useSession();
  const role = session?.user?.role ?? "";
  const isFieldEngineer = role === Role.FIELD_ENGINEER;

  useEffect(() => {
    setIncidents(incidents);
  }, [incidents, setIncidents]);

  return (
    <div className={styles.page}>
      <div className={styles.topRow}>
        <KpiCards />
      </div>

      <div className={styles.filtersRow}>
        <FilterBar isFieldEngineer={isFieldEngineer} />
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCell}>
          <StatusDonutChart />
        </div>
        <div className={styles.chartCellWide}>
          <CategoryBarChart />
        </div>
      </div>

      <div className={styles.analysisGrid}>
        <div className={styles.chartCell}>
          <AgingAnalysisChart />
        </div>
        {role !== Role.FIELD_ENGINEER && (
          <div className={styles.chartCell}>
            <TopAssigneesTable />
          </div>
        )}
      </div>

      <div className={styles.chartCellFull}>
        <TrendAreaChart />
      </div>

      {role !== Role.FIELD_ENGINEER && (
        <div className={styles.tableRow}>
          <IncidentsDatatable />
        </div>
      )}
    </div>
  );
}

export { DashboardPage };
