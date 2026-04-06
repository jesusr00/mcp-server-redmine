import { z } from "zod";

export const ListProjectsSchema = z.object({
  limit: z.number().int().min(1).max(100).default(25),
  offset: z.number().int().min(0).default(0),
  include: z.string().optional(),
});

export const GetProjectSchema = z.object({
  id: z.union([z.string(), z.number()]),
});

export const CreateProjectSchema = z.object({
  name: z.string().min(1),
  identifier: z.string().min(1),
  description: z.string().optional(),
  is_public: z.boolean().optional(),
  inherit_members: z.boolean().optional(),
});

export const UpdateProjectSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string().optional(),
  description: z.string().optional(),
  is_public: z.boolean().optional(),
  inherit_members: z.boolean().optional(),
});
