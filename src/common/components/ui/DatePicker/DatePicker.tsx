import { useState, useRef, useCallback } from "react";
import { cn } from "@/common/utils/cn";
import { useDropdownPosition } from "@/common/hooks/useDropdownPosition";
import { useClickOutside } from "@/common/hooks/useClickOutside";
import { DropdownPanel } from "@/common/components/ui/Dropdown";
import { Calendar } from "@/common/components/ui/Calendar";
import styles from "./DatePicker.module.scss";
import { CalendarIcon } from "lucide-react";

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

function formatDateDisplay(date: Date | null): string {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function DatePicker({
  value,
  onChange,
  placeholder = "Select date...",
  disabled = false,
  error,
  className,
  minDate,
  maxDate,
}: Readonly<DatePickerProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const coords = useDropdownPosition(triggerRef, isOpen, {
    maxPanelHeight: 360,
  });

  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  useClickOutside([triggerRef, panelRef], close, isOpen);

  function toggle() {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  }

  function handleSelect(date: Date) {
    onChange(date);
    close();
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange(null);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    } else if (e.key === "Escape" && isOpen) {
      e.preventDefault();
      close();
    }
  }

  const hasError = Boolean(error);
  const displayValue = formatDateDisplay(value);

  return (
    <div
      className={cn(
        styles.wrapper,
        hasError && styles.error,
        disabled && styles.disabled,
        className,
      )}
    >
      <div
        ref={triggerRef}
        className={cn(styles.trigger, isOpen && styles.triggerOpen)}
        onClick={toggle}
        onKeyDown={onKeyDown}
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        role="combobox"
      >
        <span className={cn(styles.value, !displayValue && styles.placeholder)}>
          {displayValue || placeholder}
        </span>

        {displayValue && !disabled && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={handleClear}
            aria-label="Clear date"
          >
            <svg
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="2" y1="2" x2="10" y2="10" />
              <line x1="10" y1="2" x2="2" y2="10" />
            </svg>
          </button>
        )}

        <span className={styles.calendarIcon}>
          <CalendarIcon />
        </span>
      </div>

      <DropdownPanel
        ref={panelRef}
        isOpen={isOpen}
        coordinates={coords.coordinates}
        maxHeight={coords.maxHeight}
        direction={coords.direction}
        scrollable={false}
      >
        <Calendar
          value={value}
          onChange={handleSelect}
          minDate={minDate}
          maxDate={maxDate}
        />
      </DropdownPanel>

      {hasError && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}

export { DatePicker, type DatePickerProps };
