import type { IdName } from "./common";

export interface TimeEntry {
  id: number;
  project: IdName;
  issue?: { id: number };
  user: IdName;
  activity: IdName;
  hours: number;
  comments: string;
  spent_on: string;
  created_on: string;
  updated_on: string;
}
