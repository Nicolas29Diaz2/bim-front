"use client";

import { memo, useMemo, useState } from "react";
import { useAssigneesData } from "../../hooks";
import { Table, type ColumnDef } from "@/common/components/ui/Table";
import { Pagination } from "@/common/components/ui/Pagination";
import styles from "./TopAssigneesTable.module.scss";

const PAGE_SIZE = 4;

function formatDays(days: number | null): string {
  if (days === null) return "N/A";
  if (days < 1) return "<1d";
  return `${Math.round(days)}d`;
}

const TopAssigneesTable = memo(function TopAssigneesTable() {
  const allRows = useAssigneesData();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(allRows.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const pageRows = useMemo(
    () => allRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [allRows, safePage],
  );

  const columns: ColumnDef<(typeof allRows)[number]>[] = useMemo(
    () => [
      {
        key: "assignee",
        header: "Assignee",
        renderCell: (row) => (
          <div className={styles.assigneeCell}>
            <img src={row.avatarUrl} alt={row.name} className={styles.avatar} />
            <span className={styles.assigneeName}>{row.name}</span>
          </div>
        ),
      },
      {
        key: "totalAssigned",
        header: "Total",
        renderCell: (row) => (
          <span className={styles.totalBadge}>{row.totalAssigned}</span>
        ),
      },
      {
        key: "openCount",
        header: "Open",
        renderCell: (row) => (
          <span className={styles.openCount}>{row.openCount}</span>
        ),
      },
      {
        key: "closedCount",
        header: "Closed",
        renderCell: (row) => (
          <span className={styles.closedCount}>{row.closedCount}</span>
        ),
      },
      {
        key: "avgResolutionDays",
        header: "Avg. Resolution",
        renderCell: (row) => (
          <span className={styles.avgDays}>
            {formatDays(row.avgResolutionDays)}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Top Assignees</h3>
      <Table
        columns={columns}
        data={pageRows}
        rowKey={(row) => row.id}
        emptyMessage="No assignee data available."
        className={styles.table}
      />
      {allRows.length > PAGE_SIZE && (
        <div className={styles.paginationWrap}>
          <Pagination
            totalItems={allRows.length}
            pageSize={PAGE_SIZE}
            currentPage={safePage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
});

export { TopAssigneesTable };
