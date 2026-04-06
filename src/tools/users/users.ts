import type { RedmineClient } from "../../client/redmine";
import type { ToolResult } from "../../types/common";
import { GetUserSchema, ListUsersSchema } from "./schema";

function ok(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

function err(message: string): ToolResult {
  return { content: [{ type: "text", text: message }], isError: true };
}

export async function handleListUsers(args: unknown, client: RedmineClient): Promise<ToolResult> {
  const params = ListUsersSchema.parse(args);
  const data = await client.listUsers(params);
  return ok(data);
}

export async function handleGetUser(args: unknown, client: RedmineClient): Promise<ToolResult> {
  const { id, include } = GetUserSchema.parse(args);
  try {
    const data = await client.getUser(id, include);
    return ok(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (message.includes("404")) {
      return err(`User #${id} not found. Use redmine_list_users to find valid user IDs.`);
    }
    return err(message);
  }
}

export async function handleGetCurrentUser(_args: unknown, client: RedmineClient): Promise<ToolResult> {
  const data = await client.getCurrentUser();
  return ok(data);
}
