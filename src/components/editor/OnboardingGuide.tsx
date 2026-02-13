"use client";

import React, { useState, useEffect } from "react";

const STEPS = [
  {
    target: "component-panel",
    title: "컴포넌트 추가",
    description: "왼쪽에서 컴포넌트를 클릭해서 추가하세요",
    position: "right" as const,
    highlight: ".md\\:w-64",
  },
  {
    target: "canvas",
    title: "컴포넌트 편집",
    description: "캔버스에서 컴포넌트를 클릭하면 편집할 수 있어요",
    position: "center" as const,
    highlight: ".flex-1.overflow-y-auto",
  },
  {
    target: "export",
    title: "내보내기",
    description: "완성되면 내보내기를 눌러보세요",
    position: "left" as const,
    highlight: "[class*='bg-\\[\\#3182F6\\]']",
  },
];

export function OnboardingGuide() {
  const [currentStep, setCurrentStep] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const completed = localStorage.getItem("onboarding_completed");
    if (!completed) {
      // Small delay so editor renders first
      const timer = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem("onboarding_completed", "true");
    setShow(false);
  };

  if (!show) return null;

  const step = STEPS[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-[100]" onClick={handleComplete} />

      {/* Tooltip */}
      <div
        className={`fixed z-[101] bg-white rounded-2xl shadow-2xl p-5 w-80 animate-fade-in ${
          currentStep === 0
            ? "left-72 top-1/3"
            : currentStep === 1
            ? "left-1/2 top-1/3 -translate-x-1/2"
            : "right-4 top-20"
        }`}
      >
        {/* Arrow indicator */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-7 h-7 rounded-full bg-[#3182F6] text-white flex items-center justify-center text-sm font-bold">
            {currentStep + 1}
          </span>
          <span className="text-sm font-bold text-gray-900">{step.title}</span>
          <span className="ml-auto text-xs text-gray-400">
            {currentStep + 1}/{STEPS.length}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4">{step.description}</p>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 mb-4">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === currentStep
                  ? "w-6 bg-[#3182F6]"
                  : i < currentStep
                  ? "w-1.5 bg-[#3182F6]/40"
                  : "w-1.5 bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleComplete}
            className="text-sm text-gray-400 hover:text-gray-600 transition"
          >
            건너뛰기
          </button>
          <button
            onClick={handleNext}
            className="px-5 py-2 bg-[#3182F6] text-white rounded-xl text-sm font-medium hover:bg-[#1B64DA] transition"
          >
            {currentStep < STEPS.length - 1 ? "다음" : "시작하기!"}
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.25s ease-out; }
      `}</style>
    </>
  );
}
