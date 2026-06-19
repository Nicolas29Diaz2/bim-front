"use client";

import { useTranslations } from "next-intl";
import { memo, useCallback, useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { MultiSelect } from "@/common/components/ui/MultiSelect";
import type { MultiSelectOption } from "@/common/components/ui/MultiSelect";
import { FormField } from "@/common/components/ui/FormField";
import { DatePicker } from "@/common/components/ui/DatePicker";
import { useDashboardStore } from "../../store/useDashboardStore";
import type { PriorityFilter, StatusFilter } from "../../types/dashboard";
import { INCIDENTS_MOCK } from "@/modules/incidents/constants/incidentsMock";
import { MOCK_USERS } from "@/common/constants/usersMock";
import { toISOString, fromISOString } from "@/common/utils/date";
import styles from "./FilterBar.module.scss";
import { Button } from "@/common/components/ui/Button";

interface FilterBarProps {
  isFieldEngineer?: boolean;
}

const FilterBar = memo(function FilterBar({
  isFieldEngineer = false,
}: Readonly<FilterBarProps>) {
  const t = useTranslations();
  const filters = useDashboardStore((s) => s.filters);
  const setDateRange = useDashboardStore((s) => s.setDateRange);
  const setCategories = useDashboardStore((s) => s.setCategories);
  const setPriorities = useDashboardStore((s) => s.setPriorities);
  const setStatus = useDashboardStore((s) => s.setStatus);
  const setAssignees = useDashboardStore((s) => s.setAssignees);
  const resetFilters = useDashboardStore((s) => s.resetFilters);

  const PRIORITY_OPTIONS: MultiSelectOption<PriorityFilter>[] = useMemo(
    () => [
      {
        value: "critical",
        label: t("incidents.creationModal.priorities.critical"),
        color: "#dc2626",
      },
      {
        value: "high",
        label: t("incidents.creationModal.priorities.high"),
        color: "#f97316",
      },
      {
        value: "medium",
        label: t("incidents.creationModal.priorities.medium"),
        color: "#eab308",
      },
      {
        value: "low",
        label: t("incidents.creationModal.priorities.low"),
        color: "#22c55e",
      },
    ],
    [t],
  );

  const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = useMemo(
    () => [
      { value: "all", label: t("dashboard.filterBar.all") },
      { value: "open", label: t("dashboard.filterBar.open") },
      { value: "closed", label: t("dashboard.filterBar.closed") },
    ],
    [t],
  );

  const categoryOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const inc of INCIDENTS_MOCK) {
      if (!seen.has(inc.type.key)) {
        seen.set(inc.type.key, inc.type.name);
      }
    }
    return Array.from(seen.entries()).map(([key, fallback]) => {
      try {
        return { value: key, label: t(`incidents.popup.categories.${key}`) };
      } catch {
        return { value: key, label: fallback };
      }
    });
  }, [t]);

  const assigneeOptions = useMemo<MultiSelectOption<string>[]>(() => {
    return MOCK_USERS.map((u) => ({
      value: u.id,
      label: u.name,
    }));
  }, []);

  const hasActiveFilters =
    filters.dateFrom !== null ||
    filters.dateTo !== null ||
    filters.categories.length > 0 ||
    filters.priorities.length > 0 ||
    filters.status !== "all" ||
    filters.assignees.length > 0;

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
      <FormField label={t("dashboard.filterBar.from")}>
        <DatePicker
          value={fromISOString(filters.dateFrom)}
          onChange={handleFromChange}
          clearable={false}
        />
      </FormField>

      <FormField label={t("dashboard.filterBar.to")}>
        <DatePicker
          value={fromISOString(filters.dateTo)}
          onChange={handleToChange}
          clearable={false}
        />
      </FormField>

      <FormField label={t("dashboard.filterBar.category")}>
        <MultiSelect
          options={categoryOptions}
          value={filters.categories}
          onChange={setCategories}
          placeholder={t("dashboard.filterBar.allCategories")}
          searchable
        />
      </FormField>

      {!isFieldEngineer && (
        <FormField label={t("dashboard.filterBar.assignees")}>
          <MultiSelect
            options={assigneeOptions}
            value={filters.assignees}
            onChange={setAssignees}
            placeholder={t("dashboard.filterBar.allAssignees")}
            searchable
          />
        </FormField>
      )}

      <FormField label={t("dashboard.filterBar.priority")}>
        <MultiSelect
          options={PRIORITY_OPTIONS}
          value={filters.priorities}
          onChange={setPriorities}
          placeholder={t("dashboard.filterBar.allPriorities")}
        />
      </FormField>

      <FormField label={t("dashboard.filterBar.status")}>
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
        {t("dashboard.filterBar.reset")}
      </Button>
    </div>
  );
});

export { FilterBar };
