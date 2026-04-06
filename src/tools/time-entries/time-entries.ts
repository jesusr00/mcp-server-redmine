import type { RedmineClient } from "../../client/redmine";
import { ok, err, withErrorHandling } from "../shared";
import {
  DeleteTimeEntrySchema,
  GetTimeEntrySchema,
  ListTimeEntriesSchema,
  LogTimeSchema,
  UpdateTimeEntrySchema,
} from "./schema";

export const handleListTimeEntries = withErrorHandling(async (args: unknown, client: RedmineClient) => {
  const params = ListTimeEntriesSchema.parse(args);
  const data = await client.listTimeEntries(params);
  return ok(data);
});

export const handleGetTimeEntry = withErrorHandling(async (args: unknown, client: RedmineClient) => {
  const { id } = GetTimeEntrySchema.parse(args);
  const data = await client.getTimeEntry(id);
  return ok(data);
});

export const handleLogTime = withErrorHandling(async (args: unknown, client: RedmineClient) => {
  const params = LogTimeSchema.parse(args);
  if (!params.issue_id && !params.project_id) {
    return err("Either issue_id or project_id is required to log time.");
  }
  const data = await client.createTimeEntry(params);
  return ok(data);
});

export const handleUpdateTimeEntry = withErrorHandling(async (args: unknown, client: RedmineClient) => {
  const { id, ...params } = UpdateTimeEntrySchema.parse(args);
  await client.updateTimeEntry(id, params);
  return ok({ success: true, message: `Time entry #${id} updated successfully.` });
});

export const handleDeleteTimeEntry = withErrorHandling(async (args: unknown, client: RedmineClient) => {
  const { id } = DeleteTimeEntrySchema.parse(args);
  await client.deleteTimeEntry(id);
  return ok({ success: true, message: `Time entry #${id} deleted.` });
});
