"use client";

import React, { useState, useMemo } from "react";
import { useEditor } from "@craftjs/core";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Download,
  ChevronRight,
  Sparkles,
  FileCheck,
  Image as ImageIcon,
  Type,
  Layers,
  Navigation,
  Smartphone,
} from "lucide-react";

interface CheckItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  check: (nodes: Record<string, NodeData>) => boolean;
}

interface NodeData {
  type: { resolvedName: string };
  props: Record<string, unknown>;
  nodes?: string[];
}

const CHECKS: CheckItem[] = [
  {
    id: "has_navigation",
    label: "네비게이션 바",
    description: "앱 상단에 네비게이션이 있어야 합니다",
    icon: <Navigation size={16} />,
    check: (nodes) =>
      Object.values(nodes).some(
        (n) => n.type?.resolvedName === "NavigationComponent"
      ),
  },
  {
    id: "has_content",
    label: "콘텐츠 (3개 이상)",
    description: "최소 3개 이상의 컴포넌트가 필요합니다",
    icon: <Layers size={16} />,
    check: (nodes) => {
      const root = nodes["ROOT"];
      return (root?.nodes?.length || 0) >= 3;
    },
  },
  {
    id: "has_text",
    label: "텍스트 콘텐츠",
    description: "텍스트 또는 헤더 컴포넌트가 있어야 합니다",
    icon: <Type size={16} />,
    check: (nodes) =>
      Object.values(nodes).some(
        (n) =>
          n.type?.resolvedName === "TextComponent" ||
          n.type?.resolvedName === "HeaderComponent"
      ),
  },
  {
    id: "has_interactive",
    label: "인터랙티브 요소",
    description: "버튼, 입력 등 사용자 상호작용 요소가 필요합니다",
    icon: <Smartphone size={16} />,
    check: (nodes) =>
      Object.values(nodes).some((n) =>
        [
          "ButtonComponent",
          "InputComponent",
          "TextFieldComponent",
          "CheckboxComponent",
          "SwitchComponent",
          "BottomCTAComponent",
        ].includes(n.type?.resolvedName)
      ),
  },
  {
    id: "no_default_text",
    label: "기본 텍스트 변경",
    description: "기본 텍스트를 실제 콘텐츠로 변경해주세요",
    icon: <FileCheck size={16} />,
    check: (nodes) => {
      const defaults = [
        "환영합니다!",
        "컴포넌트를 드래그하거나 클릭해서 추가하세요.",
      ];
      return !Object.values(nodes).some(
        (n) =>
          (n.type?.resolvedName === "TextComponent" ||
            n.type?.resolvedName === "HeaderComponent") &&
          defaults.includes(String(n.props?.text || ""))
      );
    },
  },
];

interface ExportReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportReviewModal({ isOpen, onClose }: ExportReviewModalProps) {
  const { query } = useEditor();
  const [step, setStep] = useState<"check" | "guide">("check");

  const nodes = useMemo(() => {
    try {
      return JSON.parse(query.serialize()) as Record<string, NodeData>;
    } catch {
      return {} as Record<string, NodeData>;
    }
  }, [query]);

  const results = useMemo(
    () =>
      CHECKS.map((check) => ({
        ...check,
        passed: check.check(nodes),
      })),
    [nodes]
  );

  const allPassed = results.every((r) => r.passed);
  const passCount = results.filter((r) => r.passed).length;

  const handleDownload = () => {
    try {
      const json = query.serialize();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `miniapp-${Date.now()}.ait`;
      a.click();
      URL.revokeObjectURL(url);
      setStep("guide");
    } catch (e) {
      console.error("Export failed:", e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#3182F6]" />
            <h2 className="font-bold text-lg">
              {step === "check" ? "AI 심사 체크" : "제출 가이드"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {step === "check" ? (
          <>
            {/* Score */}
            <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg ${
                    allPassed
                      ? "bg-gradient-to-br from-green-400 to-emerald-500"
                      : "bg-gradient-to-br from-amber-400 to-orange-500"
                  }`}
                >
                  {passCount}/{CHECKS.length}
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    {allPassed
                      ? "🎉 심사 준비 완료!"
                      : "⚠️ 일부 항목을 확인해주세요"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {allPassed
                      ? "모든 필수 항목을 충족했습니다"
                      : `${CHECKS.length - passCount}개 항목이 부족합니다`}
                  </p>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="px-5 py-3 space-y-2 max-h-[300px] overflow-y-auto">
              {results.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 p-3 rounded-xl ${
                    item.passed ? "bg-green-50/50" : "bg-red-50/50"
                  }`}
                >
                  <div
                    className={`mt-0.5 ${
                      item.passed ? "text-green-500" : "text-red-400"
                    }`}
                  >
                    {item.passed ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <AlertCircle size={18} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">{item.icon}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="px-5 py-4 border-t border-gray-100 space-y-2">
              <button
                onClick={handleDownload}
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  allPassed
                    ? "bg-[#3182F6] text-white hover:bg-[#1B64DA] shadow-sm shadow-blue-200/40"
                    : "bg-amber-500 text-white hover:bg-amber-600"
                }`}
              >
                <Download size={16} />
                {allPassed
                  ? ".ait 파일 다운로드"
                  : "그래도 다운로드하기"}
              </button>
              {!allPassed && (
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl font-medium text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  돌아가서 수정하기
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Step-by-step Guide */}
            <div className="px-5 py-4 space-y-4 max-h-[400px] overflow-y-auto">
              <div className="bg-green-50 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 size={24} className="text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-bold text-green-800 text-sm">다운로드 완료!</p>
                  <p className="text-xs text-green-600">.ait 파일이 저장되었습니다</p>
                </div>
              </div>

              {[
                {
                  step: 1,
                  title: "토스 개발자센터 접속",
                  desc: "developers.toss.im에 로그인하세요",
                },
                {
                  step: 2,
                  title: "미니앱 등록",
                  desc: "새 미니앱을 만들고 기본 정보를 입력하세요",
                },
                {
                  step: 3,
                  title: ".ait 파일 업로드",
                  desc: "다운로드한 .ait 파일을 업로드하세요",
                },
                {
                  step: 4,
                  title: "아이콘 & 썸네일 등록",
                  desc: "앱 아이콘(1024x1024)과 스크린샷을 추가하세요",
                },
                {
                  step: 5,
                  title: "심사 제출",
                  desc: "모든 정보를 확인하고 심사를 요청하세요",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#3182F6] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}

              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon size={16} className="text-[#3182F6]" />
                  <span className="text-sm font-bold text-[#3182F6]">💡 팁</span>
                </div>
                <p className="text-xs text-gray-600">
                  아이콘과 썸네일은 AI 도구(Midjourney, DALL-E 등)로 빠르게 만들 수 있어요.
                  앱의 핵심 기능을 잘 표현하는 이미지를 사용하세요.
                </p>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-100">
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-[#3182F6] text-white hover:bg-[#1B64DA] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                완료
                <ChevronRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
