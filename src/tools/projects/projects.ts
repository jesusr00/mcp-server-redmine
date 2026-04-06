import type { RedmineClient } from "../../client/redmine";
import type { ToolResult } from "../../types/common";
import { CreateProjectSchema, GetProjectSchema, ListProjectsSchema, UpdateProjectSchema } from "./schema";

function ok(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

function err(message: string): ToolResult {
  return { content: [{ type: "text", text: message }], isError: true };
}

export async function handleListProjects(args: unknown, client: RedmineClient): Promise<ToolResult> {
  const params = ListProjectsSchema.parse(args);
  const data = await client.listProjects(params);
  return ok(data);
}

export async function handleGetProject(args: unknown, client: RedmineClient): Promise<ToolResult> {
  const { id } = GetProjectSchema.parse(args);
  try {
    const data = await client.getProject(id);
    return ok(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (message.includes("404")) {
      return err(`Project '${id}' not found. Use redmine_list_projects to find valid project identifiers.`);
    }
    return err(message);
  }
}

export async function handleCreateProject(args: unknown, client: RedmineClient): Promise<ToolResult> {
  const params = CreateProjectSchema.parse(args);
  const data = await client.createProject(params);
  return ok(data);
}

export async function handleUpdateProject(args: unknown, client: RedmineClient): Promise<ToolResult> {
  const { id, ...params } = UpdateProjectSchema.parse(args);
  try {
    await client.updateProject(id, params);
    return ok({ success: true, message: `Project '${id}' updated successfully.` });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (message.includes("404")) {
      return err(`Project '${id}' not found. Use redmine_list_projects to find valid project identifiers.`);
    }
    return err(message);
  }
}
