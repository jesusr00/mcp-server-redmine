export const SEARCH_TOOL_DEFINITION = {
  name: "redmine_search",
  description:
    "[Alpha] Search Redmine content across issues, wiki pages, news, documents, changesets, messages, projects, and attachments. Use this to discover related work before fetching details.",
  inputSchema: {
    type: "object",
    properties: {
      q: {
        type: "string",
        description: "Search query. Multiple terms can be separated by spaces (required)",
      },
      offset: { type: "number", description: "Pagination offset (default 0)" },
      limit: { type: "number", description: "Results per page (1-100, default 25)" },
      scope: {
        type: "string",
        enum: ["all", "my_project", "subprojects"],
        description: "Search scope: all projects, assigned projects, or include subprojects",
      },
      all_words: { type: "boolean", description: "Require all query words to match" },
      titles_only: { type: "boolean", description: "Search only titles" },
      issues: { type: "boolean", description: "Include issues in results" },
      news: { type: "boolean", description: "Include news in results" },
      documents: { type: "boolean", description: "Include documents in results" },
      changesets: { type: "boolean", description: "Include changesets in results" },
      wiki_pages: { type: "boolean", description: "Include wiki pages in results" },
      messages: { type: "boolean", description: "Include forum messages in results" },
      projects: { type: "boolean", description: "Include projects in results" },
      open_issues: { type: "boolean", description: "Only include open issues" },
      attachments: {
        type: "string",
        enum: ["0", "1", "only"],
        description:
          "Attachment search mode: '0' descriptions only, '1' descriptions and attachments, 'only' attachments only",
      },
    },
    required: ["q"],
  },
} as const;
