![logo](./docs/art/cosa-logo.png)

# Cosa

> Cosa - Make AI an offer it can't refuse.

A skill and agent system for Claude Code built on the *Commissione* principle:
a **Consigliere** plans and orchestrates, specialized **Famiglie** execute,
and every Famiglia has its own **Revisore** who signs off on the work before
it goes back to the Consigliere.

## Principle

```
                       ┌──────────────────┐
   Request  ─────────► │   CONSIGLIERE    │  plans, delegates, accepts
                       │   (main skill)   │  NEVER writes code
                       └────────┬─────────┘
                                │ CONTRATTO + worktree
             ┌─────────────┬────┴─────────┬─────────────┐
             ▼             ▼              ▼             ▼
       ┌───────────┐ ┌────────────┐ ┌───────────┐ ┌────────────┐
       │Capo Codice│ │Capo Disegno│ │Capo Merc. │ │Capo Impresa│  research → design
       └─────┬─────┘ └─────┬──────┘ └─────┬─────┘ └─────┬──────┘  ↑ Consigliere gate
             │             │              │             │          plan → implement
             │             │              │             │          ↑ Consigliere gate
             ▼             ▼              ▼             ▼
       ┌───────────┐ ┌────────────┐ ┌───────────┐ ┌────────────┐
       │Revis. Cod.│ │Revis. Dis. │ │Revis. Mer.│ │Revis. Impr.│  checks, approves
       └─────┬─────┘ └─────┬──────┘ └─────┬─────┘ └─────┬──────┘  the Implement phase
             └─────────────┴────┬─────────┴─────────────┘
                                │ RAPPORTO (only when `approvato`)
                                ▼
                       ┌──────────────────┐
                       │   CONSIGLIERE    │  accepts, merges worktree, deletes it
                       └──────────────────┘
```

Core rule: **A Rapporto only reaches the Consigliere once its Revisore has
issued `approvato`.** The Consigliere doesn't trust the Rapporto — it checks
the evidence against its own Contratto's acceptance criteria.

Every work package runs through a **phase chain**: research → design → plan
→ implement, each a fresh dispatch inside a dedicated git worktree. The
Consigliere gates Design and Plan itself (structural check against the
Contratto); the Revisore only ever reviews the Implement phase's Rapporto.
Capi commit freely inside their worktree; only the Consigliere merges it
into the base branch and deletes it, once `approvato`. Ambiguity inside a
phase becomes a documented **assumption**, not a question back — only a
genuinely missing prerequisite (e.g. no approved Disegno concept) stops the
chain with `Outcome: failed`. Disegno collapses the chain into two phases
(Concept = research+design, Build = plan+implement); the other Famiglie run
all four separately.

## End-to-end process for one requirement

The overview above shows the actors. Here's the full lifecycle of a single
work package, start to finish:

