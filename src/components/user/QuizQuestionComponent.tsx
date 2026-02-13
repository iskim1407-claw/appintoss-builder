"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";
import { TDS_COLORS, TDS_RADIUS } from "@/lib/tds/tokens";

export interface QuizOption {
  text: string;
  scoreKey: string;
  scoreValue: number;
  nextPageId?: string;
}

export interface QuizQuestionProps {
  questionNumber?: number;
  totalQuestions?: number;
  questionText?: string;
  options?: QuizOption[];
  showProgress?: boolean;
  progressColor?: string;
}

const defaultOptions: QuizOption[] = [
  { text: "혼자만의 시간이 필요해요", scoreKey: "I", scoreValue: 1 },
  { text: "사람들과 함께 있고 싶어요", scoreKey: "E", scoreValue: 1 },
  { text: "상황에 따라 달라요", scoreKey: "A", scoreValue: 1 },
  { text: "잘 모르겠어요", scoreKey: "N", scoreValue: 0 },
];

export const QuizQuestionComponent = ({
  questionNumber = 1,
  totalQuestions = 5,
  questionText = "스트레스를 받으면 어떻게 하시나요?",
  options = defaultOptions,
  showProgress = true,
  progressColor = TDS_COLORS.blue,
}: QuizQuestionProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((s) => ({ selected: s.events.selected }));

  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      <div
        style={{
          backgroundColor: TDS_COLORS.white,
          borderRadius: TDS_RADIUS.xl,
          padding: "24px 20px",
        }}
      >
        {/* Progress Bar */}
        {showProgress && (
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
                fontSize: 14,
                color: TDS_COLORS.gray500,
              }}
            >
              <span>Q{questionNumber}</span>
              <span>{questionNumber} / {totalQuestions}</span>
            </div>
            <div
              style={{
                width: "100%",
                height: 6,
                backgroundColor: TDS_COLORS.gray100,
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  backgroundColor: progressColor,
                  borderRadius: 3,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        )}

        {/* Question */}
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: TDS_COLORS.gray900,
            lineHeight: 1.4,
            marginBottom: 32,
            textAlign: "center",
          }}
        >
          {questionText}
        </h2>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {options.map((option, index) => (
            <button
              key={index}
              style={{
                width: "100%",
                padding: "18px 20px",
                fontSize: 16,
                fontWeight: 500,
                color: TDS_COLORS.gray800,
                backgroundColor: TDS_COLORS.gray50,
                border: `1px solid ${TDS_COLORS.gray200}`,
                borderRadius: TDS_RADIUS.md,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const QuizQuestionSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));
  const options: QuizOption[] = props.options || defaultOptions;

  const updateOption = (index: number, key: keyof QuizOption, value: string | number) => {
    setProp((p: QuizQuestionProps) => {
      const newOptions = [...(p.options || defaultOptions)];
      newOptions[index] = { ...newOptions[index], [key]: value };
      p.options = newOptions;
    });
  };

  const addOption = () => {
    setProp((p: QuizQuestionProps) => {
      const newOptions = [...(p.options || defaultOptions)];
      newOptions.push({ text: "새 선택지", scoreKey: "X", scoreValue: 1 });
      p.options = newOptions;
    });
  };

  const removeOption = (index: number) => {
    setProp((p: QuizQuestionProps) => {
      const newOptions = [...(p.options || defaultOptions)];
      newOptions.splice(index, 1);
      p.options = newOptions;
    });
  };

  return (
    <SettingsPanel title="퀴즈 질문">
      <label className="block text-xs text-gray-500 mb-1">질문 번호</label>
      <input
        type="number"
        min={1}
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.questionNumber || 1}
        onChange={(e) => setProp((p: QuizQuestionProps) => (p.questionNumber = Number(e.target.value)))}
      />

      <label className="block text-xs text-gray-500 mb-1">총 질문 수</label>
      <input
        type="number"
        min={1}
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.totalQuestions || 5}
        onChange={(e) => setProp((p: QuizQuestionProps) => (p.totalQuestions = Number(e.target.value)))}
      />

      <label className="block text-xs text-gray-500 mb-1">질문 텍스트</label>
      <textarea
        className="w-full border rounded-lg p-2 text-sm mb-3 resize-none"
        rows={3}
        value={props.questionText || ""}
        onChange={(e) => setProp((p: QuizQuestionProps) => (p.questionText = e.target.value))}
        placeholder="스트레스를 받으면 어떻게 하시나요?"
      />

      <label className="flex items-center gap-2 text-sm mb-4">
        <input
          type="checkbox"
          checked={props.showProgress !== false}
          onChange={(e) => setProp((p: QuizQuestionProps) => (p.showProgress = e.target.checked))}
        />
        진행바 표시
      </label>

      <div className="border-t border-gray-100 pt-3 mt-1">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs text-gray-500 font-medium">선택지</label>
          <button
            onClick={addOption}
            className="text-xs text-blue-500 hover:text-blue-600"
          >
            + 추가
          </button>
        </div>

        <div className="space-y-3">
          {options.map((opt, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-600">선택지 {idx + 1}</span>
                {options.length > 2 && (
                  <button
                    onClick={() => removeOption(idx)}
                    className="text-xs text-red-400 hover:text-red-500"
                  >
                    삭제
                  </button>
                )}
              </div>

              <input
                className="w-full border rounded p-1.5 text-sm mb-2"
                value={opt.text}
                onChange={(e) => updateOption(idx, "text", e.target.value)}
                placeholder="선택지 텍스트"
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-gray-400">점수 키</label>
                  <input
                    className="w-full border rounded p-1.5 text-xs"
                    value={opt.scoreKey}
                    onChange={(e) => updateOption(idx, "scoreKey", e.target.value)}
                    placeholder="E, I, S, N..."
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400">점수 값</label>
                  <input
                    type="number"
                    className="w-full border rounded p-1.5 text-xs"
                    value={opt.scoreValue}
                    onChange={(e) => updateOption(idx, "scoreValue", Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="mt-2">
                <label className="text-[10px] text-gray-400">다음 페이지 ID (선택)</label>
                <input
                  className="w-full border rounded p-1.5 text-xs"
                  value={opt.nextPageId || ""}
                  onChange={(e) => updateOption(idx, "nextPageId", e.target.value)}
                  placeholder="page_question_2"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SettingsPanel>
  );
};

QuizQuestionComponent.craft = {
  props: {
    questionNumber: 1,
    totalQuestions: 5,
    questionText: "스트레스를 받으면 어떻게 하시나요?",
    options: defaultOptions,
    showProgress: true,
    progressColor: TDS_COLORS.blue,
  },
  related: { settings: QuizQuestionSettings },
  displayName: "퀴즈 질문",
};
