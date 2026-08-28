import type { IdName } from "./common";

export interface AttachmentUpload {
  id?: number;
  token: string;
}

export interface Attachment {
  id: number;
  filename: string;
  filesize: number;
  content_type: string;
  description?: string;
  content_url: string;
  author: IdName;
  created_on: string;
}

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
