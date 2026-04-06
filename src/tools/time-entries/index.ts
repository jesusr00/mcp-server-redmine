import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import type { RedmineClient } from "../../client/redmine";
import {
  handleDeleteTimeEntry,
  handleGetTimeEntry,
  handleListTimeEntries,
  handleLogTime,
  handleUpdateTimeEntry,
} from "./time-entries";
import {
  DeleteTimeEntrySchema,
  GetTimeEntrySchema,
  ListTimeEntriesSchema,
  LogTimeSchema,
  UpdateTimeEntrySchema,
} from "./schema";
import {
  DELETE_TIME_ENTRY_TOOL_DEFINITION,
  GET_TIME_ENTRY_TOOL_DEFINITION,
  LIST_TIME_ENTRIES_TOOL_DEFINITION,
  LOG_TIME_TOOL_DEFINITION,
  UPDATE_TIME_ENTRY_TOOL_DEFINITION,
} from "./definition";

export function registerTimeEntryTools(server: McpServer, client: RedmineClient): void {
  server.tool(
    LIST_TIME_ENTRIES_TOOL_DEFINITION.name,
    LIST_TIME_ENTRIES_TOOL_DEFINITION.description,
    ListTimeEntriesSchema.shape,
    (args) => handleListTimeEntries(args, client)
  );
  server.tool(
    GET_TIME_ENTRY_TOOL_DEFINITION.name,
    GET_TIME_ENTRY_TOOL_DEFINITION.description,
    GetTimeEntrySchema.shape,
    (args) => handleGetTimeEntry(args, client)
  );
  server.tool(
    LOG_TIME_TOOL_DEFINITION.name,
    LOG_TIME_TOOL_DEFINITION.description,
    LogTimeSchema.shape,
    (args) => handleLogTime(args, client)
  );
  server.tool(
    UPDATE_TIME_ENTRY_TOOL_DEFINITION.name,
    UPDATE_TIME_ENTRY_TOOL_DEFINITION.description,
    UpdateTimeEntrySchema.shape,
    (args) => handleUpdateTimeEntry(args, client)
  );
  server.tool(
    DELETE_TIME_ENTRY_TOOL_DEFINITION.name,
    DELETE_TIME_ENTRY_TOOL_DEFINITION.description,
    DeleteTimeEntrySchema.shape,
    (args) => handleDeleteTimeEntry(args, client)
  );
}
