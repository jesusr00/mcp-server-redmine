import { z } from "zod";
import { safeInclude } from "../common-schemas";

export const ListUsersSchema = z.object({
  status: z.number().int().optional(),
  name: z.string().max(255).optional(),
  group_id: z.number().int().positive().optional(),
  limit: z.number().int().min(1).max(100).default(25),
  offset: z.number().int().min(0).default(0),
});

export const GetUserSchema = z.object({
  id: z.number().int().positive(),
  include: safeInclude.optional(),
});
