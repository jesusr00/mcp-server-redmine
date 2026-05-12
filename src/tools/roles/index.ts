import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import type { RedmineClient } from "@/client/redmine";
import { handleGetRole, handleListRoles } from "./roles";
import { GetRoleSchema, ListRolesSchema } from "./schema";
import { GET_ROLE_TOOL_DEFINITION, LIST_ROLES_TOOL_DEFINITION } from "./definition";

export function registerRoleTools(server: McpServer, client: RedmineClient): void {
  server.tool(
    LIST_ROLES_TOOL_DEFINITION.name,
    LIST_ROLES_TOOL_DEFINITION.description,
    ListRolesSchema.shape,
    (args) => handleListRoles(args, client)
  );
  server.tool(
    GET_ROLE_TOOL_DEFINITION.name,
    GET_ROLE_TOOL_DEFINITION.description,
    GetRoleSchema.shape,
    (args) => handleGetRole(args, client)
  );
}