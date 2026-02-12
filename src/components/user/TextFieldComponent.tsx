"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";
import { TDS_COLORS, TDS_RADIUS } from "@/lib/tds/tokens";

// TDS TextField Props
export interface TDSTextFieldProps {
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  value?: string;
  type?: "text" | "email" | "password" | "number" | "tel";
  disabled?: boolean;
  error?: boolean;
  maxLength?: number;
  showCount?: boolean;
}

export const TextFieldComponent = ({
  label = "",
  placeholder = "입력하세요",
  helperText = "",
  errorText = "",
  value = "",
  type = "text",
  disabled = false,
  error = false,
  maxLength = 0,
  showCount = false,
}: TDSTextFieldProps) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));

  const hasError = error && errorText;
  const borderColor = hasError ? TDS_COLORS.danger : TDS_COLORS.gray200;

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`px-4 py-2 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      {label && (
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: TDS_COLORS.gray700 }}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          maxLength={maxLength || undefined}
          readOnly
          className={`
            w-full px-4 py-3 text-sm transition-colors
            ${disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white"}
            focus:outline-none focus:ring-2 focus:ring-blue-500
          `}
          style={{
            borderRadius: TDS_RADIUS.md,
            border: `1px solid ${borderColor}`,
            color: disabled ? TDS_COLORS.gray400 : TDS_COLORS.dark,
          }}
        />

        {showCount && maxLength > 0 && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
            style={{ color: TDS_COLORS.gray400 }}
          >
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      {(helperText || hasError) && (
        <p
          className="mt-1.5 text-xs"
          style={{ color: hasError ? TDS_COLORS.danger : TDS_COLORS.gray500 }}
        >
          {hasError ? errorText : helperText}
        </p>
      )}
    </div>
  );
};

const TextFieldSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));

  return (
    <SettingsPanel title="입력 필드">
      <label className="block text-xs text-gray-500 mb-1">라벨</label>
      <input
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.label || ""}
        placeholder="라벨 (선택)"
        onChange={(e) => setProp((p: TDSTextFieldProps) => (p.label = e.target.value))}
      />

      <label className="block text-xs text-gray-500 mb-1">플레이스홀더</label>
      <input
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.placeholder || ""}
        onChange={(e) => setProp((p: TDSTextFieldProps) => (p.placeholder = e.target.value))}
      />

      <label className="block text-xs text-gray-500 mb-1">기본값</label>
      <input
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.value || ""}
        onChange={(e) => setProp((p: TDSTextFieldProps) => (p.value = e.target.value))}
      />

      <label className="block text-xs text-gray-500 mb-1">입력 타입</label>
      <select
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.type || "text"}
        onChange={(e) => setProp((p: TDSTextFieldProps) => (p.type = e.target.value as TDSTextFieldProps["type"]))}
      >
        <option value="text">텍스트</option>
        <option value="email">이메일</option>
        <option value="password">비밀번호</option>
        <option value="number">숫자</option>
        <option value="tel">전화번호</option>
      </select>

      <label className="block text-xs text-gray-500 mb-1">도움말</label>
      <input
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.helperText || ""}
        placeholder="도움말 텍스트 (선택)"
        onChange={(e) => setProp((p: TDSTextFieldProps) => (p.helperText = e.target.value))}
      />

      <label className="block text-xs text-gray-500 mb-1">최대 글자수</label>
      <input
        type="number"
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.maxLength || 0}
        placeholder="0 = 제한 없음"
        onChange={(e) => setProp((p: TDSTextFieldProps) => (p.maxLength = Number(e.target.value)))}
      />

      <div className="space-y-2 mb-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={props.showCount ?? false}
            onChange={(e) => setProp((p: TDSTextFieldProps) => (p.showCount = e.target.checked))}
          />
          글자수 표시
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={props.disabled ?? false}
            onChange={(e) => setProp((p: TDSTextFieldProps) => (p.disabled = e.target.checked))}
          />
          비활성화
        </label>
      </div>

      <div className="border-t pt-3">
        <label className="flex items-center gap-2 text-sm mb-2">
          <input
            type="checkbox"
            checked={props.error ?? false}
            onChange={(e) => setProp((p: TDSTextFieldProps) => (p.error = e.target.checked))}
          />
          에러 상태
        </label>
        {props.error && (
          <input
            className="w-full border rounded-lg p-2 text-sm"
            value={props.errorText || ""}
            placeholder="에러 메시지"
            onChange={(e) => setProp((p: TDSTextFieldProps) => (p.errorText = e.target.value))}
          />
        )}
      </div>
    </SettingsPanel>
  );
};

TextFieldComponent.craft = {
  props: {
    label: "",
    placeholder: "입력하세요",
    helperText: "",
    errorText: "",
    value: "",
    type: "text",
    disabled: false,
    error: false,
    maxLength: 0,
    showCount: false,
  },
  related: { settings: TextFieldSettings },
  displayName: "입력 필드",
};
