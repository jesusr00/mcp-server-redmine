import type { IdName } from "./common";

export interface FileItem {
  id: number;
  filename: string;
  filesize: number;
  content_type: string;
  description: string;
  content_url: string;
  author: IdName;
  created_on: string;
  version: IdName | null;
  digest: string;
  downloads: number;
}