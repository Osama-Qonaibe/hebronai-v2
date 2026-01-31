import { config } from "dotenv";
import { existsSync } from "fs";
import { join, resolve, normalize } from "path";

/**
 * Validates that a resolved path is within the allowed base directory
 * Prevents path traversal attacks
 */
function validatePath(basePath: string, targetPath: string): string {
  const normalizedBase = resolve(normalize(basePath));
  const normalizedTarget = resolve(normalize(targetPath));
  
  // Ensure the resolved path starts with the base directory
  if (!normalizedTarget.startsWith(normalizedBase)) {
    throw new Error(`Path traversal detected: ${targetPath} is outside of ${basePath}`);
  }
  
  return normalizedTarget;
}

export const load = <T extends Record<string, string> = Record<string, string>>(
  root: string = process.cwd(),
): T => {
  // Validate root path first
  const safeRoot = resolve(normalize(root));
  
  const localEnv = validatePath(safeRoot, join(safeRoot, ".env.local"));
  const modeEnv = validatePath(safeRoot, join(safeRoot, `.env.${process.env.NODE_ENV}`));
  const defaultEnv = validatePath(safeRoot, join(safeRoot, ".env"));
  
  return [localEnv, modeEnv, defaultEnv].reduce<T>((prev, path) => {
    const variables = !existsSync(path) ? {} : (config({ path }).parsed ?? {});
    Object.entries(variables).forEach(([key, value]) => {
      if (!Object.prototype.hasOwnProperty.call(prev, key))
        Object.assign(prev, { [key]: value });
    });
    return prev;
  }, {} as T);
};

load();
