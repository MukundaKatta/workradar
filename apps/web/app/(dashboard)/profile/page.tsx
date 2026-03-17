"use client";

import { useState } from "react";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  Upload,
  Plus,
  Trash2,
  Save,
  X,
  Shield,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkEntry {
  id: string;
  company: string;
  title: string;
  start_date: string;
  end_date: string;
  current: boolean;
  description: string;
}

const MOCK_WORK_HISTORY: WorkEntry[] = [
  {
    id: "w1",
    company: "Acme Corp",
    title: "Senior Frontend Engineer",
    start_date: "2023-01",
    end_date: "",
    current: true,
    description: "Leading frontend architecture for the main product platform.",
  },
  {
    id: "w2",
    company: "StartupXYZ",
    title: "Frontend Developer",
    start_date: "2020-06",
    end_date: "2022-12",
    current: false,
    description: "Built React-based dashboards and data visualization tools.",
  },
];

export default function ProfilePage() {
  const [fullName, setFullName] = useState("Jane Doe");
  const [email] = useState("jane@example.com");
  const [desiredRoles, setDesiredRoles] = useState([
    "Senior Frontend Engineer",
    "Staff Engineer",
  ]);
  const [seniority, setSeniority] = useState("Senior");
  const [salaryMin, setSalaryMin] = useState(180000);
  const [salaryMax, setSalaryMax] = useState(250000);
  const [remotePreference, setRemotePreference] = useState("hybrid");
  const [locations, setLocations] = useState(["San Francisco", "New York"]);
  const [skills, setSkills] = useState([
    "React",
    "TypeScript",
    "Next.js",
    "Node.js",
    "CSS",
  ]);
  const [visaStatus, setVisaStatus] = useState("H-1B");
  const [needsSponsorship, setNeedsSponsorship] = useState(true);
  const [h1bExpiry, setH1bExpiry] = useState("2027-06-15");
  const [workHistory, setWorkHistory] = useState(MOCK_WORK_HISTORY);
  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
  };

  const addWorkEntry = () => {
    setWorkHistory((prev) => [
      {
        id: Date.now().toString(),
        company: "",
        title: "",
        start_date: "",
        end_date: "",
        current: false,
        description: "",
      },
      ...prev,
    ]);
  };

  const updateWorkEntry = (id: string, updates: Partial<WorkEntry>) => {
    setWorkHistory((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates } : w)),
    );
  };

  const removeWorkEntry = (id: string) => {
    setWorkHistory((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Profile</h1>
          <p className="text-sm text-text-secondary">
            Manage your job search preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Basic Info */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">
          Basic Information
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface-secondary py-2.5 pl-10 pr-4 text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                value={email}
                disabled
                className="w-full rounded-lg border border-border bg-surface-tertiary py-2.5 pl-10 pr-4 text-sm text-text-muted cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Job Preferences */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">
          Job Preferences
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Desired Roles
            </label>
            <div className="flex flex-wrap gap-2">
              {desiredRoles.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
                >
                  {role}
                  <button
                    onClick={() =>
                      setDesiredRoles((prev) => prev.filter((r) => r !== role))
                    }
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Seniority
              </label>
              <select
                value={seniority}
                onChange={(e) => setSeniority(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface-secondary py-2.5 px-4 text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                {["Entry Level", "Mid Level", "Senior", "Staff", "Principal", "Director"].map(
                  (s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Remote Preference
              </label>
              <select
                value={remotePreference}
                onChange={(e) => setRemotePreference(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface-secondary py-2.5 px-4 text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
                <option value="any">Any</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Salary Range: ${(salaryMin / 1000).toFixed(0)}k - $
              {(salaryMax / 1000).toFixed(0)}k
            </label>
            <div className="flex gap-4">
              <input
                type="range"
                min={30000}
                max={500000}
                step={10000}
                value={salaryMin}
                onChange={(e) => setSalaryMin(parseInt(e.target.value))}
                className="flex-1 accent-primary-600"
              />
              <input
                type="range"
                min={30000}
                max={500000}
                step={10000}
                value={salaryMax}
                onChange={(e) => setSalaryMax(parseInt(e.target.value))}
                className="flex-1 accent-primary-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">Skills</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1 text-sm font-medium text-accent-dark dark:text-accent-light"
            >
              {skill}
              <button
                onClick={() => setSkills((prev) => prev.filter((s) => s !== skill))}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newSkill.trim()) {
                setSkills((prev) => [...prev, newSkill.trim()]);
                setNewSkill("");
              }
            }}
            placeholder="Add a skill..."
            className="flex-1 rounded-lg border border-border bg-surface-secondary py-2 px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
          <button
            onClick={() => {
              if (newSkill.trim()) {
                setSkills((prev) => [...prev, newSkill.trim()]);
                setNewSkill("");
              }
            }}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* Visa */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
          <Shield className="h-5 w-5 text-primary-500" />
          Visa & Work Authorization
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Visa Status
            </label>
            <select
              value={visaStatus}
              onChange={(e) => setVisaStatus(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-secondary py-2.5 px-4 text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {["US Citizen", "Green Card", "H-1B", "L-1", "O-1", "OPT/CPT", "TN Visa", "Other"].map(
                (v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ),
              )}
            </select>
          </div>
          {needsSponsorship && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                H-1B Expiry Date
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="date"
                  value={h1bExpiry}
                  onChange={(e) => setH1bExpiry(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface-secondary py-2.5 pl-10 pr-4 text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>
          )}
        </div>
        <label className="mt-4 flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={needsSponsorship}
            onChange={(e) => setNeedsSponsorship(e.target.checked)}
            className="rounded border-border accent-primary-600"
          />
          <span className="text-sm text-text-primary">
            Needs visa sponsorship
          </span>
        </label>
      </div>

      {/* Work History */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
            <Briefcase className="h-5 w-5 text-text-muted" />
            Work History
          </h2>
          <button
            onClick={addWorkEntry}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-surface-tertiary"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {workHistory.map((entry) => (
            <div
              key={entry.id}
              className="relative rounded-lg border border-border p-4"
            >
              <button
                onClick={() => removeWorkEntry(entry.id)}
                className="absolute right-3 top-3 rounded p-1 text-text-muted hover:bg-danger/10 hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={entry.company}
                  onChange={(e) =>
                    updateWorkEntry(entry.id, { company: e.target.value })
                  }
                  placeholder="Company"
                  className="rounded-lg border border-border bg-surface-secondary py-2 px-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none"
                />
                <input
                  value={entry.title}
                  onChange={(e) =>
                    updateWorkEntry(entry.id, { title: e.target.value })
                  }
                  placeholder="Job Title"
                  className="rounded-lg border border-border bg-surface-secondary py-2 px-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none"
                />
                <input
                  type="month"
                  value={entry.start_date}
                  onChange={(e) =>
                    updateWorkEntry(entry.id, { start_date: e.target.value })
                  }
                  className="rounded-lg border border-border bg-surface-secondary py-2 px-3 text-sm text-text-primary focus:border-primary-500 focus:outline-none"
                />
                {!entry.current && (
                  <input
                    type="month"
                    value={entry.end_date}
                    onChange={(e) =>
                      updateWorkEntry(entry.id, { end_date: e.target.value })
                    }
                    className="rounded-lg border border-border bg-surface-secondary py-2 px-3 text-sm text-text-primary focus:border-primary-500 focus:outline-none"
                  />
                )}
              </div>
              <label className="mt-2 flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={entry.current}
                  onChange={(e) =>
                    updateWorkEntry(entry.id, { current: e.target.checked })
                  }
                  className="rounded border-border accent-primary-600"
                />
                Currently working here
              </label>
              <textarea
                value={entry.description}
                onChange={(e) =>
                  updateWorkEntry(entry.id, { description: e.target.value })
                }
                placeholder="Brief description..."
                rows={2}
                className="mt-2 w-full rounded-lg border border-border bg-surface-secondary py-2 px-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none resize-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Resume */}
      <div className="rounded-xl border border-border bg-surface p-6 mb-8">
        <h2 className="text-lg font-semibold text-text-primary">Resume</h2>
        <div className="mt-4 rounded-xl border-2 border-dashed border-border p-8 text-center transition-colors hover:border-primary-400">
          <Upload className="mx-auto h-8 w-8 text-text-muted" />
          <p className="mt-2 text-sm font-medium text-text-primary">
            Upload or replace your resume
          </p>
          <p className="text-xs text-text-muted">PDF, DOC, or DOCX up to 5MB</p>
          <button className="mt-3 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
            Choose File
          </button>
        </div>
      </div>
    </div>
  );
}
