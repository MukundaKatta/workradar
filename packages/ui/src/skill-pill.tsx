import React from "react";

type SkillMatchLevel = "match" | "partial" | "missing";

interface SkillPillProps {
  /** The skill name to display */
  skill: string;
  /** Match level determines the color */
  level: SkillMatchLevel;
  /** CSS class for the container */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

const LEVEL_STYLES: Record<SkillMatchLevel, React.CSSProperties> = {
  match: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    borderColor: "#bbf7d0",
  },
  partial: {
    backgroundColor: "#fef9c3",
    color: "#854d0e",
    borderColor: "#fde68a",
  },
  missing: {
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    borderColor: "#e5e7eb",
  },
};

/**
 * A pill-shaped badge for displaying skills with match status.
 * - match (green): skill is a direct match
 * - partial (yellow): related or partial match
 * - missing (gray): skill not present in profile
 */
export function SkillPill({ skill, level, className, onClick }: SkillPillProps) {
  const levelStyle = LEVEL_STYLES[level];

  return (
    <span
      className={className}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 10px",
        borderRadius: 9999,
        fontSize: 13,
        fontWeight: 500,
        lineHeight: "20px",
        border: "1px solid",
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        whiteSpace: "nowrap",
        ...levelStyle,
      }}
    >
      {skill}
    </span>
  );
}
