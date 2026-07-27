# Cosa — release and verification entry points.
#
# Two release tracks live in this repository and they are independent; see
# RELEASE.md for which one an ordinary change belongs to.

OPENCODE := opencode

.DEFAULT_GOAL := help

.PHONY: help check pack release-plugin release-npm

help: ## Show this help
	@grep -hE '^[a-z-]+:.*?## ' $(MAKEFILE_LIST) \
		| awk -F':.*?## ' '{printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'
	@echo
	@echo "  Release targets take VERSION=x.y.z (no leading v)."

check: ## Type-check the opencode plugin and refresh its assets
	cd $(OPENCODE) && npx tsc --noEmit -p tsconfig.json
	cd $(OPENCODE) && node scripts/sync-assets.ts

pack: check ## Show what the npm tarball would contain
	cd $(OPENCODE) && npm pack --dry-run

release-plugin: ## Release the Claude Code plugin (triggers the GitHub workflow)
	@test -n "$(VERSION)" || { echo "VERSION is required, e.g. make release-plugin VERSION=1.4.0"; exit 1; }
	gh workflow run Release -f version=$(VERSION)
	@echo "Triggered. Follow it with: gh run watch"

release-npm: check ## Release cosa-opencode to npm
	@test -n "$(VERSION)" || { echo "VERSION is required, e.g. make release-npm VERSION=0.2.0"; exit 1; }
	@git diff --quiet || { echo "Working tree is dirty — commit or stash first."; exit 1; }
	cd $(OPENCODE) && npm version $(VERSION)
	cd $(OPENCODE) && npm publish
	git push --follow-tags
