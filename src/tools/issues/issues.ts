import type { RedmineClient } from "../../client/redmine";
import { ok, withErrorHandling } from "../shared";
import { CreateIssueSchema, DeleteIssueSchema, GetIssueSchema, ListIssuesSchema, UpdateIssueSchema } from "./schema";

export const handleListIssues = withErrorHandling(async (args: unknown, client: RedmineClient) => {
  const params = ListIssuesSchema.parse(args);
  const data = await client.listIssues(params);
  return ok(data);
});

export const handleGetIssue = withErrorHandling(async (args: unknown, client: RedmineClient) => {
  const { id, include } = GetIssueSchema.parse(args);
  const data = await client.getIssue(id, include);
  return ok(data);
});

export const handleCreateIssue = withErrorHandling(async (args: unknown, client: RedmineClient) => {
  const params = CreateIssueSchema.parse(args);
  const data = await client.createIssue(params);
  return ok(data);
});

export const handleUpdateIssue = withErrorHandling(async (args: unknown, client: RedmineClient) => {
  const { id, ...params } = UpdateIssueSchema.parse(args);
  await client.updateIssue(id, params);
  return ok({ success: true, message: `Issue #${id} updated successfully.` });
});

export const handleDeleteIssue = withErrorHandling(async (args: unknown, client: RedmineClient) => {
  const { id } = DeleteIssueSchema.parse(args);
  await client.deleteIssue(id);
  return ok({ success: true, message: `Issue #${id} deleted.` });
});
