import { describe, expect, it } from "vitest";
import {
  ListIssuesSchema,
  CreateIssueSchema,
} from "./issues/schema";
import { GetProjectSchema } from "./projects/schema";
import {
  ListWikiPagesSchema,
  GetWikiPageSchema,
  UpdateWikiPageSchema,
  DeleteWikiPageSchema,
} from "./wiki-pages/schema";
import { LogTimeSchema } from "./time-entries/schema";

describe("Schema security validations", () => {
  describe("path traversal prevention", () => {
    const traversalPayloads = [
      "../../admin",
      "../users/current",
      "foo/../../admin",
      "foo/../bar",
      "project%2F..%2Fadmin",
      "project/wiki",
    ];

    it("rejects path traversal in project id (GetProjectSchema)", () => {
      for (const payload of traversalPayloads) {
        const result = GetProjectSchema.safeParse({ id: payload });
        expect(result.success, `Should reject "${payload}"`).toBe(false);
      }
    });

    it("rejects path traversal in project id (CreateIssueSchema)", () => {
      for (const payload of traversalPayloads) {
        const result = CreateIssueSchema.safeParse({
          project_id: payload,
          subject: "test",
        });
        expect(result.success, `Should reject "${payload}"`).toBe(false);
      }
    });

    it("rejects path traversal in wiki project_id", () => {
      for (const payload of traversalPayloads) {
        expect(
          ListWikiPagesSchema.safeParse({ project_id: payload }).success,
          `ListWikiPages should reject "${payload}"`
        ).toBe(false);
        expect(
          GetWikiPageSchema.safeParse({ project_id: payload, title: "test" }).success,
          `GetWikiPage should reject "${payload}"`
        ).toBe(false);
        expect(
          DeleteWikiPageSchema.safeParse({ project_id: payload, title: "test" }).success,
          `DeleteWikiPage should reject "${payload}"`
        ).toBe(false);
      }
    });

    it("rejects path traversal in time entry project_id", () => {
      for (const payload of traversalPayloads) {
        const result = LogTimeSchema.safeParse({
          hours: 1,
          activity_id: 1,
          project_id: payload,
        });
        expect(result.success, `Should reject "${payload}"`).toBe(false);
      }
    });

    it("accepts valid identifiers", () => {
      expect(GetProjectSchema.safeParse({ id: "my-project" }).success).toBe(true);
      expect(GetProjectSchema.safeParse({ id: "my_project_123" }).success).toBe(true);
      expect(GetProjectSchema.safeParse({ id: 42 }).success).toBe(true);
    });
  });

  describe("sort parameter validation", () => {
    it("accepts valid sort values", () => {
      expect(ListIssuesSchema.safeParse({ sort: "updated_on:desc" }).success).toBe(true);
      expect(ListIssuesSchema.safeParse({ sort: "priority:asc,updated_on:desc" }).success).toBe(true);
      expect(ListIssuesSchema.safeParse({ sort: "id" }).success).toBe(true);
    });

    it("rejects SQL injection attempts in sort", () => {
      expect(ListIssuesSchema.safeParse({ sort: "id;DROP TABLE issues" }).success).toBe(false);
      expect(ListIssuesSchema.safeParse({ sort: "id:desc,SLEEP(5)" }).success).toBe(false);
      expect(ListIssuesSchema.safeParse({ sort: "id' OR 1=1--" }).success).toBe(false);
    });
  });

  describe("include parameter validation", () => {
    it("accepts valid include values", () => {
      expect(ListIssuesSchema.safeParse({ include: "journals" }).success).toBe(true);
      expect(ListIssuesSchema.safeParse({ include: "journals,attachments" }).success).toBe(true);
    });

    it("rejects malicious include values", () => {
      expect(ListIssuesSchema.safeParse({ include: "journals;DROP TABLE" }).success).toBe(false);
      expect(ListIssuesSchema.safeParse({ include: "../admin" }).success).toBe(false);
    });
  });

  describe("status_id validation", () => {
    it("accepts valid status_id values", () => {
      expect(ListIssuesSchema.safeParse({ status_id: "open" }).success).toBe(true);
      expect(ListIssuesSchema.safeParse({ status_id: "closed" }).success).toBe(true);
      expect(ListIssuesSchema.safeParse({ status_id: "*" }).success).toBe(true);
      expect(ListIssuesSchema.safeParse({ status_id: "42" }).success).toBe(true);
    });

    it("rejects SQL injection in status_id", () => {
      expect(ListIssuesSchema.safeParse({ status_id: "open' OR 1=1--" }).success).toBe(false);
    });
  });

  describe("date format validation", () => {
    it("accepts valid ISO dates", () => {
      expect(CreateIssueSchema.safeParse({ project_id: "test", subject: "x", start_date: "2026-01-15" }).success).toBe(true);
    });

    it("rejects invalid date formats", () => {
      expect(CreateIssueSchema.safeParse({ project_id: "test", subject: "x", start_date: "not-a-date" }).success).toBe(false);
      expect(CreateIssueSchema.safeParse({ project_id: "test", subject: "x", start_date: "2026/01/15" }).success).toBe(false);
      expect(CreateIssueSchema.safeParse({ project_id: "test", subject: "x", start_date: "15-01-2026" }).success).toBe(false);
    });
  });

  describe("string length limits", () => {
    it("rejects overly long subject", () => {
      const result = CreateIssueSchema.safeParse({
        project_id: "test",
        subject: "a".repeat(256),
      });
      expect(result.success).toBe(false);
    });

    it("rejects overly long description", () => {
      const result = CreateIssueSchema.safeParse({
        project_id: "test",
        subject: "ok",
        description: "a".repeat(100001),
      });
      expect(result.success).toBe(false);
    });

    it("rejects overly long wiki text", () => {
      const result = UpdateWikiPageSchema.safeParse({
        project_id: "test",
        title: "page",
        text: "a".repeat(500001),
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("Error sanitization", () => {
  it("error message does not contain raw API body", async () => {
    const { RedmineClient } = await import("../client/redmine");
    const { vi } = await import("vitest");

    const client = new RedmineClient({
      baseUrl: "https://redmine.example.com",
      apiKey: "test-key",
    });

    const secretBody = "Internal Server Error: /var/redmine/app/models/issue.rb:42 PG::Error";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => secretBody,
      })
    );

    try {
      await client.listIssues({} as never);
      expect.unreachable("Should have thrown");
    } catch (e) {
      const message = (e as Error).message;
      expect(message).toBe("Redmine API error: 500");
      expect(message).not.toContain("PG::Error");
      expect(message).not.toContain("/var/redmine");
    }

    vi.restoreAllMocks();
  });
});

describe("Response sanitization", () => {
  it("strips __proto__ keys from response", async () => {
    const { RedmineClient } = await import("../client/redmine");
    const { vi } = await import("vitest");

    const client = new RedmineClient({
      baseUrl: "https://redmine.example.com",
      apiKey: "test-key",
    });

    const maliciousResponse = JSON.stringify({
      issue: { id: 1, subject: "test", __proto__: { isAdmin: true } },
    });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => maliciousResponse,
      })
    );

    const result = await client.getIssue(1);
    expect(result).toEqual({ issue: { id: 1, subject: "test" } });
    expect((result as Record<string, unknown>)["isAdmin"]).toBeUndefined();

    vi.restoreAllMocks();
  });
});

describe("ZodError handling in handlers", () => {
  it("returns clean error for invalid input", async () => {
    const { handleGetIssue } = await import("./issues/issues");
    const mockClient = {} as never;

    const result = await handleGetIssue({ id: "not-a-number" }, mockClient);
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
  });

  it("returns clean error for path traversal attempt", async () => {
    const { handleGetProject } = await import("./projects/projects");
    const mockClient = {} as never;

    const result = await handleGetProject({ id: "../../admin" }, mockClient);
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
  });
});
