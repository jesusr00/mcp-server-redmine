export const LIST_USERS_TOOL_DEFINITION = {
  name: "redmine_list_users",
  description:
    "List Redmine users. Requires admin privileges. Returns user IDs, login names, and email addresses.",
  inputSchema: {
    type: "object",
    properties: {
      status: {
        type: "number",
        description: "Filter by status: 0=anonymous, 1=active (default), 2=registered, 4=locked",
      },
      name: { type: "string", description: "Filter by name or login (partial match)" },
      group_id: { type: "number", description: "Filter by group numeric ID" },
      limit: { type: "number", description: "Results per page (1–100, default 25)" },
      offset: { type: "number", description: "Pagination offset (default 0)" },
    },
    required: [],
  },
} as const;

export const GET_USER_TOOL_DEFINITION = {
  name: "redmine_get_user",
  description: "Get details of a single Redmine user by numeric ID.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "number", description: "Numeric user ID (required)" },
      include: { type: "string", description: "Comma-separated extras: memberships, groups" },
    },
    required: ["id"],
  },
} as const;

export const GET_CURRENT_USER_TOOL_DEFINITION = {
  name: "redmine_get_current_user",
  description:
    "Get the details of the currently authenticated Redmine user (identified by REDMINE_API_KEY).",
  inputSchema: {
    type: "object",
    properties: {},
    required: [],
  },
} as const;
