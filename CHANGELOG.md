# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Issue attachments support** ([#18]): new `redmine_upload_attachment` tool that reads a
  local file and posts it to Redmine's attachment API (`POST /uploads.json`), returning an
  upload token. `redmine_create_issue` and `redmine_update_issue` now accept an `uploads`
  array of `{ token, filename, content_type?, description? }` entries so files can be
  attached to issues. The token also works with `redmine_upload_file` to add files to a
  project's Files module. Up to 10 uploads per issue; local files up to 50 MB.

### Security

- **Optional upload directory restriction**: when the `REDMINE_UPLOAD_DIR` environment
  variable is set to an absolute path, `redmine_upload_attachment` only reads files inside
  that directory. Symlinks are resolved before the check, so links pointing outside the
  directory are rejected, and missing files outside the directory are indistinguishable from
  denied ones, so the tool cannot be used to probe the filesystem. Hard links and bind mounts
  are not detected (path-level containment only). This limits what a (possibly
  prompt-injected) model can exfiltrate to the Redmine server; leaving it unset preserves the
  unrestricted behavior.

## [0.6.0] - 2026-08-25

### Added

- **Custom fields support for issues** ([#13], [#14]): `redmine_create_issue` and
  `redmine_update_issue` now accept a `custom_fields` array of `{ id, value }` pairs,
  allowing issues to be created or updated in projects that require custom fields
  (e.g. a mandatory `Environment` field on the Bug tracker). Values are strings;
  multi-select custom fields are not supported yet. Up to 100 entries are allowed.

### Changed

- **Clearer Redmine validation errors** ([#14]): validation failures on 4xx responses
  (such as `422 Unprocessable Entity`) now surface the detailed messages returned by
  the Redmine API as `Redmine validation errors: ...`, so callers can tell which
  required field is missing. `5xx` responses still expose only the status code to
  avoid leaking internal server details.

## Previous releases

Releases prior to 0.6.0 (up to and including [0.5.1]) predate this changelog. See the
[Git tags](https://github.com/jesusr00/mcp-server-redmine/tags) and
[release history](https://github.com/jesusr00/mcp-server-redmine/releases) for details.

[0.6.0]: https://github.com/jesusr00/mcp-server-redmine/compare/v0.5.1...v0.6.0
[0.5.1]: https://github.com/jesusr00/mcp-server-redmine/releases/tag/v0.5.1
[#13]: https://github.com/jesusr00/mcp-server-redmine/issues/13
[#14]: https://github.com/jesusr00/mcp-server-redmine/pull/14
[#18]: https://github.com/jesusr00/mcp-server-redmine/issues/18
