import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import type { RedmineClient } from "../../client/redmine";
import { handleGetCurrentUser, handleGetUser, handleListUsers } from "./users";
import { GetUserSchema, ListUsersSchema } from "./schema";
import {
  GET_CURRENT_USER_TOOL_DEFINITION,
  GET_USER_TOOL_DEFINITION,
  LIST_USERS_TOOL_DEFINITION,
} from "./definition";

export function registerUserTools(server: McpServer, client: RedmineClient): void {
  server.tool(
    LIST_USERS_TOOL_DEFINITION.name,
    LIST_USERS_TOOL_DEFINITION.description,
    ListUsersSchema.shape,
    (args) => handleListUsers(args, client)
  );
  server.tool(
    GET_USER_TOOL_DEFINITION.name,
    GET_USER_TOOL_DEFINITION.description,
    GetUserSchema.shape,
    (args) => handleGetUser(args, client)
  );
  server.tool(
    GET_CURRENT_USER_TOOL_DEFINITION.name,
    GET_CURRENT_USER_TOOL_DEFINITION.description,
    z.object({}).shape,
    (_args) => handleGetCurrentUser(_args, client)
  );
}
