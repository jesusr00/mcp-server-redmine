import { z } from "zod";

export const SearchSchema = z.object({
  q: z.string().min(1).max(1000),
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(25),
  scope: z.enum(["all", "my_project", "subprojects"]).optional(),
  all_words: z.boolean().optional(),
  titles_only: z.boolean().optional(),
  issues: z.boolean().optional(),
  news: z.boolean().optional(),
  documents: z.boolean().optional(),
  changesets: z.boolean().optional(),
  wiki_pages: z.boolean().optional(),
  messages: z.boolean().optional(),
  projects: z.boolean().optional(),
  open_issues: z.boolean().optional(),
  attachments: z.enum(["0", "1", "only"]).optional(),
});
