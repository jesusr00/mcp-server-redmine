export const LIST_NEWS_TOOL_DEFINITION = {
  name: "redmine_list_news",
  description:
    "[Alpha] List Redmine news articles. Returns paginated results with title, summary, author, project, and creation date. Omit project_id to fetch news across all projects, or provide it to scope results to a single project.",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: ["string", "number"],
        description: "Project identifier or numeric ID. Omit to list news from all projects.",
      },
      limit: { type: "number", description: "Results per page (1–100, default 25)" },
      offset: { type: "number", description: "Pagination offset (default 0)" },
    },
    required: [],
  },
} as const;
