import React from "react";

type BadgeVariant =
  | "sponsor"
  | "remote"
  | "hybrid"
  | "onsite"
  | "active"
  | "closed"
  | "expired"
  | "new"
  | "default";

interface BadgeProps {
  /** Badge variant determines icon and color */
  variant: BadgeVariant;
  /** Override the display text (defaults vary by variant) */
  label?: string;
  /** CSS class for the container */
  className?: string;
}

const VARIANT_CONFIG: Record<
  BadgeVariant,
  { label: string; bg: string; fg: string; icon: string }
> = {
  sponsor: {
    label: "Sponsors Visa",
    bg: "#dbeafe",
    fg: "#1e40af",
    icon: "\u2713",
  },
  remote: {
    label: "Remote",
    bg: "#f0fdf4",
    fg: "#166534",
    icon: "\u{1F30D}",
  },
  hybrid: {
    label: "Hybrid",
    bg: "#fef9c3",
    fg: "#854d0e",
    icon: "\u{1F3E2}",
  },
  onsite: {
    label: "On-site",
    bg: "#fef2f2",
    fg: "#991b1b",
    icon: "\u{1F4CD}",
  },
  active: {
    label: "Active",
    bg: "#dcfce7",
    fg: "#166534",
    icon: "\u25CF",
  },
  closed: {
    label: "Closed",
    bg: "#f3f4f6",
    fg: "#6b7280",
    icon: "\u25CB",
  },
  expired: {
    label: "Expired",
    bg: "#fef2f2",
    fg: "#991b1b",
    icon: "\u23F0",
  },
  new: {
    label: "New",
    bg: "#ede9fe",
    fg: "#5b21b6",
    icon: "\u2728",
  },
  default: {
    label: "",
    bg: "#f3f4f6",
    fg: "#374151",
    icon: "",
  },
};

/**
 * Status badge component for job listings and company profiles.
 * Supports predefined variants: sponsor, remote, hybrid, onsite,
 * active, closed, expired, new.
 */
export function Badge({ variant, label, className }: BadgeProps) {
  const config = VARIANT_CONFIG[variant];
  const displayLabel = label ?? config.label;

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: "18px",
        backgroundColor: config.bg,
        color: config.fg,
        whiteSpace: "nowrap",
      }}
    >
      {config.icon && <span aria-hidden="true">{config.icon}</span>}
      {displayLabel}
    </span>
  );
}
