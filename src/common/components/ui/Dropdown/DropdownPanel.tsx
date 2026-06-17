import { forwardRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/common/utils/cn";
import styles from "./DropdownPanel.module.scss";

interface DropdownPanelProps {
  children: ReactNode;
  isOpen: boolean;
  maxHeight: number;
  direction: "down" | "up";
  portal?: boolean;
  className?: string;
  id?: string;
  scrollable?: boolean;
  coordinates?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    width: number;
    minWidth?: number;
  };
}

const DropdownPanelInner = forwardRef<
  HTMLDivElement,
  Readonly<Omit<DropdownPanelProps, "portal">>
>(function DropdownPanelInner(
  {
    children,
    isOpen,
    maxHeight,
    direction,
    className,
    id,
    scrollable = true,
    coordinates,
  },
  ref,
) {
  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      id={id}
      className={cn(
        styles.panel,
        direction === "up" && styles.up,
        isOpen && styles.visible,
        className,
      )}
      style={{
        position: "fixed",
        top: coordinates?.top,
        bottom: coordinates?.bottom,
        left: coordinates?.left,
        right: coordinates?.right,
        width: coordinates?.width,
        maxHeight,
        minWidth: coordinates?.minWidth,
      }}
    >
      <div className={scrollable ? styles.scrollArea : styles.content}>
        {children}
      </div>
    </div>
  );
});

const DropdownPanel = forwardRef<HTMLDivElement, Readonly<DropdownPanelProps>>(
  function DropdownPanel({ portal = true, ...props }, ref) {
    if (!props.isOpen) return null;

    if (portal) {
      return createPortal(
        <DropdownPanelInner ref={ref} {...props} />,
        document.body,
      );
    }

    return <DropdownPanelInner ref={ref} {...props} />;
  },
);

export { DropdownPanel, type DropdownPanelProps };
