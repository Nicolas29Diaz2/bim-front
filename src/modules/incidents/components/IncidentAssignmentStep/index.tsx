"use client";

import { useState } from "react";
import { Chip } from "@/common/components/ui/Chip";
import { Input } from "@/common/components/ui/Input";
import { cn } from "@/common/utils/cn";
import {
  MOCK_INCIDENT_USERS,
  TAG_OPTIONS,
} from "../../constants/incidentCreationOptions";
import { useIncidentCreationStore } from "../../store/useIncidentCreationStore";
import type { IncidentParticipant } from "../../types/incidentCreation";
import styles from "./index.module.scss";

export function IncidentAssignmentStep() {
  const formData = useIncidentCreationStore((state) => state.formData);
  const updateField = useIncidentCreationStore((state) => state.updateField);
  const [assigneeSearch, setAssigneeSearch] = useState("");

  const available = MOCK_INCIDENT_USERS.filter(
    (u) =>
      !formData.assignees.some((a) => a.id === u.id) &&
      !formData.observers.some((o) => o.id === u.id) &&
      u.name.toLowerCase().includes(assigneeSearch.toLowerCase()),
  );

  function addAssignee(user: IncidentParticipant) {
    updateField("assignees", [...formData.assignees, user]);
  }

  function removeAssignee(id: string) {
    updateField(
      "assignees",
      formData.assignees.filter((a) => a.id !== id),
    );
  }

  function addObserver(user: IncidentParticipant) {
    updateField("observers", [...formData.observers, user]);
  }

  function removeObserver(id: string) {
    updateField(
      "observers",
      formData.observers.filter((o) => o.id !== id),
    );
  }

  function toggleTag(tagId: string) {
    const tag = TAG_OPTIONS.find((t) => t.id === tagId);
    if (!tag) return;
    const exists = formData.tags.some((t) => t.id === tagId);
    updateField(
      "tags",
      exists
        ? formData.tags.filter((t) => t.id !== tagId)
        : [...formData.tags, tag],
    );
  }

  return (
    <section className={styles.step}>
      <div className={styles.sectionTitle}>
        <span className={styles.badge}>Step 02</span>
        <h3>Assign people and context</h3>
        <p>Select the field team and semantic tags for tracking.</p>
      </div>

      <label className={styles.field}>
        <span>Search team members</span>
        <Input
          value={assigneeSearch}
          placeholder="Search by name..."
          onChange={(e) => setAssigneeSearch(e.target.value)}
        />
      </label>

      <div className={styles.columns}>
        <div className={styles.column}>
          <h4>Assigned ({formData.assignees.length})</h4>
          <div className={styles.chipGrid}>
            {formData.assignees.map((user) => (
              <Chip
                key={user.id}
                icon={
                  <img src={user.avatarUrl} alt="" className={styles.avatar} />
                }
                dismissible
                onDismiss={() => removeAssignee(user.id)}
              >
                {user.name}
              </Chip>
            ))}
          </div>
          <div className={styles.userList}>
            {available.map((user) => (
              <button
                key={user.id}
                type="button"
                className={styles.userRow}
                onClick={() => addAssignee(user)}
              >
                <img src={user.avatarUrl} alt="" className={styles.avatar} />
                <span>{user.name}</span>
                <span className={styles.addIcon}>+</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.column}>
          <h4>Observers ({formData.observers.length})</h4>
          <div className={styles.chipGrid}>
            {formData.observers.map((user) => (
              <Chip
                key={user.id}
                variant="outlined"
                icon={
                  <img src={user.avatarUrl} alt="" className={styles.avatar} />
                }
                dismissible
                onDismiss={() => removeObserver(user.id)}
              >
                {user.name}
              </Chip>
            ))}
          </div>
          <div className={styles.userList}>
            {available.map((user) => (
              <button
                key={user.id}
                type="button"
                className={styles.userRow}
                onClick={() => addObserver(user)}
              >
                <img src={user.avatarUrl} alt="" className={styles.avatar} />
                <span>{user.name}</span>
                <span className={styles.addIcon}>+</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.tagsSection}>
        <h4>Tags</h4>
        <div className={styles.tagGrid}>
          {TAG_OPTIONS.map((tag) => (
            <button
              key={tag.id}
              type="button"
              className={cn(
                styles.tag,
                formData.tags.some((t) => t.id === tag.id) &&
                  styles.tagSelected,
              )}
              style={{ ["--tag-color" as string]: tag.color }}
              onClick={() => toggleTag(tag.id)}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
