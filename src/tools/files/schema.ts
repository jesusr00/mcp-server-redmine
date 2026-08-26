import { isAbsolute } from "node:path";
import { z } from "zod";
import { mimeType, safeId } from "../common-schemas";

export const ListFilesSchema = z.object({
  project_id: safeId,
  limit: z.number().int().min(1).max(100).default(25),
  offset: z.number().int().min(0).default(0),
});

export const UploadFileSchema = z.object({
  project_id: safeId,
  token: z.string().min(1),
  filename: z.string().max(255).optional(),
  description: z.string().max(10000).optional(),
  version_id: z.number().int().positive().optional(),
});

export const UploadAttachmentSchema = z.object({
  file_path: z
    .string()
    .min(1)
    .max(4096)
    .regex(/^[^\0]+$/, "must not contain null bytes")
    .refine((p) => isAbsolute(p), "must be an absolute path"),
  filename: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[^\0]+$/, "must not contain null bytes")
    .optional(),
  content_type: mimeType.optional(),
});
