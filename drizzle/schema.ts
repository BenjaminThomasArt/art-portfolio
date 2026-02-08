import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Artworks table - stores all artwork pieces
 */
export const artworks = mysqlTable("artworks", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  imageKey: varchar("image_key", { length: 512 }).notNull(),
  galleryImages: text("gallery_images"), // JSON array of additional image URLs for carousel
  year: int("year"),
  medium: varchar("medium", { length: 255 }),
  dimensions: varchar("dimensions", { length: 255 }),
  available: mysqlEnum("available", ["yes", "no", "sold"]).default("yes").notNull(),
  featured: int("featured").default(0).notNull(), // 0 = not featured, 1 = featured
  forSale: int("for_sale").default(0).notNull(), // 0 = not for sale, 1 = for sale in shop
  price: varchar("price", { length: 50 }), // e.g., "£250" or "$350"
  paypalButtonId: text("paypal_button_id"), // PayPal hosted button ID
  displayOrder: int("display_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Artwork = typeof artworks.$inferSelect;
export type InsertArtwork = typeof artworks.$inferInsert;

/**
 * Inquiries table - stores contact form and print inquiry submissions
 */
export const inquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["contact", "print", "commission"]).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  message: text("message").notNull(),
  artworkId: int("artwork_id"), // null for general inquiries
  status: mysqlEnum("status", ["new", "read", "replied", "archived"]).default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;

/**
 * Artist info table - stores bio and social links (single row)
 */
export const artistInfo = mysqlTable("artist_info", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  bio: text("bio").notNull(),
  profileImageUrl: text("profile_image_url"),
  profileImageKey: varchar("profile_image_key", { length: 512 }),
  instagramHandle: varchar("instagram_handle", { length: 100 }),
  instagramUrl: varchar("instagram_url", { length: 255 }),
  facebookUrl: varchar("facebook_url", { length: 255 }),
  twitterUrl: varchar("twitter_url", { length: 255 }),
  linkedinUrl: varchar("linkedin_url", { length: 255 }),
  websiteUrl: varchar("website_url", { length: 255 }),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ArtistInfo = typeof artistInfo.$inferSelect;
export type InsertArtistInfo = typeof artistInfo.$inferInsert;

/**
 * Prints table - stores print products available for purchase
 * Separate from original artworks to allow different images and custom sizing
 */
export const prints = mysqlTable("prints", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  imageKey: varchar("image_key", { length: 512 }).notNull(),
  galleryImages: text("gallery_images"), // JSON array of additional image URLs for carousel
  sizeInfo: varchar("size_info", { length: 255 }), // e.g., "Available in custom sizes", "A3 only", etc.
  price: varchar("price", { length: 50 }), // Optional - can be null if custom pricing
  available: int("available").default(1).notNull(), // 0 = unavailable, 1 = available
  isDiptych: int("is_diptych").default(0).notNull(), // 0 = single piece, 1 = diptych (two panels)
  displayOrder: int("display_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Print = typeof prints.$inferSelect;
export type InsertPrint = typeof prints.$inferInsert;