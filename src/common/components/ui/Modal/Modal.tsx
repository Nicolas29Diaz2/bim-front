"use client";

import { HTMLAttributes, ReactNode, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/common/utils/cn";
import styles from "./Modal.module.scss";

type ModalSize = "sm" | "md" | "lg";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  footer?: ReactNode;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
}

const CloseIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="4" x2="14" y2="14" />
    <line x1="14" y1="4" x2="4" y2="14" />
  </svg>
);

function Modal({
  open,
  onClose,
  title,
  size = "md",
  footer,
  closeOnOverlay = true,
  closeOnEsc = true,
  children,
  className,
  ...rest
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape") {
        onClose();
      }
    },
    [closeOnEsc, onClose],
  );

  useEffect(() => {
    if (!open) return;

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return createPortal(
    <div
      className={styles.overlay}
      onClick={closeOnOverlay ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={cn(styles.modal, styles[size], className)}
        onClick={(e) => e.stopPropagation()}
        {...rest}
      >
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close"
            >
              <CloseIcon />
            </button>
          </div>
        )}

        <div className={styles.body}>{children}</div>

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

export { Modal, type ModalProps, type ModalSize };
