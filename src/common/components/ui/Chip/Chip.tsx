import { HTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/common/utils/cn";
import styles from "./Chip.module.scss";

type ChipVariant = "filled" | "outlined";
type ChipColor = "primary" | "neutral" | "error" | "warning" | "success";

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant;
  color?: ChipColor;
  icon?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  compact?: boolean;
}

const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  (
    {
      variant = "filled",
      color = "neutral",
      icon,
      dismissible = false,
      onDismiss,
      compact = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const handleDismiss = (e: React.MouseEvent) => {
      e.stopPropagation();
      onDismiss?.();
    };

    return (
      <span
        ref={ref}
        className={cn(
          styles.chip,
          styles[variant],
          styles[color],
          compact ? styles.sm : styles.md,
          className,
        )}
        {...rest}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        {children}
        {dismissible && (
          <button
            type="button"
            aria-label="Remove"
            className={styles.dismiss}
            onClick={handleDismiss}
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
      </span>
    );
  },
);

Chip.displayName = "Chip";

export { Chip, type ChipProps, type ChipVariant, type ChipColor };
