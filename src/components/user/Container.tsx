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
  return (
    <div ref={(ref) => { if (ref) connect(ref); }} className="min-h-full">
      {children}
    </div>
  );
};

Canvas.craft = {
  rules: { canMoveIn: () => true },
  displayName: "캔버스",
};
