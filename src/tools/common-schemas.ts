import { z } from "zod";

export const safeId = z.union([z.string().regex(/^[a-zA-Z0-9_-]+$/), z.number().int().positive()]);
export const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const safeSort = z.string().regex(/^[a-z_]+(:(asc|desc))?(,[a-z_]+(:(asc|desc))?)*$/i).max(200);
export const safeInclude = z.string().regex(/^[a-z_]+(,[a-z_]+)*$/).max(200);
