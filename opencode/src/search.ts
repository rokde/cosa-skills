/**
 * Web search, and therefore whether Mercato and Impresa exist in this host.
 *
 * opencode ships a `websearch` tool but only offers it on the `opencode`
 * provider or with an Exa/Parallel key — everywhere else the agents that
 * declare `WebSearch` (Occhio, Ricercatore, and both Capi/Revisori of Mercato
 * and Impresa) run search-blind without saying so. The fix is the one other
 * opencode plugins use: register a remote search MCP in the config and gate it
 * per agent. That turns "no search" from a property of the host into a
 * decision the Don makes.
 *
 * MCP tools are named `<server>_<tool>`, and opencode matches permission keys
 * against those names — so `websearch_*` is what allows or denies the whole
 * server for one agent. There is no collision with the builtin tool: its id is
 * `websearch`, and the pattern requires the underscore.
 */

export type SearchProvider = "auto" | "exa" | "tavily" | "builtin" | "none"

export type McpConfig = {
  type: "remote"
  url: string
  headers?: Record<string, string>
  oauth: false
}

export type Search = {
  /** How the agents that declare `WebSearch` actually search. */
  mode: "mcp" | "builtin" | "none"
  /** MCP servers to merge into the config. Empty unless `mode` is `mcp`. */
  mcp: Record<string, McpConfig>
  /** Permission key that governs search for one agent, if there is one. */
  permissionKey?: string
  /** What the agents are told they have. */
  label: string
  /** True when search is expected to work but on an unauthenticated quota. */
  keyless: boolean
}

/** Server name, kept identical to the convention other opencode plugins use. */
export const MCP_NAME = "websearch"

const EXA_URL = "https://mcp.exa.ai/mcp?tools=web_search_exa"
const TAVILY_URL = "https://mcp.tavily.com/mcp/"

export function resolveSearch(provider: SearchProvider = "auto"): {
  search: Search
  warnings: string[]
} {
  const warnings: string[] = []

  switch (provider) {
    case "none":
      return { search: none(), warnings }

    case "builtin":
      return {
        search: {
          mode: "builtin",
          mcp: {},
          permissionKey: "websearch",
          label: "opencode's builtin `websearch` tool",
          keyless: false,
        },
        warnings,
      }

    case "tavily": {
      const key = process.env.TAVILY_API_KEY
      if (!key) {
        warnings.push('search provider "tavily" needs TAVILY_API_KEY — falling back to no search')
        return { search: none(), warnings }
      }
      return { search: tavily(key), warnings }
    }

    case "exa":
      return { search: exa(process.env.EXA_API_KEY), warnings }

    case "auto": {
      if (process.env.EXA_API_KEY) return { search: exa(process.env.EXA_API_KEY), warnings }
      const tavilyKey = process.env.TAVILY_API_KEY
      if (tavilyKey) return { search: tavily(tavilyKey), warnings }
      return { search: exa(undefined), warnings }
    }

    default:
      warnings.push(`unknown search provider "${provider}" — falling back to "auto"`)
      return resolveSearch("auto")
  }
}

function none(): Search {
  return { mode: "none", mcp: {}, label: "no web search", keyless: false }
}

function exa(key: string | undefined): Search {
  const url = key ? `${EXA_URL}&exaApiKey=${encodeURIComponent(key)}` : EXA_URL
  return {
    mode: "mcp",
    mcp: { [MCP_NAME]: { type: "remote", url, oauth: false } },
    permissionKey: `${MCP_NAME}_*`,
    label: key ? "Exa web search (authenticated)" : "Exa web search (unauthenticated quota)",
    keyless: !key,
  }
}

function tavily(key: string): Search {
  return {
    mode: "mcp",
    mcp: {
      [MCP_NAME]: {
        type: "remote",
        url: TAVILY_URL,
        headers: { Authorization: `Bearer ${key}` },
        oauth: false,
      },
    },
    permissionKey: `${MCP_NAME}_*`,
    label: "Tavily web search",
    keyless: false,
  }
}
