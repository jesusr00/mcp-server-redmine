export interface RedmineConfig {
  baseUrl: string;
  apiKey: string;
}

export interface ListIssuesParams {
  project_id?: string;
  status_id?: string;
  tracker_id?: number;
  assigned_to_id?: number;
  priority_id?: number;
  limit?: number;
  offset?: number;
  sort?: string;
  include?: string;
}

export interface ListProjectsParams {
  limit?: number;
  offset?: number;
  include?: string;
}

export interface ListUsersParams {
  status?: number;
  name?: string;
  group_id?: number;
  limit?: number;
  offset?: number;
}

export interface ListTimeEntriesParams {
  project_id?: string;
  issue_id?: number;
  user_id?: number;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}

export interface CreateIssueParams {
  project_id: string | number;
  subject: string;
  description?: string;
  tracker_id?: number;
  status_id?: number;
  priority_id?: number;
  assigned_to_id?: number;
  start_date?: string;
  due_date?: string;
  estimated_hours?: number;
  done_ratio?: number;
}

export interface UpdateIssueParams {
  subject?: string;
  description?: string;
  tracker_id?: number;
  status_id?: number;
  priority_id?: number;
  assigned_to_id?: number;
  start_date?: string;
  due_date?: string;
  estimated_hours?: number;
  done_ratio?: number;
  notes?: string;
}

export interface CreateProjectParams {
  name: string;
  identifier: string;
  description?: string;
  is_public?: boolean;
  inherit_members?: boolean;
}

export interface UpdateProjectParams {
  name?: string;
  description?: string;
  is_public?: boolean;
  inherit_members?: boolean;
}

export interface CreateTimeEntryParams {
  hours: number;
  activity_id: number;
  issue_id?: number;
  project_id?: string | number;
  spent_on?: string;
  comments?: string;
}

export interface UpdateTimeEntryParams {
  hours?: number;
  activity_id?: number;
  spent_on?: string;
  comments?: string;
}

export interface UpdateWikiPageParams {
  text: string;
  comments?: string;
  version?: number;
}
