"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useCategoryBarData } from "../../hooks";
import styles from "./CategoryBarChart.module.scss";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: Readonly<CustomTooltipProps>) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipLabel}>{label}</span>
      {payload.map((item) => (
        <div key={item.name} className={styles.tooltipRow}>
          <span
            className={styles.tooltipDot}
            style={{ backgroundColor: item.color }}
          />
          <span className={styles.tooltipName}>{item.name}</span>
          <span className={styles.tooltipVal}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

const CategoryBarChart = memo(function CategoryBarChart() {
  const t = useTranslations();
  const data = useCategoryBarData();

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        {t("dashboard.charts.incidentsByCategory")}
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            vertical={false}
          />
          <XAxis
            dataKey="category"
            tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--color-border)" }}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => (
              <span className={styles.legendLabel}>{value}</span>
            )}
          />
          <Bar
            dataKey="critical"
            stackId="a"
            fill="var(--color-critical, #dc2626)"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="high"
            stackId="a"
            fill="var(--color-high, #f97316)"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="medium"
            stackId="a"
            fill="var(--color-medium, #eab308)"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="low"
            stackId="a"
            fill="var(--color-low, #22c55e)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

export { CategoryBarChart };
