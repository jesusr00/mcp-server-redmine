export const GET_MY_ACCOUNT_TOOL_DEFINITION = {
  name: "redmine_get_my_account",
  description:
    "[Stable] Get the full account details of the currently authenticated Redmine user, including email address, API key, and custom fields.",
  inputSchema: {
    type: "object",
    properties: {},
    required: [],
  },
} as const;
