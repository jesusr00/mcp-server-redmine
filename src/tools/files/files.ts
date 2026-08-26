import { open, realpath } from "node:fs/promises";
import { basename, isAbsolute, sep } from "node:path";
import type { RedmineClient } from "../../client/redmine";
import { ok, withErrorHandling } from "../shared";
import { ListFilesSchema, UploadAttachmentSchema, UploadFileSchema } from "./schema";

const MAX_UPLOAD_SIZE = 50 * 1024 * 1024; // Redmine enforces its own (usually smaller) limit server-side
const MAX_FILENAME_LENGTH = 255;

const CONTENT_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  pdf: "application/pdf",
  txt: "text/plain",
  log: "text/plain",
  csv: "text/csv",
  zip: "application/zip",
};

function guessContentType(filename: string): string {
  const dot = filename.lastIndexOf(".");
  if (dot <= 0) return "application/octet-stream";
  return CONTENT_TYPES[filename.slice(dot + 1).toLowerCase()] ?? "application/octet-stream";
}

// When REDMINE_UPLOAD_DIR is set, only files inside that directory may be uploaded.
// Both sides are realpath-resolved, so symlinks pointing outside the directory are rejected.
async function resolveUploadPath(file_path: string): Promise<string> {
  const uploadDir = process.env.REDMINE_UPLOAD_DIR;
  if (uploadDir === undefined) {
    return realpath(file_path).catch((e: NodeJS.ErrnoException) => {
      if (e.code === "ENOENT") throw new Error(`File not found: ${file_path}`);
      throw e;
    });
  }

  // fail closed at runtime even if the startup validation in index.ts was bypassed
  if (!isAbsolute(uploadDir)) {
    throw new Error("REDMINE_UPLOAD_DIR must be an absolute path.");
  }
  const realBase = await realpath(uploadDir).catch((e: NodeJS.ErrnoException) => {
    if (e.code === "ENOENT") {
      throw new Error(`Upload directory does not exist: ${uploadDir} (REDMINE_UPLOAD_DIR)`);
    }
    throw new Error(`Upload directory is not accessible: ${uploadDir} (REDMINE_UPLOAD_DIR)`);
  });
  const prefix = realBase.endsWith(sep) ? realBase : realBase + sep;

  // one message for missing and out-of-bounds files, so the tool cannot be used
  // to probe which paths exist outside the allowed directory
  const outside = () =>
    new Error(`File not found or outside the allowed upload directory (${uploadDir}).`);
  const realFile = await realpath(file_path).catch(() => {
    throw outside();
  });
  if (realFile !== realBase && !realFile.startsWith(prefix)) throw outside();
  return realFile;
}

export const handleListFiles = withErrorHandling(async (args: unknown, client: RedmineClient) => {
  const params = ListFilesSchema.parse(args);
  const data = await client.listFiles(params);
  return ok(data);
});

export const handleUploadFile = withErrorHandling(async (args: unknown, client: RedmineClient) => {
  const { project_id, ...params } = UploadFileSchema.parse(args);
  const data = await client.uploadFile(project_id, params);
  return ok(data);
});

export const handleUploadAttachment = withErrorHandling(
  async (args: unknown, client: RedmineClient) => {
    const { file_path, filename, content_type } = UploadAttachmentSchema.parse(args);
    const name = filename ?? basename(file_path);
    if (name.length > MAX_FILENAME_LENGTH) {
      throw new Error(
        `Filename exceeds ${MAX_FILENAME_LENGTH} characters; pass a shorter 'filename' explicitly.`
      );
    }

    const realPath = await resolveUploadPath(file_path);

    // open once so the size check and the read see the same file (no stat/read race)
    const handle = await open(realPath, "r").catch((e: NodeJS.ErrnoException) => {
      if (e.code === "ENOENT") throw new Error(`File not found: ${file_path}`);
      throw e;
    });
    let content: Buffer;
    try {
      const stats = await handle.stat();
      if (!stats.isFile()) throw new Error(`Not a regular file: ${file_path}`);
      if (stats.size > MAX_UPLOAD_SIZE) {
        throw new Error(
          `File too large: ${stats.size} bytes (max ${MAX_UPLOAD_SIZE}). Redmine may enforce a smaller limit.`
        );
      }
      content = await handle.readFile();
    } finally {
      await handle.close();
    }

    const data = await client.uploadAttachment(name, content);
    if (!data.upload?.token) {
      throw new Error("Unexpected response from Redmine's uploads API: no upload token returned.");
    }
    return ok({
      token: data.upload.token,
      filename: name,
      content_type: content_type ?? guessContentType(name),
      next_step:
        "Pass this token, filename, and content_type in the 'uploads' array of redmine_create_issue or redmine_update_issue, or the token to redmine_upload_file.",
    });
  }
);
