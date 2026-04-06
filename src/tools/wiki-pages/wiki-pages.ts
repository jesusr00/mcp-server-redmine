import type { RedmineClient } from "../../client/redmine";
import type { ToolResult } from "../../types/common";
import { DeleteWikiPageSchema, GetWikiPageSchema, ListWikiPagesSchema, UpdateWikiPageSchema } from "./schema";

function ok(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

function err(message: string): ToolResult {
  return { content: [{ type: "text", text: message }], isError: true };
}

export async function handleListWikiPages(args: unknown, client: RedmineClient): Promise<ToolResult> {
  const { project_id } = ListWikiPagesSchema.parse(args);
  const data = await client.listWikiPages(project_id);
  return ok(data);
}

export async function handleGetWikiPage(args: unknown, client: RedmineClient): Promise<ToolResult> {
  const { project_id, title } = GetWikiPageSchema.parse(args);
  try {
    const data = await client.getWikiPage(project_id, title);
    return ok(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (message.includes("404")) {
      return err(
        `Wiki page '${title}' not found in project '${project_id}'. Use redmine_list_wiki_pages to see available pages.`,
      );
    }
    return err(message);
  }
}

export async function handleUpdateWikiPage(args: unknown, client: RedmineClient): Promise<ToolResult> {
  const { project_id, title, ...params } = UpdateWikiPageSchema.parse(args);
  await client.updateWikiPage(project_id, title, params);
  return ok({ success: true, message: `Wiki page '${title}' in project '${project_id}' saved.` });
}

export async function handleDeleteWikiPage(args: unknown, client: RedmineClient): Promise<ToolResult> {
  const { project_id, title } = DeleteWikiPageSchema.parse(args);
  try {
    await client.deleteWikiPage(project_id, title);
    return ok({ success: true, message: `Wiki page '${title}' deleted from project '${project_id}'.` });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (message.includes("404")) {
      return err(`Wiki page '${title}' not found in project '${project_id}'.`);
    }
    return err(message);
  }
}
