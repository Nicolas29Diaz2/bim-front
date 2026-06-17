"use client";

import { Filter } from "lucide-react";
import { Button } from "@/common/components/ui/Button";
import { DatePicker } from "@/common/components/ui/DatePicker";
import styles from "./index.module.scss";

interface TopFilterBarProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
}

function TimelineCircles() {
  return (
    <div className={styles.timeline}>
      <span className={styles.circle} />
      <span className={styles.line} />
      <span className={styles.circle} />
      <span className={styles.line} />
      <span className={styles.circle} />
      <span className={styles.line} />
      <span className={styles.circle} />
      <span className={styles.line} />
      <span className={styles.circle} />
      <span className={styles.line} />
      <span className={styles.circleAdd}>
        <span className={styles.circleAddInner} />
      </span>
    </div>
  );
}

export function TopFilterBar({ value, onChange }: Readonly<TopFilterBarProps>) {
  return (
    <div className={styles.bar}>
      <div className={styles.filterIcon}>
        <Filter size={16} strokeWidth={2} />
      </div>

      <div className={styles.separator} />

      <DatePicker value={value} onChange={onChange} />

      <div className={styles.separator} />

      <div className={styles.timelineSection}>
        <span className={styles.timelineLabel}>Últimas 5 visitas</span>
        <TimelineCircles />
      </div>

      <div className={styles.separator} />

      <div className={styles.btnGroup}>
        <Button variant="secondary" size="sm" disabled>
          Comparar
        </Button>
        <Button variant="secondary" size="sm" disabled>
          Comparar BIM
        </Button>
      </div>
    </div>
  );
}
