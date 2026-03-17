"use client";

import { useState } from "react";
import {
  Radio,
  Plus,
  Play,
  Pause,
  Trash2,
  Edit3,
  X,
  Search,
  Zap,
  Clock,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Radar {
  id: string;
  name: string;
  keywords: string[];
  titles: string[];
  companies: string[];
  salary_min?: number;
  remote: boolean;
  visa_only: boolean;
  frequency: "realtime" | "daily" | "weekly";
  active: boolean;
  found_this_week: number;
  new_today: number;
}

const MOCK_RADARS: Radar[] = [
  {
    id: "1",
    name: "Senior Frontend @ Top Tech",
    keywords: ["React", "TypeScript", "Next.js"],
    titles: ["Senior Frontend Engineer", "Staff Frontend Engineer"],
    companies: ["Stripe", "Vercel", "Shopify"],
    salary_min: 180000,
    remote: true,
    visa_only: true,
    frequency: "daily",
    active: true,
    found_this_week: 14,
    new_today: 3,
  },
  {
    id: "2",
    name: "Full Stack Remote",
    keywords: ["Node.js", "React", "PostgreSQL"],
    titles: ["Full Stack Engineer"],
    companies: [],
    salary_min: 150000,
    remote: true,
    visa_only: false,
    frequency: "weekly",
    active: true,
    found_this_week: 23,
    new_today: 0,
  },
  {
    id: "3",
    name: "Engineering Manager",
    keywords: ["Engineering Manager", "Tech Lead"],
    titles: ["Engineering Manager", "Director of Engineering"],
    companies: [],
    salary_min: 200000,
    remote: false,
    visa_only: true,
    frequency: "daily",
    active: false,
    found_this_week: 0,
    new_today: 0,
  },
];

export default function RadarPage() {
  const [radars, setRadars] = useState(MOCK_RADARS);
  const [showCreate, setShowCreate] = useState(false);
  const [newRadar, setNewRadar] = useState({
    name: "",
    keywords: "",
    titles: "",
    companies: "",
    salary_min: 100000,
    remote: false,
    visa_only: false,
    frequency: "daily" as "realtime" | "daily" | "weekly",
  });

  const toggleActive = (id: string) => {
    setRadars((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)),
    );
  };

  const deleteRadar = (id: string) => {
    setRadars((prev) => prev.filter((r) => r.id !== id));
  };

  const handleCreate = () => {
    const radar: Radar = {
      id: Date.now().toString(),
      name: newRadar.name,
      keywords: newRadar.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      titles: newRadar.titles.split(",").map((t) => t.trim()).filter(Boolean),
      companies: newRadar.companies.split(",").map((c) => c.trim()).filter(Boolean),
      salary_min: newRadar.salary_min,
      remote: newRadar.remote,
      visa_only: newRadar.visa_only,
      frequency: newRadar.frequency,
      active: true,
      found_this_week: 0,
      new_today: 0,
    };
    setRadars((prev) => [...prev, radar]);
    setShowCreate(false);
    setNewRadar({
      name: "",
      keywords: "",
      titles: "",
      companies: "",
      salary_min: 100000,
      remote: false,
      visa_only: false,
      frequency: "daily",
    });
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Radar</h1>
          <p className="text-sm text-text-secondary">
            Your active job scans and alerts
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          New Radar
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-surface p-4 text-center">
          <Zap className="mx-auto h-5 w-5 text-primary-500" />
          <p className="mt-2 text-2xl font-bold text-text-primary">
            {radars.filter((r) => r.active).length}
          </p>
          <p className="text-xs text-text-muted">Active Radars</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4 text-center">
          <TrendingUp className="mx-auto h-5 w-5 text-accent" />
          <p className="mt-2 text-2xl font-bold text-text-primary">
            {radars.reduce((a, r) => a + r.found_this_week, 0)}
          </p>
          <p className="text-xs text-text-muted">Found This Week</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4 text-center">
          <Clock className="mx-auto h-5 w-5 text-warning" />
          <p className="mt-2 text-2xl font-bold text-text-primary">
            {radars.reduce((a, r) => a + r.new_today, 0)}
          </p>
          <p className="text-xs text-text-muted">New Today</p>
        </div>
      </div>

      {/* Radar List */}
      <div className="space-y-4">
        {radars.map((radar) => (
          <div
            key={radar.id}
            className={cn(
              "rounded-xl border bg-surface p-5 transition-all",
              radar.active ? "border-border" : "border-border opacity-60",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    radar.active
                      ? "bg-primary-50 dark:bg-primary-900/30"
                      : "bg-surface-tertiary",
                  )}
                >
                  <Radio
                    className={cn(
                      "h-5 w-5",
                      radar.active
                        ? "text-primary-600 animate-radar-pulse"
                        : "text-text-muted",
                    )}
                  />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-text-primary">
                    {radar.name}
                  </h3>
                  <p className="text-xs text-text-muted">
                    {radar.frequency === "realtime"
                      ? "Real-time"
                      : radar.frequency === "daily"
                        ? "Daily digest"
                        : "Weekly digest"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleActive(radar.id)}
                  className={cn(
                    "rounded-lg p-2 transition-colors",
                    radar.active
                      ? "text-warning hover:bg-warning/10"
                      : "text-accent hover:bg-accent/10",
                  )}
                >
                  {radar.active ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </button>
                <button className="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-tertiary">
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteRadar(radar.id)}
                  className="rounded-lg p-2 text-text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Filters summary */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {radar.keywords.map((k) => (
                <span
                  key={k}
                  className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                >
                  {k}
                </span>
              ))}
              {radar.remote && (
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                  Remote
                </span>
              )}
              {radar.visa_only && (
                <span className="rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning">
                  Visa Sponsor
                </span>
              )}
              {radar.salary_min && (
                <span className="rounded-full bg-surface-tertiary px-2.5 py-0.5 text-xs font-medium text-text-muted">
                  ${(radar.salary_min / 1000).toFixed(0)}k+
                </span>
              )}
            </div>

            {/* Stats Row */}
            {radar.active && (
              <div className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-xs text-text-muted">
                <span>
                  <strong className="text-text-primary">{radar.found_this_week}</strong>{" "}
                  found this week
                </span>
                {radar.new_today > 0 && (
                  <span className="text-accent font-medium">
                    {radar.new_today} new today
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Radar Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-primary">
                Create New Radar
              </h2>
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-lg p-1 text-text-muted hover:bg-surface-tertiary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  Radar Name
                </label>
                <input
                  value={newRadar.name}
                  onChange={(e) =>
                    setNewRadar({ ...newRadar, name: e.target.value })
                  }
                  placeholder="e.g., Dream Frontend Role"
                  className="w-full rounded-lg border border-border bg-surface-secondary py-2.5 px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  Keywords (comma-separated)
                </label>
                <input
                  value={newRadar.keywords}
                  onChange={(e) =>
                    setNewRadar({ ...newRadar, keywords: e.target.value })
                  }
                  placeholder="React, TypeScript, Next.js"
                  className="w-full rounded-lg border border-border bg-surface-secondary py-2.5 px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  Job Titles (comma-separated)
                </label>
                <input
                  value={newRadar.titles}
                  onChange={(e) =>
                    setNewRadar({ ...newRadar, titles: e.target.value })
                  }
                  placeholder="Senior Frontend Engineer, Staff Engineer"
                  className="w-full rounded-lg border border-border bg-surface-secondary py-2.5 px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  Target Companies (comma-separated, optional)
                </label>
                <input
                  value={newRadar.companies}
                  onChange={(e) =>
                    setNewRadar({ ...newRadar, companies: e.target.value })
                  }
                  placeholder="Stripe, Vercel, Shopify"
                  className="w-full rounded-lg border border-border bg-surface-secondary py-2.5 px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  Minimum Salary
                </label>
                <input
                  type="range"
                  min={30000}
                  max={500000}
                  step={10000}
                  value={newRadar.salary_min}
                  onChange={(e) =>
                    setNewRadar({
                      ...newRadar,
                      salary_min: parseInt(e.target.value),
                    })
                  }
                  className="w-full accent-primary-600"
                />
                <span className="text-sm text-text-secondary">
                  ${(newRadar.salary_min / 1000).toFixed(0)}k+
                </span>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newRadar.remote}
                    onChange={(e) =>
                      setNewRadar({ ...newRadar, remote: e.target.checked })
                    }
                    className="rounded border-border accent-primary-600"
                  />
                  Remote only
                </label>
                <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newRadar.visa_only}
                    onChange={(e) =>
                      setNewRadar({ ...newRadar, visa_only: e.target.checked })
                    }
                    className="rounded border-border accent-primary-600"
                  />
                  Visa sponsors only
                </label>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  Check Frequency
                </label>
                <div className="flex gap-2">
                  {(["realtime", "daily", "weekly"] as const).map((freq) => (
                    <button
                      key={freq}
                      onClick={() =>
                        setNewRadar({ ...newRadar, frequency: freq })
                      }
                      className={cn(
                        "rounded-lg border px-4 py-2 text-sm font-medium capitalize transition-colors",
                        newRadar.frequency === freq
                          ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                          : "border-border text-text-secondary hover:border-primary-300",
                      )}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-tertiary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newRadar.name}
                className="rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
              >
                Create Radar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
