"use client";

import React from "react";
import { AGENTS_LIST } from "@/lib/agents-data";
import { AgentType } from "@/lib/types";
import {
  MessageSquareText,
  Search,
  Layers,
  Lightbulb,
  BrainCircuit,
  BookOpenCheck,
  Quote,
  ChartNoAxesCombined,
  Table,
  ShieldCheck,
  TrendingUp,
  Users,
  Presentation,
} from "lucide-react";

interface AgentSelectorProps {
  activeAgent: AgentType;
  onSelectAgent: (id: AgentType) => void;
}

const ICON_MAP: Record<string, any> = {
  MessageSquareText,
  Search,
  Layers,
  Lightbulb,
  BrainCircuit,
  BookOpenCheck,
  Quote,
  ChartNoAxesCombined,
  Table,
  ShieldCheck,
  TrendingUp,
  Users,
  Presentation,
};

export function AgentSelector({ activeAgent, onSelectAgent }: AgentSelectorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none]">
        {AGENTS_LIST.map((agent) => {
          const Icon = ICON_MAP[agent.icon] || MessageSquareText;
          const isActive = activeAgent === agent.id;

          return (
            <button
              key={agent.id}
              onClick={() => onSelectAgent(agent.id)}
              className={`group relative flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                  : "border border-border/70 bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"}`} />
              <span>{agent.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
