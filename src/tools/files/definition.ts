export const LIST_FILES_TOOL_DEFINITION = {
  name: "redmine_list_files",
  description:
    "[Alpha] List all files in a Redmine project. Returns file metadata including name, size, type, author, and download URL.",
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

export const UPLOAD_FILE_TOOL_DEFINITION = {
  name: "redmine_upload_file",
  description:
    "[Alpha] Upload a file to a Redmine project. IMPORTANT: You must first upload the file using Redmine's attachment API to get a token, then use that token here to associate it with a project. See Redmine's file upload workflow for details.",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: ["string", "number"],
        description: "Project identifier or numeric ID (required)",
      },
      token: {
        type: "string",
        description: "Upload token from prior file upload (required)",
      },
      filename: { type: "string", description: "Override the uploaded filename" },
      description: { type: "string", description: "Description for the file" },
      version_id: { type: "number", description: "Project version ID to associate the file with" },
    },
    required: ["project_id", "token"],
  },
} as const;