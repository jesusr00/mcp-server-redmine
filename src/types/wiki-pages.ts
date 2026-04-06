import type { IdName } from "./common";

export interface WikiPage {
  title: string;
  text: string;
  version: number;
  author: IdName;
  created_on: string;
  updated_on: string;
}
