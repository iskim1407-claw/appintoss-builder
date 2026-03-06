"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useEditor } from "@craftjs/core";
import { Sparkles, Send, X, ChevronRight, Loader2, Trash2, Bot, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  json?: string; // extracted JSON from assistant response
  timestamp: number;
}

export function AIChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamText, setStreamText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { actions, query } = useEditor();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamText, scrollToBottom]);

  const getCurrentJson = useCallback(() => {
    try {
      return query.serialize();
    } catch {
      return undefined;
    }
  }, [query]);

  const applyJson = useCallback(
    (jsonStr: string) => {
      try {
        const parsed = JSON.parse(jsonStr);
        if (!parsed.ROOT) return false;
        actions.deserialize(jsonStr);
        return true;
      } catch (e) {
        console.error("Failed to apply AI JSON:", e);
        return false;
      }
    },
    [actions]
  );

  const extractJson = (text: string): string | null => {
    // Try to extract JSON from the response
    // First try: the whole text is JSON
    try {
      const parsed = JSON.parse(text);
      if (parsed.ROOT) return text;
    } catch {}

    // Second try: JSON in code block
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      try {
        const parsed = JSON.parse(codeBlockMatch[1].trim());
        if (parsed.ROOT) return codeBlockMatch[1].trim();
      } catch {}
    }

    // Third try: find JSON object with ROOT
    const jsonMatch = text.match(/\{[\s\S]*"ROOT"[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.ROOT) return jsonMatch[0];
      } catch {}
    }

    return null;
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setStreamText("");

    try {
      const apiMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.role === "assistant" && m.json ? m.json : m.content,
      }));

      const currentJson = getCurrentJson();

      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          currentJson: currentJson !== "{}" ? currentJson : undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "API 요청 실패");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullText += parsed.text;
                setStreamText(fullText);
              }
              if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (e) {
              if (data !== "[DONE]") console.warn("Parse error:", e);
            }
          }
        }
      }

      // Extract and apply JSON
      const json = extractJson(fullText);
      if (json) {
        const success = applyJson(json);
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: success
            ? "✅ 앱이 생성되었습니다! 에디터에서 확인해보세요."
            : "⚠️ JSON을 생성했지만 적용에 실패했습니다.",
          json: json,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: fullText,
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `❌ 오류: ${err instanceof Error ? err.message : "알 수 없는 오류"}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setStreamText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
    setStreamText("");
  };

  // Floating toggle button
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 w-14 h-14 bg-gradient-to-br from-[#3182F6] to-[#6366F1] text-white rounded-full shadow-lg shadow-blue-300/40 hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
        title="AI 바이브코딩"
      >
        <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 md:bottom-4 md:right-4 z-50 w-full md:w-[400px] h-[85vh] md:h-[600px] md:max-h-[80vh] bg-white md:rounded-2xl shadow-2xl shadow-black/20 border border-gray-200/60 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-[#3182F6] to-[#6366F1]">
        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
          <Sparkles size={16} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-white">AI 바이브코딩</h3>
          <p className="text-[11px] text-white/70">자연어로 앱을 만들어보세요</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="대화 초기화"
          >
            <Trash2 size={16} />
          </button>
        )}
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles size={28} className="text-[#3182F6]" />
            </div>
            <h4 className="text-base font-bold text-gray-900 mb-2">
              어떤 앱을 만들어볼까요?
            </h4>
            <p className="text-sm text-gray-500 mb-6">
              원하는 앱을 자연어로 설명해주세요.
              <br />
              AI가 자동으로 만들어드립니다.
            </p>
            <div className="space-y-2 w-full">
              {[
                "카페 포인트 적립 앱 만들어줘",
                "할일 관리 투두리스트 앱",
                "MBTI 성격 테스트 앱",
                "중고거래 상품 목록 앱",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion);
                    inputRef.current?.focus();
                  }}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 rounded-xl text-sm text-gray-700 hover:text-[#3182F6] transition-colors flex items-center gap-2 group"
                >
                  <ChevronRight
                    size={14}
                    className="text-gray-300 group-hover:text-[#3182F6] transition-colors"
                  />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3182F6] to-[#6366F1] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={14} className="text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#3182F6] text-white rounded-br-md"
                  : "bg-gray-100 text-gray-800 rounded-bl-md"
              }`}
            >
              {msg.content}
              {msg.json && (
                <button
                  onClick={() => applyJson(msg.json!)}
                  className="mt-2 w-full text-xs bg-white/20 hover:bg-white/30 rounded-lg py-1.5 transition-colors font-medium"
                >
                  🔄 다시 적용하기
                </button>
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User size={14} className="text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3182F6] to-[#6366F1] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-3.5 py-2.5 max-w-[80%]">
              {streamText ? (
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2 mb-1">
                    <Loader2 size={12} className="animate-spin text-[#3182F6]" />
                    <span className="text-xs font-medium text-[#3182F6]">생성 중...</span>
                  </div>
                  <div className="text-xs text-gray-400 font-mono max-h-20 overflow-hidden">
                    {streamText.slice(-200)}...
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#3182F6] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-[#3182F6] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-[#3182F6] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-xs text-gray-400">AI가 앱을 디자인하고 있어요...</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 px-3 py-3 bg-white">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="만들고 싶은 앱을 설명해주세요..."
            className="flex-1 resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#3182F6] focus:ring-1 focus:ring-[#3182F6]/20 max-h-24 min-h-[42px] transition-colors"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 bg-[#3182F6] text-white rounded-xl flex items-center justify-center hover:bg-[#1B64DA] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5 text-center">
          Shift+Enter로 줄바꿈 · Enter로 전송
        </p>
      </div>
    </div>
  );
}
