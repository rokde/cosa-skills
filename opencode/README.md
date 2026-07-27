# Cosa for opencode

An [opencode](https://opencode.ai) plugin that registers Cosa's Consigliere,
Famiglia Codice and Famiglia Disegno as native opencode agents and points
opencode's skill loader at Cosa's doctrine skills.

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
opencode debug skill     # consigliere, protocollo, famiglia-codice, famiglia-disegno
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
| `occhio` | subagent | Read-only reconnaissance for the Consigliere. |

The Consigliere becomes `default_agent` unless you already set one, and a
`/consigliere` command is registered.

In Claude Code the Consigliere is a skill running in the main conversation.
opencode has no equivalent of "the conversation you are already in", so it is
a primary agent whose prompt does one thing: load the `consigliere` skill.
The doctrine is not duplicated into the prompt.

## Why Mercato and Impresa are missing

Both Famiglie rest on a burden of proof that assumes web search. opencode
ships a `websearch` tool, but only exposes it when the session runs on the
`opencode` provider or an Exa/Parallel key is configured. Registering them
regardless would hand the Consigliere two Famiglie whose evidence bar
silently degrades to "sources the model already knows" — the exact failure
Cosa exists to prevent. They return once the capability can be detected
rather than hoped for.

The plugin reads `EXA_API_KEY` / `PARALLEL_API_KEY` to decide whether the
remaining agents are told search is available. Override with the `webSearch`
option if you know better.

## Options

Options are passed as the second element of the plugin entry:

```jsonc
{
  "plugin": [["cosa-opencode", { "preset": "anthropic" }]]
}
```

| Option | Default | Effect |
|--------|---------|--------|
| `preset` | `inherit` | Model preset: `inherit`, `anthropic`, `github-copilot`, `zen`. `inherit` sets no model, so every agent runs on the session's. |
| `models` | — | Per-alias overrides on top of the preset, e.g. `{ "opus": "anthropic/claude-opus-5" }`. |
| `webSearch` | detected | Force the web-search verdict instead of guessing from env vars. |
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
  that reason, and unmapped names are logged as warnings at startup.

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
entry there plus the agent files in `../agents/`.
