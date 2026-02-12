"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";

interface Transaction {
  id: string;
  title: string;
  subtitle?: string;
  amount: number;
  date: string;
  type: "income" | "expense";
  category?: string;
  icon?: string;
}

interface TransactionListProps {
  title?: string;
  transactions?: Transaction[];
  showDate?: boolean;
  showCategory?: boolean;
  showIcon?: boolean;
  incomeColor?: string;
  expenseColor?: string;
  emptyMessage?: string;
  borderRadius?: number;
}

const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    title: "토스페이 충전",
    subtitle: "신한은행",
    amount: 500000,
    date: "02.12",
    type: "income",
    category: "충전",
    icon: "💳",
  },
  {
    id: "2",
    title: "스타벅스",
    subtitle: "카드결제",
    amount: 6500,
    date: "02.12",
    type: "expense",
    category: "카페",
    icon: "☕",
  },
  {
    id: "3",
    title: "월급",
    subtitle: "(주)회사",
    amount: 3500000,
    date: "02.10",
    type: "income",
    category: "급여",
    icon: "💰",
  },
  {
    id: "4",
    title: "넷플릭스",
    subtitle: "정기결제",
    amount: 17000,
    date: "02.08",
    type: "expense",
    category: "구독",
    icon: "🎬",
  },
  {
    id: "5",
    title: "이체",
    subtitle: "김철수",
    amount: 100000,
    date: "02.07",
    type: "expense",
    category: "송금",
    icon: "💸",
  },
];

export const TransactionListComponent = ({
  title = "거래내역",
  transactions = DEFAULT_TRANSACTIONS,
  showDate = true,
  showCategory = true,
  showIcon = true,
  incomeColor = "#3182F6",
  expenseColor = "#191F28",
  emptyMessage = "거래내역이 없습니다",
  borderRadius = 16,
}: TransactionListProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((s) => ({ selected: s.events.selected }));
  
  const formatAmount = (amount: number, type: "income" | "expense") => {
    const formatted = amount.toLocaleString();
    return type === "income" ? `+${formatted}` : `-${formatted}`;
  };

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`px-3 py-2 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      <div className="bg-white" style={{ borderRadius }}>
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <button className="text-sm text-gray-400 hover:text-gray-600">
            전체보기 →
          </button>
        </div>

        {/* 거래 목록 */}
        {transactions.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 p-4 hover:bg-gray-50 transition cursor-pointer"
              >
                {/* 아이콘 */}
                {showIcon && (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                    {tx.icon || (tx.type === "income" ? "📥" : "📤")}
                  </div>
                )}

                {/* 내용 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 truncate">{tx.title}</span>
                    {showCategory && tx.category && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full flex-shrink-0">
                        {tx.category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {tx.subtitle && (
                      <span className="text-sm text-gray-400 truncate">{tx.subtitle}</span>
                    )}
                    {showDate && (
                      <span className="text-sm text-gray-300">· {tx.date}</span>
                    )}
                  </div>
                </div>

                {/* 금액 */}
                <div 
                  className="text-right font-bold flex-shrink-0"
                  style={{ color: tx.type === "income" ? incomeColor : expenseColor }}
                >
                  {formatAmount(tx.amount, tx.type)}원
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-400 text-sm">
            {emptyMessage}
          </div>
        )}

        {/* 더보기 */}
        {transactions.length > 0 && (
          <div className="p-4 border-t border-gray-100">
            <button className="w-full py-3 bg-gray-50 rounded-xl text-sm text-gray-600 font-medium hover:bg-gray-100 transition">
              더보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const TransactionListSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));
  
  return (
    <SettingsPanel title="거래내역">
      <label className="block text-xs text-gray-500 mb-1">제목</label>
      <input 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.title || ""} 
        onChange={(e) => setProp((p: TransactionListProps) => (p.title = e.target.value))} 
      />

      <label className="block text-xs text-gray-500 mb-1">입금 색상</label>
      <input 
        type="color" 
        value={props.incomeColor || "#3182F6"} 
        onChange={(e) => setProp((p: TransactionListProps) => (p.incomeColor = e.target.value))} 
        className="w-full h-8 mb-3" 
      />

      <label className="block text-xs text-gray-500 mb-1">출금 색상</label>
      <input 
        type="color" 
        value={props.expenseColor || "#191F28"} 
        onChange={(e) => setProp((p: TransactionListProps) => (p.expenseColor = e.target.value))} 
        className="w-full h-8 mb-3" 
      />

      <label className="block text-xs text-gray-500 mb-1">모서리 둥글기</label>
      <input 
        type="range" 
        min={0} 
        max={24} 
        value={props.borderRadius || 16}
        onChange={(e) => setProp((p: TransactionListProps) => (p.borderRadius = Number(e.target.value)))}
        className="w-full mb-1"
      />
      <span className="text-xs text-gray-400">{props.borderRadius || 16}px</span>

      <label className="block text-xs text-gray-500 mb-1 mt-3">빈 목록 메시지</label>
      <input 
        className="w-full border rounded-lg p-2 text-sm mb-3" 
        value={props.emptyMessage || ""} 
        onChange={(e) => setProp((p: TransactionListProps) => (p.emptyMessage = e.target.value))} 
      />

      <div className="space-y-2 mt-3">
        <label className="flex items-center gap-2 text-sm">
          <input 
            type="checkbox" 
            checked={props.showDate ?? true} 
            onChange={(e) => setProp((p: TransactionListProps) => (p.showDate = e.target.checked))} 
          />
          날짜 표시
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input 
            type="checkbox" 
            checked={props.showCategory ?? true} 
            onChange={(e) => setProp((p: TransactionListProps) => (p.showCategory = e.target.checked))} 
          />
          카테고리 표시
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input 
            type="checkbox" 
            checked={props.showIcon ?? true} 
            onChange={(e) => setProp((p: TransactionListProps) => (p.showIcon = e.target.checked))} 
          />
          아이콘 표시
        </label>
      </div>

      <div className="border-t border-gray-100 pt-3 mt-3">
        <label className="block text-xs text-gray-500 mb-2">거래 편집 (예시)</label>
        <p className="text-xs text-gray-400">실제 앱에서는 API로 데이터를 불러옵니다</p>
      </div>
    </SettingsPanel>
  );
};

TransactionListComponent.craft = {
  props: {
    title: "거래내역",
    transactions: DEFAULT_TRANSACTIONS,
    showDate: true,
    showCategory: true,
    showIcon: true,
    incomeColor: "#3182F6",
    expenseColor: "#191F28",
    emptyMessage: "거래내역이 없습니다",
    borderRadius: 16,
  },
  related: { settings: TransactionListSettings },
  displayName: "거래내역",
};
