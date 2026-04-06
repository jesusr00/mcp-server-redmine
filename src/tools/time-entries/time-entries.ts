import type { RedmineClient } from "../../client/redmine";
import type { ToolResult } from "../../types/common";
import {
  DeleteTimeEntrySchema,
  GetTimeEntrySchema,
  ListTimeEntriesSchema,
  LogTimeSchema,
  UpdateTimeEntrySchema,
} from "./schema";

function ok(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

function err(message: string): ToolResult {
  return { content: [{ type: "text", text: message }], isError: true };
}

export async function handleListTimeEntries(args: unknown, client: RedmineClient): Promise<ToolResult> {
  const params = ListTimeEntriesSchema.parse(args);
  const data = await client.listTimeEntries(params);
  return ok(data);
}

export async function handleGetTimeEntry(args: unknown, client: RedmineClient): Promise<ToolResult> {
  const { id } = GetTimeEntrySchema.parse(args);
  try {
    const data = await client.getTimeEntry(id);
    return ok(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (message.includes("404")) {
      return err(`Time entry #${id} not found. Use redmine_list_time_entries to find valid IDs.`);
    }
    return err(message);
  }
}

export async function handleLogTime(args: unknown, client: RedmineClient): Promise<ToolResult> {
  const params = LogTimeSchema.parse(args);
  if (!params.issue_id && !params.project_id) {
    return err("Either issue_id or project_id is required to log time.");
  }
  const data = await client.createTimeEntry(params);
  return ok(data);
}

export async function handleUpdateTimeEntry(args: unknown, client: RedmineClient): Promise<ToolResult> {
  const { id, ...params } = UpdateTimeEntrySchema.parse(args);
  try {
    await client.updateTimeEntry(id, params);
    return ok({ success: true, message: `Time entry #${id} updated successfully.` });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (message.includes("404")) {
      return err(`Time entry #${id} not found.`);
    }
    return err(message);
  }
}

export async function handleDeleteTimeEntry(args: unknown, client: RedmineClient): Promise<ToolResult> {
  const { id } = DeleteTimeEntrySchema.parse(args);
  try {
    await client.deleteTimeEntry(id);
    return ok({ success: true, message: `Time entry #${id} deleted.` });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (message.includes("404")) {
      return err(`Time entry #${id} not found.`);
    }
    return err(message);
  }
}
