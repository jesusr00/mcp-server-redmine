export interface Role {
  id: number;
  name: string;
}

export interface RoleDetail extends Role {
  assignable: boolean;
  issues_visibility: string;
  time_entries_visibility: string;
  users_visibility: string;
  permissions: string[];
}
