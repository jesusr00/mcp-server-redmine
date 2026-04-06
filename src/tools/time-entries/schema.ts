import { z } from "zod";

export const ListTimeEntriesSchema = z.object({
  project_id: z.string().optional(),
  issue_id: z.number().int().positive().optional(),
  user_id: z.number().int().positive().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
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
  project_id: z.union([z.string(), z.number()]).optional(),
  spent_on: z.string().optional(),
  comments: z.string().optional(),
});

export const UpdateTimeEntrySchema = z.object({
  id: z.number().int().positive(),
  hours: z.number().positive().optional(),
  activity_id: z.number().int().positive().optional(),
  spent_on: z.string().optional(),
  comments: z.string().optional(),
});

export const DeleteTimeEntrySchema = z.object({
  id: z.number().int().positive(),
});
