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
    "[Alpha] Add an already-uploaded file to a Redmine project's Files module. First call redmine_upload_attachment to get an upload token, then pass that token here to associate the file with the project.",
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

export const UPLOAD_ATTACHMENT_TOOL_DEFINITION = {
  name: "redmine_upload_attachment",
  description:
    "[Alpha] Upload a local file to Redmine and get an attachment token. Reads the file at the given absolute path and posts its content to Redmine's attachment API. Pass the returned token in the 'uploads' array of redmine_create_issue or redmine_update_issue to attach the file to an issue, or to redmine_upload_file to add it to a project's Files module. If the server is configured with REDMINE_UPLOAD_DIR, only files inside that directory can be uploaded.",
  inputSchema: {
    type: "object",
    properties: {
      file_path: {
        type: "string",
        description: "Absolute path to the local file to upload (required)",
      },
      filename: {
        type: "string",
        description: "Filename to store in Redmine (defaults to the file's basename)",
      },
      content_type: {
        type: "string",
        description: "MIME type, e.g. 'image/png' (defaults to a guess from the file extension)",
      },
    },
    required: ["file_path"],
  },
} as const;
