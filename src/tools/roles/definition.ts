export const LIST_ROLES_TOOL_DEFINITION = {
  name: "redmine_list_roles",
  description:
    "[Alpha] List all roles in the Redmine instance. Returns role IDs and names for role assignment.",
  inputSchema: {
    type: "object",
    properties: {
      limit: { type: "number", description: "Results per page (1–100, default 25)" },
      offset: { type: "number", description: "Pagination offset (default 0)" },
    },
    required: [],
  },
} as const;

export const GET_ROLE_TOOL_DEFINITION = {
  name: "redmine_get_role",
  description:
    "[Alpha] Get detailed information about a role including permissions, visibility settings, and assignability (requires Redmine 2.2+).",
  inputSchema: {
    type: "object",
    properties: {
      id: {
        type: "number",
        description: "Role numeric ID (required)",
      },
    },
    required: ["id"],
  },
} as const;
