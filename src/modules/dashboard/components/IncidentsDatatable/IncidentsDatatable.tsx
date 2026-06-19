"use client";

import { useTranslations } from "next-intl";
import { memo, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useSearchFilteredIncidents } from "../../hooks";
import { useDashboardStore } from "../../store/useDashboardStore";
import { Table, type ColumnDef } from "@/common/components/ui/Table";
import { Pagination } from "@/common/components/ui/Pagination";
import { cn } from "@/common/utils/cn";
import type { Incident } from "@/modules/incidents/types/incidents";
import styles from "./IncidentsDatatable.module.scss";
import Image from "next/image";

const PAGE_SIZE = 10;

function AssigneeAvatars({ assignees }: { assignees: Incident["assignees"] }) {
  const shown = assignees.slice(0, 3);
  const extra = assignees.length - shown.length;

  return (
    <div className={styles.avatars}>
      {shown.map((a, i) => (
        <Image
          key={a.id}
          src={a.avatarUrl}
          alt={a.name}
          className={styles.avatar}
          style={{ zIndex: 3 - i }}
          title={a.name}
          width={40}
          height={40}
        />
      ))}
      {extra > 0 && <span className={styles.avatarMore}>+{extra}</span>}
    </div>
  );
}

const IncidentsDatatable = memo(function IncidentsDatatable() {
  const t = useTranslations();
  const rows = useSearchFilteredIncidents();
  const searchQuery = useDashboardStore((s) => s.searchQuery);
  const setSearchQuery = useDashboardStore((s) => s.setSearchQuery);

  const [currentPage, setCurrentPage] = useState(1);

  const PRIORITY_MAP: Record<string, { label: string; colorClass: string }> =
    useMemo(
      () => ({
        critical: {
          label: t("incidents.creationModal.priorities.critical"),
          colorClass: styles.pillCritical,
        },
        high: {
          label: t("incidents.creationModal.priorities.high"),
          colorClass: styles.pillHigh,
        },
        medium: {
          label: t("incidents.creationModal.priorities.medium"),
          colorClass: styles.pillMedium,
        },
        low: {
          label: t("incidents.creationModal.priorities.low"),
          colorClass: styles.pillLow,
        },
      }),
      [t],
    );

  const STATUS_MAP: Record<string, { label: string; colorClass: string }> =
    useMemo(
      () => ({
        open: {
          label: t("dashboard.datatable.columns.status"),
          colorClass: styles.statusOpen,
        },
        closed: {
          label: t("dashboard.charts.closed"),
          colorClass: styles.statusClosed,
        },
        on_pause: {
          label: t("dashboard.datatable.paused"),
          colorClass: styles.statusPaused,
        },
      }),
      [t],
    );

  const columns: ColumnDef<Incident>[] = useMemo(
    () => [
      {
        key: "sequenceId",
        header: t("dashboard.datatable.columns.id"),
        renderCell: (row) => (
          <span className={styles.cellId}>#{row.sequenceId}</span>
        ),
      },
      {
        key: "title",
        header: t("dashboard.datatable.columns.title"),
        renderCell: (row) => (
          <span className={styles.cellTitle}>{row.title}</span>
        ),
      },
      {
        key: "category",
        header: t("dashboard.datatable.columns.category"),
        renderCell: (row) => (
          <span className={styles.categoryTag}>{row.type.name}</span>
        ),
      },
      {
        key: "priority",
        header: t("dashboard.datatable.columns.priority"),
        renderCell: (row) => {
          const p = PRIORITY_MAP[row.priority] ?? PRIORITY_MAP.medium;
          return (
            <span className={cn(styles.pill, p.colorClass)}>{p.label}</span>
          );
        },
      },
      {
        key: "assignees",
        header: t("dashboard.datatable.columns.assignees"),
        renderCell: (row) => <AssigneeAvatars assignees={row.assignees} />,
      },
      {
        key: "status",
        header: t("dashboard.datatable.columns.status"),
        renderCell: (row) => {
          const s = STATUS_MAP[row.status] ?? STATUS_MAP.open;
          return (
            <span className={cn(styles.statusBadge, s.colorClass)}>
              {s.label}
            </span>
          );
        },
      },
    ],
    [t, PRIORITY_MAP, STATUS_MAP],
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const pageRows = useMemo(
    () => rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [rows, safePage],
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t("dashboard.datatable.title")}</h3>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder={t("dashboard.datatable.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={pageRows}
        rowKey={(row) => row.id}
        emptyMessage={t("dashboard.datatable.emptyMessage")}
        minBodyHeight={480}
      />

      {rows.length > 0 && (
        <div className={styles.paginationWrap}>
          <Pagination
            totalItems={rows.length}
            pageSize={PAGE_SIZE}
            currentPage={safePage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
});

export { IncidentsDatatable };
