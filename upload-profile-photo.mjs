import { storagePut } from "./server/storage.ts";
import { drizzle } from "drizzle-orm/mysql2";
import { artistInfo } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";
import { readFileSync } from "fs";

const db = drizzle(process.env.DATABASE_URL);

async function uploadProfilePhoto() {
  console.log("Reading profile photo...");
  const photoBuffer = readFileSync("/home/ubuntu/art-portfolio/profile-photo.jpeg");
  
  console.log("Uploading to S3...");
  const { url } = await storagePut(
    `artist/profile-photo-${Date.now()}.jpeg`,
    photoBuffer,
    "image/jpeg"
  );
  
  console.log(`✓ Photo uploaded: ${url}`);
  
  console.log("Updating database...");
  const existing = await db.select().from(artistInfo).limit(1);
  if (existing.length > 0) {
    await db.update(artistInfo)
      .set({ profileImageUrl: url })
      .where(eq(artistInfo.id, existing[0].id));
    console.log("✓ Database updated with profile photo URL");
  } else {
    console.log("⚠ No artist info record found");
  }
  
  console.log("\nProfile photo successfully added to About page!");
}

uploadProfilePhoto().catch(console.error);
