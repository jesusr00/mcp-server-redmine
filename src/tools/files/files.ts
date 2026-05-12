import type { RedmineClient } from "../../client/redmine";
import { ok, withErrorHandling } from "../shared";
import { ListFilesSchema, UploadFileSchema } from "./schema";

export const handleListFiles = withErrorHandling(async (args: unknown, client: RedmineClient) => {
  const params = ListFilesSchema.parse(args);
  const data = await client.listFiles(params);
  return ok(data);
});

export const handleUploadFile = withErrorHandling(async (args: unknown, client: RedmineClient) => {
  const { project_id, ...params } = UploadFileSchema.parse(args);
  const data = await client.uploadFile(project_id, params);
  return ok(data);
});