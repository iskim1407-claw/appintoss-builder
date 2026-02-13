"use client";

import { useNode } from "@craftjs/core";
import React, { useState } from "react";
import { SettingsPanel } from "./shared";
import { TDS_COLORS, TDS_RADIUS, TDS_SHADOWS } from "@/lib/tds/tokens";
import { Home, Search, Heart, User, Star, ShoppingBag, Bell, Settings, Menu, Bookmark, MessageCircle, Wallet, type LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  home: Home, search: Search, heart: Heart, user: User, star: Star,
  shop: ShoppingBag, bell: Bell, settings: Settings, menu: Menu,
  bookmark: Bookmark, chat: MessageCircle, wallet: Wallet,
};

const ICON_OPTIONS = Object.keys(ICON_MAP);

function TabIcon({ icon, size, color }: { icon: string; size: number; color: string }) {
  const LucideComp = ICON_MAP[icon];
  if (LucideComp) return <LucideComp size={size} color={color} strokeWidth={1.8} />;
  // fallback: treat as emoji
  return <span style={{ fontSize: size, lineHeight: 1 }}>{icon}</span>;
}

interface Tab {
  icon: string;
  label: string;
  pageId?: string;
}

// TDS Tabbar Props - floating tabbar at bottom
export interface TDSTabbarProps {
  tabs?: Tab[];
  activeIndex?: number;
  variant?: "default" | "floating";
  showLabels?: boolean;
}

const defaultTabs: Tab[] = [
  { icon: "home", label: "홈", pageId: "home" },
  { icon: "search", label: "검색", pageId: "search" },
  { icon: "heart", label: "찜", pageId: "favorites" },
  { icon: "user", label: "마이", pageId: "my" },
];

export const TabBarComponent = ({
  tabs = defaultTabs,
  activeIndex = 0,
  variant = "default",
  showLabels = true,
}: TDSTabbarProps) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));
  const [active, setActive] = useState(activeIndex);

  const isFloating = variant === "floating";

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      <nav
        className={`
          flex items-center
          ${isFloating ? "mx-4 mb-4" : "border-t"}
        `}
        style={{
          backgroundColor: TDS_COLORS.white,
          borderColor: TDS_COLORS.gray100,
          borderRadius: isFloating ? TDS_RADIUS.xl : 0,
          boxShadow: isFloating ? TDS_SHADOWS.lg : "none",
          paddingBottom: isFloating ? 0 : "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`
              flex-1 flex flex-col items-center justify-center gap-0.5
              transition-colors
              ${isFloating ? "py-3" : "py-2.5"}
            `}
            style={{
              color: active === i ? TDS_COLORS.blue : TDS_COLORS.gray400,
            }}
          >
            <TabIcon icon={tab.icon} size={isFloating ? 26 : 22} color={active === i ? TDS_COLORS.blue : TDS_COLORS.gray400} />
            {showLabels && (
              <span
                className="text-[10px] font-medium"
                style={{
                  color: active === i ? TDS_COLORS.blue : TDS_COLORS.gray400,
                }}
              >
                {tab.label}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

const TabBarSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));
  const tabs = (props.tabs as Tab[]) || defaultTabs;

  const updateTab = (index: number, field: keyof Tab, value: string) => {
    setProp((p: TDSTabbarProps) => {
      const newTabs = [...(p.tabs || defaultTabs)];
      newTabs[index] = { ...newTabs[index], [field]: value };
      p.tabs = newTabs;
    });
  };

  const addTab = () => {
    setProp((p: TDSTabbarProps) => {
      const newTabs = [...(p.tabs || defaultTabs)];
      newTabs.push({ icon: "star", label: "새 탭", pageId: `tab_${newTabs.length}` });
      p.tabs = newTabs;
    });
  };

  const removeTab = (index: number) => {
    setProp((p: TDSTabbarProps) => {
      const newTabs = [...(p.tabs || defaultTabs)];
      newTabs.splice(index, 1);
      p.tabs = newTabs;
    });
  };

  return (
    <SettingsPanel title="탭바">
      <label className="block text-xs text-gray-500 mb-1">스타일</label>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setProp((p: TDSTabbarProps) => (p.variant = "default"))}
          className={`flex-1 py-2 text-xs rounded-lg border transition ${
            (props.variant || "default") === "default" ? "bg-[#3182F6] text-white border-[#3182F6]" : "border-gray-200"
          }`}
        >
          기본
        </button>
        <button
          onClick={() => setProp((p: TDSTabbarProps) => (p.variant = "floating"))}
          className={`flex-1 py-2 text-xs rounded-lg border transition ${
            props.variant === "floating" ? "bg-[#3182F6] text-white border-[#3182F6]" : "border-gray-200"
          }`}
        >
          플로팅
        </button>
      </div>

      <div className="space-y-3 mb-3">
        {tabs.map((tab, i) => (
          <div key={i} className="p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">탭 {i + 1}</span>
              {tabs.length > 2 && (
                <button
                  onClick={() => removeTab(i)}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  삭제
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                className="border rounded-lg p-1.5 text-sm"
                value={ICON_OPTIONS.includes(tab.icon) ? tab.icon : ""}
                onChange={(e) => updateTab(i, "icon", e.target.value)}
              >
                {ICON_OPTIONS.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
              <input
                className="border rounded-lg p-1.5 text-sm"
                placeholder="라벨"
                value={tab.label}
                onChange={(e) => updateTab(i, "label", e.target.value)}
              />
            </div>
            <input
              className="w-full border rounded-lg p-1.5 text-sm mt-2"
              placeholder="페이지 ID (선택)"
              value={tab.pageId || ""}
              onChange={(e) => updateTab(i, "pageId", e.target.value)}
            />
          </div>
        ))}
      </div>

      {tabs.length < 5 && (
        <button
          onClick={addTab}
          className="w-full py-2 text-sm text-[#3182F6] border border-[#3182F6] rounded-lg hover:bg-blue-50 mb-3"
        >
          + 탭 추가
        </button>
      )}

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={props.showLabels ?? true}
          onChange={(e) => setProp((p: TDSTabbarProps) => (p.showLabels = e.target.checked))}
        />
        라벨 표시
      </label>
    </SettingsPanel>
  );
};

TabBarComponent.craft = {
  props: { tabs: defaultTabs, activeIndex: 0, variant: "default", showLabels: true },
  related: { settings: TabBarSettings },
  displayName: "탭바",
};
