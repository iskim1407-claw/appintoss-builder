"use client";

import React, { useCallback, useRef, useState } from "react";
import { useSubmitStore } from "@/stores/submitStore";
import { CATEGORIES, AGE_RATINGS } from "@/types/submit";

function toAppName(english: string): string {
  return english
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function AppInfoForm() {
  const { appInfo, setAppInfo } = useSubmitStore();
  const [keywordInput, setKeywordInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEnglishNameChange = useCallback((val: string) => {
    setAppInfo({ englishName: val, appName: toAppName(val) });
  }, [setAppInfo]);

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 600;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, 600, 600);
        setAppInfo({ logo: canvas.toDataURL('image/png') });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, [setAppInfo]);

  const addKeyword = useCallback(() => {
    const kw = keywordInput.trim();
    if (kw && !(appInfo.keywords ?? []).includes(kw)) {
      setAppInfo({ keywords: [...(appInfo.keywords ?? []), kw] });
      setKeywordInput('');
    }
  }, [keywordInput, appInfo.keywords, setAppInfo]);

  const removeKeyword = useCallback((kw: string) => {
    setAppInfo({ keywords: (appInfo.keywords ?? []).filter((k) => k !== kw) });
  }, [appInfo.keywords, setAppInfo]);

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3182F6] focus:border-transparent bg-white transition";

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-gray-900">앱 정보 입력</h2>

      {/* 앱 이름 (한글) */}
      <div>
        <label className={labelClass}>앱 이름 (한글) *</label>
        <input
          className={inputClass}
          placeholder="예: 나의 미니앱"
          value={appInfo.name}
          onChange={(e) => setAppInfo({ name: e.target.value })}
        />
      </div>

      {/* 영어 앱 이름 */}
      <div>
        <label className={labelClass}>영어 앱 이름 *</label>
        <input
          className={inputClass}
          placeholder="예: My Mini App"
          value={appInfo.englishName}
          onChange={(e) => handleEnglishNameChange(e.target.value)}
        />
      </div>

      {/* appName (자동생성) */}
      <div>
        <label className={labelClass}>appName (자동생성)</label>
        <input
          className={`${inputClass} bg-gray-50`}
          value={appInfo.appName}
          onChange={(e) => setAppInfo({ appName: e.target.value })}
          placeholder="영어 이름 입력 시 자동 생성"
        />
        <p className="text-xs text-gray-400 mt-1">소문자, 하이픈만 허용</p>
      </div>

      {/* 부제 */}
      <div>
        <label className={labelClass}>부제 (20자 이내)</label>
        <div className="relative">
          <input
            className={`${inputClass} ${appInfo.subtitle.length > 20 ? 'border-red-400 focus:ring-red-400' : ''}`}
            placeholder="한 줄 소개"
            value={appInfo.subtitle}
            onChange={(e) => setAppInfo({ subtitle: e.target.value })}
            maxLength={25}
          />
          <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${appInfo.subtitle.length > 20 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
            {appInfo.subtitle.length}/20
          </span>
        </div>
      </div>

      {/* 카테고리 */}
      <div>
        <label className={labelClass}>카테고리 *</label>
        <select
          className={inputClass}
          value={appInfo.category}
          onChange={(e) => setAppInfo({ category: e.target.value })}
        >
          <option value="">카테고리 선택</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* 설명 */}
      <div>
        <label className={labelClass}>앱 설명</label>
        <textarea
          className={`${inputClass} min-h-[100px] resize-y`}
          placeholder="앱에 대한 상세 설명을 입력하세요"
          value={appInfo.description}
          onChange={(e) => setAppInfo({ description: e.target.value })}
        />
      </div>

      {/* 검색 키워드 (태그) */}
      <div>
        <label className={labelClass}>검색 키워드</label>
        <div className="flex gap-2">
          <input
            className={`${inputClass} flex-1`}
            placeholder="키워드 입력 후 Enter"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKeyword(); } }}
          />
          <button
            type="button"
            onClick={addKeyword}
            className="px-4 py-2 bg-[#3182F6] text-white rounded-xl text-sm font-medium hover:bg-[#1B64DA] transition"
          >
            추가
          </button>
        </div>
        {(appInfo.keywords ?? []).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {(appInfo.keywords ?? []).map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-[#3182F6] rounded-full text-sm"
              >
                {kw}
                <button onClick={() => removeKeyword(kw)} className="text-blue-300 hover:text-blue-600 ml-1">×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 연락처 이메일 */}
      <div>
        <label className={labelClass}>연락처 이메일 *</label>
        <input
          className={inputClass}
          type="email"
          placeholder="developer@example.com"
          value={appInfo.email}
          onChange={(e) => setAppInfo({ email: e.target.value })}
        />
      </div>

      {/* 연령 제한 */}
      <div>
        <label className={labelClass}>연령 제한</label>
        <div className="flex gap-3">
          {AGE_RATINGS.map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => setAppInfo({ ageRating: rating })}
              className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition ${
                appInfo.ageRating === rating
                  ? 'border-[#3182F6] bg-blue-50 text-[#3182F6]'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {rating}
            </button>
          ))}
        </div>
      </div>

      {/* 로고 업로드 */}
      <div>
        <label className={labelClass}>로고 (600×600 자동 리사이즈)</label>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-[#3182F6] hover:bg-blue-50/30 transition"
        >
          {appInfo.logo ? (
            <div className="flex flex-col items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={appInfo.logo} alt="로고 미리보기" className="w-24 h-24 rounded-2xl object-cover border" />
              <span className="text-xs text-gray-400">클릭하여 변경</span>
            </div>
          ) : (
            <div className="text-gray-400">
              <div className="text-3xl mb-2"></div>
              <p className="text-sm">이미지를 업로드하세요</p>
              <p className="text-xs text-gray-300 mt-1">PNG, JPG — 자동으로 600×600 리사이즈</p>
            </div>
          )}
        </div>
      </div>

      {/* 개인정보처리방침 URL */}
      <div>
        <label className={labelClass}>개인정보처리방침 URL</label>
        <input
          className={inputClass}
          type="url"
          placeholder="https://example.com/privacy"
          value={appInfo.privacyPolicyUrl}
          onChange={(e) => setAppInfo({ privacyPolicyUrl: e.target.value })}
        />
      </div>
    </div>
  );
}
