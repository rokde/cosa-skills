# Releasing

This repository ships **two artifacts on independent version tracks**. They
share a git history and nothing else — no automation keeps their numbers in
step, and they should not be made to match.

| | Claude Code plugin | opencode plugin |
|---|---|---|
| What ships | `skills/`, `agents/`, `.claude-plugin/plugin.json` | the `cosa-opencode` npm package |
| Version lives in | `.claude-plugin/plugin.json` | `opencode/package.json` |
| Released by | the `Release` GitHub workflow | `npm publish` from `opencode/` |
| Git tag | `v<version>` | `cosa-opencode-v<version>` |
| Reaches users | immediately on push to `main` | only on publish |

That last row is the one that matters in practice.

## Which track does a change belong to?

Ask what a consumer actually receives.

- Touched `skills/` or `agents/` → **both**. Those files are the Claude Code
  plugin, and the opencode package copies them into `assets/` at pack time.
- Touched `opencode/src/` → **npm only**. Claude Code never loads it.
- Touched `README.md`, `Makefile`, this file → **neither**. Nothing consumes
  them. Cutting a release for documentation about the repository is noise.

## Claude Code plugin

Installed plugins track the default branch. A merge to `main` is the delivery;
**the release is bookkeeping** — a tag and generated notes marking what changed
when. So there is no urgency to release, and waiting to fold a related fix into
the same version is usually the better call.

```bash
make release-plugin VERSION=1.4.0
```

That dispatches the `Release` workflow, which validates the version, refuses an
existing tag, writes the version into `.claude-plugin/plugin.json`, commits
that to `main`, tags **that** commit, and publishes a GitHub release. In that
order, so the tagged tree always states the version it is named after.

Follow it with `gh run watch`.

## opencode plugin (npm)

Here publishing *is* the delivery: until `npm publish` runs, nobody can install
the new code.

```bash
make release-npm VERSION=0.2.0
```

The target refuses to run on a dirty working tree, type-checks, refreshes
`assets/`, bumps `opencode/package.json`, publishes, and pushes the commit and
tag. `prepack` re-runs the asset sync during publish and fails if any roster
agent or skill is missing, so a rename in `agents/` cannot silently ship a
package with a missing file.

Check first with `make pack` — it prints the tarball contents without
publishing anything.

### Things npm does not let you undo

- **A version number is spent forever.** Not reusable after `npm unpublish`,
  which itself only works within 72 hours of publishing.
- **The package name is claimed** by the first publish.

### Publishing from CI

If this ever moves into a workflow, use a granular access token scoped to this
one package and store it as a repository secret. A classic automation token
carries write access to *every* package on the account; leaking one is a
supply-chain problem for consumers of all of them, not just this project.

## Verification

```bash
make check   # type-check + asset sync
make pack    # tarball contents, publishes nothing
```

After an npm release, confirm the published artifact rather than the local one:

```bash
npm view cosa-opencode version
rm -rf ~/.cache/opencode/packages/cosa-opencode@latest
```

opencode installs plugins into that cache from the registry — it does not read
a project's `node_modules`. Clearing the directory is what forces a re-fetch.
Then, in a scratch project with `"plugin": ["cosa-opencode"]`:

```bash
opencode agent list     # consigliere + the Capi and Revisori
opencode debug config   # mcp.websearch, skills.paths
```

A plugin that fails to install leaves an **empty** directory in that cache and
reports nothing. Zero Cosa agents in `agent list` with no error is what a failed
install looks like.
