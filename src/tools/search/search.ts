import type { RedmineClient } from "../../client/redmine";
import { ok, withErrorHandling } from "../shared";
import { SearchSchema } from "./schema";

export const handleSearch = withErrorHandling(async (args: unknown, client: RedmineClient) => {
  const params = SearchSchema.parse(args);
  const data = await client.search(params);
  return ok(data);
});
