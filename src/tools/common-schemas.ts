import { z } from "zod";

export const safeId = z.union([z.string().regex(/^[a-zA-Z0-9_-]+$/), z.number().int().positive()]);
export const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const safeSort = z
  .string()
  .regex(/^[a-z_]+(:(asc|desc))?(,[a-z_]+(:(asc|desc))?)*$/i)
  .max(200);
export const safeInclude = z
  .string()
  .regex(/^[a-z_]+(,[a-z_]+)*$/)
  .max(200);
export const CustomFieldSchema = z.object({
  id: z.number().int().positive(),
  value: z.string().max(100000),
});
export const mimeType = z
  .string()
  .regex(/^[\w.+-]+\/[\w.+-]+$/, "must be a valid MIME type")
  .max(255);
export const UploadRefSchema = z.object({
  token: z.string().min(1).max(255),
  filename: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[^\0]+$/, "must not contain null bytes"),
  content_type: mimeType.optional(),
  description: z.string().max(10000).optional(),
});
