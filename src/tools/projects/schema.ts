import { z } from "zod";
import { safeId, safeInclude } from "../common-schemas";

export const ListProjectsSchema = z.object({
  limit: z.number().int().min(1).max(100).default(25),
  offset: z.number().int().min(0).default(0),
  include: safeInclude.optional(),
});

export const GetProjectSchema = z.object({
  id: safeId,
});

export const CreateProjectSchema = z.object({
  name: z.string().min(1).max(255),
  identifier: z.string().min(1).max(255).regex(/^[a-z0-9_-]+$/),
  description: z.string().max(100000).optional(),
  is_public: z.boolean().optional(),
  inherit_members: z.boolean().optional(),
});

export const UpdateProjectSchema = z.object({
  id: safeId,
  name: z.string().max(255).optional(),
  description: z.string().max(100000).optional(),
  is_public: z.boolean().optional(),
  inherit_members: z.boolean().optional(),
});
