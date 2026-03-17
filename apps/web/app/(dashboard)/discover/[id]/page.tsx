"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Heart,
  Building2,
  Users,
  TrendingUp,
  Shield,
  Star,
  MapPin,
  DollarSign,
  Calendar,
  Briefcase,
} from "lucide-react";
import { MatchScore } from "@/components/MatchScore";
import { SkillPills, type SkillPill } from "@/components/SkillPills";
import { formatSalary } from "@/lib/utils";

// Mock data
const MOCK_JOB = {
  id: "1",
  title: "Senior Frontend Engineer",
  company: {
    name: "Stripe",
    logo_url: undefined as string | undefined,
    size: "1000-5000",
    industry: "Fintech",
    rating: 4.5,
    tech_stack: ["React", "TypeScript", "Ruby", "Go", "AWS"],
    h1b_filings: 342,
  },
  seniority: "Senior",
  match_score: 94,
  match_reason:
    "Strong React/TypeScript match with your 5+ years experience. Stripe's engineering culture aligns with your preference for technical depth and innovation.",
  salary_min: 180000,
  salary_max: 250000,
  location: "San Francisco, CA",
  remote_type: "Hybrid",
  posted_at: "2026-03-14",
  sponsors_visa: true,
  description: `We're looking for a Senior Frontend Engineer to join our Dashboard team. You'll work on building the next generation of Stripe's merchant-facing tools.

**What you'll do:**
- Build and maintain complex React applications used by millions of businesses
- Collaborate with designers and product managers to ship delightful user experiences
- Mentor junior engineers and contribute to frontend architecture decisions
- Improve performance, accessibility, and developer experience

**What we're looking for:**
- 5+ years of frontend development experience
- Deep expertise in React, TypeScript, and modern CSS
- Experience with complex state management and data fetching patterns
- Strong understanding of web performance optimization
- Excellent communication skills and ability to work cross-functionally

**Nice to have:**
- Experience with GraphQL
- Contributions to open source projects
- Experience with design systems
- Knowledge of accessibility standards (WCAG)`,
  skills: [
    { name: "React", match: "exact" as const },
    { name: "TypeScript", match: "exact" as const },
    { name: "Next.js", match: "exact" as const },
    { name: "GraphQL", match: "close" as const },
    { name: "Ruby", match: "missing" as const },
    { name: "CSS", match: "exact" as const },
    { name: "Node.js", match: "exact" as const },
    { name: "AWS", match: "close" as const },
  ],
  why_matches: [
    "Your React + TypeScript expertise directly matches their core requirements",
    "5+ years of experience aligns with the senior level expectations",
    "Your preference for hybrid work matches their policy",
    "Fintech experience is a bonus based on your industry preferences",
  ],
  skills_gap: [
    { skill: "GraphQL", level: 60, suggestion: "Take a GraphQL course to strengthen this area" },
    { skill: "Ruby", level: 20, suggestion: "Basic Ruby knowledge would be helpful but not required" },
  ],
  similar_jobs: [
    { id: "5", title: "Senior UI Engineer", company: "Plaid", match: 89 },
    { id: "6", title: "Frontend Lead", company: "Square", match: 86 },
    { id: "7", title: "Staff Frontend Engineer", company: "Coinbase", match: 84 },
  ],
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const job = MOCK_JOB; // In prod, fetch by params.id

  return (
    <div className="mx-auto max-w-3xl">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Discover
      </button>

      {/* Header */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-surface-tertiary text-lg font-bold text-text-secondary">
              {job.company.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-secondary">
                  {job.company.name}
                </span>
                {job.sponsors_visa && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                    <Shield className="h-3 w-3" />
                    Visa Sponsor
                  </span>
                )}
              </div>
              <h1 className="mt-1 text-xl font-bold text-text-primary">
                {job.title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-text-muted">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.location} ({job.remote_type})
                </span>
                <span className="inline-flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  {formatSalary(job.salary_min, job.salary_max)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Posted {job.posted_at}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {job.seniority}
                </span>
              </div>
            </div>
          </div>
          <MatchScore score={job.match_score} size="lg" />
        </div>

        <p className="mt-4 text-sm leading-relaxed text-text-secondary">
          {job.match_reason}
        </p>

        <div className="mt-4 flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700">
            Apply Now
            <ExternalLink className="h-4 w-4" />
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-tertiary">
            <Heart className="h-4 w-4" />
            Save
          </button>
        </div>
      </div>

      {/* Company Info */}
      <div className="mt-4 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">
          About {job.company.name}
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-surface-secondary p-3 text-center">
            <Building2 className="mx-auto h-5 w-5 text-text-muted" />
            <p className="mt-1 text-sm font-medium text-text-primary">
              {job.company.size}
            </p>
            <p className="text-xs text-text-muted">Employees</p>
          </div>
          <div className="rounded-lg bg-surface-secondary p-3 text-center">
            <TrendingUp className="mx-auto h-5 w-5 text-text-muted" />
            <p className="mt-1 text-sm font-medium text-text-primary">
              {job.company.industry}
            </p>
            <p className="text-xs text-text-muted">Industry</p>
          </div>
          <div className="rounded-lg bg-surface-secondary p-3 text-center">
            <Star className="mx-auto h-5 w-5 text-warning" />
            <p className="mt-1 text-sm font-medium text-text-primary">
              {job.company.rating}
            </p>
            <p className="text-xs text-text-muted">Rating</p>
          </div>
          <div className="rounded-lg bg-surface-secondary p-3 text-center">
            <Shield className="mx-auto h-5 w-5 text-primary-500" />
            <p className="mt-1 text-sm font-medium text-text-primary">
              {job.company.h1b_filings}
            </p>
            <p className="text-xs text-text-muted">H-1B Filings</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs font-medium text-text-muted mb-2">Tech Stack</p>
          <div className="flex flex-wrap gap-1.5">
            {job.company.tech_stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-surface-tertiary px-2.5 py-0.5 text-xs font-medium text-text-secondary"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Full Description */}
      <div className="mt-4 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">
          Job Description
        </h2>
        <div className="prose prose-sm mt-4 max-w-none text-text-secondary dark:prose-invert">
          {job.description.split("\n").map((line, i) => {
            if (line.startsWith("**") && line.endsWith("**")) {
              return (
                <h3
                  key={i}
                  className="mt-4 text-sm font-semibold text-text-primary"
                >
                  {line.replace(/\*\*/g, "")}
                </h3>
              );
            }
            if (line.startsWith("- ")) {
              return (
                <li key={i} className="ml-4 text-sm">
                  {line.slice(2)}
                </li>
              );
            }
            if (line.trim() === "") return <br key={i} />;
            return (
              <p key={i} className="text-sm">
                {line}
              </p>
            );
          })}
        </div>
      </div>

      {/* Why This Matches */}
      <div className="mt-4 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">
          Why This Matches You
        </h2>
        <ul className="mt-3 space-y-2">
          {job.why_matches.map((reason, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
              <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-accent/15 text-center text-xs font-bold text-accent leading-5">
                {i + 1}
              </span>
              {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* Skills & Gap Analysis */}
      <div className="mt-4 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">
          Skills Analysis
        </h2>
        <SkillPills skills={job.skills} max={10} className="mt-3" />

        {job.skills_gap.length > 0 && (
          <div className="mt-4 space-y-3">
            <p className="text-sm font-medium text-text-primary">Skills to Develop</p>
            {job.skills_gap.map((gap) => (
              <div key={gap.skill}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">{gap.skill}</span>
                  <span className="text-text-muted">{gap.level}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-surface-tertiary">
                  <div
                    className="h-full rounded-full bg-warning transition-all"
                    style={{ width: `${gap.level}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-text-muted">{gap.suggestion}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Similar Jobs */}
      <div className="mt-4 mb-8 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">
          Similar Jobs
        </h2>
        <div className="mt-3 space-y-2">
          {job.similar_jobs.map((sj) => (
            <a
              key={sj.id}
              href={`/discover/${sj.id}`}
              className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-surface-secondary"
            >
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {sj.title}
                </p>
                <p className="text-xs text-text-muted">{sj.company}</p>
              </div>
              <MatchScore score={sj.match} size="sm" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
