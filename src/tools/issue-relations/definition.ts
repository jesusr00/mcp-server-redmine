export const LIST_ISSUE_RELATIONS_TOOL_DEFINITION = {
  name: "list_issue_relations",
  description:
    "[Alpha] List all relations for a given Redmine issue. Returns each relation's ID, related issue ID, type, and optional delay.",
  inputSchema: {
    type: "object",
    properties: {
      issue_id: {
        type: "number",
        description: "Numeric ID of the issue whose relations to list (required)",
      },
    },
    required: ["issue_id"],
  },
} as const;

export const GET_ISSUE_RELATION_TOOL_DEFINITION = {
  name: "get_issue_relation",
  description: "[Alpha] Get a single Redmine issue relation by its numeric ID.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "number", description: "Numeric relation ID (required)" },
    },
    required: ["id"],
  },
} as const;

export const CREATE_ISSUE_RELATION_TOOL_DEFINITION = {
  name: "create_issue_relation",
  description:
    "[Alpha] Create a relation between two Redmine issues. Supported types: relates, duplicates, duplicated, blocks, blocked, precedes, follows, copied_to, copied_from.",
  inputSchema: {
    type: "object",
    properties: {
      issue_id: { type: "number", description: "Numeric ID of the source issue (required)" },
      issue_to_id: { type: "number", description: "Numeric ID of the related issue (required)" },
      relation_type: {
        type: "string",
        description:
          "Relation type (default: relates). One of: relates, duplicates, duplicated, blocks, blocked, precedes, follows, copied_to, copied_from",
      },
      delay: {
        type: "number",
        description: "Delay in days, only applicable for precedes/follows relation types",
      },
    },
    required: ["issue_id", "issue_to_id"],
  },
} as const;

export const DELETE_ISSUE_RELATION_TOOL_DEFINITION = {
  name: "delete_issue_relation",
  description:
    "[Alpha] Permanently delete a Redmine issue relation by its numeric ID. This action cannot be undone.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "number", description: "Numeric relation ID to delete (required)" },
    },
    required: ["id"],
  },
} as const;
