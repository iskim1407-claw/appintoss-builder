"use client";

import React, { useState, useCallback } from "react";
import { useSubmitStore } from "@/stores/submitStore";
import type { AppInfo } from "@/types/submit";

/* ------------------------------------------------------------------ */
/*  Copy button                                                        */
/* ------------------------------------------------------------------ */
function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors shrink-0"
    >
      {copied ? (
        <>
          <CheckIcon /> 복사됨!
        </>
      ) : (
        <>
          <ClipboardIcon /> {label ?? "복사"}
        </>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline copyable value                                              */
/* ------------------------------------------------------------------ */
function Copyable({ value, placeholder }: { value: string; placeholder?: string }) {
  const display = value || placeholder || "—";
  return (
    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-sm font-mono">
      {display}
      {value && <CopyButton text={value} />}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Code block with copy                                               */
/* ------------------------------------------------------------------ */
function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative my-2 rounded-lg bg-gray-900 text-gray-100 text-sm font-mono overflow-x-auto">
      <div className="absolute top-2 right-2">
        <CopyButton text={code} label="복사" />
      </div>
      <pre className="p-4 pr-20 whitespace-pre-wrap">{code}</pre>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Icons                                                               */
/* ------------------------------------------------------------------ */
function ClipboardIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-2M8 5a2 2 0 012-2h4a2 2 0 012 2M8 5a2 2 0 002 2h4a2 2 0 002-2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

const STEP_ICONS = ["1", "2", "3", "4", "5"];

/* ------------------------------------------------------------------ */
/*  Step accordion                                                     */
/* ------------------------------------------------------------------ */
interface StepProps {
  step: number;
  title: string;
  completed: boolean;
  open: boolean;
  onToggleOpen: () => void;
  onToggleComplete: () => void;
  children: React.ReactNode;
}

function Step({ step, title, completed, open, onToggleOpen, onToggleComplete, children }: StepProps) {
  return (
    <div className={`border rounded-xl transition-colors ${completed ? "border-green-300 bg-green-50/50" : "border-gray-200 bg-white"}`}>
      <button
        onClick={onToggleOpen}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <span
          onClick={(e) => { e.stopPropagation(); onToggleComplete(); }}
          className={`flex items-center justify-center w-6 h-6 rounded-full border-2 text-xs font-bold transition-colors cursor-pointer shrink-0 ${
            completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300 text-gray-400"
          }`}
        >
          {completed ? "✓" : step}
        </span>
        <span className="text-lg">{STEP_ICONS[step - 1]}</span>
        <span className="flex-1 font-semibold text-gray-800">{title}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 pl-16 space-y-2 text-sm text-gray-700 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main guide                                                         */
/* ------------------------------------------------------------------ */
interface SubmitGuideProps {
  metadata?: Partial<AppInfo>;
}

export default function SubmitGuide({ metadata: propsMeta }: SubmitGuideProps) {
  const appInfo = useSubmitStore((s) => s.appInfo);
  const meta = { ...appInfo, ...propsMeta };

  const [openSteps, setOpenSteps] = useState<Set<number>>(new Set([1]));
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleOpen = (n: number) =>
    setOpenSteps((prev) => {
      const next = new Set(prev);
      if (next.has(n)) { next.delete(n); } else { next.add(n); }
      return next;
    });

  const toggleComplete = (n: number) =>
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(n)) { next.delete(n); } else { next.add(n); }
      return next;
    });

  const terminalCommands = `cd [다운로드 폴더]/my-app
npm install
npx granite login
granite build
granite deploy`;

  return (
    <div className="max-w-2xl mx-auto space-y-3 p-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">앱인토스 제출 가이드</h2>
      <p className="text-sm text-gray-500 mb-6">
        아래 단계를 순서대로 따라하세요. 완료한 단계는 체크 표시해 두면 진행 상황을 확인할 수 있습니다.
      </p>

      <Step step={1} title="토스 비즈니스 가입" completed={completedSteps.has(1)} open={openSteps.has(1)} onToggleOpen={() => toggleOpen(1)} onToggleComplete={() => toggleComplete(1)}>
        <ol className="list-decimal list-inside space-y-1.5">
          <li>
            <a href="https://business.toss.im" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
              https://business.toss.im
            </a>{" "}
            에 접속합니다.
          </li>
          <li><strong>사업자 등록</strong> 또는 <strong>개인 가입</strong>을 진행합니다.</li>
          <li>좌측 메뉴에서 <strong>&quot;앱인토스&quot;</strong>를 클릭합니다.</li>
        </ol>
      </Step>

      <Step step={2} title="앱 등록" completed={completedSteps.has(2)} open={openSteps.has(2)} onToggleOpen={() => toggleOpen(2)} onToggleComplete={() => toggleComplete(2)}>
        <ol className="list-decimal list-inside space-y-2">
          <li><strong>&quot;+ 등록하기&quot;</strong> 버튼을 클릭합니다.</li>
          <li>
            앱 정보를 입력합니다:
            <ul className="ml-5 mt-1 space-y-1.5 list-disc">
              <li>앱 이름: <Copyable value={meta.name} placeholder="미입력" /></li>
              <li>영어 이름: <Copyable value={meta.englishName} placeholder="미입력" /></li>
              <li>appName: <Copyable value={meta.appName} placeholder="미입력" /></li>
            </ul>
          </li>
          <li>
            <strong>카테고리</strong>를 선택합니다.
            {meta.category && (
              <span className="ml-1 text-gray-500">→ {meta.category}</span>
            )}
          </li>
          <li>
            부제 및 설명을 입력합니다:
            <ul className="ml-5 mt-1 space-y-1.5 list-disc">
              <li>부제: <Copyable value={meta.subtitle} placeholder="미입력" /></li>
              <li>설명: <Copyable value={meta.description} placeholder="미입력" /></li>
            </ul>
          </li>
        </ol>
      </Step>

      <Step step={3} title="약관 등록" completed={completedSteps.has(3)} open={openSteps.has(3)} onToggleOpen={() => toggleOpen(3)} onToggleComplete={() => toggleComplete(3)}>
        <ol className="list-decimal list-inside space-y-1.5">
          <li><strong>&quot;약관 등록하기&quot;</strong>를 클릭합니다.</li>
          <li>
            개인정보처리방침 URL을 입력합니다:
            <div className="mt-1">
              <Copyable value={meta.privacyPolicyUrl ?? ""} placeholder="URL 미입력" />
            </div>
          </li>
        </ol>
      </Step>

      <Step step={4} title="번들 빌드 & 업로드" completed={completedSteps.has(4)} open={openSteps.has(4)} onToggleOpen={() => toggleOpen(4)} onToggleComplete={() => toggleComplete(4)}>
        <p className="font-medium">터미널에서 아래 명령어를 실행하세요:</p>
        <CodeBlock code={terminalCommands} />
        <ol className="list-decimal list-inside space-y-1.5 mt-3">
          <li>토스 비즈니스 콘솔에서 <strong>&quot;앱 출시&quot;</strong> 메뉴를 클릭합니다.</li>
          <li><strong>&quot;+ 등록하기&quot;</strong> 버튼을 클릭합니다.</li>
          <li>빌드된 번들 파일을 업로드합니다.</li>
        </ol>
      </Step>

      <Step step={5} title="검토 요청" completed={completedSteps.has(5)} open={openSteps.has(5)} onToggleOpen={() => toggleOpen(5)} onToggleComplete={() => toggleComplete(5)}>
        <ol className="list-decimal list-inside space-y-1.5">
          <li><strong>&quot;검토 요청&quot;</strong> 버튼을 클릭합니다.</li>
          <li>심사 결과는 <strong>1일 이내</strong>에 등록한 이메일로 수신됩니다.</li>
        </ol>
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-xs">
          심사에서 반려되면 사유를 확인하고 수정 후 다시 제출할 수 있습니다.
        </div>
      </Step>

      <div className="pt-4 text-center text-sm text-gray-400">
        완료 {completedSteps.size} / 5 단계
      </div>
    </div>
  );
}
