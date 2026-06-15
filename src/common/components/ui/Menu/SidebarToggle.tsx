import { ButtonHTMLAttributes } from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/common/utils/cn";
import styles from "./SidebarToggle.module.scss";

interface SidebarToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  collapsed?: boolean;
}

function SidebarToggle({
  collapsed,
  className,
  ...rest
}: Readonly<SidebarToggleProps>) {
  return (
    <button
      type="button"
      className={cn(styles.toggle, collapsed && styles.collapsed, className)}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      {...rest}
    >
      <ChevronLeft size={16} />
    </button>
  );
}

export { SidebarToggle, type SidebarToggleProps };
