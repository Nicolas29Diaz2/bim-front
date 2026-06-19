"use client";

import { useTranslations } from "next-intl";
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
  { Icon: Building2, labelKey: "incidents.overlayControls.tools.building" },
  { Icon: Ruler, labelKey: "incidents.overlayControls.tools.measurement" },
  { Icon: MapPin, labelKey: "incidents.overlayControls.tools.pin" },
  { Icon: Layers, labelKey: "incidents.overlayControls.tools.layers" },
  { Icon: Frame, labelKey: "incidents.overlayControls.tools.capture" },
  { Icon: HardHat, labelKey: "incidents.overlayControls.tools.safety" },
  { Icon: Upload, labelKey: "incidents.overlayControls.tools.upload" },
] as const;

export function OverlayControls() {
  const t = useTranslations();
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
            {t("incidents.overlayControls.hint")}
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
          aria-label={
            isCrosshairMode
              ? t("incidents.overlayControls.cancelSelection")
              : t("incidents.overlayControls.createIncident")
          }
        />

        <div className={styles.divider} />

        {TOOLBAR_ICONS.map(({ Icon, labelKey }) => (
          <button
            key={labelKey}
            type="button"
            className={styles.iconBtn}
            disabled
            aria-label={t(labelKey)}
            title={t(labelKey)}
          >
            <Icon size={20} strokeWidth={1.8} />
          </button>
        ))}
      </div>
    </>
  );
}
