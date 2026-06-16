"use client";

import { useCallback } from "react";
import { Modal } from "@/common/components/ui/Modal";
import { Button } from "@/common/components/ui/Button";
import { useToastStore } from "@/common/store/toastStore";
import { IncidentCreationStep } from "../../types/incidentCreation";
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

  const handleSubmit = useCallback(async () => {
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
            <Button variant="primary" onClick={nextStep}>
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
