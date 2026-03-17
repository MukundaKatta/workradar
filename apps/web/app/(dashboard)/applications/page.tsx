"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, Target, Zap } from "lucide-react";
import { KanbanBoard, type KanbanCard } from "@/components/KanbanBoard";

const INITIAL_COLUMNS = [
  {
    id: "interested",
    title: "Interested",
    color: "#94a3b8",
    cards: [
      {
        id: "a1",
        company: "Stripe",
        role: "Senior Frontend Engineer",
        status: "interested",
        days_in_stage: 2,
        next_step: "Review description",
      },
      {
        id: "a2",
        company: "Vercel",
        role: "Staff Software Engineer",
        status: "interested",
        days_in_stage: 1,
      },
    ],
  },
  {
    id: "applying",
    title: "Applying",
    color: "#3b82f6",
    cards: [
      {
        id: "a3",
        company: "Datadog",
        role: "Full Stack Engineer",
        status: "applying",
        days_in_stage: 3,
        next_step: "Finish cover letter",
      },
    ],
  },
  {
    id: "applied",
    title: "Applied",
    color: "#2563eb",
    cards: [
      {
        id: "a4",
        company: "Notion",
        role: "Product Engineer",
        status: "applied",
        days_in_stage: 5,
        next_step: "Waiting for response",
      },
      {
        id: "a5",
        company: "Linear",
        role: "Frontend Engineer",
        status: "applied",
        days_in_stage: 7,
        next_step: "Follow up next week",
      },
    ],
  },
  {
    id: "screening",
    title: "Screening",
    color: "#7c3aed",
    cards: [
      {
        id: "a6",
        company: "Figma",
        role: "Senior UI Engineer",
        status: "screening",
        days_in_stage: 2,
        next_step: "Phone screen tomorrow",
      },
    ],
  },
  {
    id: "interview",
    title: "Interview",
    color: "#f59e0b",
    cards: [
      {
        id: "a7",
        company: "Shopify",
        role: "Staff Frontend Engineer",
        status: "interview",
        days_in_stage: 4,
        next_step: "System design round",
      },
    ],
  },
  {
    id: "offer",
    title: "Offer",
    color: "#10b981",
    cards: [],
  },
  {
    id: "decided",
    title: "Decided",
    color: "#64748b",
    cards: [],
  },
];

export default function ApplicationsPage() {
  const [columns, setColumns] = useState(INITIAL_COLUMNS);

  const totalApplied = columns
    .filter((c) => !["interested", "applying"].includes(c.id))
    .reduce((a, c) => a + c.cards.length, 0);
  const totalCards = columns.reduce((a, c) => a + c.cards.length, 0);
  const interviewRate =
    totalApplied > 0
      ? Math.round(
          (columns
            .filter((c) => ["screening", "interview", "offer"].includes(c.id))
            .reduce((a, c) => a + c.cards.length, 0) /
            totalApplied) *
            100,
        )
      : 0;

  const handleMoveCard = (cardId: string, fromCol: string, toCol: string) => {
    setColumns((prev) => {
      const newCols = prev.map((col) => ({ ...col, cards: [...col.cards] }));
      const fromColumn = newCols.find((c) => c.id === fromCol);
      const toColumn = newCols.find((c) => c.id === toCol);
      if (!fromColumn || !toColumn) return prev;

      const cardIdx = fromColumn.cards.findIndex((c) => c.id === cardId);
      if (cardIdx === -1) return prev;

      const [card] = fromColumn.cards.splice(cardIdx, 1);
      card.status = toCol;
      card.days_in_stage = 0;
      toColumn.cards.push(card);
      return newCols;
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Applications</h1>
        <p className="text-sm text-text-secondary">
          Track your job applications from interest to offer
        </p>
      </div>

      {/* Stats Bar */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center gap-2 text-text-muted">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs">Total Tracked</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-text-primary">
            {totalCards}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center gap-2 text-text-muted">
            <Zap className="h-4 w-4" />
            <span className="text-xs">Applied</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-text-primary">
            {totalApplied}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center gap-2 text-text-muted">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs">Response Rate</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-accent">
            {interviewRate}%
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center gap-2 text-text-muted">
            <Target className="h-4 w-4" />
            <span className="text-xs">Interview Rate</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-primary-600">
            {interviewRate}%
          </p>
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard
        columns={columns}
        onMoveCard={handleMoveCard}
        onCardClick={(card) => console.log("Clicked card:", card.id)}
      />
    </div>
  );
}
