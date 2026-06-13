# Security Policy

## Supported Versions

This project follows semantic versioning. Security fixes are applied to the
latest released minor version. Please always run the most recent release before
reporting an issue.

| Version | Supported          |
| ------- | ------------------ |
| 0.3.x   | :white_check_mark: |
| < 0.3   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues,
discussions, or pull requests.**

Instead, report them privately using GitHub's
[private vulnerability reporting](https://github.com/jesusr00/mcp-server-redmine/security/advisories/new)
("Report a vulnerability" under the **Security** tab).

When reporting, please include as much of the following as you can:

- A description of the vulnerability and its impact
- Steps to reproduce or a proof of concept
- Affected version(s)
- Any suggested mitigation

You can expect an initial acknowledgement within **72 hours**. We will keep you
informed of progress toward a fix and may ask for additional information. Once a
fix is released, we are happy to credit you in the advisory unless you prefer to
remain anonymous.

## Scope & Handling Sensitive Data

This server talks to a Redmine instance using an API key supplied via the
`REDMINE_API_KEY` environment variable.

- **Never** commit or paste real API keys, instance URLs, or issue data into
  issues, PRs, or logs.
- The `REDMINE_API_KEY` is read from the environment only and is never written
  to disk by this server.
- When filing a bug report, redact hostnames and credentials.

Security-relevant behavior (input validation, URL construction, and
authentication header handling) is covered by automated tests in
`src/tools/security.test.ts`. See
[`docs/brainstorms/security-hardening-requirements.md`](./docs/brainstorms/security-hardening-requirements.md)
for the hardening requirements that guide these tests.
