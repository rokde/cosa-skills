/**
 * Which doctrine skills this host exposes, and where they live.
 *
 * `skills.paths` entries are scanned with `**\/SKILL.md`, so pointing at a
 * single skill directory registers exactly that one skill. That is the whole
 * reason the paths are listed per skill instead of handing opencode the
 * `skills/` root: the root would also register `famiglia-mercato` and
 * `famiglia-impresa`, whose Capi are not registered here, and a doctrine
 * without an agent to carry it is worse than a missing one — the Consigliere
 * would read it as an available option.
 */

import path from "node:path"
import type { Assets } from "./assets.ts"
import { readSkillFile } from "./assets.ts"
import { FAMIGLIE } from "./roster.ts"

export const ROSTER_SKILLS = ["protocollo", "consigliere", ...FAMIGLIE.map((f) => f.skill)]

export type SkillResult = {
  paths: string[]
  warnings: string[]
}

export function resolveSkillPaths(assets: Assets): SkillResult {
  const paths: string[] = []
  const warnings: string[] = []

  for (const name of ROSTER_SKILLS) {
    if (!readSkillFile(assets, name)) {
      warnings.push(`skill not found: skills/${name}/SKILL.md — "${name}" not registered`)
      continue
    }
    paths.push(path.join(assets.skills, name))
  }

  return { paths, warnings }
}
