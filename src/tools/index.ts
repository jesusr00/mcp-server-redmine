import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { RedmineClient } from "@/client/redmine";
import { registerIssueTools } from "./issues";
import { registerProjectTools } from "./projects";
import { registerTimeEntryTools } from "./time-entries";
import { registerUserTools } from "./users";
import { registerWikiPageTools } from "./wiki-pages";

export function registerAllTools(server: McpServer, client: RedmineClient): void {
  registerIssueTools(server, client);
  registerProjectTools(server, client);
  registerUserTools(server, client);
  registerTimeEntryTools(server, client);
  registerWikiPageTools(server, client);
}
