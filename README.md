# mcp-server-redmine

MCP server for the Redmine REST API. Exposes 21 tools covering Issues, Projects, Users, Time Entries, and Wiki Pages via stdio transport.

## Installation

```bash
pnpm add mcp-server-redmine
```

Or use directly via npx:

```bash
npx mcp-server-redmine
```

## Configuration

Two environment variables are required:

| Variable | Description |
| --- | --- |
| `REDMINE_URL` | Base URL of your Redmine instance, e.g. `https://redmine.example.com` |
| `REDMINE_API_KEY` | Your Redmine API access key (found in *My account > API access key*) |

### Security Notes

- **Use HTTPS** in production. HTTP connections will transmit the API key in cleartext (a warning is logged at startup).
- **Use a least-privilege API key.** Create a dedicated Redmine user with only the permissions your agents need.
- **No built-in rate limiting.** The server proxies requests directly to Redmine. If you expose this to untrusted MCP clients, consider placing a rate limiter in front of your Redmine instance.
- All inputs are validated with Zod schemas (path traversal prevention, string length limits, date format validation, safe sort/include params).
- Redmine API error bodies are sanitized before being returned to MCP clients.
- Destructive operations (DELETE) are audit-logged to stderr.

## Claude Desktop Setup

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "redmine": {
      "command": "npx",
      "args": ["mcp-server-redmine"],
      "env": {
        "REDMINE_URL": "https://redmine.example.com",
        "REDMINE_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Claude Code Setup

Run from your project root:

```bash
claude mcp add-json redmine '{"command":"npx","args":["mcp-server-redmine"],"env":{"REDMINE_URL":"https://redmine.example.com","REDMINE_API_KEY":"your-api-key"}}'
```

Or add manually to `.mcp.json` at the root of your project:

```json
{
  "mcpServers": {
    "redmine": {
      "command": "npx",
      "args": ["mcp-server-redmine"],
      "env": {
        "REDMINE_URL": "https://redmine.example.com",
        "REDMINE_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Tools

### Issues

| Tool | Description |
| --- | --- |
| `redmine_list_issues` | List issues with filters: project, status, tracker, assignee, priority, pagination |
| `redmine_get_issue` | Get a single issue by numeric ID |
| `redmine_create_issue` | Create a new issue in a project |
| `redmine_update_issue` | Update fields on an existing issue |
| `redmine_delete_issue` | Permanently delete an issue |

### Projects

| Tool | Description |
| --- | --- |
| `redmine_list_projects` | List all accessible projects |
| `redmine_get_project` | Get a project by identifier (slug) or numeric ID |
| `redmine_create_project` | Create a new project |
| `redmine_update_project` | Update an existing project |

### Users

| Tool | Description |
| --- | --- |
| `redmine_list_users` | List users (requires admin privileges) |
| `redmine_get_user` | Get a user by numeric ID |
| `redmine_get_current_user` | Get the authenticated user's profile |

### Time Entries

| Tool | Description |
| --- | --- |
| `redmine_list_time_entries` | List time entries with filters: project, issue, user, date range |
| `redmine_get_time_entry` | Get a single time entry by numeric ID |
| `redmine_log_time` | Log hours against an issue or project |
| `redmine_update_time_entry` | Update an existing time entry |
| `redmine_delete_time_entry` | Permanently delete a time entry |

### Wiki Pages

| Tool | Description |
| --- | --- |
| `redmine_list_wiki_pages` | List all wiki pages in a project |
| `redmine_get_wiki_page` | Get wiki page content by project and title |
| `redmine_update_wiki_page` | Create or update a wiki page |
| `redmine_delete_wiki_page` | Permanently delete a wiki page (requires admin) |

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Watch mode
pnpm dev

# Tests
pnpm test

# Lint
pnpm lint

# Type check
pnpm typecheck

# Validate package exports
npx publint
```

## License

MIT
