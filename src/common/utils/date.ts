import { parseISO } from "date-fns";

/** Convert a Date (or null) to a "YYYY-MM-DD" string (or null). */
export function toISOString(date: Date | null): string | null {
  if (!date) return null;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parse a "YYYY-MM-DD" string (or null) into a Date (or null). */
export function fromISOString(iso: string | null): Date | null {
  if (!iso) return null;
  return parseISO(iso);
}
