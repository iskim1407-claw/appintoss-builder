"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { PartyPopper, ArrowRight } from "lucide-react";
import { setPlanState, PlanType } from "@/lib/plan";

function SuccessContent() {
  const searchParams = useSearchParams();
  const plan = (searchParams.get("plan") as PlanType) || "starter";

  useEffect(() => {
    setPlanState({
      plan,
      activatedAt: new Date().toISOString(),
      orderId: searchParams.get("order_id") || `local-${Date.now()}`,
    });
  }, [plan, searchParams]);

  const planLabel = plan === "pro" ? "프로" : "스타터";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-5">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <PartyPopper size={40} className="text-green-500" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-3">
          {planLabel} 플랜 활성화 완료! 🎉
        </h1>
        <p className="text-gray-500 mb-8">
          결제가 완료되었습니다. 이제 {planLabel} 플랜의 모든 기능을 사용할 수 있어요.
        </p>
        <Link
          href="/editor"
          className="group inline-flex items-center gap-2 bg-[#3182F6] text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-[#1B64DA] transition-all shadow-lg active:scale-[0.98]"
        >
          에디터로 이동
          <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <p className="mt-6 text-sm text-gray-400">
          문제가 있으시면 support@appintoss.com으로 문의해주세요.
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400">로딩 중...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
