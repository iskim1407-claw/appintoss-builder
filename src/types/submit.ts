// 앱인토스 제출 관련 타입 정의

export interface AppInfo {
  name: string;           // 한글 앱 이름
  englishName: string;    // 영어 앱 이름
  appName: string;        // 앱인토스 appName (lowercase, hyphen)
  subtitle: string;       // 부제 (20자 제한)
  category: string;       // 카테고리
  description: string;    // 설명
  keywords: string[];     // 검색 키워드
  email: string;          // 연락처 이메일
  contactEmail?: string;  // alias for email (validation compat)
  ageRating: '전체' | '만12세' | '만19세';
  logo: string | null;    // Base64 인코딩된 로고 이미지
  privacyPolicyUrl: string; // 개인정보처리방침 URL
}

export type ValidationStatus = 'pass' | 'warning' | 'fail';

export interface ValidationItem {
  id: string;
  name: string;
  status: ValidationStatus;
  message: string;
  fix?: string;
  category?: 'required' | 'recommended' | 'optional';
}

export interface ValidationResult {
  passed: boolean;
  score: number;       // 0-100
  category: ValidationStatus;
  items: ValidationItem[];
}

export const CATEGORIES = [
  '생활 > 일상 > 기타',
  '생활 > 일상 > 유틸리티',
  '생활 > 금융 > 자산관리',
  '생활 > 금융 > 핀테크',
  '엔터테인먼트 > 퀴즈/테스트',
  '엔터테인먼트 > 교육',
  '비즈니스 > 생산성',
  '소셜 > 커뮤니티',
] as const;

export const AGE_RATINGS = ['전체', '만12세', '만19세'] as const;
