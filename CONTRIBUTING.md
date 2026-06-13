# Contributing to mcp-server-redmine

Thanks for your interest in contributing! This MCP server exposes the Redmine
REST API to AI agents, and contributions of all kinds are welcome: bug reports,
new tools, documentation, and tests.

## Getting Started

### Prerequisites

- **Node.js** 22 or later
- **pnpm** (the project pins a version via the `packageManager` field — enable it
  with `corepack enable`)

### Setup

```bash
# Clone your fork
git clone https://github.com/<your-username>/mcp-server-redmine.git
cd mcp-server-redmine

# Install dependencies
pnpm install

# Build once to verify your toolchain works
pnpm build
```

To run the server against a real Redmine instance, export the two required
environment variables before launching it:

```bash
export REDMINE_URL="https://redmine.example.com"
export REDMINE_API_KEY="your-api-key"
```

> **Never commit secrets.** `.env*` files are already gitignored. Do not paste
> real API keys, URLs, or instance data into issues or pull requests.

## Development Workflow

| Command          | What it does                          |
| ---------------- | ------------------------------------- |
| `pnpm build`     | Bundle the server with tsdown         |
| `pnpm dev`       | Build in watch mode                   |
| `pnpm test`      | Run the test suite (Vitest)           |
| `pnpm typecheck` | Type-check without emitting           |
| `pnpm lint`      | Lint with ESLint (zero warnings)      |
| `pnpm format`    | Format the codebase with Prettier     |

Before opening a pull request, make sure all four checks pass locally — they are
the same checks CI runs:

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

## Project Structure

```
src/
├── index.ts          # Server entry point and tool registration
├── client/           # Redmine HTTP client + tests
├── types/            # Shared TypeScript types
└── tools/            # One folder per Redmine resource
    └── <resource>/
        ├── definition.ts   # MCP tool definitions (name, description, schema)
        ├── schema.ts        # Zod input schemas
        ├── <resource>.ts    # Implementation that calls the client
        └── index.ts         # Re-exports / registration
```

We favor **many small, focused files** over a few large ones. When adding a new
Redmine resource, mirror the existing layout of an established folder such as
`src/tools/issues/`.

## Adding a New Tool

1. Create (or extend) a folder under `src/tools/<resource>/`.
2. Define the Zod input schema in `schema.ts` — validate everything at the
   boundary; never trust raw input.
3. Declare the MCP tool in `definition.ts` with a clear name and description.
4. Implement the call against the Redmine client.
5. Register the tool in `src/index.ts`.
6. Add tests covering the happy path and at least one error/edge case.
7. Update the tool table in `README.md`, including the appropriate stability
   marker (✓ Stable, ⚠ Alpha, ⚡ Prototype).

## Coding Guidelines

- **TypeScript everywhere**, with strict types — no `any` escape hatches unless
  unavoidable and justified.
- **Immutability**: return new objects rather than mutating inputs.
- **Validate input** with Zod at every system boundary; fail fast with clear
  messages.
- **Handle errors explicitly** — never silently swallow them. Surface
  actionable messages to the caller.
- **No hardcoded secrets or instance-specific values.**
- Keep functions small (< 50 lines) and avoid deep nesting.

## Tests

This project uses [Vitest](https://vitest.dev/). New behavior should ship with
tests. Security-sensitive code paths (input validation, URL construction, auth
header handling) are covered by `src/client/security.test.ts` — keep them green
and extend them when you touch those areas.

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <short description>

[optional body]
```

Common types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`.

Examples:

```
feat(wiki): add redmine_delete_wiki_page tool
fix(client): handle 422 validation responses gracefully
docs: clarify Claude Desktop setup steps
```

## Pull Requests

1. Fork the repo and create a topic branch from `main`.
2. Make your changes with tests and updated docs.
3. Ensure `pnpm lint && pnpm typecheck && pnpm test && pnpm build` all pass.
4. Open a PR against `main` and fill out the PR template.
5. Keep PRs focused — one logical change per PR is easier to review.

A maintainer will review your PR. Automated checks (CI + an automated code
review) run on every PR. Please respond to feedback and keep your branch up to
date with `main`.

## Reporting Bugs & Requesting Features

Use the [issue templates](https://github.com/jesusr00/mcp-server-redmine/issues/new/choose).
For security vulnerabilities, **do not open a public issue** — follow the
process in [SECURITY.md](./SECURITY.md).

## License

By contributing, you agree that your contributions will be licensed under the
[MIT License](./LICENSE).
