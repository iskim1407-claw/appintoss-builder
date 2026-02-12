"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";
import { TDS_RADIUS } from "@/lib/tds/tokens";

// TDS Skeleton Props
export interface TDSSkeletonProps {
  variant?: "text" | "circle" | "rect" | "card" | "listRow";
  width?: number | "full";
  height?: number;
  lines?: number; // for text variant
  animated?: boolean;
}

export const SkeletonComponent = ({
  variant = "text",
  width = "full",
  height = 16,
  lines = 3,
  animated = true,
}: TDSSkeletonProps) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));

  const animationClass = animated ? "animate-pulse" : "";
  const widthStyle = width === "full" ? "100%" : width;

  const renderSkeleton = () => {
    switch (variant) {
      case "text":
        return (
          <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
              <div
                key={i}
                className={`bg-gray-200 rounded ${animationClass}`}
                style={{
                  width: i === lines - 1 ? "60%" : "100%",
                  height,
                  borderRadius: TDS_RADIUS.sm,
                }}
              />
            ))}
          </div>
        );

      case "circle":
        return (
          <div
            className={`bg-gray-200 ${animationClass}`}
            style={{
              width: typeof width === "number" ? width : 48,
              height: typeof width === "number" ? width : 48,
              borderRadius: TDS_RADIUS.full,
            }}
          />
        );

      case "rect":
        return (
          <div
            className={`bg-gray-200 ${animationClass}`}
            style={{
              width: widthStyle,
              height,
              borderRadius: TDS_RADIUS.md,
            }}
          />
        );

      case "card":
        return (
          <div
            className={`bg-gray-100 p-4 ${animationClass}`}
            style={{ borderRadius: TDS_RADIUS.lg }}
          >
            <div className="flex gap-3 mb-3">
              <div
                className="bg-gray-200 flex-shrink-0"
                style={{ width: 48, height: 48, borderRadius: TDS_RADIUS.md }}
              />
              <div className="flex-1 space-y-2">
                <div className="bg-gray-200 h-4 rounded" style={{ width: "60%" }} />
                <div className="bg-gray-200 h-3 rounded" style={{ width: "80%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-gray-200 h-3 rounded" />
              <div className="bg-gray-200 h-3 rounded" style={{ width: "90%" }} />
              <div className="bg-gray-200 h-3 rounded" style={{ width: "70%" }} />
            </div>
          </div>
        );

      case "listRow":
        return (
          <div className="flex items-center gap-3 py-3">
            <div
              className={`bg-gray-200 flex-shrink-0 ${animationClass}`}
              style={{ width: 40, height: 40, borderRadius: TDS_RADIUS.md }}
            />
            <div className="flex-1 space-y-2">
              <div
                className={`bg-gray-200 h-4 ${animationClass}`}
                style={{ width: "50%", borderRadius: TDS_RADIUS.sm }}
              />
              <div
                className={`bg-gray-200 h-3 ${animationClass}`}
                style={{ width: "70%", borderRadius: TDS_RADIUS.sm }}
              />
            </div>
            <div
              className={`bg-gray-200 ${animationClass}`}
              style={{ width: 20, height: 20, borderRadius: TDS_RADIUS.sm }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`px-4 py-2 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      {renderSkeleton()}
    </div>
  );
};

const SkeletonSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));

  return (
    <SettingsPanel title="스켈레톤">
      <label className="block text-xs text-gray-500 mb-1">타입</label>
      <select
        className="w-full border rounded-lg p-2 text-sm mb-3"
        value={props.variant || "text"}
        onChange={(e) => setProp((p: TDSSkeletonProps) => (p.variant = e.target.value as TDSSkeletonProps["variant"]))}
      >
        <option value="text">텍스트</option>
        <option value="circle">원형</option>
        <option value="rect">사각형</option>
        <option value="card">카드</option>
        <option value="listRow">리스트 항목</option>
      </select>

      {props.variant === "text" && (
        <>
          <label className="block text-xs text-gray-500 mb-1">줄 수</label>
          <input
            type="number"
            min={1}
            max={10}
            className="w-full border rounded-lg p-2 text-sm mb-3"
            value={props.lines || 3}
            onChange={(e) => setProp((p: TDSSkeletonProps) => (p.lines = Number(e.target.value)))}
          />
        </>
      )}

      {(props.variant === "rect" || props.variant === "text") && (
        <>
          <label className="block text-xs text-gray-500 mb-1">높이 (px)</label>
          <input
            type="number"
            min={8}
            max={200}
            className="w-full border rounded-lg p-2 text-sm mb-3"
            value={props.height || 16}
            onChange={(e) => setProp((p: TDSSkeletonProps) => (p.height = Number(e.target.value)))}
          />
        </>
      )}

      {props.variant === "circle" && (
        <>
          <label className="block text-xs text-gray-500 mb-1">크기 (px)</label>
          <input
            type="number"
            min={16}
            max={200}
            className="w-full border rounded-lg p-2 text-sm mb-3"
            value={typeof props.width === "number" ? props.width : 48}
            onChange={(e) => setProp((p: TDSSkeletonProps) => (p.width = Number(e.target.value)))}
          />
        </>
      )}

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={props.animated ?? true}
          onChange={(e) => setProp((p: TDSSkeletonProps) => (p.animated = e.target.checked))}
        />
        애니메이션
      </label>
    </SettingsPanel>
  );
};

SkeletonComponent.craft = {
  props: {
    variant: "text",
    width: "full",
    height: 16,
    lines: 3,
    animated: true,
  },
  related: { settings: SkeletonSettings },
  displayName: "스켈레톤",
};
