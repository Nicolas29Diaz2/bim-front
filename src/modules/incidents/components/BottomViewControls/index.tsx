"use client";

import { History, Clapperboard } from "lucide-react";
import { cn } from "@/common/utils/cn";
import styles from "./index.module.scss";

interface BottomViewControlsProps {
  is3D: boolean;
  onToggle3D: () => void;
}

export function BottomViewControls({
  is3D,
  onToggle3D,
}: Readonly<BottomViewControlsProps>) {
  return (
    <div className={styles.bar}>
      <div className={styles.toggleGroup}>
        <button
          type="button"
          className={cn(
            styles.toggleBtn,
            is3D ? styles.toggleBtnInactive : styles.toggleBtnActive,
          )}
          onClick={onToggle3D}
        >
          2D
        </button>
        <button
          type="button"
          className={cn(
            styles.toggleBtn,
            is3D ? styles.toggleBtnActive : styles.toggleBtnInactive,
          )}
          onClick={onToggle3D}
        >
          3D
        </button>
      </div>

      <div className={styles.separator} />

      <button
        type="button"
        className={styles.iconBtn}
        disabled
        aria-label="History"
      >
        <History size={18} strokeWidth={1.8} />
      </button>

      <button
        type="button"
        className={styles.iconBtn}
        disabled
        aria-label="Clapperboard"
      >
        <Clapperboard size={18} strokeWidth={1.8} />
      </button>

      <div className={styles.separator} />

      <div className={styles.row360}>
        <span className={styles.label360}>360°</span>
        <span className={styles.toggleTrack}>
          <span className={styles.toggleThumb} />
        </span>
      </div>
    </div>
  );
}
