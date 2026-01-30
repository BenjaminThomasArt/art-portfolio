import { storagePut } from "./server/storage.js";
import { getDb } from "./server/db.js";
import { artworks } from "./drizzle/schema.js";
import { readFileSync } from "fs";
import { nanoid } from "nanoid";

const db = await getDb();

// Upload Tiefenschwarz
const tiefenschwarzBuffer = readFileSync("/home/ubuntu/art-portfolio/tiefenschwarz.jpeg");
const tiefenschwarzKey = `artworks/tiefenschwarz-${nanoid()}.jpeg`;
const { url: tiefenschwarzUrl } = await storagePut(tiefenschwarzKey, tiefenschwarzBuffer, "image/jpeg");

await db.insert(artworks).values({
  title: "Tiefenschwarz",
  medium: "Mixed media diptych on canvas",
  dimensions: "2 x 80x60 cm",
  year: 2025,
  imageUrl: tiefenschwarzUrl,
  imageKey: tiefenschwarzKey,
  isFeatured: 0,
  forSale: 0,
});

console.log("✓ Tiefenschwarz uploaded and added to gallery");

// Upload Delphium
const delphiumBuffer = readFileSync("/home/ubuntu/art-portfolio/delphium.jpeg");
const delphiumKey = `artworks/delphium-${nanoid()}.jpeg`;
const { url: delphiumUrl } = await storagePut(delphiumKey, delphiumBuffer, "image/jpeg");

await db.insert(artworks).values({
  title: "Delphium",
  medium: "Mixed media on canvas",
  dimensions: "80 x 60cm",
  year: 2025,
  imageUrl: delphiumUrl,
  imageKey: delphiumKey,
  isFeatured: 0,
  forSale: 0,
});

console.log("✓ Delphium uploaded and added to gallery");
console.log("✓ Both artworks successfully added to gallery");

process.exit(0);