```
Request
   │
   ▼
┌─────────────────────────────────────────────────────────────────┐
│ CONSIGLIERE — Understand                                        │
│ observable outcome? domains? out of scope? worthless-if-wrong?  │
└───────────────────────────┬─────────────────────────────────────┘
                            │ unfamiliar codebase?
                            ▼
                   ┌──────────────────┐
                   │  OCCHIO (recon)  │  read-only, facts only, optional
                   └────────┬─────────┘
                            ▼
┌───────────────────────────────────────────────────────────────┐
│ CONSIGLIERE — Il Piano                                        │
│ .commission/<slug>/plan.md : goal, steps, assumptions, risks  │
│ → aligned with requester before any Capo is touched           │
└───────────────────────────┬───────────────────────────────────┘
                            ▼
┌───────────────────────────────────────────────────────────┐
│ CONSIGLIERE — per step: write CONTRATTO, create worktree  │
│ .commission/<slug>/<n>-<famiglia>/contract.md             │
└───────────────────────────┬───────────────────────────────┘
                            ▼
        ╔════════════════════════════════════════════════╗
        ║          PHASE CHAIN (fresh Capo dispatch      ║
        ║          per phase, same worktree throughout)  ║
        ╚════════════════════════════════════════════════╝
                            │
                            ▼
                  ┌─────────────────┐
                  │  RESEARCH       │  research.md
                  │  (Capo, fresh)  │  no code changes
                  └─────────┬───────┘
                            ▼
                  ┌─────────────────┐
                  │  DESIGN         │  design.md
                  │  (Capo, fresh)  │  approach + Assumptions
                  └─────────┬───────┘
                            ▼
                  ◇──────────────────◇
                  │ CONSIGLIERE GATE │  structural: matches Contratto?
                  ◇──────────────────◇
                   │ drift        │ ok
                   ▼              ▼
            back to DESIGN   ┌─────────────────┐
                             │  PLAN           │  plan.md
                             │  (Capo, fresh)  │  ordered checklist
                             └─────────┬───────┘
                                       ▼
                             ◇──────────────────◇
                             │ CONSIGLIERE GATE │  structural: matches Contratto?
                             ◇──────────────────◇
                              │ drift        │ ok
                              ▼              ▼
                       back to PLAN    ┌─────────────────┐
                                       │  IMPLEMENT      │  phase-report.md
                                       │  (Capo, fresh)  │  red→green→refactor,
                                       │                 │  commits in worktree
                                       └─────────┬───────┘
                                                 ▼
                                       ┌─────────────────┐
                                       │  REVISORE       │  runs it itself,
                                       │                 │  doesn't trust text
                                       └─────────┬───────┘
                                                 │
                                  ┌──────────────┴──────────────┐
                                  │ respinto                    │ approvato
                                 ▼                              ▼
                          back to the CAPO       ┌──────────────────────┐
                          (review round+1,       │ RAPPORTO + VERDETTO  │
                          max 3; the Capo        │ → Consigliere        │
                          counts them, not       │                      │
                          the Revisore)          │                      │
                                                 └────────────┬─────────┘
                                                              ▼
                                       ┌─────────────────────────────────────────┐
                                       │ CONSIGLIERE — Acceptance                │
                                       │ every AC: evidenced? spot-checked?      │
                                       │ assumptions reasonable? deviations ok?  │
                                       └────────┬──────────────────┬─────────────┘
                                                │ AC not covered   │ all covered
                                                ▼                  ▼
                                        rework CONTRATTO    ┌────────────────────────┐
                                        (back to IMPLEMENT) │ merge worktree → base  │
                                                            │ delete worktree        │
                                                            │ carry Handoff forward  │
                                                            └───────────┬────────────┘
                                                                        ▼
                                                             next step's Contratto,
                                                             or Wrap-up to requester
```

Every arrow that isn't a phase-to-phase step is a place the loop can repeat:
Revisore rejection re-runs Implement only; a Consigliere gate finding
drift re-runs the phase it gated, not the whole chain; acceptance failure
re-runs Implement against a corrected Contratto, never a hand-fix by the
Consigliere itself.

Two loops, two counters, deliberately separate. A **review round** is one
Capo⇄Revisore exchange inside a single Implement phase — capped at three,
counted by the Capo (the Revisore is a fresh dispatch each time and remembers
nothing; the count comes from the `verdict-r<n>.md` files on disk). A
**rework Contratto** is the Consigliere reissuing after an `approvato`
Rapporto failed its acceptance — capped at two, then it goes to the
requester.

## Directory structure

```
.claude-plugin/
│   └── plugin.json            Plugin manifest (name, version, ...)
agents/                        Subagent definitions (executors)
│   ├── capo-codice.md         Implementation, strictly test-driven
│   ├── revisore-codice.md     Code acceptance
│   ├── ricercatore-codice.md  Library research (license, CVEs, currency)
│   ├── capo-disegno.md        Visual concepts & UI implementation
│   ├── revisore-disegno.md    Design acceptance
│   ├── capo-mercato.md        Marketing, positioning, content
│   ├── revisore-mercato.md    Marketing acceptance
│   ├── capo-impresa.md        Idea grilling, viability & business case
│   ├── revisore-impresa.md    Assessment acceptance
│   └── occhio.md              Recon, read-only research
└── skills/                    Doctrine (the HOW)
    ├── consigliere/           Main skill — orchestration
    │   └── references/
    │       ├── families.md    Registry of all Famiglie
    │       └── models.md      Model policy
    ├── protocollo/            Shared wire format, loaded by every agent
    │   ├── SKILL.md           Rapporto & Verdetto
    │   └── references/
    │       └── contract.md    Contratto, phase chain, Phase Brief
    ├── famiglia-codice/       Software development doctrine (TDD)
    │   └── references/
    │       └── tooling.md     Test/lint/analysis baseline per ecosystem
    ├── famiglia-disegno/      Visual doctrine (concept before code)
    ├── famiglia-mercato/      Marketing doctrine
    ├── famiglia-impresa/      Idea assessment doctrine (burden of proof)
    └── nuova-famiglia/        Guide: founding a new Famiglia
```

