import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import type { RedmineClient } from "../../client/redmine";
import { handleGetMyAccount } from "./my-account";
import { GET_MY_ACCOUNT_TOOL_DEFINITION } from "./definition";

export function registerMyAccountTools(server: McpServer, client: RedmineClient): void {
  server.tool(
    GET_MY_ACCOUNT_TOOL_DEFINITION.name,
    GET_MY_ACCOUNT_TOOL_DEFINITION.description,
    z.object({}).shape,
    (_args) => handleGetMyAccount(_args, client)
  );
}
