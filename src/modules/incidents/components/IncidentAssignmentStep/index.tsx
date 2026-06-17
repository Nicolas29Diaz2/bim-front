"use client";

import { MultiSelect } from "@/common/components/ui/MultiSelect";
import { FormField } from "@/common/components/ui/FormField";
import {
  MOCK_INCIDENT_USERS,
  TAG_OPTIONS,
} from "../../constants/incidentCreationOptions";
import { useIncidentCreationStore } from "../../store/useIncidentCreationStore";
import { StepHeader } from "../IncidentStepHeader";
import styles from "./index.module.scss";

const userOptions = MOCK_INCIDENT_USERS.map((user) => ({
  value: user.id,
  label: user.name,
}));

const labelOptions = TAG_OPTIONS.map((tag) => ({
  value: tag.id,
  label: tag.name,
  color: tag.color,
}));

export function IncidentAssignmentStep() {
  const formData = useIncidentCreationStore((state) => state.formData);
  const updateField = useIncidentCreationStore((state) => state.updateField);

  return (
    <section className={styles.step}>
      <StepHeader
        step={2}
        title="Assign people and labels"
        description="Choose the responsible users, observers, and labels for the incident."
      />

      <div className={styles.fields}>
        <FormField label="Assigned to">
          <MultiSelect
            options={userOptions}
            value={formData.assignees.map((user) => user.id)}
            onChange={(ids) => {
              updateField(
                "assignees",
                MOCK_INCIDENT_USERS.filter((user) => ids.includes(user.id)),
              );
            }}
            placeholder="Search and select assigned users..."
          />
        </FormField>

        <FormField label="Observers">
          <MultiSelect
            options={userOptions}
            value={formData.observers.map((user) => user.id)}
            onChange={(ids) => {
              updateField(
                "observers",
                MOCK_INCIDENT_USERS.filter((user) => ids.includes(user.id)),
              );
            }}
            placeholder="Search and select observers..."
          />
        </FormField>

        <FormField label="Labels">
          <MultiSelect
            options={labelOptions}
            value={formData.tags.map((tag) => tag.id)}
            onChange={(ids) => {
              updateField(
                "tags",
                TAG_OPTIONS.filter((tag) => ids.includes(tag.id)),
              );
            }}
            placeholder="Select labels..."
          />
        </FormField>
      </div>
    </section>
  );
}
