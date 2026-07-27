/**
 * Minimal YAML frontmatter reader for Cosa's agent files.
 *
 * Cosa's frontmatter is a flat block of `key: value` lines — no nesting, no
 * lists, no block scalars. Parsing that subset by hand keeps the plugin
 * dependency-free, which matters because opencode installs plugin deps with
 * bun at startup and every dependency is a startup failure mode.
 */

export type Frontmatter = {
  data: Record<string, string>
  body: string
}

const DELIMITER = "---"

export function parseFrontmatter(source: string): Frontmatter {
  const text = source.replace(/^﻿/, "")
  const lines = text.split(/\r?\n/)

  if (lines[0]?.trim() !== DELIMITER) return { data: {}, body: text }

  const end = lines.findIndex((line, index) => index > 0 && line.trim() === DELIMITER)
  if (end === -1) return { data: {}, body: text }

  const data: Record<string, string> = {}
  for (const line of lines.slice(1, end)) {
    const separator = line.indexOf(":")
    if (separator === -1) continue
    const key = line.slice(0, separator).trim()
    if (!key) continue
    data[key] = unquote(line.slice(separator + 1).trim())
  }

  return { data, body: lines.slice(end + 1).join("\n").replace(/^\n+/, "") }
}

function unquote(value: string) {
  if (value.length < 2) return value
  const first = value[0]
  const last = value[value.length - 1]
  if ((first === '"' && last === '"') || (first === "'" && last === "'")) return value.slice(1, -1)
  return value
}

/** Splits a `tools:` line (`Read, Write, Agent`) into its entries. */
export function parseToolList(value: string | undefined): string[] {
  if (!value) return []
  return value
    .replace(/^\[|\]$/g, "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
}
