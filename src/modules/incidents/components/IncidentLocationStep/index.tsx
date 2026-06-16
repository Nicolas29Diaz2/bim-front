"use client";

import { Input } from "@/common/components/ui/Input";
import { Select } from "@/common/components/ui/Select";
import { Button } from "@/common/components/ui/Button";
import {
  BUILDING_OPTIONS,
  LEVEL_OPTIONS,
} from "../../constants/incidentCreationOptions";
import { useIncidentCreationStore } from "../../store/useIncidentCreationStore";
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

  return (
    <section className={styles.step}>
      <div className={styles.sectionTitle}>
        <span className={styles.badge}>Step 03</span>
        <h3>Pin the site location</h3>
        <p>Confirm coordinates and describe the affected zone in the model.</p>
      </div>

      <div className={styles.coordCard}>
        <div className={styles.coordRow}>
          <div className={styles.coordField}>
            <span>Latitude</span>
            <span className={styles.coordValue}>
              {hasCoords ? formData.coordinates!.lat.toFixed(6) : "—"}
            </span>
          </div>
          <div className={styles.coordField}>
            <span>Longitude</span>
            <span className={styles.coordValue}>
              {hasCoords ? formData.coordinates!.lng.toFixed(6) : "—"}
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
        <label className={styles.field}>
          <span>Building</span>
          <Select
            value={formData.building}
            placeholder="Select building"
            options={buildingOptions}
            onChange={(e) => updateField("building", e.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span>Level</span>
          <Select
            value={formData.level}
            placeholder="Select level"
            options={levelOptions}
            onChange={(e) => updateField("level", e.target.value)}
          />
        </label>
      </div>

      <label className={styles.field}>
        <span>Sector / Description</span>
        <Input
          value={formData.sectorDescription}
          placeholder="e.g. Eje D2, between columns C5-C7"
          onChange={(e) => updateField("sectorDescription", e.target.value)}
        />
      </label>

      {!hasCoords && (
        <p className={styles.hint}>
          Click &quot;Reposition Pin&quot; to open the map and select a
          geographic point.
        </p>
      )}
    </section>
  );
}
