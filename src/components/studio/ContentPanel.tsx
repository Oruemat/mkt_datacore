"use client";

import React, { useState } from "react";

export type ContentType = "post" | "carousel" | "reel" | "calendar" | "email" | "lead" | "report" | "brandbook";

interface Tab {
  id: string;
  label: string;
}

interface ContentPanelProps {
  copyTab: React.ReactNode;
  editorTab?: React.ReactNode;
  codeTab?: React.ReactNode;
  detailsTab?: React.ReactNode;
  hasContent: boolean;
}

const TABS: Tab[] = [
  { id: "copy", label: "Contenido" },
  { id: "editor", label: "Editor" },
  { id: "code", label: "Codigo" },
  { id: "details", label: "Detalles" },
];

export function ContentPanel({ copyTab, editorTab, codeTab, detailsTab, hasContent }: ContentPanelProps) {
  const [activeTab, setActiveTab] = useState("copy");

  if (!hasContent) return null;

  const availableTabs = TABS.filter((tab) => {
    if (tab.id === "editor" && !editorTab) return false;
    if (tab.id === "code" && !codeTab) return false;
    if (tab.id === "details" && !detailsTab) return false;
    return true;
  });

  return (
    <div className="px-4 pb-6">
      {/* Tab bar */}
      {availableTabs.length > 1 && (
        <div className="flex gap-1 mb-4 bg-dc-gray-100 rounded-xl p-1">
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 text-xs font-medium py-2 px-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-white text-dc-gray-900 shadow-sm"
                  : "text-dc-gray-500 hover:text-dc-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Tab content */}
      <div>
        {activeTab === "copy" && copyTab}
        {activeTab === "editor" && editorTab}
        {activeTab === "code" && codeTab}
        {activeTab === "details" && detailsTab}
      </div>
    </div>
  );
}
