"use client";

import { useNode } from "@craftjs/core";
import React from "react";

export const DividerComponent = () => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));

  return (
    <div ref={(ref) => { if (ref) connect(drag(ref)); }} className={`px-3 py-2 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}>
      <hr className="border-gray-100" />
    </div>
  );
};

DividerComponent.craft = {
  displayName: "구분선",
};
