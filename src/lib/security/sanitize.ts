/**
 * XSS 방어 유틸리티
 */

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 문자열에서 잠재적 스크립트 태그 제거 (이중 방어)
 */
export function stripScriptTags(str: string): string {
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}
