import {
  HTMLAttributes,
  forwardRef,
  useCallback,
  useMemo,
  useState,
} from "react";
import { cn } from "@/common/utils/cn";
import styles from "./Calendar.module.scss";

interface CalendarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  value?: Date | null;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  defaultMonth?: Date;
  disabled?: boolean;
}

const WEEKDAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
const MONTHS = [
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

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function sameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isDisabled(date: Date, min?: Date, max?: Date): boolean {
  return Boolean((min && date < min) || (max && date > max));
}

function buildDays(year: number, month: number) {
  const result: Array<{ date: Date; isCurrentMonth: boolean }> = [];
  const firstDay = new Date(year, month, 1).getDay();
  const prevDays = daysInMonth(year, month - 1);

  for (let i = firstDay - 1; i >= 0; i--) {
    result.push({
      date: new Date(year, month - 1, prevDays - i),
      isCurrentMonth: false,
    });
  }
  for (let day = 1; day <= daysInMonth(year, month); day++) {
    result.push({ date: new Date(year, month, day), isCurrentMonth: true });
  }
  for (let day = 1; result.length < 42; day++) {
    result.push({
      date: new Date(year, month + 1, day),
      isCurrentMonth: false,
    });
  }

  return result;
}

const ChevronLeft = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 4l-4 4 4 4" />
  </svg>
);

const ChevronRight = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 4l4 4-4 4" />
  </svg>
);

const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
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
) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(defaultMonth ?? value ?? today);
  const month = viewDate.getMonth();
  const year = viewDate.getFullYear();
  const days = useMemo(() => buildDays(year, month), [year, month]);

  const prevMonth = useCallback(() => {
    setViewDate((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1));
  }, []);

  const nextMonth = useCallback(() => {
    setViewDate((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1));
  }, []);

  const canGoPrev = !(
    minDate &&
    year === minDate.getFullYear() &&
    month <= minDate.getMonth()
  );
  const canGoNext = !(
    maxDate &&
    year === maxDate.getFullYear() &&
    month >= maxDate.getMonth()
  );

  return (
    <div
      ref={ref}
      className={cn(styles.calendar, className)}
      role="grid"
      {...rest}
    >
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
          {MONTHS[month]} {year}
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
        {WEEKDAYS.map((label) => (
          <span key={label} className={styles.weekday} role="columnheader">
            {label}
          </span>
        ))}
      </div>

      <div className={styles.days} role="rowgroup">
        {days.map(({ date, isCurrentMonth }, index) => {
          const selected = value ? sameDate(date, value) : false;
          const isToday = sameDate(date, today);
          return (
            <button
              key={index}
              type="button"
              role="gridcell"
              disabled={disabled || isDisabled(date, minDate, maxDate)}
              aria-selected={selected}
              aria-current={isToday ? "date" : undefined}
              className={cn(
                styles.day,
                !isCurrentMonth && styles.outsideMonth,
                isToday && styles.today,
                selected && styles.selected,
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
});

Calendar.displayName = "Calendar";

export { Calendar, type CalendarProps };
