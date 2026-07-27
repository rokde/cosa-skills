/**
 * Cosa's model aliases (`opus`, `sonnet`, `haiku`, `inherit`) resolved to
 * opencode's `provider/model` ids.
 *
 * The doctrine in `skills/consigliere/references/models.md` is a statement
 * about *strength tiers*, not about a vendor: a Revisore must reason harder
 * than the Capo it reviews. So the aliases stay in the agent files and the
 * mapping to concrete ids lives here, where a user can replace it wholesale.
 *
 * Default preset is `inherit` — no model is set and every agent runs on the
 * session's model. That is deliberately the weakest setup: it is the only one
 * guaranteed to work without knowing which providers the user authenticated.
 * Pick a real preset (or supply `models`) to get the tiering back.
 */

export type ModelAlias = "opus" | "sonnet" | "haiku" | "inherit"

export type ModelMap = Partial<Record<Exclude<ModelAlias, "inherit">, string>>

export const PRESETS: Record<string, ModelMap> = {
  /** Every agent runs on whatever the session runs on. No tiering. */
  inherit: {},
  anthropic: {
    opus: "anthropic/claude-opus-5",
    sonnet: "anthropic/claude-sonnet-5",
    haiku: "anthropic/claude-haiku-4-5",
  },
  "github-copilot": {
    opus: "github-copilot/claude-opus-5",
    sonnet: "github-copilot/claude-sonnet-5",
    haiku: "github-copilot/claude-haiku-4.5",
  },
  /** opencode zen. Also the only provider that enables the builtin websearch. */
  zen: {
    opus: "opencode/claude-opus-5",
    sonnet: "opencode/claude-sonnet-5",
    haiku: "opencode/claude-haiku-4-5",
  },
}

export const DEFAULT_PRESET = "inherit"

export function resolveModelMap(input: { preset?: string; models?: ModelMap }): {
  models: ModelMap
  warning?: string
} {
  const presetName = input.preset ?? DEFAULT_PRESET
  const preset = PRESETS[presetName]
  const warning = preset
    ? undefined
    : `unknown model preset "${presetName}" — falling back to "${DEFAULT_PRESET}"`

  return { models: { ...(preset ?? PRESETS[DEFAULT_PRESET]), ...(input.models ?? {}) }, warning }
}

/** Returns the model id for an alias, or `undefined` to inherit the session's. */
export function resolveModel(alias: string | undefined, models: ModelMap): string | undefined {
  if (!alias || alias === "inherit") return undefined
  return models[alias as keyof ModelMap]
}
