export const LIST_TIME_ENTRIES_TOOL_DEFINITION = {
  name: "redmine_list_time_entries",
  description:
    "List Redmine time entries with optional filters. Returns hours logged, activity, issue, and project for each entry.",
  inputSchema: {
    type: "object",
    properties: {
      project_id: { type: "string", description: "Filter by project identifier or numeric ID" },
      issue_id: { type: "number", description: "Filter by issue numeric ID" },
      user_id: { type: "number", description: "Filter by user numeric ID" },
      from: { type: "string", description: "Start date filter in YYYY-MM-DD format" },
      to: { type: "string", description: "End date filter in YYYY-MM-DD format" },
      limit: { type: "number", description: "Results per page (1–100, default 25)" },
      offset: { type: "number", description: "Pagination offset (default 0)" },
    },
    required: [],
  },
} as const;

export const GET_TIME_ENTRY_TOOL_DEFINITION = {
  name: "redmine_get_time_entry",
  description: "Get details of a single time entry by its numeric ID.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "number", description: "Numeric time entry ID (required)" },
    },
    required: ["id"],
  },
} as const;

export const LOG_TIME_TOOL_DEFINITION = {
  name: "redmine_log_time",
  description:
    "Log time against a Redmine issue or project. Either issue_id or project_id is required. Returns the created time entry.",
  inputSchema: {
    type: "object",
    properties: {
      hours: { type: "number", description: "Hours spent, e.g. 1.5 (required)" },
      activity_id: {
        type: "number",
        description: "Activity numeric ID (e.g. Development, Design) — required",
      },
      issue_id: {
        type: "number",
        description: "Issue numeric ID to log time against (either this or project_id required)",
      },
      project_id: {
        type: ["string", "number"],
        description: "Project identifier or numeric ID (either this or issue_id required)",
      },
      spent_on: {
        type: "string",
        description: "Date spent in YYYY-MM-DD format (defaults to today)",
      },
      comments: { type: "string", description: "Optional description of the work done" },
    },
    required: ["hours", "activity_id"],
  },
} as const;

export const UPDATE_TIME_ENTRY_TOOL_DEFINITION = {
  name: "redmine_update_time_entry",
  description: "Update an existing Redmine time entry. Only provided fields are changed.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "number", description: "Numeric time entry ID to update (required)" },
      hours: { type: "number", description: "New hours value" },
      activity_id: { type: "number", description: "New activity numeric ID" },
      spent_on: { type: "string", description: "New date in YYYY-MM-DD format" },
      comments: { type: "string", description: "New comments" },
    },
    required: ["id"],
  },
} as const;

export const DELETE_TIME_ENTRY_TOOL_DEFINITION = {
  name: "redmine_delete_time_entry",
  description: "Permanently delete a Redmine time entry. This action cannot be undone.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "number", description: "Numeric time entry ID to delete (required)" },
    },
    required: ["id"],
  },
} as const;
