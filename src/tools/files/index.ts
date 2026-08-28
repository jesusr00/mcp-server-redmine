import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import type { RedmineClient } from "@/client/redmine";
import {
  handleDownloadAttachment,
  handleListFiles,
  handleUploadAttachment,
  handleUploadFile,
} from "./files";
import {
  DownloadAttachmentSchema,
  ListFilesSchema,
  UploadAttachmentSchema,
  UploadFileSchema,
} from "./schema";
import {
  DOWNLOAD_ATTACHMENT_TOOL_DEFINITION,
  LIST_FILES_TOOL_DEFINITION,
  UPLOAD_ATTACHMENT_TOOL_DEFINITION,
  UPLOAD_FILE_TOOL_DEFINITION,
} from "./definition";

export function registerFileTools(server: McpServer, client: RedmineClient): void {
  server.tool(
    LIST_FILES_TOOL_DEFINITION.name,
    LIST_FILES_TOOL_DEFINITION.description,
    ListFilesSchema.shape,
    (args) => handleListFiles(args, client)
  );
  server.tool(
    UPLOAD_FILE_TOOL_DEFINITION.name,
    UPLOAD_FILE_TOOL_DEFINITION.description,
    UploadFileSchema.shape,
    (args) => handleUploadFile(args, client)
  );
  server.tool(
    UPLOAD_ATTACHMENT_TOOL_DEFINITION.name,
    UPLOAD_ATTACHMENT_TOOL_DEFINITION.description,
    UploadAttachmentSchema.shape,
    (args) => handleUploadAttachment(args, client)
  );
  server.tool(
    DOWNLOAD_ATTACHMENT_TOOL_DEFINITION.name,
    DOWNLOAD_ATTACHMENT_TOOL_DEFINITION.description,
    DownloadAttachmentSchema.shape,
    (args) => handleDownloadAttachment(args, client)
  );
}