Installed as a plugin, skills are namespaced (`/cosa:consigliere`) to avoid
clashing with other plugins — which is why agents reference each other's
doctrine as `cosa:famiglia-codice` rather than by relative path: an agent
file lives in `agents/` and has no `references/` sibling to point at.
Locally, during development, `claude --plugin-dir .` loads it without
installing anything.

The protocol formats deliberately sit in their own `protocollo` skill rather
than under `consigliere/references/`: Capi and Revisori need them but must
not load the Consigliere's orchestration doctrine, and a skill name resolves
from anywhere while a relative path does not.

Generated working documents also use English names: `.commission/<slug>/plan.md`
for the overall Plan, and per work package
`.commission/<slug>/<n>-<famiglia>/{contract,research,design,plan,phase-report}.md`
plus `verdict-r<n>.md` for the phase chain's artifacts. The Rapporto carries
the `phase-` prefix because Claude Code blocks subagents from writing
`report*.md` — see Troubleshooting.

`.commission/` lives in the **main checkout** and is gitignored — a worktree
is a fresh checkout of a branch, so orchestration artifacts written there
before it exists would be invisible to the phase agents, and merging them
back would drag working documents into the base branch. Deliverables go the
other way: source, tests, and Disegno's `docs/design/<slug>.md` concept plus
its `docs/design/<slug>/<variant>.html` mockups live in the worktree and are
committed there. Phase Briefs carry both paths, absolute.

Worktrees themselves go to `.worktrees/<branch>` in the project, one per
Contratto, and `.worktrees/` is gitignored like `.commission/`. Where the
filesystem supports copy-on-write (`cp -c` on APFS, `cp --reflink` on
btrfs/XFS), `node_modules`/`vendor` are cloned in from the main checkout
rather than reinstalled. The checkout as a whole is never CoW-cloned as a
worktree substitute — that would copy `.git` too, and the resulting
repository's commits never reach the main checkout.

## Installation

This repo doubles as its own single-plugin marketplace
(`.claude-plugin/marketplace.json`):

```
claude plugin marketplace add rokde/cosa-skills
claude plugin install cosa@cosa-skills
```

For local development, point Claude Code straight at the checkout instead —
no install step, no marketplace:

```
claude --plugin-dir /path/to/cosa-skills
```

## Usage

```
/cosa:consigliere Build me a rate limiter for the API
```

Or just state a task — the Consigliere skill picks up multi-step work
automatically.


## Installing cosa-skills in opencode

