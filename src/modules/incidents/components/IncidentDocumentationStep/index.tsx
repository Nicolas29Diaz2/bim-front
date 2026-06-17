"use client";

import { useCallback } from "react";
import { useIncidentCreationStore } from "../../store/useIncidentCreationStore";
import styles from "./index.module.scss";

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const TYPE_LABELS: Record<string, string> = {
  "application/pdf": "PDF",
  "image/jpeg": "JPG",
  "image/png": "PNG",
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}

export function IncidentDocumentationStep() {
  const formData = useIncidentCreationStore((state) => state.formData);
  const addAttachments = useIncidentCreationStore(
    (state) => state.addAttachments,
  );
  const removeAttachment = useIncidentCreationStore(
    (state) => state.removeAttachment,
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        ACCEPTED_TYPES.includes(f.type),
      );
      if (files.length > 0) addAttachments(files);
    },
    [addAttachments],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []).filter((f) =>
        ACCEPTED_TYPES.includes(f.type),
      );
      if (files.length > 0) addAttachments(files);
    },
    [addAttachments],
  );

  return (
    <section className={styles.step}>
      <div
        className={styles.dropzone}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className={styles.dropzoneIcon}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            width="32"
            height="32"
          >
            <path
              d="M12 16V4m0 0l-4 4m4-4l4 4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20 16.7c1.3-1.1 2-2.6 2-4.2C22 8.5 19.5 6 16.5 6c-.6 0-1.1.1-1.6.2C13.9 3.2 11.1 1 8 1 4.1 1 1 4.1 1 8c0 1.6.7 3.1 2 4.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className={styles.dropText}>Drop files here or click to browse</p>
        <p className={styles.dropHint}>PDF, JPG, PNG supported</p>
        <input
          type="file"
          className={styles.hiddenInput}
          accept=".pdf,.jpg,.jpeg,.png"
          multiple
          onChange={handleFileInput}
        />
      </div>

      {formData.attachments.length > 0 && (
        <div className={styles.fileList}>
          {formData.attachments.map((file) => (
            <div key={file.id} className={styles.fileRow}>
              <div className={styles.fileIcon}>
                {TYPE_LABELS[file.type] ?? "File"}
              </div>
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileSize}>{formatSize(file.size)}</span>
              </div>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeAttachment(file.id)}
                aria-label={`Remove ${file.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {formData.attachments.length === 0 && (
        <p className={styles.hint}>
          No attachments required — you can submit without files.
        </p>
      )}
    </section>
  );
}
