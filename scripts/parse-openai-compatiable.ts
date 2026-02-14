import * as fs from "fs";
import * as path from "path";
import { pathToFileURL } from "node:url";
import "load-env";
import logger from "logger";
import { openaiCompatibleModelsSafeParse } from "lib/ai/create-openai-compatiable";

const ROOT = path.resolve(path.normalize(process.cwd()));
const FILE_NAME = "openai-compatible.config.ts";

/**
 * Validates that a resolved path is within the allowed base directory
 * Prevents path traversal attacks
 */
function validatePath(basePath: string, targetPath: string): string {
  const normalizedBase = path.resolve(path.normalize(basePath));
  const normalizedTarget = path.resolve(path.normalize(targetPath));
  
  // Ensure the resolved path starts with the base directory
  if (!normalizedTarget.startsWith(normalizedBase)) {
    throw new Error(`Path traversal detected: ${targetPath} is outside of ${basePath}`);
  }
  
  return normalizedTarget;
}

const CONFIG_PATH = pathToFileURL(
  validatePath(ROOT, path.join(ROOT, FILE_NAME))
).href;

async function load() {
  try {
    const config = await import(CONFIG_PATH).then((m) => m.default);
    return openaiCompatibleModelsSafeParse(config);
  } catch (error) {
    logger.error(error);
    return [];
  }
}

/**
 * Reads a .env file, modifies a specific key's value, and writes it back.
 *
 * @param {string} envFilePath - The absolute path to the .env file.
 * @param {string} keyToModify - The key of the variable to add or edit (e.g., 'DATA').
 * @param {string} newValue - The new value for the variable.
 * @returns {boolean} - True if successful, false otherwise.
 */
function updateEnvVariable(
  envFilePath: string,
  keyToModify: string,
  newValue: string,
): boolean {
  try {
    // Validate the env file path is within ROOT
    const validatedPath = validatePath(ROOT, envFilePath);
    
    let envContent = "";
    if (fs.existsSync(validatedPath)) {
      envContent = fs.readFileSync(validatedPath, "utf8");
    }

    const envVars: { [key: string]: string } = {};
    const lines = envContent.split("\n");

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("#") || trimmedLine === "") {
        return;
      }

      const parts = trimmedLine.split("=");
      if (parts.length >= 2) {
        const key = parts[0];
        const value = parts.slice(1).join("=");
        envVars[key] = value;
      }
    });

    envVars[keyToModify] = newValue;

    let newEnvContent = "";
    for (const key in envVars) {
      if (Object.prototype.hasOwnProperty.call(envVars, key)) {
        newEnvContent += `${key}=${envVars[key]}\n`;
      }
    }

    newEnvContent = newEnvContent.trim();

    fs.writeFileSync(validatedPath, newEnvContent, "utf8");
    console.log(
      `Successfully updated ${keyToModify} in ${validatedPath} to: \n\n${newValue}\n`,
    );
    return true;
  } catch (error) {
    console.error(`Error updating .env file: ${error}`);
    return false;
  }
}

const envPath = validatePath(ROOT, path.join(ROOT, ".env"));

const openaiCompatibleProviders = await load();

const success = updateEnvVariable(
  envPath,
  "OPENAI_COMPATIBLE_DATA",
  JSON.stringify(openaiCompatibleProviders),
);

if (success) {
  console.log("Operation completed. Check your .env file!");
} else {
  console.log("Operation failed.");
}
