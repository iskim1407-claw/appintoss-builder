/**
 * Toss MiniApp Safe-Area CSS 유틸리티
 * env(safe-area-inset-*) 기반 레이아웃 지원
 */

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

export const DEFAULT_SAFE_AREA: SafeAreaConfig = DEVICE_SAFE_AREAS['iphone-14'];

/**
 * Toss MiniApp 심사용 Safe-Area CSS 생성
 * - env(safe-area-inset-*) 환경 변수 사용
 * - 폴백값 포함
 * - 고정 헤더/푸터 클래스 제공
 */
export function generateSafeAreaCSS(config: SafeAreaConfig = DEFAULT_SAFE_AREA): string {
  return `
/* ========================================
   Toss MiniApp Safe-Area Styles
   토스 미니앱 심사 대응용 CSS
   ======================================== */

:root {
  /* 폴백값 (env 미지원 환경) */
  --safe-area-inset-top: ${config.top}px;
  --safe-area-inset-bottom: ${config.bottom}px;
  --safe-area-inset-left: ${config.left}px;
  --safe-area-inset-right: ${config.right}px;
}

/* iOS Safari / Toss WebView 환경 변수 적용 */
@supports (padding: env(safe-area-inset-top)) {
  :root {
    --safe-area-inset-top: env(safe-area-inset-top, ${config.top}px);
    --safe-area-inset-bottom: env(safe-area-inset-bottom, ${config.bottom}px);
    --safe-area-inset-left: env(safe-area-inset-left, ${config.left}px);
    --safe-area-inset-right: env(safe-area-inset-right, ${config.right}px);
  }
}

/* 메인 앱 컨테이너 - Safe-area 자동 적용 */
.toss-app-container {
  padding-top: var(--safe-area-inset-top);
  padding-bottom: var(--safe-area-inset-bottom);
  padding-left: var(--safe-area-inset-left);
  padding-right: var(--safe-area-inset-right);
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport height (iOS 15+) */
  box-sizing: border-box;
}

/* 스크롤 가능한 콘텐츠 영역 (고정 헤더/푸터 사용 시) */
.toss-scroll-content {
  padding-top: var(--safe-area-inset-top);
  padding-bottom: calc(var(--safe-area-inset-bottom) + 56px); /* 하단바 높이 고려 */
  min-height: 100vh;
  min-height: 100dvh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 고정 헤더 - 노치/Dynamic Island 대응 */
.toss-fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding-top: var(--safe-area-inset-top);
  padding-left: var(--safe-area-inset-left);
  padding-right: var(--safe-area-inset-right);
  z-index: 100;
  background: var(--bg-primary, #FFFFFF);
}

/* 고정 하단 바 - 홈 인디케이터 대응 */
.toss-fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: var(--safe-area-inset-bottom);
  padding-left: var(--safe-area-inset-left);
  padding-right: var(--safe-area-inset-right);
  z-index: 100;
  background: var(--bg-primary, #FFFFFF);
}

/* 고정 FAB 버튼 */
.toss-fab {
  position: fixed;
  right: calc(16px + var(--safe-area-inset-right));
  bottom: calc(16px + var(--safe-area-inset-bottom));
  z-index: 99;
}

/* 풀스크린 모달/바텀시트 */
.toss-fullscreen-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: var(--safe-area-inset-top);
  padding-bottom: var(--safe-area-inset-bottom);
  padding-left: var(--safe-area-inset-left);
  padding-right: var(--safe-area-inset-right);
  z-index: 200;
}

/* 바텀시트 - Safe-area 반영 */
.toss-bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: var(--safe-area-inset-bottom);
  border-radius: 20px 20px 0 0;
  background: var(--bg-primary, #FFFFFF);
  z-index: 201;
  max-height: calc(90vh - var(--safe-area-inset-top));
  overflow-y: auto;
}

/* 키보드 올라올 때 대응 (iOS) */
@supports (height: 100dvh) {
  .toss-keyboard-aware {
    height: 100dvh;
    transition: height 0.3s ease;
  }
}
`;
}

/**
 * Safe-area 인식 viewport meta 태그 생성
 */
export function generateViewportMeta(): string {
  return 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
}

/**
 * 디바이스 유형 감지 (런타임용)
 */
export function detectDeviceSafeArea(): SafeAreaConfig {
  if (typeof window === 'undefined') return DEFAULT_SAFE_AREA;
  
  const ua = navigator.userAgent;
  
  // iPhone 15 Pro / Dynamic Island
  if (/iPhone1[5-9]|iPhone2\d/.test(ua)) {
    return DEVICE_SAFE_AREAS['iphone-15-pro'];
  }
  
  // iPhone with notch
  if (/iPhone1[0-4]/.test(ua)) {
    return DEVICE_SAFE_AREAS['iphone-14'];
  }
  
  // iPhone SE / older
  if (/iPhone/.test(ua)) {
    return DEVICE_SAFE_AREAS['iphone-se'];
  }
  
  // Android with gesture nav (추정)
  if (/Android/.test(ua)) {
    return DEVICE_SAFE_AREAS['android-gesture'];
  }
  
  return DEFAULT_SAFE_AREA;
}
