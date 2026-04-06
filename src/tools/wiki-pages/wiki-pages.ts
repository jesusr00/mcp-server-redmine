import type { RedmineClient } from "../../client/redmine";
import { ok, withErrorHandling } from "../shared";
import {
  DeleteWikiPageSchema,
  GetWikiPageSchema,
  ListWikiPagesSchema,
  UpdateWikiPageSchema,
} from "./schema";

export const handleListWikiPages = withErrorHandling(
  async (args: unknown, client: RedmineClient) => {
    const { project_id } = ListWikiPagesSchema.parse(args);
    const data = await client.listWikiPages(project_id);
    return ok(data);
  }
);

export const handleGetWikiPage = withErrorHandling(async (args: unknown, client: RedmineClient) => {
  const { project_id, title } = GetWikiPageSchema.parse(args);
  const data = await client.getWikiPage(project_id, title);
  return ok(data);
});

export const handleUpdateWikiPage = withErrorHandling(
  async (args: unknown, client: RedmineClient) => {
    const { project_id, title, ...params } = UpdateWikiPageSchema.parse(args);
    await client.updateWikiPage(project_id, title, params);
    return ok({ success: true, message: `Wiki page '${title}' in project '${project_id}' saved.` });
  }
);

export const handleDeleteWikiPage = withErrorHandling(
  async (args: unknown, client: RedmineClient) => {
    const { project_id, title } = DeleteWikiPageSchema.parse(args);
    await client.deleteWikiPage(project_id, title);
    return ok({
      success: true,
      message: `Wiki page '${title}' deleted from project '${project_id}'.`,
    });
  }
);
