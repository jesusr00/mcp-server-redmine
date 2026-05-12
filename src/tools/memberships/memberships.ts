import type { RedmineClient } from "../../client/redmine";
import { ok, withErrorHandling } from "../shared";
import {
  CreateMembershipSchema,
  DeleteMembershipSchema,
  GetMembershipSchema,
  ListMembershipsSchema,
  UpdateMembershipSchema,
} from "./schema";

export const handleListMemberships = withErrorHandling(
  async (args: unknown, client: RedmineClient) => {
    const { project_id, ...params } = ListMembershipsSchema.parse(args);
    const data = await client.listMemberships(project_id, params);
    return ok(data);
  }
);

export const handleGetMembership = withErrorHandling(
  async (args: unknown, client: RedmineClient) => {
    const { id } = GetMembershipSchema.parse(args);
    const data = await client.getMembership(id);
    return ok(data);
  }
);

export const handleCreateMembership = withErrorHandling(
  async (args: unknown, client: RedmineClient) => {
    const { project_id, ...params } = CreateMembershipSchema.parse(args);
    const data = await client.createMembership(project_id, params);
    return ok(data);
  }
);

export const handleUpdateMembership = withErrorHandling(
  async (args: unknown, client: RedmineClient) => {
    const { id, role_ids } = UpdateMembershipSchema.parse(args);
    await client.updateMembership(id, { role_ids });
    return ok({ success: true, message: `Membership #${id} updated successfully.` });
  }
);

export const handleDeleteMembership = withErrorHandling(
  async (args: unknown, client: RedmineClient) => {
    const { id } = DeleteMembershipSchema.parse(args);
    await client.deleteMembership(id);
    return ok({ success: true, message: `Membership #${id} deleted.` });
  }
);
