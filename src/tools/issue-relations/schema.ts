import { z } from "zod";

const relationTypeEnum = z.enum([
  "relates",
  "duplicates",
  "duplicated",
  "blocks",
  "blocked",
  "precedes",
  "follows",
  "copied_to",
  "copied_from",
]);

export const ListIssueRelationsSchema = z.object({
  issue_id: z.number().int().positive(),
});

export const GetIssueRelationSchema = z.object({
  id: z.number().int().positive(),
});

export const CreateIssueRelationSchema = z.object({
  issue_id: z.number().int().positive(),
  issue_to_id: z.number().int().positive(),
  relation_type: relationTypeEnum.default("relates"),
  delay: z.number().int().optional(),
});

export const DeleteIssueRelationSchema = z.object({
  id: z.number().int().positive(),
});
