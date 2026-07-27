# Cosa for opencode

An [opencode](https://opencode.ai) plugin that registers Cosa's Consigliere
and its four Famiglie as native opencode agents, points opencode's skill
loader at Cosa's doctrine skills, and wires up the web search the research
roles depend on.

The agent markdown in `../agents/` and the skills in `../skills/` are the
single source of truth and are never modified. The plugin translates the
frontmatter (tool names, model aliases, permissions), passes the body through
unchanged, and appends a short host addendum that tells the agent how
dispatching and skill loading work here.

## Install

`opencode.json`, project or global:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["cosa-opencode"]
}
```

opencode installs the package itself. A local checkout works too — point at
the `opencode/` directory:

```jsonc
{ "plugin": ["/path/to/cosa-skills/opencode"] }
```

Restart opencode afterwards; it does not hot-reload config.

Verify:

```bash
opencode agent list      # consigliere (primary) + capi, revisori, occhio
opencode debug skill     # consigliere, protocollo, and one per Famiglia
opencode debug config    # mcp.websearch, skills.paths
```

## What you get

| Agent | Mode | Role |
|-------|------|------|
| `consigliere` | primary | Plans, delegates, accepts. Never builds. |
| `capo-codice` | subagent | Runs a Codice phase, test-driven. |
| `revisore-codice` | subagent | Independent Verdetto on Codice work. |
| `ricercatore-codice` | subagent | Vets third-party libraries for Capo Codice. |
| `capo-disegno` | subagent | Runs a Disegno phase (Concept or Build). |
| `revisore-disegno` | subagent | Independent Verdetto on Disegno work. |
| `capo-mercato` | subagent | Marketing, positioning, go-to-market. Needs search. |
| `revisore-mercato` | subagent | Re-checks claims, audience fit, legal risk. |
| `capo-impresa` | subagent | Grills an idea on viability and business case. Needs search. |
| `revisore-impresa` | subagent | Re-verifies sources and recomputes the case. |
| `occhio` | subagent | Read-only reconnaissance for the Consigliere. |

The Consigliere becomes `default_agent` unless you already set one, and a
`/consigliere` command is registered.

In Claude Code the Consigliere is a skill running in the main conversation.
opencode has no equivalent of "the conversation you are already in", so it is
a primary agent whose prompt does one thing: load the `consigliere` skill.
The doctrine is not duplicated into the prompt.

## Web search

opencode ships a `websearch` tool but only offers it on the `opencode`
provider or with an Exa/Parallel key. Everywhere else the six agents that
declare `WebSearch` — Occhio, Ricercatore Codice, and both Capi and Revisori
of Mercato and Impresa — would run search-blind without saying so.

So the plugin registers a remote search MCP in the config and gates it per
agent, which is what other opencode plugins do about the same gap. Search
tools arrive named `websearch_<tool>` (e.g. `websearch_web_search_exa`), and
each agent carries a `websearch_*` permission that mirrors whether its Cosa
definition granted `WebSearch`. An agent that was not given search cannot
reach the server just because another agent in the session can.

The default (`search: "auto"`) is Exa: authenticated when `EXA_API_KEY` is
set, on the unauthenticated quota otherwise. `TAVILY_API_KEY` selects Tavily.
Agents on the unauthenticated quota are told so, and told that a failed
search is a finding to report, not a gap to fill from memory.

**Mercato and Impresa are registered only when search resolves to something.**
With `search: "none"` both Famiglie, their doctrines and their agents are left
out entirely, and the Consigliere's prompt says so and forbids absorbing their
work into another Famiglia. Their burden of proof is the point of them;
running them on recall produces confident, unsourced verdicts, which is worse
than not running them at all.

If `mcp.websearch` already exists in your config — you configured it, or
another plugin registered it — the plugin leaves it alone and uses it.

## Options

Options are passed as the second element of the plugin entry:

```jsonc
{
  "plugin": [["cosa-opencode", { "preset": "anthropic", "search": "exa" }]]
}
```

| Option | Default | Effect |
|--------|---------|--------|
| `preset` | `inherit` | Model preset: `inherit`, `anthropic`, `github-copilot`, `zen`. `inherit` sets no model, so every agent runs on the session's. |
| `models` | — | Per-alias overrides on top of the preset, e.g. `{ "opus": "anthropic/claude-opus-5" }`. |
| `search` | `auto` | `auto`, `exa`, `tavily`, `builtin` (opencode's own tool), or `none`. Also decides whether Mercato and Impresa exist. |
| `setDefaultAgent` | `true` | Set `default_agent` to the Consigliere when none is configured. |
| `registerCommand` | `true` | Register the `/consigliere` command. |

Cosa's model policy (`skills/consigliere/references/models.md`) assigns opus
to the Consigliere and the Revisori, sonnet to the Capi, haiku to the Occhio.
A preset maps those three aliases to concrete provider ids. Without a preset
nothing is pinned and the policy is not enforced — pick one if your provider
gives you the choice.

Anything you write yourself in `opencode.json` wins: the plugin merges its
agent definitions in first and your keys override them per agent.

## Two things that break silently

- **Nested dispatch.** opencode denies a subagent the `task` tool unless the
  subagent's own permission ruleset contains a `task` rule. Without it a Capo
  still loads, still works, and quietly self-reviews instead of dispatching
  its Revisore. The plugin writes that rule; if you override a Capo's
  `permission` block, keep `task: "allow"`.
- **Tool names.** An unknown entry in opencode's tool map is not an error, it
  is a missing capability. The translation in `src/tools.ts` is explicit for
  that reason, and unmapped names are logged as warnings at startup. Search is
  the sharpest case: the tool is not called `WebSearch` here and no `tools:`
  entry can name it ahead of time, so it is gated by permission and the real
  name is stated in each agent's prompt.

Check `opencode debug agent capo-codice` if a chain misbehaves.

## Development

```bash
npm install
npx tsc --noEmit -p tsconfig.json
node scripts/sync-assets.ts   # copy roster agents/skills into assets/
```

`assets/` exists only for the published package; in a repository checkout the
plugin reads `../agents` and `../skills` directly, so edits take effect on the
next restart without a sync. `prepack` runs the sync and fails if any roster
agent or skill is missing.

`src/roster.ts` defines what this host registers. Adding a Famiglia is an
entry there plus the agent files in `../agents/`; set `requiresSearch` if its
doctrine cannot be executed honestly without web search.
