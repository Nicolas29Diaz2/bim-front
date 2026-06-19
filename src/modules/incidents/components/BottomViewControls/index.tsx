"use client";

import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { cn } from "@/common/utils/cn";
import {
  useMapWorkspaceStore,
  selectCurrentIndex,
  selectTotal,
  type ViewMode,
} from "../../store/useMapWorkspaceStore";
import styles from "./index.module.scss";

type ViewToggleOption = "2D" | "3D" | "Heatmap";

const VIEW_OPTIONS: { key: ViewToggleOption; viewMode: ViewMode }[] = [
  { key: "2D", viewMode: "markers" },
  { key: "3D", viewMode: "markers" },
  { key: "Heatmap", viewMode: "heatmap" },
];

export function BottomViewControls() {
  const t = useTranslations();
  const viewMode = useMapWorkspaceStore((s) => s.viewMode);
  const is3D = useMapWorkspaceStore((s) => s.is3D);
  const currentIndex = useMapWorkspaceStore(selectCurrentIndex);
  const total = useMapWorkspaceStore(selectTotal);
  const setViewMode = useMapWorkspaceStore((s) => s.setViewMode);
  const toggle3D = useMapWorkspaceStore((s) => s.toggle3D);
  const nextIncident = useMapWorkspaceStore((s) => s.nextIncident);
  const prevIncident = useMapWorkspaceStore((s) => s.prevIncident);

  const activeToggle: ViewToggleOption =
    viewMode === "heatmap" ? "Heatmap" : is3D ? "3D" : "2D";

  const handleToggle = (option: ViewToggleOption) => {
    if (option === "Heatmap") {
      setViewMode("heatmap");
      if (is3D) toggle3D();
    } else {
      setViewMode("markers");
      const want3D = option === "3D";
      if (is3D !== want3D) toggle3D();
    }
  };

  const hasItems = total > 0;
  const displayCurrent = hasItems ? currentIndex + 1 : 0;

  return (
    <div className={styles.bar}>
      <button
        type="button"
        className={styles.navBtn}
        disabled={!hasItems}
        onClick={prevIncident}
        aria-label={t("incidents.bottomControls.previous")}
      >
        <ChevronLeft size={18} strokeWidth={2.2} />
      </button>

      <div className={styles.counter}>
        <span className={styles.counterCurrent}>{displayCurrent}</span>
        <span className={styles.counterSep}>/</span>
        <span className={styles.counterTotal}>{total}</span>
      </div>

      <button
        type="button"
        className={styles.navBtn}
        disabled={!hasItems}
        onClick={nextIncident}
        aria-label={t("incidents.bottomControls.next")}
      >
        <ChevronRight size={18} strokeWidth={2.2} />
      </button>

      <div className={styles.separator} />

      <div className={styles.toggleGroup}>
        {VIEW_OPTIONS.map(({ key }) => (
          <button
            key={key}
            type="button"
            className={cn(
              styles.toggleBtn,
              activeToggle === key
                ? styles.toggleBtnActive
                : styles.toggleBtnInactive,
            )}
            onClick={() => handleToggle(key)}
          >
            {key === "Heatmap" ? (
              <span className={styles.toggleHeatmap}>
                <Flame size={13} strokeWidth={2.2} />
                {t("incidents.bottomControls.heatmap")}
              </span>
            ) : (
              key
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
