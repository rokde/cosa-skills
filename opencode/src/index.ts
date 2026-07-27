/**
 * Cosa for opencode.
 *
 * Registers the Consigliere as a primary agent and the Famiglie Codice and
 * Disegno as subagents, and points opencode's skill loader at Cosa's doctrine
 * skills. Everything happens in the `config` hook, which receives opencode's
 * resolved config as a mutable object — the same mechanism opencode's own
 * agent config uses, so a user's `opencode.json` can override any of it.
 */

import type { Plugin } from "@opencode-ai/plugin"
import { buildAgents } from "./agents.ts"
import { locateAssets } from "./assets.ts"
import { resolveModelMap, type ModelMap } from "./models.ts"
import { CONSIGLIERE_AGENT, resolveRoster } from "./roster.ts"
import { resolveSearch, type SearchProvider } from "./search.ts"
import { resolveSkillPaths } from "./skills.ts"

export type CosaOptions = {
  /** Model preset: `inherit` (default), `anthropic`, `github-copilot`, `zen`. */
  preset?: string
  /** Per-alias model overrides, applied on top of the preset. */
  models?: ModelMap
  /**
   * Where web search comes from, and therefore whether Mercato and Impresa
   * are registered at all: `auto` (default), `exa`, `tavily`, `builtin`
   * (opencode's own tool, for the `opencode` provider), or `none`.
   */
  search?: SearchProvider
  /** Set `default_agent` to the Consigliere when the user has not chosen one. */
  setDefaultAgent?: boolean
  /** Register the `/consigliere` command. */
  registerCommand?: boolean
}

const PREFIX = "[cosa]"

export const CosaPlugin: Plugin = async ({ client }, options) => {
  const opts = (options ?? {}) as CosaOptions

  const log = async (level: "info" | "warn" | "error", message: string) => {
    try {
      await client.app.log({ body: { service: "cosa", level, message } })
    } catch {
      console.error(`${PREFIX} ${level.toUpperCase()}: ${message}`)
    }
  }

  const assets = locateAssets()
  if (!assets) {
    await log(
      "error",
      "could not locate Cosa's agents/ and skills/ directories — no agents registered. Expected them next to the plugin (repository checkout) or under assets/ (published package).",
    )
    return {}
  }

  const { models, warning } = resolveModelMap(opts)
  if (warning) await log("warn", warning)

  const { search, warnings: searchWarnings } = resolveSearch(opts.search)
  const roster = resolveRoster(search.mode !== "none")
  const skills = resolveSkillPaths(assets, roster.famiglie)
  const built = buildAgents({ assets, models, roster, search })

  for (const message of [...searchWarnings, ...skills.warnings, ...built.warnings]) {
    await log("warn", message)
  }

  if (roster.omitted.length > 0) {
    await log(
      "warn",
      `no web search configured — ${roster.omitted.map((f) => f.id).join(" and ")} not registered, because their burden of proof cannot be met without it. Set an EXA_API_KEY or TAVILY_API_KEY, or pass search: "builtin" on the opencode provider.`,
    )
  }

  await log(
    "info",
    `registered ${Object.keys(built.agents).length} agents and ${skills.paths.length} skills from ${assets.root} (search: ${search.label})`,
  )

  return {
    config: async (config: Record<string, unknown>) => {
      // Per-agent shallow merge, plugin defaults first. A user who sets a
      // model or a permission in opencode.json keeps it; everything they did
      // not mention comes from the Cosa definition.
      const agent = (config.agent ?? {}) as Record<string, Record<string, unknown>>
      for (const [name, definition] of Object.entries(built.agents)) {
        agent[name] = { ...definition, ...(agent[name] ?? {}) }
      }
      config.agent = agent

      const configured = (config.skills ?? {}) as { paths?: string[]; urls?: string[] }
      const paths = new Set([...(configured.paths ?? []), ...skills.paths])
      config.skills = { ...configured, paths: [...paths] }

      // Never overwrite an existing server of the same name: the user may have
      // configured it, or another plugin registered it first. Either way their
      // search is the one that already works, and the permission keys the
      // agents carry are keyed on the name, not on who defined it.
      const mcp = (config.mcp ?? {}) as Record<string, unknown>
      for (const [name, definition] of Object.entries(search.mcp)) mcp[name] ??= definition
      if (Object.keys(mcp).length > 0) config.mcp = mcp

      if (opts.setDefaultAgent !== false && !config.default_agent) {
        config.default_agent = CONSIGLIERE_AGENT
      }

      if (opts.registerCommand !== false) {
        const command = (config.command ?? {}) as Record<string, unknown>
        command[CONSIGLIERE_AGENT] ??= {
          description: "Hand a task to the Consigliere",
          agent: CONSIGLIERE_AGENT,
          template: "$ARGUMENTS",
        }
        config.command = command
      }
    },
  }
}

export default CosaPlugin
