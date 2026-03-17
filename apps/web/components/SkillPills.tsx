"use client";

import { cn } from "@/lib/utils";

export interface SkillPill {
  name: string;
  match: "exact" | "close" | "missing";
}

interface SkillPillsProps {
  skills: SkillPill[];
  max?: number;
  className?: string;
}

export function SkillPills({ skills, max = 6, className }: SkillPillsProps) {
  const visible = skills.slice(0, max);
  const remaining = skills.length - max;

  const colorMap = {
    exact: "bg-accent/15 text-accent-dark dark:text-accent-light border-accent/30",
    close: "bg-warning/15 text-warning-dark dark:text-warning-light border-warning/30",
    missing: "bg-navy-100 text-navy-500 dark:bg-navy-800 dark:text-navy-400 border-navy-200 dark:border-navy-700",
  };

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {visible.map((skill) => (
        <span
          key={skill.name}
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
            colorMap[skill.match],
          )}
        >
          {skill.name}
        </span>
      ))}
      {remaining > 0 && (
        <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-text-muted">
          +{remaining}
        </span>
      )}
    </div>
  );
}
