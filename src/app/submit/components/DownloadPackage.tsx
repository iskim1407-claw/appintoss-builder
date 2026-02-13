'use client';

import React, { useState } from 'react';
import { generateSubmitPackage, generateMetadataText } from '@/lib/submitPackageGenerator';
import { useSubmitStore } from '@/stores/submitStore';
import { useProjectStore } from '@/stores/projectStore';

interface DownloadPackageProps {
  logoBase64?: string;
}

const CHECKLIST = [
  { id: 'name', label: '앱 이름 입력', check: (a: { name: string }) => !!a.name },
  { id: 'appName', label: '앱 ID (영문) 입력', check: (a: { appName: string }) => !!a.appName },
  { id: 'category', label: '카테고리 선택', check: (a: { category: string }) => !!a.category },
  { id: 'subtitle', label: '부제 입력 (20자 이내)', check: (a: { subtitle: string }) => !!a.subtitle && a.subtitle.length <= 20 },
] as const;

export default function DownloadPackage({ logoBase64 }: DownloadPackageProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const appInfo = useSubmitStore((s) => s.appInfo);
  const currentProject = useProjectStore((s) => s.getCurrentProject());

  const allChecked = CHECKLIST.every((item) => item.check(appInfo));
  const projectName = currentProject?.name || '내 미니앱';
  const appId = appInfo.appName || 'my-miniapp';

  const handleDownload = async () => {
    if (!currentProject?.canvasData) {
      alert('에디터에서 앱을 먼저 만들어주세요.');
      return;
    }

    setIsDownloading(true);
    try {
      const blob = await generateSubmitPackage({
        canvasJson: currentProject.canvasData,
        appInfo,
        projectName,
        logoBase64,
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${appId}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloaded(true);
      setShowGuide(true);
    } catch (err) {
      console.error('패키지 생성 실패:', err);
      alert('패키지 생성 중 오류가 발생했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyMetadata = async () => {
    const text = generateMetadataText(appInfo, projectName);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 체크리스트 */}
      <div className="bg-gray-50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">다운로드 전 체크리스트</h3>
        <ul className="space-y-2">
          {CHECKLIST.map((item) => {
            const ok = item.check(appInfo);
            return (
              <li key={item.id} className="flex items-center gap-2 text-sm">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  ok ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'
                }`}>
                  {ok ? '✓' : '–'}
                </span>
                <span className={ok ? 'text-gray-700' : 'text-gray-400'}>{item.label}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 다운로드 버튼 */}
      <button
        onClick={handleDownload}
        disabled={!allChecked || isDownloading}
        className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-base font-bold transition-all ${
          allChecked && !isDownloading
            ? 'bg-[#3182F6] text-white hover:bg-[#1B64DA] active:scale-[0.98]'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isDownloading ? (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            패키지 생성 중...
          </span>
        ) : downloaded ? (
          '다운로드 완료!'
        ) : (
          '제출 패키지 다운로드'
        )}
      </button>

      {!allChecked && (
        <p className="text-xs text-center text-gray-400">
          체크리스트를 모두 완료하면 다운로드할 수 있어요
        </p>
      )}

      {/* 메타데이터 복사 */}
      <button
        onClick={handleCopyMetadata}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
      >
        {copied ? '복사됨!' : '메타데이터 복사 (콘솔 붙여넣기용)'}
      </button>

      {/* 터미널 안내 */}
      {downloaded && (
        <div className="bg-gray-900 rounded-xl p-5 text-sm">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="w-full flex items-center justify-between text-white font-medium"
          >
            <span>터미널에서 실행하세요</span>
            <span>{showGuide ? '▲' : '▼'}</span>
          </button>

          {showGuide && (
            <div className="mt-4 space-y-1 font-mono text-xs">
              <p className="text-gray-400"># 1. 압축 풀기 &amp; 이동</p>
              <p className="text-green-400">cd {appId}</p>
              <p className="mt-3 text-gray-400"># 2. 의존성 설치</p>
              <p className="text-green-400">npm install</p>
              <p className="mt-3 text-gray-400"># 3. Granite 로그인 (토스앱 QR 스캔)</p>
              <p className="text-green-400">npx granite login</p>
              <p className="mt-3 text-gray-400"># 4. 빌드</p>
              <p className="text-green-400">granite build</p>
              <p className="mt-3 text-gray-400"># 5. 배포</p>
              <p className="text-green-400">granite deploy</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
