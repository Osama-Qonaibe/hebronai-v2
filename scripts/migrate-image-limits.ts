import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_IMAGE_LIMITS = {
  maxPerDay: 10,
  maxPerMonth: 100,
  maxResolution: "1024x1024" as const,
};

async function migrateImageLimits() {
  console.log("🔄 Starting migration: Add image limits to existing plans...");
  console.log("━".repeat(60));

  try {
    // Get all plans
    const plans = await prisma.subscriptionPlan.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        limits: true,
        features: true,
      },
    });

    console.log(`📊 Found ${plans.length} plan(s) in database\n`);

    if (plans.length === 0) {
      console.log("⚠️  No plans found. Skipping migration.");
      return;
    }

    let updated = 0;
    let skipped = 0;
    const errors: Array<{ plan: string; error: string }> = [];

    for (const plan of plans) {
      const limits = plan.limits as any;
      const features = plan.features as any;

      // Check if limits.images already exists
      if (limits?.images) {
        console.log(
          `  ✅ ${plan.name} (${plan.slug}) - Already has image limits`,
        );
        skipped++;
        continue;
      }

      try {
        console.log(
          `  ⚙️  ${plan.name} (${plan.slug}) - Adding image limits...`,
        );

        // Determine appropriate limits based on plan features
        let imageLimits = { ...DEFAULT_IMAGE_LIMITS };

        // Adjust limits based on plan tier
        if (features?.advanced?.imageGeneration) {
          // Higher limits for plans with image generation enabled
          if (plan.slug.includes("pro") || plan.slug.includes("premium")) {
            imageLimits = {
              maxPerDay: 50,
              maxPerMonth: 500,
              maxResolution: "1792x1024",
            };
          } else if (
            plan.slug.includes("enterprise") ||
            plan.slug.includes("unlimited")
          ) {
            imageLimits = {
              maxPerDay: 200,
              maxPerMonth: 2000,
              maxResolution: "1792x1024",
            };
          }
        } else {
          // Lower limits for basic plans
          imageLimits = {
            maxPerDay: 5,
            maxPerMonth: 50,
            maxResolution: "512x512",
          };
        }

        await prisma.subscriptionPlan.update({
          where: { id: plan.id },
          data: {
            limits: {
              ...limits,
              images: imageLimits,
            },
          },
        });

        console.log(`     ✓ Added: ${JSON.stringify(imageLimits)}`);
        updated++;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`     ❌ Failed: ${errorMsg}`);
        errors.push({ plan: plan.name, error: errorMsg });
      }
    }

    console.log("\n" + "━".repeat(60));
    console.log("✨ Migration Summary:");
    console.log(`   • Total plans: ${plans.length}`);
    console.log(`   • Updated: ${updated}`);
    console.log(`   • Skipped (already had limits): ${skipped}`);
    console.log(`   • Errors: ${errors.length}`);

    if (errors.length > 0) {
      console.log("\n⚠️  Errors encountered:");
      errors.forEach(({ plan, error }) => {
        console.log(`   - ${plan}: ${error}`);
      });
    }

    console.log("━".repeat(60));
    console.log(
      updated > 0
        ? "✅ Migration completed successfully!"
        : "ℹ️  No plans needed updating.",
    );
  } catch (error) {
    console.error("\n❌ Migration failed with critical error:");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateImageLimits()
  .then(() => {
    console.log("\n👋 Migration script finished.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Unexpected error:", error);
    process.exit(1);
  });
