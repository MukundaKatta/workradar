"use client";

import { cn } from "@/lib/utils";

interface MatchScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function MatchScore({ score, size = "md", className }: MatchScoreProps) {
  const sizes = {
    sm: { container: "h-10 w-10", text: "text-xs", stroke: 3, radius: 16 },
    md: { container: "h-14 w-14", text: "text-sm", stroke: 3.5, radius: 22 },
    lg: { container: "h-20 w-20", text: "text-lg", stroke: 4, radius: 32 },
  };

  const s = sizes[size];
  const circumference = 2 * Math.PI * s.radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 85
      ? "text-accent"
      : score >= 70
        ? "text-primary-500"
        : score >= 50
          ? "text-warning"
          : "text-danger";

  const strokeColor =
    score >= 85
      ? "stroke-accent"
      : score >= 70
        ? "stroke-primary-500"
        : score >= 50
          ? "stroke-warning"
          : "stroke-danger";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        s.container,
        className,
      )}
    >
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r={s.radius}
          fill="none"
          strokeWidth={s.stroke}
          className="stroke-border"
        />
        <circle
          cx="40"
          cy="40"
          r={s.radius}
          fill="none"
          strokeWidth={s.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-all duration-700 ease-out", strokeColor)}
        />
      </svg>
      <span className={cn("font-bold", s.text, color)}>{score}%</span>
    </div>
  );
}
