import { ZodError } from "zod";
import type { RedmineClient } from "@/client/redmine";
import type { ToolResult } from "@/types/common";

export function ok(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

export function err(message: string): ToolResult {
  return { content: [{ type: "text", text: message }], isError: true };
}

type ToolHandler = (args: unknown, client: RedmineClient) => Promise<ToolResult>;

export function withErrorHandling(handler: ToolHandler): ToolHandler {
  return async (args: unknown, client: RedmineClient): Promise<ToolResult> => {
    try {
      return await handler(args, client);
    } catch (e) {
      if (e instanceof ZodError) {
        const messages = e.errors.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
        return err(`Invalid input: ${messages.join("; ")}`);
      }
      const message = e instanceof Error ? e.message : String(e);
      return err(message);
    }
  };
}
