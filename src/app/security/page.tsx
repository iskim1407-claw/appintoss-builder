"use client";

import Link from "next/link";
import { useState, useCallback } from "react";

// ===== Types =====
interface SecurityCheckItem {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  type: "url" | "checklist" | "input" | "select";
  options?: string[];
  checklistItems?: { id: string; label: string; score: number }[];
  placeholder?: string;
  helpText?: string;
}

interface CheckState {
  [key: string]: {
    score: number;
    completed: boolean;
    details: string[];
  };
}

// ===== Security Check Items =====
const securityChecks: SecurityCheckItem[] = [
  {
    id: "https",
    name: "HTTPS 적용",
    description: "모든 통신이 암호화되어야 합니다",
    maxScore: 15,
    type: "url",
    placeholder: "https://your-app.com",
    helpText: "배포할 앱의 URL을 입력하면 HTTPS 적용 여부를 확인합니다",
  },
  {
    id: "csp",
    name: "CSP 헤더 설정",
    description: "Content Security Policy로 XSS 공격을 방지합니다",
    maxScore: 15,
    type: "checklist",
    checklistItems: [
      { id: "csp-default", label: "default-src 'self' 설정", score: 5 },
      { id: "csp-script", label: "script-src 정책 설정", score: 4 },
      { id: "csp-style", label: "style-src 정책 설정", score: 3 },
      { id: "csp-img", label: "img-src 정책 설정", score: 3 },
    ],
    helpText: "next.config.mjs 또는 middleware에서 CSP 헤더를 설정하세요",
  },
  {
    id: "xss",
    name: "XSS 방어",
    description: "크로스 사이트 스크립팅 공격 방어 조치",
    maxScore: 20,
    type: "checklist",
    checklistItems: [
      { id: "xss-innerhtml", label: "dangerouslySetInnerHTML 미사용 또는 sanitize 적용", score: 6 },
      { id: "xss-eval", label: "eval() 미사용", score: 4 },
      { id: "xss-input", label: "사용자 입력값 검증/이스케이프 처리", score: 5 },
      { id: "xss-output", label: "출력 시 HTML 인코딩", score: 5 },
    ],
    helpText: "DOMPurify 등의 라이브러리로 HTML을 sanitize하세요",
  },
  {
    id: "jwt",
    name: "JWT 만료 정책",
    description: "토큰 보안 및 만료 설정",
    maxScore: 15,
    type: "input",
    placeholder: "15 (분 단위)",
    helpText: "액세스 토큰 만료 시간을 분 단위로 입력하세요. 권장: 15~60분",
  },
  {
    id: "encryption",
    name: "개인정보 암호화",
    description: "민감한 데이터 암호화 조치",
    maxScore: 20,
    type: "checklist",
    checklistItems: [
      { id: "enc-password", label: "비밀번호 bcrypt/argon2 해시 처리", score: 5 },
      { id: "enc-pii", label: "주민등록번호 등 고유식별정보 암호화", score: 5 },
      { id: "enc-card", label: "카드번호/계좌번호 암호화", score: 5 },
      { id: "enc-transit", label: "전송 구간 TLS 1.2+ 적용", score: 5 },
    ],
    helpText: "AES-256 등 강력한 암호화 알고리즘을 사용하세요",
  },
  {
    id: "logging",
    name: "로그 보관 정책",
    description: "접근/오류 로그 보관 기간 설정",
    maxScore: 15,
    type: "select",
    options: ["미설정 (0점)", "30일 (5점)", "60일 (10점)", "90일 이상 (15점)"],
    helpText: "토스 심사 기준: 최소 90일 이상 로그 보관 필요",
  },
];

// ===== Components =====

