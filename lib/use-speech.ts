"use client"

import { useCallback, useEffect, useRef, useState } from "react"

// Minimal typing for the Web Speech API (not in standard lib DOM types)
type SpeechRecognitionResultLike = {
  isFinal: boolean
  0: { transcript: string }
}
type SpeechRecognitionEventLike = {
  resultIndex: number
  results: { length: number } & Record<number, SpeechRecognitionResultLike>
}
type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((e: SpeechRecognitionEventLike) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
}

export function useSpeech(onFinal: (text: string) => void) {
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState("")
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const onFinalRef = useRef(onFinal)
  onFinalRef.current = onFinal

  useEffect(() => {
    if (typeof window === "undefined") return
    const Ctor =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition
    if (!Ctor) return
    setSupported(true)
    const recognition = new (Ctor as new () => SpeechRecognitionLike)()
    recognition.lang = "en-US"
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onresult = (e) => {
      let interimText = ""
      let finalText = ""
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i]
        if (res.isFinal) finalText += res[0].transcript
        else interimText += res[0].transcript
      }
      if (interimText) setInterim(interimText)
      if (finalText) {
        setInterim("")
        onFinalRef.current(finalText.trim())
      }
    }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => {
      setListening(false)
      setInterim("")
    }
    recognitionRef.current = recognition
    return () => recognition.abort()
  }, [])

  const start = useCallback(() => {
    if (!recognitionRef.current) return
    try {
      setInterim("")
      recognitionRef.current.start()
      setListening(true)
    } catch {
      /* already started */
    }
  }, [])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
  }, [])

  return { supported, listening, interim, start, stop }
}
