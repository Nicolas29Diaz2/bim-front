"use client";

import { memo, useCallback, useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { MultiSelect } from "@/common/components/ui/MultiSelect";
import type { MultiSelectOption } from "@/common/components/ui/MultiSelect";
import { FormField } from "@/common/components/ui/FormField";
import { DatePicker } from "@/common/components/ui/DatePicker";
import { useDashboardStore } from "../../store/useDashboardStore";
import type { PriorityFilter, StatusFilter } from "../../types/dashboard";
import { INCIDENTS_MOCK } from "@/modules/incidents/constants/incidentsMock";
import { toISOString, fromISOString } from "@/common/utils/date";
import styles from "./FilterBar.module.scss";
import { Button } from "@/common/components/ui/Button";

const PRIORITY_OPTIONS: MultiSelectOption<PriorityFilter>[] = [
  { value: "critical", label: "Critical", color: "#dc2626" },
  { value: "high", label: "High", color: "#f97316" },
  { value: "medium", label: "Medium", color: "#eab308" },
  { value: "low", label: "Low", color: "#22c55e" },
];

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
];

const FilterBar = memo(function FilterBar() {
  const filters = useDashboardStore((s) => s.filters);
  const setDateRange = useDashboardStore((s) => s.setDateRange);
  const setCategories = useDashboardStore((s) => s.setCategories);
  const setPriorities = useDashboardStore((s) => s.setPriorities);
  const setStatus = useDashboardStore((s) => s.setStatus);
  const resetFilters = useDashboardStore((s) => s.resetFilters);

  const categoryOptions = useMemo(() => {
    const keys = new Map<string, string>();
    for (const inc of INCIDENTS_MOCK) {
      if (!keys.has(inc.type.key)) {
        keys.set(inc.type.key, inc.type.name);
      }
    }
    return Array.from(keys.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, []);

  const hasActiveFilters =
    filters.dateFrom !== null ||
    filters.dateTo !== null ||
    filters.categories.length > 0 ||
    filters.priorities.length > 0 ||
    filters.status !== "all";

  const handleFromChange = useCallback(
    (date: Date | null) => {
      setDateRange(toISOString(date), filters.dateTo);
    },
    [setDateRange, filters.dateTo],
  );

  const handleToChange = useCallback(
    (date: Date | null) => {
      setDateRange(filters.dateFrom, toISOString(date));
    },
    [setDateRange, filters.dateFrom],
  );

  return (
    <div className={styles.bar}>
      <FormField label="From" className={styles.field}>
        <DatePicker
          value={fromISOString(filters.dateFrom)}
          onChange={handleFromChange}
          clearable={false}
        />
      </FormField>

      <FormField label="To" className={styles.field}>
        <DatePicker
          value={fromISOString(filters.dateTo)}
          onChange={handleToChange}
          clearable={false}
        />
      </FormField>

      <FormField label="Category" className={styles.field}>
        <MultiSelect
          options={categoryOptions}
          value={filters.categories}
          onChange={setCategories}
          placeholder="All categories"
          searchable
        />
      </FormField>

      <FormField label="Priority" className={styles.field}>
        <MultiSelect
          options={PRIORITY_OPTIONS}
          value={filters.priorities}
          onChange={setPriorities}
          placeholder="All priorities"
        />
      </FormField>

      <FormField label="Status" className={styles.field}>
        <div className={styles.toggleGroup}>
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.toggleBtn} ${filters.status === opt.value ? styles.toggleActive : ""}`}
              onClick={() => setStatus(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FormField>

      <Button
        variant="destructive"
        className={styles.resetBtn}
        onClick={resetFilters}
        disabled={!hasActiveFilters}
      >
        <RotateCcw size={14} />
        Reset
      </Button>
    </div>
  );
});

export { FilterBar };
