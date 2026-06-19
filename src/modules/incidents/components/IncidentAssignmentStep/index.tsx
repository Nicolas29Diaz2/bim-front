"use client";

import { useTranslations } from "next-intl";
import { MultiSelect } from "@/common/components/ui/MultiSelect";
import { FormField } from "@/common/components/ui/FormField";
import {
  MOCK_INCIDENT_USERS,
  TAG_OPTIONS,
} from "../../constants/incidentCreationOptions";
import { useIncidentCreationStore } from "../../store/useIncidentCreationStore";
import styles from "./index.module.scss";

const userOptions = MOCK_INCIDENT_USERS.map((user) => ({
  value: user.id,
  label: user.name,
}));

const labelOptions = TAG_OPTIONS.map((tag) => ({
  value: tag.id,
  label: tag.name,
}));

export function IncidentAssignmentStep() {
  const t = useTranslations();
  const formData = useIncidentCreationStore((state) => state.formData);
  const updateField = useIncidentCreationStore((state) => state.updateField);

  return (
    <section className={styles.step}>
      <div className={styles.fields}>
        <FormField label={t("incidents.creationModal.assignment.assignedTo")}>
          <MultiSelect
            options={userOptions}
            value={formData.assignees.map((user) => user.id)}
            onChange={(ids) => {
              updateField(
                "assignees",
                MOCK_INCIDENT_USERS.filter((user) => ids.includes(user.id)),
              );
            }}
            placeholder={t(
              "incidents.creationModal.assignment.assignedPlaceholder",
            )}
          />
        </FormField>

        <FormField label={t("incidents.creationModal.assignment.observers")}>
          <MultiSelect
            options={userOptions}
            value={formData.observers.map((user) => user.id)}
            onChange={(ids) => {
              updateField(
                "observers",
                MOCK_INCIDENT_USERS.filter((user) => ids.includes(user.id)),
              );
            }}
            placeholder={t(
              "incidents.creationModal.assignment.observersPlaceholder",
            )}
          />
        </FormField>

        <FormField label={t("incidents.creationModal.assignment.labels")}>
          <MultiSelect
            options={labelOptions}
            value={formData.tags.map((tag) => tag.id)}
            onChange={(ids) => {
              updateField(
                "tags",
                TAG_OPTIONS.filter((tag) => ids.includes(tag.id)),
              );
            }}
            placeholder={t(
              "incidents.creationModal.assignment.labelsPlaceholder",
            )}
          />
        </FormField>
      </div>
    </section>
  );
}
