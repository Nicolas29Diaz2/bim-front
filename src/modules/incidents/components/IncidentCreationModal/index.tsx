"use client";

import { useCallback, useEffect } from "react";
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

const basicInfoSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters long"),
  dueDate: z.string().trim().min(1, "Target date is required"),
  description: z.string().trim(),
  category: z.enum(IncidentCategory),
  priority: z.enum(IncidentPriority),
});

const environmentSchema = z.object({
  assignees: z.array(z.unknown()).min(1, "At least one assignee is required"),
});

const locationSchema = z.object({
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .nullable()
    .refine((val) => val !== null, "Site location pin is required"),
  building: z.string().trim().min(1, "Building is required"),
  level: z.string().trim().min(1, "Level is required"),
});

function validateStep(
  step: IncidentCreationStep,
  data: IncidentCreationFormData,
): { success: true } | { success: false; error: string } {
  try {
    if (step === IncidentCreationStep.BasicInfo) {
      basicInfoSchema.parse(data);
    } else if (step === IncidentCreationStep.Environment) {
      environmentSchema.parse(data);
    } else if (step === IncidentCreationStep.Location) {
      locationSchema.parse(data);
    }
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0].message };
    }
    return { success: false, error: "Validation failed" };
  }
}

export function IncidentCreationModal() {
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
    const validation = validateStep(currentStep, formData);
    if (!validation.success) {
      showError(validation.error);
      return;
    }
    nextStep();
  }, [currentStep, formData, nextStep, showError]);

  const handleSubmit = useCallback(async () => {
    // Validate all steps before submitting
    const step1 = validateStep(IncidentCreationStep.BasicInfo, formData);
    if (!step1.success) {
      showError(`Step 1: ${step1.error}`);
      return;
    }
    const step2 = validateStep(IncidentCreationStep.Environment, formData);
    if (!step2.success) {
      showError(`Step 2: ${step2.error}`);
      return;
    }
    const step3 = validateStep(IncidentCreationStep.Location, formData);
    if (!step3.success) {
      showError(`Step 3: ${step3.error}`);
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
        showToast("Incident created successfully", "success");
        resetFlow();
      } else {
        showError(result.error.message);
      }

      console.log(formData);
    } finally {
      setSubmitting(false);
    }
  }, [formData, onCreated, resetFlow, setSubmitting, showError, showToast]);

  function handleClose() {
    resetFlow();
  }

  return (
    <Modal
      open={isModalOpen}
      onClose={handleClose}
      size="lg"
      title="Create Incident"
      footer={
        <div className={styles.footer}>
          {currentStep > IncidentCreationStep.BasicInfo && (
            <Button variant="secondary" onClick={previousStep}>
              Back
            </Button>
          )}
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          {isLastStep ? (
            <Button
              variant="primary"
              loading={isSubmitting}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          ) : (
            <Button variant="primary" onClick={handleNext}>
              Next
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
