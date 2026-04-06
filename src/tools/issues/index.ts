import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import type { RedmineClient } from "@/client/redmine";
import {
  handleCreateIssue,
  handleDeleteIssue,
  handleGetIssue,
  handleListIssues,
  handleUpdateIssue,
} from "./issues";
import {
  CreateIssueSchema,
  DeleteIssueSchema,
  GetIssueSchema,
  ListIssuesSchema,
  UpdateIssueSchema,
} from "./schema";
import {
  CREATE_ISSUE_TOOL_DEFINITION,
  DELETE_ISSUE_TOOL_DEFINITION,
  GET_ISSUE_TOOL_DEFINITION,
  LIST_ISSUES_TOOL_DEFINITION,
  UPDATE_ISSUE_TOOL_DEFINITION,
} from "./definition";

export function registerIssueTools(server: McpServer, client: RedmineClient): void {
  server.tool(
    LIST_ISSUES_TOOL_DEFINITION.name,
    LIST_ISSUES_TOOL_DEFINITION.description,
    ListIssuesSchema.shape,
    (args) => handleListIssues(args, client)
  );

  server.tool(
    GET_ISSUE_TOOL_DEFINITION.name,
    GET_ISSUE_TOOL_DEFINITION.description,
    GetIssueSchema.shape,
    (args) => handleGetIssue(args, client)
  );

  server.tool(
    CREATE_ISSUE_TOOL_DEFINITION.name,
    CREATE_ISSUE_TOOL_DEFINITION.description,
    CreateIssueSchema.shape,
    (args) => handleCreateIssue(args, client)
  );

  server.tool(
    UPDATE_ISSUE_TOOL_DEFINITION.name,
    UPDATE_ISSUE_TOOL_DEFINITION.description,
    UpdateIssueSchema.shape,
    (args) => handleUpdateIssue(args, client)
  );

  server.tool(
    DELETE_ISSUE_TOOL_DEFINITION.name,
    DELETE_ISSUE_TOOL_DEFINITION.description,
    DeleteIssueSchema.shape,
    (args) => handleDeleteIssue(args, client)
  );
}
