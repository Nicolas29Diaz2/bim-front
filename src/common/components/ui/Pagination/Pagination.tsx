import { HTMLAttributes, useMemo } from "react";
import { cn } from "@/common/utils/cn";
import styles from "./Pagination.module.scss";

interface PaginationProps extends HTMLAttributes<HTMLElement> {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const ChevronLeft = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 4l-4 4 4 4" />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4l4 4-4 4" />
  </svg>
);

function generatePageNumbers(current: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < totalPages - 2) {
    pages.push("...");
  }

  pages.push(totalPages);

  return pages;
}

function Pagination({
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
  className,
  ...rest
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pages = useMemo(
    () => generatePageNumbers(currentPage, totalPages),
    [currentPage, totalPages],
  );

  return (
    <nav
      aria-label="Pagination"
      className={cn(styles.pagination, className)}
      {...rest}
    >
      <span className={styles.summary}>
        Showing {startItem}–{endItem} of {totalItems.toLocaleString()} entries
      </span>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.navArrow}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </button>

        {pages.map((page, idx) =>
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className={styles.pageButton}>
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={cn(styles.pageButton, page === currentPage && styles.active)}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          className={styles.navArrow}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <ChevronRight />
        </button>
      </div>
    </nav>
  );
}

export { Pagination, type PaginationProps };
