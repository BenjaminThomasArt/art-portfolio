import { storagePut } from "./server/storage.js";
import { getDb } from "./server/db.js";
import { artworks } from "./drizzle/schema.js";
import { readFileSync } from "fs";
import { nanoid } from "nanoid";

const db = await getDb();

// Upload first image (single panel close-up)
const image1Buffer = readFileSync("/home/ubuntu/art-portfolio/candyflip-1.png");
const image1Key = `artworks/candyflip-1-${nanoid()}.png`;
const { url: image1Url } = await storagePut(image1Key, image1Buffer, "image/png");

// Upload second image (both panels together)
const image2Buffer = readFileSync("/home/ubuntu/art-portfolio/candyflip-2.png");
const image2Key = `artworks/candyflip-2-${nanoid()}.png`;
const { url: image2Url } = await storagePut(image2Key, image2Buffer, "image/png");

// Upload third image (other panel close-up)
const image3Buffer = readFileSync("/home/ubuntu/art-portfolio/candyflip-3.png");
const image3Key = `artworks/candyflip-3-${nanoid()}.png`;
const { url: image3Url } = await storagePut(image3Key, image3Buffer, "image/png");

// Use the both-panels image as the main image
await db.insert(artworks).values({
  title: "Candyflip",
  medium: "Mixed media diptych on canvas",
  dimensions: "2 x 36\"x30\"",
  year: 2025,
  imageUrl: image2Url,
  imageKey: image2Key,
  isFeatured: 0,
  forSale: 0,
});

console.log("✓ Candyflip uploaded and added to gallery");
console.log(`  Main image: ${image2Url}`);
console.log(`  Additional images: ${image1Url}, ${image3Url}`);

process.exit(0);
