# Hosts — where Cosa runs, and what changes

Cosa's protocol is host-neutral. Contratto, Phase Brief, `report.md`,
`verdict-r<n>.md` are files with absolute paths, and no phase agent ever
inherits a conversation. That part works anywhere.

Exactly **one** thing is host-specific: the verb for *"start a fresh,
context-isolated run of role X."* Everything in this file exists to name that
verb per host. Read it only when the dispatch probe fails — in a working host
there is nothing here you need.

## The dispatch verb

| Host | Verb | Roles come from |
|------|------|-----------------|
| Claude Code | `Agent` tool, `subagent_type: <agent-name>` | plugin `agents/*.md` |
| GitHub Copilot (VS Code, Copilot CLI) | `agent` / `runSubagent` tool | `.github/agents/*.agent.md`, `.claude/agents/`, `~/.copilot/agents` |
| opencode | `task` tool (or `@<agent-name>` by the Don) | `.opencode/agents/*.md`, `~/.config/opencode/agents/` |

## Claude Code

Reference host. Nothing to adapt.

## opencode

Skills work unmodified. Agents do not.

**Skills.** opencode scans `.opencode/skills/<name>/SKILL.md`,
`~/.config/opencode/skills/`, `.claude/skills/`, `~/.claude/skills/`,
`.agents/skills/`, `~/.agents/skills/`. Plugin directories are **not**
scanned — Cosa installed as a plugin is invisible until each skill directory
is linked into one of those paths. Of the frontmatter, only `name`,
`description`, `license`, `compatibility`, and `metadata` are recognized;
Cosa's skills carry `name` + `description`, so they pass as-is. Skills load
on demand through a native `skill` tool, not automatically by description —
so every agent that must load a doctrine needs that tool enabled, and the
`cosa:` prefix drops (`cosa:protocollo` → `protocollo`).

**Agents.** opencode does not read `.claude/agents`. Roles must exist as its
own agent files, where the filename is the agent id. Structural differences
against Cosa's frontmatter:

| Cosa | opencode |
|------|----------|
| `name:` | dropped — filename is the id |
| `description:` | same |
| — | `mode: subagent` — **required**, absent means it is not dispatchable |
| `tools:` as a list | boolean map (`read: true`, `edit: false`, …) |
| `Agent` | `task` |
| `Skill` | `skill` |
| `WebSearch` | **no equivalent** — only fetch-by-URL exists |
| `model: opus` | provider-qualified id, or omitted to inherit the session's |
| — | optional `permission:` block (`edit: deny`, `bash: deny`) |

Two consequences worth stating before anyone converts anything:

- A Capo without `task` cannot reach its Revisore. The agent still loads,
  still works, and silently self-reviews. Verify `task` on every Capo.
- Without web search, Mercato's proof-of-claims and Impresa's burden of
  proof degrade to sources the agent already knows the URL of. Note it in
  the Contratto rather than pretending the evidence bar is unchanged.

Do not set `OPENCODE_DISABLE_CLAUDE_CODE=1` — it turns off the `.claude/`
fallbacks the skills rely on.

## GitHub Copilot (VS Code, Copilot CLI)

The plugin format is shared between VS Code, Copilot CLI, and Claude Code; the
loader looks for `plugin.json` at `.plugin/`, the repository root,
`.github/plugin/`, and `.claude-plugin/`. Cosa's manifest sits in the last of
those, with `skills/` and `agents/` at the root — so the package shape already
matches and the open questions are per-file, not structural:

- Custom agents are expected as `*.agent.md`; `tools:` uses tool *sets*
  (`read`, `edit`, `execute`, `search`, `web`, `agent`) or qualified names
  (`edit/editFiles`, `execute/runInTerminal`, `search/codebase`, `web/fetch`).
  Cosa's Claude tool names are not those names.
- An `agents:` frontmatter field whitelists which subagents a role may call —
  stricter than Cosa's prose hierarchy and worth using: a Capo lists its own
  Revisore and helper, a Revisore lists none.
- **Subagents cannot invoke subagents by default.** Cosa needs depth 2
  (Consigliere → Capo → Revisore), so
  `"chat.subagents.allowInvocationsFromSubagents": true` is a hard
  prerequisite. Without it the Capo⇄Revisore step fails the same silent way.
- `model:` takes model display names, not `opus`/`sonnet`/`haiku` aliases.

## Tool names are the trap

Every host names its tools differently, and an unrecognized name in
`tools:` does not raise an error — the role loads without that capability.
That is how a Capo ends up unable to dispatch, unable to run tests, or unable
to load its doctrine, while looking entirely healthy. Check any converted
`tools:` against the host's own tool list before trusting a single dispatch,
and treat the names in this file as a starting point to verify, not as
authority.

## What never adapts

- Iron Rule 1. A Consigliere that cannot delegate does not implement. It
  reports the blockage.
- Iron Rule 2. No Verdetto, no acceptance — regardless of *why* the Verdetto
  is missing. A host that cannot run a Revisore cannot run Cosa.
- The file protocol. Never compensate for a missing dispatch mechanism by
  running a phase inline in your own context: the isolation *is* the
  mechanism, and an inline "Revisore" is self-review wearing a title.
