"use client"

import { AGENTS } from "@/lib/jarvis-data"
import { cn } from "@/lib/utils"

const STATUS_LABEL: Record<string, string> = {
  online: "ONLINE",
  standby: "STANDBY",
  syncing: "SYNCING",
}

export function AgentsRail({ activeAgent }: { activeAgent?: string }) {
  return (
    <aside className="flex w-full flex-col gap-2 sm:w-56" aria-label="Standby agents">
      <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-muted-foreground">
        <span>AGENTS</span>
        <span className="text-primary">{AGENTS.filter((a) => a.status === "online").length} ACTIVE</span>
      </div>
      <ul className="flex flex-col gap-1.5">
        {AGENTS.map((agent) => {
          const Icon = agent.icon
          const active = activeAgent === agent.name
          return (
            <li key={agent.id}>
              <div
                className={cn(
                  "group relative flex items-center gap-3 overflow-hidden rounded-md border bg-card/60 px-3 py-2 backdrop-blur-sm transition-colors",
                  active ? "border-primary/70 bg-primary/10" : "border-border hover:border-primary/40",
                )}
              >
                {active && <span className="absolute inset-y-0 left-0 w-0.5 bg-primary" />}
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded border",
                    active ? "border-primary text-primary" : "border-border text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs tracking-wider text-foreground">{agent.name}</span>
                    <span
                      className={cn(
                        "flex items-center gap-1 font-mono text-[9px] tracking-widest",
                        agent.status === "online" && "text-primary",
                        agent.status === "syncing" && "text-[color:var(--color-alert)]",
                        agent.status === "standby" && "text-muted-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          agent.status === "online" && "bg-primary",
                          agent.status === "syncing" && "animate-pulse bg-[color:var(--color-alert)]",
                          agent.status === "standby" && "bg-muted-foreground/50",
                        )}
                      />
                      {STATUS_LABEL[agent.status]}
                    </span>
                  </div>
                  <div className="truncate font-mono text-[10px] text-muted-foreground">{agent.role}</div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
