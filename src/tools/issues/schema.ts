import { z } from "zod";

export const ListIssuesSchema = z.object({
  project_id: z.string().optional(),
  status_id: z.string().optional(),
  tracker_id: z.number().int().positive().optional(),
  assigned_to_id: z.number().int().positive().optional(),
  priority_id: z.number().int().positive().optional(),
  limit: z.number().int().min(1).max(100).default(25),
  offset: z.number().int().min(0).default(0),
  sort: z.string().optional(),
  include: z.string().optional(),
});

export const GetIssueSchema = z.object({
  id: z.number().int().positive(),
  include: z.string().optional(),
});

export const CreateIssueSchema = z.object({
  project_id: z.union([z.string(), z.number()]),
  subject: z.string().min(1),
  description: z.string().optional(),
  tracker_id: z.number().int().positive().optional(),
  status_id: z.number().int().positive().optional(),
  priority_id: z.number().int().positive().optional(),
  assigned_to_id: z.number().int().positive().optional(),
  start_date: z.string().optional(),
  due_date: z.string().optional(),
  estimated_hours: z.number().positive().optional(),
  done_ratio: z.number().int().min(0).max(100).optional(),
});

export const UpdateIssueSchema = z.object({
  id: z.number().int().positive(),
  subject: z.string().optional(),
  description: z.string().optional(),
  tracker_id: z.number().int().positive().optional(),
  status_id: z.number().int().positive().optional(),
  priority_id: z.number().int().positive().optional(),
  assigned_to_id: z.number().int().positive().optional(),
  start_date: z.string().optional(),
  due_date: z.string().optional(),
  estimated_hours: z.number().positive().optional(),
  done_ratio: z.number().int().min(0).max(100).optional(),
  notes: z.string().optional(),
});

export const DeleteIssueSchema = z.object({
  id: z.number().int().positive(),
});

