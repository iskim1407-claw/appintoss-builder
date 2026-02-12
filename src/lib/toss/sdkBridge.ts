/**
 * Toss MiniApp SDK 브릿지 추상화 레이어
 * 토스 환경과 개발 환경 모두에서 동작하는 통합 인터페이스
 */

// ============================================
// Type Definitions
// ============================================

export interface TossUser {
  id: string;
  name: string;
  profileImage?: string;
  phoneNumber?: string;
}

export interface TossPaymentRequest {
  orderId: string;
  amount: number;
  orderName: string;
  customerName?: string;
  successUrl?: string;
  failUrl?: string;
}

export interface TossPaymentResult {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface TossDeviceInfo {
  platform: 'ios' | 'android' | 'web';
  version: string;
  appVersion?: string;
}

export interface ShareOptions {
  title: string;
  text?: string;
  url?: string;
}

// ============================================
// SDK Bridge Interface
// ============================================

export interface TossSDKBridge {
  // 인증
  auth: {
    login(): Promise<{ accessToken: string; user: TossUser }>;
    logout(): Promise<void>;
    getAccessToken(): Promise<string | null>;
    isLoggedIn(): Promise<boolean>;
    getUser(): Promise<TossUser | null>;
  };
  
  // 네비게이션
  navigation: {
    back(): void;
    close(): void;
    openExternal(url: string): void;
    setTitle(title: string): void;
  };
  
  // 결제
  payment: {
    requestPayment(request: TossPaymentRequest): Promise<TossPaymentResult>;
    requestTossPay(request: TossPaymentRequest): Promise<TossPaymentResult>;
  };
  
  // 유틸리티
  utils: {
    share(data: ShareOptions): Promise<void>;
    haptic(type: 'light' | 'medium' | 'heavy'): void;
    showToast(message: string, duration?: number): void;
    copyToClipboard(text: string): Promise<void>;
  };
  
  // 디바이스
  device: {
    getSafeAreaInsets(): Promise<SafeAreaInsets>;
    getDeviceInfo(): Promise<TossDeviceInfo>;
    requestPushPermission(): Promise<'granted' | 'denied' | 'default'>;
  };
}

// ============================================
// Environment Detection
// ============================================

declare global {
  interface Window {
    TossApp?: TossSDKBridge;
    webkit?: {
      messageHandlers?: {
        toss?: {
          postMessage: (message: unknown) => void;
        };
      };
    };
    __tossCallbacks?: Record<string, {
      resolve: (value: unknown) => void;
      reject?: (error: Error) => void;
    }>;
  }
}

export function isTossEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window.TossApp || window.webkit?.messageHandlers?.toss);
}

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

// ============================================
// Mock SDK (개발 환경용)
// ============================================

