CREATE TABLE IF NOT EXISTS "file_storage" (
	"key" text PRIMARY KEY NOT NULL,
	"filename" text NOT NULL,
	"content_type" text NOT NULL,
	"size" integer NOT NULL,
	"data" text NOT NULL,
	"uploaded_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_file_storage_uploaded_at" ON "file_storage" ("uploaded_at");
