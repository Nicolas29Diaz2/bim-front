import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/common/utils/cn";
import styles from "./Select.module.scss";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  helperText?: string;
  compact?: boolean;
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

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      placeholder,
      error,
      helperText,
      compact = false,
      className,
      disabled,
      id,
      ...rest
    },
    ref,
  ) => {
    const hasError = Boolean(error);

    return (
      <div
        className={cn(
          styles.wrapper,
          hasError && styles.error,
          compact && styles.compact,
          className,
        )}
      >
        <div className={styles.selectContainer}>
          <select
            ref={ref}
            id={id}
            disabled={disabled}
            className={styles.select}
            aria-invalid={hasError || undefined}
            aria-describedby={
              hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined
            }
            {...rest}
          >
            {placeholder && (
              <option value="" disabled className={styles.placeholder}>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <span className={styles.chevron}>
            <ChevronIcon />
          </span>
        </div>
        {hasError && (
          <span id={id ? `${id}-error` : undefined} className={styles.errorText}>
            {error}
          </span>
        )}
        {!hasError && helperText && (
          <span id={id ? `${id}-helper` : undefined} className={styles.helperText}>
            {helperText}
          </span>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export { Select, type SelectProps, type SelectOption };
