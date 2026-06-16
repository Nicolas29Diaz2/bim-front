"use client";

import { Button } from "@/common/components/ui/Button";
import { cn } from "@/common/utils/cn";
import { useIncidentCreationStore } from "../../store/useIncidentCreationStore";
import styles from "./index.module.scss";
import { Plus } from "lucide-react";

export function OverlayControls() {
  const isCrosshairMode = useIncidentCreationStore((s) => s.isCrosshairMode);
  const startIncidentSelection = useIncidentCreationStore(
    (s) => s.startIncidentSelection,
  );

  return (
    <div className={styles.controls}>
      <Button
        variant={"primary"}
        onClick={startIncidentSelection}
        icon={<Plus />}
      >
        {isCrosshairMode ? "Click on the map..." : "New Incident"}
      </Button>

      {isCrosshairMode && (
        <div className={styles.hint}>
          <span className={cn(styles.pulse, styles.pulseActive)} />
          Crosshair active — click anywhere on the map
        </div>
      )}
    </div>
  );
}
