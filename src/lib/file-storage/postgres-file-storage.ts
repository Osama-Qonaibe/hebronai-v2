import "server-only";
import { db } from "db";
import { fileStorage as fileStorageTable } from "db/schema";
import { eq } from "drizzle-orm";
import logger from "logger";
import type {
  FileMetadata,
  FileStorage,
  UploadContent,
  UploadOptions,
  UploadResult,
  UploadUrl,
  UploadUrlOptions,
} from "./file-storage.interface";
import { generateFileKey, getFilenameFromKey } from "./storage-utils";

const DEFAULT_PREFIX = process.env.FILE_STORAGE_PREFIX || "uploads";

async function contentToBuffer(content: UploadContent): Promise<Buffer> {
  if (Buffer.isBuffer(content)) {
    return content;
  }
  if (content instanceof ArrayBuffer) {
    return Buffer.from(content);
  }
  if (ArrayBuffer.isView(content)) {
    return Buffer.from(content.buffer, content.byteOffset, content.byteLength);
  }
  if (content instanceof Blob || content instanceof File) {
    return Buffer.from(await content.arrayBuffer());
  }
  if ("pipe" in content || Symbol.asyncIterator in content) {
    const chunks: Uint8Array[] = [];
    for await (const chunk of content as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }
  throw new Error("Unsupported upload content type");
}

export function createPostgresFileStorage(): FileStorage {
  return {
    async upload(
      content: UploadContent,
      options?: UploadOptions,
    ): Promise<UploadResult> {
      const filename = options?.filename || "file";
      const contentType = options?.contentType || "application/octet-stream";
      const key = generateFileKey(DEFAULT_PREFIX, filename);
      
      const buffer = await contentToBuffer(content);
      const size = buffer.length;

      await db.insert(fileStorageTable).values({
        key,
        filename,
        contentType,
        size,
        data: buffer,
        uploadedAt: new Date(),
      });

      logger.info(`File uploaded to PostgreSQL: ${key}`);

      return {
        key,
        sourceUrl: `/api/storage/files/${key}`,
        metadata: {
          key,
          filename,
          contentType,
          size,
          uploadedAt: new Date(),
        },
      };
    },

    async createUploadUrl(
      options: UploadUrlOptions,
    ): Promise<UploadUrl | null> {
      return null;
    },

    async download(key: string): Promise<Buffer> {
      const result = await db
        .select({ data: fileStorageTable.data })
        .from(fileStorageTable)
        .where(eq(fileStorageTable.key, key))
        .limit(1);

      if (!result[0]?.data) {
        throw new Error(`File not found: ${key}`);
      }

      return result[0].data;
    },

    async delete(key: string): Promise<void> {
      await db.delete(fileStorageTable).where(eq(fileStorageTable.key, key));
      logger.info(`File deleted from PostgreSQL: ${key}`);
    },

    async exists(key: string): Promise<boolean> {
      const result = await db
        .select({ key: fileStorageTable.key })
        .from(fileStorageTable)
        .where(eq(fileStorageTable.key, key))
        .limit(1);
      return result.length > 0;
    },

    async getMetadata(key: string): Promise<FileMetadata | null> {
      const result = await db
        .select({
          key: fileStorageTable.key,
          filename: fileStorageTable.filename,
          contentType: fileStorageTable.contentType,
          size: fileStorageTable.size,
          uploadedAt: fileStorageTable.uploadedAt,
        })
        .from(fileStorageTable)
        .where(eq(fileStorageTable.key, key))
        .limit(1);

      if (!result[0]) {
        return null;
      }

      return {
        key: result[0].key,
        filename: result[0].filename,
        contentType: result[0].contentType,
        size: result[0].size,
        uploadedAt: result[0].uploadedAt,
      };
    },

    async getSourceUrl(key: string): Promise<string | null> {
      const exists = await this.exists(key);
      return exists ? `/api/storage/files/${key}` : null;
    },

    async getDownloadUrl(key: string): Promise<string | null> {
      const exists = await this.exists(key);
      if (!exists) return null;
      const filename = getFilenameFromKey(key);
      return `/api/storage/files/${key}?download=true&filename=${encodeURIComponent(filename)}`;
    },
  };
}
