import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  artworks, 
  InsertArtwork, 
  inquiries, 
  InsertInquiry,
  artistInfo,
  InsertArtistInfo,
  prints,
  InsertPrint
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Artwork queries
export async function getAllArtworks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(artworks).orderBy(artworks.displayOrder, artworks.createdAt);
}

export async function getFeaturedArtworks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(artworks).where(eq(artworks.featured, 1)).orderBy(artworks.displayOrder);
}

export async function getShopArtworks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(artworks).where(eq(artworks.forSale, 1)).orderBy(artworks.displayOrder, artworks.createdAt);
}

export async function getArtworkById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(artworks).where(eq(artworks.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createArtwork(artwork: InsertArtwork) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(artworks).values(artwork);
  return result;
}

export async function updateArtwork(id: number, artwork: Partial<InsertArtwork>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(artworks).set(artwork).where(eq(artworks.id, id));
}

export async function deleteArtwork(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(artworks).where(eq(artworks.id, id));
}

// Inquiry queries
export async function createInquiry(inquiry: InsertInquiry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(inquiries).values(inquiry);
  return result;
}

export async function getAllInquiries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(inquiries).orderBy(inquiries.createdAt);
}

export async function updateInquiryStatus(id: number, status: "new" | "read" | "replied" | "archived") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(inquiries).set({ status }).where(eq(inquiries.id, id));
}

// Artist info queries
export async function getArtistInfo() {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(artistInfo).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertArtistInfo(info: InsertArtistInfo) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getArtistInfo();
  if (existing) {
    await db.update(artistInfo).set(info).where(eq(artistInfo.id, existing.id));
  } else {
    await db.insert(artistInfo).values(info);
  }
}

// Print queries
export async function getAllPrints() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(prints).where(eq(prints.available, 1)).orderBy(prints.displayOrder, prints.createdAt);
}

export async function getPrintById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(prints).where(eq(prints.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createPrint(print: InsertPrint) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(prints).values(print);
  return result;
}
