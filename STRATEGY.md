# 🚀 AppInToss Builder 고도화 전략 문서

> **버전**: v1.0.0  
> **작성일**: 2026-02-12  
> **목표**: 토스 미니앱 심사 직전선(90~95%)까지 자동 준비해주는 플랫폼  

---

## 📋 목차

1. [Toss MiniApp 대응 모드 설계](#1️⃣-toss-miniapp-대응-모드-설계)
2. [보안 자동 점검 시스템](#2️⃣-보안-자동-점검-시스템)
3. [심사용 문서 자동 생성기](#3️⃣-심사용-문서-자동-생성기)
4. [코드 Export 고도화](#4️⃣-코드-export-고도화)
5. [UX 플로우 개선](#5️⃣-ux-플로우-개선)
6. [핀테크 특화 컴포넌트](#6️⃣-핀테크-특화-컴포넌트)
7. [리스크 관리 전략](#7️⃣-리스크-관리-전략)
8. [기술 아키텍처 확장](#8️⃣-기술-아키텍처-확장)
9. [3개월 MVP 고도화 로드맵](#9️⃣-3개월-mvp-고도화-로드맵)
10. [사업성 강화 전략](#🔟-사업성-강화-전략)

---

## 1️⃣ Toss MiniApp 대응 모드 설계

### 개요
기존 Craft.js 기반 UI 빌더에 "Toss Submission Mode"를 추가하여, WebView 기반 토스 미니앱에 최적화된 프로젝트를 생성합니다.

### UI 플로우

```
┌─────────────────────────────────────────────────────────────┐
│  [빌더 상단 바]                                              │
│  ┌──────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│  │ 일반 모드    │  │ ✓ Toss 심사 모드  │  │ Export 설정   │  │
│  └──────────────┘  └──────────────────┘  └───────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Toss 모드 활성화 시:                                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ⚠️ Toss MiniApp 심사 요구사항 자동 적용 중           │   │
│  │ ✓ Safe-area 레이아웃  ✓ HTTPS 전용  ✓ SDK 브릿지    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [캔버스 - iPhone 15 Pro 프레임]                            │
│  ┌─────────────────────────────────────┐                   │
│  │ ▓▓▓▓▓▓▓ Safe Area Top ▓▓▓▓▓▓▓▓     │ ← 동적 노치 대응   │
│  ├─────────────────────────────────────┤                   │
│  │                                     │                   │
│  │     [사용자 컨텐츠 영역]             │                   │
│  │                                     │                   │
│  ├─────────────────────────────────────┤                   │
│  │ ▓▓▓▓▓ Safe Area Bottom ▓▓▓▓▓▓▓     │ ← 홈 인디케이터    │
│  └─────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

### 기능 상세

#### A. Toss 모드 토글 컴포넌트

```typescript
// src/components/editor/TossModeToggle.tsx
'use client';

import { useState } from 'react';
import { useEditor } from '@craftjs/core';

interface TossModeConfig {
  enabled: boolean;
  safeAreaTop: number;
  safeAreaBottom: number;
  sdkVersion: string;
  authMethod: 'toss_oauth' | 'custom' | 'none';
}

export const TossModeToggle = () => {
  const [config, setConfig] = useState<TossModeConfig>({
    enabled: false,
    safeAreaTop: 47,      // iPhone 동적 섬 기준
    safeAreaBottom: 34,   // 홈 인디케이터 영역
    sdkVersion: '1.0.0',
    authMethod: 'toss_oauth'
  });

  const { actions } = useEditor();

  const toggleTossMode = () => {
    const newEnabled = !config.enabled;
    setConfig(prev => ({ ...prev, enabled: newEnabled }));
    
    if (newEnabled) {
      // Safe-area 자동 적용
      actions.setOptions(options => ({
        ...options,
        tossMode: true,
        safeArea: {
          top: config.safeAreaTop,
          bottom: config.safeAreaBottom
        }
      }));
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
      <button
        onClick={toggleTossMode}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          config.enabled 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700'
        }`}
      >
        {config.enabled ? '✓ Toss 심사 모드' : 'Toss 모드 OFF'}
      </button>
      
      {config.enabled && (
        <div className="flex gap-4 text-sm text-blue-700">
          <span>✓ Safe-area 적용</span>
          <span>✓ HTTPS 강제</span>
          <span>✓ SDK 브릿지 포함</span>
        </div>
      )}
    </div>
  );
};
```

#### B. Safe-Area 자동 레이아웃 시스템

```typescript
// src/lib/toss/safeArea.ts
export interface SafeAreaConfig {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

// 디바이스별 Safe-area 프리셋
export const DEVICE_SAFE_AREAS: Record<string, SafeAreaConfig> = {
  'iphone-15-pro': { top: 59, bottom: 34, left: 0, right: 0 },
  'iphone-14': { top: 47, bottom: 34, left: 0, right: 0 },
  'iphone-se': { top: 20, bottom: 0, left: 0, right: 0 },
  'android-default': { top: 24, bottom: 0, left: 0, right: 0 },
  'android-gesture': { top: 24, bottom: 16, left: 0, right: 0 },
};

// CSS 생성 함수
export function generateSafeAreaCSS(config: SafeAreaConfig): string {
  return `
/* Toss MiniApp Safe-Area Styles */
:root {
  --safe-area-inset-top: ${config.top}px;
  --safe-area-inset-bottom: ${config.bottom}px;
  --safe-area-inset-left: ${config.left}px;
  --safe-area-inset-right: ${config.right}px;
}

/* iOS Safari 환경 변수 폴백 */
@supports (padding: env(safe-area-inset-top)) {
  :root {
    --safe-area-inset-top: env(safe-area-inset-top, ${config.top}px);
    --safe-area-inset-bottom: env(safe-area-inset-bottom, ${config.bottom}px);
    --safe-area-inset-left: env(safe-area-inset-left, ${config.left}px);
    --safe-area-inset-right: env(safe-area-inset-right, ${config.right}px);
  }
}

/* 메인 컨테이너 */
.toss-app-container {
  padding-top: var(--safe-area-inset-top);
  padding-bottom: var(--safe-area-inset-bottom);
  padding-left: var(--safe-area-inset-left);
  padding-right: var(--safe-area-inset-right);
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport height */
}

/* 고정 헤더 */
.toss-fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding-top: var(--safe-area-inset-top);
  z-index: 100;
}

/* 고정 하단 바 */
.toss-fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: var(--safe-area-inset-bottom);
  z-index: 100;
}
`;
}
```

#### C. Toss SDK 브릿지 인터페이스 추상화

```typescript
// src/lib/toss/sdkBridge.ts

/**
 * Toss MiniApp SDK 브릿지 추상화 레이어
 * 실제 Toss 환경과 개발 환경 모두에서 동작
 */

interface TossUser {
  id: string;
  name: string;
  profileImage?: string;
}

interface TossPaymentRequest {
  orderId: string;
  amount: number;
  orderName: string;
  customerName?: string;
}

interface TossSDKBridge {
  // 인증
  auth: {
    login(): Promise<{ accessToken: string; user: TossUser }>;
    logout(): Promise<void>;
    getAccessToken(): Promise<string | null>;
    isLoggedIn(): Promise<boolean>;
  };
  
  // 네비게이션
  navigation: {
    back(): void;
    close(): void;
    openExternal(url: string): void;
  };
  
  // 결제
  payment: {
    requestPayment(request: TossPaymentRequest): Promise<{ paymentKey: string }>;
    requestTossPay(request: TossPaymentRequest): Promise<{ paymentKey: string }>;
  };
  
  // 유틸리티
  utils: {
    share(data: { title: string; text?: string; url?: string }): Promise<void>;
    haptic(type: 'light' | 'medium' | 'heavy'): void;
    showToast(message: string): void;
  };
  
  // 디바이스
  device: {
    getSafeAreaInsets(): Promise<SafeAreaConfig>;
    getDeviceInfo(): Promise<{ platform: 'ios' | 'android'; version: string }>;
  };
}

// 실제 환경 감지
const isTossEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(window as any).TossApp || !!(window as any).webkit?.messageHandlers?.toss;
};

// 개발용 Mock SDK
const createMockSDK = (): TossSDKBridge => ({
  auth: {
    async login() {
      console.log('[Toss SDK Mock] login() called');
      return {
        accessToken: 'mock_token_' + Date.now(),
        user: { id: 'mock_user_1', name: '테스트 사용자' }
      };
    },
    async logout() {
      console.log('[Toss SDK Mock] logout() called');
    },
    async getAccessToken() {
      return localStorage.getItem('toss_mock_token');
    },
    async isLoggedIn() {
      return !!localStorage.getItem('toss_mock_token');
    }
  },
  navigation: {
    back() {
      console.log('[Toss SDK Mock] navigation.back()');
      window.history.back();
    },
    close() {
      console.log('[Toss SDK Mock] navigation.close()');
      window.close();
    },
    openExternal(url: string) {
      console.log('[Toss SDK Mock] openExternal:', url);
      window.open(url, '_blank');
    }
  },
  payment: {
    async requestPayment(request) {
      console.log('[Toss SDK Mock] requestPayment:', request);
      return { paymentKey: 'mock_payment_' + Date.now() };
    },
    async requestTossPay(request) {
      console.log('[Toss SDK Mock] requestTossPay:', request);
      return { paymentKey: 'mock_tosspay_' + Date.now() };
    }
  },
  utils: {
    async share(data) {
      console.log('[Toss SDK Mock] share:', data);
      if (navigator.share) {
        await navigator.share(data);
      }
    },
    haptic(type) {
      console.log('[Toss SDK Mock] haptic:', type);
      if (navigator.vibrate) {
        navigator.vibrate(type === 'light' ? 10 : type === 'medium' ? 20 : 30);
      }
    },
    showToast(message) {
      console.log('[Toss SDK Mock] toast:', message);
      // 토스트 UI 표시 로직
    }
  },
  device: {
    async getSafeAreaInsets() {
      return { top: 47, bottom: 34, left: 0, right: 0 };
    },
    async getDeviceInfo() {
      const ua = navigator.userAgent;
      return {
        platform: /iPhone|iPad/.test(ua) ? 'ios' : 'android',
        version: '1.0.0'
      };
    }
  }
});

// SDK 싱글톤 인스턴스
let sdkInstance: TossSDKBridge | null = null;

export const getTossSDK = (): TossSDKBridge => {
  if (sdkInstance) return sdkInstance;
  
  if (isTossEnvironment()) {
    // 실제 Toss 환경: 네이티브 브릿지 연결
    sdkInstance = (window as any).TossApp as TossSDKBridge;
  } else {
    // 개발 환경: Mock SDK 사용
    sdkInstance = createMockSDK();
  }
  
  return sdkInstance;
};

// React Hook
export const useTossSDK = () => {
  return getTossSDK();
};
```

#### D. OAuth 로그인 스켈레톤 코드 자동 생성

```typescript
// src/lib/toss/generators/authGenerator.ts

export interface AuthGeneratorConfig {
  provider: 'toss_oauth';
  scopes: string[];
  redirectUri: string;
  includeProfile: boolean;
  includePayment: boolean;
}

export function generateAuthCode(config: AuthGeneratorConfig): string {
  return `// src/hooks/useTossAuth.ts
// 자동 생성된 Toss OAuth 인증 훅
// 생성일: ${new Date().toISOString()}

import { useState, useEffect, useCallback } from 'react';
import { getTossSDK } from '@/lib/toss/sdkBridge';

interface TossUser {
  id: string;
  name: string;
  profileImage?: string;
  ${config.includePayment ? 'paymentMethods?: PaymentMethod[];' : ''}
}

${config.includePayment ? `
interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  name: string;
  lastFourDigits: string;
}
` : ''}

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: TossUser | null;
  accessToken: string | null;
  error: Error | null;
}

export function useTossAuth() {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    accessToken: null,
    error: null
  });

  const sdk = getTossSDK();

  // 초기 인증 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isLoggedIn = await sdk.auth.isLoggedIn();
        if (isLoggedIn) {
          const token = await sdk.auth.getAccessToken();
          setState(prev => ({
            ...prev,
            isLoading: false,
            isAuthenticated: true,
            accessToken: token
          }));
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error as Error
        }));
      }
    };
    
    checkAuth();
  }, []);

  // 로그인
  const login = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await sdk.auth.login();
      
      setState({
        isLoading: false,
        isAuthenticated: true,
        user: result.user,
        accessToken: result.accessToken,
        error: null
      });
      
      return result;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error as Error
      }));
      throw error;
    }
  }, [sdk]);

  // 로그아웃
  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await sdk.auth.logout();
      
      setState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        accessToken: null,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error as Error
      }));
      throw error;
    }
  }, [sdk]);

  return {
    ...state,
    login,
    logout
  };
}

// 로그인 버튼 컴포넌트
export function TossLoginButton({ 
  onSuccess,
  onError,
  children = '토스로 로그인'
}: {
  onSuccess?: (user: TossUser) => void;
  onError?: (error: Error) => void;
  children?: React.ReactNode;
}) {
  const { login, isLoading } = useTossAuth();
  
  const handleClick = async () => {
    try {
      const result = await login();
      onSuccess?.(result.user);
    } catch (error) {
      onError?.(error as Error);
    }
  };
  
  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#0064FF] text-white font-medium rounded-xl hover:bg-[#0057E0] disabled:opacity-50 transition-colors"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="white"/>
        <path d="M8 12L11 15L16 9" stroke="#0064FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {isLoading ? '로그인 중...' : children}
    </button>
  );
}
`;
}

// 생성된 컴포넌트 페이지
export function generateAuthPageCode(): string {
  return `// src/app/auth/page.tsx
// 자동 생성된 Toss 인증 페이지

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTossAuth, TossLoginButton } from '@/hooks/useTossAuth';

export default function AuthPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useTossAuth();
  
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">환영합니다</h1>
          <p className="mt-2 text-gray-600">토스 계정으로 간편하게 시작하세요</p>
        </div>
        
        <TossLoginButton
          onSuccess={(user) => {
            console.log('로그인 성공:', user);
          }}
          onError={(error) => {
            console.error('로그인 실패:', error);
          }}
        />
        
        <p className="text-xs text-center text-gray-500">
          로그인 시 서비스 이용약관과 개인정보처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
`;
}
```

### 🚀 즉시 실행 가능한 첫 단계

```bash
# 1. Toss 모드 관련 디렉토리 구조 생성
mkdir -p src/lib/toss
mkdir -p src/lib/toss/generators
mkdir -p src/components/toss

# 2. 핵심 파일 생성 (위 코드들)
touch src/lib/toss/sdkBridge.ts
touch src/lib/toss/safeArea.ts
touch src/components/editor/TossModeToggle.tsx

# 3. package.json에 SDK 타입 추가 (개발 참조용)
npm install --save-dev @types/node
```

---

## 2️⃣ 보안 자동 점검 시스템

### 개요
토스 미니앱 심사에서 요구하는 보안 요구사항을 자동으로 점검하고, PDF 리포트를 생성합니다.

### 점검 항목 및 구현 방법

| 항목 | 점수 | 점검 방법 | 통과 기준 |
|------|------|-----------|-----------|
| HTTPS 적용 | 15점 | URL 스캔, 하드코딩 체크 | 모든 외부 요청이 https:// |
| CSP 헤더 | 15점 | next.config 분석 | CSP 헤더 설정 존재 |
| XSS 방지 | 20점 | dangerouslySetInnerHTML 검색 | 미사용 또는 sanitize 적용 |
| JWT 보안 | 15점 | 토큰 저장 위치 검사 | httpOnly 쿠키 사용 |
| 개인정보 암호화 | 20점 | 민감 필드 패턴 검색 | 암호화 함수 사용 |
| 로그 보관 정책 | 15점 | 로깅 설정 확인 | 90일 이상 보관 설정 |
| **총점** | **100점** | | |

### 점검 엔진 구현

