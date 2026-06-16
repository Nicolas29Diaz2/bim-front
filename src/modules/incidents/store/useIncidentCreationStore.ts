import { create } from "zustand";
import {
  IncidentCategory,
  IncidentCreationStep,
  IncidentPriority,
  type IncidentAttachmentDraft,
  type IncidentCoordinates,
  type IncidentCreationFormData,
} from "../types/incidentCreation";
import type { Incident } from "../types/incidents";

type OnCreatedCallback = (incident: Incident) => void;

interface IncidentCreationStore {
  currentStep: IncidentCreationStep;
  formData: IncidentCreationFormData;
  isCrosshairMode: boolean;
  isModalOpen: boolean;
  isSubmitting: boolean;
  _onCreated: OnCreatedCallback | null;
  addAttachments: (files: File[]) => void;
  captureMapPoint: (coordinates: IncidentCoordinates) => void;
  closeModal: () => void;
  goToStep: (step: IncidentCreationStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  removeAttachment: (id: string) => void;
  registerOnCreated: (callback: OnCreatedCallback) => void;
  resetFlow: () => void;
  startIncidentSelection: () => void;
  startRepositionPin: () => void;
  setSubmitting: (isSubmitting: boolean) => void;
  updateField: <K extends keyof IncidentCreationFormData>(
    key: K,
    value: IncidentCreationFormData[K],
  ) => void;
}

const initialFormData: IncidentCreationFormData = {
  title: "",
  description: "",
  dueDate: "",
  category: IncidentCategory.Coordination,
  priority: IncidentPriority.Medium,
  assignees: [],
  observers: [],
  tags: [],
  coordinates: null,
  building: "",
  level: "",
  sectorDescription: "",
  attachments: [],
};

function toAttachmentDraft(file: File): IncidentAttachmentDraft {
  return {
    id: crypto.randomUUID(),
    name: file.name,
    type: file.type,
    size: file.size,
    file,
  };
}

export const useIncidentCreationStore = create<IncidentCreationStore>(
  (set) => ({
    currentStep: IncidentCreationStep.BasicInfo,
    formData: initialFormData,
    isCrosshairMode: false,
    isModalOpen: false,
    isSubmitting: false,
    _onCreated: null,
    addAttachments: (files) =>
      set((state) => ({
        formData: {
          ...state.formData,
          attachments: [
            ...state.formData.attachments,
            ...files.map(toAttachmentDraft),
          ],
        },
      })),
    captureMapPoint: (coordinates) =>
      set((state) => ({
        formData: { ...state.formData, coordinates },
        isCrosshairMode: false,
        isModalOpen: true,
      })),
    closeModal: () => set({ isModalOpen: false }),
    goToStep: (step) => set({ currentStep: step }),
    nextStep: () =>
      set((state) => ({
        currentStep: Math.min(
          state.currentStep + 1,
          IncidentCreationStep.Attachments,
        ),
      })),
    previousStep: () =>
      set((state) => ({
        currentStep: Math.max(
          state.currentStep - 1,
          IncidentCreationStep.BasicInfo,
        ),
      })),
    removeAttachment: (id) =>
      set((state) => ({
        formData: {
          ...state.formData,
          attachments: state.formData.attachments.filter(
            (item) => item.id !== id,
          ),
        },
      })),
    resetFlow: () =>
      set({
        currentStep: IncidentCreationStep.BasicInfo,
        formData: initialFormData,
        isCrosshairMode: false,
        isModalOpen: false,
        isSubmitting: false,
      }),
    startIncidentSelection: () =>
      set({
        currentStep: IncidentCreationStep.BasicInfo,
        formData: initialFormData,
        isCrosshairMode: true,
        isModalOpen: false,
      }),
    startRepositionPin: () =>
      set({ isCrosshairMode: true, isModalOpen: false }),
    registerOnCreated: (callback) => set({ _onCreated: callback }),
    setSubmitting: (isSubmitting) => set({ isSubmitting }),
    updateField: (key, value) =>
      set((state) => ({
        formData: { ...state.formData, [key]: value },
      })),
  }),
);
