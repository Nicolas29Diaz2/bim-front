"use client";

import { useToastStore } from "@/common/store/toastStore";
import { Toast } from "./Toast";
import styles from "./Toast.module.scss";

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div aria-label="Notifications" className={styles.container}>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
}
