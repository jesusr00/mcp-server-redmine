import type { RedmineClient } from "../../client/redmine";
import { ok, withErrorHandling } from "../shared";
import {
  CreateIssueRelationSchema,
  DeleteIssueRelationSchema,
  GetIssueRelationSchema,
  ListIssueRelationsSchema,
} from "./schema";

export const handleListIssueRelations = withErrorHandling(
  async (args: unknown, client: RedmineClient) => {
    const { issue_id } = ListIssueRelationsSchema.parse(args);
    const data = await client.listIssueRelations(issue_id);
    return ok(data);
  }
);

export const handleGetIssueRelation = withErrorHandling(
  async (args: unknown, client: RedmineClient) => {
    const { id } = GetIssueRelationSchema.parse(args);
    const data = await client.getIssueRelation(id);
    return ok(data);
  }
);

export const handleCreateIssueRelation = withErrorHandling(
  async (args: unknown, client: RedmineClient) => {
    const { issue_id, ...params } = CreateIssueRelationSchema.parse(args);
    const data = await client.createIssueRelation(issue_id, params);
    return ok(data);
  }
);

export const handleDeleteIssueRelation = withErrorHandling(
  async (args: unknown, client: RedmineClient) => {
    const { id } = DeleteIssueRelationSchema.parse(args);
    await client.deleteIssueRelation(id);
    return ok({ success: true, message: `Relation #${id} deleted.` });
  }
);
