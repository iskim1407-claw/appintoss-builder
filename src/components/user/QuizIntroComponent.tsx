"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";
import { TDS_COLORS, TDS_RADIUS } from "@/lib/tds/tokens";

export interface QuizIntroProps {
  title?: string;
  subtitle?: string;
  emoji?: string;
  buttonText?: string;
  backgroundColor?: string;
  emojiSize?: number;
  // Action
  nextPageId?: string;
}

export const QuizIntroComponent = ({
  title = "나는 어떤 유형일까?",
  subtitle = "간단한 질문에 답하고\n나의 유형을 알아보세요",
  emoji = "🧠",
  buttonText = "테스트 시작하기",
  backgroundColor = TDS_COLORS.white,
  emojiSize = 80,
  nextPageId: _nextPageId = "",
}: QuizIntroProps) => {
  void _nextPageId;

  const {
    connectors: { connect, drag },
    selected,
  } = useNode((s) => ({ selected: s.events.selected }));

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      <div
        style={{
          backgroundColor,
          borderRadius: TDS_RADIUS.xl,
          padding: "48px 24px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          minHeight: 400,
          justifyContent: "center",
        }}
      >
        {/* Emoji */}
        <div
          style={{
            fontSize: emojiSize,
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          {emoji}
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: TDS_COLORS.gray900,
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 16,
            color: TDS_COLORS.gray600,
            margin: 0,
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}
        >
          {subtitle}
        </p>

        {/* Start Button */}
        <button
          style={{
            marginTop: 16,
            width: "100%",
            maxWidth: 280,
            padding: "16px 24px",
            fontSize: 17,
            fontWeight: 700,
            color: TDS_COLORS.white,
            backgroundColor: TDS_COLORS.blue,
            border: "none",
            borderRadius: TDS_RADIUS.md,
            cursor: "pointer",
          }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

const QuizIntroSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));

  return (
    <SettingsPanel title="퀴즈 인트로">
      <label className="block text-xs text-gray-500 mb-1">이모지</label>
      <input
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.emoji || "🧠"}
        onChange={(e) => setProp((p: QuizIntroProps) => (p.emoji = e.target.value))}
        placeholder="🧠"
      />

      <label className="block text-xs text-gray-500 mb-1">이모지 크기</label>
      <input
        type="range"
        min={40}
        max={120}
        className="w-full mb-3"
        value={props.emojiSize || 80}
        onChange={(e) => setProp((p: QuizIntroProps) => (p.emojiSize = Number(e.target.value)))}
      />

      <label className="block text-xs text-gray-500 mb-1">제목</label>
      <input
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.title || ""}
        onChange={(e) => setProp((p: QuizIntroProps) => (p.title = e.target.value))}
        placeholder="나는 어떤 유형일까?"
      />

      <label className="block text-xs text-gray-500 mb-1">부제목</label>
      <textarea
        className="w-full border rounded-lg p-2 text-sm mb-3 resize-none"
        rows={3}
        value={props.subtitle || ""}
        onChange={(e) => setProp((p: QuizIntroProps) => (p.subtitle = e.target.value))}
        placeholder="간단한 질문에 답하고&#10;나의 유형을 알아보세요"
      />

      <label className="block text-xs text-gray-500 mb-1">버튼 텍스트</label>
      <input
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.buttonText || ""}
        onChange={(e) => setProp((p: QuizIntroProps) => (p.buttonText = e.target.value))}
        placeholder="테스트 시작하기"
      />

      <div className="border-t border-gray-100 pt-3 mt-3">
        <label className="block text-xs text-gray-500 mb-1">🔧 다음 페이지 ID</label>
        <input
          className="w-full border rounded-lg p-2 text-sm"
          value={props.nextPageId || ""}
          onChange={(e) => setProp((p: QuizIntroProps) => (p.nextPageId = e.target.value))}
          placeholder="page_question_1"
        />
        <p className="text-xs text-gray-400 mt-1">
          버튼 클릭 시 이동할 페이지 ID
        </p>
      </div>
    </SettingsPanel>
  );
};

QuizIntroComponent.craft = {
  props: {
    title: "나는 어떤 유형일까?",
    subtitle: "간단한 질문에 답하고\n나의 유형을 알아보세요",
    emoji: "🧠",
    buttonText: "테스트 시작하기",
    backgroundColor: TDS_COLORS.white,
    emojiSize: 80,
    nextPageId: "",
  },
  related: { settings: QuizIntroSettings },
  displayName: "퀴즈 인트로",
};
