export const LIST_MEMBERSHIPS_TOOL_DEFINITION = {
  name: "redmine_list_memberships",
  description:
    "List all memberships for a Redmine project. Returns paginated results with member (user or group), project, and assigned roles. :project_id can be the numeric ID or string identifier.",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: ["string", "number"],
        description: "Project identifier or numeric ID (required)",
      },
      limit: { type: "number", description: "Results per page (1–100, default 25)" },
      offset: { type: "number", description: "Pagination offset (default 0)" },
    },
    required: ["project_id"],
  },
} as const;

export const GET_MEMBERSHIP_TOOL_DEFINITION = {
  name: "redmine_get_membership",
  description: "Get details of a single project membership by its numeric ID.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "number", description: "Numeric membership ID (required)" },
    },
    required: ["id"],
  },
} as const;

export const CREATE_MEMBERSHIP_TOOL_DEFINITION = {
  name: "redmine_create_membership",
  description:
    "Add a user or group as a member of a Redmine project with one or more roles.",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: ["string", "number"],
        description: "Project identifier or numeric ID (required)",
      },
      user_id: {
        type: "number",
        description: "Numeric ID of the user or group to add (required)",
      },
      role_ids: {
        type: "array",
        items: { type: "number" },
        description: "Array of numeric role IDs to assign (required)",
      },
    },
    required: ["project_id", "user_id", "role_ids"],
  },
} as const;

export const UPDATE_MEMBERSHIP_TOOL_DEFINITION = {
  name: "redmine_update_membership",
  description:
    "Update the roles of an existing project membership. Only role_ids can be changed; project and user are read-only.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "number", description: "Numeric membership ID to update (required)" },
      role_ids: {
        type: "array",
        items: { type: "number" },
        description: "New array of numeric role IDs to assign (required)",
      },
    },
    required: ["id", "role_ids"],
  },
} as const;

export const DELETE_MEMBERSHIP_TOOL_DEFINITION = {
  name: "redmine_delete_membership",
  description:
    "Delete a project membership. Memberships inherited from a group cannot be deleted; remove the group membership instead.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "number", description: "Numeric membership ID to delete (required)" },
    },
    required: ["id"],
  },
} as const;
