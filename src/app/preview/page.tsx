"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Editor, Frame } from "@craftjs/core";
import { decompressFromEncodedURIComponent } from "lz-string";
import Link from "next/link";
import { Rocket } from "lucide-react";

// User components — same resolver as editor
import { TextComponent } from "@/components/user/TextComponent";
import { ButtonComponent } from "@/components/user/ButtonComponent";
import { ImageComponent } from "@/components/user/ImageComponent";
import { CardComponent } from "@/components/user/CardComponent";
import { ListComponent } from "@/components/user/ListComponent";
import { DividerComponent } from "@/components/user/DividerComponent";
import { HeaderComponent } from "@/components/user/HeaderComponent";
import { InputComponent } from "@/components/user/InputComponent";
import { BottomSheetComponent } from "@/components/user/BottomSheetComponent";
import { TabBarComponent } from "@/components/user/TabBarComponent";
import { BadgeComponent } from "@/components/user/BadgeComponent";
import { CarouselComponent } from "@/components/user/CarouselComponent";
import { GridComponent } from "@/components/user/GridComponent";
import { ProgressBarComponent } from "@/components/user/ProgressBarComponent";
import { SpacerComponent } from "@/components/user/SpacerComponent";
import { Canvas } from "@/components/user/Container";
import { NavigationComponent } from "@/components/user/NavigationComponent";
import { ListRowComponent } from "@/components/user/ListRowComponent";
import { TabComponent } from "@/components/user/TabComponent";
import { TextFieldComponent } from "@/components/user/TextFieldComponent";
import { SwitchComponent } from "@/components/user/SwitchComponent";
import { CheckboxComponent } from "@/components/user/CheckboxComponent";
import { ToastComponent } from "@/components/user/ToastComponent";
import { SkeletonComponent } from "@/components/user/SkeletonComponent";
import { DialogComponent } from "@/components/user/DialogComponent";
import { BottomCTAComponent } from "@/components/user/BottomCTAComponent";
import { PaymentComponent } from "@/components/user/PaymentComponent";
import { AccountComponent } from "@/components/user/AccountComponent";
import { CreditScoreComponent } from "@/components/user/CreditScoreComponent";
import { ProductCompareComponent } from "@/components/user/ProductCompareComponent";
import { TransactionListComponent } from "@/components/user/TransactionListComponent";
import { QuizIntroComponent } from "@/components/user/QuizIntroComponent";
import { QuizQuestionComponent } from "@/components/user/QuizQuestionComponent";
import { QuizResultComponent } from "@/components/user/QuizResultComponent";

const resolver = {
  NavigationComponent, ButtonComponent, TextComponent, BadgeComponent,
  ListRowComponent, TabComponent, TabBarComponent,
  TextFieldComponent, SwitchComponent, CheckboxComponent,
  ProgressBarComponent, ToastComponent, SkeletonComponent, DialogComponent,
  BottomCTAComponent, BottomSheetComponent,
  HeaderComponent, ImageComponent, CardComponent, ListComponent,
  DividerComponent, SpacerComponent, CarouselComponent, InputComponent, GridComponent,
  Canvas,
  PaymentComponent, AccountComponent, CreditScoreComponent,
  ProductCompareComponent, TransactionListComponent,
  QuizIntroComponent, QuizQuestionComponent, QuizResultComponent,
};

function PreviewContent() {
  const searchParams = useSearchParams();
  const [json, setJson] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let d = searchParams.get("d");
    if (!d) { setError(true); return; }
    try {
      // Restore '+' that may have been decoded as spaces
      d = d.replace(/ /g, '+');
      const decompressed = decompressFromEncodedURIComponent(d);
      if (!decompressed) { setError(true); return; }
      setJson(decompressed);
    } catch {
      setError(true);
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">😵</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">잘못된 링크입니다</h1>
          <p className="text-gray-500 text-sm mb-6">공유 링크가 손상되었거나 유효하지 않습니다.</p>
          <Link href="/editor" className="inline-flex items-center gap-2 px-6 py-3 bg-[#3182F6] text-white rounded-2xl font-semibold hover:bg-[#1B64DA] transition-all">
            <Rocket size={16} />
            직접 만들어보기
          </Link>
        </div>
      </div>
    );
  }

  if (!json) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#3182F6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50/30 to-purple-50/20 flex flex-col items-center justify-center p-4 md:p-8">
      {/* Phone Frame */}
      <div className="w-full max-w-[393px]">
        <div className="bg-gray-800 rounded-t-[2.5rem] pt-2 px-2">
          <div className="rounded-t-[2rem] overflow-hidden bg-white">
            {/* Status bar */}
            <div className="h-11 flex items-center justify-between px-6 text-xs">
              <span className="font-semibold">9:41</span>
              <div className="flex gap-1.5 items-center text-[10px]">
                <div className="flex gap-px items-end h-2.5">
                  {[3,5,7,9].map(h => <div key={h} className="w-[2px] rounded-full bg-gray-600" style={{height: h}} />)}
                </div>
                <div className="w-5 h-2.5 rounded-sm border border-gray-500">
                  <div className="h-full w-[70%] rounded-sm bg-gray-600" />
                </div>
              </div>
            </div>
            {/* Nav bar */}
            <div className="h-11 flex items-center px-4 border-b border-gray-100">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              <span className="flex-1 text-center text-sm font-medium">미니앱</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 px-2">
          <div className="bg-white min-h-[500px] overflow-y-auto max-h-[70vh]">
            <Editor resolver={resolver} enabled={false}>
              <DeserializeAndRender json={json} />
            </Editor>
          </div>
        </div>
        <div className="bg-gray-800 rounded-b-[2.5rem] pb-2 px-2">
          <div className="rounded-b-[2rem] h-8 flex items-center justify-center bg-white">
            <div className="w-32 h-1 rounded-full bg-gray-300" />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <Link
          href="/editor"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#3182F6] to-[#6C5CE7] text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-blue-300/30 active:scale-[0.97] transition-all"
        >
          <Rocket size={20} />
          나도 만들어보기 →
        </Link>
        <p className="mt-4 text-gray-400 text-xs">Powered by 미니앱 빌더</p>
      </div>
    </div>
  );
}

function DeserializeAndRender({ json }: { json: string }) {
  // Pass json as the `data` prop to Frame for proper Craft.js deserialization
  return <Frame data={json} />;
}

export default function PreviewPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#3182F6] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PreviewContent />
    </React.Suspense>
  );
}
