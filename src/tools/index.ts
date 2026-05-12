import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { RedmineClient } from "@/client/redmine";
import { registerFileTools } from "./files";
import { registerIssueTools } from "./issues";
import { registerNewsTools } from "./news";
import { registerMyAccountTools } from "./my-account";
import { registerProjectTools } from "./projects";
import { registerTimeEntryTools } from "./time-entries";
import { registerUserTools } from "./users";
import { registerWikiPageTools } from "./wiki-pages";

export function registerAllTools(server: McpServer, client: RedmineClient): void {
  registerFileTools(server, client);
  registerIssueTools(server, client);
  registerNewsTools(server, client);
  registerMyAccountTools(server, client);
  registerProjectTools(server, client);
  registerTimeEntryTools(server, client);
  registerUserTools(server, client);
  registerWikiPageTools(server, client);
}