"use client";

import { memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useAgingData } from "../../hooks";
import type { AgingBucket } from "../../types/dashboard";
import styles from "./AgingAnalysisChart.module.scss";

const BUCKET_COLORS: Record<string, string> = {
  "0-7 days": "#22c55e",
  "8-15 days": "#eab308",
  "16-30 days": "#f97316",
  "30+ days": "#dc2626",
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: AgingBucket;
  }>;
}

function CustomTooltip({ active, payload }: Readonly<CustomTooltipProps>) {
  if (!active || !payload || payload.length === 0) return null;
  const data = payload[0].payload;

  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipLabel}>{data.bucket}</span>
      <span className={styles.tooltipValue}>
        {data.count} incident{data.count !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

interface CustomBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: AgingBucket;
}

function CustomBar(props: Readonly<CustomBarProps>) {
  const { x = 0, y = 0, width = 0, height = 0, payload } = props;
  if (!payload) return null;

  const fill = BUCKET_COLORS[payload.bucket] ?? "#6b7280";
  const radius = 4;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        rx={radius}
        ry={radius}
      />
      {width > 40 && (
        <text
          x={x + width - 8}
          y={y + height / 2}
          textAnchor="end"
          dominantBaseline="central"
          className={styles.barLabel}
        >
          {payload.count}
        </text>
      )}
    </g>
  );
}

const AgingAnalysisChart = memo(function AgingAnalysisChart() {
  const data = useAgingData();

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Aging Analysis (Open Incidents)</h3>
      <ResponsiveContainer width="100%" height={315}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 40, bottom: 4, left: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--color-border)" }}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="bucket"
            tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
            tickLine={false}
            axisLine={false}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f3f4f6" }} />
          <Bar
            dataKey="count"
            shape={<CustomBar />}
            barSize={28}
            isAnimationActive={true}
            animationDuration={600}
          >
            {data.map((entry) => (
              <Cell
                key={entry.bucket}
                fill={BUCKET_COLORS[entry.bucket] ?? "#6b7280"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

export { AgingAnalysisChart };
