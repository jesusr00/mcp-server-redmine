import type { RedmineClient } from "../../client/redmine";
import { ok, withErrorHandling } from "../shared";
import { ListNewsSchema } from "./schema";

export const handleListNews = withErrorHandling(async (args: unknown, client: RedmineClient) => {
  const params = ListNewsSchema.parse(args);
  const data = await client.listNews(params);
  return ok(data);
});
