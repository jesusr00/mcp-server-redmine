import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import type { RedmineClient } from "@/client/redmine";
import { handleSearch } from "./search";
import { SearchSchema } from "./schema";
import { SEARCH_TOOL_DEFINITION } from "./definition";

export function registerSearchTools(server: McpServer, client: RedmineClient): void {
  server.tool(
    SEARCH_TOOL_DEFINITION.name,
    SEARCH_TOOL_DEFINITION.description,
    SearchSchema.shape,
    (args) => handleSearch(args, client)
  );
}
