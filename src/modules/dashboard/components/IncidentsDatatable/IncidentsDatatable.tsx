"use client";

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

const PRIORITY_MAP: Record<string, { label: string; colorClass: string }> = {
  critical: { label: "Critical", colorClass: styles.pillCritical },
  high: { label: "High", colorClass: styles.pillHigh },
  medium: { label: "Medium", colorClass: styles.pillMedium },
  low: { label: "Low", colorClass: styles.pillLow },
};

const STATUS_MAP: Record<string, { label: string; colorClass: string }> = {
  open: { label: "Open", colorClass: styles.statusOpen },
  closed: { label: "Closed", colorClass: styles.statusClosed },
  on_pause: { label: "Paused", colorClass: styles.statusPaused },
};

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

const columns: ColumnDef<Incident>[] = [
  {
    key: "sequenceId",
    header: "ID",
    renderCell: (row) => (
      <span className={styles.cellId}>#{row.sequenceId}</span>
    ),
  },
  {
    key: "title",
    header: "Title",
    renderCell: (row) => <span className={styles.cellTitle}>{row.title}</span>,
  },
  {
    key: "category",
    header: "Category",
    renderCell: (row) => (
      <span className={styles.categoryTag}>{row.type.name}</span>
    ),
  },
  {
    key: "priority",
    header: "Priority",
    renderCell: (row) => {
      const p = PRIORITY_MAP[row.priority] ?? PRIORITY_MAP.medium;
      return <span className={cn(styles.pill, p.colorClass)}>{p.label}</span>;
    },
  },
  {
    key: "assignees",
    header: "Assignees",
    renderCell: (row) => <AssigneeAvatars assignees={row.assignees} />,
  },
  {
    key: "status",
    header: "Status",
    renderCell: (row) => {
      const s = STATUS_MAP[row.status] ?? STATUS_MAP.open;
      return (
        <span className={cn(styles.statusBadge, s.colorClass)}>{s.label}</span>
      );
    },
  },
];

const IncidentsDatatable = memo(function IncidentsDatatable() {
  const rows = useSearchFilteredIncidents();
  const searchQuery = useDashboardStore((s) => s.searchQuery);
  const setSearchQuery = useDashboardStore((s) => s.setSearchQuery);

  const [currentPage, setCurrentPage] = useState(1);

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
        <h3 className={styles.title}>Incidents Detail</h3>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={pageRows}
        rowKey={(row) => row.id}
        emptyMessage="No incidents match your filters."
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
