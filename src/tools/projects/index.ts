import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import type { RedmineClient } from "../../client/redmine";
import {
  handleCreateProject,
  handleGetProject,
  handleListProjects,
  handleUpdateProject,
} from "./projects";
import {
  CreateProjectSchema,
  GetProjectSchema,
  ListProjectsSchema,
  UpdateProjectSchema,
} from "./schema";
import {
  CREATE_PROJECT_TOOL_DEFINITION,
  GET_PROJECT_TOOL_DEFINITION,
  LIST_PROJECTS_TOOL_DEFINITION,
  UPDATE_PROJECT_TOOL_DEFINITION,
} from "./definition";

export function registerProjectTools(server: McpServer, client: RedmineClient): void {
  server.tool(
    LIST_PROJECTS_TOOL_DEFINITION.name,
    LIST_PROJECTS_TOOL_DEFINITION.description,
    ListProjectsSchema.shape,
    (args) => handleListProjects(args, client)
  );
  server.tool(
    GET_PROJECT_TOOL_DEFINITION.name,
    GET_PROJECT_TOOL_DEFINITION.description,
    GetProjectSchema.shape,
    (args) => handleGetProject(args, client)
  );
  server.tool(
    CREATE_PROJECT_TOOL_DEFINITION.name,
    CREATE_PROJECT_TOOL_DEFINITION.description,
    CreateProjectSchema.shape,
    (args) => handleCreateProject(args, client)
  );
  server.tool(
    UPDATE_PROJECT_TOOL_DEFINITION.name,
    UPDATE_PROJECT_TOOL_DEFINITION.description,
    UpdateProjectSchema.shape,
    (args) => handleUpdateProject(args, client)
  );
}
