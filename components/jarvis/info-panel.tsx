"use client"

import { useEffect, useState } from "react"
import type { JarvisResponse } from "@/lib/jarvis-data"

export function InfoPanel({ response }: { response: JarvisResponse }) {
  const Icon = response.icon
  const [typed, setTyped] = useState("")

  // typewriter effect for the summary
  useEffect(() => {
    setTyped("")
    let i = 0
    const id = window.setInterval(() => {
      i += 2
      setTyped(response.summary.slice(0, i))
      if (i >= response.summary.length) window.clearInterval(id)
    }, 16)
    return () => window.clearInterval(id)
  }, [response])

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded border border-primary/60 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-mono text-sm tracking-[0.25em] text-primary text-glow">{response.title}</h2>
          <p className="font-mono text-[10px] tracking-widest text-muted-foreground">
            ROUTED VIA {response.agent}
          </p>
        </div>
      </div>

      <div className="relative rounded-md border border-border bg-card/60 p-4 backdrop-blur-sm">
        <span className="absolute -top-px left-4 h-px w-10 bg-primary" />
        <p className="font-sans text-sm leading-relaxed text-foreground/90">
          {typed}
          <span className="ml-0.5 inline-block h-4 w-1.5 -translate-y-0.5 animate-pulse bg-primary align-middle" />
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {response.metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-md border border-border bg-card/40 p-3 backdrop-blur-sm"
          >
            <div className="font-mono text-[9px] tracking-widest text-muted-foreground">{m.label}</div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono text-lg text-foreground text-glow">{m.value}</span>
              {m.trend && <span className="font-mono text-[10px] text-primary">{m.trend}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto rounded-md border border-border bg-card/30 p-3">
        <div className="mb-2 font-mono text-[9px] tracking-widest text-muted-foreground">
          EXECUTION LOG
        </div>
        <ul className="flex flex-col gap-1">
          {response.log.map((line, i) => (
            <li key={i} className="flex items-center gap-2 font-mono text-[11px] text-foreground/70">
              <span className="text-primary">›</span>
              {line}
              <span className="ml-auto text-primary/70">OK</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
