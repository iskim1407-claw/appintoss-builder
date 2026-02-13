"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";
import { TDS_COLORS, TDS_RADIUS } from "@/lib/tds/tokens";

export interface QuizResultProps {
  typeCode?: string;
  typeName?: string;
  emoji?: string;
  title?: string;
  description?: string;
  strengths?: string[];
  weaknesses?: string[];
  tip?: string;
  accentColor?: string;
  showShare?: boolean;
  showRetry?: boolean;
  retryPageId?: string;
}

export const QuizResultComponent = ({
  typeCode = "INFP",
  typeName = "몽상가형",
  emoji = "🦋",
  title = "당신은 자유로운 영혼의 몽상가!",
  description = "풍부한 상상력과 깊은 감수성을 가진 당신은 세상을 아름답게 바라보는 능력이 있어요. 혼자만의 시간에 에너지를 충전하고, 의미 있는 관계를 소중히 여기는 편이죠.",
  strengths = ["창의력이 뛰어남", "공감 능력 최고", "진정성 있는 소통"],
  weaknesses = ["결정 장애 가끔", "현실감각 부족할 때도", "자기비판 심함"],
  tip = "가끔은 머릿속 생각을 글이나 그림으로 표현해 보세요. 당신의 내면에는 보물이 가득해요! ✨",
  accentColor = "#6366F1",
  showShare = true,
  showRetry = true,
  retryPageId: _retryPageId = "",
}: QuizResultProps) => {
  void _retryPageId;

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
          backgroundColor: TDS_COLORS.white,
          borderRadius: TDS_RADIUS.xl,
          overflow: "hidden",
        }}
      >
        {/* Header with Color */}
        <div
          style={{
            backgroundColor: accentColor,
            padding: "32px 24px",
            textAlign: "center",
            color: TDS_COLORS.white,
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 16 }}>{emoji}</div>
          <div
            style={{
              display: "inline-block",
              padding: "6px 16px",
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 20,
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            {typeCode}
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              margin: "8px 0 0",
            }}
          >
            {typeName}
          </h1>
        </div>

        {/* Content */}
        <div style={{ padding: "24px 20px" }}>
          {/* Title */}
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: TDS_COLORS.gray900,
              marginBottom: 12,
              lineHeight: 1.4,
            }}
          >
            {title}
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: 15,
              color: TDS_COLORS.gray700,
              lineHeight: 1.7,
              marginBottom: 24,
            }}
          >
            {description}
          </p>

          {/* Strengths & Weaknesses */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            {/* Strengths */}
            <div
              style={{
                padding: 16,
                backgroundColor: "#ECFDF5",
                borderRadius: TDS_RADIUS.md,
              }}
            >
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#059669",
                  marginBottom: 12,
                }}
              >
                💪 강점
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {strengths.map((item, idx) => (
                  <li
                    key={idx}
                    style={{
                      fontSize: 13,
                      color: "#065F46",
                      padding: "4px 0",
                    }}
                  >
                    • {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div
              style={{
                padding: 16,
                backgroundColor: "#FEF3F2",
                borderRadius: TDS_RADIUS.md,
              }}
            >
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#DC2626",
                  marginBottom: 12,
                }}
              >
                😅 약점
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {weaknesses.map((item, idx) => (
                  <li
                    key={idx}
                    style={{
                      fontSize: 13,
                      color: "#991B1B",
                      padding: "4px 0",
                    }}
                  >
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tip */}
          {tip && (
            <div
              style={{
                padding: 16,
                backgroundColor: TDS_COLORS.blueLight,
                borderRadius: TDS_RADIUS.md,
                marginBottom: 24,
              }}
            >
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: TDS_COLORS.blue,
                  marginBottom: 8,
                }}
              >
                💡 꿀팁
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: TDS_COLORS.gray700,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {tip}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            {showRetry && (
              <button
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  fontSize: 15,
                  fontWeight: 600,
                  color: TDS_COLORS.gray700,
                  backgroundColor: TDS_COLORS.gray100,
                  border: "none",
                  borderRadius: TDS_RADIUS.md,
                  cursor: "pointer",
                }}
              >
                다시 하기
              </button>
            )}
            {showShare && (
              <button
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  fontSize: 15,
                  fontWeight: 600,
                  color: TDS_COLORS.white,
                  backgroundColor: accentColor,
                  border: "none",
                  borderRadius: TDS_RADIUS.md,
                  cursor: "pointer",
                }}
              >
                공유하기 📤
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const QuizResultSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));
  const strengths: string[] = props.strengths || ["강점 1"];
  const weaknesses: string[] = props.weaknesses || ["약점 1"];

  const updateStrength = (index: number, value: string) => {
    setProp((p: QuizResultProps) => {
      const newArr = [...(p.strengths || [])];
      newArr[index] = value;
      p.strengths = newArr;
    });
  };

  const addStrength = () => {
    setProp((p: QuizResultProps) => {
      p.strengths = [...(p.strengths || []), "새 강점"];
    });
  };

  const removeStrength = (index: number) => {
    setProp((p: QuizResultProps) => {
      const newArr = [...(p.strengths || [])];
      newArr.splice(index, 1);
      p.strengths = newArr;
    });
  };

  const updateWeakness = (index: number, value: string) => {
    setProp((p: QuizResultProps) => {
      const newArr = [...(p.weaknesses || [])];
      newArr[index] = value;
      p.weaknesses = newArr;
    });
  };

  const addWeakness = () => {
    setProp((p: QuizResultProps) => {
      p.weaknesses = [...(p.weaknesses || []), "새 약점"];
    });
  };

  const removeWeakness = (index: number) => {
    setProp((p: QuizResultProps) => {
      const newArr = [...(p.weaknesses || [])];
      newArr.splice(index, 1);
      p.weaknesses = newArr;
    });
  };

  return (
    <SettingsPanel title="퀴즈 결과">
      <label className="block text-xs text-gray-500 mb-1">유형 코드</label>
      <input
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.typeCode || ""}
        onChange={(e) => setProp((p: QuizResultProps) => (p.typeCode = e.target.value))}
        placeholder="INFP"
      />

      <label className="block text-xs text-gray-500 mb-1">유형 이름</label>
      <input
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.typeName || ""}
        onChange={(e) => setProp((p: QuizResultProps) => (p.typeName = e.target.value))}
        placeholder="몽상가형"
      />

      <label className="block text-xs text-gray-500 mb-1">이모지</label>
      <input
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.emoji || ""}
        onChange={(e) => setProp((p: QuizResultProps) => (p.emoji = e.target.value))}
        placeholder="🦋"
      />

      <label className="block text-xs text-gray-500 mb-1">제목</label>
      <input
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.title || ""}
        onChange={(e) => setProp((p: QuizResultProps) => (p.title = e.target.value))}
        placeholder="당신은 자유로운 영혼의 몽상가!"
      />

      <label className="block text-xs text-gray-500 mb-1">설명</label>
      <textarea
        className="w-full border rounded-lg p-2 text-sm mb-3 resize-none"
        rows={4}
        value={props.description || ""}
        onChange={(e) => setProp((p: QuizResultProps) => (p.description = e.target.value))}
        placeholder="풍부한 상상력과 깊은 감수성을 가진 당신..."
      />

      <label className="block text-xs text-gray-500 mb-1">액센트 색상</label>
      <div className="flex gap-2 mb-3">
        {["#6366F1", "#EC4899", "#10B981", "#F59E0B", "#3B82F6", "#8B5CF6"].map((c) => (
          <button
            key={c}
            onClick={() => setProp((p: QuizResultProps) => (p.accentColor = c))}
            className={`w-8 h-8 rounded-full border-2 transition ${props.accentColor === c ? "border-gray-800 scale-110" : "border-transparent"}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      {/* Strengths */}
      <div className="border-t border-gray-100 pt-3 mt-3">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs text-gray-500 font-medium">💪 강점</label>
          <button onClick={addStrength} className="text-xs text-blue-500">+ 추가</button>
        </div>
        <div className="space-y-2 mb-3">
          {strengths.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="flex-1 border rounded p-1.5 text-sm"
                value={s}
                onChange={(e) => updateStrength(i, e.target.value)}
              />
              {strengths.length > 1 && (
                <button onClick={() => removeStrength(i)} className="text-xs text-red-400 px-2">×</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Weaknesses */}
      <div className="border-t border-gray-100 pt-3 mt-3">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs text-gray-500 font-medium">😅 약점</label>
          <button onClick={addWeakness} className="text-xs text-blue-500">+ 추가</button>
        </div>
        <div className="space-y-2 mb-3">
          {weaknesses.map((w, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="flex-1 border rounded p-1.5 text-sm"
                value={w}
                onChange={(e) => updateWeakness(i, e.target.value)}
              />
              {weaknesses.length > 1 && (
                <button onClick={() => removeWeakness(i)} className="text-xs text-red-400 px-2">×</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="border-t border-gray-100 pt-3 mt-3">
        <label className="block text-xs text-gray-500 mb-1">💡 꿀팁</label>
        <textarea
          className="w-full border rounded-lg p-2 text-sm mb-3 resize-none"
          rows={3}
          value={props.tip || ""}
          onChange={(e) => setProp((p: QuizResultProps) => (p.tip = e.target.value))}
          placeholder="가끔은 머릿속 생각을 글이나 그림으로 표현해 보세요..."
        />
      </div>

      {/* Options */}
      <div className="flex gap-4 mb-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={props.showRetry !== false}
            onChange={(e) => setProp((p: QuizResultProps) => (p.showRetry = e.target.checked))}
          />
          다시하기 버튼
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={props.showShare !== false}
            onChange={(e) => setProp((p: QuizResultProps) => (p.showShare = e.target.checked))}
          />
          공유 버튼
        </label>
      </div>

      <div className="border-t border-gray-100 pt-3 mt-3">
        <label className="block text-xs text-gray-500 mb-1">🔧 다시하기 페이지 ID</label>
        <input
          className="w-full border rounded-lg p-2 text-sm"
          value={props.retryPageId || ""}
          onChange={(e) => setProp((p: QuizResultProps) => (p.retryPageId = e.target.value))}
          placeholder="page_home"
        />
      </div>
    </SettingsPanel>
  );
};

QuizResultComponent.craft = {
  props: {
    typeCode: "INFP",
    typeName: "몽상가형",
    emoji: "🦋",
    title: "당신은 자유로운 영혼의 몽상가!",
    description: "풍부한 상상력과 깊은 감수성을 가진 당신은 세상을 아름답게 바라보는 능력이 있어요. 혼자만의 시간에 에너지를 충전하고, 의미 있는 관계를 소중히 여기는 편이죠.",
    strengths: ["창의력이 뛰어남", "공감 능력 최고", "진정성 있는 소통"],
    weaknesses: ["결정 장애 가끔", "현실감각 부족할 때도", "자기비판 심함"],
    tip: "가끔은 머릿속 생각을 글이나 그림으로 표현해 보세요. 당신의 내면에는 보물이 가득해요! ✨",
    accentColor: "#6366F1",
    showShare: true,
    showRetry: true,
    retryPageId: "",
  },
  related: { settings: QuizResultSettings },
  displayName: "퀴즈 결과",
};
