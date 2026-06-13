import type { FileItem } from "@/types/files";
import type { IssueRelation } from "@/types/issue-relations";
import type { Issue } from "@/types/issues";
import type { NewsItem } from "@/types/news";
import type { Role, RoleDetail } from "@/types/roles";
import type { Project } from "@/types/projects";
import type { SearchResult } from "@/types/search";
import type { TimeEntry } from "@/types/time-entries";
import type { MyAccount } from "@/types/my-account";
import type { User } from "@/types/users";
import type { WikiPage } from "@/types/wiki-pages";
import type {
  CreateFileParams,
  CreateIssueParams,
  CreateIssueRelationParams,
  CreateProjectParams,
  CreateTimeEntryParams,
  ListFilesParams,
  ListIssuesParams,
  ListNewsParams,
  ListRolesParams,
  ListProjectsParams,
  SearchParams,
  ListTimeEntriesParams,
  ListUsersParams,
  RedmineConfig,
  UpdateIssueParams,
  UpdateProjectParams,
  UpdateTimeEntryParams,
  UpdateWikiPageParams,
} from "@/types/params";

export class RedmineClient {
  private readonly headers: Record<string, string>;

  constructor(private readonly config: RedmineConfig) {
    this.headers = {
      "X-Redmine-API-Key": config.apiKey,
      "Content-Type": "application/json",
    };
  }

  private static encodePath(id: string | number): string {
    return encodeURIComponent(String(id));
  }

