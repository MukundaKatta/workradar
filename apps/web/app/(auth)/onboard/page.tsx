"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  SkipForward,
  Upload,
  Check,
  Loader2,
  X,
} from "lucide-react";
import { OnboardingStep } from "@/components/OnboardingStep";
import { useOnboardingStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 5;

const ROLE_SUGGESTIONS = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Product Manager",
  "UX Designer",
  "DevOps Engineer",
  "Machine Learning Engineer",
  "Mobile Developer",
  "Engineering Manager",
  "Data Analyst",
  "QA Engineer",
  "Solutions Architect",
  "Technical Writer",
];

const SENIORITY_LEVELS = ["Entry Level", "Mid Level", "Senior", "Staff", "Principal", "Director", "VP", "C-Level"];

const VISA_STATUSES = [
  "US Citizen",
  "Green Card",
  "H-1B",
  "L-1",
  "O-1",
  "OPT/CPT",
  "TN Visa",
  "Other Work Visa",
  "Need Sponsorship",
  "Not Applicable",
];

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "E-commerce",
  "Education",
  "Media",
  "Gaming",
  "Automotive",
  "Aerospace",
  "Consulting",
  "Government",
  "Non-profit",
];

const COMPANY_SIZES = ["Startup (1-50)", "Small (51-200)", "Medium (201-1000)", "Large (1001-5000)", "Enterprise (5000+)"];

const CULTURE_VALUES = [
  "Work-life balance",
  "Fast-paced",
  "Innovative",
  "Collaborative",
  "Diverse & inclusive",
  "Flat hierarchy",
  "Mission-driven",
  "Learning-focused",
  "Transparent",
  "Flexible hours",
  "Async communication",
  "Team socials",
];

const DEAL_BREAKERS = [
  "No remote option",
  "Requires relocation",
  "Below market pay",
  "No visa sponsorship",
  "Long commute",
  "On-call required",
  "Open office plan",
  "No growth path",
  "Poor Glassdoor rating",
  "Recent layoffs",
];

