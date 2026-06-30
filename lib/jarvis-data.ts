import type { LucideIcon } from "lucide-react"
import {
  Activity,
  CloudSun,
  Cpu,
  Globe,
  Mail,
  Newspaper,
  Radar,
  ShieldCheck,
  TrendingUp,
} from "lucide-react"

export type Agent = {
  id: string
  name: string
  role: string
  icon: LucideIcon
  status: "online" | "standby" | "syncing"
  load: number
}

export const AGENTS: Agent[] = [
  { id: "scout", name: "SCOUT", role: "Web Recon", icon: Globe, status: "online", load: 24 },
  { id: "sentry", name: "SENTRY", role: "Security", icon: ShieldCheck, status: "online", load: 12 },
  { id: "ledger", name: "LEDGER", role: "Markets", icon: TrendingUp, status: "standby", load: 0 },
  { id: "courier", name: "COURIER", role: "Comms", icon: Mail, status: "standby", load: 0 },
  { id: "oracle", name: "ORACLE", role: "Analysis", icon: Cpu, status: "syncing", load: 61 },
  { id: "pulse", name: "PULSE", role: "Telemetry", icon: Activity, status: "online", load: 38 },
]

export type Metric = { label: string; value: string; trend?: string }

export type JarvisResponse = {
  intent: string
  title: string
  summary: string
  agent: string
  icon: LucideIcon
  metrics: Metric[]
  log: string[]
}

const RESPONSES: JarvisResponse[] = [
  {
    intent: "weather",
    title: "ATMOSPHERIC REPORT",
    summary:
      "Conditions over your sector are stable. Clear skies with a light western drift; no hazardous fronts detected in the next 12 hours.",
    agent: "PULSE",
    icon: CloudSun,
    metrics: [
      { label: "TEMP", value: "21°C", trend: "+2°" },
      { label: "WIND", value: "9 km/h", trend: "W" },
      { label: "HUMIDITY", value: "54%" },
      { label: "VISIBILITY", value: "10 km" },
    ],
    log: ["Querying PULSE telemetry", "Resolving local sector grid", "Synthesizing forecast model"],
  },
  {
    intent: "market",
    title: "MARKET INTELLIGENCE",
    summary:
      "Equities trending upward across primary indices. Tech sector leading gains; volatility within nominal thresholds.",
    agent: "LEDGER",
    icon: TrendingUp,
    metrics: [
      { label: "INDEX", value: "5,841", trend: "+0.9%" },
      { label: "VOL", value: "Low" },
      { label: "TECH", value: "+1.7%", trend: "↑" },
      { label: "RISK", value: "Nominal" },
    ],
    log: ["Waking LEDGER agent", "Pulling live tickers", "Cross-referencing sentiment feed"],
  },
  {
    intent: "news",
    title: "GLOBAL BRIEFING",
    summary:
      "Three priority items flagged across monitored channels. No threats to your interests detected. Full digest compiled.",
    agent: "SCOUT",
    icon: Newspaper,
    metrics: [
      { label: "SOURCES", value: "1,204" },
      { label: "FLAGGED", value: "3" },
      { label: "RELEVANCE", value: "92%" },
      { label: "UPDATED", value: "now" },
    ],
    log: ["Dispatching SCOUT", "Scanning 1,204 sources", "Ranking by relevance"],
  },
  {
    intent: "security",
    title: "PERIMETER STATUS",
    summary:
      "All systems secure. No intrusion attempts in the last cycle. Encryption integrity verified across all nodes.",
    agent: "SENTRY",
    icon: ShieldCheck,
    metrics: [
      { label: "THREATS", value: "0" },
      { label: "NODES", value: "18/18" },
      { label: "ENCRYPTION", value: "AES-256" },
      { label: "UPTIME", value: "99.99%" },
    ],
    log: ["Engaging SENTRY", "Auditing node integrity", "Verifying encryption keys"],
  },
  {
    intent: "system",
    title: "SYSTEM DIAGNOSTICS",
    summary:
      "Core operating at optimal capacity. Neural threads balanced, memory stable. All subsystems reporting green.",
    agent: "ORACLE",
    icon: Cpu,
    metrics: [
      { label: "CPU", value: "34%" },
      { label: "MEMORY", value: "6.2 GB" },
      { label: "THREADS", value: "128" },
      { label: "LATENCY", value: "12 ms" },
    ],
    log: ["Spinning up ORACLE", "Sampling subsystem load", "Compiling diagnostics"],
  },
]

const FALLBACK: JarvisResponse = {
  intent: "scan",
  title: "DEEP SCAN COMPLETE",
  summary:
    "I have processed your request and dispatched the relevant agents. Here is everything I could surface across the network.",
  agent: "ORACLE",
  icon: Radar,
  metrics: [
    { label: "MATCHES", value: "47" },
    { label: "CONFIDENCE", value: "88%" },
    { label: "AGENTS", value: "3" },
    { label: "TIME", value: "0.4 s" },
  ],
  log: ["Parsing intent", "Routing to best agent", "Aggregating results"],
}

export function resolveResponse(transcript: string): JarvisResponse {
  const t = transcript.toLowerCase()
  if (/weather|temperature|forecast|rain|cold|hot/.test(t)) return byIntent("weather")
  if (/market|stock|invest|price|crypto|trade/.test(t)) return byIntent("market")
  if (/news|happening|headline|world|brief/.test(t)) return byIntent("news")
  if (/secur|threat|safe|protect|breach|firewall/.test(t)) return byIntent("security")
  if (/system|diagnostic|status|cpu|memory|performance/.test(t)) return byIntent("system")
  return FALLBACK
}

function byIntent(intent: string): JarvisResponse {
  return RESPONSES.find((r) => r.intent === intent) ?? FALLBACK
}

export const SUGGESTIONS = [
  "What's the weather?",
  "Give me a market update",
  "Any news I should know?",
  "Run a security check",
  "System diagnostics",
]
