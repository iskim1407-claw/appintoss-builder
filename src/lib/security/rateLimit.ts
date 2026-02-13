/**
 * Rate Limiting (in-memory, Vercel Serverless 호환)
 * 서버리스 환경에서는 인스턴스별 메모리이므로 완벽하지 않지만 기본 방어는 됨
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// 오래된 항목 정리 (메모리 누수 방지)
const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  store.forEach((entry, key) => {
    if (entry.resetAt < now) store.delete(key);
  });
}

export interface RateLimitOptions {
  maxRequests: number;    // 윈도우 내 최대 요청 수
  windowMs: number;       // 윈도우 크기 (ms)
  keyPrefix?: string;     // 키 접두사 (엔드포인트별 분리)
}

const DEFAULT_OPTIONS: RateLimitOptions = {
  maxRequests: 60,
  windowMs: 60_000,
};

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

export function checkRateLimit(
  req: NextRequest,
  options: Partial<RateLimitOptions> = {}
): NextResponse | null {
  cleanup();

  const opts = { ...DEFAULT_OPTIONS, ...options };
  const ip = getClientIp(req);
  const key = `${opts.keyPrefix || 'default'}:${ip}`;
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + opts.windowMs });
    return null;
  }

  entry.count++;
  if (entry.count > opts.maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfter) },
      }
    );
  }

  return null;
}