export default function OnboardPage() {
  const router = useRouter();
  const { step, data, setStep, updateData } = useOnboardingStore();
  const [roleInput, setRoleInput] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [saving, setSaving] = useState(false);

  const canGoNext = () => {
    switch (step) {
      case 1:
        return (data.desired_roles?.length ?? 0) > 0;
      case 2:
        return !!data.remote_preference;
      case 3:
        return true; // skippable
      case 4:
        return (data.skills?.length ?? 0) > 0 || !!data.resume_url;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      router.push("/discover");
    } catch {
      // Handle error
    } finally {
      setSaving(false);
    }
  };

  const toggleArrayItem = (
    key: keyof typeof data,
    item: string,
  ) => {
    const current = (data[key] as string[]) || [];
    const updated = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];
    updateData({ [key]: updated });
  };

  const addToArray = (key: keyof typeof data, item: string) => {
    if (!item.trim()) return;
    const current = (data[key] as string[]) || [];
    if (!current.includes(item.trim())) {
      updateData({ [key]: [...current, item.trim()] });
    }
  };

  const removeFromArray = (key: keyof typeof data, item: string) => {
    const current = (data[key] as string[]) || [];
    updateData({ [key]: current.filter((i) => i !== item) });
  };

  const filteredRoles = ROLE_SUGGESTIONS.filter(
    (r) =>
      r.toLowerCase().includes(roleInput.toLowerCase()) &&
      !(data.desired_roles || []).includes(r),
  );

  return (
    <div className="w-full max-w-2xl">
      <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-xs text-text-muted">
            <span>
              Step {step} of {TOTAL_STEPS}
            </span>
            <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-surface-tertiary">
            <div
              className="h-full rounded-full bg-primary-600 transition-all duration-500"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Roles & Seniority */}
        {step === 1 && (
          <OnboardingStep
            title="What roles are you looking for?"
            description="Select your desired roles, seniority level, and salary expectations."
          >
            {/* Role Multi-Select with Autocomplete */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Desired Roles
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(data.desired_roles || []).map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
                  >
                    {role}
                    <button
                      onClick={() => removeFromArray("desired_roles", role)}
                      className="ml-1 hover:text-primary-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addToArray("desired_roles", roleInput);
                      setRoleInput("");
                    }
                  }}
                  placeholder="Type to search or add roles..."
                  className="w-full rounded-lg border border-border bg-surface-secondary py-2.5 px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                {roleInput && filteredRoles.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-surface py-1 shadow-lg max-h-40 overflow-y-auto">
                    {filteredRoles.slice(0, 6).map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          addToArray("desired_roles", role);
                          setRoleInput("");
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:bg-surface-tertiary"
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Seniority */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Seniority Level
              </label>
              <div className="flex flex-wrap gap-2">
                {SENIORITY_LEVELS.map((level) => (
                  <button
                    key={level}
                    onClick={() => updateData({ seniority: level })}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                      data.seniority === level
                        ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                        : "border-border text-text-secondary hover:border-primary-300",
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Salary Range (USD/year)
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-text-muted">Min</label>
                  <input
                    type="range"
                    min={30000}
                    max={500000}
                    step={10000}
                    value={data.salary_min || 80000}
                    onChange={(e) =>
                      updateData({ salary_min: parseInt(e.target.value) })
                    }
                    className="w-full accent-primary-600"
                  />
                  <span className="text-sm text-text-secondary">
                    ${((data.salary_min || 80000) / 1000).toFixed(0)}k
                  </span>
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-text-muted">Max</label>
                  <input
                    type="range"
                    min={30000}
                    max={500000}
                    step={10000}
                    value={data.salary_max || 200000}
                    onChange={(e) =>
                      updateData({ salary_max: parseInt(e.target.value) })
                    }
                    className="w-full accent-primary-600"
                  />
                  <span className="text-sm text-text-secondary">
                    ${((data.salary_max || 200000) / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>
            </div>
          </OnboardingStep>
        )}

        {/* Step 2: Location & Remote */}
        {step === 2 && (
          <OnboardingStep
            title="Where do you want to work?"
            description="Set your remote preference and preferred locations."
          >
            {/* Remote Preference */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Remote Preference
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(
                  [
                    { value: "remote", label: "Remote" },
                    { value: "hybrid", label: "Hybrid" },
                    { value: "onsite", label: "On-site" },
                    { value: "any", label: "Any" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateData({ remote_preference: opt.value })}
                    className={cn(
                      "rounded-lg border py-3 text-sm font-medium transition-colors",
                      data.remote_preference === opt.value
                        ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                        : "border-border text-text-secondary hover:border-primary-300",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Search */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Preferred Locations
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(data.locations || []).map((loc) => (
                  <span
                    key={loc}
                    className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
                  >
                    {loc}
                    <button onClick={() => removeFromArray("locations", loc)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addToArray("locations", locationInput);
                    setLocationInput("");
                  }
                }}
                placeholder="Add a city (e.g. San Francisco, New York)..."
                className="w-full rounded-lg border border-border bg-surface-secondary py-2.5 px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            {/* Willing to Relocate */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() =>
                  updateData({
                    willing_to_relocate: !data.willing_to_relocate,
                  })
                }
                className={cn(
                  "relative h-6 w-11 rounded-full transition-colors cursor-pointer",
                  data.willing_to_relocate ? "bg-primary-600" : "bg-navy-300 dark:bg-navy-600",
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                    data.willing_to_relocate ? "translate-x-[22px]" : "translate-x-0.5",
                  )}
                />
              </div>
              <span className="text-sm font-medium text-text-primary">
                Willing to relocate
              </span>
            </label>
          </OnboardingStep>
        )}

        {/* Step 3: Visa Status */}
        {step === 3 && (
          <OnboardingStep
            title="Visa & sponsorship"
            description="Help us find roles that match your work authorization. This step is optional."
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Visa Status
              </label>
              <select
                value={data.visa_status || ""}
                onChange={(e) => updateData({ visa_status: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface-secondary py-2.5 px-4 text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">Select your visa status...</option>
                {VISA_STATUSES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() =>
                  updateData({ needs_sponsorship: !data.needs_sponsorship })
                }
                className={cn(
                  "relative h-6 w-11 rounded-full transition-colors cursor-pointer",
                  data.needs_sponsorship ? "bg-primary-600" : "bg-navy-300 dark:bg-navy-600",
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                    data.needs_sponsorship
                      ? "translate-x-[22px]"
                      : "translate-x-0.5",
                  )}
                />
              </div>
              <span className="text-sm font-medium text-text-primary">
                Needs visa sponsorship
              </span>
            </label>

            {data.needs_sponsorship && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  H-1B Expiry Date (if applicable)
                </label>
                <input
                  type="date"
                  value={data.h1b_expiry || ""}
                  onChange={(e) => updateData({ h1b_expiry: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface-secondary py-2.5 px-4 text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            )}
          </OnboardingStep>
        )}

        {/* Step 4: Skills & Experience */}
        {step === 4 && (
          <OnboardingStep
            title="Skills & experience"
            description="Upload your resume or manually enter your skills."
          >
            {/* Resume Upload */}
            <div className="rounded-xl border-2 border-dashed border-border p-8 text-center transition-colors hover:border-primary-400">
              <Upload className="mx-auto h-8 w-8 text-text-muted" />
              <p className="mt-2 text-sm font-medium text-text-primary">
                Upload your resume
              </p>
              <p className="text-xs text-text-muted">PDF, DOC, or DOCX up to 5MB</p>
              <button className="mt-3 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700">
                Choose File
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-surface px-2 text-text-muted">
                  or add skills manually
                </span>
              </div>
            </div>

            {/* Skills Input */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Skills
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(data.skills || []).map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1 text-sm font-medium text-accent-dark dark:text-accent-light"
                  >
                    {skill}
                    <button onClick={() => removeFromArray("skills", skill)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addToArray("skills", skillInput);
                    setSkillInput("");
                  }
                }}
                placeholder="Type a skill and press Enter..."
                className="w-full rounded-lg border border-border bg-surface-secondary py-2.5 px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            {/* Years Experience */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Years of Experience
              </label>
              <input
                type="number"
                min={0}
                max={50}
                value={data.years_experience || 0}
                onChange={(e) =>
                  updateData({ years_experience: parseInt(e.target.value) || 0 })
                }
                className="w-32 rounded-lg border border-border bg-surface-secondary py-2.5 px-4 text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            {/* Industries */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Preferred Industries
              </label>
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => toggleArrayItem("industries", ind)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                      (data.industries || []).includes(ind)
                        ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                        : "border-border text-text-secondary hover:border-primary-300",
                    )}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>
          </OnboardingStep>
        )}

        {/* Step 5: Culture & Deal Breakers */}
        {step === 5 && (
          <OnboardingStep
            title="Company culture & deal breakers"
            description="Help us understand your ideal work environment."
          >
            {/* Company Size */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Preferred Company Size
              </label>
              <div className="flex flex-wrap gap-2">
                {COMPANY_SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleArrayItem("company_sizes", size)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                      (data.company_sizes || []).includes(size)
                        ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                        : "border-border text-text-secondary hover:border-primary-300",
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Culture Values */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Culture Values
              </label>
              <div className="flex flex-wrap gap-2">
                {CULTURE_VALUES.map((val) => (
                  <button
                    key={val}
                    onClick={() => toggleArrayItem("culture_values", val)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                      (data.culture_values || []).includes(val)
                        ? "border-accent bg-accent/10 text-accent-dark dark:text-accent-light"
                        : "border-border text-text-secondary hover:border-accent/50",
                    )}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Deal Breakers */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Deal Breakers
              </label>
              <div className="flex flex-wrap gap-2">
                {DEAL_BREAKERS.map((db) => (
                  <button
                    key={db}
                    onClick={() => toggleArrayItem("deal_breakers", db)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                      (data.deal_breakers || []).includes(db)
                        ? "border-danger bg-danger/10 text-danger"
                        : "border-border text-text-secondary hover:border-danger/50",
                    )}
                  >
                    {db}
                  </button>
                ))}
              </div>
            </div>
          </OnboardingStep>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-tertiary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex items-center gap-3">
            {step === 3 && (
              <button
                onClick={() => setStep(step + 1)}
                className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-surface-tertiary"
              >
                <SkipForward className="h-4 w-4" />
                Skip
              </button>
            )}

            {step < TOTAL_STEPS ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canGoNext()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Complete Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
