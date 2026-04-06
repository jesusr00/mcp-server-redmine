import type { RedmineClient } from "../../client/redmine";
import { ok, withErrorHandling } from "../shared";
import { CreateProjectSchema, GetProjectSchema, ListProjectsSchema, UpdateProjectSchema } from "./schema";

export const handleListProjects = withErrorHandling(async (args: unknown, client: RedmineClient) => {
  const params = ListProjectsSchema.parse(args);
  const data = await client.listProjects(params);
  return ok(data);
});

export const handleGetProject = withErrorHandling(async (args: unknown, client: RedmineClient) => {
  const { id } = GetProjectSchema.parse(args);
  const data = await client.getProject(id);
  return ok(data);
});

export const handleCreateProject = withErrorHandling(async (args: unknown, client: RedmineClient) => {
  const params = CreateProjectSchema.parse(args);
  const data = await client.createProject(params);
  return ok(data);
});

export const handleUpdateProject = withErrorHandling(async (args: unknown, client: RedmineClient) => {
  const { id, ...params } = UpdateProjectSchema.parse(args);
  await client.updateProject(id, params);
  return ok({ success: true, message: `Project '${id}' updated successfully.` });
});
