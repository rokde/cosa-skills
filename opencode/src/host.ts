/**
 * The host addendum.
 *
 * Cosa's agent bodies are written against Claude Code: they say "the Agent
 * tool", they say `Skill: cosa:protocollo`. Neither name exists here. Rather
 * than fork the agent files per host — which would put the doctrine in two
 * places and guarantee they drift — the bodies stay untouched and this text is
 * appended, naming the local verb for each. `skills/consigliere/references/
 * hosts.md` is the prose version of the same idea.
 */

import type { Famiglia } from "./roster.ts"
import { MCP_NAME, type Search } from "./search.ts"

const SKILL_NOTE = [
  "- **Loading a doctrine.** Use the `skill` tool with the bare skill name.",
  "  Cosa's own text writes these as `cosa:<name>` (e.g. `cosa:protocollo`);",
  "  the `cosa:` prefix is a Claude Code plugin namespace and does not exist",
  "  here. Drop it: `protocollo`, `famiglia-codice`, `consigliere`.",
].join("\n")

function dispatchNote(subagents: string[]) {
  if (subagents.length === 0) {
    return [
      "- **Dispatching.** You dispatch no one. You have no `task` tool, by",
      "  design — your Verdetto is the end of your chain.",
    ].join("\n")
  }
  return [
    "- **Dispatching.** Where Cosa says *the Agent tool*, use the `task` tool",
    "  with `subagent_type: <name>` and `description` + `prompt`. Keep it in",
    "  the foreground (`background` unset) — you need the result before you",
    "  can continue. Subagents you may dispatch:",
    ...subagents.map((name) => `  - \`${name}\``),
  ].join("\n")
}

export function agentAddendum(input: {
  subagents: string[]
  /** Whether this agent's own definition grants search *and* the host has it. */
  webSearch: boolean
  /** Whether the agent's definition asked for search at all. */
  wantsWebSearch: boolean
  search: Search
}): string {
  const lines = [
    "",
    "---",
    "",
    "## Host: opencode",
    "",
    "The doctrine above is host-neutral; these are the local names for it.",
    "",
    dispatchNote(input.subagents),
    SKILL_NOTE,
  ]

  if (input.wantsWebSearch) lines.push(searchNote(input.webSearch, input.search))

  lines.push("")
  return lines.join("\n")
}

/**
 * Named explicitly because the tool is not called what the doctrine calls it.
 * An agent told only "you can search" will look for `WebSearch`, fail to find
 * it, and quietly proceed on recall — which is the single failure this whole
 * search path exists to prevent.
 */
function searchNote(available: boolean, search: Search): string {
  if (!available) {
    return [
      "- **No web search.** This host has none configured, and the doctrine's",
      "  research steps cannot be carried out by recall. You have `webfetch`",
      "  (fetch a URL you already know) and nothing else. Do not present",
      "  recalled knowledge as researched evidence — name what you could not",
      "  verify, in the Rapporto, and let it count against the verdict.",
    ].join("\n")
  }

  if (search.mode === "builtin") {
    return [
      "- **Web search.** Where Cosa says *the WebSearch tool*, use opencode's",
      "  `websearch` tool. `webfetch` retrieves a specific URL.",
    ].join("\n")
  }

  const lines = [
    `- **Web search.** ${search.label}, served over MCP. Where Cosa says *the`,
    `  WebSearch tool*, use the tools prefixed \`${MCP_NAME}_\` (e.g.`,
    `  \`${MCP_NAME}_web_search_exa\`) — there is no tool literally named`,
    "  `WebSearch` here. `webfetch` retrieves a specific URL.",
  ]

  if (search.keyless) {
    lines.push(
      "  The search runs on an unauthenticated quota and can fail or return",
      "  thin results. A failed search is a finding: report it as an unverified",
      "  claim rather than filling the gap from memory.",
    )
  }

  return lines.join("\n")
}

export function consigliereAddendum(input: {
  famiglie: Famiglia[]
  omitted: Famiglia[]
  search: Search
}): string {
  const registered = input.famiglie.map(
    (f) => `  - **${title(f.id)}** — Capo \`${f.capo}\`, Revisore \`${f.revisore}\``,
  )

  const lines = [
    "",
    "---",
    "",
    "## Host: opencode",
    "",
    "- **Dispatching.** Where the doctrine says *the Agent tool*, use the",
    "  `task` tool with `subagent_type: <name>`. A Capo runs in the",
    "  foreground; you need its Rapporto before you accept anything.",
    SKILL_NOTE,
    "- **Registered Famiglie in this host:**",
    ...registered,
  ]

  if (input.omitted.length > 0) {
    const names = input.omitted.map((f) => title(f.id)).join(" and ")
    const agents = input.omitted.map((f) => `\`${f.capo}\``).join(", ")
    lines.push(
      `- **${names} ${input.omitted.length > 1 ? "are" : "is"} not registered here.** Do not`,
      `  write a Contratto for ${input.omitted.length > 1 ? "them" : "it"} and do not attempt to dispatch ${agents} —`,
      "  the agents do not exist. Their doctrine rests on evidence this host",
      "  cannot gather, because no web search is configured. A task that",
      "  genuinely needs one of them is a task you report as out of scope for",
      "  this host, not one you absorb into another Famiglia or handle",
      "  yourself. Iron Rule 1 does not bend for a missing Famiglia.",
    )
  }

  lines.push(
    `- **Web search.** ${searchSummary(input.search)}`,
    "- **Recon.** `occhio` is registered and read-only, as everywhere.",
    "",
  )

  return lines.join("\n")
}

function searchSummary(search: Search): string {
  if (search.mode === "none") {
    return "Not available in this host. Weigh it when you set an evidence bar in a Contratto."
  }
  if (search.keyless) {
    return `${search.label}. It can fail or thin out under load — treat a Rapporto that reports failed searches as honest, not as incomplete work.`
  }
  return `${search.label}, available to the agents whose definition grants it.`
}

function title(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
