import { HTMLAttributes, forwardRef, useState, useMemo, useCallback } from "react";
import { cn } from "@/common/utils/cn";
import styles from "./Calendar.module.scss";

interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: Date | null;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  defaultMonth?: Date;
  disabled?: boolean;
}

const WEEKDAY_LABELS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isSameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isDateDisabled(date: Date, minDate?: Date, maxDate?: Date): boolean {
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  return false;
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

const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      value = null,
      onChange,
      minDate,
      maxDate,
      defaultMonth,
      disabled = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const today = new Date();
    const [viewDate, setViewDate] = useState(defaultMonth ?? value ?? today);

    const currentMonth = viewDate.getMonth();
    const currentYear = viewDate.getFullYear();

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const prevMonth = useCallback(() => {
      setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    }, []);

    const nextMonth = useCallback(() => {
      setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    }, []);

    const days = useMemo(() => {
      const result: Array<{ date: Date; isCurrentMonth: boolean }> = [];

      // Previous month overflow
      const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);
      for (let i = firstDay - 1; i >= 0; i--) {
        const day = prevMonthDays - i;
        result.push({
          date: new Date(currentYear, currentMonth - 1, day),
          isCurrentMonth: false,
        });
      }

      // Current month
      for (let day = 1; day <= daysInMonth; day++) {
        result.push({
          date: new Date(currentYear, currentMonth, day),
          isCurrentMonth: true,
        });
      }

      // Next month overflow
      const remaining = 42 - result.length;
      for (let day = 1; day <= remaining; day++) {
        result.push({
          date: new Date(currentYear, currentMonth + 1, day),
          isCurrentMonth: false,
        });
      }

      return result;
    }, [currentYear, currentMonth, daysInMonth, firstDay]);

    const canGoPrev = !(
      minDate &&
      currentYear === minDate.getFullYear() &&
      currentMonth <= minDate.getMonth()
    );
    const canGoNext = !(
      maxDate &&
      currentYear === maxDate.getFullYear() &&
      currentMonth >= maxDate.getMonth()
    );

    return (
      <div ref={ref} className={cn(styles.calendar, className)} role="grid" {...rest}>
        <div className={styles.header}>
          <button
            type="button"
            className={styles.navButton}
            onClick={prevMonth}
            disabled={disabled || !canGoPrev}
            aria-label="Previous month"
          >
            <ChevronLeft />
          </button>
          <span className={styles.title}>
            {MONTH_LABELS[currentMonth]} {currentYear}
          </span>
          <button
            type="button"
            className={styles.navButton}
            onClick={nextMonth}
            disabled={disabled || !canGoNext}
            aria-label="Next month"
          >
            <ChevronRight />
          </button>
        </div>

        <div className={styles.weekdays} role="row">
          {WEEKDAY_LABELS.map((label) => (
            <span key={label} className={styles.weekday} role="columnheader">
              {label}
            </span>
          ))}
        </div>

        <div className={styles.days} role="rowgroup">
          {days.map(({ date, isCurrentMonth }, idx) => {
            const isSelected = value ? isSameDate(date, value) : false;
            const isToday = isSameDate(date, today);
            const isDisabled = disabled || isDateDisabled(date, minDate, maxDate);

            return (
              <button
                key={idx}
                type="button"
                role="gridcell"
                disabled={isDisabled}
                aria-selected={isSelected}
                aria-current={isToday ? "date" : undefined}
                className={cn(
                  styles.day,
                  !isCurrentMonth && styles.outsideMonth,
                  isToday && styles.today,
                  isSelected && styles.selected,
                )}
                onClick={() => onChange?.(date)}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  },
);

Calendar.displayName = "Calendar";

export { Calendar, type CalendarProps };
