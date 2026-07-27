/**
 * Copies the agent and skill files this host can register into `assets/`, so
 * the published npm package carries them. Run by `prepack`; not needed when
 * the plugin is loaded straight out of a repository checkout.
 *
 * Every Famiglia is packaged, including the ones a given session leaves
 * unregistered for lack of web search — which of them load is decided at
 * startup from the config, not here.
 */

import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { FAMIGLIE, rosterAgents } from "../src/roster.ts"
import { rosterSkills } from "../src/skills.ts"

const PLUGIN_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const REPO_ROOT = path.resolve(PLUGIN_ROOT, "..")
const ASSETS = path.join(PLUGIN_ROOT, "assets")

rmSync(ASSETS, { recursive: true, force: true })
mkdirSync(path.join(ASSETS, "agents"), { recursive: true })
mkdirSync(path.join(ASSETS, "skills"), { recursive: true })

const missing: string[] = []

for (const name of rosterAgents(FAMIGLIE)) {
  const from = path.join(REPO_ROOT, "agents", `${name}.md`)
  if (!existsSync(from)) {
    missing.push(`agents/${name}.md`)
    continue
  }
  cpSync(from, path.join(ASSETS, "agents", `${name}.md`))
}

for (const name of rosterSkills()) {
  const from = path.join(REPO_ROOT, "skills", name)
  if (!existsSync(path.join(from, "SKILL.md"))) {
    missing.push(`skills/${name}/SKILL.md`)
    continue
  }
  cpSync(from, path.join(ASSETS, "skills", name), { recursive: true })
}

if (missing.length > 0) {
  console.error(`sync-assets: missing ${missing.length} file(s):\n  ${missing.join("\n  ")}`)
  process.exit(1)
}

console.log(`sync-assets: wrote ${ASSETS}`)
