"use client";

import React from "react";

export const SettingsPanel = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="font-bold text-sm mb-3 text-gray-700">{title} 설정</h3>
    {children}
  </div>
);
