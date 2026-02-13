import type { ValidationItem, AppInfo } from '@/types/submit';
import { BANNED_KEYWORDS, BANNED_CATEGORIES } from '../constants';

/** 금지 키워드 체크 (앱 이름 + 설명) */
export function checkBannedKeywords(appInfo: AppInfo): ValidationItem {
  const targets = [
    appInfo.name,
    appInfo.englishName,
    appInfo.appName,
    appInfo.subtitle,
    appInfo.description,
  ];

  const found: string[] = [];
  for (const text of targets) {
    const lower = text.toLowerCase();
    for (const keyword of BANNED_KEYWORDS) {
      if (lower.includes(keyword.toLowerCase())) {
        found.push(keyword);
      }
    }
  }

  const unique = Array.from(new Set(found));

  if (unique.length > 0) {
    return {
      id: 'REQ-001',
      name: '금지 키워드 체크',
      status: 'fail',
      message: `금지 키워드 발견: ${unique.join(', ')}`,
      fix: '앱 이름, 부제, 설명에서 해당 키워드를 제거하세요.',
    };
  }

  return {
    id: 'REQ-001',
    name: '금지 키워드 체크',
    status: 'pass',
    message: '금지 키워드 없음',
  };
}

/** 금지 카테고리 체크 */
export function checkBannedCategory(appInfo: AppInfo): ValidationItem {
  const category = appInfo.category;

  if (BANNED_CATEGORIES.some((b) => category.includes(b))) {
    return {
      id: 'REQ-002',
      name: '금지 카테고리 체크',
      status: 'fail',
      message: `허용되지 않는 카테고리: ${category}`,
      fix: '가상자산, 사행성, 데이팅 카테고리는 앱인토스에서 허용되지 않습니다.',
    };
  }

  return {
    id: 'REQ-002',
    name: '금지 카테고리 체크',
    status: 'pass',
    message: '카테고리 문제 없음',
  };
}
