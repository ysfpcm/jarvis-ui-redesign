"use client"

import dynamic from "next/dynamic"
import { useCallback, useRef, useState } from "react"
import { resolveResponse, type JarvisResponse } from "@/lib/jarvis-data"
import { useSpeech } from "@/lib/use-speech"
import { cn } from "@/lib/utils"
import { AgentsRail } from "./agents-rail"
import { HudFrame } from "./hud-frame"
import { InfoPanel } from "./info-panel"
import { VoiceBar } from "./voice-bar"

const CoreCanvas = dynamic(() => import("./core-canvas").then((m) => m.CoreCanvas), {
  ssr: false,
})

type AssistantState = "idle" | "listening" | "processing" | "responding"

export function JarvisInterface() {
  const [state, setState] = useState<AssistantState>("idle")
  const [response, setResponse] = useState<JarvisResponse | null>(null)
  const [lastQuery, setLastQuery] = useState("")
  const timers = useRef<number[]>([])

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }

  const handleCommand = useCallback((text: string) => {
    if (!text) return
    clearTimers()
    setLastQuery(text)
    setState("processing")
    setResponse(null)
    const resolved = resolveResponse(text)
    // simulate dispatch + processing before the core slides aside
    timers.current.push(
      window.setTimeout(() => {
        setResponse(resolved)
        setState("responding")
      }, 1100),
    )
  }, [])

  const { supported, listening, interim, start, stop } = useSpeech(handleCommand)

  const toggleMic = () => {
    if (listening) {
      stop()
      setState((s) => (s === "listening" ? "idle" : s))
    } else {
      start()
      setState("listening")
    }
  }

  const busy = state === "processing"
  const responding = state === "responding"
  const intensity =
    state === "listening" ? 1 : state === "processing" ? 0.7 : state === "responding" ? 0.5 : 0.15
  // push the 3D core to the left when a response panel is on screen
  const offset = responding ? -2.4 : 0

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-background grid-bg">
      {/* 3D core layer */}
      <div className="absolute inset-0 z-0 scan-line">
        <CoreCanvas intensity={intensity} offset={offset} />
      </div>

      {/* vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, var(--background) 92%)",
        }}
      />

      <HudFrame state={state} />

      {/* status line under the core when idle/processing */}
      <div
        className={cn(
          "pointer-events-none absolute left-1/2 top-[58%] z-20 -translate-x-1/2 text-center transition-opacity duration-500",
          responding ? "opacity-0" : "opacity-100",
        )}
      >
        <div className="font-mono text-xs tracking-[0.4em] text-primary text-glow animate-flicker">
          {state === "idle" && "TAP THE MIC OR SPEAK"}
          {state === "listening" && (interim || "LISTENING…")}
          {state === "processing" && "DISPATCHING AGENTS…"}
        </div>
        {lastQuery && state === "processing" && (
          <div className="mt-2 font-mono text-[11px] text-muted-foreground">
            &ldquo;{lastQuery}&rdquo;
          </div>
        )}
      </div>

      {/* response panel slides in on the right */}
      <div
        className={cn(
          "absolute right-0 top-0 z-20 flex h-full w-full items-center justify-end p-4 pt-28 transition-all duration-700 sm:w-[58%] sm:p-8 sm:pt-28",
          responding
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-8 opacity-0",
        )}
      >
        {response && (
          <div className="h-full max-h-[70vh] w-full overflow-y-auto rounded-lg border border-primary/30 bg-background/50 p-5 backdrop-blur-md">
            <InfoPanel response={response} />
          </div>
        )}
      </div>

      {/* agents rail — always docked on the left, standby */}
      <div className="absolute left-4 top-44 z-30 hidden lg:block">
        <AgentsRail activeAgent={responding ? response?.agent : undefined} />
      </div>

      {/* bottom command bar */}
      <div className="absolute inset-x-0 bottom-8 z-30 flex justify-center px-4">
        <VoiceBar
          supported={supported}
          listening={listening}
          interim={interim}
          busy={busy}
          onToggleMic={toggleMic}
          onSubmit={handleCommand}
        />
      </div>
    </main>
  )
}
