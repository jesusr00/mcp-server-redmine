export interface MembershipRole {
  id: number;
  name: string;
  inherited?: boolean;
}

export interface Membership {
  id: number;
  project: { id: number; name: string };
  user?: { id: number; name: string };
  group?: { id: number; name: string };
  roles: MembershipRole[];
}
