import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RedmineClient } from "./redmine";

const BASE_URL = "https://redmine.example.com";
const API_KEY = "test-api-key";

function makeFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    text: async () => (body !== null ? JSON.stringify(body) : ""),
  });
}

describe("RedmineClient", () => {
  let client: RedmineClient;

  beforeEach(() => {
    client = new RedmineClient({ baseUrl: BASE_URL, apiKey: API_KEY });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("request headers", () => {
    it("sends X-Redmine-API-Key and Content-Type headers", async () => {
      const mockFetch = makeFetch(200, { issues: [], total_count: 0 });
      vi.stubGlobal("fetch", mockFetch);

      await client.listIssues({});

      const [, options] = mockFetch.mock.calls[0] as [string, RequestInit];
      expect((options.headers as Record<string, string>)["X-Redmine-API-Key"]).toBe(API_KEY);
      expect((options.headers as Record<string, string>)["Content-Type"]).toBe("application/json");
    });
  });

  describe("listIssues", () => {
    it("calls GET /issues.json and returns the response", async () => {
      const payload = { issues: [{ id: 1, subject: "Test" }], total_count: 1 };
      vi.stubGlobal("fetch", makeFetch(200, payload));

      const result = await client.listIssues({ project_id: "myproject", limit: 10 });

      expect(result).toEqual(payload);
    });

    it("appends query params to URL", async () => {
      const mockFetch = makeFetch(200, { issues: [], total_count: 0 });
      vi.stubGlobal("fetch", mockFetch);

      await client.listIssues({ project_id: "foo", status_id: "open", limit: 50 });

      const [url] = mockFetch.mock.calls[0] as [string];
      expect(url).toContain("project_id=foo");
      expect(url).toContain("status_id=open");
      expect(url).toContain("limit=50");
    });
  });

  describe("getIssue", () => {
    it("calls GET /issues/:id.json", async () => {
      const payload = { issue: { id: 42, subject: "Bug" } };
      const mockFetch = makeFetch(200, payload);
      vi.stubGlobal("fetch", mockFetch);

      const result = await client.getIssue(42);

      const [url] = mockFetch.mock.calls[0] as [string];
      expect(url).toContain("/issues/42.json");
      expect(result).toEqual(payload);
    });

    it("includes 'include' param when provided", async () => {
      const mockFetch = makeFetch(200, { issue: { id: 1 } });
      vi.stubGlobal("fetch", mockFetch);

      await client.getIssue(1, "journals,attachments");

      const [url] = mockFetch.mock.calls[0] as [string];
      expect(url).toContain("include=journals%2Cattachments");
    });
  });

  describe("createIssue", () => {
    it("calls POST /issues.json with wrapped body", async () => {
      const payload = { issue: { id: 99, subject: "New" } };
      const mockFetch = makeFetch(201, payload);
      vi.stubGlobal("fetch", mockFetch);

      const result = await client.createIssue({ project_id: "myproject", subject: "New" });

      const [, options] = mockFetch.mock.calls[0] as [string, RequestInit];
      expect(options.method).toBe("POST");
      expect(JSON.parse(options.body as string)).toEqual({ issue: { project_id: "myproject", subject: "New" } });
      expect(result).toEqual(payload);
    });
  });

  describe("updateIssue", () => {
    it("calls PUT /issues/:id.json and handles empty response body", async () => {
      vi.stubGlobal("fetch", makeFetch(200, null));

      await expect(client.updateIssue(1, { subject: "Updated" })).resolves.toBeUndefined();
    });
  });

  describe("deleteIssue", () => {
    it("calls DELETE /issues/:id.json", async () => {
      const mockFetch = makeFetch(200, null);
      vi.stubGlobal("fetch", mockFetch);

      await client.deleteIssue(5);

      const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];
      expect(url).toContain("/issues/5.json");
      expect(options.method).toBe("DELETE");
    });
  });

  describe("error handling", () => {
    it("throws with status and body on non-ok response", async () => {
      vi.stubGlobal("fetch", makeFetch(404, "Not Found"));

      await expect(client.getIssue(999)).rejects.toThrow("Redmine API error 404");
    });

    it("throws on 401 Unauthorized", async () => {
      vi.stubGlobal("fetch", makeFetch(401, "Unauthorized"));

      await expect(client.listIssues({})).rejects.toThrow("Redmine API error 401");
    });
  });

  describe("wiki pages", () => {
    it("encodes page title in URL", async () => {
      const mockFetch = makeFetch(200, { wiki_page: { title: "My Page" } });
      vi.stubGlobal("fetch", mockFetch);

      await client.getWikiPage("myproject", "My Page");

      const [url] = mockFetch.mock.calls[0] as [string];
      expect(url).toContain("My%20Page");
    });
  });

  describe("getCurrentUser", () => {
    it("calls GET /users/current.json", async () => {
      const mockFetch = makeFetch(200, { user: { id: 1, login: "admin" } });
      vi.stubGlobal("fetch", mockFetch);

      const result = await client.getCurrentUser();

      const [url] = mockFetch.mock.calls[0] as [string];
      expect(url).toContain("/users/current.json");
      expect(result).toEqual({ user: { id: 1, login: "admin" } });
    });
  });

  describe("logTime (createTimeEntry)", () => {
    it("calls POST /time_entries.json with wrapped body", async () => {
      const payload = { time_entry: { id: 10, hours: 2.5 } };
      const mockFetch = makeFetch(201, payload);
      vi.stubGlobal("fetch", mockFetch);

      await client.createTimeEntry({ hours: 2.5, activity_id: 9, issue_id: 42 });

      const [, options] = mockFetch.mock.calls[0] as [string, RequestInit];
      expect(options.method).toBe("POST");
      expect(JSON.parse(options.body as string)).toEqual({
        time_entry: { hours: 2.5, activity_id: 9, issue_id: 42 },
      });
    });
  });
});
