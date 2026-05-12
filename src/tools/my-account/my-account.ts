import type { RedmineClient } from "../../client/redmine";
import { ok, withErrorHandling } from "../shared";
import { GetMyAccountSchema } from "./schema";

export const handleGetMyAccount = withErrorHandling(
  async (_args: unknown, client: RedmineClient) => {
    GetMyAccountSchema.parse(_args);
    const data = await client.getMyAccount();
    return ok(data);
  }
);
