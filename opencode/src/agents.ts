/**
 * Builds opencode agent configs out of Cosa's `agents/*.md`.
 *
 * The markdown files are the single source of truth and are never modified:
 * frontmatter is translated (tool names, model aliases), the body is passed
 * through, and the host addendum is appended.
 */

import type { Assets } from "./assets.ts"
import { readAgentFile } from "./assets.ts"
import { parseFrontmatter, parseToolList } from "./frontmatter.ts"
import { agentAddendum, consigliereAddendum } from "./host.ts"
import { resolveModel, type ModelMap } from "./models.ts"
import { CONSIGLIERE_AGENT, FAMIGLIE, rosterAgents, SHARED_AGENTS } from "./roster.ts"
import { translateTools } from "./tools.ts"

export type AgentConfig = Record<string, unknown>

export type BuildResult = {
  agents: Record<string, AgentConfig>
  warnings: string[]
}

export function buildAgents(input: {
  assets: Assets
  models: ModelMap
  webSearch: boolean
}): BuildResult {
  const warnings: string[] = []
  const agents: Record<string, AgentConfig> = {}

  for (const name of rosterAgents()) {
    const source = readAgentFile(input.assets, name)
    if (!source) {
      warnings.push(`agent file not found: agents/${name}.md — "${name}" not registered`)
      continue
    }

    const { data, body } = parseFrontmatter(source)
    const requested = parseToolList(data.tools)
    const { tools, permission, unmapped } = translateTools(requested)

    if (unmapped.length > 0) {
      warnings.push(`agent "${name}": no opencode equivalent for ${unmapped.join(", ")}`)
    }

    const subagents = subagentsOf(name)
    if (subagents.length > 0 && !tools.task) {
      // Worth shouting about: the agent still loads without `task` and quietly
      // reviews its own work instead of dispatching its Revisore.
      warnings.push(
        `agent "${name}" must dispatch ${subagents.join(", ")} but its tools grant no Agent/task — the Verdetto chain is broken`,
      )
    }

    const model = resolveModel(data.model, input.models)

    agents[name] = strip({
      description: data.description,
      mode: "subagent",
      model,
      tools,
      permission,
      color: colorOf(name),
      prompt:
        body.trimEnd() + agentAddendum({ subagents, webSearch: input.webSearch && tools.websearch === true }),
    })
  }

  agents[CONSIGLIERE_AGENT] = buildConsigliere(input)

  return { agents, warnings }
}

/**
 * The Consigliere is a skill in Cosa, not an agent — in Claude Code it runs in
 * the main loop. opencode has no equivalent to "the conversation you are
 * already in", so it becomes a primary agent whose prompt does one thing: load
 * the doctrine. Inlining the skill body here would break the relative
 * `references/` paths it points at, and would fork the doctrine.
 */
function buildConsigliere(input: { models: ModelMap; webSearch: boolean }): AgentConfig {
  const prompt = [
    "You are the Consigliere of the Cosa. You plan, delegate, and accept.",
    "You never produce the work itself.",
    "",
    "<EXTREMELY-IMPORTANT>",
    "Before you answer, plan, ask a clarifying question, or touch a single",
    "file, call the `skill` tool with `name: consigliere`. That skill is your",
    "doctrine — the iron rules, the workflow, the acceptance gates. Everything",
    "you do afterwards follows it. Do not reconstruct it from memory.",
    "</EXTREMELY-IMPORTANT>",
    "",
    "Two rules, restated here only so you cannot drift before the skill loads:",
    "",
    "1. **No work by your own hand.** Writing and editing are for planning",
    "   artifacts under `.commission/` only — never for a deliverable.",
    "2. **No Rapporto without a Verdetto.** A Capo's result that its Revisore",
    "   has not marked `approvato` does not exist for you.",
    consigliereAddendum(),
  ].join("\n")

  return strip({
    description:
      "Plans a task, writes a Contratto per Famiglia, dispatches Capi through their phase chain, and accepts only reviewer-approved Rapporti. Never produces the deliverable itself.",
    mode: "primary",
    model: resolveModel("opus", input.models),
    tools: {
      read: true,
      write: true,
      edit: true,
      patch: true,
      bash: true,
      grep: true,
      glob: true,
      task: true,
      skill: true,
      webfetch: true,
      websearch: input.webSearch,
      todowrite: true,
    },
    permission: {
      task: "allow",
      skill: "allow",
      edit: "allow",
      bash: "ask",
      webfetch: "allow",
      todowrite: "allow",
    },
    color: "#B8860B",
    prompt,
  })
}

function subagentsOf(name: string): string[] {
  const famiglia = FAMIGLIE.find((f) => f.capo === name)
  if (!famiglia) return []
  return [famiglia.revisore, ...famiglia.helpers]
}

function colorOf(name: string): string | undefined {
  const famiglia = FAMIGLIE.find((f) => f.capo === name || f.revisore === name || f.helpers.includes(name))
  if (famiglia) return famiglia.color
  return SHARED_AGENTS.includes(name) ? "#6E7681" : undefined
}

function strip(config: AgentConfig): AgentConfig {
  return Object.fromEntries(Object.entries(config).filter(([, value]) => value !== undefined))
}
