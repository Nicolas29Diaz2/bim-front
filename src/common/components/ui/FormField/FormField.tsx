import { type ReactNode } from "react";
import { cn } from "@/common/utils/cn";
import styles from "./FormField.module.scss";

interface FormFieldProps {
  label: ReactNode;
  children: ReactNode;
  className?: string;
}

function FormField({ label, children, className }: Readonly<FormFieldProps>) {
  return (
    <div className={cn(styles.field, className)}>
      <span className={styles.label}>{label}</span>
      {children}
    </div>
  );
}

export { FormField, type FormFieldProps };
