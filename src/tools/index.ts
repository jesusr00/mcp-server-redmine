import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { RedmineClient } from "@/client/redmine";
import { registerFileTools } from "./files";
import { registerIssueRelationTools } from "./issue-relations";
import { registerIssueTools } from "./issues";
import { registerNewsTools } from "./news";
import { registerProjectTools } from "./projects";
import { registerTimeEntryTools } from "./time-entries";
import { registerUserTools } from "./users";
import { registerWikiPageTools } from "./wiki-pages";

export function registerAllTools(server: McpServer, client: RedmineClient): void {
  registerFileTools(server, client);
  registerIssueRelationTools(server, client);
  registerIssueTools(server, client);
  registerNewsTools(server, client);
  registerProjectTools(server, client);
  registerTimeEntryTools(server, client);
  registerUserTools(server, client);
  registerWikiPageTools(server, client);
}