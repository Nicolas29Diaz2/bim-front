"use client";

import { DatePicker } from "@/common/components/ui/DatePicker";
import styles from "./index.module.scss";

interface DateFilterProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
}

export function IncidentDateFilter({
  value,
  onChange,
}: Readonly<DateFilterProps>) {
  return (
    <div className={styles.wrapper}>
      <DatePicker
        value={value}
        onChange={onChange}
        placeholder="Filter by date"
        className={styles.input}
      />
    </div>
  );
}
