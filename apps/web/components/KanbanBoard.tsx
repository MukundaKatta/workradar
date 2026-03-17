"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GripVertical, MoreHorizontal, Clock } from "lucide-react";

export interface KanbanCard {
  id: string;
  company: string;
  role: string;
  status: string;
  days_in_stage: number;
  next_step?: string;
  logo_url?: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  cards: KanbanCard[];
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onMoveCard?: (cardId: string, fromCol: string, toCol: string) => void;
  onCardClick?: (card: KanbanCard) => void;
}

export function KanbanBoard({ columns, onMoveCard, onCardClick }: KanbanBoardProps) {
  const [draggedCard, setDraggedCard] = useState<{
    card: KanbanCard;
    fromCol: string;
  } | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
      {columns.map((col) => (
        <div
          key={col.id}
          className={cn(
            "flex w-72 shrink-0 flex-col rounded-xl border bg-surface-secondary transition-colors",
            dragOverCol === col.id ? "border-primary-400" : "border-border",
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverCol(col.id);
          }}
          onDragLeave={() => setDragOverCol(null)}
          onDrop={() => {
            if (draggedCard && draggedCard.fromCol !== col.id) {
              onMoveCard?.(draggedCard.card.id, draggedCard.fromCol, col.id);
            }
            setDraggedCard(null);
            setDragOverCol(null);
          }}
        >
          {/* Column Header */}
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: col.color }}
            />
            <span className="text-sm font-semibold text-text-primary">
              {col.title}
            </span>
            <span className="ml-auto rounded-full bg-surface-tertiary px-2 py-0.5 text-xs font-medium text-text-muted">
              {col.cards.length}
            </span>
          </div>

          {/* Cards */}
          <div className="flex-1 space-y-2 p-3">
            {col.cards.map((card) => (
              <div
                key={card.id}
                draggable
                onDragStart={() =>
                  setDraggedCard({ card, fromCol: col.id })
                }
                onClick={() => onCardClick?.(card)}
                className="group cursor-pointer rounded-lg border border-border bg-surface p-3 transition-all hover:border-primary-300 hover:shadow-sm"
              >
                <div className="flex items-start gap-2">
                  <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {card.role}
                    </p>
                    <p className="text-xs text-text-secondary">{card.company}</p>
                  </div>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="rounded p-0.5 text-text-muted opacity-0 transition-opacity hover:bg-surface-tertiary group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[10px] text-text-muted">
                  <Clock className="h-3 w-3" />
                  <span>{card.days_in_stage}d in stage</span>
                  {card.next_step && (
                    <>
                      <span className="text-border">|</span>
                      <span className="truncate">{card.next_step}</span>
                    </>
                  )}
                </div>
              </div>
            ))}

            {col.cards.length === 0 && (
              <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-border text-xs text-text-muted">
                Drop here
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
