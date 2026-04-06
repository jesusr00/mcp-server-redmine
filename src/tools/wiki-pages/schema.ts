import { z } from "zod";

export const ListWikiPagesSchema = z.object({
  project_id: z.union([z.string(), z.number()]),
});

export const GetWikiPageSchema = z.object({
  project_id: z.union([z.string(), z.number()]),
  title: z.string().min(1),
});

export const UpdateWikiPageSchema = z.object({
  project_id: z.union([z.string(), z.number()]),
  title: z.string().min(1),
  text: z.string(),
  comments: z.string().optional(),
  version: z.number().int().positive().optional(),
});

export const DeleteWikiPageSchema = z.object({
  project_id: z.union([z.string(), z.number()]),
  title: z.string().min(1),
});
