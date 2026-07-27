/**
 * Which parts of Cosa this host registers.
 *
 * Mercato and Impresa both rest on a burden of proof that assumes web search,
 * so they are conditional: registered when the host can search, left out when
 * it cannot. Registering them regardless would hand the Consigliere two
 * Famiglie whose evidence bar silently collapses to "sources the model already
 * knows" — the failure mode Cosa exists to prevent. See `search.ts` for how
 * that capability is established.
 */

export type FamigliaId = "codice" | "disegno" | "mercato" | "impresa"

export type Famiglia = {
  id: FamigliaId
  /** The doctrine skill an agent of this Famiglia loads. */
  skill: string
  capo: string
  revisore: string
  /** Internal helpers the Capo dispatches itself. Never the Consigliere. */
  helpers: string[]
  color: string
  /** Its doctrine is not honestly executable without web search. */
  requiresSearch?: boolean
}

export const FAMIGLIE: Famiglia[] = [
  {
    id: "codice",
    skill: "famiglia-codice",
    capo: "capo-codice",
    revisore: "revisore-codice",
    helpers: ["ricercatore-codice"],
    color: "#8B0000",
  },
  {
    id: "disegno",
    skill: "famiglia-disegno",
    capo: "capo-disegno",
    revisore: "revisore-disegno",
    helpers: [],
    color: "#1F6FEB",
  },
  {
    id: "mercato",
    skill: "famiglia-mercato",
    capo: "capo-mercato",
    revisore: "revisore-mercato",
    helpers: [],
    color: "#B45309",
    requiresSearch: true,
  },
  {
    id: "impresa",
    skill: "famiglia-impresa",
    capo: "capo-impresa",
    revisore: "revisore-impresa",
    helpers: [],
    color: "#6E40C9",
    requiresSearch: true,
  },
]

/** Agents that belong to no single Famiglia. */
export const SHARED_AGENTS = ["occhio"]

export const CONSIGLIERE_AGENT = "consigliere"

export type Roster = {
  famiglie: Famiglia[]
  /** Famiglie left out because this host cannot search. */
  omitted: Famiglia[]
}

export function resolveRoster(canSearch: boolean): Roster {
  if (canSearch) return { famiglie: FAMIGLIE, omitted: [] }
  return {
    famiglie: FAMIGLIE.filter((f) => !f.requiresSearch),
    omitted: FAMIGLIE.filter((f) => f.requiresSearch),
  }
}

/** Every agent file this roster turns into an opencode agent. */
export function rosterAgents(famiglie: Famiglia[]): string[] {
  return [...famiglie.flatMap((f) => [f.capo, f.revisore, ...f.helpers]), ...SHARED_AGENTS]
}
