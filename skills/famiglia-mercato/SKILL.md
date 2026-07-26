---
name: famiglia-mercato
description: Use when producing marketing artifacts — positioning, messaging, go-to-market plans, landing page copy, campaigns, content plans, competitive analysis — under a Contratto. The doctrine of the Famiglia Mercato requires audience and claim evidence before any copy is written, and runs as a four-phase chain (research, design, plan, implement). Also read this before reviewing as Revisore Mercato.
---

# Famiglia Mercato — Doctrine

No copy without an audience. No claim without evidence. Copy that hurts no
one but also convinces no one concretely is wasted time.

<EXTREMELY-IMPORTANT>
Every piece of copy starts from a **brief**. If the Contratto lacks an
audience or a core promise and it can't be reasonably derived, don't write
copy — that's a missing prerequisite, not something to guess your way past.
</EXTREMELY-IMPORTANT>

## The four phases

Mercato runs the full chain, undivided:

| Phase | You produce | Content |
|-------|--------------|---------|
| Research | `research.md` | Audience facts, competitor claims, available data/sources for every planned claim. No copy yet. |
| Design | `design.md` | The brief: audience, core promise, positioning, one call-to-action, tone. Consigliere gates this. |
| Plan | `plan.md` | Structure/outline of the artifact (sections of a landing page, channels of a GTM plan) mapped to the brief. Consigliere gates this. |
| Implement | `report.md` | The finished copy/artifact — the Rapporto, with a source per claim. |

## The brief (built in Research/Design)

| Question | |
|----------|---|
| Who exactly reads this? | role, situation, prior knowledge — not "everyone" |
| What problem does this person have right now? | concrete, not generic |
| What single action should follow? | one call-to-action, not several |
| What is competing for their attention? | a competitor or the status quo |
| What tone fits the brand? | look at existing examples |

If the Contratto is silent on one of these but it's clearly derivable from
context (existing brand docs, prior campaigns), derive it yourself, state it
as an assumption in `design.md`, and proceed — don't stop the chain for it.
Only stop (`Outcome: failed`) when there's truly no basis to derive it from
and guessing would mean writing copy for an unknown audience.

## Claims need evidence

Every number, every superlative, every promise in the copy needs a source —
the Contratto, provided data, or an explicit placeholder for the requester.

Bad: "The fastest solution on the market."
Good, with evidence: "40% faster load time than competitor X (measurement: …)."
Available without evidence: "[EVIDENCE NEEDED: comparison figure vs.
competitor X]" — explicitly flagged, never silently invented.

## Structure per format

**Landing page copy:** value proposition first, then proof, then one
call-to-action — not three competing ones.

**Go-to-market plan:** target segment, positioning, channels with rationale,
success metric per channel, timeline.

**Campaign:** one guiding idea, consistent across all assets, not
reinvented per channel.

**Competitive analysis:** only facts from verified sources, clearly
separated from your own assessment.

## Boundaries

- No comparisons against unnamed or unevidenced competitors.
- No promises the product, per the Contratto, doesn't actually deliver.
- Legally sensitive phrasing (health claims, financial guarantees,
  misleading statistics) is not written, but flagged as a risk in the
  Rapporto.
- Commit inside your worktree as you go. You never merge into the base
  branch or push — the Consigliere does that after `approvato`.

## Where things live

Two directories, both handed to you by absolute path in the Phase Brief:

- **Worktree** — the checkout you `cd` into. The artifact itself and all
  commits happen here.
- **Work package** (`.commission/<slug>/<n>-mercato/`) — sits in the **main
  checkout**, not under the worktree. `contract.md` and every phase artifact
  (`research.md`, `design.md`, `plan.md`, `report.md`) are read and written
  here, by absolute path.

## Resume, don't restart

Dispatched into a work package with existing commits or a partial phase
artifact? Check the worktree and existing `research.md`/`design.md`/`plan.md`
first, continue from there — never restart or duplicate.

## Wrap-up (Implement phase)

1. Check against the brief: does every piece of copy hit the stated audience
   and the stated call-to-action?
2. List every claim with its source in the Rapporto — format:
   `cosa:protocollo`, the single source of truth for Rapporto and Verdetto —
   plus any assumptions carried over from `design.md`.
3. **Call the Revisore** (`revisore-mercato`).
4. On `respinto`: work through the blockers, resubmit.

## Red flags

| Thought | Reality |
|---------|---------|
| "Sounds good, I'll add evidence later." | Don't write it without evidence. Flag it. |
| "The audience is basically everyone." | Then it hits no one. Narrow it down. |
| "A bit of exaggeration doesn't hurt." | Unevidenced superlatives ⇒ `respinto`. |
| "Three CTAs give more chances to convert." | It dilutes all three. Pick one. |
| "No brief, I'll ask before writing anything." | Derive it if you can, document the assumption. Only fail if you truly can't. |
