import { z } from "zod";
import { safeId } from "../common-schemas";

export const ListMembershipsSchema = z.object({
  project_id: safeId,
  limit: z.number().int().min(1).max(100).default(25),
  offset: z.number().int().min(0).default(0),
});

export const GetMembershipSchema = z.object({
  id: z.number().int().positive(),
});

export const CreateMembershipSchema = z.object({
  project_id: safeId,
  user_id: z.number().int().positive(),
  role_ids: z.array(z.number().int().positive()).min(1),
});

export const UpdateMembershipSchema = z.object({
  id: z.number().int().positive(),
  role_ids: z.array(z.number().int().positive()).min(1),
});

export const DeleteMembershipSchema = z.object({
  id: z.number().int().positive(),
});
