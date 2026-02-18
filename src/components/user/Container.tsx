"use client";

import { useNode } from "@craftjs/core";
import React from "react";

interface ContainerProps {
  children?: React.ReactNode;
  background?: string;
  padding?: number;
}

export const Container = ({
  children,
  background = "#FFFFFF",
  padding = 16,
}: ContainerProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{ background, padding, minHeight: 100 }}
    >
      {children}
    </div>
  );
};

Container.craft = {
  props: { background: "#FFFFFF", padding: 16 },
  rules: { canDrag: () => true },
  displayName: "컨테이너",
};

export const Canvas = ({ children }: { children?: React.ReactNode }) => {
  const { connectors: { connect } } = useNode();
  const [isDragOver, setIsDragOver] = React.useState(false);
  const hasChildren = React.Children.count(children) > 0;

  return (
    <div
      ref={(ref) => { if (ref) connect(ref); }}
      className={`min-h-full transition-colors duration-200 ${
        isDragOver ? "bg-blue-50/50 ring-2 ring-[#3182F6]/20 ring-inset" : ""
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={() => setIsDragOver(false)}
    >
      {children}
      {!hasChildren && !isDragOver && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-300">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3"><path d="M12 5v14M5 12h14"/></svg>
          <p className="text-sm font-medium">컴포넌트를 여기에 드래그하세요</p>
        </div>
      )}
      {isDragOver && (
        <div className="flex items-center justify-center py-6 mx-4 my-2 border-2 border-dashed border-[#3182F6]/40 rounded-xl bg-blue-50/30 transition-all">
          <span className="text-sm text-[#3182F6]/60 font-medium">여기에 놓기</span>
        </div>
      )}
    </div>
  );
};

Canvas.craft = {
  rules: { canMoveIn: () => true },
  displayName: "캔버스",
};
