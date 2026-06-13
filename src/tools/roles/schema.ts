import { z } from "zod";

export const ListRolesSchema = z.object({
  limit: z.number().int().min(1).max(100).default(25),
  offset: z.number().int().min(0).default(0),
});

export const GetRoleSchema = z.object({
  id: z.number().int().positive(),
});
