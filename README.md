# mcp-server-redmine

MCP server for the Redmine REST API. Exposes 30 tools covering Issues, Issue Relations, Projects, Users, Time Entries, Wiki Pages, News, Files, and Roles via stdio transport.

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

| Variable          | Description                                                           |
| ----------------- | --------------------------------------------------------------------- |
| `REDMINE_URL`     | Base URL of your Redmine instance, e.g. `https://redmine.example.com` |
| `REDMINE_API_KEY` | Your Redmine API access key (found in _My account → API access key_)  |

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

| Tool                   | Status | Description                                                                        |
| ---------------------- | ------ | ---------------------------------------------------------------------------------- |
| `redmine_list_issues`  | ✓      | List issues with filters: project, status, tracker, assignee, priority, pagination |
| `redmine_get_issue`    | ✓      | Get a single issue by numeric ID                                                   |
| `redmine_create_issue` | ✓      | Create a new issue in a project                                                    |
| `redmine_update_issue` | ✓      | Update fields on an existing issue                                                 |
| `redmine_delete_issue` | ✓      | Permanently delete an issue                                                        |

### Issue Relations

| Tool                            | Status | Description                                                                     |
| ------------------------------- | ------ | ------------------------------------------------------------------------------- |
| `redmine_list_issue_relations`  | ✓      | List all relations for a given issue                                            |
| `redmine_get_issue_relation`    | ✓      | Get a single relation by its numeric ID                                         |
| `redmine_create_issue_relation` | ✓      | Create a relation between two issues (relates, blocks, precedes, duplicates, …) |
| `redmine_delete_issue_relation` | ✓      | Permanently delete a relation                                                   |

### Projects

| Tool                     | Status | Description                                      |
| ------------------------ | ------ | ------------------------------------------------ |
| `redmine_list_projects`  | ✓      | List all accessible projects                     |
| `redmine_get_project`    | ✓      | Get a project by identifier (slug) or numeric ID |
| `redmine_create_project` | ✓      | Create a new project                             |
| `redmine_update_project` | ✓      | Update an existing project                       |

### Users

| Tool                       | Status | Description                            |
| -------------------------- | ------ | -------------------------------------- |
| `redmine_list_users`       | ✓      | List users (requires admin privileges) |
| `redmine_get_user`         | ✓      | Get a user by numeric ID               |
| `redmine_get_current_user` | ✓      | Get the authenticated user's profile   |

### Time Entries

| Tool                        | Status | Description                                                      |
| --------------------------- | ------ | ---------------------------------------------------------------- |
| `redmine_list_time_entries` | ✓      | List time entries with filters: project, issue, user, date range |
| `redmine_get_time_entry`    | ✓      | Get a single time entry by numeric ID                            |
| `redmine_log_time`          | ✓      | Log hours against an issue or project                            |
| `redmine_update_time_entry` | ✓      | Update an existing time entry                                    |
| `redmine_delete_time_entry` | ✓      | Permanently delete a time entry                                  |

### Wiki Pages

| Tool                       | Status | Description                                     |
| -------------------------- | ------ | ----------------------------------------------- |
| `redmine_list_wiki_pages`  | ⚠      | List all wiki pages in a project                |
| `redmine_get_wiki_page`    | ⚠      | Get wiki page content by project and title      |
| `redmine_update_wiki_page` | ⚠      | Create or update a wiki page                    |
| `redmine_delete_wiki_page` | ⚠      | Permanently delete a wiki page (requires admin) |

### News

| Tool                | Status | Description                                        |
| ------------------- | ------ | -------------------------------------------------- |
| `redmine_list_news` | ⚡     | List news articles with optional project filtering |

### Files

| Tool                  | Status | Description                               |
| --------------------- | ------ | ----------------------------------------- |
| `redmine_list_files`  | ⚠      | List all files in a project with metadata |
| `redmine_upload_file` | ⚠      | Upload a file to a project                |

### Roles

| Tool                 | Status | Description                            |
| -------------------- | ------ | -------------------------------------- |
| `redmine_list_roles` | ⚠      | List all roles with IDs and names      |
| `redmine_get_role`   | ⚠      | Get role details including permissions |

### Issues Relations

| Tool                    | Status | Description                                                    |
| ----------------------- | ------ | -------------------------------------------------------------- |
| `list_issue_relations`  | ⚠      | List all relations for a given Redmine issue                   |
| `get_issue_relation`    | ⚠      | Get a single Redmine issue relation by its numeric ID.         |
| `create_issue_relation` | ⚠      | Create a relation between two Redmine issues.                  |
| `delete_issue_relation` | ⚠      | Permanently delete a Redmine issue relation by its numeric ID. |

## API Stability

The tools follow Redmine's API resource stability levels:

| Status       | Meaning                                                                         |
| ------------ | ------------------------------------------------------------------------------- |
| ✓ Stable     | Feature complete, no major changes planned                                      |
| ⚠ Alpha      | Major functionality in place, needs feedback from integrators                   |
| ⚡ Prototype | Rough implementation, possible breaking changes. Not recommended for production |

### News

| Tool | Description |
| --- | --- |
| `redmine_list_news` | List news articles with optional project filtering |

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

# Type check
pnpm typecheck
```

## License

MIT
