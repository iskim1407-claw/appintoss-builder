/**
 * Prompt Injection 방어
 * 사용자 입력에서 시스템 프롬프트 조작 시도를 감지/차단
 */

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /ignore\s+(all\s+)?above/i,
  /disregard\s+(all\s+)?previous/i,
  /forget\s+(all\s+)?previous/i,
  /you\s+are\s+now/i,
  /new\s+instructions?:/i,
  /system\s*:/i,
  /assistant\s*:/i,
  /\buser\s*:\s*\n/i,
  /\[INST\]/i,
  /<<SYS>>/i,
  /<\|im_start\|>/i,
  /\bdo\s+anything\s+now\b/i,
  /\bjailbreak\b/i,
  /\bDAN\s+mode\b/i,
];

export interface PromptGuardResult {
  safe: boolean;
  matchedPattern?: string;
}

export function checkPromptInjection(input: string): PromptGuardResult {
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      return { safe: false, matchedPattern: pattern.source };
    }
  }
  return { safe: true };
}

/**
 * 입력을 정화하여 안전한 문자열로 반환
 * AI 프롬프트에 삽입하기 전에 사용
 */
export function sanitizeForPrompt(input: string): string {
  // 제어 문자 제거
  let cleaned = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  // 과도한 공백 정리
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  return cleaned.trim();
}
