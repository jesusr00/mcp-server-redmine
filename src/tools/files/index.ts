import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import type { RedmineClient } from "@/client/redmine";
import { handleListFiles, handleUploadFile } from "./files";
import { ListFilesSchema, UploadFileSchema } from "./schema";
import { LIST_FILES_TOOL_DEFINITION, UPLOAD_FILE_TOOL_DEFINITION } from "./definition";

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
}
