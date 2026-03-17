"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Radio,
  Briefcase,
  BarChart3,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/lib/store";

const navItems = [
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/radar", label: "Radar", icon: Radio },
  { href: "/applications", label: "Applications", icon: Briefcase },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebarStore();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden h-screen flex-col border-r border-border bg-surface transition-all duration-300 lg:flex",
          isOpen ? "w-60" : "w-[68px]",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg gradient-primary">
            <Radio className="h-5 w-5 text-white" />
          </div>
          {isOpen && (
            <span className="text-lg font-bold text-text-primary">
              WorkRadar
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                    : "text-text-secondary hover:bg-surface-tertiary hover:text-text-primary",
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {isOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t border-border p-3">
          <button
            onClick={toggle}
            className="flex w-full items-center justify-center rounded-lg py-2 text-text-muted transition-colors hover:bg-surface-tertiary hover:text-text-primary"
          >
            {isOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-surface py-2 lg:hidden">
        {navItems.slice(0, 5).map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors",
                active
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-text-muted",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
