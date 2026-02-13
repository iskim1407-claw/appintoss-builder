/**
 * Input Validation 유틸리티
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/** 프로젝트 이름: 1~100자, 위험 문자 제한 */
export function validateProjectName(name: unknown): ValidationResult {
  if (typeof name !== 'string' || name.trim().length === 0) {
    return { valid: false, error: 'Project name is required' };
  }
  if (name.length > 100) {
    return { valid: false, error: 'Project name must be 100 characters or less' };
  }
  // 기본 위험 패턴 차단
  if (/<script|javascript:|on\w+\s*=/i.test(name)) {
    return { valid: false, error: 'Invalid characters in project name' };
  }
  return { valid: true };
}

/** canvas_data: JSON 파싱 검증, 최대 5MB */
const MAX_CANVAS_SIZE = 5 * 1024 * 1024;

export function validateCanvasData(data: unknown): ValidationResult {
  if (data === undefined || data === null || data === '') {
    return { valid: true }; // optional
  }
  if (typeof data !== 'string') {
    return { valid: false, error: 'canvas_data must be a string' };
  }
  if (data.length > MAX_CANVAS_SIZE) {
    return { valid: false, error: 'canvas_data exceeds 5MB limit' };
  }
  try {
    JSON.parse(data);
  } catch {
    return { valid: false, error: 'canvas_data is not valid JSON' };
  }
  return { valid: true };
}

/** appName: 소문자+하이픈+숫자만, 1~50자 */
export function validateAppName(name: unknown): ValidationResult {
  if (!name) return { valid: true }; // optional
  if (typeof name !== 'string') {
    return { valid: false, error: 'appName must be a string' };
  }
  if (!/^[a-z0-9][a-z0-9-]{0,49}$/.test(name)) {
    return { valid: false, error: 'appName must be lowercase letters, numbers, and hyphens (1-50 chars)' };
  }
  return { valid: true };
}

/** 이메일 검증 */
export function validateEmail(email: unknown): ValidationResult {
  if (!email) return { valid: true };
  if (typeof email !== 'string') {
    return { valid: false, error: 'Email must be a string' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  return { valid: true };
}

/** URL: https만 허용 */
export function validateUrl(url: unknown): ValidationResult {
  if (!url) return { valid: true };
  if (typeof url !== 'string') {
    return { valid: false, error: 'URL must be a string' };
  }
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') {
      return { valid: false, error: 'Only HTTPS URLs are allowed' };
    }
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
  return { valid: true };
}

/** 프로젝트 ID 검증 (UUID 형식) */
export function validateProjectId(id: unknown): ValidationResult {
  if (typeof id !== 'string' || id.length === 0) {
    return { valid: false, error: 'Project ID is required' };
  }
  if (id.length > 100) {
    return { valid: false, error: 'Invalid project ID' };
  }
  // 기본 안전 문자만 허용
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    return { valid: false, error: 'Invalid project ID format' };
  }
  return { valid: true };
}
