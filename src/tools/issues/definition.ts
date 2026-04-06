export const LIST_ISSUES_TOOL_DEFINITION = {
  name: "redmine_list_issues",
  description:
    "List Redmine issues with optional filters. Returns paginated results with issue ID, subject, status, priority, and assignee. Use this to browse or search for issues before fetching details.",
  inputSchema: {
    type: "object",
    properties: {
      project_id: { type: "string", description: "Filter by project identifier or numeric ID" },
      status_id: {
        type: "string",
        description: "Filter by status: 'open', 'closed', '*' (all), or a numeric status ID",
      },
      tracker_id: {
        type: "number",
        description: "Filter by tracker numeric ID (e.g. Bug, Feature)",
      },
      assigned_to_id: { type: "number", description: "Filter by assignee numeric user ID" },
      priority_id: { type: "number", description: "Filter by priority numeric ID" },
      limit: { type: "number", description: "Results per page (1–100, default 25)" },
      offset: { type: "number", description: "Pagination offset (default 0)" },
      sort: { type: "string", description: "Sort field, e.g. 'updated_on:desc'" },
      include: {
        type: "string",
        description: "Comma-separated extras: journals, attachments, relations, watchers",
      },
    },
    required: [],
  },
} as const;

export const GET_ISSUE_TOOL_DEFINITION = {
  name: "redmine_get_issue",
  description:
    "Get full details of a single Redmine issue by its numeric ID, including description, status, dates, and optional extras like journals (comments) and attachments.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "number", description: "Numeric issue ID" },
      include: {
        type: "string",
        description:
          "Comma-separated extras: journals, attachments, relations, watchers, changesets",
      },
    },
    required: ["id"],
  },
} as const;

export const CREATE_ISSUE_TOOL_DEFINITION = {
  name: "redmine_create_issue",
  description: "Create a new Redmine issue. Returns the created issue with its assigned ID.",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: ["string", "number"],
        description: "Project identifier or numeric ID (required)",
      },
      subject: { type: "string", description: "Issue title (required)" },
      description: { type: "string", description: "Issue description" },
      tracker_id: {
        type: "number",
        description: "Tracker numeric ID (e.g. Bug, Feature, Support)",
      },
      status_id: { type: "number", description: "Status numeric ID" },
      priority_id: {
        type: "number",
        description: "Priority numeric ID (e.g. 1=Low, 2=Normal, 3=High)",
      },
      assigned_to_id: { type: "number", description: "Assignee user numeric ID" },
      start_date: { type: "string", description: "Start date in YYYY-MM-DD format" },
      due_date: { type: "string", description: "Due date in YYYY-MM-DD format" },
      estimated_hours: { type: "number", description: "Estimated hours" },
      done_ratio: { type: "number", description: "Completion percentage (0–100)" },
    },
    required: ["project_id", "subject"],
  },
} as const;

export const UPDATE_ISSUE_TOOL_DEFINITION = {
  name: "redmine_update_issue",
  description:
    "Update an existing Redmine issue. Only provided fields are changed. Use 'notes' to add a journal comment.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "number", description: "Numeric issue ID to update (required)" },
      subject: { type: "string", description: "New issue title" },
      description: { type: "string", description: "New description" },
      tracker_id: { type: "number", description: "New tracker numeric ID" },
      status_id: { type: "number", description: "New status numeric ID" },
      priority_id: { type: "number", description: "New priority numeric ID" },
      assigned_to_id: { type: "number", description: "New assignee user numeric ID" },
      start_date: { type: "string", description: "New start date (YYYY-MM-DD)" },
      due_date: { type: "string", description: "New due date (YYYY-MM-DD)" },
      estimated_hours: { type: "number", description: "New estimated hours" },
      done_ratio: { type: "number", description: "New completion percentage (0–100)" },
      notes: { type: "string", description: "Journal comment to add to the issue history" },
    },
    required: ["id"],
  },
} as const;

export const DELETE_ISSUE_TOOL_DEFINITION = {
  name: "redmine_delete_issue",
  description:
    "Permanently delete a Redmine issue and all its journals and attachments. This action cannot be undone.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "number", description: "Numeric issue ID to delete (required)" },
    },
    required: ["id"],
  },
} as const;
