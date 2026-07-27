/**
 * Translation of Cosa's `tools:` frontmatter into opencode's tool ids and
 * permission ruleset.
 *
 * The trap this file exists to close: an unknown entry in opencode's tool map
 * is not an error. A Capo whose `Agent` never became `task` still loads, still
 * works, and silently self-reviews instead of dispatching its Revisore. So the
 * mapping is explicit, unmapped names are reported, and every managed tool is
 * written to the map — `false` included — instead of being left to a default.
 */

/** Cosa (Claude Code) tool name → opencode tool id. `null` = no equivalent. */
export const TOOL_IDS: Record<string, string | null> = {
  Read: "read",
  Write: "write",
  Edit: "edit",
  Bash: "bash",
  Grep: "grep",
  Glob: "glob",
  Agent: "task",
  Skill: "skill",
  WebSearch: "websearch",
  WebFetch: "webfetch",
  TodoWrite: "todowrite",
  NotebookEdit: null,
}

/**
 * Tools the plugin decides about for every agent. Anything in here that an
 * agent was not granted is written as `false`, so an agent can never inherit a
 * capability its Cosa definition withheld.
 *
 * `write`, `edit` and `patch` are all listed on purpose even though only one of
 * them survives into the resolved config: opencode picks the file-editing tool
 * per provider and folds the others away — on Anthropic models the map ends up
 * with `apply_patch` and no `edit`/`write` at all, exactly as it does for the
 * builtin `build` agent. Writing all three means the withheld case stays
 * withheld whichever one the runtime settles on, and `permission.edit` denies
 * it a second time for the read-only agents.
 */
const MANAGED = [
  "read",
  "write",
  "edit",
  "patch",
  "bash",
  "grep",
  "glob",
  "task",
  "skill",
  "websearch",
  "webfetch",
  "todowrite",
] as const

export type ToolTranslation = {
  tools: Record<string, boolean>
  permission: Record<string, unknown>
  unmapped: string[]
}

export function translateTools(names: string[]): ToolTranslation {
  const granted = new Set<string>()
  const unmapped: string[] = []

  for (const name of names) {
    if (!(name in TOOL_IDS)) {
      unmapped.push(name)
      continue
    }
    const id = TOOL_IDS[name]
    if (id) granted.add(id)
  }

  // opencode swaps `edit`/`write` for `patch` on GPT-family models. An agent
  // allowed to edit must keep editing there, so the two travel together.
  if (granted.has("edit") || granted.has("write")) granted.add("patch")

  const tools: Record<string, boolean> = {}
  for (const id of MANAGED) tools[id] = granted.has(id)

  return { tools, permission: buildPermission(granted), unmapped }
}

/**
 * Permissions are not redundant with the tool map. `task` in particular:
 * opencode denies the task tool to every subagent *unless the subagent's own
 * ruleset names it* (see `deriveSubagentSessionPermission` in opencode). That
 * rule is the only reason Capo → Revisore works at all here.
 */
function buildPermission(granted: Set<string>) {
  const action = (id: string) => (granted.has(id) ? "allow" : "deny")
  return {
    task: action("task"),
    skill: action("skill"),
    edit: granted.has("edit") || granted.has("write") ? "allow" : "deny",
    bash: action("bash"),
    webfetch: action("webfetch"),
    websearch: action("websearch"),
    todowrite: action("todowrite"),
  }
}