function createMockSDK(): TossSDKBridge {
  const STORAGE_KEY = 'toss_mock_auth';
  
  return {
    auth: {
      async login() {
        console.log('[Toss SDK Mock] login() called');
        const user: TossUser = {
          id: 'mock_user_' + Date.now(),
          name: '테스트 사용자',
          profileImage: 'https://static.toss.im/icons/png/4x/icon-profile-default.png'
        };
        const accessToken = 'mock_token_' + Date.now();
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, accessToken }));
        return { accessToken, user };
      },
      
      async logout() {
        console.log('[Toss SDK Mock] logout() called');
        localStorage.removeItem(STORAGE_KEY);
      },
      
      async getAccessToken() {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
          const parsed = JSON.parse(data);
          return parsed.accessToken;
        }
        return null;
      },
      
      async isLoggedIn() {
        return !!localStorage.getItem(STORAGE_KEY);
      },
      
      async getUser() {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
          const parsed = JSON.parse(data);
          return parsed.user;
        }
        return null;
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
        window.open(url, '_blank', 'noopener,noreferrer');
      },
      
      setTitle(title: string) {
        console.log('[Toss SDK Mock] setTitle:', title);
        document.title = title;
      }
    },
    
    payment: {
      async requestPayment(request) {
        console.log('[Toss SDK Mock] requestPayment:', request);
        
        // 개발 환경에서는 모달로 결제 시뮬레이션
        const confirmed = confirm(`[결제 테스트]\n\n주문명: ${request.orderName}\n금액: ${request.amount.toLocaleString()}원\n\n결제를 진행하시겠습니까?`);
        
        if (confirmed) {
          return {
            paymentKey: 'mock_payment_' + Date.now(),
            orderId: request.orderId,
            amount: request.amount
          };
        }
        throw new Error('사용자가 결제를 취소했습니다.');
      },
      
      async requestTossPay(request) {
        console.log('[Toss SDK Mock] requestTossPay:', request);
        return this.requestPayment(request);
      }
    },
    
    utils: {
      async share(data) {
        console.log('[Toss SDK Mock] share:', data);
        
        if (navigator.share) {
          await navigator.share(data);
        } else {
          // 폴백: 클립보드에 URL 복사
          const text = data.url || data.text || data.title;
          await navigator.clipboard.writeText(text);
          alert('링크가 복사되었습니다!');
        }
      },
      
      haptic(type) {
        console.log('[Toss SDK Mock] haptic:', type);
        if (navigator.vibrate) {
          const duration = type === 'light' ? 10 : type === 'medium' ? 20 : 30;
          navigator.vibrate(duration);
        }
      },
      
      showToast(message, duration = 2000) {
        console.log('[Toss SDK Mock] toast:', message);
        
        // 토스트 UI 생성
        let container = document.querySelector('.toss-toast-container') as HTMLElement;
        if (!container) {
          container = document.createElement('div');
          container.className = 'toss-toast-container';
          container.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);z-index:9999;';
          document.body.appendChild(container);
        }
        
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = 'background:#333D4B;color:white;padding:14px 24px;border-radius:12px;font-size:14px;font-weight:500;opacity:0;transform:translateY(20px);transition:all 0.3s ease;white-space:nowrap;';
        container.appendChild(toast);
        
        requestAnimationFrame(() => {
          toast.style.opacity = '1';
          toast.style.transform = 'translateY(0)';
        });
        
        setTimeout(() => {
          toast.style.opacity = '0';
          toast.style.transform = 'translateY(10px)';
          setTimeout(() => toast.remove(), 300);
        }, duration);
      },
      
      async copyToClipboard(text) {
        await navigator.clipboard.writeText(text);
        this.showToast('복사되었습니다!');
      }
    },
    
    device: {
      async getSafeAreaInsets() {
        // CSS 환경 변수에서 값 읽기 시도
        const computedStyle = getComputedStyle(document.documentElement);
        const getInset = (name: string, fallback: number) => {
          const value = computedStyle.getPropertyValue(`--safe-area-inset-${name}`);
          return value ? parseInt(value) || fallback : fallback;
        };
        
        return {
          top: getInset('top', 47),
          bottom: getInset('bottom', 34),
          left: getInset('left', 0),
          right: getInset('right', 0)
        };
      },
      
      async getDeviceInfo() {
        const ua = navigator.userAgent;
        let platform: 'ios' | 'android' | 'web' = 'web';
        
        if (/iPhone|iPad|iPod/.test(ua)) {
          platform = 'ios';
        } else if (/Android/.test(ua)) {
          platform = 'android';
        }
        
        return {
          platform,
          version: '1.0.0'
        };
      },
      
      async requestPushPermission() {
        if ('Notification' in window) {
          return await Notification.requestPermission();
        }
        return 'denied';
      }
    }
  };
}

// ============================================
// Native Bridge (토스 환경용)
// ============================================

