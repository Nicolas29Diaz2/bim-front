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
import { StepHeader } from "../IncidentStepHeader";
import styles from "./index.module.scss";

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
      <StepHeader
        step={3}
        title="Pin the site location"
        description="Confirm coordinates and describe the affected zone in the model."
      />

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
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            width="16"
            height="16"
          >
            <circle cx="10" cy="10" r="7" />
            <line x1="10" y1="3" x2="10" y2="7" />
            <line x1="10" y1="13" x2="10" y2="17" />
            <line x1="3" y1="10" x2="7" y2="10" />
            <line x1="13" y1="10" x2="17" y2="10" />
          </svg>
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
