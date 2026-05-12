import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import type { RedmineClient } from "@/client/redmine";
import {
  handleCreateIssueRelation,
  handleDeleteIssueRelation,
  handleGetIssueRelation,
  handleListIssueRelations,
} from "./issue-relations";
import {
  CreateIssueRelationSchema,
  DeleteIssueRelationSchema,
  GetIssueRelationSchema,
  ListIssueRelationsSchema,
} from "./schema";
import {
  CREATE_ISSUE_RELATION_TOOL_DEFINITION,
  DELETE_ISSUE_RELATION_TOOL_DEFINITION,
  GET_ISSUE_RELATION_TOOL_DEFINITION,
  LIST_ISSUE_RELATIONS_TOOL_DEFINITION,
} from "./definition";

export function registerIssueRelationTools(server: McpServer, client: RedmineClient): void {
  server.tool(
    LIST_ISSUE_RELATIONS_TOOL_DEFINITION.name,
    LIST_ISSUE_RELATIONS_TOOL_DEFINITION.description,
    ListIssueRelationsSchema.shape,
    (args) => handleListIssueRelations(args, client)
  );

  server.tool(
    GET_ISSUE_RELATION_TOOL_DEFINITION.name,
    GET_ISSUE_RELATION_TOOL_DEFINITION.description,
    GetIssueRelationSchema.shape,
    (args) => handleGetIssueRelation(args, client)
  );

  server.tool(
    CREATE_ISSUE_RELATION_TOOL_DEFINITION.name,
    CREATE_ISSUE_RELATION_TOOL_DEFINITION.description,
    CreateIssueRelationSchema.shape,
    (args) => handleCreateIssueRelation(args, client)
  );

  server.tool(
    DELETE_ISSUE_RELATION_TOOL_DEFINITION.name,
    DELETE_ISSUE_RELATION_TOOL_DEFINITION.description,
    DeleteIssueRelationSchema.shape,
    (args) => handleDeleteIssueRelation(args, client)
  );
}
