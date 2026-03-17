"use client";

import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with AI-powered job discovery",
    features: [
      "1 active radar",
      "10 AI-matched jobs per week",
      "Basic match scoring",
      "Application tracker (up to 20)",
      "Community support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For serious job seekers who want every advantage",
    features: [
      "Unlimited radars",
      "Unlimited AI-matched jobs",
      "Advanced match scoring with reasons",
      "Visa sponsorship intelligence",
      "Unlimited application tracking",
      "AI Career Coach chat",
      "Skill gap analysis",
      "AI displacement risk score",
      "Reskilling recommendations",
      "Interview prep AI",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$99",
    period: "/month",
    description: "For recruiters and career coaches managing multiple seekers",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Shared radar configurations",
      "Team analytics dashboard",
      "Candidate pipeline management",
      "Custom integrations",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text-primary">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            Start free. Upgrade when you&apos;re ready to supercharge your job search.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-2xl border p-8 transition-all",
                plan.highlighted
                  ? "border-primary-500 bg-surface shadow-xl shadow-primary-500/10 scale-105"
                  : "border-border bg-surface hover:border-primary-300 hover:shadow-lg",
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-600 px-4 py-1 text-xs font-semibold text-white">
                    <Zap className="h-3 w-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-text-primary">
                  {plan.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-text-primary">
                    {plan.price}
                  </span>
                  <span className="text-text-muted">{plan.period}</span>
                </div>
                <p className="mt-3 text-sm text-text-secondary">
                  {plan.description}
                </p>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-text-secondary"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={cn(
                  "mt-8 block w-full rounded-lg py-3 text-center text-sm font-semibold transition-colors",
                  plan.highlighted
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "border border-border text-text-primary hover:bg-surface-tertiary",
                )}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ-like section */}
        <div className="mt-20 text-center">
          <p className="text-sm text-text-muted">
            All plans include a 14-day free trial. No credit card required.
            Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
