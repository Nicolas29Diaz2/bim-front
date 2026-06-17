"use client";

import { Input } from "@/common/components/ui/Input";
import { CustomSelect } from "@/common/components/ui/CustomSelect";
import { Button } from "@/common/components/ui/Button";
import { FormField } from "@/common/components/ui/FormField";
import {
  BUILDING_OPTIONS,
  LEVEL_OPTIONS,
} from "../../constants/incidentCreationOptions";
import { useIncidentCreationStore } from "../../store/useIncidentCreationStore";
import styles from "./index.module.scss";
import { Plus } from "lucide-react";

const buildingOptions = BUILDING_OPTIONS.map((b) => ({ value: b, label: b }));
const levelOptions = LEVEL_OPTIONS.map((l) => ({ value: l, label: l }));

export function IncidentLocationStep() {
  const formData = useIncidentCreationStore((state) => state.formData);
  const updateField = useIncidentCreationStore((state) => state.updateField);
  const startRepositionPin = useIncidentCreationStore(
    (state) => state.startRepositionPin,
  );

  const hasCoords = formData.coordinates !== null;

  function formatCoord(value: number): string {
    return value.toFixed(8);
  }

  return (
    <section className={styles.step}>
      <div className={styles.coordCard}>
        <div className={styles.coordRow}>
          <div className={styles.coordField}>
            <span>Latitude</span>
            <span className={styles.coordValue}>
              {hasCoords ? formatCoord(formData.coordinates!.lat) : "\u2014"}
            </span>
          </div>
          <div className={styles.coordField}>
            <span>Longitude</span>
            <span className={styles.coordValue}>
              {hasCoords ? formatCoord(formData.coordinates!.lng) : "\u2014"}
            </span>
          </div>
        </div>
        <Button variant="primary" onClick={startRepositionPin}>
          <Plus size={16} />
          Reposition Pin
        </Button>
      </div>

      <div className={styles.formGrid}>
        <FormField label="Building">
          <CustomSelect
            value={formData.building}
            placeholder="Select building"
            options={buildingOptions}
            onChange={(val) => updateField("building", val)}
          />
        </FormField>
        <FormField label="Level">
          <CustomSelect
            value={formData.level}
            placeholder="Select level"
            options={levelOptions}
            onChange={(val) => updateField("level", val)}
          />
        </FormField>
      </div>

      <FormField label="Sector / Description">
        <Input
          value={formData.sectorDescription}
          placeholder="e.g. Eje D2, between columns C5-C7"
          onChange={(e) => updateField("sectorDescription", e.target.value)}
        />
      </FormField>

      {!hasCoords && (
        <p className={styles.hint}>
          Click &quot;Reposition Pin&quot; to open the map and select a
          geographic point.
        </p>
      )}
    </section>
  );
}
