import { db } from './server/db.ts';
import { artworks } from './drizzle/schema.ts';
import { like } from 'drizzle-orm';

const result = await db.select().from(artworks).where(like(artworks.title, '%Chrysalis%'));
console.log(JSON.stringify(result, null, 2));
process.exit(0);
