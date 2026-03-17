"use client";

import { useState } from "react";
import {
  Bell,
  Mail,
  Moon,
  Sun,
  Shield,
  Trash2,
  LogOut,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/lib/store";

export default function SettingsPage() {
  const { isDark, toggle: toggleTheme } = useThemeStore();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [newMatchAlerts, setNewMatchAlerts] = useState(true);
  const [applicationUpdates, setApplicationUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const Toggle = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: () => void;
  }) => (
    <button
      onClick={onChange}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors",
        checked ? "bg-primary-600" : "bg-navy-300 dark:bg-navy-600",
      )}
    >
      <div
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-0.5",
        )}
      />
    </button>
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary">
          Manage your account and preferences
        </p>
      </div>

      {/* Appearance */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
          <Monitor className="h-5 w-5 text-text-muted" />
          Appearance
        </h2>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">Dark Mode</p>
              <p className="text-xs text-text-muted">
                Switch between light and dark themes
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-warning" />
              <Toggle checked={isDark} onChange={toggleTheme} />
              <Moon className="h-4 w-4 text-primary-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
          <Bell className="h-5 w-5 text-text-muted" />
          Notifications
        </h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">
                Push Notifications
              </p>
              <p className="text-xs text-text-muted">
                Get notified about new matches
              </p>
            </div>
            <Toggle
              checked={pushNotifications}
              onChange={() => setPushNotifications(!pushNotifications)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">
                New Match Alerts
              </p>
              <p className="text-xs text-text-muted">
                Instant alerts for high-match jobs
              </p>
            </div>
            <Toggle
              checked={newMatchAlerts}
              onChange={() => setNewMatchAlerts(!newMatchAlerts)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">
                Application Updates
              </p>
              <p className="text-xs text-text-muted">
                Status changes and reminders
              </p>
            </div>
            <Toggle
              checked={applicationUpdates}
              onChange={() => setApplicationUpdates(!applicationUpdates)}
            />
          </div>
        </div>
      </div>

      {/* Email Preferences */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
          <Mail className="h-5 w-5 text-text-muted" />
          Email Preferences
        </h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">
                Email Notifications
              </p>
              <p className="text-xs text-text-muted">
                Receive important updates via email
              </p>
            </div>
            <Toggle
              checked={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">
                Weekly Digest
              </p>
              <p className="text-xs text-text-muted">
                Summary of new matches and market insights
              </p>
            </div>
            <Toggle
              checked={weeklyDigest}
              onChange={() => setWeeklyDigest(!weeklyDigest)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">
                Marketing Emails
              </p>
              <p className="text-xs text-text-muted">
                Product updates and feature announcements
              </p>
            </div>
            <Toggle
              checked={marketingEmails}
              onChange={() => setMarketingEmails(!marketingEmails)}
            />
          </div>
        </div>
      </div>

      {/* Account Management */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
          <Shield className="h-5 w-5 text-text-muted" />
          Account
        </h2>
        <div className="mt-4 space-y-3">
          <button className="flex w-full items-center gap-3 rounded-lg border border-border p-4 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-tertiary">
            <Shield className="h-5 w-5" />
            <div className="text-left">
              <p className="text-text-primary">Change Password</p>
              <p className="text-xs text-text-muted">
                Update your account password
              </p>
            </div>
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg border border-border p-4 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-tertiary">
            <LogOut className="h-5 w-5" />
            <div className="text-left">
              <p className="text-text-primary">Sign Out</p>
              <p className="text-xs text-text-muted">
                Sign out of all devices
              </p>
            </div>
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg border border-danger/20 p-4 text-sm font-medium text-danger transition-colors hover:bg-danger/5">
            <Trash2 className="h-5 w-5" />
            <div className="text-left">
              <p>Delete Account</p>
              <p className="text-xs opacity-70">
                Permanently delete your account and data
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
