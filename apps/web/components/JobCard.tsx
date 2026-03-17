"use client";

import { Heart, X, ArrowRight, ChevronDown, MapPin, Clock, DollarSign, Shield } from "lucide-react";
import { cn, formatSalary, timeAgo } from "@/lib/utils";
import { MatchScore } from "./MatchScore";
import { SkillPills, type SkillPill } from "./SkillPills";

export interface JobCardData {
  id: string;
  company_name: string;
  company_logo_url?: string;
  sponsors_visa: boolean;
  title: string;
  seniority: string;
  match_score: number;
  match_reason: string;
  salary_min?: number;
  salary_max?: number;
  location: string;
  remote_type: string;
  posted_at: string;
  skills: SkillPill[];
  green_flags: string[];
  red_flags: string[];
}

interface JobCardProps {
  job: JobCardData;
  onSave?: () => void;
  onDismiss?: () => void;
  onApply?: () => void;
  onClick?: () => void;
  className?: string;
}

export function JobCard({
  job,
  onSave,
  onDismiss,
  onApply,
  onClick,
  className,
}: JobCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative cursor-pointer rounded-xl border border-border bg-surface p-5 transition-all hover:border-primary-300 hover:shadow-lg dark:hover:border-primary-700",
        "animate-fade-up",
        className,
      )}
    >
      {/* Header: Company + Match Score */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-tertiary text-sm font-bold text-text-secondary">
            {job.company_logo_url ? (
              <img
                src={job.company_logo_url}
                alt={job.company_name}
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              job.company_name.slice(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text-secondary">
                {job.company_name}
              </span>
              {job.sponsors_visa && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                  <Shield className="h-3 w-3" />
                  Sponsor
                </span>
              )}
            </div>
            <h3 className="text-base font-semibold text-text-primary">
              {job.title}
            </h3>
            <span className="text-xs text-text-muted">{job.seniority}</span>
          </div>
        </div>
        <MatchScore score={job.match_score} size="md" />
      </div>

      {/* AI Match Reason */}
      <p className="mt-3 text-sm leading-relaxed text-text-secondary">
        {job.match_reason}
      </p>

      {/* Meta Row */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-text-muted">
        <span className="inline-flex items-center gap-1">
          <DollarSign className="h-3.5 w-3.5" />
          {formatSalary(job.salary_min, job.salary_max)}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {job.location}
          {job.remote_type !== "onsite" && (
            <span className="ml-0.5 rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
              {job.remote_type}
            </span>
          )}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {timeAgo(job.posted_at)}
        </span>
      </div>

      {/* Skills */}
      <SkillPills skills={job.skills} className="mt-3" />

      {/* Flags */}
      {(job.green_flags.length > 0 || job.red_flags.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {job.green_flags.map((flag) => (
            <span key={flag} className="text-accent">
              +{flag}
            </span>
          ))}
          {job.red_flags.map((flag) => (
            <span key={flag} className="text-danger">
              -{flag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave?.();
          }}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-danger/10 hover:text-danger"
        >
          <Heart className="h-4 w-4" />
          Save
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss?.();
          }}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-navy-100 dark:hover:bg-navy-800"
        >
          <X className="h-4 w-4" />
          Dismiss
        </button>
        <div className="flex-1" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onApply?.();
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-700"
        >
          Apply
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center rounded-lg px-1.5 py-1.5 text-text-muted transition-colors hover:bg-navy-100 dark:hover:bg-navy-800"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
