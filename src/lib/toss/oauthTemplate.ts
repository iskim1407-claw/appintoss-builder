/**
 * Toss OAuth 로그인 스켈레톤 코드 생성기
 * 심사 제출용 인증 흐름 템플릿 제공
 */

export interface OAuthTemplateConfig {
  serviceName: string;
  scopes: string[];
  includeProfile: boolean;
  includePayment: boolean;
  redirectUri?: string;
}

/**
 * React Hook 형태의 Toss 인증 코드 생성
 */
export function generateAuthHookCode(config: OAuthTemplateConfig): string {
  return `// src/hooks/useTossAuth.ts
// Toss OAuth 인증 Hook
// 생성일: ${new Date().toISOString().split('T')[0]}
// 서비스: ${config.serviceName}

import { useState, useEffect, useCallback } from 'react';

// ============================================
// Type Definitions
// ============================================

interface TossUser {
  id: string;
  name: string;
  profileImage?: string;
  ${config.includePayment ? `paymentMethods?: PaymentMethod[];` : ''}
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

// ============================================
// Toss SDK Bridge (인라인)
// ============================================

const isTossEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(window as any).TossApp || !!(window as any).webkit?.messageHandlers?.toss;
};

const getTossSDK = () => {
  // 실제 환경에서는 네이티브 브릿지 사용
  if (isTossEnvironment() && (window as any).TossApp) {
    return (window as any).TossApp;
  }
  
  // Mock SDK (개발용)
  return {
    auth: {
      async login() {
        console.log('[Mock] Toss 로그인');
        return {
          accessToken: 'mock_token_' + Date.now(),
          user: { id: 'mock_1', name: '테스트 사용자' }
        };
      },
      async logout() {
        console.log('[Mock] Toss 로그아웃');
      },
      async getAccessToken() {
        return localStorage.getItem('toss_token');
      },
      async isLoggedIn() {
        return !!localStorage.getItem('toss_token');
      }
    }
  };
};

// ============================================
// Auth Hook
// ============================================

export function useTossAuth() {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    accessToken: null,
    error: null
  });

  // 초기 인증 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const sdk = getTossSDK();
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
      const sdk = getTossSDK();
      const result = await sdk.auth.login();
      
      // 개발 환경에서는 localStorage에 저장
      if (!isTossEnvironment()) {
        localStorage.setItem('toss_token', result.accessToken);
        localStorage.setItem('toss_user', JSON.stringify(result.user));
      }
      
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
  }, []);

  // 로그아웃
  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const sdk = getTossSDK();
      await sdk.auth.logout();
      
      // 개발 환경에서는 localStorage에서 제거
      if (!isTossEnvironment()) {
        localStorage.removeItem('toss_token');
        localStorage.removeItem('toss_user');
      }
      
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
  }, []);

  // 토큰 갱신
  const refreshToken = useCallback(async () => {
    if (!state.isAuthenticated) return null;
    
    try {
      const sdk = getTossSDK();
      const newToken = await sdk.auth.getAccessToken();
      
      setState(prev => ({
        ...prev,
        accessToken: newToken
      }));
      
      return newToken;
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      return null;
    }
  }, [state.isAuthenticated]);

  return {
    ...state,
    login,
    logout,
    refreshToken
  };
}

// ============================================
// Login Button Component
// ============================================

interface TossLoginButtonProps {
  onSuccess?: (user: TossUser) => void;
  onError?: (error: Error) => void;
  children?: React.ReactNode;
  className?: string;
}

export function TossLoginButton({ 
  onSuccess,
  onError,
  children = '토스로 로그인',
  className = ''
}: TossLoginButtonProps) {
  const { login, isLoading } = useTossAuth();
  
  const handleClick = async () => {
    try {
      const result = await login();
      onSuccess?.(result.user);
    } catch (error) {
      onError?.(error as Error);
    }
  };
  
  const defaultStyles = \`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 14px 20px;
    background: #0064FF;
    color: white;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.2s;
  \`;
  
  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={className}
      style={className ? undefined : { cssText: defaultStyles } as any}
    >
      {/* Toss 로고 SVG */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="white"/>
        <path 
          d="M8 12L11 15L16 9" 
          stroke="#0064FF" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      {isLoading ? '로그인 중...' : children}
    </button>
  );
}
`;
}