```typescript
// src/lib/security/scanner.ts

export interface SecurityCheckResult {
  id: string;
  name: string;
  category: 'network' | 'data' | 'auth' | 'logging';
  score: number;
  maxScore: number;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  details: string[];
  recommendations: string[];
  codeLocation?: { file: string; line: number }[];
}

export interface SecurityReport {
  generatedAt: string;
  projectName: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  checks: SecurityCheckResult[];
  summary: {
    passed: number;
    warnings: number;
    failed: number;
  };
}

// HTTPS 점검
export async function checkHTTPS(projectPath: string): Promise<SecurityCheckResult> {
  const issues: string[] = [];
  const locations: { file: string; line: number }[] = [];
  
  // 파일 스캔 로직 (실제 구현 시)
  const httpPattern = /http:\/\/(?!localhost|127\.0\.0\.1)/g;
  
  // 예시 스캔 결과
  const files = await scanProjectFiles(projectPath, ['*.ts', '*.tsx', '*.js']);
  
  for (const file of files) {
    const content = await readFile(file);
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      if (httpPattern.test(line)) {
        issues.push(`${file}:${index + 1} - 비암호화 HTTP 요청 발견`);
        locations.push({ file, line: index + 1 });
      }
    });
  }
  
  const passed = issues.length === 0;
  
  return {
    id: 'https-check',
    name: 'HTTPS 적용 검사',
    category: 'network',
    score: passed ? 15 : 0,
    maxScore: 15,
    status: passed ? 'pass' : 'fail',
    message: passed 
      ? '모든 외부 요청이 HTTPS를 사용합니다.' 
      : `${issues.length}개의 비암호화 HTTP 요청이 발견되었습니다.`,
    details: issues,
    recommendations: passed ? [] : [
      '모든 http:// URL을 https://로 변경하세요.',
      'next.config.js에서 HTTPS 리다이렉션을 설정하세요.',
      '환경 변수의 API URL이 HTTPS인지 확인하세요.'
    ],
    codeLocation: locations
  };
}

// CSP 헤더 점검
export async function checkCSP(projectPath: string): Promise<SecurityCheckResult> {
  const nextConfigPath = `${projectPath}/next.config.mjs`;
  const middlewarePath = `${projectPath}/src/middleware.ts`;
  
  let hasCSP = false;
  let cspConfig = '';
  
  // next.config.mjs 확인
  try {
    const config = await readFile(nextConfigPath);
    if (config.includes('Content-Security-Policy') || config.includes('contentSecurityPolicy')) {
      hasCSP = true;
      cspConfig = 'next.config.mjs에서 설정됨';
    }
  } catch {}
  
  // middleware.ts 확인
  try {
    const middleware = await readFile(middlewarePath);
    if (middleware.includes('Content-Security-Policy')) {
      hasCSP = true;
      cspConfig = 'middleware.ts에서 설정됨';
    }
  } catch {}
  
  return {
    id: 'csp-check',
    name: 'CSP(Content Security Policy) 검사',
    category: 'network',
    score: hasCSP ? 15 : 0,
    maxScore: 15,
    status: hasCSP ? 'pass' : 'fail',
    message: hasCSP 
      ? `CSP 헤더가 설정되어 있습니다. (${cspConfig})`
      : 'CSP 헤더가 설정되지 않았습니다.',
    details: hasCSP ? [cspConfig] : ['CSP 헤더 미설정'],
    recommendations: hasCSP ? [] : [
      'next.config.mjs에 securityHeaders 설정을 추가하세요.',
      "default-src 'self' 정책으로 시작하세요.",
      '필요한 외부 도메인만 허용 목록에 추가하세요.'
    ]
  };
}

// XSS 방지 점검
export async function checkXSS(projectPath: string): Promise<SecurityCheckResult> {
  const dangerousPatterns = [
    { pattern: /dangerouslySetInnerHTML/g, name: 'dangerouslySetInnerHTML' },
    { pattern: /innerHTML\s*=/g, name: 'innerHTML 직접 할당' },
    { pattern: /eval\(/g, name: 'eval() 사용' },
    { pattern: /document\.write/g, name: 'document.write 사용' }
  ];
  
  const issues: string[] = [];
  const locations: { file: string; line: number }[] = [];
  
  const files = await scanProjectFiles(projectPath, ['*.tsx', '*.ts']);
  
  for (const file of files) {
    const content = await readFile(file);
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      for (const { pattern, name } of dangerousPatterns) {
        if (pattern.test(line)) {
          // sanitize 함수 사용 여부 확인
          if (!line.includes('DOMPurify') && !line.includes('sanitize')) {
            issues.push(`${file}:${index + 1} - ${name} (sanitize 미적용)`);
            locations.push({ file, line: index + 1 });
          }
        }
      }
    });
  }
  
  const score = issues.length === 0 ? 20 : Math.max(0, 20 - issues.length * 5);
  
  return {
    id: 'xss-check',
    name: 'XSS 방지 검사',
    category: 'data',
    score,
    maxScore: 20,
    status: issues.length === 0 ? 'pass' : issues.length <= 2 ? 'warning' : 'fail',
    message: issues.length === 0 
      ? 'XSS 취약점이 발견되지 않았습니다.'
      : `${issues.length}개의 잠재적 XSS 취약점이 발견되었습니다.`,
    details: issues,
    recommendations: issues.length === 0 ? [] : [
      'DOMPurify 라이브러리를 사용하여 HTML을 sanitize하세요.',
      '사용자 입력값을 직접 DOM에 삽입하지 마세요.',
      'React의 기본 escape 기능을 활용하세요.'
    ],
    codeLocation: locations
  };
}

// JWT 보안 점검
export async function checkJWTSecurity(projectPath: string): Promise<SecurityCheckResult> {
  const issues: string[] = [];
  const goodPractices: string[] = [];
  
  const files = await scanProjectFiles(projectPath, ['*.ts', '*.tsx']);
  
  for (const file of files) {
    const content = await readFile(file);
    
    // 나쁜 패턴
    if (content.includes('localStorage.setItem') && content.includes('token')) {
      issues.push(`${file} - JWT를 localStorage에 저장 (XSS 취약)`)
    }
    
    if (content.includes('sessionStorage.setItem') && content.includes('token')) {
      issues.push(`${file} - JWT를 sessionStorage에 저장 (XSS 취약)`);
    }
    
    // 좋은 패턴
    if (content.includes('httpOnly') && content.includes('cookie')) {
      goodPractices.push(`${file} - httpOnly 쿠키 사용`);
    }
  }
  
  const passed = issues.length === 0 && goodPractices.length > 0;
  
  return {
    id: 'jwt-check',
    name: 'JWT 보안 검사',
    category: 'auth',
    score: passed ? 15 : goodPractices.length > 0 ? 10 : 0,
    maxScore: 15,
    status: passed ? 'pass' : issues.length > 0 ? 'fail' : 'warning',
    message: passed 
      ? 'JWT가 안전하게 관리되고 있습니다.'
      : issues.length > 0 
        ? 'JWT 저장 방식에 보안 문제가 있습니다.'
        : 'JWT 보안 설정을 확인할 수 없습니다.',
    details: [...issues, ...goodPractices],
    recommendations: [
      'JWT는 httpOnly, Secure, SameSite 옵션이 설정된 쿠키에 저장하세요.',
      'localStorage/sessionStorage에 민감한 토큰을 저장하지 마세요.',
      '토큰 만료 시간을 적절히 설정하세요 (권장: 15분~1시간).'
    ]
  };
}

// 개인정보 암호화 점검
export async function checkDataEncryption(projectPath: string): Promise<SecurityCheckResult> {
  const sensitivePatterns = [
    'password', 'ssn', 'resident', 'phone', 'email', 'address',
    'cardNumber', 'accountNumber', 'birthDate', '주민등록', '전화번호'
  ];
  
  const encryptionPatterns = [
    'encrypt', 'hash', 'bcrypt', 'crypto', 'aes', 'sha256'
  ];
  
  const issues: string[] = [];
  const files = await scanProjectFiles(projectPath, ['*.ts', '*.tsx']);
  
  for (const file of files) {
    const content = await readFile(file);
    const hasEncryption = encryptionPatterns.some(p => content.toLowerCase().includes(p));
    
    for (const pattern of sensitivePatterns) {
      if (content.toLowerCase().includes(pattern)) {
        if (!hasEncryption) {
          issues.push(`${file} - '${pattern}' 필드에 암호화 미적용 가능성`);
        }
      }
    }
  }
  
  const score = issues.length === 0 ? 20 : Math.max(0, 20 - issues.length * 4);
  
  return {
    id: 'encryption-check',
    name: '개인정보 암호화 검사',
    category: 'data',
    score,
    maxScore: 20,
    status: issues.length === 0 ? 'pass' : issues.length <= 3 ? 'warning' : 'fail',
    message: issues.length === 0 
      ? '민감한 데이터가 적절히 보호되고 있습니다.'
      : `${issues.length}개 항목에서 암호화 미적용이 의심됩니다.`,
    details: issues,
    recommendations: [
      '비밀번호는 bcrypt로 해시하세요.',
      '주민등록번호, 카드번호 등은 AES-256으로 암호화하세요.',
      'DB 전송 시 TLS 1.3을 사용하세요.'
    ]
  };
}

// 로그 보관 점검
export async function checkLogging(projectPath: string): Promise<SecurityCheckResult> {
  const loggingLibraries = ['winston', 'pino', 'bunyan', 'morgan', 'log4js'];
  const packageJson = await readFile(`${projectPath}/package.json`);
  const pkg = JSON.parse(packageJson);
  
  const hasLoggingLib = loggingLibraries.some(lib => 
    pkg.dependencies?.[lib] || pkg.devDependencies?.[lib]
  );
  
  // 로깅 설정 파일 확인
  let hasRetentionPolicy = false;
  try {
    const files = await scanProjectFiles(projectPath, ['*logger*', '*logging*']);
    for (const file of files) {
      const content = await readFile(file);
      if (content.includes('retention') || content.includes('maxFiles') || content.includes('90')) {
        hasRetentionPolicy = true;
      }
    }
  } catch {}
  
  const score = hasLoggingLib && hasRetentionPolicy ? 15 : hasLoggingLib ? 10 : 0;
  
  return {
    id: 'logging-check',
    name: '로그 보관 정책 검사',
    category: 'logging',
    score,
    maxScore: 15,
    status: score === 15 ? 'pass' : score > 0 ? 'warning' : 'fail',
    message: score === 15 
      ? '로깅 시스템과 보관 정책이 설정되어 있습니다.'
      : hasLoggingLib 
        ? '로깅 라이브러리는 있으나 보관 정책 설정이 필요합니다.'
        : '로깅 시스템이 설정되지 않았습니다.',
    details: hasLoggingLib 
      ? ['로깅 라이브러리 설치됨', hasRetentionPolicy ? '보관 정책 설정됨' : '보관 정책 미설정']
      : ['로깅 라이브러리 미설치'],
    recommendations: [
      'winston 또는 pino 로깅 라이브러리를 설치하세요.',
      '로그 보관 기간을 최소 90일로 설정하세요.',
      '개인정보가 로그에 기록되지 않도록 마스킹하세요.'
    ]
  };
}

// 전체 보안 스캔 실행
export async function runSecurityScan(projectPath: string): Promise<SecurityReport> {
  const checks = await Promise.all([
    checkHTTPS(projectPath),
    checkCSP(projectPath),
    checkXSS(projectPath),
    checkJWTSecurity(projectPath),
    checkDataEncryption(projectPath),
    checkLogging(projectPath)
  ]);
  
  const totalScore = checks.reduce((sum, c) => sum + c.score, 0);
  const maxScore = checks.reduce((sum, c) => sum + c.maxScore, 0);
  const percentage = Math.round((totalScore / maxScore) * 100);
  
  const grade = 
    percentage >= 90 ? 'A' :
    percentage >= 80 ? 'B' :
    percentage >= 70 ? 'C' :
    percentage >= 60 ? 'D' : 'F';
  
  return {
    generatedAt: new Date().toISOString(),
    projectName: projectPath.split('/').pop() || 'unknown',
    totalScore,
    maxScore,
    percentage,
    grade,
    checks,
    summary: {
      passed: checks.filter(c => c.status === 'pass').length,
      warnings: checks.filter(c => c.status === 'warning').length,
      failed: checks.filter(c => c.status === 'fail').length
    }
  };
}

// 헬퍼 함수 (실제 구현 필요)
async function scanProjectFiles(path: string, patterns: string[]): Promise<string[]> {
  // glob 패턴으로 파일 스캔
  return [];
}

async function readFile(path: string): Promise<string> {
  // 파일 읽기
  return '';
}
```

### PDF 리포트 생성

```typescript
// src/lib/security/pdfGenerator.ts

import { jsPDF } from 'jspdf';
import { SecurityReport } from './scanner';

export async function generateSecurityPDF(report: SecurityReport): Promise<Blob> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // 헤더
  doc.setFontSize(24);
  doc.setTextColor(0, 100, 255);
  doc.text('보안 점검 리포트', pageWidth / 2, 30, { align: 'center' });
  
  // 프로젝트 정보
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`프로젝트: ${report.projectName}`, 20, 50);
  doc.text(`생성일시: ${new Date(report.generatedAt).toLocaleString('ko-KR')}`, 20, 58);
  
  // 총점 박스
  const gradeColors = {
    'A': [34, 197, 94],   // green
    'B': [59, 130, 246],  // blue
    'C': [234, 179, 8],   // yellow
    'D': [249, 115, 22],  // orange
    'F': [239, 68, 68]    // red
  };
  
  const [r, g, b] = gradeColors[report.grade];
  doc.setFillColor(r, g, b);
  doc.roundedRect(20, 70, pageWidth - 40, 40, 5, 5, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.text(report.grade, 40, 95);
  
  doc.setFontSize(16);
  doc.text(`${report.totalScore} / ${report.maxScore}점 (${report.percentage}%)`, 70, 92);
  
  doc.setFontSize(10);
  doc.text(`통과: ${report.summary.passed} | 경고: ${report.summary.warnings} | 실패: ${report.summary.failed}`, 70, 102);
  
  // 상세 점검 결과
  let yPos = 130;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text('상세 점검 결과', 20, yPos);
  yPos += 15;
  
  for (const check of report.checks) {
    if (yPos > 270) {
      doc.addPage();
      yPos = 30;
    }
    
    // 상태 아이콘
    const statusColors = {
      'pass': [34, 197, 94],
      'warning': [234, 179, 8],
      'fail': [239, 68, 68]
    };
    const [sr, sg, sb] = statusColors[check.status];
    doc.setFillColor(sr, sg, sb);
    doc.circle(25, yPos - 3, 3, 'F');
    
    // 항목명과 점수
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`${check.name}`, 32, yPos);
    doc.text(`${check.score}/${check.maxScore}점`, pageWidth - 40, yPos);
    
    yPos += 7;
    
    // 메시지
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(check.message, 32, yPos);
    
    yPos += 12;
  }
  
  // 권장 조치사항
  doc.addPage();
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('권장 조치사항', 20, 30);
  
  yPos = 45;
  for (const check of report.checks.filter(c => c.status !== 'pass')) {
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`▸ ${check.name}`, 20, yPos);
    yPos += 8;
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    for (const rec of check.recommendations) {
      doc.text(`  • ${rec}`, 25, yPos);
      yPos += 6;
    }
    yPos += 5;
  }
  
  // 면책조항
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    '본 리포트는 자동화된 정적 분석 결과이며, 실제 보안 심사를 대체하지 않습니다.',
    pageWidth / 2, 
    doc.internal.pageSize.getHeight() - 10, 
    { align: 'center' }
  );
  
  return doc.output('blob');
}
```

### 기술 스택

| 용도 | 라이브러리 | 이유 |
|------|-----------|------|
| PDF 생성 | jspdf | 클라이언트 사이드, 무료, 한글 지원 |
| 코드 스캔 | glob, fs | Node.js 기본 |
| AST 분석 | @typescript-eslint/parser | TypeScript 정확한 파싱 |
| 리포트 UI | React + Tailwind | 기존 스택 활용 |

### 🚀 즉시 실행 가능한 첫 단계

```bash
# 1. PDF 라이브러리 설치
npm install jspdf

# 2. 보안 스캐너 디렉토리 생성
mkdir -p src/lib/security

# 3. 기본 스캐너 파일 생성
touch src/lib/security/scanner.ts
touch src/lib/security/pdfGenerator.ts
touch src/lib/security/checks/index.ts
```

---

## 3️⃣ 심사용 문서 자동 생성기

### 개요
토스 미니앱 심사에 필요한 모든 문서를 사용자 입력 기반으로 자동 생성합니다.

