import type { AppInfo, ValidationResult, ValidationItem } from '@/types/submit';
import { checkBannedKeywords, checkBannedCategory } from './rules/keywords';
import { checkAppName, checkSubtitle, checkRequiredFields, checkPrivacyPolicy } from './rules/metadata';

/**
 * 앱 정보 전체 검증
 */
export function validateAppInfo(appInfo: AppInfo): ValidationResult {
  const items: ValidationItem[] = [];

  // 필수 검증
  const reqItems = [
    checkBannedKeywords(appInfo),
    checkBannedCategory(appInfo),
    checkAppName(appInfo),
    checkSubtitle(appInfo),
    checkRequiredFields(appInfo),
  ];
  reqItems.forEach((item) => { item.category = 'required'; });
  items.push(...reqItems);

  // 권장 검증
  const recItems = [
    checkPrivacyPolicy(appInfo),
  ];
  recItems.forEach((item) => { item.category = 'recommended'; });
  items.push(...recItems);

  // 점수 계산
  const totalWeight = items.reduce((sum, item) => {
    return sum + (item.category === 'required' ? 15 : item.category === 'recommended' ? 10 : 5);
  }, 0);
  const earnedWeight = items.reduce((sum, item) => {
    const w = item.category === 'required' ? 15 : item.category === 'recommended' ? 10 : 5;
    return sum + (item.status === 'pass' ? w : item.status === 'warning' ? w * 0.5 : 0);
  }, 0);
  const score = Math.round((earnedWeight / totalWeight) * 100);

  const hasFail = items.some((i) => i.status === 'fail');
  const hasWarning = items.some((i) => i.status === 'warning');

  return {
    passed: !hasFail,
    score,
    category: hasFail ? 'fail' : hasWarning ? 'warning' : 'pass',
    items,
  };
}

export { checkBannedKeywords, checkBannedCategory } from './rules/keywords';
export { checkAppName, checkSubtitle, checkRequiredFields, checkPrivacyPolicy } from './rules/metadata';
