import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `너는 토스 미니앱 심사 제출 폼을 작성하는 도우미야.
사용자가 앱에 대한 간단한 설명을 주면, 아래 필드를 한국어로 작성해줘:
- appName: 앱 이름 (20자 이내, 간결하고 직관적)
- appDescription: 앱 설명 (200자 이내, 앱의 핵심 기능과 가치)
- category: 카테고리 (라이프스타일/금융/교육/엔터테인먼트/유틸리티/소셜/건강/쇼핑 중 택1)
- targetAudience: 타겟 사용자 (50자 이내)
- mainFeatures: 주요 기능 3가지 (배열, 각 50자 이내)
- privacyInfo: 개인정보 수집 항목 설명 (수집 안 하면 "개인정보를 수집하지 않습니다")
JSON으로만 응답해.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI 기능을 사용할 수 없습니다" }, { status: 503 });
  }

  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json({ error: "프롬프트를 입력해주세요" }, { status: 400 });
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("OpenAI error:", err);
      return NextResponse.json({ error: "AI 요청에 실패했습니다" }, { status: 502 });
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? "";

    // Parse JSON from response (handle markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AI 응답을 파싱할 수 없습니다" }, { status: 502 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (e) {
    console.error("AI fill error:", e);
    return NextResponse.json({ error: "AI 처리 중 오류가 발생했습니다" }, { status: 500 });
  }
}
