import type { LucideIcon } from "lucide-react"
import {
  Activity,
  CloudSun,
  Cpu,
  Globe,
  Home,
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

export type Metric = { label: string; value: string; trend?: string; status?: "ok" | "warn" | "crit" }

export type MetricGroup = { title: string; icon: LucideIcon; metrics: Metric[] }

export type LogLevel = "ok" | "info" | "warn" | "err"

export type SystemLogEntry = { time: string; level: LogLevel; msg: string }

export type JarvisResponse = {
  intent: string
  title: string
  summary: string
  agent: string
  icon: LucideIcon
  metrics: Metric[]
  log: string[]
  /** optional grouped telemetry panels (used by the status check) */
  groups?: MetricGroup[]
  /** optional raw system log stream (used by the status check) */
  systemLog?: SystemLogEntry[]
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
  {
    intent: "status",
    title: "FULL STATUS CHECK",
    summary:
      "Complete situational report compiled. Home environment nominal, all machine subsystems within safe thermal limits, and no anomalies in the system log. Everything is okay.",
    agent: "PULSE",
    icon: Activity,
    metrics: [],
    groups: [
      {
        title: "HOME ENVIRONMENT",
        icon: Home,
        metrics: [
          { label: "INDOOR TEMP", value: "21.4°C", trend: "stable", status: "ok" },
          { label: "OUTDOOR", value: "14°C", trend: "clear", status: "ok" },
          { label: "WEATHER", value: "Clear", trend: "night", status: "ok" },
          { label: "HUMIDITY", value: "47%", status: "ok" },
          { label: "DOORS", value: "Locked", status: "ok" },
          { label: "LIGHTS", value: "3 on", status: "ok" },
          { label: "ENERGY", value: "0.8 kW", trend: "-12%", status: "ok" },
          { label: "AIR QTY", value: "Good", status: "ok" },
        ],
      },
      {
        title: "COMPUTE / MACHINE OPS",
        icon: Cpu,
        metrics: [
          { label: "CPU LOAD", value: "34%", trend: "8 cores", status: "ok" },
          { label: "CPU TEMP", value: "52°C", status: "ok" },
          { label: "GPU LOAD", value: "61%", trend: "↑", status: "warn" },
          { label: "GPU TEMP", value: "71°C", status: "warn" },
          { label: "RAM", value: "18.2 / 32 GB", trend: "57%", status: "ok" },
          { label: "VRAM", value: "9.1 / 12 GB", status: "warn" },
          { label: "FAN — CPU", value: "1240 RPM", status: "ok" },
          { label: "FAN — GPU", value: "1820 RPM", status: "warn" },
          { label: "DISK", value: "412 GB free", status: "ok" },
          { label: "NET I/O", value: "24 Mb/s", status: "ok" },
          { label: "PWR DRAW", value: "246 W", status: "ok" },
          { label: "UPTIME", value: "4d 06h", status: "ok" },
        ],
      },
    ],
    systemLog: [
      { time: "23:41:02", level: "ok", msg: "Boot sequence verified — all services online" },
      { time: "23:41:04", level: "info", msg: "PULSE telemetry stream connected" },
      { time: "23:52:18", level: "ok", msg: "Home automation handshake successful" },
      { time: "00:03:55", level: "warn", msg: "GPU thermals elevated — fan curve adjusted" },
      { time: "00:14:09", level: "info", msg: "SCOUT completed scheduled web sweep" },
      { time: "00:27:31", level: "ok", msg: "Backup snapshot written to cold storage" },
      { time: "00:38:47", level: "info", msg: "Activity: front door unlocked → re-locked (2m)" },
      { time: "00:51:12", level: "ok", msg: "All subsystems nominal — status check passed" },
    ],
    log: ["Engaging PULSE", "Polling home sensors", "Reading machine telemetry", "Auditing system log"],
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
  // "status check" / "everything okay" => the full home + machine + log report
  if (/status check|status report|full status|everything (ok|okay|good|alright)|how('s| is) everything|sit ?rep|give me a report|run a check/.test(t))
    return byIntent("status")
  if (/weather|temperature|forecast|rain|cold|hot/.test(t)) return byIntent("weather")
  if (/market|stock|invest|price|crypto|trade/.test(t)) return byIntent("market")
  if (/news|happening|headline|world|brief/.test(t)) return byIntent("news")
  if (/secur|threat|safe|protect|breach|firewall/.test(t)) return byIntent("security")
  if (/gpu|fan|ram|thermal|temp/.test(t)) return byIntent("status")
  if (/system|diagnostic|status|cpu|memory|performance/.test(t)) return byIntent("system")
  return FALLBACK
}

function byIntent(intent: string): JarvisResponse {
  return RESPONSES.find((r) => r.intent === intent) ?? FALLBACK
}

export const SUGGESTIONS = [
  "Status check",
  "What's the weather?",
  "Give me a market update",
  "Any news I should know?",
  "Run a security check",
  "System diagnostics",
]
