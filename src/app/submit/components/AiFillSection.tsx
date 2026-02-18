"use client";

import React, { useState, useRef, useCallback } from "react";
import { useSubmitStore } from "@/stores/submitStore";

const CATEGORY_MAP: Record<string, string> = {
  "라이프스타일": "생활 > 일상 > 기타",
  "금융": "생활 > 금융 > 핀테크",
  "교육": "엔터테인먼트 > 교육",
  "엔터테인먼트": "엔터테인먼트 > 퀴즈/테스트",
  "유틸리티": "생활 > 일상 > 유틸리티",
  "소셜": "소셜 > 커뮤니티",
  "건강": "생활 > 일상 > 기타",
  "쇼핑": "생활 > 일상 > 기타",
};

const RATE_LIMIT = 5;
const RATE_WINDOW = 60_000;

export function AiFillSection() {
  const { setAppInfo } = useSubmitStore();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const timestamps = useRef<number[]>([]);

  const handleFill = useCallback(async () => {
    if (!prompt.trim()) return;

    // Rate limit check
    const now = Date.now();
    timestamps.current = timestamps.current.filter((t) => now - t < RATE_WINDOW);
    if (timestamps.current.length >= RATE_LIMIT) {
      setError("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    timestamps.current.push(now);

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/ai-fill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "AI 요청에 실패했습니다");
        return;
      }

      // Map AI response to form fields
      const updates: Record<string, unknown> = {};
      if (data.appName) updates.name = data.appName;
      if (data.appDescription) updates.description = data.appDescription;
      if (data.category) {
        updates.category = CATEGORY_MAP[data.category] || "";
      }
      if (data.mainFeatures && Array.isArray(data.mainFeatures)) {
        updates.keywords = data.mainFeatures.slice(0, 5);
      }
      if (data.targetAudience) {
        updates.subtitle = data.targetAudience.slice(0, 20);
      }

      setAppInfo(updates);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("네트워크 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  }, [prompt, setAppInfo]);

  return (
    <div className="relative mb-6 rounded-2xl p-[2px] bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400">
      <div className="rounded-[14px] bg-white/90 backdrop-blur-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">✨</span>
          <h3 className="text-sm font-bold text-gray-900">AI 자동 채우기</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 font-medium">
            GPT-4o-mini
          </span>
        </div>

        <p className="text-xs text-gray-500 mb-3">
          앱에 대해 간단히 설명하면 AI가 폼을 자동으로 채워드려요
        </p>

        <textarea
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/80 backdrop-blur transition resize-none"
          rows={2}
          placeholder="예: 매일 퀴즈를 풀면서 금융 지식을 쌓는 앱"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
        />

        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={handleFill}
            disabled={loading || !prompt.trim()}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${
              loading
                ? "bg-purple-300 cursor-wait animate-pulse"
                : "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 shadow-md hover:shadow-lg active:scale-95"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                AI 분석 중...
              </span>
            ) : (
              "✨ AI로 자동 채우기"
            )}
          </button>

          {error && (
            <span className="text-xs text-red-500 font-medium">{error}</span>
          )}
          {success && (
            <span className="text-xs text-green-600 font-medium animate-pulse">
              ✅ 폼이 자동으로 채워졌어요! 내용을 확인해주세요.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
