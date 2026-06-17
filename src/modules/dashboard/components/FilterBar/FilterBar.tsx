"use client";

import { memo, useCallback, useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { MultiSelect } from "@/common/components/ui/MultiSelect";
import type { MultiSelectOption } from "@/common/components/ui/MultiSelect";
import { useDashboardStore } from "../../store/useDashboardStore";
import type { PriorityFilter, StatusFilter } from "../../types/dashboard";
import { INCIDENTS_MOCK } from "@/modules/incidents/constants/incidentsMock";
import styles from "./FilterBar.module.scss";

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
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDateRange(e.target.value || null, filters.dateTo);
    },
    [setDateRange, filters.dateTo],
  );

  const handleToChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDateRange(filters.dateFrom, e.target.value || null);
    },
    [setDateRange, filters.dateFrom],
  );

  return (
    <div className={styles.bar}>
      <div className={styles.group}>
        <label className={styles.fieldLabel}>From</label>
        <input
          type="date"
          className={styles.dateInput}
          value={filters.dateFrom ?? ""}
          onChange={handleFromChange}
        />
      </div>

      <div className={styles.group}>
        <label className={styles.fieldLabel}>To</label>
        <input
          type="date"
          className={styles.dateInput}
          value={filters.dateTo ?? ""}
          onChange={handleToChange}
        />
      </div>

      <div className={styles.groupSelect}>
        <label className={styles.fieldLabel}>Category</label>
        <MultiSelect
          options={categoryOptions}
          value={filters.categories}
          onChange={setCategories}
          placeholder="All categories"
          searchable
        />
      </div>

      <div className={styles.groupSelect}>
        <label className={styles.fieldLabel}>Priority</label>
        <MultiSelect
          options={PRIORITY_OPTIONS}
          value={filters.priorities}
          onChange={setPriorities}
          placeholder="All priorities"
        />
      </div>

      <div className={styles.group}>
        <label className={styles.fieldLabel}>Status</label>
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
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          className={styles.resetBtn}
          onClick={resetFilters}
        >
          <RotateCcw size={14} />
          Reset
        </button>
      )}
    </div>
  );
});

export { FilterBar };
