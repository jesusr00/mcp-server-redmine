import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { RedmineClient } from "@/client/redmine";
import { registerAllTools } from "@/tools";

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

async function main() {
  const client = new RedmineClient({ baseUrl: REDMINE_URL!, apiKey: REDMINE_API_KEY! });
  const server = new McpServer({ name: "redmine-mcp", version: "0.1.0" });

  registerAllTools(server, client);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err: unknown) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
