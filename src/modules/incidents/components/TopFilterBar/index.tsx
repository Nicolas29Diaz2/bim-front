"use client";

import { useTranslations } from "next-intl";
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
  const t = useTranslations();
  return (
    <div className={styles.bar}>
      <div className={styles.filterIcon}>
        <Filter size={16} strokeWidth={2} />
      </div>

      <div className={styles.separator} />

      <DatePicker value={value} onChange={onChange} />

      <div className={styles.separator} />

      <div className={styles.timelineSection}>
        <span className={styles.timelineLabel}>
          {t("incidents.filterBar.last5Visits")}
        </span>
        <TimelineCircles />
      </div>

      <div className={styles.separator} />

      <div className={styles.btnGroup}>
        <Button variant="secondary" size="sm" disabled>
          {t("incidents.filterBar.compare")}
        </Button>
        <Button variant="secondary" size="sm" disabled>
          {t("incidents.filterBar.compareBim")}
        </Button>
      </div>
    </div>
  );
}
