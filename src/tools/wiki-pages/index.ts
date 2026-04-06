import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import type { RedmineClient } from "../../client/redmine";
import {
  handleDeleteWikiPage,
  handleGetWikiPage,
  handleListWikiPages,
  handleUpdateWikiPage,
} from "./wiki-pages";
import {
  DeleteWikiPageSchema,
  GetWikiPageSchema,
  ListWikiPagesSchema,
  UpdateWikiPageSchema,
} from "./schema";
import {
  DELETE_WIKI_PAGE_TOOL_DEFINITION,
  GET_WIKI_PAGE_TOOL_DEFINITION,
  LIST_WIKI_PAGES_TOOL_DEFINITION,
  UPDATE_WIKI_PAGE_TOOL_DEFINITION,
} from "./definition";

export function registerWikiPageTools(server: McpServer, client: RedmineClient): void {
  server.tool(
    LIST_WIKI_PAGES_TOOL_DEFINITION.name,
    LIST_WIKI_PAGES_TOOL_DEFINITION.description,
    ListWikiPagesSchema.shape,
    (args) => handleListWikiPages(args, client)
  );
  server.tool(
    GET_WIKI_PAGE_TOOL_DEFINITION.name,
    GET_WIKI_PAGE_TOOL_DEFINITION.description,
    GetWikiPageSchema.shape,
    (args) => handleGetWikiPage(args, client)
  );
  server.tool(
    UPDATE_WIKI_PAGE_TOOL_DEFINITION.name,
    UPDATE_WIKI_PAGE_TOOL_DEFINITION.description,
    UpdateWikiPageSchema.shape,
    (args) => handleUpdateWikiPage(args, client)
  );
  server.tool(
    DELETE_WIKI_PAGE_TOOL_DEFINITION.name,
    DELETE_WIKI_PAGE_TOOL_DEFINITION.description,
    DeleteWikiPageSchema.shape,
    (args) => handleDeleteWikiPage(args, client)
  );
}
