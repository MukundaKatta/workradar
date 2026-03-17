import React from "react";

interface MatchScoreProps {
  /** Score value 0-100 */
  score: number;
  /** Diameter in pixels */
  size?: number;
  /** Stroke width in pixels */
  strokeWidth?: number;
  /** Optional label below the score */
  label?: string;
  /** CSS class for the container */
  className?: string;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#22c55e"; // green-500
  if (score >= 60) return "#eab308"; // yellow-500
  if (score >= 40) return "#f97316"; // orange-500
  return "#ef4444"; // red-500
}

/**
 * Circular match score indicator with animated SVG ring.
 * Displays a percentage score from 0-100 with color coding:
 * - 80+ green, 60-79 yellow, 40-59 orange, <40 red
 */
export function MatchScore({
  score,
  size = 64,
  strokeWidth = 4,
  label,
  className,
}: MatchScoreProps) {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedScore / 100) * circumference;
  const color = getScoreColor(clampedScore);

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Score arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.6s ease-out, stroke 0.3s ease",
          }}
        />
      </svg>
      <span
        style={{
          position: "relative",
          marginTop: -(size / 2 + 8),
          fontSize: size * 0.28,
          fontWeight: 700,
          color,
          lineHeight: 1,
        }}
      >
        {clampedScore}
      </span>
      {/* Spacer to push label below the circle */}
      <div style={{ height: size * 0.18 }} />
      {label && (
        <span
          style={{
            fontSize: 12,
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
