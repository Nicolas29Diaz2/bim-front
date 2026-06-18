"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTrendData } from "../../hooks";
import type { TrendDataPoint } from "../../types/dashboard";
import styles from "./TrendAreaChart.module.scss";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: TrendDataPoint }>;
  label?: string;
  t?: (key: string) => string;
}

function CustomTooltip({
  active,
  payload,
  label,
  t = (key: string) => key,
}: Readonly<CustomTooltipProps>) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipDate}>{label}</span>
      <div className={styles.tooltipRow}>
        <span className={styles.tooltipDot} />
        <span className={styles.tooltipLabel}>
          {t("dashboard.charts.cumulative")}
        </span>
        <span className={styles.tooltipValue}>
          {payload[0]?.payload?.cumulative}
        </span>
      </div>
      {payload[0]?.payload?.count !== undefined && (
        <div className={styles.tooltipRow}>
          <span className={styles.tooltipDotSecondary} />
          <span className={styles.tooltipLabel}>
            {t("dashboard.charts.daily")}
          </span>
          <span className={styles.tooltipValue}>
            {payload[0].payload.count}
          </span>
        </div>
      )}
    </div>
  );
}

const TrendAreaChart = memo(function TrendAreaChart() {
  const t = useTranslations();
  const data = useTrendData();

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t("dashboard.charts.incidentTrend")}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
        >
          <defs>
            <linearGradient id="gradientCumulative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--color-border)" }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip t={t} />} />
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill="url(#gradientCumulative)"
            dot={false}
            activeDot={{
              r: 5,
              fill: "#6366f1",
              stroke: "#ffffff",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

export { TrendAreaChart };
