"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { useSidebarStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen } = useSidebarStore();

  return (
    <div className="flex h-screen overflow-hidden bg-surface-secondary">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main
          className={cn(
            "flex-1 overflow-y-auto p-4 pb-20 lg:p-6 lg:pb-6 scrollbar-thin",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
