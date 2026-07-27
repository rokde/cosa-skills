/**
 * Locates Cosa's `agents/` and `skills/` directories.
 *
 * Two layouts have to work: the repository checkout, where this plugin sits in
 * `opencode/` next to them, and the published package, where `prepack` has
 * copied them into `assets/`. Everything else in the plugin reads through here
 * so neither layout leaks into the rest of the code.
 */

import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const PLUGIN_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const REPO_ROOT = path.resolve(PLUGIN_ROOT, "..")
const PACKAGE_ASSETS = path.join(PLUGIN_ROOT, "assets")

export type Assets = {
  root: string
  agents: string
  skills: string
}

/**
 * The checkout wins over `assets/` whenever both exist, so editing an agent
 * file in the repository takes effect without re-running `sync-assets`. It is
 * recognised by Cosa's own plugin manifest rather than by the presence of
 * `agents/`, which a published package could plausibly sit next to.
 */
export function locateAssets(): Assets | undefined {
  const roots = existsSync(path.join(REPO_ROOT, ".claude-plugin", "plugin.json"))
    ? [REPO_ROOT, PACKAGE_ASSETS]
    : [PACKAGE_ASSETS, REPO_ROOT]

  for (const root of roots) {
    const agents = path.join(root, "agents")
    const skills = path.join(root, "skills")
    if (existsSync(agents) && existsSync(skills)) return { root, agents, skills }
  }
  return undefined
}

export function readAgentFile(assets: Assets, name: string): string | undefined {
  const file = path.join(assets.agents, `${name}.md`)
  if (!existsSync(file)) return undefined
  return readFileSync(file, "utf8")
}

export function readSkillFile(assets: Assets, name: string): string | undefined {
  const file = path.join(assets.skills, name, "SKILL.md")
  if (!existsSync(file)) return undefined
  return readFileSync(file, "utf8")
}
