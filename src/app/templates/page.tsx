"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { templates } from "@/lib/templates";
import {
  Lock, FileCode, ArrowRight, ShoppingBag, CalendarDays, Briefcase,
  PartyPopper, ClipboardList, UtensilsCrossed, Dumbbell, Ticket,
  Target, UserCheck, DollarSign, Thermometer, Heart, BookOpen,
  Swords, Trophy, Sparkles, Flame,
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TEMPLATE_ICONS: Record<string, any> = {
  shopping: ShoppingBag,
  booking: CalendarDays,
  portfolio: Briefcase,
  event: PartyPopper,
  survey: ClipboardList,
  restaurant: UtensilsCrossed,
  fitness: Dumbbell,
  coupon: Ticket,
  "meeting-bingo": Target,
  "worker-type-test": UserCheck,
  "salary-timer": DollarSign,
  "burnout-check": Thermometer,
  "mbti-personality-test": Heart,
  "daily-quiz": BookOpen,
  "vote-battle": Swords,
  "ranking-list": Trophy,
  "fortune-tarot": Sparkles,
};

const POPULAR_IDS = new Set(["shopping", "event", "mbti-personality-test", "salary-timer", "daily-quiz"]);

const CATEGORIES = ["전체", "커머스", "서비스", "마케팅", "퀴즈", "소셜"];

function getCategoryGroup(category: string): string {
  const map: Record<string, string> = {
    "커머스": "커머스",
    "서비스": "서비스",
    "마케팅": "마케팅",
    "퀴즈/테스트": "퀴즈",
    "퀴즈": "퀴즈",
    "소셜": "소셜",
    "소셜/커뮤니티": "소셜",
  };
  return map[category] || category;
}

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const handleUseTemplate = (templateName: string, data: string) => {
    track("template_loaded", { template: templateName });
    sessionStorage.setItem("appintoss-template", data);
    router.push("/editor");
  };

  const filtered = selectedCategory === "전체"
    ? templates
    : templates.filter((t) => getCategoryGroup(t.category) === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100/60">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <Link href="/" className="text-lg md:text-xl font-bold bg-gradient-to-r from-[#3182F6] to-[#6C5CE7] bg-clip-text text-transparent">앱인토스 빌더</Link>
          <div className="flex gap-3 md:gap-4 items-center">
            <Link href="/security" className="hidden md:inline-flex text-sm text-gray-500 hover:text-gray-900 transition-smooth font-medium items-center gap-1">
              <Lock size={13} /> 보안점검
            </Link>
            <Link href="/documents" className="hidden md:inline-flex text-sm text-gray-500 hover:text-gray-900 transition-smooth font-medium items-center gap-1">
              <FileCode size={13} /> 문서
            </Link>
            <Link href="/editor" className="text-sm bg-[#3182F6] text-white px-4 py-2.5 min-h-[44px] flex items-center rounded-xl hover:bg-[#1B64DA] transition-smooth shadow-sm shadow-blue-200/40 active:scale-[0.98]">
              에디터 열기
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-3">템플릿 갤러리</h1>
          <p className="text-sm md:text-base text-gray-500">원하는 템플릿을 선택하면 바로 에디터에서 편집할 수 있습니다.</p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-sm rounded-full font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-[#3182F6] text-white shadow-sm shadow-blue-200/50"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filtered.map((t) => {
            const IconComp = TEMPLATE_ICONS[t.id] || Flame;
            const isPopular = POPULAR_IDS.has(t.id);
            return (
              <div key={t.id} className="bg-white rounded-2xl border border-gray-100/60 overflow-hidden group hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 relative">
                {isPopular && (
                  <div className="absolute top-3 right-3 z-10 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    인기
                  </div>
                )}
                <div className="h-40 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center overflow-hidden relative">
                  <IconComp size={48} className="text-[#3182F6]/60 group-hover:scale-125 group-hover:text-[#3182F6] transition-all duration-300" />
                  {/* Hover overlay preview hint */}
                  <div className="absolute inset-0 bg-[#3182F6]/0 group-hover:bg-[#3182F6]/5 transition-all duration-300 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
                    <span className="text-xs text-[#3182F6] font-medium bg-white/90 px-3 py-1 rounded-full shadow-sm">
                      미리보기
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t.category}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{t.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{t.description}</p>
                  <button
                    onClick={() => handleUseTemplate(t.name, t.data)}
                    className="w-full bg-[#3182F6] text-white py-3 min-h-[48px] rounded-xl text-sm font-semibold hover:bg-[#1B64DA] transition-smooth active:scale-[0.98] shadow-sm shadow-blue-200/40"
                  >
                    이 템플릿 사용하기
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-gray-400 py-16">
            <p className="text-lg font-medium mb-2">해당 카테고리에 템플릿이 없습니다</p>
            <p className="text-sm">다른 카테고리를 선택해보세요</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/editor" className="group text-[#3182F6] font-medium hover:underline inline-flex items-center gap-1">
            또는 빈 캔버스에서 시작하기
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