  private static sanitizeResponse<T>(data: unknown): T {
    if (data === null || typeof data !== "object") return data as T;
    const clean: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
      clean[key] = Array.isArray(value)
        ? value.map((item) => RedmineClient.sanitizeResponse(item))
        : typeof value === "object" && value !== null
          ? RedmineClient.sanitizeResponse(value)
          : value;
    }
    return clean as T;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    params?: Record<string, string | number>
  ): Promise<T> {
    const url = new URL(`${this.config.baseUrl}${path}`);

    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) {
          url.searchParams.set(k, String(v));
        }
      }
    }

    const response = await fetch(url.toString(), {
      method,
      headers: this.headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`Redmine API error ${response.status} ${method} ${path}: ${text}`);
      throw new Error(`Redmine API error: ${response.status}`);
    }

    const text = await response.text();
    if (!text) return {} as T;
    const parsed: unknown = JSON.parse(text);
    return RedmineClient.sanitizeResponse<T>(parsed);
  }

  // Issues
  async listIssues(params: ListIssuesParams): Promise<{ issues: Issue[]; total_count: number }> {
    return this.request(
      "GET",
      "/issues.json",
      undefined,
      params as Record<string, string | number>
    );
  }

  async getIssue(id: number, include?: string): Promise<{ issue: Issue }> {
    return this.request(
      "GET",
      `/issues/${RedmineClient.encodePath(id)}.json`,
      undefined,
      include ? { include } : undefined
    );
  }

  async createIssue(params: CreateIssueParams): Promise<{ issue: Issue }> {
    return this.request("POST", "/issues.json", { issue: params });
  }

  async updateIssue(id: number, params: UpdateIssueParams): Promise<void> {
    await this.request("PUT", `/issues/${RedmineClient.encodePath(id)}.json`, { issue: params });
  }

  async deleteIssue(id: number): Promise<void> {
    console.error(`[AUDIT] DELETE /issues/${id}.json at ${new Date().toISOString()}`);
    await this.request("DELETE", `/issues/${RedmineClient.encodePath(id)}.json`);
  }

  // Issue Relations
  async listIssueRelations(issueId: number): Promise<{ relations: IssueRelation[] }> {
    return this.request("GET", `/issues/${RedmineClient.encodePath(issueId)}/relations.json`);
  }

  async getIssueRelation(id: number): Promise<{ relation: IssueRelation }> {
    return this.request("GET", `/relations/${RedmineClient.encodePath(id)}.json`);
  }

  async createIssueRelation(
    issueId: number,
    params: CreateIssueRelationParams
  ): Promise<{ relation: IssueRelation }> {
    return this.request("POST", `/issues/${RedmineClient.encodePath(issueId)}/relations.json`, {
      relation: params,
    });
  }

  async deleteIssueRelation(id: number): Promise<void> {
    console.error(`[AUDIT] DELETE /relations/${id}.json at ${new Date().toISOString()}`);
    await this.request("DELETE", `/relations/${RedmineClient.encodePath(id)}.json`);
  }

  // Projects
  async listProjects(
    params: ListProjectsParams
  ): Promise<{ projects: Project[]; total_count: number }> {
    return this.request(
      "GET",
      "/projects.json",
      undefined,
      params as Record<string, string | number>
    );
  }

  async getProject(id: string | number): Promise<{ project: Project }> {
    return this.request("GET", `/projects/${RedmineClient.encodePath(id)}.json`);
  }

  async createProject(params: CreateProjectParams): Promise<{ project: Project }> {
    return this.request("POST", "/projects.json", { project: params });
  }

  async updateProject(id: string | number, params: UpdateProjectParams): Promise<void> {
    await this.request("PUT", `/projects/${RedmineClient.encodePath(id)}.json`, {
      project: params,
    });
  }

  // Users
  async listUsers(params: ListUsersParams): Promise<{ users: User[]; total_count: number }> {
    return this.request("GET", "/users.json", undefined, params as Record<string, string | number>);
  }

  async getUser(id: number, include?: string): Promise<{ user: User }> {
    return this.request(
      "GET",
      `/users/${RedmineClient.encodePath(id)}.json`,
      undefined,
      include ? { include } : undefined
    );
  }

  async getCurrentUser(): Promise<{ user: User }> {
    return this.request("GET", "/users/current.json");
  }

  async getMyAccount(): Promise<{ user: MyAccount }> {
    return this.request("GET", "/my/account.json");
  }

  // Time Entries
  async listTimeEntries(
    params: ListTimeEntriesParams
  ): Promise<{ time_entries: TimeEntry[]; total_count: number }> {
    return this.request(
      "GET",
      "/time_entries.json",
      undefined,
      params as Record<string, string | number>
    );
  }

  async getTimeEntry(id: number): Promise<{ time_entry: TimeEntry }> {
    return this.request("GET", `/time_entries/${RedmineClient.encodePath(id)}.json`);
  }

  async createTimeEntry(params: CreateTimeEntryParams): Promise<{ time_entry: TimeEntry }> {
    return this.request("POST", "/time_entries.json", { time_entry: params });
  }

  async updateTimeEntry(id: number, params: UpdateTimeEntryParams): Promise<void> {
    await this.request("PUT", `/time_entries/${RedmineClient.encodePath(id)}.json`, {
      time_entry: params,
    });
  }

  async deleteTimeEntry(id: number): Promise<void> {
    console.error(`[AUDIT] DELETE /time_entries/${id}.json at ${new Date().toISOString()}`);
    await this.request("DELETE", `/time_entries/${RedmineClient.encodePath(id)}.json`);
  }

  // News
  async listNews(params: ListNewsParams): Promise<{ news: NewsItem[]; total_count: number }> {
    const { project_id, ...query } = params;
    const path = project_id
      ? `/projects/${RedmineClient.encodePath(project_id)}/news.json`
      : "/news.json";
    return this.request("GET", path, undefined, query as Record<string, string | number>);
  }

  // Search
  async search(
    params: SearchParams
  ): Promise<{ results: SearchResult[]; total_count: number; limit: number; offset: number }> {
    const query: Record<string, string | number> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      query[key] = typeof value === "boolean" ? (value ? 1 : 0) : value;
    }
    return this.request("GET", "/search.json", undefined, query);
  }

  // Wiki Pages
  async listWikiPages(projectId: string | number): Promise<{ wiki_pages: WikiPage[] }> {
    return this.request("GET", `/projects/${RedmineClient.encodePath(projectId)}/wiki/index.json`);
  }

  async getWikiPage(projectId: string | number, title: string): Promise<{ wiki_page: WikiPage }> {
    return this.request(
      "GET",
      `/projects/${RedmineClient.encodePath(projectId)}/wiki/${encodeURIComponent(title)}.json`
    );
  }

  async updateWikiPage(
    projectId: string | number,
    title: string,
    params: UpdateWikiPageParams
  ): Promise<void> {
    await this.request(
      "PUT",
      `/projects/${RedmineClient.encodePath(projectId)}/wiki/${encodeURIComponent(title)}.json`,
      {
        wiki_page: params,
      }
    );
  }

  async deleteWikiPage(projectId: string | number, title: string): Promise<void> {
    console.error(
      `[AUDIT] DELETE /projects/${projectId}/wiki/${title} at ${new Date().toISOString()}`
    );
    await this.request(
      "DELETE",
      `/projects/${RedmineClient.encodePath(projectId)}/wiki/${encodeURIComponent(title)}.json`
    );
  }

  // Files
  async listFiles(params: ListFilesParams): Promise<{ files: FileItem[]; total_count: number }> {
    const query: Record<string, string | number> = {};
    if (params.limit !== undefined) query.limit = params.limit;
    if (params.offset !== undefined) query.offset = params.offset;
    return this.request(
      "GET",
      `/projects/${RedmineClient.encodePath(params.project_id)}/files.json`,
      undefined,
      Object.keys(query).length > 0 ? query : undefined
    );
  }

  async uploadFile(
    projectId: string | number,
    params: CreateFileParams
  ): Promise<{ file: FileItem }> {
    return this.request("POST", `/projects/${RedmineClient.encodePath(projectId)}/files.json`, {
      file: params,
    });
  }

  // Roles
  async listRoles(params: ListRolesParams): Promise<{ roles: Role[] }> {
    const query: Record<string, string | number> = {};
    if (params.limit !== undefined) query.limit = params.limit;
    if (params.offset !== undefined) query.offset = params.offset;
    return this.request(
      "GET",
      "/roles.json",
      undefined,
      Object.keys(query).length > 0 ? query : undefined
    );
  }

  async getRole(id: number): Promise<{ role: RoleDetail }> {
    return this.request("GET", `/roles/${RedmineClient.encodePath(id)}.json`);
  }
}
