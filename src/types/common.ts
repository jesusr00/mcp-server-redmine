export interface IdName {
  id: number;
  name: string;
}

export type ToolResult = {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
};
