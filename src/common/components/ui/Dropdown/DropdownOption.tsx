import { type ReactNode } from "react";
import { cn } from "@/common/utils/cn";
import styles from "./DropdownOption.module.scss";

interface DropdownOptionProps {
  children: ReactNode;
  isSelected?: boolean;
  isFocused?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  className?: string;
}

function DropdownOption({
  children,
  isSelected = false,
  isFocused = false,
  disabled = false,
  onClick,
  onMouseEnter,
  className,
}: Readonly<DropdownOptionProps>) {
  return (
    <button
      aria-selected={isSelected}
      disabled={disabled}
      className={cn(
        styles.option,
        isSelected && styles.selected,
        isFocused && styles.focused,
        disabled && styles.disabled,
        className,
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      role="option"
    >
      {children}
      {isSelected && (
        <span className={styles.checkmark}>
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 8l4 4 6-7" />
          </svg>
        </span>
      )}
    </button>
  );
}

export { DropdownOption, type DropdownOptionProps };
