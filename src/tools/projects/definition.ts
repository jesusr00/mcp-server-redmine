export const LIST_PROJECTS_TOOL_DEFINITION = {
  name: "redmine_list_projects",
  description: "List all Redmine projects the API user has access to, with pagination support.",
  inputSchema: {
    type: "object",
    properties: {
      limit: { type: "number", description: "Results per page (1–100, default 25)" },
      offset: { type: "number", description: "Pagination offset (default 0)" },
      include: {
        type: "string",
        description: "Comma-separated extras: trackers, issue_categories",
      },
    },
    required: [],
  },
} as const;

export const GET_PROJECT_TOOL_DEFINITION = {
  name: "redmine_get_project",
  description:
    "Get details of a single Redmine project by its identifier (string slug) or numeric ID.",
  inputSchema: {
    type: "object",
    properties: {
      id: {
        type: ["string", "number"],
        description: "Project identifier (slug) or numeric ID (required)",
      },
    },
    required: ["id"],
  },
} as const;

export const CREATE_PROJECT_TOOL_DEFINITION = {
  name: "redmine_create_project",
  description: "Create a new Redmine project. Returns the created project.",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Project display name (required)" },
      identifier: {
        type: "string",
        description: "Unique URL-safe slug, e.g. 'my-project' (required)",
      },
      description: { type: "string", description: "Project description" },
      is_public: {
        type: "boolean",
        description: "Whether the project is publicly visible (default false)",
      },
      inherit_members: {
        type: "boolean",
        description: "Whether to inherit parent project members",
      },
    },
    required: ["name", "identifier"],
  },
} as const;

export const UPDATE_PROJECT_TOOL_DEFINITION = {
  name: "redmine_update_project",
  description: "Update an existing Redmine project. Only provided fields are changed.",
  inputSchema: {
    type: "object",
    properties: {
      id: {
        type: ["string", "number"],
        description: "Project identifier or numeric ID to update (required)",
      },
      name: { type: "string", description: "New display name" },
      description: { type: "string", description: "New description" },
      is_public: { type: "boolean", description: "New visibility setting" },
      inherit_members: { type: "boolean", description: "New member inheritance setting" },
    },
    required: ["id"],
  },
} as const;
