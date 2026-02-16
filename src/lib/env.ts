import { z } from "zod";
import logger from "./logger";

/**
 * Environment variables validation schema
 * This ensures all required environment variables are present and valid
 */
const envSchema = z.object({
  // Database
  POSTGRES_URL: z
    .string()
    .min(1, "POSTGRES_URL is required")
    .describe("PostgreSQL connection URL"),

  // Authentication
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters")
    .describe("Secret key for Better Auth"),

  BETTER_AUTH_URL: z
    .string()
    .url()
    .optional()
    .describe("URL for Better Auth (optional)"),

  // AI Provider API Keys (at least one is required)
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
  XAI_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  OPENROUTER_API_KEY: z.string().optional(),
  OLLAMA_BASE_URL: z.string().url().optional(),

  // Optional Services
  REDIS_URL: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  EXA_API_KEY: z.string().optional(),

  // File Storage (optional)
  FILE_STORAGE_TYPE: z.enum(["s3", "vercel-blob"]).optional(),
  FILE_STORAGE_PREFIX: z.string().optional(),
  FILE_STORAGE_S3_BUCKET: z.string().optional(),
  FILE_STORAGE_S3_REGION: z.string().optional(),
  FILE_STORAGE_S3_PUBLIC_BASE_URL: z.string().url().optional(),
  FILE_STORAGE_S3_ENDPOINT: z.string().url().optional(),
  FILE_STORAGE_S3_FORCE_PATH_STYLE: z
    .string()
    .transform((val) => val === "1" || val === "true")
    .optional(),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),

  // AWS Credentials (optional)
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_SESSION_TOKEN: z.string().optional(),
  AWS_REGION: z.string().optional(),

  // OAuth (optional)
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_FORCE_ACCOUNT_SELECTION: z.string().optional(),
  MICROSOFT_CLIENT_ID: z.string().optional(),
  MICROSOFT_CLIENT_SECRET: z.string().optional(),
  MICROSOFT_TENANT_ID: z.string().optional(),
  MICROSOFT_FORCE_ACCOUNT_SELECTION: z.string().optional(),

  // Feature Flags (optional)
  DISABLE_EMAIL_SIGN_IN: z.string().optional(),
  DISABLE_EMAIL_SIGN_UP: z.string().optional(),
  DISABLE_SIGN_UP: z.string().optional(),
  NOT_ALLOW_ADD_MCP_SERVERS: z.string().optional(),
  FILE_BASED_MCP_CONFIG: z
    .string()
    .transform((val) => val === "true" || val === "1")
    .optional(),

  // MCP Settings (optional)
  MCP_MAX_TOTAL_TIMEOUT: z
    .string()
    .transform((val) => (val ? Number.parseInt(val, 10) : undefined))
    .optional(),

  // E2E Testing (optional)
  E2E_DEFAULT_MODEL: z.string().optional(),

  // Node Environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

/**
 * Validate environment variables
 * @throws {Error} If validation fails
 */
function validateEnv() {
  try {
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
      logger.error("❌ Invalid environment variables:");
      for (const error of parsed.error.issues) {
        logger.error(`  - ${error.path.join(".")}: ${error.message}`);
      }
      throw new Error("Environment validation failed");
    }

    // Check if at least one AI provider API key is set
    const aiProviders = [
      parsed.data.OPENAI_API_KEY,
      parsed.data.ANTHROPIC_API_KEY,
      parsed.data.GOOGLE_GENERATIVE_AI_API_KEY,
      parsed.data.XAI_API_KEY,
      parsed.data.GROQ_API_KEY,
      parsed.data.OPENROUTER_API_KEY,
      parsed.data.OLLAMA_BASE_URL,
    ];

    const hasAiProvider = aiProviders.some((key) => key && key.length > 0);

    if (!hasAiProvider) {
      logger.warn(
        "⚠️  No AI provider API keys found. At least one is recommended for full functionality.",
      );
    }

    logger.info("✅ Environment variables validated successfully");
    return parsed.data;
  } catch (error) {
    logger.error("Failed to validate environment variables:", error);
    throw error;
  }
}

/**
 * Validated environment variables
 * This will throw an error if validation fails
 */
export const env = validateEnv();

/**
 * Type-safe environment variables
 */
export type Env = z.infer<typeof envSchema>;
