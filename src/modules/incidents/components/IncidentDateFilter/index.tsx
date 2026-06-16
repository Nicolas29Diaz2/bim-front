"use client";

import { Input } from "@/common/components/ui/Input";
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
      <Input
        type="date"
        value={value ? value.toISOString().slice(0, 10) : ""}
        onChange={(e) => {
          if (e.target.value) {
            onChange(new Date(e.target.value));
          } else {
            onChange(null);
          }
        }}
        placeholder="Filter by date"
        className={styles.input}
      />
    </div>
  );
}
