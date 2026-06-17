import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/common/utils/cn";
import styles from "./IconButton.module.scss";

type IconButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
type IconButtonSize = "sm" | "md";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
}

const variantClasses: Record<IconButtonVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
  destructive: styles.destructive,
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { icon, variant = "primary", size = "md", className, disabled, ...rest },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          styles.button,
          variantClasses[variant],
          styles[size],
          className,
        )}
        {...rest}
      >
        {icon}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";

export {
  IconButton,
  type IconButtonProps,
  type IconButtonVariant,
  type IconButtonSize,
};