### 문서 목록 및 템플릿 구조

#### A. 개인정보처리방침

```typescript
// src/lib/docs/templates/privacyPolicy.ts

export interface PrivacyPolicyInput {
  serviceName: string;
  companyName: string;
  representativeName: string;
  businessNumber: string;
  address: string;
  email: string;
  phone: string;
  
  // 수집 정보
  collectedData: {
    required: string[];  // 필수 항목
    optional: string[];  // 선택 항목
  };
  
  // 수집 목적
  purposes: string[];
  
  // 보관 기간
  retentionPeriod: string;
  
  // 제3자 제공
  thirdParties: {
    name: string;
    items: string[];
    purpose: string;
  }[];
  
  // 위탁
  outsourcing: {
    company: string;
    task: string;
  }[];
  
  // 해외 이전
  overseasTransfer: boolean;
}

export function generatePrivacyPolicy(input: PrivacyPolicyInput): string {
  const today = new Date().toISOString().split('T')[0];
  
  return `# 개인정보처리방침

**${input.serviceName}** (이하 "서비스")를 운영하는 **${input.companyName}**(이하 "회사")은 이용자의 개인정보를 중요시하며, 「개인정보 보호법」을 준수합니다.

**시행일**: ${today}

## 1. 수집하는 개인정보 항목

### 필수 항목
${input.collectedData.required.map(item => `- ${item}`).join('\n')}

### 선택 항목
${input.collectedData.optional.length > 0 
  ? input.collectedData.optional.map(item => `- ${item}`).join('\n')
  : '- 없음'}

## 2. 개인정보의 수집 및 이용 목적

${input.purposes.map((p, i) => `${i + 1}. ${p}`).join('\n')}

## 3. 개인정보의 보유 및 이용 기간

회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.

- **보관 기간**: ${input.retentionPeriod}
- 단, 관계법령에 따라 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보관합니다.

## 4. 개인정보의 제3자 제공

${input.thirdParties.length > 0 ? `
회사는 다음과 같이 이용자의 개인정보를 제3자에게 제공합니다.

| 제공받는 자 | 제공 항목 | 제공 목적 |
|------------|----------|----------|
${input.thirdParties.map(tp => `| ${tp.name} | ${tp.items.join(', ')} | ${tp.purpose} |`).join('\n')}
` : '회사는 이용자의 개인정보를 제3자에게 제공하지 않습니다.'}

## 5. 개인정보 처리 위탁

${input.outsourcing.length > 0 ? `
회사는 서비스 향상을 위해 다음과 같이 개인정보 처리를 위탁합니다.

| 수탁업체 | 위탁 업무 |
|---------|----------|
${input.outsourcing.map(o => `| ${o.company} | ${o.task} |`).join('\n')}
` : '회사는 개인정보 처리를 위탁하지 않습니다.'}

## 6. 개인정보의 파기 절차 및 방법

- **파기 절차**: 보유 기간 경과 시 자동 파기
- **파기 방법**: 
  - 전자적 파일: 복구 불가능한 방법으로 영구 삭제
  - 종이 문서: 분쇄 또는 소각

## 7. 이용자의 권리와 행사 방법

이용자는 언제든지 다음의 권리를 행사할 수 있습니다:

1. 개인정보 열람 요구
2. 개인정보 정정·삭제 요구
3. 개인정보 처리정지 요구
4. 개인정보 이동 요구

권리 행사는 아래 개인정보 보호책임자에게 연락하시기 바랍니다.

## 8. 개인정보 보호책임자

- **성명**: ${input.representativeName}
- **이메일**: ${input.email}
- **전화번호**: ${input.phone}

## 9. 개인정보 안전성 확보 조치

회사는 다음과 같은 안전성 확보 조치를 취하고 있습니다:

1. 개인정보 암호화
2. 해킹 등에 대비한 기술적 대책
3. 접근 권한 관리
4. 개인정보 취급 직원 최소화 및 교육

## 10. 개인정보처리방침 변경

이 개인정보처리방침은 시행일로부터 적용되며, 변경 시 웹사이트를 통해 공지합니다.

---

**${input.companyName}**
- 사업자등록번호: ${input.businessNumber}
- 주소: ${input.address}
- 대표: ${input.representativeName}
`;
}
```

#### B. 이용약관

```typescript
// src/lib/docs/templates/termsOfService.ts

export interface TermsOfServiceInput {
  serviceName: string;
  companyName: string;
  serviceDescription: string;
  website: string;
  email: string;
  
  // 서비스 관련
  paidFeatures: string[];
  refundPolicy: string;
  
  // 제한 사항
  prohibitedActivities: string[];
  
  // 면책
  disclaimers: string[];
}

export function generateTermsOfService(input: TermsOfServiceInput): string {
  return `# 이용약관

## 제1장 총칙

### 제1조 (목적)
이 약관은 **${input.companyName}**(이하 "회사")이 제공하는 **${input.serviceName}** 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

### 제2조 (용어의 정의)
1. "서비스"란 ${input.serviceDescription}을 말합니다.
2. "이용자"란 이 약관에 따라 서비스를 이용하는 자를 말합니다.
3. "콘텐츠"란 서비스 내에서 제공되는 텍스트, 이미지, 영상 등을 말합니다.

### 제3조 (약관의 효력 및 변경)
1. 이 약관은 서비스 화면에 게시하거나 기타 방법으로 공지함으로써 효력이 발생합니다.
2. 회사는 필요한 경우 약관을 변경할 수 있으며, 변경 시 7일 전에 공지합니다.
3. 이용자가 변경된 약관에 동의하지 않는 경우, 서비스 이용을 중단할 수 있습니다.

## 제2장 서비스 이용

### 제4조 (서비스 제공)
1. 회사는 다음과 같은 서비스를 제공합니다:
   - ${input.serviceDescription}
2. 서비스는 연중무휴 24시간 제공을 원칙으로 합니다.
3. 회사는 시스템 점검 등의 사유로 서비스를 일시 중단할 수 있습니다.

### 제5조 (서비스 이용 제한)
이용자가 다음 행위를 하는 경우 서비스 이용을 제한할 수 있습니다:

${input.prohibitedActivities.map((activity, i) => `${i + 1}. ${activity}`).join('\n')}

${input.paidFeatures.length > 0 ? `
## 제3장 유료 서비스

### 제6조 (유료 서비스)
1. 다음은 유료 서비스입니다:
${input.paidFeatures.map(f => `   - ${f}`).join('\n')}

### 제7조 (환불 정책)
${input.refundPolicy}
` : ''}

## 제${input.paidFeatures.length > 0 ? '4' : '3'}장 기타

### 제${input.paidFeatures.length > 0 ? '8' : '6'}조 (면책)
${input.disclaimers.map((d, i) => `${i + 1}. ${d}`).join('\n')}

### 제${input.paidFeatures.length > 0 ? '9' : '7'}조 (분쟁 해결)
1. 서비스 이용과 관련하여 분쟁이 발생한 경우, 회사와 이용자는 원만히 해결하기 위해 노력합니다.
2. 분쟁이 해결되지 않는 경우, 회사 소재지 관할 법원을 전속 관할로 합니다.

---

**부칙**
이 약관은 ${new Date().toISOString().split('T')[0]}부터 시행됩니다.

**${input.companyName}**
웹사이트: ${input.website}
문의: ${input.email}
`;
}
```

#### C. OpenAPI 명세 자동 생성

```typescript
// src/lib/docs/generators/openApiGenerator.ts

export interface EndpointDefinition {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  summary: string;
  description?: string;
  tags: string[];
  requestBody?: {
    type: string;
    properties: Record<string, { type: string; description: string; required?: boolean }>;
  };
  responses: {
    code: number;
    description: string;
    schema?: object;
  }[];
  auth: 'none' | 'bearer' | 'api-key';
}

export function generateOpenAPISpec(
  serviceName: string,
  version: string,
  baseUrl: string,
  endpoints: EndpointDefinition[]
): object {
  const spec = {
    openapi: '3.0.3',
    info: {
      title: `${serviceName} API`,
      version,
      description: `${serviceName} 서비스의 REST API 명세입니다.`,
      contact: {
        email: 'api@example.com'
      }
    },
    servers: [
      { url: baseUrl, description: 'Production Server' },
      { url: 'http://localhost:3000/api', description: 'Development Server' }
    ],
    tags: [...new Set(endpoints.flatMap(e => e.tags))].map(tag => ({ name: tag })),
    paths: {},
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key'
        }
      },
      schemas: {}
    }
  };

  for (const endpoint of endpoints) {
    if (!spec.paths[endpoint.path]) {
      spec.paths[endpoint.path] = {};
    }

    const operation: any = {
      summary: endpoint.summary,
      description: endpoint.description || endpoint.summary,
      tags: endpoint.tags,
      responses: {}
    };

    // 인증 설정
    if (endpoint.auth === 'bearer') {
      operation.security = [{ bearerAuth: [] }];
    } else if (endpoint.auth === 'api-key') {
      operation.security = [{ apiKey: [] }];
    }

    // 요청 바디
    if (endpoint.requestBody) {
      const properties = {};
      const required = [];

      for (const [key, prop] of Object.entries(endpoint.requestBody.properties)) {
        properties[key] = {
          type: prop.type,
          description: prop.description
        };
        if (prop.required) {
          required.push(key);
        }
      }

      operation.requestBody = {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties,
              required
            }
          }
        }
      };
    }

    // 응답
    for (const response of endpoint.responses) {
      operation.responses[response.code] = {
        description: response.description,
        content: response.schema ? {
          'application/json': {
            schema: response.schema
          }
        } : undefined
      };
    }

    spec.paths[endpoint.path][endpoint.method.toLowerCase()] = operation;
  }

  return spec;
}

// YAML 포맷 출력
export function toYAML(spec: object): string {
  // 간단한 YAML 변환 (실제로는 js-yaml 라이브러리 사용)
  return JSON.stringify(spec, null, 2)
    .replace(/"/g, '')
    .replace(/,$/gm, '')
    .replace(/^\s*{/gm, '')
    .replace(/^\s*}/gm, '');
}
```

#### D. 서버 아키텍처 다이어그램

```typescript
// src/lib/docs/generators/architectureDiagram.ts

export interface ArchitectureConfig {
  frontend: {
    framework: string;
    hosting: string;
    cdn?: string;
  };
  backend: {
    framework: string;
    hosting: string;
    region: string;
  };
  database: {
    type: string;
    provider: string;
    encryption: boolean;
  };
  external: {
    name: string;
    purpose: string;
  }[];
  security: {
    waf: boolean;
    ddos: boolean;
    ssl: boolean;
  };
}

export function generateArchitectureDiagram(config: ArchitectureConfig): string {
  return `# 서버 아키텍처 문서

## 시스템 구성도

\`\`\`
┌──────────────────────────────────────────────────────────────────────┐
│                           사용자 (토스 앱)                            │
└─────────────────────────────────┬────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         CDN / Edge Network                           │
│                      ${config.frontend.cdn || 'Vercel Edge'}                                │
│${config.security.ddos ? '                         [DDoS Protection ✓]                         ' : ''}│
│${config.security.waf ? '                           [WAF Enabled ✓]                           ' : ''}│
└─────────────────────────────────┬────────────────────────────────────┘
                                  │ HTTPS (TLS 1.3)
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         Frontend Application                         │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  ${config.frontend.framework.padEnd(20)}                              │   │
│  │  Hosting: ${config.frontend.hosting.padEnd(47)}│   │
│  │  [Static Assets] [SPA/SSR] [Service Worker]                  │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────┬────────────────────────────────────┘
                                  │ REST API / WebSocket
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         Backend Application                          │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  ${config.backend.framework.padEnd(20)}                              │   │
│  │  Hosting: ${config.backend.hosting.padEnd(47)}│   │
│  │  Region: ${config.backend.region.padEnd(48)}│   │
│  │  [API Gateway] [Auth Service] [Business Logic]               │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────┬────────────────────────────────────┘
                                  │ Encrypted Connection
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                            Database Layer                            │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  ${config.database.type.padEnd(20)} (${config.database.provider})     │   │
│  │  ${config.database.encryption ? '[AES-256 Encryption ✓] [TLS in Transit ✓]' : '[Encryption Required]'}               │   │
│  │  [Backup: Daily] [Retention: 30 days]                        │   │
│  └──────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘

${config.external.length > 0 ? `
## 외부 연동 서비스

\`\`\`
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
${config.external.slice(0, 3).map(ext => 
  `│ ${ext.name.padEnd(14)} │     │ ${ext.purpose.padEnd(14)} │`
).join('\n')}
└────────────────┘     └────────────────┘     └────────────────┘
\`\`\`
` : ''}

## 보안 구성

| 항목 | 상태 | 설명 |
|------|------|------|
| SSL/TLS | ${config.security.ssl ? '✓ 적용' : '✗ 미적용'} | TLS 1.3, 강력한 암호화 스위트 |
| WAF | ${config.security.waf ? '✓ 적용' : '✗ 미적용'} | SQL Injection, XSS 방어 |
| DDoS | ${config.security.ddos ? '✓ 적용' : '✗ 미적용'} | Layer 3/4/7 보호 |
| 암호화 | ${config.database.encryption ? '✓ 적용' : '✗ 미적용'} | AES-256 데이터 암호화 |

## 데이터 센터 위치

- **메인 리전**: ${config.backend.region}
- **데이터 저장**: 국내 데이터센터
- **개인정보**: 국외 이전 없음
`;
}
```

#### E. 데이터 흐름도

```typescript
// src/lib/docs/generators/dataFlowDiagram.ts

export interface DataFlowConfig {
  userActions: {
    action: string;
    dataCollected: string[];
    destination: string;
  }[];
  dataProcessing: {
    stage: string;
    input: string;
    output: string;
    encryption: boolean;
  }[];
  dataStorage: {
    type: string;
    data: string[];
    retention: string;
  }[];
}

export function generateDataFlowDiagram(config: DataFlowConfig): string {
  return `# 데이터 흐름도

## 1. 사용자 데이터 수집 흐름

\`\`\`
┌─────────────────────────────────────────────────────────────────────┐
│                          사용자 액션                                 │
└─────────────────────────────────────────────────────────────────────┘
${config.userActions.map(ua => `
       │ ${ua.action}
       ▼
┌─────────────────────────────────────────────────────────────────────┐
│  수집 데이터: ${ua.dataCollected.join(', ').padEnd(50)}│
│  전송 대상: ${ua.destination.padEnd(53)}│
│  암호화: TLS 1.3                                                    │
└─────────────────────────────────────────────────────────────────────┘
`).join('\n')}

## 2. 데이터 처리 단계

\`\`\`
${config.dataProcessing.map((dp, i) => `
[${i + 1}] ${dp.stage}
    Input:  ${dp.input}
    Output: ${dp.output}
    암호화: ${dp.encryption ? '✓ 적용' : '✗ 미적용'}
       │
       ▼`).join('\n')}
\`\`\`

## 3. 데이터 저장 현황

| 저장소 | 저장 데이터 | 보관 기간 |
|--------|------------|----------|
${config.dataStorage.map(ds => 
  `| ${ds.type} | ${ds.data.join(', ')} | ${ds.retention} |`
).join('\n')}

## 4. 개인정보 흐름 요약

\`\`\`
┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐
│ 사용자  │───▶│  앱    │───▶│ 서버   │───▶│  DB   │
└────────┘    └────────┘    └────────┘    └────────┘
     │              │              │             │
     │   [TLS 1.3]  │   [TLS 1.3]  │  [AES-256]  │
     │              │              │             │
     ▼              ▼              ▼             ▼
  입력/동의      검증/필터링    처리/가공     암호화 저장
\`\`\`

## 5. 데이터 삭제 흐름

1. **회원 탈퇴 시**: 즉시 개인정보 삭제 (백업 포함 30일 이내)
2. **보관 기간 만료**: 자동 배치로 일괄 삭제
3. **삭제 방법**: 
   - DB: TRUNCATE + 백업 삭제
   - 파일: 안전한 덮어쓰기 후 삭제
   - 로그: 마스킹 처리
`;
}
```

### 사용자 입력 폼 UI

```typescript
// src/components/docs/DocumentGenerator.tsx

'use client';

