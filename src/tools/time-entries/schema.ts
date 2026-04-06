import { z } from "zod";
import { safeId, isoDate } from "../common-schemas";

export const ListTimeEntriesSchema = z.object({
  project_id: z.string().regex(/^[a-zA-Z0-9_-]+$/).optional(),
  issue_id: z.number().int().positive().optional(),
  user_id: z.number().int().positive().optional(),
  from: isoDate.optional(),
  to: isoDate.optional(),
  limit: z.number().int().min(1).max(100).default(25),
  offset: z.number().int().min(0).default(0),
});

export const GetTimeEntrySchema = z.object({
  id: z.number().int().positive(),
});

export const LogTimeSchema = z.object({
  hours: z.number().positive(),
  activity_id: z.number().int().positive(),
  issue_id: z.number().int().positive().optional(),
  project_id: safeId.optional(),
  spent_on: isoDate.optional(),
  comments: z.string().max(10000).optional(),
});

export const UpdateTimeEntrySchema = z.object({
  id: z.number().int().positive(),
  hours: z.number().positive().optional(),
  activity_id: z.number().int().positive().optional(),
  spent_on: isoDate.optional(),
  comments: z.string().max(10000).optional(),
});

export const DeleteTimeEntrySchema = z.object({
  id: z.number().int().positive(),
});
