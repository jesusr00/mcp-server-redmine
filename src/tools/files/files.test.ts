import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import type { RedmineClient } from "../../client/redmine";
import { handleUploadAttachment } from "./files";

function makeClient(response: { upload: { id?: number; token: string } }) {
  return { uploadAttachment: vi.fn().mockResolvedValue(response) } as unknown as RedmineClient;
}

function uploadMock(client: RedmineClient) {
  return (client as unknown as { uploadAttachment: ReturnType<typeof vi.fn> }).uploadAttachment;
}

describe("handleUploadAttachment", () => {
  let dir: string;

  beforeEach(async () => {
    // isolate from any REDMINE_UPLOAD_DIR set in the ambient environment
    vi.stubEnv("REDMINE_UPLOAD_DIR", undefined);
    dir = await mkdtemp(join(tmpdir(), "mcp-redmine-test-"));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("reads the file and returns the upload token with a guessed content type", async () => {
    const filePath = join(dir, "evidence.png");
    await writeFile(filePath, Buffer.from([0x89, 0x50, 0x4e, 0x47]));
    const client = makeClient({ upload: { id: 7, token: "7.ed1cc661" } });

    const result = await handleUploadAttachment({ file_path: filePath }, client);

    expect(result.isError).toBeUndefined();
    const body = JSON.parse(result.content[0].text) as Record<string, unknown>;
    expect(body.token).toBe("7.ed1cc661");
    expect(body.filename).toBe("evidence.png");
    expect(body.content_type).toBe("image/png");
    expect(uploadMock(client)).toHaveBeenCalledWith("evidence.png", expect.any(Buffer));
  });

  it("honors an explicit filename and content_type", async () => {
    const filePath = join(dir, "raw.bin");
    await writeFile(filePath, Buffer.from([1, 2, 3]));
    const client = makeClient({ upload: { token: "9.aa" } });

    const result = await handleUploadAttachment(
      { file_path: filePath, filename: "report.pdf", content_type: "application/pdf" },
      client
    );

    const body = JSON.parse(result.content[0].text) as Record<string, unknown>;
    expect(body.filename).toBe("report.pdf");
    expect(body.content_type).toBe("application/pdf");
    expect(uploadMock(client)).toHaveBeenCalledWith("report.pdf", expect.any(Buffer));
  });

  it("returns isError when the file does not exist", async () => {
    const client = makeClient({ upload: { token: "x" } });

    const result = await handleUploadAttachment({ file_path: join(dir, "missing.png") }, client);

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("File not found");
  });

  it("returns isError for a directory path", async () => {
    const client = makeClient({ upload: { token: "x" } });

    const result = await handleUploadAttachment({ file_path: dir }, client);

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Not a regular file");
  });

  it("returns isError for a relative path", async () => {
    const client = makeClient({ upload: { token: "x" } });

    const result = await handleUploadAttachment({ file_path: "images/evidence.png" }, client);

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
  });

  it("falls back to octet-stream for extension-less filenames", async () => {
    const filePath = join(dir, "zip");
    await writeFile(filePath, Buffer.from([1]));
    const client = makeClient({ upload: { token: "z.1" } });

    const result = await handleUploadAttachment({ file_path: filePath }, client);

    const body = JSON.parse(result.content[0].text) as Record<string, unknown>;
    expect(body.content_type).toBe("application/octet-stream");
  });

  it("returns isError when the response carries no upload token", async () => {
    const filePath = join(dir, "evidence.png");
    await writeFile(filePath, Buffer.from([1]));
    const client = { uploadAttachment: vi.fn().mockResolvedValue({}) } as unknown as RedmineClient;

    const result = await handleUploadAttachment({ file_path: filePath }, client);

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("no upload token");
  });

  describe("REDMINE_UPLOAD_DIR restriction", () => {
    let outsideDir: string;

    beforeEach(async () => {
      outsideDir = await mkdtemp(join(tmpdir(), "mcp-redmine-outside-"));
    });

    afterEach(async () => {
      await rm(outsideDir, { recursive: true, force: true });
      vi.unstubAllEnvs();
    });

    it("allows files inside the configured directory", async () => {
      vi.stubEnv("REDMINE_UPLOAD_DIR", dir);
      const filePath = join(dir, "evidence.png");
      await writeFile(filePath, Buffer.from([1]));
      const client = makeClient({ upload: { token: "in.1" } });

      const result = await handleUploadAttachment({ file_path: filePath }, client);

      expect(result.isError).toBeUndefined();
      const body = JSON.parse(result.content[0].text) as Record<string, unknown>;
      expect(body.token).toBe("in.1");
    });

    it("rejects files outside the configured directory", async () => {
      vi.stubEnv("REDMINE_UPLOAD_DIR", dir);
      const filePath = join(outsideDir, "secret.pem");
      await writeFile(filePath, Buffer.from([1]));
      const client = makeClient({ upload: { token: "x" } });

      const result = await handleUploadAttachment({ file_path: filePath }, client);

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("outside the allowed upload directory");
      expect(uploadMock(client)).not.toHaveBeenCalled();
    });

    it("rejects .. traversal that escapes the configured directory", async () => {
      vi.stubEnv("REDMINE_UPLOAD_DIR", dir);
      const filePath = join(outsideDir, "secret.pem");
      await writeFile(filePath, Buffer.from([1]));
      const client = makeClient({ upload: { token: "x" } });

      const sneaky = `${dir}/../${basename(outsideDir)}/secret.pem`;
      const result = await handleUploadAttachment({ file_path: sneaky }, client);

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("outside the allowed upload directory");
    });

    it("rejects a symlink inside the directory pointing outside", async () => {
      vi.stubEnv("REDMINE_UPLOAD_DIR", dir);
      const target = join(outsideDir, "secret.pem");
      await writeFile(target, Buffer.from([1]));
      const linkPath = join(dir, "innocent.png");
      await symlink(target, linkPath);
      const client = makeClient({ upload: { token: "x" } });

      const result = await handleUploadAttachment({ file_path: linkPath }, client);

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("outside the allowed upload directory");
    });

    it("reports a clear error when the configured directory does not exist", async () => {
      vi.stubEnv("REDMINE_UPLOAD_DIR", join(dir, "nope"));
      const filePath = join(dir, "evidence.png");
      await writeFile(filePath, Buffer.from([1]));
      const client = makeClient({ upload: { token: "x" } });

      const result = await handleUploadAttachment({ file_path: filePath }, client);

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Upload directory does not exist");
    });

    it("allows uploads from anywhere when the directory is the filesystem root", async () => {
      vi.stubEnv("REDMINE_UPLOAD_DIR", "/");
      const filePath = join(dir, "evidence.png");
      await writeFile(filePath, Buffer.from([1]));
      const client = makeClient({ upload: { token: "root.1" } });

      const result = await handleUploadAttachment({ file_path: filePath }, client);

      expect(result.isError).toBeUndefined();
    });

    it("does not reveal whether a file outside the directory exists", async () => {
      vi.stubEnv("REDMINE_UPLOAD_DIR", dir);
      const existing = join(outsideDir, "secret.pem");
      await writeFile(existing, Buffer.from([1]));
      const client = makeClient({ upload: { token: "x" } });

      const forExisting = await handleUploadAttachment({ file_path: existing }, client);
      const forMissing = await handleUploadAttachment(
        { file_path: join(outsideDir, "does-not-exist.pem") },
        client
      );

      expect(forExisting.isError).toBe(true);
      expect(forMissing.isError).toBe(true);
      expect(forMissing.content[0].text).toBe(forExisting.content[0].text);
    });

    it("fails closed when REDMINE_UPLOAD_DIR is set but empty", async () => {
      vi.stubEnv("REDMINE_UPLOAD_DIR", "");
      const filePath = join(dir, "evidence.png");
      await writeFile(filePath, Buffer.from([1]));
      const client = makeClient({ upload: { token: "x" } });

      const result = await handleUploadAttachment({ file_path: filePath }, client);

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("REDMINE_UPLOAD_DIR must be an absolute path");
      expect(uploadMock(client)).not.toHaveBeenCalled();
    });
  });
});
