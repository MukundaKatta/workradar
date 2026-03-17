"use client";

import { useState } from "react";
import { Search, Bell, Moon, Sun, Menu, LogOut, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/lib/store";

export function TopBar() {
  const { isDark, toggle: toggleTheme } = useThemeStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="flex h-16 items-center gap-4 border-b border-border bg-surface px-4 lg:px-6">
      {/* Mobile Menu Button */}
      <button className="rounded-lg p-2 text-text-secondary hover:bg-surface-tertiary lg:hidden">
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search jobs, companies, skills..."
          className="w-full rounded-lg border border-border bg-surface-secondary py-2 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-tertiary"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-tertiary">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
        </button>

        {/* User Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-200 dark:bg-primary-900/40 dark:text-primary-300"
          >
            JD
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-border bg-surface py-1 shadow-lg">
                <a
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface-tertiary"
                >
                  <User className="h-4 w-4" />
                  Profile
                </a>
                <a
                  href="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface-tertiary"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </a>
                <hr className="my-1 border-border" />
                <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-surface-tertiary">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
