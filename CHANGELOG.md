# Changelog

## 0.3.0 (unreleased)

### Added
- CI workflow: lint, test, and build on every PR and push to main
- Package validation with publint before publish
- MCP server version now reads from package.json automatically
- CHANGELOG.md

### Changed
- README updated with security notes and lint/publint commands

## 0.2.2

### Changed
- Sourcemaps disabled in CI builds to reduce npm package size (~160KB vs ~730KB)

## 0.2.1

### Added
- GitHub Actions workflow for automatic npm publish on `v*.*.*` tags
- `packageManager` field in package.json for pnpm version pinning

### Changed
- Migrated bundler from tsup to tsdown (powered by Rolldown)
- Fixed tsconfig: ESNext module, Bundler resolution, noEmit, removed deprecated baseUrl

## 0.2.0

### Added
- Path traversal prevention: regex-constrained IDs + encodeURIComponent on all path params
- Input validation: string length limits, date format validation, safe sort/include params
- Error sanitization: Redmine API error bodies no longer leak to MCP clients
- HTTP request timeout (30s) via AbortSignal
- ZodError handling with centralized `withErrorHandling` wrapper
- Response sanitization: strips `__proto__`/`constructor`/`prototype` keys
- Audit logging for DELETE operations to stderr
- `.env*` added to .gitignore
- REDMINE_URL validation at startup (protocol check, HTTP warning)
- 20 security tests covering all hardening measures
- Shared common-schemas.ts for reusable Zod validators

### Changed
- Wiki update tool description recommends optimistic locking with `version` field

## 0.1.0

### Added
- Initial release
- 21 MCP tools: Issues (5), Projects (4), Users (3), Time Entries (5), Wiki Pages (4)
- Zod schema validation on all inputs
- stdio transport via @modelcontextprotocol/sdk
