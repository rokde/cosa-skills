/**
 * Which parts of Cosa this host registers.
 *
 * Mercato and Impresa are deliberately absent. Both rest on a burden of proof
 * that assumes web search, and opencode only exposes its `websearch` tool when
 * the session runs on the `opencode` provider or an Exa/Parallel key is
 * present. Registering them regardless would hand the Consigliere two Famiglie
 * whose evidence bar silently collapses to "sources the model already knows" —
 * the failure mode Cosa exists to prevent. They come back when this plugin can
 * detect the search capability instead of hoping for it.
 */

export type FamigliaId = "codice" | "disegno"

export type Famiglia = {
  id: FamigliaId
  /** The doctrine skill an agent of this Famiglia loads. */
  skill: string
  capo: string
  revisore: string
  /** Internal helpers the Capo dispatches itself. Never the Consigliere. */
  helpers: string[]
  color: string
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
]

/** Agents that belong to no single Famiglia. */
export const SHARED_AGENTS = ["occhio"]

export const CONSIGLIERE_AGENT = "consigliere"

/** Every agent file this plugin turns into an opencode agent. */
export function rosterAgents(): string[] {
  return [...FAMIGLIE.flatMap((f) => [f.capo, f.revisore, ...f.helpers]), ...SHARED_AGENTS]
}

/** Agents that must keep the task tool, or the Verdetto chain breaks. */
export function dispatchers(): string[] {
  return FAMIGLIE.map((f) => f.capo)
}
