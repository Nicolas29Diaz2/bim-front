"use client";

import { Input } from "@/common/components/ui/Input";
import { CustomSelect } from "@/common/components/ui/CustomSelect";
import { DatePicker } from "@/common/components/ui/DatePicker";
import { FormField } from "@/common/components/ui/FormField";
import { IconButton } from "@/common/components/ui/IconButton";
import { cn } from "@/common/utils/cn";
import { Settings } from "lucide-react";
import {
  CATEGORY_OPTIONS,
  PRIORITY_OPTIONS,
} from "../../constants/incidentCreationOptions";
import { useIncidentCreationStore } from "../../store/useIncidentCreationStore";
import styles from "./index.module.scss";

function toDueDateValue(dateStr: string): Date | null {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function IncidentBasicInfoStep() {
  const formData = useIncidentCreationStore((state) => state.formData);
  const updateField = useIncidentCreationStore((state) => state.updateField);

  return (
    <section className={styles.step}>
      <div className={styles.grid}>
        <FormField label="Title">
          <Input
            value={formData.title}
            placeholder="e.g. Clash in HVAC main duct"
            onChange={(event) => updateField("title", event.target.value)}
          />
        </FormField>
        <FormField label="Target date">
          <DatePicker
            value={toDueDateValue(formData.dueDate)}
            onChange={(date) => {
              if (date) {
                const y = date.getFullYear();
                const m = String(date.getMonth() + 1).padStart(2, "0");
                const d = String(date.getDate()).padStart(2, "0");
                updateField("dueDate", `${y}-${m}-${d}`);
              } else {
                updateField("dueDate", "");
              }
            }}
          />
        </FormField>
      </div>

      <FormField label="Description">
        <textarea
          className={styles.textarea}
          value={formData.description}
          placeholder="Describe the finding, affected model element, or site evidence."
          onChange={(event) => updateField("description", event.target.value)}
        />
      </FormField>

      <div className={styles.categoryContainer}>
        <FormField label="Category" className={styles.field}>
          <CustomSelect
            value={formData.category}
            options={CATEGORY_OPTIONS.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
            onChange={(val) => updateField("category", val)}
          />
        </FormField>
        <IconButton
          icon={<Settings size={16} />}
          variant="primary"
          size="sm"
          aria-label="Category settings"
        />
      </div>

      <FormField label="Priority">
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
      </FormField>
    </section>
  );
}
