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
