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
import { CONSIGLIERE_AGENT } from "./roster.ts"
import { resolveSkillPaths } from "./skills.ts"

export type CosaOptions = {
  /** Model preset: `inherit` (default), `anthropic`, `github-copilot`, `zen`. */
  preset?: string
  /** Per-alias model overrides, applied on top of the preset. */
  models?: ModelMap
  /**
   * Force the web-search verdict instead of detecting it. Detection is a
   * guess; if you know an Exa or Parallel key is configured, say so.
   */
  webSearch?: boolean
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

  const webSearch = opts.webSearch ?? detectWebSearch()
  const skills = resolveSkillPaths(assets)
  const built = buildAgents({ assets, models, webSearch })

  for (const message of [...skills.warnings, ...built.warnings]) await log("warn", message)

  await log(
    "info",
    `registered ${Object.keys(built.agents).length} agents and ${skills.paths.length} skills from ${assets.root} (websearch: ${webSearch})`,
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

/**
 * opencode only offers its `websearch` tool when the session runs on the
 * `opencode` provider or an Exa/Parallel key is present. There is no way to
 * ask at config time, so this reads the same signals opencode does and errs
 * towards "no search" — an agent that wrongly believes it can search produces
 * confident, unsourced claims, which is the expensive direction to be wrong in.
 */
function detectWebSearch(): boolean {
  return Boolean(process.env.EXA_API_KEY || process.env.PARALLEL_API_KEY)
}

export default CosaPlugin
