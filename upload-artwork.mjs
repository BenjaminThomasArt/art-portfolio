import { storagePut } from "./server/storage.ts";
import { drizzle } from "drizzle-orm/mysql2";
import { artworks } from "./drizzle/schema.ts";
import { readFileSync } from "fs";

const db = drizzle(process.env.DATABASE_URL);

async function uploadArtwork() {
  console.log("Uploading artwork images to S3...");
  
  // Upload all three images
  const image1Buffer = readFileSync("/home/ubuntu/art-portfolio/artwork-1.jpeg");
  const { url: url1, key: key1 } = await storagePut(
    `artworks/subject-of-paint-1-${Date.now()}.jpeg`,
    image1Buffer,
    "image/jpeg"
  );
  console.log(`✓ Image 1 uploaded: ${url1}`);
  
  const image2Buffer = readFileSync("/home/ubuntu/art-portfolio/artwork-2.jpeg");
  const { url: url2, key: key2 } = await storagePut(
    `artworks/subject-of-paint-2-${Date.now()}.jpeg`,
    image2Buffer,
    "image/jpeg"
  );
  console.log(`✓ Image 2 uploaded: ${url2}`);
  
  const image3Buffer = readFileSync("/home/ubuntu/art-portfolio/artwork-3.jpeg");
  const { url: url3, key: key3 } = await storagePut(
    `artworks/subject-of-paint-3-${Date.now()}.jpeg`,
    image3Buffer,
    "image/jpeg"
  );
  console.log(`✓ Image 3 uploaded: ${url3}`);
  
  console.log("\nAdding artwork to database...");
  await db.insert(artworks).values({
    title: "The Subject of Paint",
    description: null,
    imageUrl: url1, // Main image (room shot with both panels)
    imageKey: key1,
    year: 2026,
    medium: "Mixed Media on PVC board",
    dimensions: "80 x 60cm diptych",
    available: "yes",
    featured: 1, // Featured on homepage
    forSale: 0, // Not in shop, use enquiry instead
    price: null,
    paypalButtonId: null,
    displayOrder: 0,
  });
  
  console.log("✓ Artwork added to database");
  console.log("\n✅ 'The Subject of Paint' is now live in your gallery and featured on the homepage!");
  console.log("\nNote: All three images have been uploaded to S3. Currently using image 1 as the main display.");
  console.log("Additional images URLs:");
  console.log(`- Image 2: ${url2}`);
  console.log(`- Image 3: ${url3}`);
}

uploadArtwork().catch(console.error);
