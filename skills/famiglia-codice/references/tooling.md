# Tooling Baseline — Setup and Run Commands

Concrete commands for the baseline in `SKILL.md`. Use them only for slots the
project doesn't already fill. An existing tool always wins over this file,
even an unfashionable one — you conform to the project, you don't migrate it.

## Detect before you install

| Ecosystem | Look at |
|-----------|---------|
| PHP | `composer.json` (`require-dev`, `scripts`), `phpunit.xml`, `pest.php`, `phpstan.neon`, `rector.php`, `pint.json`, `.php-cs-fixer.php` |
| JS / TS | `package.json` (`devDependencies`, `scripts`), `vitest.config.*`, `jest.config.*`, `eslint.config.*`, `.eslintrc*`, `.prettierrc*`, `biome.json`, `tsconfig.json` |
| Any | `Makefile`, `.github/workflows/*.yml`, `justfile`, pre-commit hooks |

CI config is the most reliable source: whatever the pipeline runs is the
project's real definition of "green". Run the same commands locally.

## PHP

```bash
# Tests — Pest (preferred for new setups; it runs on PHPUnit underneath)
composer require --dev pestphp/pest --with-all-dependencies
vendor/bin/pest --init
vendor/bin/pest

# Laravel: use the Laravel plugin instead of the bare init
composer require --dev pestphp/pest-plugin-laravel

# Static analysis
composer require --dev phpstan/phpstan          # plain PHP
composer require --dev larastan/larastan        # Laravel — wraps PHPStan
vendor/bin/phpstan analyse

# Automated refactoring / upgrades
composer require --dev rector/rector
vendor/bin/rector --dry-run                     # never a blind write
```

Minimal `phpstan.neon` — start at a level the project passes, raise it only
if that's the Contratto's job:

```neon
parameters:
    level: 5
    paths:
        - src        # or app/ on Laravel
        - tests
```

Minimal `rector.php`:

```php
<?php

declare(strict_types=1);

use Rector\Config\RectorConfig;

return RectorConfig::configure()
    ->withPaths([__DIR__ . '/src', __DIR__ . '/tests'])
    ->withPhpSets()
    ->withTypeCoverageLevel(0);
```

**Rector is a review tool here, not an autopilot.** Run `--dry-run`, read the
diff, apply only what belongs to your Contratto's artifacts. A repo-wide
`vendor/bin/rector` write is a scope violation.

Formatter, if the project has none and its style is inconsistent: Laravel
Pint (`composer require --dev laravel/pint`, `vendor/bin/pint --test`) or
PHP-CS-Fixer. Optional — the required PHP triple stays Pest/PHPUnit, PHPStan,
Rector.

Wire the commands into `composer.json` so the Revisore and CI run exactly
what you ran:

```json
"scripts": {
    "test": "pest",
    "analyse": "phpstan analyse",
    "refactor": "rector --dry-run"
}
```

## JavaScript / TypeScript

```bash
# Tests
npm i -D vitest
npx vitest run

# Linting + formatting — either the ESLint/Prettier pair …
npm i -D eslint @eslint/js prettier eslint-config-prettier
npx eslint .
npx prettier --check .

# … or Biome, which covers both in one tool
npm i -D @biomejs/biome
npx biome ci .

# Type checking (TypeScript projects)
npx tsc --noEmit
```

Minimal `eslint.config.js` (flat config):

```js
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [js.configs.recommended, prettier];
```

`eslint-config-prettier` matters: without it ESLint and Prettier fight over
formatting and every run reports phantom errors.

An existing Jest setup stays Jest. Migrating a working test runner is its own
Contratto, never a side effect of yours.

Scripts in `package.json`:

```json
"scripts": {
    "test": "vitest run",
    "lint": "eslint .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit"
}
```

## Other ecosystems

| Ecosystem | Tests | Static analysis | Linter / formatter |
|-----------|-------|-----------------|--------------------|
| Python | `pytest` | `mypy .` | `ruff check .` / `ruff format --check .` |
| Go | `go test ./...` | `go vet ./...` | `golangci-lint run` |
| Rust | `cargo test` | `cargo clippy -- -D warnings` | `cargo fmt --check` |
| Ruby | RSpec / Minitest | Sorbet or RBS where established | RuboCop |

Anything not listed: name the ecosystem's standard triple in `design.md`,
with the reason for the choice, and set it up the same way.

## Rules that apply to every setup

- Config lands in the repo root under the tool's conventional filename, is
  committed, and is a separate commit from the behavior changes.
- Every tool gets a runnable script entry (`composer.json`, `package.json`,
  `Makefile`) — a command only you know is not a project tool.
- CI stays consistent: if the project has a pipeline, add the new commands
  there. Tooling that only runs on your machine rots by next week.
- Formatters run in **check** mode during verification (`--check`, `--test`,
  `--dry-run`). A verification step that rewrites files is not a verification.
- Pre-existing violations in code your Contratto doesn't touch: report under
  `Findings`, don't fix, don't suppress repo-wide to get a clean run.
