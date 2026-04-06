export const LIST_WIKI_PAGES_TOOL_DEFINITION = {
  name: "redmine_list_wiki_pages",
  description: "List all wiki pages in a Redmine project.",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: ["string", "number"],
        description: "Project identifier or numeric ID (required)",
      },
    },
    required: ["project_id"],
  },
} as const;

export const GET_WIKI_PAGE_TOOL_DEFINITION = {
  name: "redmine_get_wiki_page",
  description: "Get the content and metadata of a Redmine wiki page by project and page title.",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: ["string", "number"],
        description: "Project identifier or numeric ID (required)",
      },
      title: { type: "string", description: "Wiki page title (required)" },
    },
    required: ["project_id", "title"],
  },
} as const;

export const UPDATE_WIKI_PAGE_TOOL_DEFINITION = {
  name: "redmine_update_wiki_page",
  description:
    "Create or update a Redmine wiki page. If the page does not exist, it will be created. IMPORTANT: Always fetch the page first with redmine_get_wiki_page and pass the current 'version' number to avoid silently overwriting concurrent edits.",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: ["string", "number"],
        description: "Project identifier or numeric ID (required)",
      },
      title: { type: "string", description: "Wiki page title (required)" },
      text: { type: "string", description: "Page content in Textile or Markdown (required)" },
      comments: { type: "string", description: "Optional edit comment for the page history" },
      version: { type: "number", description: "Current version number for optimistic locking" },
    },
    required: ["project_id", "title", "text"],
  },
} as const;

export const DELETE_WIKI_PAGE_TOOL_DEFINITION = {
  name: "redmine_delete_wiki_page",
  description:
    "Permanently delete a Redmine wiki page. Requires admin privileges. This action cannot be undone.",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: ["string", "number"],
        description: "Project identifier or numeric ID (required)",
      },
      title: { type: "string", description: "Wiki page title to delete (required)" },
    },
    required: ["project_id", "title"],
  },
} as const;
