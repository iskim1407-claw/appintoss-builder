"use client";

import React, { useState, useEffect } from "react";
import { MousePointerClick, Layers, ArrowRight, Sparkles, X } from "lucide-react";

export function OnboardingGuide() {
  const [show, setShow] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const completed = localStorage.getItem("onboarding_completed");
    if (!completed) {
      const timer = setTimeout(() => setShow(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("onboarding_completed", "true");
    }
    setShow(false);
  };

  const handleStart = () => {
    localStorage.setItem("onboarding_completed", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] animate-onboard-overlay" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4" onClick={handleClose}>
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-[420px] overflow-hidden animate-onboard-modal"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header illustration */}
          <div className="relative bg-gradient-to-br from-[#3182F6] to-[#6C5CE7] p-8 pb-12 text-white text-center overflow-hidden">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
            >
              <X size={16} />
            </button>

            {/* Floating decorations */}
            <div className="absolute top-4 left-6 w-3 h-3 rounded-full bg-white/20 animate-float-slow" />
            <div className="absolute top-12 right-12 w-2 h-2 rounded-full bg-white/30 animate-float-delayed" />
            <div className="absolute bottom-8 left-10 w-4 h-4 rounded-full bg-white/10 animate-float-slow" />

            {/* Drag illustration */}
            <div className="relative inline-flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Layers size={28} className="text-white" />
              </div>
              <div className="mx-3 flex items-center gap-0.5 animate-arrow-bounce">
                <ArrowRight size={20} className="text-white/80" />
                <ArrowRight size={20} className="text-white/60" />
                <ArrowRight size={20} className="text-white/40" />
              </div>
              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-white/40 flex items-center justify-center">
                <MousePointerClick size={24} className="text-white/60 animate-cursor-click" />
              </div>
            </div>

            <h2 className="text-xl font-bold mb-1.5">미니앱 빌더에 오신 걸 환영해요!</h2>
            <p className="text-white/80 text-sm">코딩 없이 토스 미니앱을 만들어보세요</p>
          </div>

          {/* Steps */}
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-[#3182F6]">1</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">컴포넌트를 드래그하거나 클릭</p>
                <p className="text-xs text-gray-500 mt-0.5">왼쪽 패널에서 원하는 컴포넌트를 캔버스에 추가하세요</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-purple-500">2</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">속성을 커스터마이즈</p>
                <p className="text-xs text-gray-500 mt-0.5">오른쪽 설정 패널에서 텍스트, 색상 등을 변경하세요</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-green-500">3</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">내보내기 & 제출</p>
                <p className="text-xs text-gray-500 mt-0.5">완성되면 SDK로 내보내서 미니앱 콘솔에 제출하세요</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 space-y-3">
            <button
              onClick={handleStart}
              className="w-full py-3.5 bg-[#3182F6] text-white rounded-2xl font-semibold text-sm hover:bg-[#1B64DA] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200/40"
            >
              <Sparkles size={16} />
              시작하기
            </button>
            <label className="flex items-center justify-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#3182F6] focus:ring-[#3182F6]/20"
              />
              <span className="text-xs text-gray-400">다시 보지 않기</span>
            </label>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes onboard-overlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-onboard-overlay { animation: onboard-overlay 0.2s ease-out; }

        @keyframes onboard-modal {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-onboard-modal { animation: onboard-modal 0.3s ease-out; }

        @keyframes arrow-bounce {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(6px); }
        }
        .animate-arrow-bounce { animation: arrow-bounce 1.5s ease-in-out infinite; }

        @keyframes cursor-click {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        .animate-cursor-click { animation: cursor-click 2s ease-in-out infinite; }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-float-slow { animation: float-slow 3s ease-in-out infinite; }
        .animate-float-delayed { animation: float-slow 3s ease-in-out 1s infinite; }
      `}</style>
    </>
  );
}
