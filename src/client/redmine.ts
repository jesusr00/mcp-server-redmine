import type { Issue } from "@/types/issues";
import type { Project } from "@/types/projects";
import type { TimeEntry } from "@/types/time-entries";
import type { User } from "@/types/users";
import type { WikiPage } from "@/types/wiki-pages";
import type {
  CreateIssueParams,
  CreateProjectParams,
  CreateTimeEntryParams,
  ListIssuesParams,
  ListProjectsParams,
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
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Redmine API error ${response.status}: ${text}`);
    }

    const text = await response.text();
    return text ? (JSON.parse(text) as T) : ({} as T);
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
    return this.request("GET", `/issues/${id}.json`, undefined, include ? { include } : undefined);
  }

  async createIssue(params: CreateIssueParams): Promise<{ issue: Issue }> {
    return this.request("POST", "/issues.json", { issue: params });
  }

  async updateIssue(id: number, params: UpdateIssueParams): Promise<void> {
    await this.request("PUT", `/issues/${id}.json`, { issue: params });
  }

  async deleteIssue(id: number): Promise<void> {
    await this.request("DELETE", `/issues/${id}.json`);
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
    return this.request("GET", `/projects/${id}.json`);
  }

  async createProject(params: CreateProjectParams): Promise<{ project: Project }> {
    return this.request("POST", "/projects.json", { project: params });
  }

  async updateProject(id: string | number, params: UpdateProjectParams): Promise<void> {
    await this.request("PUT", `/projects/${id}.json`, { project: params });
  }

  // Users
  async listUsers(params: ListUsersParams): Promise<{ users: User[]; total_count: number }> {
    return this.request("GET", "/users.json", undefined, params as Record<string, string | number>);
  }

  async getUser(id: number, include?: string): Promise<{ user: User }> {
    return this.request("GET", `/users/${id}.json`, undefined, include ? { include } : undefined);
  }

  async getCurrentUser(): Promise<{ user: User }> {
    return this.request("GET", "/users/current.json");
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
    return this.request("GET", `/time_entries/${id}.json`);
  }

  async createTimeEntry(params: CreateTimeEntryParams): Promise<{ time_entry: TimeEntry }> {
    return this.request("POST", "/time_entries.json", { time_entry: params });
  }

  async updateTimeEntry(id: number, params: UpdateTimeEntryParams): Promise<void> {
    await this.request("PUT", `/time_entries/${id}.json`, { time_entry: params });
  }

  async deleteTimeEntry(id: number): Promise<void> {
    await this.request("DELETE", `/time_entries/${id}.json`);
  }

  // Wiki Pages
  async listWikiPages(projectId: string | number): Promise<{ wiki_pages: WikiPage[] }> {
    return this.request("GET", `/projects/${projectId}/wiki/index.json`);
  }

  async getWikiPage(projectId: string | number, title: string): Promise<{ wiki_page: WikiPage }> {
    return this.request("GET", `/projects/${projectId}/wiki/${encodeURIComponent(title)}.json`);
  }

  async updateWikiPage(
    projectId: string | number,
    title: string,
    params: UpdateWikiPageParams
  ): Promise<void> {
    await this.request("PUT", `/projects/${projectId}/wiki/${encodeURIComponent(title)}.json`, {
      wiki_page: params,
    });
  }

  async deleteWikiPage(projectId: string | number, title: string): Promise<void> {
    await this.request("DELETE", `/projects/${projectId}/wiki/${encodeURIComponent(title)}.json`);
  }
}
