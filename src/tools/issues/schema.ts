import { z } from "zod";
import { safeId, isoDate, safeSort, safeInclude } from "../common-schemas";

export const ListIssuesSchema = z.object({
  project_id: z.string().regex(/^[a-zA-Z0-9_-]+$/).optional(),
  status_id: z.string().regex(/^(\*|open|closed|[0-9]+)$/).optional(),
  tracker_id: z.number().int().positive().optional(),
  assigned_to_id: z.number().int().positive().optional(),
  priority_id: z.number().int().positive().optional(),
  limit: z.number().int().min(1).max(100).default(25),
  offset: z.number().int().min(0).default(0),
  sort: safeSort.optional(),
  include: safeInclude.optional(),
});

export const GetIssueSchema = z.object({
  id: z.number().int().positive(),
  include: safeInclude.optional(),
});

export const CreateIssueSchema = z.object({
  project_id: safeId,
  subject: z.string().min(1).max(255),
  description: z.string().max(100000).optional(),
  tracker_id: z.number().int().positive().optional(),
  status_id: z.number().int().positive().optional(),
  priority_id: z.number().int().positive().optional(),
  assigned_to_id: z.number().int().positive().optional(),
  start_date: isoDate.optional(),
  due_date: isoDate.optional(),
  estimated_hours: z.number().positive().optional(),
  done_ratio: z.number().int().min(0).max(100).optional(),
});

export const UpdateIssueSchema = z.object({
  id: z.number().int().positive(),
  subject: z.string().max(255).optional(),
  description: z.string().max(100000).optional(),
  tracker_id: z.number().int().positive().optional(),
  status_id: z.number().int().positive().optional(),
  priority_id: z.number().int().positive().optional(),
  assigned_to_id: z.number().int().positive().optional(),
  start_date: isoDate.optional(),
  due_date: isoDate.optional(),
  estimated_hours: z.number().positive().optional(),
  done_ratio: z.number().int().min(0).max(100).optional(),
  notes: z.string().max(100000).optional(),
});

export const DeleteIssueSchema = z.object({
  id: z.number().int().positive(),
});

