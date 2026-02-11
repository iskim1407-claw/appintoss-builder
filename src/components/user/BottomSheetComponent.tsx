"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";

interface BottomSheetProps {
  sheetId?: string;
  title?: string;
  content?: string;
  triggerText?: string;
}

export const BottomSheetComponent = ({
  sheetId: _sheetId = "sheet_1",
  title = "바텀시트 제목",
  content = "여기에 내용이 표시됩니다.",
  triggerText = "바텀시트 열기",
}: BottomSheetProps) => {
  void _sheetId; // Used in export, not in editor preview
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div 
      ref={(ref) => { if (ref) connect(drag(ref)); }} 
      className={`px-3 py-2 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-3 px-5 bg-gray-100 rounded-xl font-semibold text-gray-700 hover:bg-gray-200 transition"
      >
        {triggerText}
      </button>

      {/* Preview of Bottom Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ maxWidth: "375px", margin: "0 auto" }}>
          <div 
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full bg-white rounded-t-[20px] p-5 pb-8 animate-slide-up">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            {title && <h3 className="font-bold text-lg mb-3">{title}</h3>}
            <p className="text-gray-600 text-sm">{content}</p>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-4 py-3 bg-[#3182F6] text-white rounded-xl font-semibold"
            >
              확인
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

const BottomSheetSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));
  
  return (
    <SettingsPanel title="바텀시트">
      <label className="block text-xs text-gray-500 mb-1">시트 ID</label>
      <input 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.sheetId || ""} 
        onChange={(e) => setProp((p: BottomSheetProps) => (p.sheetId = e.target.value))} 
        placeholder="sheet_1"
      />
      
      <label className="block text-xs text-gray-500 mb-1">버튼 텍스트</label>
      <input 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.triggerText || ""} 
        onChange={(e) => setProp((p: BottomSheetProps) => (p.triggerText = e.target.value))} 
      />

      <label className="block text-xs text-gray-500 mb-1">제목</label>
      <input 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.title || ""} 
        onChange={(e) => setProp((p: BottomSheetProps) => (p.title = e.target.value))} 
      />

      <label className="block text-xs text-gray-500 mb-1">내용</label>
      <textarea 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        rows={3}
        value={props.content || ""} 
        onChange={(e) => setProp((p: BottomSheetProps) => (p.content = e.target.value))} 
      />
    </SettingsPanel>
  );
};

BottomSheetComponent.craft = {
  props: { sheetId: "sheet_1", title: "바텀시트 제목", content: "여기에 내용이 표시됩니다.", triggerText: "바텀시트 열기" },
  related: { settings: BottomSheetSettings },
  displayName: "바텀시트",
};
