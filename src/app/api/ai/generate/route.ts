import { NextRequest } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are an expert app UI designer for 앱인토스 (Appintoss), a Toss-style mini app platform.
You generate Craft.js JSON that creates beautiful, functional app layouts.

Available components and their props:

## TDS Core
- NavigationComponent: { title: string, showBack: boolean, showMenu: boolean }
- ButtonComponent: { text: string, bgColor: string, textColor: string, fullWidth: boolean, size: "small"|"medium"|"large", action: "toast"|"link"|"page", actionValue: string }
- TextComponent: { text: string, fontSize: number, color: string, fontWeight: string, textAlign: string, variant: "t1"|"t2"|"t3"|"t4"|"t5"|"t6"|"t7" }
- BadgeComponent: { text: string, bgColor: string, textColor: string }
- ListRowComponent: { title: string, description: string, showArrow: boolean }
- TabComponent: { tabs: string[] }
- TabBarComponent: { tabs: Array<{icon: string, label: string, pageId: string}> }

## TDS Input
- TextFieldComponent: { label: string, placeholder: string, helperText: string }
- SwitchComponent: { label: string, checked: boolean }
- CheckboxComponent: { label: string, checked: boolean }

## TDS Feedback
- ProgressBarComponent: { value: number, max: number, label: string, barColor: string }
- ToastComponent: { message: string, type: "success"|"error"|"info" }
- SkeletonComponent: { lines: number }
- DialogComponent: { title: string, message: string, confirmText: string, cancelText: string }

## TDS Layout
- BottomCTAComponent: { text: string, bgColor: string }
- BottomSheetComponent: { title: string }

## Basic
- HeaderComponent: { text: string, level: "h1"|"h2"|"h3" }
- ImageComponent: { src: string, borderRadius: number, aspectRatio: string }
- CardComponent: { title: string, description: string }
- ListComponent: { items: string[] }
- DividerComponent: {}
- SpacerComponent: { height: number }
- CarouselComponent: { images: string[], autoPlay: boolean }
- InputComponent: { placeholder: string }
- GridComponent: { columns: number }

## Fintech
- PaymentComponent: { title: string, buttonText: string }
- AccountComponent: { title: string }
- CreditScoreComponent: { score: number }
- ProductCompareComponent: { title: string }
- TransactionListComponent: { title: string }

## Quiz/Test
- QuizIntroComponent: { title: string, subtitle: string, emoji: string, buttonText: string }
- QuizQuestionComponent: { questionNumber: number, totalQuestions: number, questionText: string, options: Array<{text: string}> }
- QuizResultComponent: { typeName: string, typeCode: string, emoji: string, title: string, description: string, accentColor: string }

## Output Format
Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "ROOT": {
    "type": { "resolvedName": "Canvas" },
    "isCanvas": true,
    "props": {},
    "displayName": "Canvas",
    "custom": {},
    "hidden": false,
    "nodes": ["node_0", "node_1", ...],
    "linkedNodes": {}
  },
  "node_0": {
    "type": { "resolvedName": "ComponentName" },
    "isCanvas": false,
    "props": { ... },
    "displayName": "ComponentName",
    "custom": {},
    "hidden": false,
    "nodes": [],
    "linkedNodes": {},
    "parent": "ROOT"
  },
  ...
}

## Guidelines
- Use Toss design style: clean, minimal, lots of whitespace
- Primary color: #3182F6 (Toss blue)
- Use SpacerComponent between sections (height: 8-24)
- Always start with NavigationComponent
- End with TabBarComponent for multi-section apps
- Use Korean text for all labels and content
- Make it look professional and polished
- Use realistic Korean content (names, prices, descriptions)
- Use placehold.co for images: https://placehold.co/600x300/COLOR/FFFFFF?text=TEXT
`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "OPENAI_API_KEY not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages, currentJson } = await req.json();

  const openai = new OpenAI({ apiKey });

  let systemContent = SYSTEM_PROMPT;
  if (currentJson) {
    systemContent += `\n\nCurrent editor state (use this as base for modifications):\n${currentJson}`;
  }

  const stream = await openai.chat.completions.create({
    model: "gpt-5.2-chat-latest",
    max_tokens: 8192,
    stream: true,
    messages: [
      { role: "system", content: systemContent },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content;
          if (text) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: String(err) })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
