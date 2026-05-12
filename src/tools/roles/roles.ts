import type { RedmineClient } from "../../client/redmine";
import { ok, withErrorHandling } from "../shared";
import { GetRoleSchema, ListRolesSchema } from "./schema";

export const handleListRoles = withErrorHandling(async (args: unknown, client: RedmineClient) => {
  const params = ListRolesSchema.parse(args);
  const data = await client.listRoles(params);
  return ok(data);
});

export const handleGetRole = withErrorHandling(async (args: unknown, client: RedmineClient) => {
  const { id } = GetRoleSchema.parse(args);
  const data = await client.getRole(id);
  return ok(data);
});