"use client";

import { useTranslations } from "next-intl";
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
  const t = useTranslations();
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
            <span>{t("incidents.creationModal.location.latitude")}</span>
            <span className={styles.coordValue}>
              {hasCoords ? formatCoord(formData.coordinates!.lat) : "\u2014"}
            </span>
          </div>
          <div className={styles.coordField}>
            <span>{t("incidents.creationModal.location.longitude")}</span>
            <span className={styles.coordValue}>
              {hasCoords ? formatCoord(formData.coordinates!.lng) : "\u2014"}
            </span>
          </div>
        </div>
        <Button variant="primary" onClick={startRepositionPin}>
          <Plus size={16} />
          {t("incidents.creationModal.location.repositionPin")}
        </Button>
      </div>

      <div className={styles.formGrid}>
        <FormField label={t("incidents.creationModal.location.building")}>
          <CustomSelect
            value={formData.building}
            placeholder={t(
              "incidents.creationModal.location.buildingPlaceholder",
            )}
            options={buildingOptions}
            onChange={(val) => updateField("building", val)}
          />
        </FormField>
        <FormField label={t("incidents.creationModal.location.level")}>
          <CustomSelect
            value={formData.level}
            placeholder={t("incidents.creationModal.location.levelPlaceholder")}
            options={levelOptions}
            onChange={(val) => updateField("level", val)}
          />
        </FormField>
      </div>

      <FormField label={t("incidents.creationModal.location.sector")}>
        <Input
          value={formData.sectorDescription}
          placeholder={t("incidents.creationModal.location.sectorPlaceholder")}
          onChange={(e) => updateField("sectorDescription", e.target.value)}
        />
      </FormField>

      {!hasCoords && (
        <p className={styles.hint}>
          {t("incidents.creationModal.location.coordHint")}
        </p>
      )}
    </section>
  );
}
