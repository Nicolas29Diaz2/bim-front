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
import { IconButton } from "@/common/components/ui/IconButton";
import { useIncidentCreationStore } from "../../store/useIncidentCreationStore";
import styles from "./index.module.scss";
import { useCallback } from "react";

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
  const cancelIncidentSelection = useIncidentCreationStore(
    (s) => s.cancelIncidentSelection,
  );

  const handle = useCallback(() => {
    if (isCrosshairMode) {
      return cancelIncidentSelection();
    }

    startIncidentSelection();
  }, [isCrosshairMode, startIncidentSelection, cancelIncidentSelection]);

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
        <IconButton
          icon={
            <Plus
              size={22}
              className={cn(styles.icon, isCrosshairMode && styles.iconRotated)}
            />
          }
          variant={isCrosshairMode ? "destructive" : "primary"}
          onClick={handle}
          aria-label={isCrosshairMode ? "Cancel selection" : "Create incident"}
        />

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
