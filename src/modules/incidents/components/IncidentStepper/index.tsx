"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/common/utils/cn";
import { INCIDENT_STEPS } from "../../constants/incidentCreationOptions";
import { useIncidentCreationStore } from "../../store/useIncidentCreationStore";
import styles from "./index.module.scss";

export function IncidentStepper() {
  const t = useTranslations();
  const currentStep = useIncidentCreationStore((state) => state.currentStep);
  const goToStep = useIncidentCreationStore((state) => state.goToStep);

  return (
    <div
      className={styles.stepper}
      aria-label={t("incidents.creationModal.steps.info")}
    >
      {INCIDENT_STEPS.map(({ step, label }, index) => {
        const isActive = step === currentStep;
        const isComplete = step < currentStep;
        const canJump = step <= currentStep;

        return (
          <div className={styles.item} key={step}>
            {index > 0 && (
              <span
                className={cn(styles.line, isComplete && styles.lineDone)}
              />
            )}
            <button
              type="button"
              className={cn(
                styles.node,
                isActive && styles.active,
                isComplete && styles.complete,
              )}
              disabled={!canJump}
              onClick={() => goToStep(step)}
              aria-current={isActive ? "step" : undefined}
            >
              {step}
            </button>
            <span className={cn(styles.label, isActive && styles.labelActive)}>
              {t(label)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
