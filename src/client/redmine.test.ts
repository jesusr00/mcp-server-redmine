import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RedmineClient } from "./redmine";

const BASE_URL = "https://redmine.example.com";
const API_KEY = "test-api-key";

function makeFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => null },
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
      expect(JSON.parse(options.body as string)).toEqual({
        issue: { project_id: "myproject", subject: "New" },
      });
      expect(result).toEqual(payload);
    });

    it("forwards parent_issue_id to create a subtask", async () => {
      const mockFetch = makeFetch(201, { issue: { id: 100 } });
      vi.stubGlobal("fetch", mockFetch);

      await client.createIssue({
        project_id: "myproject",
        subject: "Child",
        parent_issue_id: 42,
      });

      const [, options] = mockFetch.mock.calls[0] as [string, RequestInit];
      expect(JSON.parse(options.body as string)).toEqual({
        issue: { project_id: "myproject", subject: "Child", parent_issue_id: 42 },
      });
    });

    it("forwards custom_fields to the request body", async () => {
      const mockFetch = makeFetch(201, { issue: { id: 101 } });
      vi.stubGlobal("fetch", mockFetch);

      await client.createIssue({
        project_id: "myproject",
        subject: "With CF",
        custom_fields: [{ id: 3, value: "production" }],
      });

      const [, options] = mockFetch.mock.calls[0] as [string, RequestInit];
      expect(JSON.parse(options.body as string)).toEqual({
        issue: {
          project_id: "myproject",
          subject: "With CF",
          custom_fields: [{ id: 3, value: "production" }],
        },
      });
    });

    it("forwards uploads to the request body", async () => {
      const mockFetch = makeFetch(201, { issue: { id: 102 } });
      vi.stubGlobal("fetch", mockFetch);

      await client.createIssue({
        project_id: "myproject",
        subject: "With attachment",
        uploads: [{ token: "7.ed1cc661", filename: "evidence.png", content_type: "image/png" }],
      });

      const [, options] = mockFetch.mock.calls[0] as [string, RequestInit];
      expect(JSON.parse(options.body as string)).toEqual({
        issue: {
          project_id: "myproject",
          subject: "With attachment",
          uploads: [{ token: "7.ed1cc661", filename: "evidence.png", content_type: "image/png" }],
        },
      });
    });
  });

  describe("updateIssue", () => {
    it("calls PUT /issues/:id.json and handles empty response body", async () => {
      vi.stubGlobal("fetch", makeFetch(200, null));

      await expect(client.updateIssue(1, { subject: "Updated" })).resolves.toBeUndefined();
    });

    it("forwards parent_issue_id to re-parent an issue", async () => {
      const mockFetch = makeFetch(200, null);
      vi.stubGlobal("fetch", mockFetch);

      await client.updateIssue(7, { parent_issue_id: 3 });

      const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];
      expect(url).toContain("/issues/7.json");
      expect(options.method).toBe("PUT");
      expect(JSON.parse(options.body as string)).toEqual({
        issue: { parent_issue_id: 3 },
      });
    });

    it("forwards custom_fields to the request body", async () => {
      const mockFetch = makeFetch(200, null);
      vi.stubGlobal("fetch", mockFetch);

      await client.updateIssue(5, { custom_fields: [{ id: 7, value: "urgent" }] });

      const [, options] = mockFetch.mock.calls[0] as [string, RequestInit];
      expect(JSON.parse(options.body as string)).toEqual({
        issue: { custom_fields: [{ id: 7, value: "urgent" }] },
      });
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
    it("throws with status code only, not response body", async () => {
      vi.stubGlobal("fetch", makeFetch(404, "Not Found"));

      await expect(client.getIssue(999)).rejects.toThrow("Redmine API error: 404");
    });

    it("throws on 401 Unauthorized", async () => {
      vi.stubGlobal("fetch", makeFetch(401, "Unauthorized"));

      await expect(client.listIssues({})).rejects.toThrow("Redmine API error: 401");
    });

    it("throws readable validation errors on 422 with errors array", async () => {
      vi.stubGlobal(
        "fetch",
        makeFetch(422, { errors: ["Environment can't be blank", "Tracker is invalid"] })
      );

      await expect(client.createIssue({ project_id: "myproject", subject: "Bug" })).rejects.toThrow(
        "Redmine validation errors: Environment can't be blank, Tracker is invalid"
      );
    });

    it("falls back to generic error on 422 with non-JSON body", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          status: 422,
          text: async () => "Unprocessable Entity",
        })
      );

      await expect(client.createIssue({ project_id: "myproject", subject: "Bug" })).rejects.toThrow(
        "Redmine API error: 422"
      );
    });

    it("falls back to generic error on 422 with empty errors array", async () => {
      vi.stubGlobal("fetch", makeFetch(422, { errors: [] }));

      await expect(client.createIssue({ project_id: "myproject", subject: "Bug" })).rejects.toThrow(
        "Redmine API error: 422"
      );
    });

    it("falls back to generic error on 422 with object errors array", async () => {
      vi.stubGlobal(
        "fetch",
        makeFetch(422, { errors: [{ attribute: "environment", message: "can't be blank" }] })
      );

      await expect(client.createIssue({ project_id: "myproject", subject: "Bug" })).rejects.toThrow(
        "Redmine API error: 422"
      );
    });

    it("surfaces errors[] detail on 4xx (400, 403)", async () => {
      for (const status of [400, 403]) {
        vi.stubGlobal("fetch", makeFetch(status, { errors: ["You are not authorized"] }));
        await expect(client.listIssues({})).rejects.toThrow(
          "Redmine validation errors: You are not authorized"
        );
      }
    });

    it("does not surface errors[] from 5xx to prevent internal detail leak", async () => {
      vi.stubGlobal("fetch", makeFetch(500, { errors: ["pg_internal_error at line 42"] }));

      await expect(client.listIssues({})).rejects.toThrow("Redmine API error: 500");
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

  describe("getMyAccount", () => {
    it("calls GET /my/account.json", async () => {
      const payload = {
        user: {
          id: 3,
          login: "dlopper",
          admin: false,
          firstname: "Dave",
          lastname: "Lopper",
          mail: "dlopper@somenet.foo",
          created_on: "2006-07-19T17:33:19Z",
          api_key: "abc123",
          custom_fields: [{ id: 4, name: "Phone number", value: "" }],
        },
      };
      const mockFetch = makeFetch(200, payload);
      vi.stubGlobal("fetch", mockFetch);

      const result = await client.getMyAccount();

      const [url] = mockFetch.mock.calls[0] as [string];
      expect(url).toContain("/my/account.json");
      expect(result).toEqual(payload);
    });
  });

  describe("search", () => {
    it("calls GET /search.json with query params", async () => {
      const payload = {
        results: [
          {
            id: 10,
            title: "Issue #10: Search me",
            type: "issue",
            url: "https://redmine.example.com/issues/10",
          },
        ],
        total_count: 1,
        limit: 25,
        offset: 0,
      };
      const mockFetch = makeFetch(200, payload);
      vi.stubGlobal("fetch", mockFetch);

      const result = await client.search({ q: "Search me", issues: true, wiki_pages: false });

      const [url] = mockFetch.mock.calls[0] as [string];
      expect(url).toContain("/search.json");
      expect(url).toContain("q=Search+me");
      expect(url).toContain("issues=1");
      expect(url).toContain("wiki_pages=0");
      expect(result).toEqual(payload);
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

  describe("uploadAttachment", () => {
    it("POSTs raw bytes to /uploads.json with octet-stream content type", async () => {
      const payload = { upload: { id: 7, token: "7.ed1cc661" } };
      const mockFetch = makeFetch(201, payload);
      vi.stubGlobal("fetch", mockFetch);

      const content = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);
      const result = await client.uploadAttachment("evidence.png", content);

      const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];
      expect(url).toContain("/uploads.json");
      expect(url).toContain("filename=evidence.png");
      expect(options.method).toBe("POST");
      expect((options.headers as Record<string, string>)["Content-Type"]).toBe(
        "application/octet-stream"
      );
      expect((options.headers as Record<string, string>)["X-Redmine-API-Key"]).toBe(API_KEY);
      expect(options.body).toBe(content);
      expect(result).toEqual(payload);
    });

    it("URL-encodes the filename query param", async () => {
      const mockFetch = makeFetch(201, { upload: { token: "t" } });
      vi.stubGlobal("fetch", mockFetch);

      await client.uploadAttachment("my evidence (1).png", new Uint8Array([1]));

      const [url] = mockFetch.mock.calls[0] as [string];
      expect(url).toContain("filename=my+evidence+%281%29.png");
    });

    it("surfaces validation errors on 422 (e.g. file too big)", async () => {
      vi.stubGlobal(
        "fetch",
        makeFetch(422, { errors: ["Attachment is too big (maximum size: 5 MB)"] })
      );

      await expect(client.uploadAttachment("big.zip", new Uint8Array([1]))).rejects.toThrow(
        "Redmine validation errors: Attachment is too big (maximum size: 5 MB)"
      );
    });

    it("throws generic error on 500 without leaking body", async () => {
      vi.stubGlobal("fetch", makeFetch(500, { errors: ["disk full at /var/redmine"] }));

      await expect(client.uploadAttachment("a.png", new Uint8Array([1]))).rejects.toThrow(
        "Redmine API error: 500"
      );
    });
  });

  describe("getAttachment", () => {
    it("calls GET /attachments/:id.json", async () => {
      const payload = {
        attachment: {
          id: 53404,
          filename: "evidencia.png",
          filesize: 74,
          content_type: "image/png",
        },
      };
      const mockFetch = makeFetch(200, payload);
      vi.stubGlobal("fetch", mockFetch);

      const result = await client.getAttachment(53404);

      const [url] = mockFetch.mock.calls[0] as [string];
      expect(url).toContain("/attachments/53404.json");
      expect(result).toEqual(payload);
    });
  });

  describe("downloadAttachment", () => {
    const MAX = 5 * 1024 * 1024;

    function makeStreamFetch(chunks: Uint8Array[], contentLength: number | null) {
      const body = {
        cancel: vi.fn().mockResolvedValue(undefined),
        async *[Symbol.asyncIterator]() {
          for (const c of chunks) yield c;
        },
      };
      return vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: {
          get: (h: string) =>
            h.toLowerCase() === "content-length" && contentLength !== null
              ? String(contentLength)
              : null,
        },
        body,
        text: async () => "",
      });
    }

    it("GETs the download URL with the API key and returns the raw bytes", async () => {
      const bytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);
      const mockFetch = makeStreamFetch([bytes], bytes.length);
      vi.stubGlobal("fetch", mockFetch);

      const result = await client.downloadAttachment(53404, "mi evidencia.png", MAX);

      const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];
      expect(url).toContain("/attachments/download/53404/mi%20evidencia.png");
      expect((options.headers as Record<string, string>)["X-Redmine-API-Key"]).toBe(API_KEY);
      expect(Buffer.from(result)).toEqual(Buffer.from(bytes));
    });

    it("rejects before reading when Content-Length exceeds the limit", async () => {
      const mockFetch = makeStreamFetch([new Uint8Array([1])], 10 * 1024 * 1024);
      vi.stubGlobal("fetch", mockFetch);

      await expect(client.downloadAttachment(1, "big.png", MAX)).rejects.toThrow("download limit");
    });

    it("rejects when the streamed body exceeds the limit despite a small Content-Length", async () => {
      const chunk = new Uint8Array(3);
      const mockFetch = makeStreamFetch([chunk, chunk, chunk], 1);
      vi.stubGlobal("fetch", mockFetch);

      await expect(client.downloadAttachment(1, "liar.png", 4)).rejects.toThrow("download limit");
    });

    function makeRedirectResponse(location: string) {
      return {
        ok: false,
        status: 302,
        headers: { get: (h: string) => (h.toLowerCase() === "location" ? location : null) },
        body: { cancel: vi.fn().mockResolvedValue(undefined) },
        text: async () => "",
      };
    }

    it("drops the API key when following a cross-origin redirect", async () => {
      const bytes = new Uint8Array([1, 2]);
      const okResponse = {
        ok: true,
        status: 200,
        headers: {
          get: (h: string) => (h.toLowerCase() === "content-length" ? String(bytes.length) : null),
        },
        body: {
          cancel: vi.fn(),
          async *[Symbol.asyncIterator]() {
            yield bytes;
          },
        },
        text: async () => "",
      };
      const mockFetch = vi
        .fn()
        .mockResolvedValueOnce(makeRedirectResponse("https://s3.example.net/bucket/x?sig=1"))
        .mockResolvedValueOnce(okResponse);
      vi.stubGlobal("fetch", mockFetch);

      const result = await client.downloadAttachment(7, "a.png", 1024);

      expect(mockFetch).toHaveBeenCalledTimes(2);
      const [redirectedUrl, redirectedInit] = mockFetch.mock.calls[1] as [string, RequestInit];
      expect(redirectedUrl).toBe("https://s3.example.net/bucket/x?sig=1");
      const headers = (redirectedInit.headers ?? {}) as Record<string, string>;
      expect(headers["X-Redmine-API-Key"]).toBeUndefined();
      expect(Buffer.from(result)).toEqual(Buffer.from(bytes));
    });

    it("keeps the API key on same-origin redirects", async () => {
      const bytes = new Uint8Array([1]);
      const okResponse = {
        ok: true,
        status: 200,
        headers: { get: () => null },
        body: {
          cancel: vi.fn(),
          async *[Symbol.asyncIterator]() {
            yield bytes;
          },
        },
        text: async () => "",
      };
      const mockFetch = vi
        .fn()
        .mockResolvedValueOnce(makeRedirectResponse("/attachments/moved/7/a.png"))
        .mockResolvedValueOnce(okResponse);
      vi.stubGlobal("fetch", mockFetch);

      await client.downloadAttachment(7, "a.png", 1024);

      const [redirectedUrl, redirectedInit] = mockFetch.mock.calls[1] as [string, RequestInit];
      expect(redirectedUrl).toBe(`${BASE_URL}/attachments/moved/7/a.png`);
      expect((redirectedInit.headers as Record<string, string>)["X-Redmine-API-Key"]).toBe(API_KEY);
    });

    it("gives up after too many redirects", async () => {
      const mockFetch = vi
        .fn()
        .mockResolvedValue(makeRedirectResponse("https://redmine.example.com/loop"));
      vi.stubGlobal("fetch", mockFetch);

      await expect(client.downloadAttachment(7, "a.png", 1024)).rejects.toThrow(
        "Too many redirects"
      );
    });

    it("throws generic error on 404 without leaking body", async () => {
      vi.stubGlobal("fetch", makeFetch(404, "Not Found"));

      await expect(client.downloadAttachment(999, "x.png", MAX)).rejects.toThrow(
        "Redmine API error: 404"
      );
    });
  });
});
