"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";

interface CreditScoreProps {
  score?: number;
  maxScore?: number;
  grade?: string;
  gradeDescription?: string;
  showGauge?: boolean;
  gaugeColor?: string;
  showDetails?: boolean;
  lastUpdated?: string;
  borderRadius?: number;
}

const getGradeInfo = (score: number): { grade: string; description: string; color: string } => {
  if (score >= 900) return { grade: "1등급", description: "최우수", color: "#3182F6" };
  if (score >= 800) return { grade: "2등급", description: "우수", color: "#36B37E" };
  if (score >= 700) return { grade: "3등급", description: "양호", color: "#6554C0" };
  if (score >= 600) return { grade: "4등급", description: "보통", color: "#FFAB00" };
  if (score >= 500) return { grade: "5등급", description: "관리 필요", color: "#FF8B00" };
  return { grade: "6등급", description: "주의", color: "#FF5630" };
};

export const CreditScoreComponent = ({
  score = 850,
  maxScore = 1000,
  grade,
  gradeDescription,
  showGauge = true,
  gaugeColor,
  showDetails = true,
  lastUpdated = "2024.02.12",
  borderRadius = 20,
}: CreditScoreProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((s) => ({ selected: s.events.selected }));
  
  const gradeInfo = getGradeInfo(score);
  const displayGrade = grade || gradeInfo.grade;
  const displayDescription = gradeDescription || gradeInfo.description;
  const displayColor = gaugeColor || gradeInfo.color;
  
  const percentage = (score / maxScore) * 100;
  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`px-3 py-2 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      <div
        className="bg-white p-6"
        style={{ borderRadius }}
      >
        {/* 원형 게이지 */}
        {showGauge && (
          <div className="relative w-48 h-48 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 180 180">
              {/* 배경 원 */}
              <circle
                cx="90"
                cy="90"
                r="80"
                fill="none"
                stroke="#F2F4F6"
                strokeWidth="12"
              />
              {/* 진행 원 */}
              <circle
                cx="90"
                cy="90"
                r="80"
                fill="none"
                stroke={displayColor}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000"
              />
            </svg>
            
            {/* 중앙 점수 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-gray-900">{score}</span>
              <span className="text-sm text-gray-400">/ {maxScore}</span>
            </div>
          </div>
        )}

        {/* 등급 표시 */}
        <div className="text-center mb-4">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-bold"
            style={{ backgroundColor: displayColor }}
          >
            <span>{displayGrade}</span>
            <span className="text-sm opacity-80">|</span>
            <span className="text-sm">{displayDescription}</span>
          </div>
        </div>

        {/* 상세 정보 */}
        {showDetails && (
          <div className="border-t border-gray-100 pt-4 mt-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">마지막 업데이트</span>
              <span className="text-gray-700">{lastUpdated}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-2">
              <span className="text-gray-500">조회 기관</span>
              <span className="text-gray-700">NICE평가정보</span>
            </div>
          </div>
        )}

        {/* 점수 향상 팁 */}
        <div className="bg-blue-50 rounded-xl p-4 mt-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <p className="text-sm font-medium text-gray-800">점수 올리는 방법</p>
              <p className="text-xs text-gray-500 mt-1">정기적인 금융거래와 연체 없는 상환이 중요해요</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreditScoreSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));
  
  return (
    <SettingsPanel title="신용점수">
      <label className="block text-xs text-gray-500 mb-1">점수</label>
      <input 
        type="number"
        min={0}
        max={1000}
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.score || 850} 
        onChange={(e) => setProp((p: CreditScoreProps) => (p.score = Number(e.target.value)))} 
      />

      <label className="block text-xs text-gray-500 mb-1">만점</label>
      <input 
        type="number"
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.maxScore || 1000} 
        onChange={(e) => setProp((p: CreditScoreProps) => (p.maxScore = Number(e.target.value)))} 
      />

      <label className="block text-xs text-gray-500 mb-1">등급 (자동 설정됨)</label>
      <input 
        className="w-full border rounded-lg p-2 text-sm mb-3 bg-gray-50" 
        value={props.grade || ""} 
        placeholder="비워두면 자동 계산"
        onChange={(e) => setProp((p: CreditScoreProps) => (p.grade = e.target.value))} 
      />

      <label className="block text-xs text-gray-500 mb-1">게이지 색상</label>
      <input 
        type="color" 
        value={props.gaugeColor || "#3182F6"} 
        onChange={(e) => setProp((p: CreditScoreProps) => (p.gaugeColor = e.target.value))} 
        className="w-full h-8 mb-3" 
      />

      <label className="block text-xs text-gray-500 mb-1">모서리 둥글기</label>
      <input 
        type="range" 
        min={0} 
        max={32} 
        value={props.borderRadius || 20}
        onChange={(e) => setProp((p: CreditScoreProps) => (p.borderRadius = Number(e.target.value)))}
        className="w-full mb-1"
      />
      <span className="text-xs text-gray-400">{props.borderRadius || 20}px</span>

      <label className="block text-xs text-gray-500 mb-1 mt-3">마지막 업데이트</label>
      <input 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.lastUpdated || ""} 
        onChange={(e) => setProp((p: CreditScoreProps) => (p.lastUpdated = e.target.value))} 
      />

      <label className="flex items-center gap-2 text-sm mt-2 mb-2">
        <input 
          type="checkbox" 
          checked={props.showGauge ?? true} 
          onChange={(e) => setProp((p: CreditScoreProps) => (p.showGauge = e.target.checked))} 
        />
        원형 게이지 표시
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input 
          type="checkbox" 
          checked={props.showDetails ?? true} 
          onChange={(e) => setProp((p: CreditScoreProps) => (p.showDetails = e.target.checked))} 
        />
        상세 정보 표시
      </label>
    </SettingsPanel>
  );
};

CreditScoreComponent.craft = {
  props: {
    score: 850,
    maxScore: 1000,
    grade: "",
    gradeDescription: "",
    showGauge: true,
    gaugeColor: "",
    showDetails: true,
    lastUpdated: "2024.02.12",
    borderRadius: 20,
  },
  related: { settings: CreditScoreSettings },
  displayName: "신용점수",
};
