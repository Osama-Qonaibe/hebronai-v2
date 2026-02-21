import { exec } from "child_process";
import { IS_VERCEL_ENV, IS_DOCKER_ENV, FILE_BASED_MCP_CONFIG } from "lib/const";
import { promisify } from "util";
import "load-env";

const execPromise = promisify(exec);

async function runCommand(command: string, description: string) {
  console.log(`Starting: ${description}`);
  try {
    const { stdout, stderr } = await execPromise(command, {
      cwd: process.cwd(),
      env: process.env,
    });

    console.log(`${description} output:`);
    console.log(stdout);

    if (stderr) {
      console.error(`${description} stderr:`);
      console.error(stderr);
    }
    console.log(`${description} finished successfully.`);
  } catch (error: any) {
    console.error(`${description} error:`, error);
    // Don't exit on migration errors to allow build to continue
    if (!description.includes("migration")) {
      process.exit(1);
    } else {
      console.warn(`⚠️  ${description} failed, but continuing build...`);
      console.warn("💡 You can run migrations manually after deployment.");
    }
  }
}

async function main() {
  if (IS_VERCEL_ENV) {
    if (FILE_BASED_MCP_CONFIG) {
      console.error("File based MCP config is not supported on Vercel.");
      process.exit(1);
    }

    if (process.env.SKIP_DB_MIGRATIONS === "true") {
      console.log(
        "SKIP_DB_MIGRATIONS=true; skipping database migration on Vercel.",
      );
      return;
    }

    console.log("Running on Vercel, attempting database migration.");
    console.log("💡 If migration fails, the build will continue.");
    console.log("   You can run migrations manually using: pnpm db:push");
    await runCommand("pnpm db:migrate", "Database migration");
  } else if (IS_DOCKER_ENV) {
    if (FILE_BASED_MCP_CONFIG) {
      console.error("File based MCP config is not supported in Docker.");
      process.exit(1);
    }
  } else {
    console.log(
      "Running in a normal environment, performing initial environment setup.",
    );
    await runCommand("pnpm initial:env", "Initial environment setup");
    await runCommand(
      "pnpm openai-compatiable:init",
      "Initial openAI compatiable config setup",
    );
  }
}

main();
