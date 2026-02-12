"use client";

import { useNode } from "@craftjs/core";
import React, { useState } from "react";
import { SettingsPanel } from "./shared";

interface Bank {
  code: string;
  name: string;
  color: string;
}

interface AccountProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonColor?: string;
  showBankLogos?: boolean;
  banks?: Bank[];
  borderRadius?: number;
}

const DEFAULT_BANKS: Bank[] = [
  { code: "092", name: "토스뱅크", color: "#3182F6" },
  { code: "088", name: "신한", color: "#0046FF" },
  { code: "004", name: "국민", color: "#FFBC00" },
  { code: "020", name: "우리", color: "#0066B3" },
  { code: "003", name: "기업", color: "#004EA2" },
  { code: "011", name: "농협", color: "#00AB4E" },
  { code: "090", name: "카카오", color: "#FFE600" },
  { code: "089", name: "케이뱅크", color: "#FFB800" },
];

export const AccountComponent = ({
  title = "계좌 연결",
  description = "간편하게 계좌를 연결하세요",
  buttonText = "연결하기",
  buttonColor = "#3182F6",
  showBankLogos = true,
  banks = DEFAULT_BANKS,
  borderRadius = 16,
}: AccountProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((s) => ({ selected: s.events.selected }));
  
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`px-3 py-2 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      <div
        className="bg-white overflow-hidden"
        style={{ borderRadius }}
      >
        {/* 헤더 */}
        <div 
          className="p-4 text-white"
          style={{ background: `linear-gradient(135deg, ${buttonColor}, ${buttonColor}dd)` }}
        >
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm opacity-80 mt-1">{description}</p>
        </div>

        <div className="p-4">
          {/* 은행 선택 그리드 */}
          {showBankLogos && (
            <div className="grid grid-cols-4 gap-3 mb-4">
              {banks.slice(0, 8).map((bank) => (
                <button
                  key={bank.code}
                  onClick={() => setSelectedBank(bank.code)}
                  className={`flex flex-col items-center p-3 rounded-xl transition ${
                    selectedBank === bank.code 
                      ? "bg-blue-50 ring-2 ring-[#3182F6]" 
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold mb-1"
                    style={{ backgroundColor: bank.color }}
                  >
                    {bank.name.charAt(0)}
                  </div>
                  <span className="text-xs text-gray-600">{bank.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* 계좌번호 입력 */}
          <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-2">계좌번호</label>
            <input
              type="text"
              placeholder="계좌번호를 입력하세요"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3182F6]"
              readOnly
            />
          </div>

          {/* 연결 버튼 */}
          <button
            className="w-full py-4 rounded-xl text-white font-bold text-base transition active:scale-[0.98]"
            style={{ backgroundColor: buttonColor }}
          >
            {buttonText}
          </button>

          {/* 안내 문구 */}
          <p className="text-xs text-gray-400 text-center mt-3">
            계좌 연결 시 본인인증이 필요합니다
          </p>
        </div>
      </div>
    </div>
  );
};

const AccountSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));
  
  return (
    <SettingsPanel title="계좌 연결">
      <label className="block text-xs text-gray-500 mb-1">제목</label>
      <input 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.title || ""} 
        onChange={(e) => setProp((p: AccountProps) => (p.title = e.target.value))} 
      />

      <label className="block text-xs text-gray-500 mb-1">설명</label>
      <input 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.description || ""} 
        onChange={(e) => setProp((p: AccountProps) => (p.description = e.target.value))} 
      />

      <label className="block text-xs text-gray-500 mb-1">버튼 텍스트</label>
      <input 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.buttonText || ""} 
        onChange={(e) => setProp((p: AccountProps) => (p.buttonText = e.target.value))} 
      />

      <label className="block text-xs text-gray-500 mb-1">메인 색상</label>
      <input 
        type="color" 
        value={props.buttonColor || "#3182F6"} 
        onChange={(e) => setProp((p: AccountProps) => (p.buttonColor = e.target.value))} 
        className="w-full h-8 mb-3" 
      />

      <label className="block text-xs text-gray-500 mb-1">모서리 둥글기</label>
      <input 
        type="range" 
        min={0} 
        max={24} 
        value={props.borderRadius || 16}
        onChange={(e) => setProp((p: AccountProps) => (p.borderRadius = Number(e.target.value)))}
        className="w-full mb-1"
      />
      <span className="text-xs text-gray-400">{props.borderRadius || 16}px</span>

      <label className="flex items-center gap-2 text-sm mt-3">
        <input 
          type="checkbox" 
          checked={props.showBankLogos ?? true} 
          onChange={(e) => setProp((p: AccountProps) => (p.showBankLogos = e.target.checked))} 
        />
        은행 로고 표시
      </label>
    </SettingsPanel>
  );
};

AccountComponent.craft = {
  props: {
    title: "계좌 연결",
    description: "간편하게 계좌를 연결하세요",
    buttonText: "연결하기",
    buttonColor: "#3182F6",
    showBankLogos: true,
    banks: DEFAULT_BANKS,
    borderRadius: 16,
  },
  related: { settings: AccountSettings },
  displayName: "계좌 연결",
};
