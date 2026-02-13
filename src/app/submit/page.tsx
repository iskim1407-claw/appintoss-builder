"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { useSubmitStore } from "@/stores/submitStore";
import { validateAppInfo } from "@/lib/validation";
import { AppInfoForm } from "./components/AppInfoForm";
import { ValidationPanel } from "./components/ValidationPanel";
import SubmitGuide from "./components/SubmitGuide";

const STEPS = [
  { num: 1, label: "앱 정보" },
  { num: 2, label: "검증 결과" },
  { num: 3, label: "다운로드" },
  { num: 4, label: "제출 가이드" },
];

function StepWizard({ current, onStepClick }: { current: number; onStepClick: (n: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8">
      {STEPS.map((step, i) => (
        <React.Fragment key={step.num}>
          {i > 0 && <div className={`hidden sm:block w-8 h-0.5 ${current >= step.num ? 'bg-[#3182F6]' : 'bg-gray-200'}`} />}
          <button
            onClick={() => onStepClick(step.num)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition ${
              current === step.num
                ? 'bg-[#3182F6] text-white shadow-md'
                : current > step.num
                ? 'bg-blue-50 text-[#3182F6]'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
              {current > step.num ? '✓' : step.num}
            </span>
            <span className="hidden sm:inline">{step.label}</span>
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}

export default function SubmitPage() {
  const { currentStep, setStep, appInfo, validationResult, setValidationResult, nextStep, prevStep } = useSubmitStore();
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      track("submit_started");
      tracked.current = true;
    }
  }, []);

  // Track step changes
  useEffect(() => {
    if (currentStep === 2 && validationResult) {
      track("submit_validation", { score: validationResult.score });
    }
    if (currentStep === 3) {
      track("submit_download");
    }
  }, [currentStep, validationResult]);

  // 실시간 검증
  useEffect(() => {
    const result = validateAppInfo(appInfo);
    setValidationResult(result);
  }, [appInfo, setValidationResult]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/editor" className="text-sm text-gray-500 hover:text-gray-700 transition flex items-center gap-1">
            ← 에디터로 돌아가기
          </Link>
          <h1 className="text-base font-bold text-gray-900">앱인토스 제출하기</h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <StepWizard current={currentStep} onStepClick={setStep} />

        {/* Step 1: 앱 정보 + 검증 (side by side on desktop) */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <AppInfoForm />
            </div>
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:sticky lg:top-20 lg:self-start">
              <ValidationPanel result={validationResult} />
            </div>
          </div>
        )}

        {/* Step 2: 검증 결과 전체 화면 */}
        {currentStep === 2 && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <ValidationPanel result={validationResult} />
          </div>
        )}

        {/* Step 3: 다운로드 (placeholder) */}
        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="text-5xl mb-4"></div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">제출 패키지 다운로드</h2>
            <p className="text-gray-500 text-sm mb-6">이 단계는 곧 구현됩니다</p>
            <button disabled className="px-8 py-3 bg-gray-200 text-gray-400 rounded-xl font-medium cursor-not-allowed">
              다운로드 (준비중)
            </button>
          </div>
        )}

        {/* Step 4: 제출 가이드 */}
        {currentStep === 4 && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100">
            <SubmitGuide />
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 max-w-2xl mx-auto lg:max-w-none">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← 이전
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === 4}
            className="px-6 py-3 rounded-xl text-sm font-medium bg-[#3182F6] text-white hover:bg-[#1B64DA] transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            다음 →
          </button>
        </div>
      </div>
    </div>
  );
}
