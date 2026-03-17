"use client";

import { cn } from "@/lib/utils";

interface OnboardingStepProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export function OnboardingStep({
  title,
  description,
  children,
  className,
}: OnboardingStepProps) {
  return (
    <div className={cn("animate-fade-up space-y-6", className)}>
      <div>
        <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      </div>
      {children}
    </div>
  );
}