function createNativeBridge(): TossSDKBridge {
  // 실제 토스 앱 내부에서는 window.TossApp이 주입됨
  if (window.TossApp) {
    return window.TossApp;
  }
  
  // iOS WebKit MessageHandler 기반 브릿지
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const callNative = <T>(method: string, params?: unknown): Promise<T> => {
    return new Promise((resolve, reject) => {
      const callbackId = `cb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      window.__tossCallbacks = window.__tossCallbacks || {};
      window.__tossCallbacks[callbackId] = { resolve: resolve as (value: unknown) => void, reject };
      
      window.webkit?.messageHandlers?.toss?.postMessage({
        method,
        params,
        callbackId
      });
      
      // 타임아웃 (30초)
      setTimeout(() => {
        if (window.__tossCallbacks?.[callbackId]) {
          delete window.__tossCallbacks[callbackId];
          reject(new Error('Native bridge timeout'));
        }
      }, 30000);
    });
  };
  
  // 폴백으로 Mock SDK 반환 (개발 편의)
  console.warn('[Toss SDK] Native bridge not available, using mock SDK');
  return createMockSDK();
}

// ============================================
// Singleton Instance
// ============================================

let sdkInstance: TossSDKBridge | null = null;

export function getTossSDK(): TossSDKBridge {
  if (sdkInstance) return sdkInstance;
  
  if (isTossEnvironment()) {
    sdkInstance = createNativeBridge();
  } else {
    sdkInstance = createMockSDK();
  }
  
  return sdkInstance;
}

// ============================================
// Generated Script for HTML Export
// ============================================

/**
 * HTML Export용 SDK 브릿지 스크립트 생성
 * - 인라인 가능한 JS 코드 반환
 * - Mock/Native 환경 자동 감지
 */
export function generateSDKBridgeScript(): string {
  return `
// ========================================
// Toss MiniApp SDK Bridge
// 토스 미니앱 심사 대응용 브릿지
// ========================================

(function() {
  'use strict';
  
  // 환경 감지
  var isTossEnv = !!(window.TossApp || (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.toss));
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  // 콜백 저장소
  window.__tossCallbacks = window.__tossCallbacks || {};
  
  // 네이티브 호출 함수
  function callNative(method, params) {
    return new Promise(function(resolve, reject) {
      var callbackId = 'cb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      window.__tossCallbacks[callbackId] = { resolve: resolve, reject: reject };
      
      if (window.TossApp && window.TossApp[method]) {
        window.TossApp[method](params, callbackId);
      } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.toss) {
        window.webkit.messageHandlers.toss.postMessage({
          method: method,
          params: params,
          callbackId: callbackId
        });
      } else {
        delete window.__tossCallbacks[callbackId];
        reject(new Error('Native bridge not available'));
      }
      
      // 타임아웃
      setTimeout(function() {
        if (window.__tossCallbacks[callbackId]) {
          delete window.__tossCallbacks[callbackId];
          reject(new Error('Native bridge timeout'));
        }
      }, 30000);
    });
  }
  
  // 콜백 응답 핸들러
  window.__handleTossCallback = function(callbackId, result, error) {
    var cb = window.__tossCallbacks[callbackId];
    if (cb) {
      if (error) {
        cb.reject && cb.reject(new Error(error));
      } else {
        cb.resolve && cb.resolve(result);
      }
      delete window.__tossCallbacks[callbackId];
    }
  };
  
  // 토스트 표시
  function showToast(message, duration) {
    duration = duration || 2000;
    var container = document.querySelector('.toss-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toss-toast-container';
      container.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);z-index:9999;';
      document.body.appendChild(container);
    }
    
    var toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = 'background:#333D4B;color:white;padding:14px 24px;border-radius:12px;font-size:14px;font-weight:500;opacity:0;transform:translateY(20px);transition:all 0.3s ease;white-space:nowrap;';
    container.appendChild(toast);
    
    requestAnimationFrame(function() {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    
    setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(function() { toast.remove(); }, 300);
    }, duration);
  }
  
  // SDK 객체 생성
  window.TossBridge = {
    // 환경 정보
    isTossEnv: isTossEnv,
    isMobile: isMobile,
    
    // 네비게이션
    goBack: function() {
      if (isTossEnv) {
        callNative('goBack').catch(function() { history.back(); });
      } else {
        history.back();
      }
    },
    
    close: function() {
      if (isTossEnv) {
        callNative('close').catch(function() { window.close(); });
      } else {
        window.close();
      }
    },
    
    openLink: function(url) {
      if (isTossEnv) {
        callNative('openExternal', { url: url });
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    
    // 결제
    pay: function(options) {
      if (isTossEnv) {
        return callNative('requestPayment', options);
      } else {
        return new Promise(function(resolve, reject) {
          var confirmed = confirm('[결제 테스트]\\n\\n주문명: ' + options.orderName + '\\n금액: ' + options.amount.toLocaleString() + '원\\n\\n결제를 진행하시겠습니까?');
          if (confirmed) {
            resolve({ paymentKey: 'mock_' + Date.now(), orderId: options.orderId, amount: options.amount });
          } else {
            reject(new Error('결제 취소'));
          }
        });
      }
    },
    
    // 토스트
    toast: showToast,
    
    // 사용자 정보
    getUser: function() {
      if (isTossEnv) {
        return callNative('getUser');
      } else {
        return Promise.resolve({ id: 'test_user', name: '테스트 사용자' });
      }
    },
    
    // 공유
    share: function(options) {
      if (navigator.share) {
        return navigator.share(options);
      } else {
        return navigator.clipboard.writeText(options.url || options.text || options.title).then(function() {
          showToast('링크가 복사되었습니다!');
        });
      }
    },
    
    // 클립보드 복사
    copyToClipboard: function(text) {
      return navigator.clipboard.writeText(text).then(function() {
        showToast('복사되었습니다!');
      });
    },
    
    // 햅틱 피드백
    haptic: function(type) {
      if (isTossEnv) {
        callNative('haptic', { type: type });
      } else if (navigator.vibrate) {
        var duration = type === 'light' ? 10 : type === 'medium' ? 20 : 30;
        navigator.vibrate(duration);
      }
    },
    
    // 푸시 권한 요청
    requestPushPermission: function() {
      if ('Notification' in window) {
        return Notification.requestPermission();
      }
      return Promise.resolve('denied');
    },
    
    // Safe-area insets 가져오기
    getSafeAreaInsets: function() {
      if (isTossEnv) {
        return callNative('getSafeAreaInsets');
      }
      var style = getComputedStyle(document.documentElement);
      return Promise.resolve({
        top: parseInt(style.getPropertyValue('--safe-area-inset-top')) || 47,
        bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom')) || 34,
        left: 0,
        right: 0
      });
    }
  };
  
  // 하위 호환 alias
  window.bridge = window.TossBridge;
  
  console.log('[Toss Bridge] Initialized (env: ' + (isTossEnv ? 'toss' : 'web') + ')');
})();
`;
}
