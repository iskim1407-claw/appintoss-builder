"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";

interface InputProps {
  label?: string;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "number" | "password" | "url";
  required?: boolean;
  name?: string;
  helpText?: string;
}

export const InputComponent = ({
  label = "라벨",
  placeholder = "입력하세요",
  type = "text",
  required = false,
  name = "",
  helpText = "",
}: InputProps) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));

  return (
    <div 
      ref={(ref) => { if (ref) connect(drag(ref)); }} 
      className={`px-3 py-2 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        required={required}
        className="w-full border border-gray-200 bg-gray-50 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#3182F6] focus:bg-white transition"
        readOnly
      />
      {helpText && (
        <p className="mt-1.5 text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

const InputSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));
  
  return (
    <SettingsPanel title="입력 필드">
      <label className="block text-xs text-gray-500 mb-1">라벨</label>
      <input 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.label || ""} 
        onChange={(e) => setProp((p: InputProps) => (p.label = e.target.value))} 
      />

      <label className="block text-xs text-gray-500 mb-1">플레이스홀더</label>
      <input 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.placeholder || ""} 
        onChange={(e) => setProp((p: InputProps) => (p.placeholder = e.target.value))} 
      />

      <label className="block text-xs text-gray-500 mb-1">필드 이름 (name)</label>
      <input 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.name || ""} 
        onChange={(e) => setProp((p: InputProps) => (p.name = e.target.value))} 
        placeholder="email, phone 등"
      />

      <label className="block text-xs text-gray-500 mb-1">입력 타입</label>
      <select 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.type || "text"} 
        onChange={(e) => setProp((p: InputProps) => (p.type = e.target.value as InputProps["type"]))}
      >
        <option value="text">텍스트</option>
        <option value="email">이메일</option>
        <option value="tel">전화번호</option>
        <option value="number">숫자</option>
        <option value="password">비밀번호</option>
        <option value="url">URL</option>
      </select>

      <label className="block text-xs text-gray-500 mb-1">도움말</label>
      <input 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.helpText || ""} 
        onChange={(e) => setProp((p: InputProps) => (p.helpText = e.target.value))} 
        placeholder="입력 안내 메시지"
      />

      <label className="flex items-center gap-2 text-sm">
        <input 
          type="checkbox" 
          checked={props.required ?? false} 
          onChange={(e) => setProp((p: InputProps) => (p.required = e.target.checked))} 
        />
        필수 입력
      </label>
    </SettingsPanel>
  );
};

InputComponent.craft = {
  props: { label: "라벨", placeholder: "입력하세요", type: "text", required: false, name: "", helpText: "" },
  related: { settings: InputSettings },
  displayName: "입력 필드",
};
