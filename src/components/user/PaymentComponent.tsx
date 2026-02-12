"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";

interface PaymentProps {
  title?: string;
  recipientLabel?: string;
  recipientPlaceholder?: string;
  amountLabel?: string;
  buttonText?: string;
  buttonColor?: string;
  showQuickAmounts?: boolean;
  quickAmounts?: number[];
  maxAmount?: number;
  showFee?: boolean;
  feeAmount?: number;
  borderRadius?: number;
}

export const PaymentComponent = ({
  title = "송금하기",
  recipientLabel = "받는 분",
  recipientPlaceholder = "이름 또는 계좌번호",
  amountLabel = "금액",
  buttonText = "송금하기",
  buttonColor = "#3182F6",
  showQuickAmounts = true,
  quickAmounts = [10000, 50000, 100000, 500000],
  maxAmount = 50000000,
  showFee = false,
  feeAmount = 0,
  borderRadius = 16,
}: PaymentProps) => {
  void maxAmount; // Used in export
  
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((s) => ({ selected: s.events.selected }));

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`px-3 py-2 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      <div
        className="bg-white p-5"
        style={{ borderRadius }}
      >
        {/* 제목 */}
        <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
        
        {/* 받는 분 입력 */}
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">{recipientLabel}</label>
          <input
            type="text"
            placeholder={recipientPlaceholder}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3182F6]"
            readOnly
          />
        </div>
        
        {/* 금액 입력 */}
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">{amountLabel}</label>
          <div className="relative">
            <input
              type="text"
              placeholder="0"
              className="w-full p-4 text-right text-2xl font-bold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3182F6]"
              readOnly
              defaultValue="100,000"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-gray-500">원</span>
          </div>
        </div>
        
        {/* 빠른 금액 선택 */}
        {showQuickAmounts && (
          <div className="flex gap-2 mb-4">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                className="flex-1 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200 transition"
              >
                +{(amount / 10000).toFixed(0)}만
              </button>
            ))}
          </div>
        )}
        
        {/* 수수료 안내 */}
        {showFee && feeAmount > 0 && (
          <p className="text-sm text-gray-400 mb-4">
            수수료: {feeAmount.toLocaleString()}원
          </p>
        )}
        
        {/* 송금 버튼 */}
        <button
          className="w-full py-4 rounded-xl text-white font-bold text-base transition active:scale-[0.98]"
          style={{ backgroundColor: buttonColor }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

const PaymentSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));
  
  return (
    <SettingsPanel title="결제/송금">
      <label className="block text-xs text-gray-500 mb-1">제목</label>
      <input 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.title || ""} 
        onChange={(e) => setProp((p: PaymentProps) => (p.title = e.target.value))} 
      />

      <label className="block text-xs text-gray-500 mb-1">받는 분 라벨</label>
      <input 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.recipientLabel || ""} 
        onChange={(e) => setProp((p: PaymentProps) => (p.recipientLabel = e.target.value))} 
      />

      <label className="block text-xs text-gray-500 mb-1">버튼 텍스트</label>
      <input 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.buttonText || ""} 
        onChange={(e) => setProp((p: PaymentProps) => (p.buttonText = e.target.value))} 
      />

      <label className="block text-xs text-gray-500 mb-1">버튼 색상</label>
      <input 
        type="color" 
        value={props.buttonColor || "#3182F6"} 
        onChange={(e) => setProp((p: PaymentProps) => (p.buttonColor = e.target.value))} 
        className="w-full h-8 mb-3" 
      />

      <label className="block text-xs text-gray-500 mb-1">모서리 둥글기</label>
      <input 
        type="range" 
        min={0} 
        max={24} 
        value={props.borderRadius || 16}
        onChange={(e) => setProp((p: PaymentProps) => (p.borderRadius = Number(e.target.value)))}
        className="w-full mb-1"
      />
      <span className="text-xs text-gray-400">{props.borderRadius || 16}px</span>

      <label className="flex items-center gap-2 text-sm mt-3 mb-2">
        <input 
          type="checkbox" 
          checked={props.showQuickAmounts ?? true} 
          onChange={(e) => setProp((p: PaymentProps) => (p.showQuickAmounts = e.target.checked))} 
        />
        빠른 금액 버튼 표시
      </label>

      <label className="flex items-center gap-2 text-sm mb-3">
        <input 
          type="checkbox" 
          checked={props.showFee ?? false} 
          onChange={(e) => setProp((p: PaymentProps) => (p.showFee = e.target.checked))} 
        />
        수수료 표시
      </label>

      {props.showFee && (
        <>
          <label className="block text-xs text-gray-500 mb-1">수수료 (원)</label>
          <input 
            type="number"
            className="w-full border rounded-lg p-2 text-sm mb-3" 
            value={props.feeAmount || 0} 
            onChange={(e) => setProp((p: PaymentProps) => (p.feeAmount = Number(e.target.value)))} 
          />
        </>
      )}

      <label className="block text-xs text-gray-500 mb-1">최대 금액</label>
      <input 
        type="number"
        className="w-full border rounded-lg p-2 text-sm" 
        value={props.maxAmount || 50000000} 
        onChange={(e) => setProp((p: PaymentProps) => (p.maxAmount = Number(e.target.value)))} 
      />
    </SettingsPanel>
  );
};

PaymentComponent.craft = {
  props: {
    title: "송금하기",
    recipientLabel: "받는 분",
    recipientPlaceholder: "이름 또는 계좌번호",
    amountLabel: "금액",
    buttonText: "송금하기",
    buttonColor: "#3182F6",
    showQuickAmounts: true,
    quickAmounts: [10000, 50000, 100000, 500000],
    maxAmount: 50000000,
    showFee: false,
    feeAmount: 0,
    borderRadius: 16,
  },
  related: { settings: PaymentSettings },
  displayName: "결제/송금",
};