// 원형 프로그레스 바
function CircularProgress({
  percentage,
  size = 200,
  strokeWidth = 15,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = (pct: number) => {
    if (pct >= 90) return "#22c55e";
    if (pct >= 70) return "#3b82f6";
    if (pct >= 50) return "#eab308";
    return "#ef4444";
  };

  const getGrade = (pct: number) => {
    if (pct >= 90) return "A";
    if (pct >= 80) return "B";
    if (pct >= 70) return "C";
    if (pct >= 60) return "D";
    return "F";
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* 배경 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* 진행 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(percentage)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className="text-5xl font-bold"
          style={{ color: getColor(percentage) }}
        >
          {getGrade(percentage)}
        </span>
        <span className="text-2xl font-semibold text-gray-700">
          {percentage}점
        </span>
      </div>
    </div>
  );
}

// 항목별 게이지 바
function GaugeBar({
  label,
  score,
  maxScore,
}: {
  label: string;
  score: number;
  maxScore: number;
}) {
  const percentage = (score / maxScore) * 100;

  const getColor = (pct: number) => {
    if (pct >= 100) return "bg-green-500";
    if (pct >= 70) return "bg-blue-500";
    if (pct >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">
          {score}/{maxScore}점
        </span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor(percentage)} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// URL 체크 컴포넌트
function UrlCheck({
  item,
  onCheck,
  state,
}: {
  item: SecurityCheckItem;
  onCheck: (id: string, score: number, details: string[]) => void;
  state?: { score: number; completed: boolean; details: string[] };
}) {
  const [url, setUrl] = useState("");
  const [checking, setChecking] = useState(false);

  const checkUrl = () => {
    setChecking(true);
    setTimeout(() => {
      const isHttps = url.startsWith("https://");
      const score = isHttps ? item.maxScore : 0;
      const details = isHttps
        ? ["✓ HTTPS 프로토콜 사용 확인"]
        : ["✗ HTTPS가 적용되지 않음 - https://로 시작해야 합니다"];
      onCheck(item.id, score, details);
      setChecking(false);
    }, 500);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={item.placeholder}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={checkUrl}
          disabled={!url || checking}
          className="px-4 py-2 bg-[#3182F6] text-white rounded-xl hover:bg-[#1B64DA] disabled:opacity-50 transition"
        >
          {checking ? "확인중..." : "확인"}
        </button>
      </div>
      {state?.completed && (
        <div
          className={`p-3 rounded-lg ${state.score > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
        >
          {state.details.map((d, i) => (
            <div key={i} className="text-sm">
              {d}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 체크리스트 컴포넌트
function ChecklistCheck({
  item,
  onCheck,
}: {
  item: SecurityCheckItem;
  onCheck: (id: string, score: number, details: string[]) => void;
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const handleChange = (checkId: string, isChecked: boolean) => {
    const newChecked = { ...checked, [checkId]: isChecked };
    setChecked(newChecked);

    let totalScore = 0;
    const details: string[] = [];

    item.checklistItems?.forEach((ci) => {
      if (newChecked[ci.id]) {
        totalScore += ci.score;
        details.push(`✓ ${ci.label}`);
      } else {
        details.push(`✗ ${ci.label}`);
      }
    });

    onCheck(item.id, totalScore, details);
  };

  return (
    <div className="space-y-2">
      {item.checklistItems?.map((ci) => (
        <label
          key={ci.id}
          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition"
        >
          <input
            type="checkbox"
            checked={checked[ci.id] || false}
            onChange={(e) => handleChange(ci.id, e.target.checked)}
            className="w-5 h-5 text-[#3182F6] rounded focus:ring-[#3182F6]"
          />
          <span className="flex-1 text-sm text-gray-700">{ci.label}</span>
          <span className="text-xs text-gray-400">+{ci.score}점</span>
        </label>
      ))}
    </div>
  );
}

// 입력 체크 컴포넌트
function InputCheck({
  item,
  onCheck,
  state,
}: {
  item: SecurityCheckItem;
  onCheck: (id: string, score: number, details: string[]) => void;
  state?: { score: number; completed: boolean; details: string[] };
}) {
  const [value, setValue] = useState("");

  const handleChange = (newValue: string) => {
    setValue(newValue);
    const minutes = parseInt(newValue, 10);

    if (isNaN(minutes) || minutes <= 0) {
      onCheck(item.id, 0, ["✗ 유효한 만료 시간을 입력하세요"]);
      return;
    }

    let score = 0;
    const details: string[] = [];

    if (minutes <= 15) {
      score = item.maxScore;
      details.push(`✓ 우수: ${minutes}분 (권장 범위)`);
    } else if (minutes <= 30) {
      score = Math.round(item.maxScore * 0.8);
      details.push(`○ 양호: ${minutes}분`);
    } else if (minutes <= 60) {
      score = Math.round(item.maxScore * 0.6);
      details.push(`△ 보통: ${minutes}분 (30분 이하 권장)`);
    } else {
      score = Math.round(item.maxScore * 0.3);
      details.push(`✗ 주의: ${minutes}분 (너무 긴 만료 시간)`);
    }

    onCheck(item.id, score, details);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <input
          type="number"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={item.placeholder}
          min="1"
          className="w-32 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-gray-500">분</span>
      </div>
      {state?.completed && (
        <div
          className={`p-3 rounded-lg ${state.score >= item.maxScore * 0.7 ? "bg-green-50 text-green-700" : state.score >= item.maxScore * 0.4 ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-700"}`}
        >
          {state.details.map((d, i) => (
            <div key={i} className="text-sm">
              {d}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 셀렉트 체크 컴포넌트
function SelectCheck({
  item,
  onCheck,
}: {
  item: SecurityCheckItem;
  onCheck: (id: string, score: number, details: string[]) => void;
}) {
  const handleChange = (optionIndex: number) => {
    const scoreMap = [0, 5, 10, 15]; // 각 옵션별 점수
    const score = scoreMap[optionIndex] || 0;
    const details = [
      item.options?.[optionIndex]?.includes("점)")
        ? `선택: ${item.options[optionIndex]}`
        : `✓ ${item.options?.[optionIndex]}`,
    ];
    onCheck(item.id, score, details);
  };

  return (
    <div className="space-y-2">
      {item.options?.map((option, i) => (
        <label
          key={i}
          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition"
        >
          <input
            type="radio"
            name={item.id}
            onChange={() => handleChange(i)}
            className="w-5 h-5 text-[#3182F6] focus:ring-[#3182F6]"
          />
          <span className="text-sm text-gray-700">{option}</span>
        </label>
      ))}
    </div>
  );
}

// ===== Main Page =====
export default function SecurityPage() {
  const [checkState, setCheckState] = useState<CheckState>({});

  const handleCheck = useCallback(
    (id: string, score: number, details: string[]) => {
      setCheckState((prev) => ({
        ...prev,
        [id]: { score, completed: true, details },
      }));
    },
    []
  );

  // 총점 계산
  const totalScore = Object.values(checkState).reduce(
    (sum, item) => sum + item.score,
    0
  );
  const maxScore = securityChecks.reduce((sum, item) => sum + item.maxScore, 0);
  const percentage = Math.round((totalScore / maxScore) * 100);

  // 리포트 생성
  const generateReport = (format: "txt" | "md") => {
    const now = new Date().toLocaleString("ko-KR");
    const grade =
      percentage >= 90
        ? "A"
        : percentage >= 80
          ? "B"
          : percentage >= 70
            ? "C"
            : percentage >= 60
              ? "D"
              : "F";

    let content = "";

    if (format === "md") {
      content = `# 🔒 보안 점검 리포트

**생성일시**: ${now}

---

## 📊 총점

| 등급 | 점수 | 백분율 |
|------|------|--------|
| **${grade}** | ${totalScore}/${maxScore}점 | ${percentage}% |

---

## 📋 상세 점검 결과

`;
      securityChecks.forEach((check) => {
        const state = checkState[check.id];
        const score = state?.score || 0;
        const status = score >= check.maxScore * 0.7 ? "✅" : score > 0 ? "⚠️" : "❌";

        content += `### ${status} ${check.name}\n\n`;
        content += `- **점수**: ${score}/${check.maxScore}점\n`;
        content += `- **설명**: ${check.description}\n`;

        if (state?.details && state.details.length > 0) {
          content += `- **세부사항**:\n`;
          state.details.forEach((d) => {
            content += `  - ${d}\n`;
          });
        }
        content += "\n";
      });

      content += `---

## 📝 권장 조치사항

`;
      securityChecks.forEach((check) => {
        const state = checkState[check.id];
        const score = state?.score || 0;
        if (score < check.maxScore * 0.7) {
          content += `- **${check.name}**: ${check.helpText}\n`;
        }
      });

      content += `
---

> 이 리포트는 앱인토스 빌더 보안 점검 도구로 생성되었습니다.
> 실제 토스 심사와 다를 수 있으며, 전문 보안 검토를 권장합니다.
`;
    } else {
      // TXT 형식
      content = `========================================
        보안 점검 리포트
========================================

생성일시: ${now}

----------------------------------------
                총점
----------------------------------------
등급: ${grade}
점수: ${totalScore}/${maxScore}점 (${percentage}%)

----------------------------------------
            상세 점검 결과
----------------------------------------
`;
      securityChecks.forEach((check) => {
        const state = checkState[check.id];
        const score = state?.score || 0;
        const status = score >= check.maxScore * 0.7 ? "[통과]" : score > 0 ? "[주의]" : "[미통과]";

        content += `\n${status} ${check.name}\n`;
        content += `  점수: ${score}/${check.maxScore}점\n`;
        content += `  설명: ${check.description}\n`;

        if (state?.details && state.details.length > 0) {
          content += `  세부사항:\n`;
          state.details.forEach((d) => {
            content += `    - ${d}\n`;
          });
        }
      });

      content += `
----------------------------------------
            권장 조치사항
----------------------------------------
`;
      securityChecks.forEach((check) => {
        const state = checkState[check.id];
        const score = state?.score || 0;
        if (score < check.maxScore * 0.7) {
          content += `\n* ${check.name}\n  ${check.helpText}\n`;
        }
      });

      content += `
========================================
앱인토스 빌더 보안 점검 도구
실제 토스 심사와 다를 수 있습니다.
========================================
`;
    }

    // 다운로드
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `security-report-${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#3182F6]">
            앱인토스 빌더
          </Link>
          <div className="flex gap-4 items-center">
            <Link
              href="/templates"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              템플릿
            </Link>
            <Link
              href="/security"
              className="text-sm text-[#3182F6] font-medium"
            >
              🔒 보안점검
            </Link>
            <Link
              href="/documents"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              📄 문서
            </Link>
            <Link
              href="/editor"
              className="text-sm bg-[#3182F6] text-white px-4 py-2 rounded-xl hover:bg-[#1B64DA] transition"
            >
              에디터 열기
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            🔒 보안 자동 점검
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            토스 미니앱 심사에 필요한 보안 요구사항을 점검하고
            <br className="hidden md:block" />
            상세 리포트를 다운로드하세요.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 왼쪽: 점검 항목 */}
          <div className="lg:col-span-2 space-y-6">
            {securityChecks.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-[#3182F6] bg-blue-50 px-3 py-1 rounded-full">
                    {item.maxScore}점
                  </span>
                </div>

                {item.type === "url" && (
                  <UrlCheck
                    item={item}
                    onCheck={handleCheck}
                    state={checkState[item.id]}
                  />
                )}
                {item.type === "checklist" && (
                  <ChecklistCheck
                    item={item}
                    onCheck={handleCheck}
                  />
                )}
                {item.type === "input" && (
                  <InputCheck
                    item={item}
                    onCheck={handleCheck}
                    state={checkState[item.id]}
                  />
                )}
                {item.type === "select" && (
                  <SelectCheck item={item} onCheck={handleCheck} />
                )}

                {item.helpText && (
                  <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
                    <span>💡</span> {item.helpText}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* 오른쪽: 점수 요약 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* 총점 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
                <h3 className="font-bold text-gray-700 mb-6">보안 점수</h3>
                <CircularProgress percentage={percentage} />
                <p className="text-sm text-gray-500 mt-4">
                  {totalScore}/{maxScore}점
                </p>
              </div>

              {/* 항목별 점수 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-700 mb-4">항목별 점수</h3>
                {securityChecks.map((item) => (
                  <GaugeBar
                    key={item.id}
                    label={item.name}
                    score={checkState[item.id]?.score || 0}
                    maxScore={item.maxScore}
                  />
                ))}
              </div>

              {/* 리포트 다운로드 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-700 mb-4">
                  📄 리포트 다운로드
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => generateReport("md")}
                    className="w-full py-3 bg-[#3182F6] text-white rounded-xl hover:bg-[#1B64DA] transition font-medium"
                  >
                    📝 Markdown (.md)
                  </button>
                  <button
                    onClick={() => generateReport("txt")}
                    className="w-full py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
                  >
                    📄 텍스트 (.txt)
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">
                  점검 결과가 리포트에 포함됩니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-400">
          © 2024 앱인토스 빌더. 보안 점검 결과는 참고용이며, 실제 심사와 다를
          수 있습니다.
        </div>
      </footer>
    </div>
  );
}
