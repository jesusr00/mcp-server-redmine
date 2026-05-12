import { z } from "zod";
import { safeId } from "../common-schemas";

export const ListNewsSchema = z.object({
  project_id: safeId.optional(),
  limit: z.number().int().min(1).max(100).default(25),
  offset: z.number().int().min(0).default(0),
});
