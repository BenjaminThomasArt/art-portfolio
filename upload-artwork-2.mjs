import { storagePut } from "./server/storage.ts";
import { drizzle } from "drizzle-orm/mysql2";
import { artworks } from "./drizzle/schema.ts";
import { readFileSync } from "fs";

const db = drizzle(process.env.DATABASE_URL);

async function uploadArtwork() {
  console.log("Uploading 'I saw the whole thing' to S3...");
  
  const imageBuffer = readFileSync("/home/ubuntu/art-portfolio/artwork-i-saw-the-whole-thing.jpeg");
  const { url, key } = await storagePut(
    `artworks/i-saw-the-whole-thing-${Date.now()}.jpeg`,
    imageBuffer,
    "image/jpeg"
  );
  console.log(`✓ Image uploaded: ${url}`);
  
  console.log("\nAdding artwork to database...");
  await db.insert(artworks).values({
    title: "I saw the whole thing",
    description: null,
    imageUrl: url,
    imageKey: key,
    year: 2024,
    medium: "Mixed media on canvas",
    dimensions: "30\" x 36\"",
    available: "yes",
    featured: 0, // Not featured
    forSale: 0, // Not in shop, use enquiry
    price: null,
    paypalButtonId: null,
    displayOrder: 1,
  });
  
  console.log("✓ Artwork added to database");
  console.log("\n✅ 'I saw the whole thing' is now live in your gallery!");
}

uploadArtwork().catch(console.error);
