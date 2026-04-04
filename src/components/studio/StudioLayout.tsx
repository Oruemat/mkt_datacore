"use client";

import React from "react";

interface StudioLayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
  status?: React.ReactNode;
}

export function StudioLayout({ sidebar, main, status }: StudioLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-5 border-b border-dc-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-dc-blue-600 to-dc-blue-700 flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold font-display">DC</span>
          </div>
          <h1 className="text-base font-display font-semibold text-dc-gray-900">Studio</h1>
        </div>
        {status}
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 border-r border-dc-gray-200 bg-white flex-shrink-0 overflow-y-auto">
          {sidebar}
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 bg-dc-gray-50 overflow-y-auto">
          {main}
        </main>
      </div>
    </div>
  );
}
