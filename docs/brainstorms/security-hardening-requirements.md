# Security Hardening for npm Publication

**Date:** 2026-04-06
**Status:** Approved
**Scope:** All 14 findings from security audit (Alta + Media + Baja)

## Context

mcp-server-redmine is a Model Context Protocol server that proxies tool calls to a Redmine REST API. Before publishing to npmjs, all security findings from the three-agent audit must be resolved.

## Requirements

### Alta

1. **Path traversal via string IDs** — Apply `encodeURIComponent()` to all string path parameters in `src/client/redmine.ts`. Add regex constraint `z.string().regex(/^[a-zA-Z0-9_-]+$/)` to all `project_id` and `id` fields that accept strings in schemas.

### Media

2. **Error message sanitization** — In `RedmineClient.request()`, log full Redmine error body to stderr, return only `Redmine API error: {status}` to callers. Keep specific 404 messages in handlers but strip raw API body.
3. **String length limits** — Add `.max()` to all Zod string fields: subject (255), description/notes/comments (100000), wiki text (500000), sort/include (200).
4. **Validate sort/include params** — Constrain `sort` with regex `/^[a-z_]+(:(asc|desc))?(,[a-z_]+(:(asc|desc))?)*$/i`. Constrain `include` with regex `/^[a-z_]+(,[a-z_]+)*$/`.
5. **Validate REDMINE_URL** — At startup, validate protocol is http/https. Warn to stderr if http. Reject non-http protocols.
6. **HTTP timeout** — Add `signal: AbortSignal.timeout(30_000)` to fetch calls.
7. **Gitignore .env** — Add `.env*` to `.gitignore`.
8. **Handle ZodError** — Create a `withErrorHandling` wrapper or use try-catch in all handlers to catch ZodError and return clean MCP error.

### Baja

9. **Date format validation** — Add `.regex(/^\d{4}-\d{2}-\d{2}$/)` to all date string fields.
10. **Safe fatal error logging** — Log only `err.message` in the global catch, not the full error object.
11. **Response sanitization** — Strip `__proto__` and `constructor` keys from parsed Redmine responses.
12. **Wiki version recommendation** — Update wiki update tool description to recommend always including `version` for optimistic locking.
13. **Rate limiting note** — Document in README that the API key should have minimal permissions and that no rate limiting is built in.
14. **Audit logging** — Log destructive operations (DELETE) to stderr with timestamp and target.

## Non-goals

- Per-user authorization (delegated to Redmine)
- Private IP range blocking (over-engineering for a local stdio server)
- Response schema validation with Zod (too brittle for varying Redmine versions)

## Success Criteria

- All 14 findings addressed
- Existing tests pass
- New tests for path traversal rejection and error sanitization
- `npm publish` ready