cosa-skills is built as a **Claude Code plugin** (skills + agents +
`.claude-plugin/plugin.json`). [opencode](https://opencode.ai) has no
equivalent "plugin" concept for this (its `plugin:` field is reserved for
JS/TS modules with hooks), but it reads the same `SKILL.md` /
Markdown-frontmatter format natively. You can register cosa-skills' skills
and agents directly, without any install step.

### Option A: Git submodule (recommended for versioned projects)

Pin the plugin to a specific revision by adding it as a submodule under
`.opencode/vendor/`:

```bash
mkdir -p .opencode/vendor
git submodule add https://github.com/rokde/cosa-skills.git .opencode/vendor/cosa-skills
```

Then point opencode's skill loader at the checked-out `skills/` directory via
`opencode.json` (project root):

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "skills": {
    "paths": [".opencode/vendor/cosa-skills/skills"]
  }
}
```

This loads every `**/SKILL.md` under that path (`consigliere`, `protocollo`,
`famiglia-codice`, `famiglia-disegno`, `famiglia-mercato`, `famiglia-impresa`,
`nuova-famiglia`) as native opencode skills.

To also expose the Capo/Revisore/Occhio subagents to opencode, copy (or
symlink) the agent definitions into `.opencode/agent/`:

```bash
mkdir -p .opencode/agent
cp .opencode/vendor/cosa-skills/agents/*.md .opencode/agent/
```

Update the submodule later with:

```bash
git submodule update --remote .opencode/vendor/cosa-skills
```

### Option B: Plain clone (no submodule, quick local setup)

If you don't want to track the dependency in git history, clone it directly
and add the checkout to `.gitignore`:

```bash
git clone https://github.com/rokde/cosa-skills.git .opencode/vendor/cosa-skills
echo ".opencode/vendor/cosa-skills" >> .gitignore
```

Then reference it the same way as in Option A:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "skills": {
    "paths": [".opencode/vendor/cosa-skills/skills"]
  }
}
```

Or, if you don't need `opencode.json` at all, copy the skills straight into
opencode's default skill directory:

```bash
mkdir -p .opencode/skills
cp -r /path/to/cosa-skills/skills/* .opencode/skills/
```

Copy the agents the same way as in Option A if you want the Capo/Revisore
subagents available too.

### Notes

- **Restart required.** opencode does not hot-reload config. After adding
  `opencode.json` or files under `.opencode/`, quit and restart opencode for
  the skills/agents to load.
- **Namespace differences.** In Claude Code, agents cross-reference doctrine
  via the plugin namespace (e.g. `cosa:famiglia-codice`). opencode has no
  plugin namespace — skills are addressed by their folder name only (e.g.
  `famiglia-codice`). If any copied agent file references a `cosa:`-prefixed
  skill path, update it to the bare skill name for opencode.
- **Agent frontmatter.** opencode accepts these top-level agent frontmatter
  fields: `name, model, variant, description, mode, hidden, color, steps,
  options, permission, disable, temperature, top_p`. Any other field (e.g.
  Claude Code's `tools` list) is routed into `options` rather than rejected,
  but you may want to explicitly set `mode: subagent` on each cosa-skills
  agent file for correct behavior in opencode.


## Troubleshooting

**A Capo reports "Subagents should return findings as text, not write report
files."** Claude Code's Write tool rejects, for subagents only, markdown
files whose name starts with `report`, `summary`, `findings`, or `analysis`.
Capi and Revisori are subagents, which is why the Rapporto is called
`phase-report.md` and not `report.md`. The guard sits ahead of the permission
system, so no `permissions.allow` rule turns it off — only the name does.
Keep artifact names of your own Famiglie clear of those four leading words.

**A Capo reports being blocked writing an artifact by permissions.** That is
a different failure: a genuine permission denial, fixable with an allow rule
in your own `settings.json` (plugin manifests can't ship permission rules).

```json
"permissions": {
  "allow": ["Write(.commission/**)"]
}
```

Agents are instructed to stop and ask rather than route around either kind of
refusal via Bash (see `skills/protocollo/SKILL.md`) — if you see an agent
silently switching tools to force the write through, that's a doctrine
violation to report.

## Three non-negotiable doctrines

1. **Software is built test-driven.** Red test first, evidence in the
   Rapporto. No test = no `approvato`. The project's test, lint, and
   static-analysis tools are always used, and a missing baseline (PHP:
   Pest/PHPUnit, PHPStan, Rector — JS/TS: Vitest, ESLint+Prettier) is set up
   as part of the work package. See `famiglia-codice`.
2. **Visuals are drawn before they're built.** A mockup/design draft must be
   approved by the **Don**, not the Consigliere — the Consigliere renders it
   in-browser (`Artifact` tool) as the decision basis and waits for an
   explicit yes before implementation starts. See `famiglia-disegno`.
3. **Ideas carry the burden of proof.** An assessment that can't evidence a
   dimension returns `too-early` or `drop`, never a hopeful `pursue` — and a
   `drop` is completed work, not a failed Contratto. See `famiglia-impresa`.

## Model policy (short version)

| Role           | Model  | Why |
|----------------|--------|-----|
| Consigliere    | opus   | Planning, decomposition, acceptance — pure reasoning |
| Revisori       | opus   | Quality gate, must find gaps, not just read |
| Capi           | sonnet | Execution against a precise Contratto |
| Occhio         | haiku  | Broad search, gathering, summarizing |

Famiglia Codice adds one optional internal role: `ricercatore-codice`
(sonnet), dispatched by Capo Codice during Research to vet third-party
libraries — license, maintenance/currency, known CVEs — whenever the Don has
allowed reusing existing code instead of building everything from scratch.

Details and escalation rules: `skills/consigliere/references/models.md`

## Extending

Need a new specialization? `skills/nuova-famiglia/SKILL.md` describes
the blueprint: Capo + Revisore + doctrine skill + registry entry.

## Releasing

Run the `Release` workflow from the Actions tab with the target version
(`1.0.0`, no leading `v`). It writes the version into
`.claude-plugin/plugin.json`, commits that to `main`, tags **that** commit
`v<version>` and publishes a GitHub release with generated notes — in that
order, so the tagged tree always states the version it is named after.

Installed plugins track the default branch, so the bump on `main` is what
reaches users; the tag is the record of what changed when.
