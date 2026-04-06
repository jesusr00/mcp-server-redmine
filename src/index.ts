import { createRequire } from "node:module";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { RedmineClient } from "@/client/redmine";
import { registerAllTools } from "@/tools";

const require = createRequire(import.meta.url);
const { version } = require("../package.json") as { version: string };

const REDMINE_URL = process.env["REDMINE_URL"];
const REDMINE_API_KEY = process.env["REDMINE_API_KEY"];

if (!REDMINE_URL || !REDMINE_API_KEY) {
  console.error("Error: Missing required environment variables.");
  console.error(
    "  REDMINE_URL     — Base URL of your Redmine instance (e.g. https://redmine.example.com)"
  );
  console.error("  REDMINE_API_KEY — Your Redmine API access key (found in your profile settings)");
  process.exit(1);
}

function validateRedmineUrl(raw: string): string {
  const parsed = (() => {
    try {
      return new URL(raw);
    } catch {
      console.error(`Error: REDMINE_URL is not a valid URL: ${raw}`);
      return process.exit(1) as never;
    }
  })();
  if (!["http:", "https:"].includes(parsed.protocol)) {
    console.error(`Error: REDMINE_URL must use http or https protocol, got: ${parsed.protocol}`);
    process.exit(1);
  }
  if (parsed.protocol === "http:") {
    console.error(
      "Warning: REDMINE_URL uses HTTP. The API key will be transmitted in cleartext. Use HTTPS in production."
    );
  }
  return parsed.origin + parsed.pathname.replace(/\/+$/, "");
}

const validatedUrl = validateRedmineUrl(REDMINE_URL);

async function main() {
  const client = new RedmineClient({ baseUrl: validatedUrl, apiKey: REDMINE_API_KEY! });
  const server = new McpServer({ name: "redmine-mcp", version });

  registerAllTools(server, client);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error("Fatal error:", message);
  process.exit(1);
});
