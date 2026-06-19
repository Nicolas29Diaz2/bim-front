"use client";

import { useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { Modal } from "@/common/components/ui/Modal";
import { Button } from "@/common/components/ui/Button";
import { useToastStore } from "@/common/store/toastStore";
import {
  IncidentCategory,
  IncidentCreationStep,
  IncidentPriority,
  type IncidentCreationFormData,
} from "../../types/incidentCreation";
import { useIncidentCreationStore } from "../../store/useIncidentCreationStore";
import { createIncident } from "../../services/createIncident.service";
import { IncidentStepper } from "../IncidentStepper";
import { IncidentBasicInfoStep } from "../IncidentBasicInfoStep";
import { IncidentAssignmentStep } from "../IncidentAssignmentStep";
import { IncidentLocationStep } from "../IncidentLocationStep";
import { IncidentDocumentationStep } from "../IncidentDocumentationStep";
import styles from "./index.module.scss";

const STEP_COMPONENTS: Record<IncidentCreationStep, React.FC> = {
  [IncidentCreationStep.BasicInfo]: IncidentBasicInfoStep,
  [IncidentCreationStep.Environment]: IncidentAssignmentStep,
  [IncidentCreationStep.Location]: IncidentLocationStep,
  [IncidentCreationStep.Attachments]: IncidentDocumentationStep,
};

const basicInfoSchema = (t: (key: string) => string) =>
  z.object({
    title: z
      .string()
      .trim()
      .min(3, t("incidents.creationModal.validation.titleMinLength")),
    dueDate: z
      .string()
      .trim()
      .min(1, t("incidents.creationModal.validation.targetDateRequired")),
    description: z.string().trim(),
    category: z.enum(IncidentCategory),
    priority: z.enum(IncidentPriority),
  });

const environmentSchema = (t: (key: string) => string) =>
  z.object({
    assignees: z
      .array(z.unknown())
      .min(1, t("incidents.creationModal.validation.assigneeRequired")),
  });

const locationSchema = (t: (key: string) => string) =>
  z.object({
    coordinates: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .nullable()
      .refine(
        (val) => val !== null,
        t("incidents.creationModal.validation.coordinatesRequired"),
      ),
    building: z
      .string()
      .trim()
      .min(1, t("incidents.creationModal.validation.buildingRequired")),
    level: z
      .string()
      .trim()
      .min(1, t("incidents.creationModal.validation.levelRequired")),
  });

function validateStep(
  step: IncidentCreationStep,
  data: IncidentCreationFormData,
  t: (key: string) => string,
): { success: true } | { success: false; error: string } {
  try {
    if (step === IncidentCreationStep.BasicInfo) {
      basicInfoSchema(t).parse(data);
    } else if (step === IncidentCreationStep.Environment) {
      environmentSchema(t).parse(data);
    } else if (step === IncidentCreationStep.Location) {
      locationSchema(t).parse(data);
    }
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0].message };
    }
    return {
      success: false,
      error: t("incidents.creationModal.validation.failed"),
    };
  }
}

export function IncidentCreationModal() {
  const t = useTranslations();
  const isModalOpen = useIncidentCreationStore((s) => s.isModalOpen);
  const currentStep = useIncidentCreationStore((s) => s.currentStep);
  const formData = useIncidentCreationStore((s) => s.formData);
  const isSubmitting = useIncidentCreationStore((s) => s.isSubmitting);
  const nextStep = useIncidentCreationStore((s) => s.nextStep);
  const previousStep = useIncidentCreationStore((s) => s.previousStep);
  const resetFlow = useIncidentCreationStore((s) => s.resetFlow);
  const setSubmitting = useIncidentCreationStore((s) => s.setSubmitting);
  const onCreated = useIncidentCreationStore((s) => s._onCreated);
  const showError = useToastStore((s) => s.showError);
  const showToast = useToastStore((s) => s.showToast);

  const isLastStep = currentStep === IncidentCreationStep.Attachments;
  const StepComponent = STEP_COMPONENTS[currentStep];

  const handleNext = useCallback(() => {
    const validation = validateStep(currentStep, formData, t);
    if (!validation.success) {
      showError(validation.error);
      return;
    }
    nextStep();
  }, [currentStep, formData, nextStep, showError, t]);

  const handleSubmit = useCallback(async () => {
    const step1 = validateStep(IncidentCreationStep.BasicInfo, formData, t);
    if (!step1.success) {
      showError(
        t("incidents.creationModal.validation.stepFormat", {
          step: 1,
          error: step1.error,
        }),
      );
      return;
    }
    const step2 = validateStep(IncidentCreationStep.Environment, formData, t);
    if (!step2.success) {
      showError(
        t("incidents.creationModal.validation.stepFormat", {
          step: 2,
          error: step2.error,
        }),
      );
      return;
    }
    const step3 = validateStep(IncidentCreationStep.Location, formData, t);
    if (!step3.success) {
      showError(
        t("incidents.creationModal.validation.stepFormat", {
          step: 3,
          error: step3.error,
        }),
      );
      return;
    }

    setSubmitting(true);
    try {
      const result = await createIncident({
        ...formData,
        projectId: "mock-project-current",
        projectName: "Torre Acqua - Etapa 2",
      });
      if (result.ok) {
        onCreated?.(result.value);
        showToast(t("incidents.creationModal.success"), "success");
        resetFlow();
      } else {
        showError(result.error.message);
      }
    } finally {
      setSubmitting(false);
    }
  }, [formData, onCreated, resetFlow, setSubmitting, showError, showToast, t]);

  function handleClose() {
    resetFlow();
  }

  return (
    <Modal
      open={isModalOpen}
      onClose={handleClose}
      size="lg"
      title={t("incidents.creationModal.title")}
      footer={
        <div className={styles.footer}>
          {currentStep > IncidentCreationStep.BasicInfo && (
            <Button variant="secondary" onClick={previousStep}>
              {t("incidents.creationModal.back")}
            </Button>
          )}
          <Button variant="ghost" onClick={handleClose}>
            {t("incidents.creationModal.cancel")}
          </Button>
          {isLastStep ? (
            <Button
              variant="primary"
              loading={isSubmitting}
              onClick={handleSubmit}
            >
              {t("incidents.creationModal.submit")}
            </Button>
          ) : (
            <Button variant="primary" onClick={handleNext}>
              {t("incidents.creationModal.next")}
            </Button>
          )}
        </div>
      }
    >
      <IncidentStepper />
      <StepComponent />
    </Modal>
  );
}
