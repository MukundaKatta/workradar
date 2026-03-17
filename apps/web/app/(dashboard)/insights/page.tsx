"use client";

import {
  TrendingUp,
  AlertTriangle,
  BookOpen,
  GitBranch,
  Zap,
  ArrowRight,
  Shield,
} from "lucide-react";
import { ChatInterface } from "@/components/ChatInterface";
import { cn } from "@/lib/utils";

const SKILL_GAPS = [
  { name: "React", level: 95, category: "strong" },
  { name: "TypeScript", level: 90, category: "strong" },
  { name: "Next.js", level: 85, category: "strong" },
  { name: "GraphQL", level: 55, category: "developing" },
  { name: "System Design", level: 60, category: "developing" },
  { name: "Rust", level: 15, category: "gap" },
  { name: "Go", level: 25, category: "gap" },
  { name: "AWS/Cloud", level: 50, category: "developing" },
];

const RESKILLING = [
  {
    title: "GraphQL Mastery",
    provider: "Frontend Masters",
    duration: "8 hours",
    impact: "High",
    reason: "Required by 67% of your target roles",
  },
  {
    title: "System Design for Frontend",
    provider: "Educative",
    duration: "12 hours",
    impact: "High",
    reason: "Critical for Staff+ roles",
  },
  {
    title: "AWS Certified Developer",
    provider: "AWS",
    duration: "40 hours",
    impact: "Medium",
    reason: "Expands opportunities by 35%",
  },
  {
    title: "Introduction to Go",
    provider: "Go.dev",
    duration: "20 hours",
    impact: "Medium",
    reason: "Growing demand in your target companies",
  },
];

const CAREER_PATHS = [
  {
    from: "Senior Frontend",
    to: "Staff Engineer",
    gap: ["System Design", "Mentoring", "Architecture"],
    timeline: "1-2 years",
  },
  {
    from: "Senior Frontend",
    to: "Engineering Manager",
    gap: ["People Management", "Project Planning", "Stakeholder Management"],
    timeline: "1-3 years",
  },
  {
    from: "Senior Frontend",
    to: "Principal Engineer",
    gap: ["Technical Strategy", "Cross-team Influence", "Domain Expertise"],
    timeline: "3-5 years",
  },
];

export default function InsightsPage() {
  const aiDisplacementScore = 23;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Career Insights
        </h1>
        <p className="text-sm text-text-secondary">
          AI-powered analysis of your career trajectory
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* AI Displacement Risk */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
            <Shield className="h-4 w-4" />
            AI Displacement Risk
          </div>
          <div className="mt-4 flex items-center justify-center">
            <div className="relative h-28 w-28">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  strokeWidth="8"
                  className="stroke-surface-tertiary"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={
                    2 * Math.PI * 40 * (1 - aiDisplacementScore / 100)
                  }
                  className="stroke-accent transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-accent">
                  {aiDisplacementScore}%
                </span>
                <span className="text-[10px] text-text-muted">Low Risk</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-text-secondary text-center">
            Your frontend skills combined with design thinking make you
            resilient to AI automation
          </p>
        </div>

        {/* Market Demand */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
            <TrendingUp className="h-4 w-4" />
            Your Market Demand
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">React roles</span>
                <span className="text-accent font-medium">+12% this quarter</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-surface-tertiary">
                <div className="h-full w-[85%] rounded-full bg-accent" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">TypeScript roles</span>
                <span className="text-accent font-medium">+18% this quarter</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-surface-tertiary">
                <div className="h-full w-[90%] rounded-full bg-primary-500" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">Next.js roles</span>
                <span className="text-accent font-medium">+25% this quarter</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-surface-tertiary">
                <div className="h-full w-[78%] rounded-full bg-warning" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
            <Zap className="h-4 w-4" />
            Quick Actions
          </div>
          <div className="mt-4 space-y-2">
            <button className="flex w-full items-center justify-between rounded-lg bg-surface-secondary p-3 text-sm text-text-primary transition-colors hover:bg-surface-tertiary">
              Update skills
              <ArrowRight className="h-4 w-4 text-text-muted" />
            </button>
            <button className="flex w-full items-center justify-between rounded-lg bg-surface-secondary p-3 text-sm text-text-primary transition-colors hover:bg-surface-tertiary">
              Review salary data
              <ArrowRight className="h-4 w-4 text-text-muted" />
            </button>
            <button className="flex w-full items-center justify-between rounded-lg bg-surface-secondary p-3 text-sm text-text-primary transition-colors hover:bg-surface-tertiary">
              Practice interviews
              <ArrowRight className="h-4 w-4 text-text-muted" />
            </button>
          </div>
        </div>
      </div>

      {/* Skill Gap Analysis */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Skill Gap Analysis
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Based on your target roles and market demand
        </p>
        <div className="mt-4 space-y-3">
          {SKILL_GAPS.map((skill) => (
            <div key={skill.name}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-primary font-medium">
                  {skill.name}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    skill.category === "strong"
                      ? "text-accent"
                      : skill.category === "developing"
                        ? "text-warning"
                        : "text-danger",
                  )}
                >
                  {skill.level}%
                </span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-surface-tertiary">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    skill.category === "strong"
                      ? "bg-accent"
                      : skill.category === "developing"
                        ? "bg-warning"
                        : "bg-danger",
                  )}
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reskilling Recommendations */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
          <BookOpen className="h-5 w-5 text-primary-500" />
          Reskilling Recommendations
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {RESKILLING.map((course) => (
            <div
              key={course.title}
              className="rounded-lg border border-border p-4 transition-colors hover:border-primary-300"
            >
              <h3 className="text-sm font-semibold text-text-primary">
                {course.title}
              </h3>
              <p className="mt-1 text-xs text-text-muted">
                {course.provider} &middot; {course.duration}
              </p>
              <p className="mt-2 text-xs text-text-secondary">
                {course.reason}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    course.impact === "High"
                      ? "bg-accent/10 text-accent"
                      : "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300",
                  )}
                >
                  {course.impact} Impact
                </span>
                <button className="text-xs font-medium text-primary-600 hover:text-primary-700">
                  Start Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Career Path Explorer */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
          <GitBranch className="h-5 w-5 text-accent" />
          Career Path Explorer
        </h2>
        <div className="mt-4 space-y-4">
          {CAREER_PATHS.map((path) => (
            <div
              key={path.to}
              className="rounded-lg border border-border p-4"
            >
              <div className="flex items-center gap-3 text-sm">
                <span className="rounded-lg bg-surface-tertiary px-3 py-1.5 font-medium text-text-primary">
                  {path.from}
                </span>
                <ArrowRight className="h-4 w-4 text-text-muted" />
                <span className="rounded-lg bg-primary-50 px-3 py-1.5 font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                  {path.to}
                </span>
                <span className="ml-auto text-xs text-text-muted">
                  ~{path.timeline}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {path.gap.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Career Coach */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-text-primary">
          AI Career Coach
        </h2>
        <ChatInterface />
      </div>
    </div>
  );
}
