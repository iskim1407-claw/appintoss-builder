/**
 * CSRF 방어 미들웨어
 * Origin/Referer 헤더 검증
 */

import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean) as string[];

export function validateCsrf(req: NextRequest): NextResponse | null {
  const method = req.method.toUpperCase();
  
  // GET, HEAD, OPTIONS는 안전한 메서드
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return null;
  }

  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');

  // origin이 있으면 origin으로 검증
  if (origin) {
    if (ALLOWED_ORIGINS.some(allowed => origin === allowed)) {
      return null;
    }
    return NextResponse.json(
      { error: 'CSRF validation failed' },
      { status: 403 }
    );
  }

  // origin이 없으면 referer로 검증
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = refererUrl.origin;
      if (ALLOWED_ORIGINS.some(allowed => refererOrigin === allowed)) {
        return null;
      }
    } catch {
      // invalid referer
    }
    return NextResponse.json(
      { error: 'CSRF validation failed' },
      { status: 403 }
    );
  }

  // origin도 referer도 없는 경우 (API 클라이언트 등) - 허용
  // 실제 브라우저 요청은 항상 origin 또는 referer를 보냄
  return null;
}
