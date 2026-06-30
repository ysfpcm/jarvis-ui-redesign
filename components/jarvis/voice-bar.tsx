"use client"

import { Mic, MicOff, Send } from "lucide-react"
import { useState } from "react"
import { SUGGESTIONS } from "@/lib/jarvis-data"
import { cn } from "@/lib/utils"

type VoiceBarProps = {
  supported: boolean
  listening: boolean
  interim: string
  busy: boolean
  onToggleMic: () => void
  onSubmit: (text: string) => void
}

export function VoiceBar({
  supported,
  listening,
  interim,
  busy,
  onToggleMic,
  onSubmit,
}: VoiceBarProps) {
  const [text, setText] = useState("")

  const submit = () => {
    const value = text.trim()
    if (!value) return
    onSubmit(value)
    setText("")
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSubmit(s)}
            disabled={busy}
            className="rounded-full border border-border bg-card/50 px-3 py-1 font-mono text-[10px] tracking-wide text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-40"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex w-full max-w-2xl items-center gap-2 rounded-full border border-border bg-card/70 p-1.5 pl-4 backdrop-blur-md">
        <button
          type="button"
          onClick={onToggleMic}
          disabled={!supported}
          aria-label={listening ? "Stop listening" : "Start listening"}
          className={cn(
            "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
            listening
              ? "bg-primary text-primary-foreground"
              : "border border-primary/50 text-primary hover:bg-primary/10",
            !supported && "cursor-not-allowed opacity-40",
          )}
        >
          {listening && (
            <span className="absolute inset-0 rounded-full bg-primary/40 animate-pulse-ring" />
          )}
          {supported ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </button>

        <input
          value={listening && interim ? interim : text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) submit()
          }}
          readOnly={listening}
          placeholder={
            listening
              ? "Listening…"
              : supported
                ? "Speak or type a command…"
                : "Type a command (mic unavailable in this browser)…"
          }
          className="flex-1 bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
        />

        <button
          type="button"
          onClick={submit}
          disabled={busy || !text.trim()}
          aria-label="Send command"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/50 text-primary transition-colors hover:bg-primary/10 disabled:opacity-30"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
      {!supported && (
        <p className="font-mono text-[10px] tracking-wide text-muted-foreground">
          Voice recognition needs Chrome or Edge — typing works everywhere.
        </p>
      )}
    </div>
  )
}
