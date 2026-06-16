"use client";

import {
  Plus,
  Building2,
  Ruler,
  MapPin,
  Layers,
  Frame,
  HardHat,
  Upload,
} from "lucide-react";
import { cn } from "@/common/utils/cn";
import { useIncidentCreationStore } from "../../store/useIncidentCreationStore";
import styles from "./index.module.scss";

const TOOLBAR_ICONS = [
  { Icon: Building2, label: "Building" },
  { Icon: Ruler, label: "Measurement" },
  { Icon: MapPin, label: "Pin" },
  { Icon: Layers, label: "Layers" },
  { Icon: Frame, label: "Capture" },
  { Icon: HardHat, label: "Safety" },
  { Icon: Upload, label: "Upload" },
] as const;

export function OverlayControls() {
  const isCrosshairMode = useIncidentCreationStore((s) => s.isCrosshairMode);
  const startIncidentSelection = useIncidentCreationStore(
    (s) => s.startIncidentSelection,
  );

  return (
    <>
      <div className={styles.hintTrack}>
        {isCrosshairMode && (
          <div className={styles.hint}>
            <span className={styles.pulse} />
            Click on the map to select the incident location
          </div>
        )}
      </div>

      <div className={styles.toolbar}>
        <button
          type="button"
          className={cn(
            styles.actionBtn,
            isCrosshairMode && styles.actionBtnActive,
          )}
          onClick={startIncidentSelection}
          aria-label={isCrosshairMode ? "Cancel selection" : "Create incident"}
        >
          <Plus
            size={22}
            className={cn(styles.icon, isCrosshairMode && styles.iconRotated)}
          />
        </button>

        <div className={styles.divider} />

        {TOOLBAR_ICONS.map(({ Icon, label }) => (
          <button
            key={label}
            type="button"
            className={styles.iconBtn}
            disabled
            aria-label={label}
            title={label}
          >
            <Icon size={20} strokeWidth={1.8} />
          </button>
        ))}
      </div>
    </>
  );
}
