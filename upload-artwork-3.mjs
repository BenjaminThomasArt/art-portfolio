import { storagePut } from "./server/storage.ts";
import { drizzle } from "drizzle-orm/mysql2";
import { artworks } from "./drizzle/schema.ts";
import { readFileSync } from "fs";

const db = drizzle(process.env.DATABASE_URL);

async function uploadArtwork() {
  console.log("Uploading 'Chrysalis I & II' to S3...");
  
  const imageBuffer = readFileSync("/home/ubuntu/art-portfolio/artwork-chrysalis.jpg");
  const { url, key } = await storagePut(
    `artworks/chrysalis-${Date.now()}.jpg`,
    imageBuffer,
    "image/jpeg"
  );
  console.log(`✓ Image uploaded: ${url}`);
  
  console.log("\nAdding artwork to database...");
  await db.insert(artworks).values({
    title: "Chrysalis I & II",
    description: null,
    imageUrl: url,
    imageKey: key,
    year: 2026,
    medium: "Mixed media diptych on canvas",
    dimensions: "2 x 80x60cm",
    available: "yes",
    featured: 0, // Not featured
    forSale: 0, // Not in shop, use enquiry
    price: null,
    paypalButtonId: null,
    displayOrder: 2,
  });
  
  console.log("✓ Artwork added to database");
  console.log("\n✅ 'Chrysalis I & II' is now live in your gallery!");
}

uploadArtwork().catch(console.error);
