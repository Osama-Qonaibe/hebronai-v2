# PostgreSQL File Storage

## Overview

This system stores uploaded files (including AI-generated images) directly in the PostgreSQL database. No external storage service required.

## Features

- ✅ Zero external dependencies
- ✅ Simple deployment
- ✅ Works on Vercel, VPS, or any hosting
- ✅ Automatic file serving via API
- ✅ Base64 encoding for binary data

## Setup

### 1. Set Environment Variable

In your `.env` file or Vercel environment variables:

```bash
FILE_STORAGE_TYPE=postgres
FILE_STORAGE_PREFIX=uploads
```

That's it! No additional configuration needed.

### 2. Run Database Migration

```bash
pnpm db:push
```

Or manually run:

```sql
CREATE TABLE IF NOT EXISTS "file_storage" (
	"key" text PRIMARY KEY NOT NULL,
	"filename" text NOT NULL,
	"content_type" text NOT NULL,
	"size" integer NOT NULL,
	"data" text NOT NULL,
	"uploaded_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_file_storage_uploaded_at" ON "file_storage" ("uploaded_at");
```

## How It Works

1. **Upload**: Files are converted to Base64 and stored in the `file_storage` table
2. **Serve**: Files are served via `/api/storage/files/[key]`
3. **Access**: Images can be embedded using the returned URL

## API Endpoints

### Get File
```
GET /api/storage/files/{key}
```

### Download File
```
GET /api/storage/files/{key}?download=true&filename=image.png
```

## Database Schema

```typescript
export const FileStorageTable = pgTable(
  "file_storage",
  {
    key: text("key").primaryKey().notNull(),
    filename: text("filename").notNull(),
    contentType: text("content_type").notNull(),
    size: integer("size").notNull(),
    data: text("data").notNull(), // Base64 encoded
    uploadedAt: timestamp("uploaded_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [index("idx_file_storage_uploaded_at").on(t.uploadedAt)],
);
```

## Performance Considerations

### Pros
- Simple deployment
- No extra costs
- Transactional consistency
- Easy backups (included with DB backup)

### Cons
- Database size increases
- Not ideal for very large files (>10MB)
- Better for small to medium files

## Best For

- AI-generated images (typically <1MB)
- User profile pictures
- Small documents
- MVPs and prototypes
- Self-hosted deployments

## Alternatives

For large files or high-volume storage, consider:
- Vercel Blob (`FILE_STORAGE_TYPE=vercel-blob`)
- S3-compatible storage (`FILE_STORAGE_TYPE=s3`)

## Troubleshooting

### Images not displaying
1. Check database migration ran successfully
2. Verify `FILE_STORAGE_TYPE=postgres` in environment
3. Check browser console for API errors

### Database size growing
- Consider cleanup cron jobs for old files
- Implement file size limits
- Move to external storage if needed
