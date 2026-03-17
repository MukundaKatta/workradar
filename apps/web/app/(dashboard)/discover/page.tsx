"use client";

import { useState, useEffect, useCallback } from "react";
import { Radio, Loader2, Filter, SlidersHorizontal } from "lucide-react";
import { JobCard, type JobCardData } from "@/components/JobCard";
import { useDiscoverStore } from "@/lib/store";

// Mock data for initial development
const MOCK_JOBS: JobCardData[] = [
  {
    id: "1",
    company_name: "Stripe",
    company_logo_url: undefined,
    sponsors_visa: true,
    title: "Senior Frontend Engineer",
    seniority: "Senior",
    match_score: 94,
    match_reason:
      "Strong React/TypeScript match with your 5+ years experience. Stripe's engineering culture aligns with your preference for technical depth.",
    salary_min: 180000,
    salary_max: 250000,
    location: "San Francisco, CA",
    remote_type: "hybrid",
    posted_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    skills: [
      { name: "React", match: "exact" },
      { name: "TypeScript", match: "exact" },
      { name: "Next.js", match: "exact" },
      { name: "GraphQL", match: "close" },
      { name: "Ruby", match: "missing" },
    ],
    green_flags: ["Great eng culture", "Visa sponsor"],
    red_flags: [],
  },
  {
    id: "2",
    company_name: "Vercel",
    company_logo_url: undefined,
    sponsors_visa: true,
    title: "Staff Software Engineer",
    seniority: "Staff",
    match_score: 91,
    match_reason:
      "Your Next.js expertise is a perfect fit. Remote-first aligns with your preferences, and they actively sponsor H-1B.",
    salary_min: 200000,
    salary_max: 280000,
    location: "Remote",
    remote_type: "remote",
    posted_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    skills: [
      { name: "Next.js", match: "exact" },
      { name: "React", match: "exact" },
      { name: "Node.js", match: "exact" },
      { name: "Rust", match: "missing" },
      { name: "Go", match: "close" },
    ],
    green_flags: ["Remote-first", "Open source"],
    red_flags: [],
  },
  {
    id: "3",
    company_name: "Datadog",
    company_logo_url: undefined,
    sponsors_visa: true,
    title: "Full Stack Engineer",
    seniority: "Senior",
    match_score: 87,
    match_reason:
      "Your backend + frontend skills match well. Monitoring/observability is a growing field with strong compensation.",
    salary_min: 170000,
    salary_max: 230000,
    location: "New York, NY",
    remote_type: "hybrid",
    posted_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    skills: [
      { name: "React", match: "exact" },
      { name: "Python", match: "exact" },
      { name: "Go", match: "close" },
      { name: "Kubernetes", match: "close" },
      { name: "Terraform", match: "missing" },
    ],
    green_flags: ["Strong growth", "Good benefits"],
    red_flags: ["On-call rotation"],
  },
  {
    id: "4",
    company_name: "Notion",
    company_logo_url: undefined,
    sponsors_visa: false,
    title: "Product Engineer",
    seniority: "Mid Level",
    match_score: 82,
    match_reason:
      "Product-minded engineering role that leverages your UI skills. Collaborative culture matches your preferences.",
    salary_min: 150000,
    salary_max: 200000,
    location: "San Francisco, CA",
    remote_type: "hybrid",
    posted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    skills: [
      { name: "React", match: "exact" },
      { name: "TypeScript", match: "exact" },
      { name: "CSS", match: "exact" },
      { name: "Kotlin", match: "missing" },
    ],
    green_flags: ["Great product", "Inclusive culture"],
    red_flags: ["No visa sponsor"],
  },
];

export default function DiscoverPage() {
  const [jobs, setJobs] = useState<JobCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { setSelectedJobId } = useDiscoverStore();

  // Initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setJobs(MOCK_JOBS);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Infinite scroll
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (
        target.scrollHeight - target.scrollTop <= target.clientHeight + 200 &&
        !loadingMore
      ) {
        setLoadingMore(true);
        setTimeout(() => {
          setJobs((prev) => [...prev, ...MOCK_JOBS.map((j) => ({ ...j, id: j.id + "-" + Date.now() }))]);
          setLoadingMore(false);
        }, 600);
      }
    },
    [loadingMore],
  );

  return (
    <div className="mx-auto max-w-2xl" onScroll={handleScroll}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Discover</h1>
          <p className="text-sm text-text-secondary">
            AI-matched opportunities for you
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface">
            <SlidersHorizontal className="h-4 w-4" />
            Sort
          </button>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 animate-pulse rounded-lg bg-surface-tertiary" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-surface-tertiary" />
                  <div className="h-5 w-48 animate-pulse rounded bg-surface-tertiary" />
                  <div className="h-3 w-20 animate-pulse rounded bg-surface-tertiary" />
                </div>
                <div className="h-14 w-14 animate-pulse rounded-full bg-surface-tertiary" />
              </div>
              <div className="mt-4 h-10 animate-pulse rounded bg-surface-tertiary" />
              <div className="mt-3 flex gap-2">
                {[1, 2, 3, 4].map((j) => (
                  <div
                    key={j}
                    className="h-6 w-16 animate-pulse rounded-full bg-surface-tertiary"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Job Cards */}
      {!loading && jobs.length > 0 && (
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onClick={() => setSelectedJobId(job.id)}
              onSave={() => console.log("Save", job.id)}
              onDismiss={() =>
                setJobs((prev) => prev.filter((j) => j.id !== job.id))
              }
              onApply={() => console.log("Apply", job.id)}
            />
          ))}

          {loadingMore && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && jobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/30">
            <Radio className="h-10 w-10 text-primary-500 animate-radar-pulse" />
          </div>
          <h3 className="mt-6 text-lg font-semibold text-text-primary">
            Your radar is scanning...
          </h3>
          <p className="mt-2 max-w-sm text-sm text-text-secondary">
            We&apos;re analyzing thousands of opportunities to find your perfect
            matches. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
