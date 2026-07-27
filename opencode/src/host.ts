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

import { FAMIGLIE } from "./roster.ts"

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

export function agentAddendum(input: { subagents: string[]; webSearch: boolean }): string {
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

  if (!input.webSearch) {
    lines.push(
      [
        "- **No web search.** opencode exposes `websearch` only on the",
        "  `opencode` provider or with an Exa/Parallel key configured. Where the",
        "  doctrine asks you to search, you have `webfetch` (fetch a known URL)",
        "  and nothing else. Do not present recalled knowledge as researched",
        "  evidence — say what you could not verify, in the Rapporto.",
      ].join("\n"),
    )
  }

  lines.push("")
  return lines.join("\n")
}

export function consigliereAddendum(): string {
  const registered = FAMIGLIE.map(
    (f) => `  - **${title(f.id)}** — Capo \`${f.capo}\`, Revisore \`${f.revisore}\``,
  )

  return [
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
    "- **Mercato and Impresa are not registered here.** Do not write a",
    "  Contratto for them and do not attempt to dispatch `capo-mercato` or",
    "  `capo-impresa` — the agents do not exist. Both rest on evidence this",
    "  host cannot reliably gather. A task that genuinely needs one of them is",
    "  a task you report as out of scope for this host, not one you absorb",
    "  into Codice or handle yourself. Iron Rule 1 does not bend for a missing",
    "  Famiglia.",
    "- **Recon.** `occhio` is registered and read-only, as everywhere.",
    "",
  ].join("\n")
}

function title(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
