import type { ValidationItem, AppInfo } from '@/types/submit';
import { APPNAME_REGEX, SUBTITLE_MAX_LENGTH } from '../constants';

/** appName 형식 검증 */
export function checkAppName(appInfo: AppInfo): ValidationItem {
  if (!appInfo.appName) {
    return {
      id: 'REQ-003',
      name: 'appName 형식',
      status: 'fail',
      message: 'appName이 비어있습니다.',
      fix: '소문자로 시작하는 영문+숫자+하이픈 조합의 appName을 입력하세요.',
    };
  }

  if (!APPNAME_REGEX.test(appInfo.appName)) {
    return {
      id: 'REQ-003',
      name: 'appName 형식',
      status: 'fail',
      message: `appName "${appInfo.appName}"이 형식에 맞지 않습니다.`,
      fix: '소문자로 시작, 소문자/숫자/하이픈만 허용됩니다. (예: my-cool-app)',
    };
  }

  return {
    id: 'REQ-003',
    name: 'appName 형식',
    status: 'pass',
    message: 'appName 형식 OK',
  };
}

/** 부제 길이 검증 */
export function checkSubtitle(appInfo: AppInfo): ValidationItem {
  const len = appInfo.subtitle.length;

  if (len === 0) {
    return {
      id: 'REQ-005',
      name: '부제 길이',
      status: 'fail',
      message: '부제가 비어있습니다.',
      fix: '20자 이내의 부제를 입력하세요.',
    };
  }

  if (len > SUBTITLE_MAX_LENGTH) {
    return {
      id: 'REQ-005',
      name: '부제 길이',
      status: 'fail',
      message: `부제 ${len}자 (최대 ${SUBTITLE_MAX_LENGTH}자)`,
      fix: `부제를 ${SUBTITLE_MAX_LENGTH}자 이내로 줄이세요.`,
    };
  }

  return {
    id: 'REQ-005',
    name: '부제 길이',
    status: 'pass',
    message: `부제 ${len}자 OK`,
  };
}

/** 필수 필드 검증 */
export function checkRequiredFields(appInfo: AppInfo): ValidationItem {
  const missing: string[] = [];

  if (!appInfo.name) missing.push('앱 이름(한국어)');
  if (!appInfo.englishName) missing.push('앱 이름(영문)');
  if (!appInfo.appName) missing.push('appName');
  if (!appInfo.category) missing.push('카테고리');
  if (!appInfo.description) missing.push('설명');
  if (!appInfo.contactEmail && !appInfo.email) missing.push('연락처 이메일');
  if (!appInfo.ageRating) missing.push('연령 등급');

  if (missing.length > 0) {
    return {
      id: 'REQ-006',
      name: '필수 필드',
      status: 'fail',
      message: `누락된 필수 필드: ${missing.join(', ')}`,
      fix: '모든 필수 필드를 입력하세요.',
    };
  }

  return {
    id: 'REQ-006',
    name: '필수 필드',
    status: 'pass',
    message: '모든 필수 필드 입력 완료',
  };
}

/** 상세 설명 검증 (2026-02-10 신규 필드) */
export function checkDetailedDescription(appInfo: AppInfo): ValidationItem {
  if (!appInfo.detailedDescription || appInfo.detailedDescription.trim().length < 20) {
    return {
      id: 'REC-003',
      name: '상세 설명',
      status: 'warning',
      message: '상세 설명이 비어있거나 너무 짧습니다.',
      fix: '"서비스 접속 → 행동 → 결과" 흐름을 구체적으로 작성하면 AI 마케팅 소재 자동생성에 활용됩니다.',
    };
  }

  return {
    id: 'REC-003',
    name: '상세 설명',
    status: 'pass',
    message: '상세 설명 작성 완료',
  };
}

/** AI 활용 법 준수 고지 안내 (2026-01-23 인공지능기본법) */
export function checkAiDisclosure(appInfo: AppInfo): ValidationItem {
  const aiKeywords = ['ai', 'AI', '인공지능', 'gpt', 'GPT', '생성형', 'llm', 'LLM', 'chatbot', '챗봇'];
  const text = `${appInfo.name} ${appInfo.description} ${appInfo.detailedDescription || ''}`;
  const usesAi = aiKeywords.some((kw) => text.includes(kw));

  if (!usesAi) {
    return {
      id: 'REC-004',
      name: 'AI 고지 의무',
      status: 'pass',
      message: 'AI 활용 미해당 (자동 감지)',
    };
  }

  return {
    id: 'REC-004',
    name: 'AI 고지 의무',
    status: 'warning',
    message: 'AI 활용 미니앱으로 감지됨 — 인공지능기본법에 따라 AI 사용 사전고지 및 결과물 표시 의무가 있습니다.',
    fix: '앱 내에 "이 서비스는 AI를 활용합니다" 고지문구와 AI 생성 콘텐츠 라벨을 추가하세요.',
  };
}

/** 개인정보처리방침 링크 검증 */
export function checkPrivacyPolicy(appInfo: AppInfo): ValidationItem {
  if (!appInfo.privacyPolicyUrl) {
    return {
      id: 'REC-002',
      name: '개인정보처리방침',
      status: 'warning',
      message: '개인정보처리방침 링크가 없습니다.',
      fix: '개인정보처리방침 URL을 입력하면 심사 통과 확률이 높아집니다.',
    };
  }

  return {
    id: 'REC-002',
    name: '개인정보처리방침',
    status: 'pass',
    message: '개인정보처리방침 링크 있음',
  };
}
