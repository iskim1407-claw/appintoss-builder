"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";

interface Tab {
  icon: string;
  label: string;
  pageId?: string;
}

interface TabBarProps {
  tabs?: Tab[];
  activeIndex?: number;
}

const defaultTabs: Tab[] = [
  { icon: "🏠", label: "홈", pageId: "home" },
  { icon: "🔍", label: "검색", pageId: "search" },
  { icon: "❤️", label: "찜", pageId: "favorites" },
  { icon: "👤", label: "마이", pageId: "my" },
];

export const TabBarComponent = ({
  tabs = defaultTabs,
  activeIndex = 0,
}: TabBarProps) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));
  const [active, setActive] = React.useState(activeIndex);

  return (
    <div 
      ref={(ref) => { if (ref) connect(drag(ref)); }} 
      className={`${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      <nav className="flex border-t border-gray-100 bg-white">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`flex-1 flex flex-col items-center py-2 gap-1 transition ${
              active === i ? "text-[#3182F6]" : "text-gray-400"
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[11px] font-medium">{tab.label}</span>
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
    setProp((p: TabBarProps) => {
      const newTabs = [...(p.tabs || defaultTabs)];
      newTabs[index] = { ...newTabs[index], [field]: value };
      p.tabs = newTabs;
    });
  };

  const addTab = () => {
    setProp((p: TabBarProps) => {
      const newTabs = [...(p.tabs || defaultTabs)];
      newTabs.push({ icon: "⭐", label: "새 탭", pageId: `tab_${newTabs.length}` });
      p.tabs = newTabs;
    });
  };

  const removeTab = (index: number) => {
    setProp((p: TabBarProps) => {
      const newTabs = [...(p.tabs || defaultTabs)];
      newTabs.splice(index, 1);
      p.tabs = newTabs;
    });
  };

  return (
    <SettingsPanel title="탭바">
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
              <input 
                className="border rounded-lg p-1.5 text-sm" 
                placeholder="아이콘"
                value={tab.icon}
                onChange={(e) => updateTab(i, "icon", e.target.value)}
              />
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
          className="w-full py-2 text-sm text-[#3182F6] border border-[#3182F6] rounded-lg hover:bg-blue-50"
        >
          + 탭 추가
        </button>
      )}
    </SettingsPanel>
  );
};

TabBarComponent.craft = {
  props: { tabs: defaultTabs, activeIndex: 0 },
  related: { settings: TabBarSettings },
  displayName: "탭바",
};
