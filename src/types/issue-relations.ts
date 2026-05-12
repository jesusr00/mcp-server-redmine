export type RelationType =
  | "relates"
  | "duplicates"
  | "duplicated"
  | "blocks"
  | "blocked"
  | "precedes"
  | "follows"
  | "copied_to"
  | "copied_from";

export interface IssueRelation {
  id: number;
  issue_id: number;
  issue_to_id: number;
  relation_type: RelationType;
  delay: number | null;
}