import { useState } from 'react';
import { generatePrivacyPolicy, PrivacyPolicyInput } from '@/lib/docs/templates/privacyPolicy';
import { generateTermsOfService, TermsOfServiceInput } from '@/lib/docs/templates/termsOfService';

type DocumentType = 'privacy' | 'terms' | 'openapi' | 'architecture' | 'dataflow' | 'security';

interface DocumentGeneratorProps {
  onGenerate: (docType: DocumentType, content: string) => void;
}

export function DocumentGenerator({ onGenerate }: DocumentGeneratorProps) {
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState<DocumentType>('privacy');
  
  // 공통 정보
  const [commonInfo, setCommonInfo] = useState({
    serviceName: '',
    companyName: '',
    representativeName: '',
    businessNumber: '',
    address: '',
    email: '',
    phone: '',
    website: ''
  });
  
  // 개인정보처리방침 추가 정보
  const [privacyInfo, setPrivacyInfo] = useState({
    collectedRequired: ['이름', '이메일', '휴대폰번호'],
    collectedOptional: [],
    purposes: ['서비스 제공', '본인 확인', '고객 문의 응대'],
    retentionPeriod: '회원 탈퇴 시까지',
    thirdParties: [],
    outsourcing: []
  });

  const documents: { type: DocumentType; name: string; icon: string }[] = [
    { type: 'privacy', name: '개인정보처리방침', icon: '🔒' },
    { type: 'terms', name: '이용약관', icon: '📜' },
    { type: 'openapi', name: 'OpenAPI 명세서', icon: '🔗' },
    { type: 'architecture', name: '서버 아키텍처', icon: '🏗️' },
    { type: 'dataflow', name: '데이터 흐름도', icon: '🔄' },
    { type: 'security', name: '보안 대응 문서', icon: '🛡️' }
  ];

  const handleGenerate = () => {
    let content = '';
    
    switch (docType) {
      case 'privacy':
        content = generatePrivacyPolicy({
          ...commonInfo,
          collectedData: {
            required: privacyInfo.collectedRequired,
            optional: privacyInfo.collectedOptional
          },
          purposes: privacyInfo.purposes,
          retentionPeriod: privacyInfo.retentionPeriod,
          thirdParties: privacyInfo.thirdParties,
          outsourcing: privacyInfo.outsourcing
        });
        break;
      // ... 다른 문서 타입 처리
    }
    
    onGenerate(docType, content);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 진행 상태 표시 */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {s}
            </div>
            {s < 4 && (
              <div className={`w-24 h-1 mx-2 ${
                step > s ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: 문서 선택 */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">생성할 문서 선택</h2>
          <div className="grid grid-cols-2 gap-4">
            {documents.map((doc) => (
              <button
                key={doc.type}
                onClick={() => {
                  setDocType(doc.type);
                  setStep(2);
                }}
                className={`p-4 border-2 rounded-xl text-left hover:border-blue-500 transition-colors ${
                  docType === doc.type ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <span className="text-2xl">{doc.icon}</span>
                <h3 className="font-semibold mt-2">{doc.name}</h3>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: 기본 정보 입력 */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">사업자 정보 입력</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">서비스명 *</label>
              <input
                type="text"
                value={commonInfo.serviceName}
                onChange={(e) => setCommonInfo({ ...commonInfo, serviceName: e.target.value })}
                className="w-full p-3 border rounded-lg"
                placeholder="예: 토스 가계부"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">회사명 *</label>
              <input
                type="text"
                value={commonInfo.companyName}
                onChange={(e) => setCommonInfo({ ...commonInfo, companyName: e.target.value })}
                className="w-full p-3 border rounded-lg"
                placeholder="예: 주식회사 토스"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">대표자명 *</label>
              <input
                type="text"
                value={commonInfo.representativeName}
                onChange={(e) => setCommonInfo({ ...commonInfo, representativeName: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">사업자등록번호 *</label>
              <input
                type="text"
                value={commonInfo.businessNumber}
                onChange={(e) => setCommonInfo({ ...commonInfo, businessNumber: e.target.value })}
                className="w-full p-3 border rounded-lg"
                placeholder="000-00-00000"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">주소 *</label>
              <input
                type="text"
                value={commonInfo.address}
                onChange={(e) => setCommonInfo({ ...commonInfo, address: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">이메일 *</label>
              <input
                type="email"
                value={commonInfo.email}
                onChange={(e) => setCommonInfo({ ...commonInfo, email: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">전화번호</label>
              <input
                type="tel"
                value={commonInfo.phone}
                onChange={(e) => setCommonInfo({ ...commonInfo, phone: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <button onClick={() => setStep(1)} className="px-6 py-2 border rounded-lg">
              이전
            </button>
            <button 
              onClick={() => setStep(3)} 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              다음
            </button>
          </div>
        </div>
      )}

      {/* Step 3: 문서별 상세 정보 */}
      {step === 3 && docType === 'privacy' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">개인정보 수집 항목 설정</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">필수 수집 항목</label>
            <div className="flex flex-wrap gap-2">
              {['이름', '이메일', '휴대폰번호', '생년월일', '성별', '주소'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    const current = privacyInfo.collectedRequired;
                    setPrivacyInfo({
                      ...privacyInfo,
                      collectedRequired: current.includes(item)
                        ? current.filter(i => i !== item)
                        : [...current, item]
                    });
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    privacyInfo.collectedRequired.includes(item)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">수집 목적</label>
            {privacyInfo.purposes.map((purpose, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => {
                    const newPurposes = [...privacyInfo.purposes];
                    newPurposes[i] = e.target.value;
                    setPrivacyInfo({ ...privacyInfo, purposes: newPurposes });
                  }}
                  className="flex-1 p-2 border rounded-lg"
                />
                <button
                  onClick={() => {
                    setPrivacyInfo({
                      ...privacyInfo,
                      purposes: privacyInfo.purposes.filter((_, idx) => idx !== i)
                    });
                  }}
                  className="px-3 text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => setPrivacyInfo({
                ...privacyInfo,
                purposes: [...privacyInfo.purposes, '']
              })}
              className="text-blue-600 text-sm"
            >
              + 목적 추가
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">보관 기간</label>
            <select
              value={privacyInfo.retentionPeriod}
              onChange={(e) => setPrivacyInfo({ ...privacyInfo, retentionPeriod: e.target.value })}
              className="w-full p-3 border rounded-lg"
            >
              <option value="회원 탈퇴 시까지">회원 탈퇴 시까지</option>
              <option value="수집 후 1년">수집 후 1년</option>
              <option value="수집 후 3년">수집 후 3년</option>
              <option value="수집 후 5년">수집 후 5년</option>
            </select>
          </div>

          <div className="flex gap-4 mt-6">
            <button onClick={() => setStep(2)} className="px-6 py-2 border rounded-lg">
              이전
            </button>
            <button 
              onClick={() => setStep(4)} 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              다음
            </button>
          </div>
        </div>
      )}

      {/* Step 4: 미리보기 및 생성 */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">미리보기 및 생성</h2>
          <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
              {/* 미리보기 렌더링 */}
            </pre>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setStep(3)} className="px-6 py-2 border rounded-lg">
              이전
            </button>
            <button 
              onClick={handleGenerate}
              className="px-6 py-2 bg-green-600 text-white rounded-lg"
            >
              📄 문서 생성
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg">
              📥 PDF 다운로드
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 🚀 즉시 실행 가능한 첫 단계

```bash
# 1. 문서 템플릿 디렉토리 생성
mkdir -p src/lib/docs/templates
mkdir -p src/lib/docs/generators
mkdir -p src/components/docs

# 2. 첫 번째 템플릿 파일 생성
touch src/lib/docs/templates/privacyPolicy.ts
touch src/lib/docs/templates/termsOfService.ts

# 3. 마크다운 변환 라이브러리 설치
npm install marked react-markdown
```

---

## 4️⃣ 코드 Export 고도화

### 개요
UI 빌더에서 생성한 프로젝트를 완전한 배포 가능 형태로 export합니다.

### 생성되는 프로젝트 구조

```
exported-project/
├── frontend/                     # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx        # 루트 레이아웃 (safe-area 포함)
│   │   │   ├── page.tsx          # 메인 페이지
│   │   │   ├── auth/
│   │   │   │   └── page.tsx      # Toss OAuth 페이지
│   │   │   └── api/              # API Routes
│   │   │       ├── health/
│   │   │       │   └── route.ts  # 헬스체크
│   │   │       └── [...path]/
│   │   │           └── route.ts  # 프록시 라우트
│   │   ├── components/
│   │   │   ├── ui/               # 생성된 UI 컴포넌트
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   └── ...
│   │   │   └── toss/             # Toss 전용 컴포넌트
│   │   │       ├── TossLoginButton.tsx
│   │   │       └── SafeAreaContainer.tsx
│   │   ├── hooks/
│   │   │   ├── useTossAuth.ts    # Toss 인증 훅
│   │   │   └── useTossSDK.ts     # SDK 브릿지 훅
│   │   ├── lib/
│   │   │   ├── toss/
│   │   │   │   └── sdkBridge.ts  # SDK 추상화
│   │   │   └── api.ts            # API 클라이언트
│   │   └── styles/
│   │       ├── globals.css       # Tailwind + Safe-area
│   │       └── toss-theme.css    # Toss 디자인 토큰
│   ├── public/
│   │   ├── favicon.ico
│   │   └── manifest.json
│   ├── .env.example              # 환경변수 템플릿
│   ├── .env.local                # 로컬 환경변수 (gitignore)
│   ├── next.config.mjs           # Next.js 설정 (CSP 포함)
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── Dockerfile                # 프론트엔드 Docker
│
├── backend/                      # Node.js 백엔드 (선택)
│   ├── src/
│   │   ├── index.ts              # 엔트리포인트
│   │   ├── routes/
│   │   │   ├── auth.ts           # 인증 라우트
│   │   │   ├── users.ts          # 사용자 라우트
│   │   │   └── health.ts         # 헬스체크
│   │   ├── middleware/
│   │   │   ├── auth.ts           # JWT 검증
│   │   │   ├── cors.ts           # CORS 설정
│   │   │   └── logger.ts         # 요청 로깅
│   │   ├── services/
│   │   │   └── tossAuth.ts       # Toss OAuth 서비스
│   │   └── utils/
│   │       ├── crypto.ts         # 암호화 유틸
│   │       └── logger.ts         # Winston 로거
│   ├── prisma/                   # Prisma ORM (선택)
│   │   └── schema.prisma
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── docs/                         # 자동 생성 문서
│   ├── PRIVACY_POLICY.md
│   ├── TERMS_OF_SERVICE.md
│   ├── API_SPEC.yaml             # OpenAPI 3.0
│   ├── ARCHITECTURE.md           # 아키텍처 문서
│   ├── DATA_FLOW.md              # 데이터 흐름도
│   └── SECURITY_REPORT.pdf       # 보안 점검 리포트
│
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions CI/CD
│
├── docker-compose.yml            # 로컬 개발용
├── vercel.json                   # Vercel 배포 설정
├── README.md                     # 프로젝트 설명
└── TOSS_SUBMISSION_CHECKLIST.md  # 심사 체크리스트
```

### 핵심 파일 생성 코드

```typescript
// src/lib/export/projectGenerator.ts

export interface ExportConfig {
  projectName: string;
  tossMode: boolean;
  includeBackend: boolean;
  database: 'none' | 'postgresql' | 'mysql' | 'mongodb';
  authMethod: 'toss' | 'custom' | 'none';
  components: SerializedComponent[];
  businessInfo: BusinessInfo;
}

export async function generateProject(config: ExportConfig): Promise<JSZip> {
  const zip = new JSZip();
  
  // Frontend
  const frontend = zip.folder('frontend')!;
  
  // package.json
  frontend.file('package.json', JSON.stringify({
    name: config.projectName,
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint'
    },
    dependencies: {
      'next': '^14.2.0',
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
      ...(config.tossMode && {
        '@apps-in-toss/web-framework': '^1.0.0'
      })
    },
    devDependencies: {
      '@types/node': '^20',
      '@types/react': '^18',
      'typescript': '^5',
      'tailwindcss': '^3.4.0',
      'postcss': '^8',
      'autoprefixer': '^10'
    }
  }, null, 2));

  // next.config.mjs (CSP 포함)
  frontend.file('next.config.mjs', `
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.toss.im",
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
`);

  // layout.tsx (Safe-area 적용)
  const srcApp = frontend.folder('src')!.folder('app')!;
  srcApp.file('layout.tsx', `
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '${config.projectName}',
  description: '${config.projectName} - Toss MiniApp',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="toss-app-container">
        {children}
      </body>
    </html>
  );
}
`);

  // globals.css (Safe-area CSS)
  srcApp.file('globals.css', `
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --safe-area-inset-top: env(safe-area-inset-top, 0px);
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
  --safe-area-inset-left: env(safe-area-inset-left, 0px);
  --safe-area-inset-right: env(safe-area-inset-right, 0px);
}

.toss-app-container {
  padding-top: var(--safe-area-inset-top);
  padding-bottom: var(--safe-area-inset-bottom);
  padding-left: var(--safe-area-inset-left);
  padding-right: var(--safe-area-inset-right);
  min-height: 100dvh;
}

/* Toss Design Tokens */
:root {
  --toss-blue: #0064FF;
  --toss-blue-hover: #0057E0;
  --toss-gray-50: #F4F4F4;
  --toss-gray-100: #E8E8E8;
  --toss-gray-500: #8B8B8B;
  --toss-gray-900: #191919;
}
`);

  // 컴포넌트 생성
  await generateComponents(frontend, config.components);
  
  // .env.example
  frontend.file('.env.example', `
# API Configuration
NEXT_PUBLIC_API_URL=https://api.example.com

# Toss MiniApp (토스 콘솔에서 발급)
NEXT_PUBLIC_TOSS_CLIENT_ID=your_client_id
TOSS_CLIENT_SECRET=your_client_secret

# Analytics (선택)
NEXT_PUBLIC_GA_ID=
`);

  // Dockerfile
  frontend.file('Dockerfile', `
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
`);

  // Backend (선택적)
  if (config.includeBackend) {
    await generateBackend(zip, config);
  }

  // Docs
  await generateDocs(zip, config);

  // GitHub Actions
  generateGitHubActions(zip, config);

  // README
  zip.file('README.md', generateReadme(config));

  // 심사 체크리스트
  zip.file('TOSS_SUBMISSION_CHECKLIST.md', generateChecklist(config));

  return zip;
}

async function generateComponents(folder: JSZip, components: SerializedComponent[]) {
  const componentsFolder = folder.folder('src')!.folder('components')!.folder('ui')!;
  
  for (const component of components) {
    const code = await componentToCode(component);
    componentsFolder.file(`${component.name}.tsx`, code);
  }
}

async function generateBackend(zip: JSZip, config: ExportConfig) {
  const backend = zip.folder('backend')!;
  
  // package.json
  backend.file('package.json', JSON.stringify({
    name: `${config.projectName}-api`,
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'ts-node-dev --respawn src/index.ts',
      build: 'tsc',
      start: 'node dist/index.js'
    },
    dependencies: {
      'express': '^4.18.0',
      'cors': '^2.8.5',
      'helmet': '^7.1.0',
      'jsonwebtoken': '^9.0.0',
      'bcryptjs': '^2.4.3',
      'winston': '^3.11.0',
      'dotenv': '^16.3.0',
      ...(config.database === 'postgresql' && {
        '@prisma/client': '^5.0.0'
      })
    },
    devDependencies: {
      '@types/express': '^4.17.0',
      '@types/cors': '^2.8.0',
      '@types/jsonwebtoken': '^9.0.0',
      '@types/bcryptjs': '^2.4.0',
      'typescript': '^5',
      'ts-node-dev': '^2.0.0',
      ...(config.database === 'postgresql' && {
        'prisma': '^5.0.0'
      })
    }
  }, null, 2));

  // src/index.ts
  const src = backend.folder('src')!;
  src.file('index.ts', `
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from './utils/logger';
import { authRouter } from './routes/auth';
import { healthRouter } from './routes/health';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  logger.info(\`\${req.method} \${req.path}\`);
  next();
});

// Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  logger.info(\`Server running on port \${PORT}\`);
});
`);

  // Logger
  const utils = src.folder('utils')!;
  utils.file('logger.ts', `
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 90      // 90일 보관
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 90
    })
  ]
});
`);

  // Prisma schema (PostgreSQL)
  if (config.database === 'postgresql') {
    const prisma = backend.folder('prisma')!;
    prisma.file('schema.prisma', `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  tossId    String?  @unique
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`);
  }
}

async function generateDocs(zip: JSZip, config: ExportConfig) {
  const docs = zip.folder('docs')!;
  
  // 개인정보처리방침
  docs.file('PRIVACY_POLICY.md', generatePrivacyPolicy(config.businessInfo));
  
  // 이용약관
  docs.file('TERMS_OF_SERVICE.md', generateTermsOfService(config.businessInfo));
  
  // OpenAPI 명세
  docs.file('API_SPEC.yaml', generateOpenAPIYaml(config));
  
  // 아키텍처 문서
  docs.file('ARCHITECTURE.md', generateArchitectureDoc(config));
  
  // 데이터 흐름도
  docs.file('DATA_FLOW.md', generateDataFlowDoc(config));
}

function generateGitHubActions(zip: JSZip, config: ExportConfig) {
  const workflows = zip.folder('.github')!.folder('workflows')!;
  
  workflows.file('deploy.yml', `
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        working-directory: frontend
        run: npm ci
      
      - name: Run security scan
        run: npm audit --audit-level=high
      
      - name: Build
        working-directory: frontend
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: frontend
`);
}

function generateReadme(config: ExportConfig): string {
  return `# ${config.projectName}

토스 미니앱 심사 대응 프로젝트입니다.

## 🚀 시작하기

### 프론트엔드

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

${config.includeBackend ? `
### 백엔드

\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`
` : ''}

## 📋 심사 제출 전 체크리스트

\`TOSS_SUBMISSION_CHECKLIST.md\` 파일을 참고하세요.

## 📄 문서

- [개인정보처리방침](./docs/PRIVACY_POLICY.md)
- [이용약관](./docs/TERMS_OF_SERVICE.md)
- [API 명세서](./docs/API_SPEC.yaml)
- [아키텍처 문서](./docs/ARCHITECTURE.md)
- [데이터 흐름도](./docs/DATA_FLOW.md)

## 🔒 보안

- HTTPS 필수
- CSP 헤더 적용
- JWT httpOnly 쿠키
- 개인정보 암호화

## ⚠️ 주의사항

이 프로젝트는 토스와 공식 제휴 관계가 아닙니다.
토스 미니앱 심사는 사용자가 직접 진행해야 합니다.
`;
}

function generateChecklist(config: ExportConfig): string {
  return `# 토스 미니앱 심사 체크리스트

## ✅ 제출 전 필수 확인 사항

### 1. 사업자 정보
- [ ] 사업자등록증 준비
- [ ] 통신판매업 신고증 (해당 시)
- [ ] 대표자 신분증

### 2. 앱 정보
- [ ] 앱 이름 결정 (심사 후 변경 불가)
- [ ] 앱 설명 작성 (최소 100자)
- [ ] 앱 아이콘 (1024x1024px)
- [ ] 스크린샷 (최소 3장)

### 3. 기술 요구사항
- [x] HTTPS 적용 (next.config.mjs 확인)
- [x] Safe-area 대응 (layout.tsx 확인)
- [x] CSP 헤더 설정 (next.config.mjs 확인)
- [ ] 배포 URL 확정

### 4. 법적 문서
- [x] 개인정보처리방침 (docs/PRIVACY_POLICY.md)
- [x] 이용약관 (docs/TERMS_OF_SERVICE.md)
- [ ] 사업자 정보로 내용 수정 완료

### 5. 보안
- [x] 보안 스캔 통과 (npm audit)
- [ ] 민감 정보 환경변수 분리 확인
- [ ] API 키 노출 여부 확인

### 6. 토스 콘솔 작업
- [ ] 개발자 계정 생성
- [ ] 앱 등록
- [ ] OAuth 클라이언트 ID 발급
- [ ] 배포 URL 등록

## 📤 제출 순서

1. Vercel 배포 완료
2. 토스 콘솔에서 배포 URL 등록
3. 심사 요청
4. 피드백 대응 (보통 3~5영업일)
5. 승인 후 출시

## 🚨 심사 반려 주요 사유

- 사업자 정보 불일치
- 개인정보처리방침 내용 부실
- HTTPS 미적용
- 앱 설명과 실제 기능 불일치
- 금지 카테고리 해당 (도박, 가상자산 등)
`;
}
```

### 🚀 즉시 실행 가능한 첫 단계

```bash
# 1. Export 관련 디렉토리 생성
mkdir -p src/lib/export

# 2. JSZip 라이브러리 설치
npm install jszip

# 3. 기본 생성기 파일 생성
touch src/lib/export/projectGenerator.ts
touch src/lib/export/componentSerializer.ts
```

---

## 5️⃣ UX 플로우 개선

### 개요
토스 미니앱 심사 대응을 위한 정보 수집 과정을 직관적인 스텝 기반 UI로 개선합니다.

### 스텝별 UI 와이어프레임

```
┌─────────────────────────────────────────────────────────────────────────┐
│  📊 AppInToss Builder                              [로그인] [내 프로젝트] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─── 진행 상황 ─────────────────────────────────────────────────────┐   │
│  │  ① 사업자   ② 수집데이터   ③ 인증   ④ 서버   ⑤ 보안   ⑥ 완료    │   │
│  │  ●━━━━━━━━━●━━━━━━━━━━━●━━━━━●━━━━━●━━━━━○               │   │
│  │  완료       완료        완료    진행중                              │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Step 1: 사업자 정보 입력

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Step 1/6  사업자 정보                                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ⓘ 토스 미니앱 등록에는 사업자등록이 필수입니다.                          │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                                                                │    │
│  │  사업자등록번호 *                                               │    │
│  │  ┌────────────────────────────────────────────────────────┐   │    │
│  │  │  000-00-00000                                          │   │    │
│  │  └────────────────────────────────────────────────────────┘   │    │
│  │  ✓ 사업자 확인 완료                                           │    │
│  │                                                                │    │
│  │  상호명                         대표자명                       │    │
│  │  ┌──────────────────────┐     ┌──────────────────────┐       │    │
│  │  │  (자동입력)           │     │  (자동입력)           │       │    │
│  │  └──────────────────────┘     └──────────────────────┘       │    │
│  │                                                                │    │
│  │  사업장 주소                                                   │    │
│  │  ┌────────────────────────────────────────────────────────┐   │    │
│  │  │  서울특별시 강남구...                                    │   │    │
│  │  └────────────────────────────────────────────────────────┘   │    │
│  │                                                                │    │
│  │  담당자 이메일 *                     연락처                    │    │
│  │  ┌──────────────────────┐     ┌──────────────────────┐       │    │
│  │  │  contact@company.com │     │  02-1234-5678        │       │    │
│  │  └──────────────────────┘     └──────────────────────┘       │    │
│  │                                                                │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌────────┐                                           ┌────────────┐   │
│  │  이전   │                                           │  다음 ▶    │   │
│  └────────┘                                           └────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Step 2: 수집 데이터 설정

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Step 2/6  수집 데이터 설정                                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ⓘ 수집하는 개인정보를 선택하세요. 개인정보처리방침에 자동 반영됩니다.     │
│                                                                         │
│  ┌─ 필수 수집 항목 ─────────────────────────────────────────────────┐   │
│  │                                                                   │   │
│  │  [✓] 이름        [✓] 이메일      [ ] 주민등록번호                  │   │
│  │  [✓] 휴대폰번호   [ ] 생년월일    [ ] 성별                         │   │
│  │  [ ] 주소        [ ] 계좌번호    [ ] 카드번호                       │   │
│  │                                                                   │   │
│  │  직접 입력: ┌────────────────────────────────┐ [+ 추가]            │   │
│  │            │                                │                     │   │
│  │            └────────────────────────────────┘                     │   │
│  └───────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─ 수집 목적 ──────────────────────────────────────────────────────┐   │
│  │                                                                   │   │
│  │  1. ┌─────────────────────────────────────────────────┐ [✕]      │   │
│  │     │ 서비스 제공 및 본인 확인                          │          │   │
│  │     └─────────────────────────────────────────────────┘          │   │
│  │  2. ┌─────────────────────────────────────────────────┐ [✕]      │   │
│  │     │ 고객 문의 응대                                   │          │   │
│  │     └─────────────────────────────────────────────────┘          │   │
│  │                                                                   │   │
│  │  [+ 목적 추가]                                                    │   │
│  └───────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─ 보관 기간 ──────────────────────────────────────────────────────┐   │
│  │                                                                   │   │
│  │  ○ 회원 탈퇴 시까지                                               │   │
│  │  ● 수집 후 1년                                                    │   │
│  │  ○ 수집 후 3년                                                    │   │
│  │  ○ 직접 입력: [    ] 년                                           │   │
│  └───────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌────────┐                                           ┌────────────┐   │
│  │ ◀ 이전  │                                           │  다음 ▶    │   │
│  └────────┘                                           └────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Step 3: 인증 방식 선택

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Step 3/6  인증 방식                                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ⓘ 사용할 인증 방식을 선택하세요.                                        │
│                                                                         │
│  ┌─ 인증 방식 선택 ─────────────────────────────────────────────────┐   │
│  │                                                                   │   │
│  │  ┌───────────────────────────────────────────────────────────┐   │   │
│  │  │  ✓  토스 OAuth 로그인                            [추천]    │   │   │
│  │  │     토스 계정으로 간편하게 로그인                          │   │   │
│  │  │     - 3천만 사용자 접근 가능                               │   │   │
│  │  │     - 본인인증 자동 완료                                   │   │   │
│  │  └───────────────────────────────────────────────────────────┘   │   │
│  │                                                                   │   │
│  │  ┌───────────────────────────────────────────────────────────┐   │   │
│  │  │     이메일/비밀번호 로그인                                 │   │   │
│  │  │     자체 회원 시스템 구축                                  │   │   │
│  │  └───────────────────────────────────────────────────────────┘   │   │
│  │                                                                   │   │
│  │  ┌───────────────────────────────────────────────────────────┐   │   │
│  │  │     로그인 없음                                            │   │   │
│  │  │     회원가입 없이 서비스 이용                              │   │   │
│  │  └───────────────────────────────────────────────────────────┘   │   │
│  │                                                                   │   │
│  └───────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  토스 OAuth 선택 시 필요 정보:                                          │
│                                                                         │
│  Client ID (토스 콘솔에서 발급)                                         │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  발급 후 입력하세요                                             │    │
│  └────────────────────────────────────────────────────────────────┘    │
│  ⓘ 아직 발급받지 않으셨다면, 나중에 입력 가능합니다.                     │
│                                                                         │
│  ┌────────┐                                           ┌────────────┐   │
│  │ ◀ 이전  │                                           │  다음 ▶    │   │
│  └────────┘                                           └────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Step 4: 서버 위치 설정

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Step 4/6  서버 인프라 설정                                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ⓘ 서버 위치와 DB 설정을 입력하세요. 아키텍처 문서에 자동 반영됩니다.      │
│                                                                         │
│  ┌─ 호스팅 플랫폼 ──────────────────────────────────────────────────┐   │
│  │                                                                   │   │
│  │  [✓] Vercel (무료~$20/월)     [ ] AWS                           │   │
│  │  [ ] Railway ($5~)            [ ] 기타: [          ]             │   │
│  │                                                                   │   │
│  └───────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─ 서버 리전 ──────────────────────────────────────────────────────┐   │
│  │                                                                   │   │
│  │  [✓] 한국 (서울) - 토스 권장                                      │   │
│  │  [ ] 일본 (도쿄)                                                  │   │
│  │  [ ] 미국 (버지니아)                                              │   │
│  │                                                                   │   │
│  │  ⚠️ 개인정보는 국내 서버에 저장을 권장합니다.                      │   │
│  └───────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─ 데이터베이스 ───────────────────────────────────────────────────┐   │
│  │                                                                   │   │
│  │  [ ] 사용 안 함                                                   │   │
│  │  [✓] PostgreSQL (Supabase/Neon 무료)                             │   │
│  │  [ ] MongoDB (Atlas 무료)                                         │   │
│  │  [ ] MySQL (PlanetScale 무료)                                     │   │
│  │                                                                   │   │
│  │  암호화 설정:                                                     │   │
│  │  [✓] 저장 데이터 암호화 (AES-256)                                 │   │
│  │  [✓] 전송 암호화 (TLS 1.3)                                       │   │
│  └───────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌────────┐                                           ┌────────────┐   │
│  │ ◀ 이전  │                                           │  다음 ▶    │   │
│  └────────┘                                           └────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Step 5: 보안 점검

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Step 5/6  보안 점검 결과                                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │         ┌──────────────────────────────────────┐                │   │
│  │         │              85점                    │                │   │
│  │         │               B                      │                │   │
│  │         │         ███████████████░░░           │                │   │
│  │         └──────────────────────────────────────┘                │   │
│  │                                                                  │   │
│  │  통과: 4개  |  경고: 1개  |  실패: 1개                           │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─ 점검 결과 상세 ─────────────────────────────────────────────────┐   │
│  │                                                                   │   │
│  │  ✅ HTTPS 적용                                    15/15점        │   │
│  │     모든 외부 요청이 HTTPS를 사용합니다.                          │   │
│  │                                                                   │   │
│  │  ✅ CSP 헤더                                      15/15점        │   │
│  │     Content-Security-Policy 헤더가 설정되어 있습니다.             │   │
│  │                                                                   │   │
│  │  ✅ XSS 방지                                      20/20점        │   │
│  │     XSS 취약점이 발견되지 않았습니다.                             │   │
│  │                                                                   │   │
│  │  ⚠️ JWT 보안                                      10/15점        │   │
│  │     httpOnly 쿠키 설정을 권장합니다.                              │   │
│  │     [조치 방법 보기]                                              │   │
│  │                                                                   │   │
│  │  ✅ 개인정보 암호화                                20/20점        │   │
│  │     민감한 데이터가 적절히 보호되고 있습니다.                      │   │
│  │                                                                   │   │
│  │  ❌ 로그 보관                                       0/15점        │   │
│  │     로깅 시스템이 설정되지 않았습니다.                             │   │
│  │     [Winston 로거 추가하기]                                       │   │
│  │                                                                   │   │
│  └───────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  📄 PDF 리포트 다운로드                                         │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌────────┐                                           ┌────────────┐   │
│  │ ◀ 이전  │                                           │  다음 ▶    │   │
│  └────────┘                                           └────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Step 6: 완료 및 Export

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Step 6/6  준비 완료!                                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                          🎉                                             │
│                                                                         │
│              토스 미니앱 심사 준비가 완료되었습니다!                      │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  📊 심사 준비도: 92%                                             │   │
│  │  ████████████████████████████████░░░░                            │   │
│  │                                                                  │   │
│  │  ✓ 사업자 정보 입력 완료                                         │   │
│  │  ✓ 개인정보 수집 설정 완료                                       │   │
│  │  ✓ 인증 방식 설정 완료                                           │   │
│  │  ✓ 서버 구성 설정 완료                                           │   │
│  │  ✓ 보안 점검 통과 (85점)                                         │   │
│  │  ⚠ 일부 권장사항 미적용                                          │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  생성된 파일:                                                           │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📁 프로젝트                                                     │   │
│  │  ├── 📁 frontend/          Next.js 프론트엔드                    │   │
│  │  ├── 📁 backend/           Node.js 백엔드                        │   │
│  │  ├── 📁 docs/              심사용 문서                           │   │
│  │  │   ├── 📄 PRIVACY_POLICY.md                                   │   │
│  │  │   ├── 📄 TERMS_OF_SERVICE.md                                 │   │
│  │  │   ├── 📄 API_SPEC.yaml                                       │   │
│  │  │   └── 📄 SECURITY_REPORT.pdf                                 │   │
│  │  └── 📄 TOSS_SUBMISSION_CHECKLIST.md                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐                      │
│  │  📥 ZIP 다운로드     │  │  🚀 Vercel 배포     │                      │
│  └─────────────────────┘  └─────────────────────┘                      │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ ⚠️ 안내: 토스 콘솔에서 앱 등록 후 심사를 직접 진행하셔야 합니다.  │    │
│  │    https://console-apps-in-toss.toss.im                         │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 🚀 즉시 실행 가능한 첫 단계

```bash
# 1. Stepper 컴포넌트 디렉토리 생성
mkdir -p src/components/wizard

# 2. 핵심 파일 생성
touch src/components/wizard/WizardContainer.tsx
touch src/components/wizard/StepIndicator.tsx
touch src/components/wizard/steps/BusinessInfoStep.tsx
touch src/components/wizard/steps/DataCollectionStep.tsx
touch src/components/wizard/steps/AuthStep.tsx
touch src/components/wizard/steps/ServerStep.tsx
touch src/components/wizard/steps/SecurityStep.tsx
touch src/components/wizard/steps/CompleteStep.tsx

# 3. 상태 관리 (Zustand 권장)
npm install zustand
```

---

## 6️⃣ 핀테크 특화 컴포넌트

### 개요
토스 미니앱에서 자주 사용되는 핀테크 관련 UI 컴포넌트를 제공합니다.

### A. 송금 컴포넌트

```typescript
// src/components/fintech/TransferCard.tsx

interface TransferCardProps {
  /** 수취인 정보 표시 여부 */
  showRecipient?: boolean;
  /** 송금 한도 (원) */
  maxAmount?: number;
  /** 수수료 */
  fee?: number;
  /** 송금 완료 콜백 */
  onTransfer?: (data: TransferData) => void;
  /** Toss SDK 결제 연동 */
  useTossPay?: boolean;
}

interface TransferData {
  amount: number;
  recipientName: string;
  recipientAccount: string;
  bankCode: string;
  memo?: string;
}

export function TransferCard({
  showRecipient = true,
  maxAmount = 50000000,
  fee = 0,
  onTransfer,
  useTossPay = false
}: TransferCardProps) {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState({ name: '', account: '', bank: '' });

  const handleTransfer = async () => {
    const data: TransferData = {
      amount: parseInt(amount.replace(/,/g, '')),
      recipientName: recipient.name,
      recipientAccount: recipient.account,
      bankCode: recipient.bank,
    };

    if (useTossPay) {
      const sdk = getTossSDK();
      await sdk.payment.requestTossPay({
        orderId: `transfer_${Date.now()}`,
        amount: data.amount,
        orderName: `${data.recipientName}님께 송금`,
      });
    }

    onTransfer?.(data);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold mb-4">송금하기</h3>
      
      {showRecipient && (
        <div className="space-y-3 mb-4">
          <input
            type="text"
            placeholder="받는 분 이름"
            className="w-full p-3 border rounded-xl"
            value={recipient.name}
            onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
          />
          <div className="flex gap-2">
            <select 
              className="p-3 border rounded-xl"
              value={recipient.bank}
              onChange={(e) => setRecipient({ ...recipient, bank: e.target.value })}
            >
              <option value="">은행 선택</option>
              <option value="088">신한</option>
              <option value="090">카카오</option>
              <option value="092">토스</option>
              {/* ... */}
            </select>
            <input
              type="text"
              placeholder="계좌번호"
              className="flex-1 p-3 border rounded-xl"
              value={recipient.account}
              onChange={(e) => setRecipient({ ...recipient, account: e.target.value })}
            />
          </div>
        </div>
      )}
      
      {/* 금액 입력 */}
      <div className="relative mb-4">
        <input
          type="text"
          inputMode="numeric"
          placeholder="0"
          className="w-full p-4 text-3xl font-bold text-right border-b-2 border-blue-500"
          value={amount}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, '');
            setAmount(Number(value).toLocaleString());
          }}
        />
        <span className="absolute right-0 bottom-4 text-xl text-gray-500">원</span>
      </div>
      
      {/* 빠른 금액 선택 */}
      <div className="flex gap-2 mb-4">
        {[10000, 50000, 100000, 500000].map((preset) => (
          <button
            key={preset}
            onClick={() => setAmount(preset.toLocaleString())}
            className="flex-1 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
          >
            +{(preset / 10000).toFixed(0)}만
          </button>
        ))}
      </div>
      
      {/* 수수료 안내 */}
      {fee > 0 && (
        <p className="text-sm text-gray-500 mb-4">
          수수료: {fee.toLocaleString()}원
        </p>
      )}
      
      <button
        onClick={handleTransfer}
        disabled={!amount || parseInt(amount.replace(/,/g, '')) > maxAmount}
        className="w-full py-4 bg-[#0064FF] text-white font-bold rounded-xl disabled:opacity-50"
      >
        {useTossPay ? '토스페이로 송금' : '송금하기'}
      </button>
    </div>
  );
}
```

**생성되는 코드 예시:**
```tsx
<TransferCard
  showRecipient={true}
  maxAmount={5000000}
  fee={0}
  useTossPay={true}
  onTransfer={(data) => {
    console.log('송금:', data);
  }}
/>
```

### B. 계좌 연결 컴포넌트

```typescript
// src/components/fintech/AccountLinkCard.tsx

interface AccountLinkCardProps {
  /** 연동 가능 은행 목록 */
  supportedBanks?: Bank[];
  /** 연동 완료 콜백 */
  onLinked?: (account: LinkedAccount) => void;
  /** 본인인증 방식 */
  authMethod?: 'toss' | 'pass' | 'manual';
}

interface Bank {
  code: string;
  name: string;
  logo: string;
}

interface LinkedAccount {
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
  balance?: number;
}

const DEFAULT_BANKS: Bank[] = [
  { code: '092', name: '토스뱅크', logo: '/banks/toss.png' },
  { code: '088', name: '신한', logo: '/banks/shinhan.png' },
  { code: '004', name: '국민', logo: '/banks/kb.png' },
  { code: '003', name: '기업', logo: '/banks/ibk.png' },
  { code: '020', name: '우리', logo: '/banks/woori.png' },
  { code: '011', name: '농협', logo: '/banks/nh.png' },
  { code: '090', name: '카카오', logo: '/banks/kakao.png' },
  { code: '089', name: '케이', logo: '/banks/kbank.png' },
];

export function AccountLinkCard({
  supportedBanks = DEFAULT_BANKS,
  onLinked,
  authMethod = 'toss'
}: AccountLinkCardProps) {
  const [step, setStep] = useState<'select' | 'verify' | 'complete'>('select');
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  
  const sdk = useTossSDK();

  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank);
    setStep('verify');
  };

  const handleVerify = async () => {
    if (authMethod === 'toss') {
      // Toss 본인인증
      const authResult = await sdk.auth.login();
      if (authResult) {
        const linkedAccount: LinkedAccount = {
          bankCode: selectedBank!.code,
          accountNumber,
          accountHolder: authResult.user.name,
        };
        onLinked?.(linkedAccount);
        setStep('complete');
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <h3 className="font-bold">계좌 연결</h3>
        <p className="text-sm opacity-80">
          {step === 'select' && '은행을 선택해주세요'}
          {step === 'verify' && '계좌 정보를 입력해주세요'}
          {step === 'complete' && '연결이 완료되었습니다'}
        </p>
      </div>

      <div className="p-4">
        {step === 'select' && (
          <div className="grid grid-cols-4 gap-3">
            {supportedBanks.map((bank) => (
              <button
                key={bank.code}
                onClick={() => handleBankSelect(bank)}
                className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-50"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full mb-2" />
                <span className="text-xs text-gray-700">{bank.name}</span>
              </button>
            ))}
          </div>
        )}

        {step === 'verify' && selectedBank && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <span className="font-medium">{selectedBank.name}</span>
            </div>
            
            <input
              type="text"
              inputMode="numeric"
              placeholder="계좌번호 입력"
              className="w-full p-4 border rounded-xl"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
            />
            
            <button
              onClick={handleVerify}
              className="w-full py-4 bg-[#0064FF] text-white font-bold rounded-xl"
            >
              {authMethod === 'toss' ? '토스로 본인인증' : '인증하기'}
            </button>
          </div>
        )}

        {step === 'complete' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="font-bold text-lg mb-2">연결 완료!</h4>
            <p className="text-gray-500 text-sm">
              {selectedBank?.name} {accountNumber.replace(/(\d{4})(\d+)(\d{4})/, '$1****$3')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

### C. 결제 컴포넌트

```typescript
// src/components/fintech/PaymentCard.tsx

interface PaymentCardProps {
  /** 결제 금액 */
  amount: number;
  /** 상품명 */
  productName: string;
  /** 결제 수단 */
  paymentMethods?: ('toss' | 'card' | 'bank')[];
  /** 결제 완료 콜백 */
  onComplete?: (result: PaymentResult) => void;
  /** 결제 취소 콜백 */
  onCancel?: () => void;
}

interface PaymentResult {
  paymentKey: string;
  orderId: string;
  amount: number;
  method: string;
}

export function PaymentCard({
  amount,
  productName,
  paymentMethods = ['toss', 'card'],
  onComplete,
  onCancel
}: PaymentCardProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>(paymentMethods[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const sdk = useTossSDK();

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      const orderId = `order_${Date.now()}`;
      
      if (selectedMethod === 'toss') {
        const result = await sdk.payment.requestTossPay({
          orderId,
          amount,
          orderName: productName,
        });
        
        onComplete?.({
          paymentKey: result.paymentKey,
          orderId,
          amount,
          method: 'tossPay'
        });
      }
      // 다른 결제 수단 처리...
      
    } catch (error) {
      console.error('결제 실패:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* 결제 정보 */}
      <div className="p-6 border-b">
        <h3 className="text-gray-500 text-sm mb-1">결제 금액</h3>
        <p className="text-3xl font-bold">{amount.toLocaleString()}원</p>
        <p className="text-gray-600 mt-2">{productName}</p>
      </div>

      {/* 결제 수단 선택 */}
      <div className="p-4 space-y-2">
        <p className="text-sm font-medium text-gray-700 mb-3">결제 수단</p>
        
        {paymentMethods.includes('toss') && (
          <button
            onClick={() => setSelectedMethod('toss')}
            className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 ${
              selectedMethod === 'toss' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div className="w-10 h-10 bg-blue-500 rounded-lg" />
            <div className="text-left">
              <p className="font-medium">토스페이</p>
              <p className="text-xs text-gray-500">토스 앱에서 간편결제</p>
            </div>
            {selectedMethod === 'toss' && (
              <svg className="w-5 h-5 text-blue-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        )}

        {paymentMethods.includes('card') && (
          <button
            onClick={() => setSelectedMethod('card')}
            className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 ${
              selectedMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div className="w-10 h-10 bg-gray-200 rounded-lg" />
            <div className="text-left">
              <p className="font-medium">신용/체크카드</p>
              <p className="text-xs text-gray-500">카드 결제</p>
            </div>
          </button>
        )}
      </div>

      {/* 결제 버튼 */}
      <div className="p-4 bg-gray-50">
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full py-4 bg-[#0064FF] text-white font-bold rounded-xl disabled:opacity-50"
        >
          {isProcessing ? '결제 중...' : `${amount.toLocaleString()}원 결제하기`}
        </button>
        <button
          onClick={onCancel}
          className="w-full py-3 text-gray-500 text-sm mt-2"
        >
          취소
        </button>
      </div>
    </div>
  );
}
```

### D. 신용정보 조회 컴포넌트

```typescript
// src/components/fintech/CreditScoreCard.tsx

interface CreditScoreCardProps {
  /** 신용점수 (1-1000) */
  score?: number;
  /** 신용등급 (1-10) */
  grade?: number;
  /** 조회 기관 */
  provider?: 'nice' | 'kcb';
  /** 조회일 */
  checkedAt?: Date;
  /** 새로고침 콜백 */
  onRefresh?: () => void;
}

export function CreditScoreCard({
  score,
  grade,
  provider = 'nice',
  checkedAt,
  onRefresh
}: CreditScoreCardProps) {
  const getGradeColor = (grade: number) => {
    if (grade <= 3) return 'text-green-500';
    if (grade <= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getGradeLabel = (grade: number) => {
    if (grade <= 3) return '우수';
    if (grade <= 6) return '보통';
    return '관리 필요';
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-gray-400 text-sm">내 신용점수</p>
          <p className="text-xs text-gray-500">
            {provider === 'nice' ? 'NICE' : 'KCB'} 기준
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="p-2 bg-white/10 rounded-lg hover:bg-white/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {score !== undefined ? (
        <>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-5xl font-bold">{score}</span>
            <span className="text-gray-400 mb-2">/ 1000</span>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <span className={`text-2xl font-bold ${getGradeColor(grade || 5)}`}>
              {grade}등급
            </span>
            <span className="px-2 py-1 bg-white/10 rounded text-sm">
              {getGradeLabel(grade || 5)}
            </span>
          </div>

          {/* 점수 게이지 */}
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
              style={{ width: `${(score / 1000) * 100}%` }}
            />
          </div>

          <p className="text-xs text-gray-400">
            {checkedAt && `마지막 조회: ${checkedAt.toLocaleDateString('ko-KR')}`}
          </p>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">신용정보를 조회해보세요</p>
          <button
            onClick={onRefresh}
            className="px-6 py-3 bg-white text-gray-900 font-medium rounded-xl"
          >
            신용점수 조회하기
          </button>
        </div>
      )}
    </div>
  );
}
```

### E. 금융상품 비교 컴포넌트

```typescript
// src/components/fintech/ProductCompareCard.tsx

interface FinancialProduct {
  id: string;
  name: string;
  provider: string;
  type: 'loan' | 'deposit' | 'savings' | 'card';
  interestRate?: number;
  benefits?: string[];
  conditions?: string[];
  link?: string;
}

interface ProductCompareCardProps {
  products: FinancialProduct[];
  type: 'loan' | 'deposit' | 'savings' | 'card';
  onSelect?: (product: FinancialProduct) => void;
}

export function ProductCompareCard({
  products,
  type,
  onSelect
}: ProductCompareCardProps) {
  const [sortBy, setSortBy] = useState<'rate' | 'name'>('rate');

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'rate') {
      return (b.interestRate || 0) - (a.interestRate || 0);
    }
    return a.name.localeCompare(b.name);
  });

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      loan: '대출 상품',
      deposit: '예금 상품',
      savings: '적금 상품',
      card: '카드 상품'
    };
    return labels[type] || '금융 상품';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-bold">{getTypeLabel(type)} 비교</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'rate' | 'name')}
          className="text-sm border rounded-lg px-2 py-1"
        >
          <option value="rate">금리순</option>
          <option value="name">이름순</option>
        </select>
      </div>

      <div className="divide-y">
        {sortedProducts.map((product, index) => (
          <div 
            key={product.id}
            className="p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => onSelect?.(product)}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                {index === 0 && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded mb-1 inline-block">
                    추천
                  </span>
                )}
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-sm text-gray-500">{product.provider}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  {product.interestRate?.toFixed(2)}%
                </p>
                <p className="text-xs text-gray-400">
                  {type === 'loan' ? '연이자' : '금리'}
                </p>
              </div>
            </div>

            {product.benefits && product.benefits.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {product.benefits.slice(0, 3).map((benefit, i) => (
                  <span 
                    key={i}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          * 실제 금리는 개인 신용도에 따라 달라질 수 있습니다
        </p>
      </div>
    </div>
  );
}
```

### Toss SDK 연동 방법

```typescript
// src/lib/toss/fintechIntegration.ts

import { getTossSDK } from './sdkBridge';

/**
 * 토스페이 결제 요청
 */
export async function requestTossPayment(params: {
  orderId: string;
  amount: number;
  orderName: string;
}) {
  const sdk = getTossSDK();
  
  try {
    const result = await sdk.payment.requestTossPay(params);
    return { success: true, paymentKey: result.paymentKey };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * 토스 OAuth 사용자 정보 조회
 */
export async function getTossUserInfo() {
  const sdk = getTossSDK();
  
  const isLoggedIn = await sdk.auth.isLoggedIn();
  if (!isLoggedIn) {
    const loginResult = await sdk.auth.login();
    return loginResult.user;
  }
  
  // 이미 로그인된 경우 캐시된 정보 반환
  return null; // 실제 구현 필요
}

/**
 * 토스 공유하기
 */
export async function shareViaToSS(data: {
  title: string;
  text?: string;
  url?: string;
}) {
  const sdk = getTossSDK();
  await sdk.utils.share(data);
}
```

### 🚀 즉시 실행 가능한 첫 단계

```bash
# 1. 핀테크 컴포넌트 디렉토리 생성
mkdir -p src/components/fintech

# 2. 핵심 컴포넌트 파일 생성
touch src/components/fintech/TransferCard.tsx
touch src/components/fintech/AccountLinkCard.tsx
touch src/components/fintech/PaymentCard.tsx
touch src/components/fintech/CreditScoreCard.tsx
touch src/components/fintech/ProductCompareCard.tsx

# 3. 컴포넌트 패널에 핀테크 카테고리 추가
# ComponentPanel.tsx 수정
```

---

## 7️⃣ 리스크 관리 전략

### 개요
토스와 공식 파트너십이 없는 상태에서 서비스를 제공할 때 발생할 수 있는 법적/사업적 리스크를 관리합니다.

### A. 필수 고지 문구

#### 서비스 내 고지 (Footer, About)

```markdown
## 서비스 안내

본 서비스(AppInToss Builder)는 **토스(Toss, 비바리퍼블리카)**와 공식 제휴 또는 
파트너 관계가 아닙니다.

- 이 서비스는 토스 미니앱 개발을 돕는 독립적인 도구입니다.
- 토스 미니앱 심사 승인을 보장하지 않습니다.
- 토스 미니앱 등록 및 심사는 사용자가 직접 진행해야 합니다.
- 토스 브랜드, 로고, 상표의 사용 권한은 토스에 귀속됩니다.

문의: support@your-domain.com
```

#### 이용약관 내 면책조항

```markdown
## 제10조 (면책조항)

1. **공식 제휴 아님**: 본 서비스는 비바리퍼블리카(토스)와 공식 제휴, 파트너십, 
   라이선스 관계에 있지 않습니다. "토스 호환", "앱인토스 지원" 등의 표현은 
   기술적 호환성을 의미하며, 공식 인증이나 보증을 의미하지 않습니다.

2. **심사 결과 무보증**: 본 서비스를 통해 생성된 앱이 토스 미니앱 심사를 
   통과할 것을 보장하지 않습니다. 심사 기준은 토스의 재량에 따르며, 
   본 서비스는 이에 대해 어떠한 책임도 지지 않습니다.

3. **토스 정책 변경**: 토스의 정책, API, SDK, 심사 기준 변경에 대해 
   본 서비스가 즉시 대응하지 못할 수 있으며, 이로 인한 손해에 대해 
   책임지지 않습니다.

4. **상표 사용**: 본 서비스에서 사용되는 "토스", "Toss", "앱인토스" 등의 
   명칭은 설명 목적으로만 사용되며, 해당 상표권은 비바리퍼블리카에 있습니다.

5. **사용자 책임**: 사용자는 본 서비스를 통해 생성한 앱에 대해 전적인 
   법적 책임을 지며, 관련 법규 준수, 개인정보 보호, 보안 유지의 
   의무가 있습니다.
```

#### 회원가입 시 동의 체크박스

```tsx
// src/components/auth/ConsentCheckboxes.tsx

export function ConsentCheckboxes({ 
  onAllAgreed 
}: { 
  onAllAgreed: (agreed: boolean) => void 
}) {
  const [consents, setConsents] = useState({
    terms: false,
    privacy: false,
    thirdParty: false,
    marketing: false
  });

  return (
    <div className="space-y-3">
      <label className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <input
          type="checkbox"
          checked={consents.thirdParty}
          onChange={(e) => setConsents({ ...consents, thirdParty: e.target.checked })}
          className="mt-1"
        />
        <div className="text-sm">
          <p className="font-medium text-yellow-800">[필수] 서비스 특성 확인</p>
          <p className="text-yellow-700 mt-1">
            본 서비스가 토스(비바리퍼블리카)와 공식 제휴 관계가 아니며, 
            토스 미니앱 심사 승인을 보장하지 않음을 이해하고 동의합니다.
          </p>
        </div>
      </label>

      <label className="flex items-start gap-3 p-3 border rounded-lg">
        <input
          type="checkbox"
          checked={consents.terms}
          onChange={(e) => setConsents({ ...consents, terms: e.target.checked })}
          className="mt-1"
        />
        <div className="text-sm">
          <p className="font-medium">[필수] 이용약관 동의</p>
          <a href="/terms" className="text-blue-600 underline">전문 보기</a>
        </div>
      </label>

      <label className="flex items-start gap-3 p-3 border rounded-lg">
        <input
          type="checkbox"
          checked={consents.privacy}
          onChange={(e) => setConsents({ ...consents, privacy: e.target.checked })}
          className="mt-1"
        />
        <div className="text-sm">
          <p className="font-medium">[필수] 개인정보처리방침 동의</p>
          <a href="/privacy" className="text-blue-600 underline">전문 보기</a>
        </div>
      </label>

      <label className="flex items-start gap-3 p-3 border rounded-lg">
        <input
          type="checkbox"
          checked={consents.marketing}
          onChange={(e) => setConsents({ ...consents, marketing: e.target.checked })}
          className="mt-1"
        />
        <div className="text-sm">
          <p className="font-medium">[선택] 마케팅 정보 수신 동의</p>
        </div>
      </label>
    </div>
  );
}
```

### B. 안전한 표현 가이드

| ❌ 사용 금지 | ✅ 권장 표현 |
|-------------|-------------|
| 토스 공식 빌더 | 토스 미니앱 호환 빌더 |
| 토스 인증 도구 | 토스 미니앱 개발 지원 도구 |
| 토스 파트너 | (언급하지 않음) |
| 심사 100% 통과 | 심사 준비 지원 |
| 토스가 만든 | 토스 미니앱 용으로 제작된 |
| 토스 브랜드 로고 사용 | 텍스트로만 "토스 호환" 표기 |

### C. 법적 검토 포인트

#### 1. 상표권 침해 방지

```plaintext
확인 사항:
□ "토스", "Toss" 로고를 서비스 브랜딩에 사용하지 않음
□ 메타 태그, SEO에 오해를 유발하는 표현 없음
□ 앱스토어/플레이스토어 등록 시 공식 앱으로 오인되지 않는 명칭 사용
□ 광고에서 토스 브랜드를 무단 사용하지 않음
```

#### 2. 부정경쟁방지법 준수

```plaintext
점검 항목:
□ 경쟁 제품을 비방하거나 허위 비교하지 않음
□ 토스의 영업을 방해하는 행위 없음
□ 사용자에게 오해를 유발하는 마케팅 없음
```

#### 3. 개인정보 보호

```plaintext
필수 조치:
□ 토스 API를 통해 수집되는 개인정보에 대한 별도 동의
□ 개인정보처리방침에 제3자 제공 내역 명시
□ 토스 SDK 사용 시 토스 개인정보처리방침 링크 제공
```

### D. 사용자 동의 수집 시스템

```typescript
// src/lib/consent/consentManager.ts

interface ConsentRecord {
  userId: string;
  consentType: 'terms' | 'privacy' | 'thirdParty' | 'marketing';
  version: string;
  agreedAt: Date;
  ipAddress: string;
  userAgent: string;
}

export class ConsentManager {
  private static CONSENT_VERSIONS = {
    terms: '2024.02.01',
    privacy: '2024.02.01',
    thirdParty: '2024.02.01',
    marketing: '2024.02.01'
  };

  /**
   * 동의 기록 저장
   */
  static async recordConsent(
    userId: string,
    consentType: keyof typeof this.CONSENT_VERSIONS,
    ipAddress: string,
    userAgent: string
  ): Promise<void> {
    const record: ConsentRecord = {
      userId,
      consentType,
      version: this.CONSENT_VERSIONS[consentType],
      agreedAt: new Date(),
      ipAddress,
      userAgent
    };

    // DB 저장 로직
    await saveConsentToDatabase(record);
  }

  /**
   * 동의 상태 확인
   */
  static async hasValidConsent(
    userId: string,
    consentType: keyof typeof this.CONSENT_VERSIONS
  ): Promise<boolean> {
    const record = await getLatestConsent(userId, consentType);
    
    if (!record) return false;
    
    // 버전이 변경되었으면 재동의 필요
    return record.version === this.CONSENT_VERSIONS[consentType];
  }

  /**
   * 동의 철회
   */
  static async revokeConsent(
    userId: string,
    consentType: keyof typeof this.CONSENT_VERSIONS
  ): Promise<void> {
    await markConsentAsRevoked(userId, consentType, new Date());
  }
}
```

### E. 위기 대응 플레이북

```markdown
## 위기 상황별 대응 방안

### 시나리오 1: 토스로부터 경고/내용증명 수신

**즉시 조치:**
1. 법률 자문 요청 (48시간 이내)
2. 문제 제기된 표현/기능 즉시 수정 또는 일시 중단
3. 토스 측에 선의의 협력 의사 전달

**예방:**
- 분기별 표현/마케팅 자체 점검
- 법률 자문 계약 유지 (스타트업 법률 서비스 활용)

### 시나리오 2: 토스 정책 변경으로 기능 사용 불가

**대응:**
1. 사용자에게 즉시 공지 (24시간 이내)
2. 대체 방안 마련 및 로드맵 공유
3. 영향받는 사용자에게 환불/크레딧 제공 검토

### 시나리오 3: 사용자 앱 심사 대량 거부

**대응:**
1. 거부 사유 패턴 분석
2. 가이드 업데이트 및 공지
3. 심사 대응 컨설팅 제공 검토

### 비상 연락처
- 법률 자문: [담당 변호사 연락처]
- 토스 개발자 지원: developers-apps-in-toss@toss.im
- 내부 담당: [대표 연락처]
```

### 🚀 즉시 실행 가능한 첫 단계

```bash
# 1. 법적 문서 디렉토리 생성
mkdir -p docs/legal

# 2. 핵심 고지 문서 작성
touch docs/legal/DISCLAIMER.md
touch docs/legal/THIRD_PARTY_NOTICE.md

# 3. 동의 관리 컴포넌트 생성
touch src/components/auth/ConsentCheckboxes.tsx
touch src/lib/consent/consentManager.ts

# 4. Footer에 고지 문구 추가 (기존 Footer 컴포넌트 수정)
```

---

## 8️⃣ 기술 아키텍처 확장

### 개요
1인 개발자가 Vercel 기반으로 확장 가능한 아키텍처를 구축합니다.

### A. 현재 → 목표 아키텍처

```
현재 (프론트엔드 Only)
═══════════════════════════════════════════════════════════════
┌──────────────────────────────────────────────────────────────┐
│                      Vercel Edge                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Next.js 14 (App Router)                   │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────────┐   │  │
│  │  │ Craft.js │ │ Tailwind │ │ Static Export (HTML) │   │  │
│  │  └──────────┘ └──────────┘ └──────────────────────┘   │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘


목표 (3개월 후)
═══════════════════════════════════════════════════════════════

         ┌─────────────────────────────────────────────┐
         │              사용자 (토스 앱 / 브라우저)       │
         └─────────────────────┬───────────────────────┘
                               │
                               ▼
         ┌─────────────────────────────────────────────┐
         │            Cloudflare (CDN + WAF)            │
         │         [DDoS 보호] [Rate Limiting]          │
         └─────────────────────┬───────────────────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Vercel Edge    │  │  Vercel Edge    │  │    Supabase     │
│  (Frontend)     │  │  (API Routes)   │  │    (Backend)    │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ Next.js 14      │  │ /api/export     │  │ Auth (Toss SSO) │
│ React 18        │  │ /api/security   │  │ PostgreSQL      │
│ Tailwind CSS    │  │ /api/docs       │  │ Storage (S3)    │
│ Craft.js        │  │ /api/webhook    │  │ Edge Functions  │
│ Zustand         │  │                 │  │                 │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                    │                    │
         └────────────────────┴────────────────────┘
                               │
                               ▼
         ┌─────────────────────────────────────────────┐
         │               Supabase PostgreSQL            │
         │  ┌───────────┐ ┌────────────┐ ┌──────────┐  │
         │  │  users    │ │  projects  │ │ exports  │  │
         │  └───────────┘ └────────────┘ └──────────┘  │
         │  [Row Level Security] [암호화] [백업]        │
         └─────────────────────────────────────────────┘
```

### B. 기술 선택 근거

| 영역 | 선택 기술 | 이유 | 대안 |
|------|----------|------|------|
| **호스팅** | Vercel Pro ($20/월) | Next.js 최적화, Edge 지원, 간편 배포 | AWS Amplify, Netlify |
| **DB** | Supabase (무료~$25/월) | PostgreSQL, 실시간, Auth 내장, 무료 티어 충분 | PlanetScale, Neon |
| **CDN/보안** | Cloudflare 무료 | DDoS 방어, SSL, 캐싱, 무료 | Vercel 기본 CDN |
| **파일 저장** | Supabase Storage | S3 호환, Supabase 통합 | AWS S3, Cloudflare R2 |
| **인증** | Supabase Auth | 소셜 로그인 지원, 무료 | Clerk, Auth.js |
| **모니터링** | Vercel Analytics + Sentry 무료 | 에러 추적, 성능 측정 | LogRocket, Datadog |
| **CI/CD** | GitHub Actions (무료) | 자동 배포, 보안 스캔 | Vercel 자동 배포 |

### C. 데이터베이스 설계

```sql
-- Supabase PostgreSQL Schema

-- 사용자
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  toss_id VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  company_name VARCHAR(200),
  business_number VARCHAR(20),
  plan VARCHAR(20) DEFAULT 'free', -- free, pro, enterprise
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- 프로젝트
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  toss_mode BOOLEAN DEFAULT false,
  craft_json JSONB,  -- Craft.js 직렬화 데이터
  settings JSONB,    -- 프로젝트 설정
  status VARCHAR(20) DEFAULT 'draft', -- draft, ready, exported
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_user ON projects(user_id);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

-- 보안 점검 결과
CREATE TABLE security_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  total_score INTEGER,
  max_score INTEGER,
  grade CHAR(1),
  checks JSONB,  -- 상세 점검 결과
  scanned_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE security_scans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own scans" ON security_scans
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM projects WHERE id = project_id)
  );

-- 문서 생성 기록
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  doc_type VARCHAR(50), -- privacy, terms, openapi, architecture
  content TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own documents" ON documents
  FOR ALL USING (
    auth.uid() = (SELECT user_id FROM projects WHERE id = project_id)
  );

-- Export 기록
CREATE TABLE exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  file_path VARCHAR(500), -- Supabase Storage 경로
  file_size INTEGER,
  config JSONB,
  exported_at TIMESTAMPTZ DEFAULT NOW()
);

-- 동의 기록
CREATE TABLE consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  consent_type VARCHAR(50),
  version VARCHAR(20),
  agreed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  revoked_at TIMESTAMPTZ
);

CREATE INDEX idx_consents_user ON consents(user_id);
```

### D. CI/CD 파이프라인

```yaml
# .github/workflows/main.yml

name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  # 1. 린트 & 타입 체크
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Type check
        run: npm run type-check

  # 2. 보안 스캔
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run npm audit
        run: npm audit --audit-level=high
        continue-on-error: true
      
      - name: Run Snyk
        uses: snyk/actions/node@master
        continue-on-error: true
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      
      - name: SAST with CodeQL
        uses: github/codeql-action/analyze@v2
        with:
          languages: javascript, typescript

  # 3. 테스트
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  # 4. 빌드
  build:
    needs: [lint, security, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: .next

  # 5. 배포 (main 브랜치만)
  deploy:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### E. 환경 분리

```bash
# .env.local (로컬 개발)
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# .env.preview (Vercel Preview)
NEXT_PUBLIC_APP_ENV=preview
NEXT_PUBLIC_API_URL=https://preview.appintoss-builder.vercel.app/api

# .env.production (Vercel Production)
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_API_URL=https://appintoss-builder.vercel.app/api
```

### 🚀 즉시 실행 가능한 첫 단계

```bash
# 1. Supabase 프로젝트 생성
# https://supabase.com 에서 무료 프로젝트 생성

# 2. Supabase CLI 설치 및 초기화
npm install -g supabase
supabase init
supabase link --project-ref YOUR_PROJECT_REF

# 3. 스키마 마이그레이션 적용
supabase db push

# 4. Supabase 클라이언트 설치
npm install @supabase/supabase-js

# 5. 환경변수 설정
cp .env.example .env.local
# Supabase URL, Key 입력

# 6. GitHub Actions secrets 설정
# VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID
# SNYK_TOKEN (선택)
```

---

## 9️⃣ 3개월 MVP 고도화 로드맵

### 개요
1인 개발자 기준, 주 40시간 투자를 가정한 현실적인 로드맵입니다.

### 1개월차: 핵심 기능 구축

```
Week 1: Toss 모드 기반 작업
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

월: Safe-area 레이아웃 시스템 구현
    - src/lib/toss/safeArea.ts 완성
    - 디바이스별 프리셋 추가

화: Toss SDK 브릿지 추상화
    - src/lib/toss/sdkBridge.ts 완성
    - Mock SDK 구현

수: TossModeToggle 컴포넌트
    - 에디터 통합
    - 상태 관리 (Zustand)

목: OAuth 스켈레톤 코드 생성기
    - 로그인 훅 템플릿
    - 로그인 버튼 컴포넌트

금: 테스트 & 버그 수정
    - 실제 토스 앱 시뮬레이터 테스트
    - Edge case 처리

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Week 2: 보안 점검 시스템
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

월: 보안 스캐너 기본 구조
    - src/lib/security/scanner.ts
    - 점검 항목 인터페이스

화: HTTPS, CSP 점검 구현
    - 정규식 기반 코드 스캔
    - next.config 분석

수: XSS, JWT 점검 구현
    - AST 파싱 (선택)
    - 패턴 매칭

목: 점수 계산 및 등급 시스템
    - 가중치 적용
    - 등급 기준 설정

금: PDF 리포트 생성
    - jspdf 통합
    - 템플릿 디자인

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Week 3: 문서 자동 생성
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

월: 개인정보처리방침 템플릿
    - 입력 폼 UI
    - 마크다운 생성

화: 이용약관 템플릿
    - 입력 폼 UI
    - 마크다운 생성

수: 문서 미리보기 & 편집
    - 실시간 렌더링
    - 인라인 편집

목: PDF/Word 다운로드
    - 다중 포맷 지원
    - 스타일링

금: 테스트 & 마무리
    - 사용자 피드백 수집
    - 버그 수정

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Week 4: Export 고도화
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

월: 프로젝트 생성기 리팩토링
    - 모듈화
    - 설정 기반 생성

화: Dockerfile 생성
    - 멀티스테이지 빌드
    - 최적화

수: CI/CD 설정 파일 생성
    - GitHub Actions
    - Vercel 설정

목: 심사 체크리스트 통합
    - 자동 생성
    - 인터랙티브 체크

금: 1개월차 회고 & 정리
    - 문서화
    - v0.2.0 릴리즈

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 2개월차: 사용자 경험 & 백엔드

```
Week 5: UX 플로우 개선
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

월-화: 위자드 UI 구현
       - StepIndicator 컴포넌트
       - 상태 관리

수-목: 각 스텝 페이지 구현
       - BusinessInfoStep
       - DataCollectionStep
       - AuthStep

금: 서버/보안 스텝
    - ServerStep
    - SecurityStep

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Week 6: Supabase 통합
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

월: Supabase 프로젝트 설정
    - DB 스키마 적용
    - RLS 정책

화: 인증 시스템
    - Supabase Auth
    - 소셜 로그인 (Google, Kakao)

수: 프로젝트 CRUD
    - API 라우트
    - 클라이언트 연동

목: 자동 저장 기능
    - Debounce 저장
    - 충돌 해결

금: 테스트 & 버그 수정

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Week 7: 핀테크 컴포넌트 (1)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

월: TransferCard
    - UI 구현
    - Toss SDK 연동

화: AccountLinkCard
    - 은행 선택 UI
    - 인증 플로우

수: PaymentCard
    - 결제 UI
    - 토스페이 연동

목: 컴포넌트 패널 통합
    - 핀테크 카테고리 추가
    - 드래그앤드롭

금: 문서화 & 예제

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Week 8: 핀테크 컴포넌트 (2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

월: CreditScoreCard
    - 시각화
    - 애니메이션

화: ProductCompareCard
    - 정렬/필터
    - 상세 보기

수: 추가 컴포넌트
    - NotificationCard
    - TransactionHistoryList

목: 스타일 커스터마이징
    - 토스 디자인 토큰
    - 테마 시스템

금: 2개월차 회고
    - v0.3.0 릴리즈

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3개월차: 안정화 & 출시 준비

```
Week 9: 리스크 관리 & 법적 준비
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

월: 법적 고지 문구 작성
    - 면책조항
    - 동의 체크박스

화: 동의 관리 시스템
    - ConsentManager
    - DB 기록

수: 이용약관 페이지
    - 마크다운 렌더링
    - 버전 관리

목: 법률 검토 요청
    - 스타트업 법률 서비스 활용
    - 피드백 반영

금: 보안 점검 재실행
    - 전체 코드베이스 스캔

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Week 10: 성능 최적화
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

월: 번들 사이즈 최적화
    - 동적 임포트
    - Tree shaking

화: 이미지 최적화
    - next/image
    - WebP 변환

수: 캐싱 전략
    - SWR/React Query
    - API 캐싱

목: Lighthouse 점수 개선
    - 목표: 90점 이상
    - 접근성 개선

금: 부하 테스트
    - 동시 접속자 처리

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Week 11: 베타 테스트
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

월: 베타 테스터 모집
    - 개발자 커뮤니티
    - SNS 홍보

화-수: 피드백 수집
       - Hotjar/FullStory
       - 사용자 인터뷰

목-금: 주요 이슈 수정
       - 우선순위 정리
       - 핫픽스 배포

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Week 12: 정식 출시
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

월: 랜딩 페이지 완성
    - 기능 소개
    - 가격표

화: 문서 사이트
    - 사용 가이드
    - API 문서

수: 결제 시스템 연동
    - 토스페이먼츠
    - 구독 관리

목: 마케팅 준비
    - Product Hunt
    - 개발자 커뮤니티

금: 🚀 v1.0.0 정식 출시!
    - 프레스 릴리즈
    - 소셜 미디어 발표

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 필요 리소스

| 항목 | 비용 (월) | 비고 |
|------|----------|------|
| Vercel Pro | $20 | 무료 티어로 시작 가능 |
| Supabase | $0~25 | 무료 티어 충분 |
| Cloudflare | $0 | 무료 플랜 |
| 도메인 | ~$15/년 | 선택 |
| Sentry | $0 | 무료 티어 |
| **월 총계** | **~$20~50** | |

### 🚀 즉시 실행 가능한 첫 단계

```bash
# 1. 프로젝트 관리 도구 설정
# - GitHub Projects 또는 Linear 활용
# - 위 로드맵을 Issue로 등록

# 2. Week 1 시작
mkdir -p src/lib/toss
touch src/lib/toss/safeArea.ts
touch src/lib/toss/sdkBridge.ts

# 3. 일일 진행 상황 기록
touch CHANGELOG.md
```

---

## 🔟 사업성 강화 전략

### 개요
단순 UI 빌더에서 "핀테크 심사 대응 플랫폼"으로 포지셔닝을 전환합니다.

### A. 시장 분석

#### TAM/SAM/SOM

```
TAM (Total Addressable Market)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
국내 앱 개발 시장: ~5조원
  └─ 모바일 앱 개발 서비스: ~1조원
     └─ 노코드/로우코드 도구: ~500억원

SAM (Serviceable Addressable Market)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
토스 미니앱 개발 수요:
  - 앱인토스 100일 200개 앱 → 연 700개 예상
  - 개발 비용 평균 500만원 가정
  - 연간 시장 규모: ~35억원

SOM (Serviceable Obtainable Market)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1년 내 목표:
  - 유료 고객 100명
  - ARR: 1.2억원 (월 1000만원)
```

#### 경쟁사 분석

| 서비스 | 특징 | 가격 | 약점 |
|--------|------|------|------|
| **직접 개발** | 완전 커스텀 | 500만~5000만원 | 비용, 시간 |
| **Bubble** | 범용 노코드 | $29~529/월 | 토스 특화 X, 영문 |
| **Webflow** | 디자인 중심 | $14~39/월 | 앱 기능 제한 |
| **Glide** | 스프레드시트 기반 | $25~99/월 | 복잡한 앱 불가 |
| **FlutterFlow** | 플러터 기반 | $30~70/월 | 학습 곡선 |

**우리의 차별점:**
1. 🎯 토스 미니앱 전용 (Only one)
2. 📋 심사 준비 자동화 (90% 준비 완료)
3. 💰 저렴한 가격 (경쟁사 대비 50%)
4. 🇰🇷 한국어 UI/지원

### B. 수익 모델

#### 가격 전략

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         가격표 (예시)                                    │
├─────────────────┬─────────────────┬─────────────────┬───────────────────┤
│     Free        │     Starter     │      Pro        │    Enterprise     │
│      무료        │    ₩29,000/월   │   ₩79,000/월    │      협의         │
├─────────────────┼─────────────────┼─────────────────┼───────────────────┤
│ • 1 프로젝트     │ • 3 프로젝트     │ • 무제한 프로젝트 │ • 모든 Pro 기능    │
│ • 기본 컴포넌트  │ • 모든 컴포넌트  │ • 핀테크 컴포넌트 │ • 전담 매니저      │
│ • Export (HTML) │ • Export (ZIP)  │ • Export (Full) │ • 온프레미스 배포  │
│ • 커뮤니티 지원  │ • 이메일 지원    │ • 우선 지원      │ • SLA 99.9%       │
│                 │ • 보안 점검 1회  │ • 무제한 보안점검│ • 커스텀 개발      │
│                 │                 │ • 문서 자동생성  │ • 교육 지원        │
└─────────────────┴─────────────────┴─────────────────┴───────────────────┘
```

#### 추가 수익원

| 수익원 | 가격 | 설명 |
|--------|------|------|
| 심사 컨설팅 | 50만원/건 | 심사 대응 1:1 컨설팅 |
| 템플릿 마켓 | 5~20만원/개 | 완성형 앱 템플릿 판매 |
| 에이전시 연결 | 수수료 10% | 개발 외주 연결 |
| 교육 콘텐츠 | 10~30만원/과정 | 토스 미니앱 개발 강좌 |

### C. 매출 시뮬레이션

```
Year 1 시뮬레이션
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

가정:
- 출시 후 월 20% 사용자 성장
- 무료 → 유료 전환율: 5%
- ARPU (유료): ₩50,000/월

Month  | 무료 사용자 | 유료 사용자 | MRR        | 비고
-------|------------|------------|------------|------------
M1     | 100        | 5          | ₩250,000   | 출시
M3     | 288        | 14         | ₩720,000   |
M6     | 995        | 50         | ₩2,500,000 | 
M9     | 3,436      | 172        | ₩8,600,000 |
M12    | 11,863     | 593        | ₩29,650,000| ARR: 3.6억

손익분기점: M4 (예상)
- 고정비: ₩500,000/월 (서버, 도구)
- BEP 유료 사용자: 10명
```

### D. GTM (Go-to-Market) 전략

#### Phase 1: 인지도 구축 (Month 1-2)

```markdown
1. 콘텐츠 마케팅
   - 블로그: "토스 미니앱 개발 가이드" 시리즈
   - YouTube: 튜토리얼 영상
   - 토스 개발자 커뮤니티 활동

2. 커뮤니티 참여
   - OKKY, 디스콰이엇, 프로덕트 헌트
   - 토스 개발자 행사 참석
   
3. SEO
   - 키워드: "토스 미니앱", "앱인토스 개발", "노코드 핀테크"
```

#### Phase 2: 초기 사용자 확보 (Month 3-4)

```markdown
1. 베타 프로그램
   - 얼리어답터 100명 무료 제공
   - 피드백 대가로 Pro 1개월 무료

2. 케이스 스터디
   - 베타 유저 중 성공 사례 발굴
   - 심사 통과 사례 홍보

3. 파트너십
   - 프리랜서 개발자 네트워크
   - 스타트업 액셀러레이터
```

#### Phase 3: 성장 (Month 5-12)

```markdown
1. 유료 광고
   - Google Ads (토스 관련 키워드)
   - 페이스북/인스타그램

2. 추천 프로그램
   - 추천인/피추천인 모두 1개월 무료

3. B2B 영업
   - 스타트업 대상 세일즈
   - 에이전시 파트너십
```

### E. KPI 대시보드

```typescript
// 추적할 핵심 지표

interface KPIMetrics {
  // 사용자 지표
  users: {
    totalSignups: number;
    activeUsers: number;      // MAU
    newUsers: number;         // 이번 달 신규
    churnRate: number;        // 이탈률
  };
  
  // 제품 지표
  product: {
    projectsCreated: number;
    exportsCompleted: number;
    securityScansRun: number;
    docsGenerated: number;
    avgSessionDuration: number;
  };
  
  // 수익 지표
  revenue: {
    mrr: number;              // 월간 반복 매출
    arr: number;              // 연간 반복 매출
    arpu: number;             // 유저당 평균 매출
    ltv: number;              // 고객 생애 가치
    cac: number;              // 고객 획득 비용
  };
  
  // 심사 성공 지표 (핵심 차별점!)
  tossSubmission: {
    submitted: number;        // 심사 제출 건수
    approved: number;         // 승인 건수
    approvalRate: number;     // 승인률
    avgReviewTime: number;    // 평균 심사 기간
  };
}

// 목표 (Year 1 End)
const yearOneGoals: KPIMetrics = {
  users: {
    totalSignups: 12000,
    activeUsers: 3000,
    newUsers: 500,
    churnRate: 0.05
  },
  product: {
    projectsCreated: 5000,
    exportsCompleted: 1000,
    securityScansRun: 3000,
    docsGenerated: 2000,
    avgSessionDuration: 30  // 분
  },
  revenue: {
    mrr: 30000000,          // 3000만원
    arr: 360000000,         // 3.6억
    arpu: 50000,
    ltv: 600000,            // 12개월 기준
    cac: 100000             // LTV/CAC = 6
  },
  tossSubmission: {
    submitted: 300,
    approved: 270,
    approvalRate: 0.9,      // 90% 목표
    avgReviewTime: 5        // 영업일
  }
};
```

### 🚀 즉시 실행 가능한 첫 단계

```bash
# 1. 가격 페이지 추가
mkdir -p src/app/pricing
touch src/app/pricing/page.tsx

# 2. 분석 도구 설정
# Vercel Analytics 활성화 (무료)
# Google Analytics 설정

# 3. 대기자 명단 수집
# 랜딩 페이지에 이메일 수집 폼 추가

# 4. 콘텐츠 계획 작성
touch docs/content-plan.md
# 첫 달 블로그 5개 주제 정하기
```

---

## 📎 부록

### A. 참고 자료

- [토스 앱인토스 공식 문서](https://developers-apps-in-toss.toss.im/)
- [토스 개발자 콘솔](https://console-apps-in-toss.toss.im)
- [Craft.js 공식 문서](https://craft.js.org/)
- [Next.js App Router 문서](https://nextjs.org/docs/app)

### B. 용어집

| 용어 | 설명 |
|------|------|
| Safe-area | 디바이스 노치, 홈바 등을 피한 안전한 UI 영역 |
| CSP | Content Security Policy, XSS 방지 보안 헤더 |
| SDK 브릿지 | 웹뷰와 네이티브 앱 간 통신 인터페이스 |
| WebView | 앱 내 웹 콘텐츠를 표시하는 컴포넌트 |

### C. 체크리스트 템플릿

```markdown
## 출시 전 최종 체크리스트

### 기술
- [ ] 모든 테스트 통과
- [ ] 보안 스캔 A등급
- [ ] Lighthouse 90점 이상
- [ ] 에러 모니터링 설정

### 법률
- [ ] 이용약관 법률 검토 완료
- [ ] 개인정보처리방침 법률 검토 완료
- [ ] 면책조항 표기

### 비즈니스
- [ ] 가격 정책 확정
- [ ] 결제 시스템 테스트
- [ ] 지원 채널 준비

### 마케팅
- [ ] 랜딩 페이지 완성
- [ ] 소셜 미디어 계정 준비
- [ ] 프레스킷 준비
```

---

> **문서 버전**: v1.0.0  
> **마지막 수정**: 2026-02-12  
> **작성자**: Claude (AI Assistant)  
> **다음 업데이트 예정**: 2026-02-19 (Week 1 완료 후)