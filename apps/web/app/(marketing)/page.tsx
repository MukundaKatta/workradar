"use client";

import Link from "next/link";
import {
  Radio,
  Sparkles,
  Shield,
  TrendingUp,
  Zap,
  Target,
  BarChart3,
  Globe,
  Users,
  ArrowRight,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-Powered Matching",
    description:
      "Our AI analyzes your skills, experience, and preferences to surface jobs you'd actually want.",
  },
  {
    icon: Shield,
    title: "Visa Intelligence",
    description:
      "Real H-1B filing data and sponsorship history so you never waste time on dead ends.",
  },
  {
    icon: Radio,
    title: "Always-On Radar",
    description:
      "Set up custom radars that continuously scan and alert you to new opportunities.",
  },
  {
    icon: TrendingUp,
    title: "Career Insights",
    description:
      "AI displacement risk scores, skill gap analysis, and personalized reskilling paths.",
  },
  {
    icon: Target,
    title: "Smart Application Tracking",
    description:
      "Kanban-style tracker with AI-powered interview prep and follow-up reminders.",
  },
  {
    icon: BarChart3,
    title: "Market Intelligence",
    description:
      "Real-time salary data, demand trends, and company culture insights.",
  },
];

const BUILT_FOR = [
  {
    title: "H-1B & Visa Holders",
    description:
      "Find companies that actually sponsor. Track filing history, approval rates, and timelines.",
    icon: Globe,
  },
  {
    title: "Career Changers",
    description:
      "Discover roles that value your transferable skills. Get personalized reskilling recommendations.",
    icon: Zap,
  },
  {
    title: "Passive Candidates",
    description:
      "Let the radar do the work. Get notified only when something truly exceptional appears.",
    icon: Radio,
  },
  {
    title: "International Talent",
    description:
      "Navigate work authorization complexities with built-in visa timeline tracking.",
    icon: Users,
  },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32 lg:py-40">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                <Zap className="h-4 w-4" />
                AI-Powered Job Discovery
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-6 text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl text-balance"
            >
              Stop searching.{" "}
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Start discovering.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg text-text-secondary sm:text-xl"
            >
              WorkRadar uses AI to match you with opportunities that fit your
              skills, goals, and preferences — including visa sponsorship
              intelligence that others miss.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-500/30"
              >
                Start Your Free Radar
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3.5 text-base font-semibold text-text-secondary transition-colors hover:bg-surface-tertiary"
              >
                See How It Works
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border bg-surface-secondary py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-text-primary">
              How It Works
            </h2>
            <p className="mt-3 text-text-secondary">
              Three simple steps to smarter job discovery
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Tell Us About You",
                description:
                  "Share your skills, experience, preferences, and deal breakers. Upload your resume or fill in manually.",
              },
              {
                step: "02",
                title: "Set Your Radar",
                description:
                  "Configure custom job radars with your target roles, companies, salary, and visa requirements.",
              },
              {
                step: "03",
                title: "Discover & Apply",
                description:
                  "Get AI-matched opportunities delivered to your feed. See match scores, skill gaps, and red/green flags.",
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary text-xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-text-primary">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-text-secondary">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-text-primary">
              Everything You Need to Land the Right Role
            </h2>
            <p className="mt-3 text-text-secondary">
              Powered by AI. Built for modern job seekers.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border bg-surface p-6 transition-all hover:border-primary-300 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-text-primary">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built For Section */}
      <section className="border-t border-border bg-surface-secondary py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-text-primary">
              Built for People Like You
            </h2>
            <p className="mt-3 text-text-secondary">
              Whether you&apos;re actively searching or passively exploring
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {BUILT_FOR.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-surface p-6 transition-all hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-text-secondary">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-2xl gradient-primary p-12 text-white">
            <Radio className="mx-auto h-12 w-12 animate-radar-pulse" />
            <h2 className="mt-6 text-3xl font-bold">
              Ready to Discover Your Next Role?
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Join thousands of professionals who stopped searching and started
              discovering.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-primary-700 shadow-lg transition-all hover:shadow-xl"
            >
              Start Your Free Radar
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
