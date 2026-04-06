import { z } from "zod";
import { safeId } from "../common-schemas";

export const ListWikiPagesSchema = z.object({
  project_id: safeId,
});

export const GetWikiPageSchema = z.object({
  project_id: safeId,
  title: z.string().min(1).max(255),
});

export const UpdateWikiPageSchema = z.object({
  project_id: safeId,
  title: z.string().min(1).max(255),
  text: z.string().max(500000),
  comments: z.string().max(10000).optional(),
  version: z.number().int().positive().optional(),
});

export const DeleteWikiPageSchema = z.object({
  project_id: safeId,
  title: z.string().min(1).max(255),
});
