import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import type { RedmineClient } from "@/client/redmine";
import {
  handleCreateMembership,
  handleDeleteMembership,
  handleGetMembership,
  handleListMemberships,
  handleUpdateMembership,
} from "./memberships";
import {
  CreateMembershipSchema,
  DeleteMembershipSchema,
  GetMembershipSchema,
  ListMembershipsSchema,
  UpdateMembershipSchema,
} from "./schema";
import {
  CREATE_MEMBERSHIP_TOOL_DEFINITION,
  DELETE_MEMBERSHIP_TOOL_DEFINITION,
  GET_MEMBERSHIP_TOOL_DEFINITION,
  LIST_MEMBERSHIPS_TOOL_DEFINITION,
  UPDATE_MEMBERSHIP_TOOL_DEFINITION,
} from "./definition";

export function registerMembershipTools(server: McpServer, client: RedmineClient): void {
  server.tool(
    LIST_MEMBERSHIPS_TOOL_DEFINITION.name,
    LIST_MEMBERSHIPS_TOOL_DEFINITION.description,
    ListMembershipsSchema.shape,
    (args) => handleListMemberships(args, client)
  );

  server.tool(
    GET_MEMBERSHIP_TOOL_DEFINITION.name,
    GET_MEMBERSHIP_TOOL_DEFINITION.description,
    GetMembershipSchema.shape,
    (args) => handleGetMembership(args, client)
  );

  server.tool(
    CREATE_MEMBERSHIP_TOOL_DEFINITION.name,
    CREATE_MEMBERSHIP_TOOL_DEFINITION.description,
    CreateMembershipSchema.shape,
    (args) => handleCreateMembership(args, client)
  );

  server.tool(
    UPDATE_MEMBERSHIP_TOOL_DEFINITION.name,
    UPDATE_MEMBERSHIP_TOOL_DEFINITION.description,
    UpdateMembershipSchema.shape,
    (args) => handleUpdateMembership(args, client)
  );

  server.tool(
    DELETE_MEMBERSHIP_TOOL_DEFINITION.name,
    DELETE_MEMBERSHIP_TOOL_DEFINITION.description,
    DeleteMembershipSchema.shape,
    (args) => handleDeleteMembership(args, client)
  );
}
