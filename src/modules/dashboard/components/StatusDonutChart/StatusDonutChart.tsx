"use client";

import { memo, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useDonutCounts, useKpiData } from "../../hooks";
import type { DonutDataPoint } from "../../types/dashboard";
import styles from "./StatusDonutChart.module.scss";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: DonutDataPoint }>;
}

function CustomTooltip({ active, payload }: Readonly<CustomTooltipProps>) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0];
  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipLabel}>{item.name}</span>
      <span className={styles.tooltipValue}>{item.value}</span>
    </div>
  );
}

const StatusDonutChart = memo(function StatusDonutChart() {
  const counts = useDonutCounts();
  const kpi = useKpiData();

  const data = useMemo(() => {
    const chartData: DonutDataPoint[] = [
      { name: "Open", value: counts.open, fill: "var(--color-warning)" },
      { name: "Closed", value: counts.closed, fill: "var(--color-success)" },
    ];

    if (counts.other > 0) {
      chartData.push({
        name: "Other",
        value: counts.other,
        fill: "var(--color-neutral)",
      });
    }

    return chartData;
  }, [counts.open, counts.closed, counts.other]);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Status Distribution</h3>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={105}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => (
                <span className={styles.legendLabel}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.centerLabel}>
          <span className={styles.centerValue}>
            {kpi.completionRate.toFixed(0)}%
          </span>
          <span className={styles.centerSub}>resolved</span>
        </div>
      </div>
    </div>
  );
});

export { StatusDonutChart };
