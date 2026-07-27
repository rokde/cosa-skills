/**
 * Which doctrine skills this host exposes, and where they live.
 *
 * `skills.paths` entries are scanned with `**\/SKILL.md`, so pointing at a
 * single skill directory registers exactly that one skill. That is the whole
 * reason the paths are listed per skill instead of handing opencode the
 * `skills/` root: when Mercato and Impresa are left out for lack of web
 * search, the root would still register their doctrines, and a doctrine
 * without an agent to carry it is worse than a missing one — the Consigliere
 * would read it as an available option.
 */

import path from "node:path"
import type { Assets } from "./assets.ts"
import { readSkillFile } from "./assets.ts"
import { FAMIGLIE, type Famiglia } from "./roster.ts"

/** Skills that exist regardless of which Famiglie are registered. */
const CORE_SKILLS = ["protocollo", "consigliere"]

export function rosterSkills(famiglie: Famiglia[] = FAMIGLIE): string[] {
  return [...CORE_SKILLS, ...famiglie.map((f) => f.skill)]
}

export type SkillResult = {
  paths: string[]
  warnings: string[]
}

export function resolveSkillPaths(assets: Assets, famiglie: Famiglia[]): SkillResult {
  const paths: string[] = []
  const warnings: string[] = []

  for (const name of rosterSkills(famiglie)) {
    if (!readSkillFile(assets, name)) {
      warnings.push(`skill not found: skills/${name}/SKILL.md — "${name}" not registered`)
      continue
    }
    paths.push(path.join(assets.skills, name))
  }

  return { paths, warnings }
}
