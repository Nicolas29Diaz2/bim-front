import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/common/utils/cn";
import styles from "./Input.module.scss";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  error?: string;
  helperText?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  compact?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      error,
      helperText,
      leadingIcon,
      trailingIcon,
      compact = false,
      className,
      disabled,
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
        <div className={styles.inputContainer}>
          {leadingIcon && (
            <span className={styles.leadingIcon}>{leadingIcon}</span>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={styles.input}
            aria-invalid={hasError || undefined}
            aria-describedby={
              hasError ? `${rest.id}-error` : helperText ? `${rest.id}-helper` : undefined
            }
            {...rest}
          />
          {trailingIcon && (
            <span className={styles.trailingIcon}>{trailingIcon}</span>
          )}
        </div>
        {hasError && (
          <span id={rest.id ? `${rest.id}-error` : undefined} className={styles.errorText}>
            {error}
          </span>
        )}
        {!hasError && helperText && (
          <span id={rest.id ? `${rest.id}-helper` : undefined} className={styles.helperText}>
            {helperText}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input, type InputProps };
