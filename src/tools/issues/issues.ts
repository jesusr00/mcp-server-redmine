import type { RedmineClient } from "../../client/redmine";
import type { ToolResult } from "../../types/common";
import { CreateIssueSchema, DeleteIssueSchema, GetIssueSchema, ListIssuesSchema, UpdateIssueSchema } from "./schema";

function ok(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

function err(message: string): ToolResult {
  return { content: [{ type: "text", text: message }], isError: true };
}

export async function handleListIssues(args: unknown, client: RedmineClient): Promise<ToolResult> {
  const params = ListIssuesSchema.parse(args);
  const data = await client.listIssues(params);
  return ok(data);
}

export async function handleGetIssue(args: unknown, client: RedmineClient): Promise<ToolResult> {
  const { id, include } = GetIssueSchema.parse(args);
  try {
    const data = await client.getIssue(id, include);
    return ok(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (message.includes("404")) {
      return err(`Issue #${id} not found. Use redmine_list_issues to find valid issue IDs.`);
    }
    return err(message);
  }
}

export async function handleCreateIssue(args: unknown, client: RedmineClient): Promise<ToolResult> {
  const params = CreateIssueSchema.parse(args);
  const data = await client.createIssue(params);
  return ok(data);
}

export async function handleUpdateIssue(args: unknown, client: RedmineClient): Promise<ToolResult> {
  const { id, ...params } = UpdateIssueSchema.parse(args);
  try {
    await client.updateIssue(id, params);
    return ok({ success: true, message: `Issue #${id} updated successfully.` });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (message.includes("404")) {
      return err(`Issue #${id} not found. Use redmine_list_issues to find valid issue IDs.`);
    }
    return err(message);
  }
}

export async function handleDeleteIssue(args: unknown, client: RedmineClient): Promise<ToolResult> {
  const { id } = DeleteIssueSchema.parse(args);
  try {
    await client.deleteIssue(id);
    return ok({ success: true, message: `Issue #${id} deleted.` });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (message.includes("404")) {
      return err(`Issue #${id} not found.`);
    }
    return err(message);
  }
}
