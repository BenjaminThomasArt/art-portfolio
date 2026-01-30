import { drizzle } from "drizzle-orm/mysql2";
import { artworks, artistInfo } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

async function seed() {
  console.log("Seeding database...");

  // Insert artist info
  await db.insert(artistInfo).values({
    name: "Benjamin Thomas",
    bio: "Benjamin Thomas is a contemporary artist whose work explores the intersection of form, color, and emotion. Through a unique visual language, Benjamin creates pieces that invite viewers to pause and reflect on the beauty found in everyday moments.\n\nWith a background in fine arts and years of dedication to the craft, Benjamin's work has been featured in galleries and private collections. Each piece is created with meticulous attention to detail and a deep passion for artistic expression.",
    instagramHandle: "__benjaminthomas",
    instagramUrl: "https://instagram.com/__benjaminthomas",
  });

  console.log("✓ Artist info seeded");
  console.log("Database seeding complete!");
}

seed()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });
