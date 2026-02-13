"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";

interface Product {
  name: string;
  badge?: string;
  rate: string;
  benefit: string;
  description: string;
  recommended?: boolean;
}

interface ProductCompareProps {
  title?: string;
  products?: Product[];
  accentColor?: string;
  showBadge?: boolean;
  cardStyle?: "horizontal" | "vertical";
  borderRadius?: number;
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    name: "적금 플러스",
    badge: "인기",
    rate: "연 4.5%",
    benefit: "최대 50만원 캐시백",
    description: "자유적금 · 비대면 가입",
    recommended: true,
  },
  {
    name: "정기예금",
    rate: "연 3.8%",
    benefit: "가입 즉시 이자 지급",
    description: "1년 만기 · 중도해지 가능",
  },
  {
    name: "파킹통장",
    badge: "신규",
    rate: "연 2.5%",
    benefit: "매일 이자 지급",
    description: "수시입출금 · 한도무제한",
  },
];

export const ProductCompareComponent = ({
  title = "금융상품 비교",
  products = DEFAULT_PRODUCTS,
  accentColor = "#3182F6",
  showBadge = true,
  cardStyle = "vertical",
  borderRadius = 16,
}: ProductCompareProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((s) => ({ selected: s.events.selected }));

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`px-3 py-2 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      <div className="bg-white p-4" style={{ borderRadius }}>
        {/* 제목 */}
        <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>

        {/* 상품 카드 목록 */}
        <div className={`${cardStyle === "horizontal" ? "flex gap-3 overflow-x-auto pb-2" : "space-y-3"}`}>
          {products.map((product, index) => (
            <div
              key={index}
              className={`relative border rounded-2xl p-4 transition ${
                product.recommended 
                  ? "border-[#3182F6] bg-blue-50" 
                  : "border-gray-200 bg-white hover:border-gray-300"
              } ${cardStyle === "horizontal" ? "min-w-[280px] flex-shrink-0" : ""}`}
            >
              {/* 추천 태그 */}
              {product.recommended && (
                <div 
                  className="absolute -top-2 left-4 px-2 py-0.5 text-xs font-bold text-white rounded-full"
                  style={{ backgroundColor: accentColor }}
                >
                  추천
                </div>
              )}

              {/* 상품명 + 뱃지 */}
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-gray-900">{product.name}</span>
                {showBadge && product.badge && (
                  <span 
                    className="px-2 py-0.5 text-xs font-medium rounded-full text-white"
                    style={{ backgroundColor: product.badge === "인기" ? "#FF6B6B" : accentColor }}
                  >
                    {product.badge}
                  </span>
                )}
              </div>

              {/* 금리 */}
              <div className="text-2xl font-bold mb-2" style={{ color: accentColor }}>
                {product.rate}
              </div>

              {/* 혜택 */}
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                <span className="text-sm font-bold text-green-500">Bonus</span>
                <span>{product.benefit}</span>
              </div>

              {/* 설명 */}
              <p className="text-xs text-gray-400">{product.description}</p>

              {/* 가입 버튼 */}
              <button
                className={`w-full mt-4 py-3 rounded-xl font-bold text-sm transition ${
                  product.recommended 
                    ? "text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                style={product.recommended ? { backgroundColor: accentColor } : {}}
              >
                {product.recommended ? "바로 가입하기" : "자세히 보기"}
              </button>
            </div>
          ))}
        </div>

        {/* 안내 문구 */}
        <p className="text-xs text-gray-400 text-center mt-4">
          * 금리는 변동될 수 있으며, 세전 기준입니다
        </p>
      </div>
    </div>
  );
};

const ProductCompareSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));
  
  return (
    <SettingsPanel title="상품 비교">
      <label className="block text-xs text-gray-500 mb-1">제목</label>
      <input 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.title || ""} 
        onChange={(e) => setProp((p: ProductCompareProps) => (p.title = e.target.value))} 
      />

      <label className="block text-xs text-gray-500 mb-1">강조 색상</label>
      <input 
        type="color" 
        value={props.accentColor || "#3182F6"} 
        onChange={(e) => setProp((p: ProductCompareProps) => (p.accentColor = e.target.value))} 
        className="w-full h-8 mb-3" 
      />

      <label className="block text-xs text-gray-500 mb-1">카드 스타일</label>
      <select 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.cardStyle || "vertical"} 
        onChange={(e) => setProp((p: ProductCompareProps) => (p.cardStyle = e.target.value as "horizontal" | "vertical"))}
      >
        <option value="vertical">세로 정렬</option>
        <option value="horizontal">가로 스크롤</option>
      </select>

      <label className="block text-xs text-gray-500 mb-1">모서리 둥글기</label>
      <input 
        type="range" 
        min={0} 
        max={24} 
        value={props.borderRadius || 16}
        onChange={(e) => setProp((p: ProductCompareProps) => (p.borderRadius = Number(e.target.value)))}
        className="w-full mb-1"
      />
      <span className="text-xs text-gray-400">{props.borderRadius || 16}px</span>

      <label className="flex items-center gap-2 text-sm mt-3">
        <input 
          type="checkbox" 
          checked={props.showBadge ?? true} 
          onChange={(e) => setProp((p: ProductCompareProps) => (p.showBadge = e.target.checked))} 
        />
        뱃지 표시
      </label>

      <div className="border-t border-gray-100 pt-3 mt-3">
        <label className="block text-xs text-gray-500 mb-2">상품 편집</label>
        {(props.products || DEFAULT_PRODUCTS).map((product: Product, index: number) => (
          <div key={index} className="bg-gray-50 rounded-lg p-2 mb-2">
            <input 
              className="w-full border rounded p-1.5 text-xs mb-1" 
              placeholder="상품명"
              value={product.name} 
              onChange={(e) => {
                const newProducts = [...(props.products || DEFAULT_PRODUCTS)];
                newProducts[index] = { ...product, name: e.target.value };
                setProp((p: ProductCompareProps) => (p.products = newProducts));
              }} 
            />
            <input 
              className="w-full border rounded p-1.5 text-xs mb-1" 
              placeholder="금리 (예: 연 4.5%)"
              value={product.rate} 
              onChange={(e) => {
                const newProducts = [...(props.products || DEFAULT_PRODUCTS)];
                newProducts[index] = { ...product, rate: e.target.value };
                setProp((p: ProductCompareProps) => (p.products = newProducts));
              }} 
            />
            <label className="flex items-center gap-1 text-xs">
              <input 
                type="checkbox"
                checked={product.recommended ?? false}
                onChange={(e) => {
                  const newProducts = [...(props.products || DEFAULT_PRODUCTS)];
                  newProducts[index] = { ...product, recommended: e.target.checked };
                  setProp((p: ProductCompareProps) => (p.products = newProducts));
                }}
              />
              추천 상품
            </label>
          </div>
        ))}
      </div>
    </SettingsPanel>
  );
};

ProductCompareComponent.craft = {
  props: {
    title: "금융상품 비교",
    products: DEFAULT_PRODUCTS,
    accentColor: "#3182F6",
    showBadge: true,
    cardStyle: "vertical",
    borderRadius: 16,
  },
  related: { settings: ProductCompareSettings },
  displayName: "상품 비교",
};