/**
 * 인증 페이지 템플릿 코드 생성
 */
export function generateAuthPageCode(config: OAuthTemplateConfig): string {
  return `// src/app/auth/page.tsx (또는 pages/auth.tsx)
// Toss 인증 페이지
// 서비스: ${config.serviceName}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTossAuth, TossLoginButton } from '@/hooks/useTossAuth';

export default function AuthPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useTossAuth();
  
  // 이미 로그인되어 있으면 홈으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('${config.redirectUri || '/'}');
    }
  }, [isAuthenticated, user, router]);
  
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F9FAFB'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid #3182F6',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{\`@keyframes spin { to { transform: rotate(360deg); } }\`}</style>
      </div>
    );
  }
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: '#F9FAFB'
    }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>
        {/* 로고/타이틀 영역 */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#191F28',
            marginBottom: '8px'
          }}>
            ${config.serviceName}
          </h1>
          <p style={{
            fontSize: '15px',
            color: '#8B95A1',
            lineHeight: '1.5'
          }}>
            토스 계정으로 간편하게 시작하세요
          </p>
        </div>
        
        {/* 로그인 버튼 */}
        <TossLoginButton
          onSuccess={(user) => {
            console.log('로그인 성공:', user.name);
            router.push('${config.redirectUri || '/'}');
          }}
          onError={(error) => {
            console.error('로그인 실패:', error.message);
            alert('로그인에 실패했습니다. 다시 시도해주세요.');
          }}
        />
        
        {/* 약관 안내 */}
        <p style={{
          marginTop: '24px',
          fontSize: '12px',
          textAlign: 'center',
          color: '#B0B8C1',
          lineHeight: '1.6'
        }}>
          로그인 시{' '}
          <a href="/terms" style={{ color: '#6B7684', textDecoration: 'underline' }}>
            서비스 이용약관
          </a>
          과{' '}
          <a href="/privacy" style={{ color: '#6B7684', textDecoration: 'underline' }}>
            개인정보처리방침
          </a>
          에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
`;
}

/**
 * 인증 가드 HOC 코드 생성
 */
export function generateAuthGuardCode(): string {
  return `// src/components/AuthGuard.tsx
// 인증 필요 페이지 래퍼

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTossAuth } from '@/hooks/useTossAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ 
  children, 
  fallback,
  redirectTo = '/auth' 
}: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useTossAuth();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);
  
  if (isLoading) {
    return fallback || (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          border: '3px solid #3182F6',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null;
  }
  
  return <>{children}</>;
}

// 사용 예시:
// <AuthGuard>
//   <ProtectedPage />
// </AuthGuard>
`;
}

/**
 * 전체 인증 모듈 번들 코드 생성
 */
export function generateFullAuthModule(config: OAuthTemplateConfig): string {
  const hook = generateAuthHookCode(config);
  const page = generateAuthPageCode(config);
  const guard = generateAuthGuardCode();
  
  return `
/*
 * ========================================
 * Toss OAuth 인증 모듈
 * ========================================
 * 서비스: ${config.serviceName}
 * 생성일: ${new Date().toISOString().split('T')[0]}
 * 
 * 포함 파일:
 * 1. src/hooks/useTossAuth.ts - 인증 Hook
 * 2. src/app/auth/page.tsx - 로그인 페이지
 * 3. src/components/AuthGuard.tsx - 인증 가드
 * ========================================
 */

// ========================================
// FILE: src/hooks/useTossAuth.ts
// ========================================
${hook}

// ========================================
// FILE: src/app/auth/page.tsx
// ========================================
${page}

// ========================================
// FILE: src/components/AuthGuard.tsx
// ========================================
${guard}
`;
}
