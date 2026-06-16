"use client";

import { Input } from "@/common/components/ui/Input";
import { Select } from "@/common/components/ui/Select";
import { cn } from "@/common/utils/cn";
import {
  CATEGORY_OPTIONS,
  PRIORITY_OPTIONS,
} from "../../constants/incidentCreationOptions";
import { useIncidentCreationStore } from "../../store/useIncidentCreationStore";
import { IncidentCategory } from "../../types/incidentCreation";
import { StepHeader } from "../IncidentStepHeader";
import styles from "./index.module.scss";

export function IncidentBasicInfoStep() {
  const formData = useIncidentCreationStore((state) => state.formData);
  const updateField = useIncidentCreationStore((state) => state.updateField);

  return (
    <section className={styles.step}>
      <StepHeader
        step={1}
        title="Define the incident signal"
        description="Capture the operational context before assigning field teams."
      />

      <div className={styles.grid}>
        <label className={styles.field}>
          <span>Title</span>
          <Input
            value={formData.title}
            placeholder="e.g. Clash in HVAC main duct"
            onChange={(event) => updateField("title", event.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span>Target date</span>
          <Input
            type="date"
            value={formData.dueDate}
            onChange={(event) => updateField("dueDate", event.target.value)}
          />
        </label>
      </div>

      <label className={styles.field}>
        <span>Description</span>
        <textarea
          className={styles.textarea}
          value={formData.description}
          placeholder="Describe the finding, affected model element, or site evidence."
          onChange={(event) => updateField("description", event.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span>Category</span>
        <Select
          value={formData.category}
          options={[...CATEGORY_OPTIONS]}
          onChange={(event) => {
            updateField("category", event.target.value as IncidentCategory);
          }}
        />
      </label>

      <div className={styles.priorityGrid}>
        {PRIORITY_OPTIONS.map((priority) => (
          <button
            key={priority.value}
            type="button"
            className={cn(
              styles.priority,
              styles[priority.tone],
              formData.priority === priority.value && styles.selected,
            )}
            onClick={() => updateField("priority", priority.value)}
          >
            <span className={styles.dot} />
            {priority.label}
          </button>
        ))}
      </div>
    </section>
  );
}
