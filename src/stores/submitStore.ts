import { create } from "zustand";
import type { AppInfo, ValidationResult } from "@/types/submit";

export interface SubmitState {
  currentStep: number; // 1: 정보입력, 2: 검증결과, 3: 다운로드, 4: 가이드
  appInfo: AppInfo;
  validationResult: ValidationResult | null;
  completedSteps: number[];
  setAppInfo: (info: Partial<AppInfo>) => void;
  setValidationResult: (result: ValidationResult | null) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  toggleStep: (step: number) => void;
  resetAll: () => void;
}

const defaultAppInfo: AppInfo = {
  name: '',
  englishName: '',
  appName: '',
  subtitle: '',
  category: '',
  description: '',
  keywords: [],
  email: '',
  ageRating: '전체',
  logo: null,
  privacyPolicyUrl: '',
};

export const useSubmitStore = create<SubmitState>((set) => ({
  currentStep: 1,
  appInfo: { ...defaultAppInfo },
  validationResult: null,
  completedSteps: [],

  setAppInfo: (info) =>
    set((state) => ({
      appInfo: { ...state.appInfo, ...info },
    })),

  setValidationResult: (result) =>
    set({ validationResult: result }),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 4),
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),

  setStep: (step) =>
    set({ currentStep: Math.max(1, Math.min(step, 4)) }),

  toggleStep: (step) =>
    set((state) => ({
      completedSteps: state.completedSteps.includes(step)
        ? state.completedSteps.filter((s) => s !== step)
        : [...state.completedSteps, step],
    })),

  resetAll: () =>
    set({
      currentStep: 1,
      appInfo: { ...defaultAppInfo },
      validationResult: null,
      completedSteps: [],
    }),
}));
