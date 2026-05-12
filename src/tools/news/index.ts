import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import type { RedmineClient } from "@/client/redmine";
import { handleListNews } from "./news";
import { ListNewsSchema } from "./schema";
import { LIST_NEWS_TOOL_DEFINITION } from "./definition";

export function registerNewsTools(server: McpServer, client: RedmineClient): void {
  server.tool(
    LIST_NEWS_TOOL_DEFINITION.name,
    LIST_NEWS_TOOL_DEFINITION.description,
    ListNewsSchema.shape,
    (args) => handleListNews(args, client)
  );
}
