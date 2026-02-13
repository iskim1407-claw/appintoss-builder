"use client";

import React from "react";
import type { ValidationResult, ValidationItem, ValidationStatus } from "@/types/submit";

function StatusIcon({ status }: { status: ValidationStatus }) {
  switch (status) {
    case 'pass': return <span className="text-green-500 font-bold">Pass</span>;
    case 'warning': return <span className="text-yellow-500">⚠️</span>;
    case 'fail': return <span className="text-red-500">❌</span>;
  }
}

function CircularProgress({ score }: { score: number }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 80 ? '#22C55E' : score >= 50 ? '#EAB308' : '#EF4444';

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#F3F4F6" strokeWidth="8" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs text-gray-400">/ 100</span>
      </div>
    </div>
  );
}

function ItemGroup({ title, items }: { title: string; items: ValidationItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-4">
      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{title}</h4>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-2 py-2 px-3 rounded-lg bg-gray-50">
            <StatusIcon status={item.status} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700">{item.name}</p>
              <p className="text-xs text-gray-400">{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ValidationPanel({ result }: { result: ValidationResult | null }) {
  if (!result) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-4xl mb-3"></div>
        <p className="text-sm">앱 정보를 입력하면<br />자동으로 검증합니다</p>
      </div>
    );
  }

  const required = result.items.filter((i) => i.category === 'required');
  const recommended = result.items.filter((i) => i.category === 'recommended');
  const optional = result.items.filter((i) => i.category === 'optional');

  const passRate = result.score >= 80 ? '높음' : result.score >= 50 ? '보통' : '낮음';
  const passColor = result.score >= 80 ? 'text-green-600 bg-green-50' : result.score >= 50 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50';

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">심사 체크 결과</h2>

      <CircularProgress score={result.score} />

      <div className={`mt-4 text-center py-2 px-4 rounded-full text-sm font-medium inline-block w-full ${passColor}`}>
        통과 확률 {passRate} — {result.passed ? '제출 가능' : '수정 필요'}
      </div>

      <ItemGroup title="🔴 필수" items={required} />
      <ItemGroup title="🟡 권장" items={recommended} />
      <ItemGroup title="🟢 선택" items={optional} />
    </div>
  );
}
