import type { RedmineClient } from "../../client/redmine";
import { ok, withErrorHandling } from "../shared";
import { GetUserSchema, ListUsersSchema } from "./schema";

export const handleListUsers = withErrorHandling(async (args: unknown, client: RedmineClient) => {
  const params = ListUsersSchema.parse(args);
  const data = await client.listUsers(params);
  return ok(data);
});

export const handleGetUser = withErrorHandling(async (args: unknown, client: RedmineClient) => {
  const { id, include } = GetUserSchema.parse(args);
  const data = await client.getUser(id, include);
  return ok(data);
});

export const handleGetCurrentUser = withErrorHandling(async (_args: unknown, client: RedmineClient) => {
  const data = await client.getCurrentUser();
  return ok(data);
});
