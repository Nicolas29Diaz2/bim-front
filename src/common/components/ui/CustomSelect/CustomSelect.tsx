import { useState, useRef, useCallback, useMemo } from "react";
import { cn } from "@/common/utils/cn";
import { useDropdownPosition } from "@/common/hooks/useDropdownPosition";
import { useClickOutside } from "@/common/hooks/useClickOutside";
import { DropdownPanel, DropdownOption } from "@/common/components/ui/Dropdown";
import styles from "./CustomSelect.module.scss";

interface CustomSelectOption<TValue extends string> {
  value: TValue;
  label: string;
  disabled?: boolean;
}

interface CustomSelectProps<TValue extends string> {
  options: CustomSelectOption<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

const ChevronIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 6l4 4 4-4" />
  </svg>
);

function CustomSelect<TValue extends string>({
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  error,
  className,
}: Readonly<CustomSelectProps<TValue>>) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const coords = useDropdownPosition(triggerRef, isOpen);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value],
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
    triggerRef.current?.focus();
  }, []);

  useClickOutside([triggerRef, panelRef], close, isOpen);

  function toggle() {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    setFocusedIndex(-1);
  }

  function selectOption(optValue: TValue) {
    onChange(optValue);
    close();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          selectOption(options[focusedIndex].value);
        } else {
          toggle();
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex((prev) => {
            let next = prev + 1;
            while (next < options.length && options[next].disabled) next++;
            return next < options.length ? next : prev;
          });
        } else {
          setIsOpen(true);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex((prev) => {
            let next = prev - 1;
            while (next >= 0 && options[next].disabled) next--;
            return next >= 0 ? next : prev;
          });
        }
        break;
      case "Escape":
        if (isOpen) {
          e.preventDefault();
          close();
        }
        break;
    }
  }

  const hasError = Boolean(error);

  return (
    <div
      className={cn(
        styles.wrapper,
        hasError && styles.error,
        disabled && styles.disabled,
        className,
      )}
    >
      <button
        ref={triggerRef}
        className={cn(styles.trigger, isOpen && styles.triggerOpen)}
        onClick={toggle}
        onKeyDown={onKeyDown}
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span
          className={cn(styles.value, !selectedOption && styles.placeholder)}
        >
          {selectedOption?.label ?? placeholder}
        </span>
        <span className={cn(styles.chevron, isOpen && styles.chevronOpen)}>
          <ChevronIcon />
        </span>
      </button>

      <DropdownPanel
        ref={panelRef}
        isOpen={isOpen}
        coordinates={coords.coordinates}
        maxHeight={coords.maxHeight}
        direction={coords.direction}
      >
        {options.map((opt) => (
          <DropdownOption
            key={opt.value}
            isSelected={opt.value === value}
            isFocused={options.indexOf(opt) === focusedIndex}
            disabled={opt.disabled}
            onClick={() => selectOption(opt.value)}
            onMouseEnter={() => setFocusedIndex(options.indexOf(opt))}
          >
            {opt.label}
          </DropdownOption>
        ))}
      </DropdownPanel>

      {hasError && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}

export { CustomSelect, type CustomSelectProps, type CustomSelectOption };
