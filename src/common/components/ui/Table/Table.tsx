import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/common/utils/cn";
import styles from "./Table.module.scss";

interface ColumnDef<TData> {
  /** Unique key for the column, also used as header text if `header` is omitted */
  key: string;
  /** Custom header content. If omitted, `key` is used as label. */
  header?: ReactNode;
  /** Render function for cell content. Receives the row data and column key. */
  renderCell?: (row: TData, columnKey: string) => ReactNode;
  /** Custom CSS class applied to the <td> in this column */
  cellClassName?: string;
  /** Whether this column is hidden */
  hidden?: boolean;
}

interface TableProps<TData> extends HTMLAttributes<HTMLTableElement> {
  columns: ColumnDef<TData>[];
  data: TData[];
  /** Renders a row element. Receives row data and index. */
  renderRow?: (row: TData, index: number) => ReactNode;
  /** Enables compact padding mode */
  compact?: boolean;
  /** Renders content when `data` is empty */
  emptyMessage?: string;
  /** Callback when a row is clicked */
  onRowClick?: (row: TData, index: number) => void;
  /** Function to extract a unique key from row data for React keys */
  rowKey: (row: TData) => string;
  /** Minimum height for the table body to prevent layout shift */
  minBodyHeight?: number;
}

function Table<TData>({
  columns,
  data,
  compact = false,
  emptyMessage = "No data available",
  onRowClick,
  rowKey,
  minBodyHeight,
  className,
  ...rest
}: Readonly<TableProps<TData>>) {
  const visibleColumns = columns.filter((col) => !col.hidden);

  return (
    <div className={cn(styles.tableWrapper, className)}>
      <table className={cn(styles.table, compact && styles.compact)} {...rest}>
        <thead className={styles.thead}>
          <tr>
            {visibleColumns.map((col) => (
              <th key={col.key} className={styles.th}>
                {col.header ?? col.key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className={styles.tbody}
          style={minBodyHeight ? { minHeight: minBodyHeight } : undefined}
        >
          {data.length === 0 ? (
            <tr>
              <td colSpan={visibleColumns.length} className={styles.td}>
                <div className={styles.empty}>{emptyMessage}</div>
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={rowKey(row)}
                className={cn(styles.row, onRowClick && styles.clickable)}
                onClick={onRowClick ? () => onRowClick(row, idx) : undefined}
              >
                {visibleColumns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(styles.td, col.cellClassName)}
                  >
                    {col.renderCell
                      ? col.renderCell(row, col.key)
                      : String((row as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export { Table, type TableProps, type ColumnDef };
