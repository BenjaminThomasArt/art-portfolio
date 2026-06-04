var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
var users, artworks, inquiries, artistInfo, prints, orders, bambinaChecklist, bambinaShopping, bambinaNotes, bambinaPayments;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    users = mysqlTable("users", {
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
      lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
    });
    artworks = mysqlTable("artworks", {
      id: int("id").autoincrement().primaryKey(),
      title: varchar("title", { length: 255 }).notNull(),
      description: text("description"),
      imageUrl: text("image_url").notNull(),
      imageKey: varchar("image_key", { length: 512 }).notNull(),
      galleryImages: text("gallery_images"),
      // JSON array of additional image URLs for carousel
      year: int("year"),
      medium: varchar("medium", { length: 255 }),
      dimensions: varchar("dimensions", { length: 255 }),
      available: mysqlEnum("available", ["yes", "no", "sold"]).default("yes").notNull(),
      featured: int("featured").default(0).notNull(),
      // 0 = not featured, 1 = featured
      forSale: int("for_sale").default(0).notNull(),
      // 0 = not for sale, 1 = for sale in shop
      price: varchar("price", { length: 50 }),
      // e.g., "£250" or "$350"
      paypalButtonId: text("paypal_button_id"),
      // PayPal hosted button ID
      displayOrder: int("display_order").default(0).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
    });
    inquiries = mysqlTable("inquiries", {
      id: int("id").autoincrement().primaryKey(),
      type: mysqlEnum("type", ["contact", "print", "commission"]).notNull(),
      name: varchar("name", { length: 255 }).notNull(),
      email: varchar("email", { length: 320 }).notNull(),
      phone: varchar("phone", { length: 50 }),
      message: text("message").notNull(),
      artworkId: int("artwork_id"),
      // null for general inquiries
      status: mysqlEnum("status", ["new", "read", "replied", "archived"]).default("new").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    artistInfo = mysqlTable("artist_info", {
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
      updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
    });
    prints = mysqlTable("prints", {
      id: int("id").autoincrement().primaryKey(),
      title: varchar("title", { length: 255 }).notNull(),
      description: text("description"),
      imageUrl: text("image_url").notNull(),
      imageKey: varchar("image_key", { length: 512 }).notNull(),
      galleryImages: text("gallery_images"),
      // JSON array of additional image URLs for carousel
      sizeInfo: varchar("size_info", { length: 255 }),
      // e.g., "Available in custom sizes", "A3 only", etc.
      price: varchar("price", { length: 50 }),
      // Optional - can be null if custom pricing
      available: int("available").default(1).notNull(),
      // 0 = unavailable, 1 = available
      isDiptych: int("is_diptych").default(0).notNull(),
      // 0 = single piece, 1 = diptych (two panels)
      panelCount: int("panel_count").default(1).notNull(),
      // 1 = single, 2 = diptych, 3 = triptych
      displayOrder: int("display_order").default(0).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
    });
    orders = mysqlTable("orders", {
      id: int("id").autoincrement().primaryKey(),
      orderRef: varchar("order_ref", { length: 20 }).notNull().unique(),
      /** Buyer details */
      buyerName: varchar("buyer_name", { length: 255 }).notNull(),
      buyerEmail: varchar("buyer_email", { length: 320 }).notNull(),
      buyerPhone: varchar("buyer_phone", { length: 50 }),
      /** Shipping address */
      addressLine1: varchar("address_line1", { length: 255 }).notNull(),
      addressLine2: varchar("address_line2", { length: 255 }),
      city: varchar("city", { length: 100 }).notNull(),
      county: varchar("county", { length: 100 }),
      postcode: varchar("postcode", { length: 20 }).notNull(),
      country: varchar("country", { length: 100 }).notNull(),
      /** Item details */
      section: mysqlEnum("section", ["prints", "upcycles"]).notNull(),
      itemTitle: varchar("item_title", { length: 255 }).notNull(),
      itemDetails: text("item_details"),
      // material, size, panel selection etc.
      price: varchar("price", { length: 50 }).notNull(),
      /** Order status */
      status: mysqlEnum("status", ["pending", "paid", "shipped", "delivered", "cancelled"]).default("pending").notNull(),
      notes: text("notes"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
    });
    bambinaChecklist = mysqlTable("bambina_checklist", {
      id: int("id").autoincrement().primaryKey(),
      category: varchar("category", { length: 100 }).notNull(),
      // e.g., "legal", "medical", "travel", "financial", "nursery"
      phase: varchar("phase", { length: 100 }).notNull(),
      // e.g., "first_trimester", "second_trimester", "third_trimester", "post_birth"
      title: varchar("title", { length: 500 }).notNull(),
      description: text("description"),
      completed: int("completed").default(0).notNull(),
      // 0 = pending, 1 = completed
      notes: text("notes"),
      snoozedWeeks: int("snoozed_weeks").default(0).notNull(),
      dueWeek: int("due_week"),
      // week of gestation when this is due
      sortOrder: int("sort_order").default(0).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
    });
    bambinaShopping = mysqlTable("bambina_shopping", {
      id: int("id").autoincrement().primaryKey(),
      category: varchar("category", { length: 100 }).notNull(),
      // e.g., "feeding", "sleeping", "clothing", "travel", "bath", "health"
      title: varchar("title", { length: 500 }).notNull(),
      notes: text("notes"),
      // e.g., "provided by MSJ", price info, links
      purchased: int("purchased").default(0).notNull(),
      // 0 = not purchased, 1 = purchased
      sortOrder: int("sort_order").default(0).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
    });
    bambinaNotes = mysqlTable("bambina_notes", {
      id: int("id").autoincrement().primaryKey(),
      category: varchar("category", { length: 100 }).notNull(),
      // e.g., "general", "medical", "travel", "questions"
      title: varchar("title", { length: 255 }),
      content: text("content").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
    });
    bambinaPayments = mysqlTable("bambina_payments", {
      id: int("id").autoincrement().primaryKey(),
      category: varchar("category", { length: 100 }).notNull(),
      // e.g., "agency", "legal", "medical", "surrogate", "travel"
      description: varchar("description", { length: 500 }).notNull(),
      amount: varchar("amount", { length: 100 }).notNull(),
      // e.g., "USD $15,500" or "MXN $28,000"
      currency: varchar("currency", { length: 10 }).notNull(),
      // "USD", "MXN", "GBP"
      amountNumeric: int("amount_numeric"),
      // numeric value in smallest unit for sorting/totals
      dueMonth: varchar("due_month", { length: 50 }),
      // e.g., "Month 10", "Week 16"
      paid: int("paid").default(0).notNull(),
      // 0 = unpaid, 1 = paid
      paidDate: timestamp("paid_date"),
      sortOrder: int("sort_order").default(0).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
    });
  }
});

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
    };
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  createArtwork: () => createArtwork,
  createInquiry: () => createInquiry,
  createOrder: () => createOrder,
  createPrint: () => createPrint,
  deleteArtwork: () => deleteArtwork,
  getAllArtworks: () => getAllArtworks,
  getAllInquiries: () => getAllInquiries,
  getAllOrders: () => getAllOrders,
  getAllPrints: () => getAllPrints,
  getArtistInfo: () => getArtistInfo,
  getArtworkById: () => getArtworkById,
  getDb: () => getDb,
  getFeaturedArtworks: () => getFeaturedArtworks,
  getOrderById: () => getOrderById,
  getOrderByRef: () => getOrderByRef,
  getPrintById: () => getPrintById,
  getShopArtworks: () => getShopArtworks,
  getUserByOpenId: () => getUserByOpenId,
  updateArtwork: () => updateArtwork,
  updateInquiryStatus: () => updateInquiryStatus,
  updateOrderStatus: () => updateOrderStatus,
  upsertArtistInfo: () => upsertArtistInfo,
  upsertUser: () => upsertUser
});
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
async function getDb() {
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
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getAllArtworks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(artworks).orderBy(artworks.displayOrder, artworks.createdAt);
}
async function getFeaturedArtworks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(artworks).where(eq(artworks.featured, 1)).orderBy(artworks.displayOrder);
}
async function getShopArtworks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(artworks).where(eq(artworks.forSale, 1)).orderBy(artworks.displayOrder, artworks.createdAt);
}
async function getArtworkById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(artworks).where(eq(artworks.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createArtwork(artwork) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(artworks).values(artwork);
  return result;
}
async function updateArtwork(id, artwork) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(artworks).set(artwork).where(eq(artworks.id, id));
}
async function deleteArtwork(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(artworks).where(eq(artworks.id, id));
}
async function createInquiry(inquiry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(inquiries).values(inquiry);
  return result;
}
async function getAllInquiries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(inquiries).orderBy(inquiries.createdAt);
}
async function updateInquiryStatus(id, status) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(inquiries).set({ status }).where(eq(inquiries.id, id));
}
async function getArtistInfo() {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(artistInfo).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function upsertArtistInfo(info) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getArtistInfo();
  if (existing) {
    await db.update(artistInfo).set(info).where(eq(artistInfo.id, existing.id));
  } else {
    await db.insert(artistInfo).values(info);
  }
}
async function getAllPrints() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select({
    id: prints.id,
    title: prints.title,
    description: prints.description,
    imageUrl: prints.imageUrl,
    imageKey: prints.imageKey,
    price: prints.price,
    sizeInfo: prints.sizeInfo,
    available: prints.available,
    isDiptych: prints.isDiptych,
    panelCount: prints.panelCount,
    displayOrder: prints.displayOrder,
    createdAt: prints.createdAt,
    galleryImages: prints.galleryImages,
    artworkGalleryImages: artworks.galleryImages
  }).from(prints).leftJoin(artworks, eq(prints.title, artworks.title)).where(eq(prints.available, 1)).orderBy(prints.displayOrder, prints.createdAt);
  return result;
}
async function getPrintById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(prints).where(eq(prints.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createPrint(print) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(prints).values(print);
  return result;
}
function generateOrderRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const prefix = "BT";
  let ref = "";
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${ref}`;
}
async function createOrder(order) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const orderRef = generateOrderRef();
  await db.insert(orders).values({ ...order, orderRef });
  return { orderRef };
}
async function getOrderByRef(orderRef) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(orders).where(eq(orders.orderRef, orderRef)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(orders.createdAt);
}
async function getOrderById(id) {
  const db = await getDb();
  if (!db) return null;
  const [order] = await db.select().from(orders).where(eq(orders.id, id));
  return order || null;
}
async function updateOrderStatus(id, status) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(orders).set({ status }).where(eq(orders.id, id));
}
var _db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_env();
    _db = null;
  }
});

// server/_core/notification.ts
var notification_exports = {};
__export(notification_exports, {
  notifyOwner: () => notifyOwner
});
import { TRPCError } from "@trpc/server";
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}
var TITLE_MAX_LENGTH, CONTENT_MAX_LENGTH, trimValue, isNonEmptyString2, buildEndpointUrl, validatePayload;
var init_notification = __esm({
  "server/_core/notification.ts"() {
    "use strict";
    init_env();
    TITLE_MAX_LENGTH = 1200;
    CONTENT_MAX_LENGTH = 2e4;
    trimValue = (value) => value.trim();
    isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
    buildEndpointUrl = (baseUrl) => {
      const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
      return new URL(
        "webdevtoken.v1.WebDevService/SendNotification",
        normalizedBase
      ).toString();
    };
    validatePayload = (input) => {
      if (!isNonEmptyString2(input.title)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Notification title is required."
        });
      }
      if (!isNonEmptyString2(input.content)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Notification content is required."
        });
      }
      const title = trimValue(input.title);
      const content = trimValue(input.content);
      if (title.length > TITLE_MAX_LENGTH) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
        });
      }
      if (content.length > CONTENT_MAX_LENGTH) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
        });
      }
      return { title, content };
    };
  }
});

// server/bambina-db.ts
var bambina_db_exports = {};
__export(bambina_db_exports, {
  createChecklistItem: () => createChecklistItem,
  createNote: () => createNote,
  createPayment: () => createPayment,
  createShoppingItem: () => createShoppingItem,
  deleteNote: () => deleteNote,
  getAllChecklistItems: () => getAllChecklistItems,
  getAllNotes: () => getAllNotes,
  getAllPayments: () => getAllPayments,
  getAllShoppingItems: () => getAllShoppingItems,
  snoozeChecklistItem: () => snoozeChecklistItem,
  toggleChecklistItem: () => toggleChecklistItem,
  togglePayment: () => togglePayment,
  toggleShoppingItem: () => toggleShoppingItem,
  updateChecklistNotes: () => updateChecklistNotes,
  updateNote: () => updateNote
});
import { eq as eq2 } from "drizzle-orm";
async function getAllChecklistItems() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bambinaChecklist).orderBy(bambinaChecklist.phase, bambinaChecklist.sortOrder);
}
async function toggleChecklistItem(id, completed) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bambinaChecklist).set({ completed: completed ? 1 : 0 }).where(eq2(bambinaChecklist.id, id));
}
async function updateChecklistNotes(id, notes) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bambinaChecklist).set({ notes }).where(eq2(bambinaChecklist.id, id));
}
async function snoozeChecklistItem(id, weeks) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bambinaChecklist).set({ snoozedWeeks: weeks }).where(eq2(bambinaChecklist.id, id));
}
async function createChecklistItem(item) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(bambinaChecklist).values(item);
}
async function getAllShoppingItems() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bambinaShopping).orderBy(bambinaShopping.category, bambinaShopping.sortOrder);
}
async function toggleShoppingItem(id, purchased) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bambinaShopping).set({ purchased: purchased ? 1 : 0 }).where(eq2(bambinaShopping.id, id));
}
async function createShoppingItem(item) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(bambinaShopping).values(item);
}
async function getAllNotes() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bambinaNotes).orderBy(bambinaNotes.category, bambinaNotes.createdAt);
}
async function createNote(note) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(bambinaNotes).values(note);
}
async function updateNote(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bambinaNotes).set(data).where(eq2(bambinaNotes.id, id));
}
async function deleteNote(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(bambinaNotes).where(eq2(bambinaNotes.id, id));
}
async function getAllPayments() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bambinaPayments).orderBy(bambinaPayments.sortOrder);
}
async function togglePayment(id, paid) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bambinaPayments).set({ paid: paid ? 1 : 0, paidDate: paid ? /* @__PURE__ */ new Date() : null }).where(eq2(bambinaPayments.id, id));
}
async function createPayment(payment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(bambinaPayments).values(payment);
}
var init_bambina_db = __esm({
  "server/bambina-db.ts"() {
    "use strict";
    init_schema();
    init_db();
  }
});

// server/email.ts
var email_exports = {};
__export(email_exports, {
  sendOrderConfirmation: () => sendOrderConfirmation,
  sendOrderStatusUpdate: () => sendOrderStatusUpdate,
  sendOwnerEnquiryNotification: () => sendOwnerEnquiryNotification,
  sendOwnerOrderNotification: () => sendOwnerOrderNotification
});
import nodemailer from "nodemailer";
async function sendOrderStatusUpdate(data) {
  const fromEmail = process.env.SMTP_USER || process.env.CONTACT_EMAIL || "benjaminthomasart@mail.com";
  const isShipped = data.newStatus === "shipped";
  const subject = isShipped ? `Your order ${data.orderRef} has been shipped` : `Your order ${data.orderRef} has been delivered`;
  const heading = isShipped ? "Your artwork is on its way" : "Your artwork has been delivered";
  const bodyText = isShipped ? `Great news! Your order <strong style="color:#003153;">${data.orderRef}</strong> for '${data.itemTitle}' has been shipped and is on its way to you.${data.trackingNumber ? ` Your tracking number is <strong>${data.trackingNumber}</strong>.` : ""}` : `Your order <strong style="color:#003153;">${data.orderRef}</strong> for '${data.itemTitle}' has been marked as delivered. We hope you love your new artwork!`;
  const plainBody = isShipped ? `Great news! Your order ${data.orderRef} for '${data.itemTitle}' has been shipped and is on its way to you.${data.trackingNumber ? ` Your tracking number is ${data.trackingNumber}.` : ""}` : `Your order ${data.orderRef} for '${data.itemTitle}' has been marked as delivered. We hope you love your new artwork!`;
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f3f0;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f3f0;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #e5e5e5;">
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #e5e5e5;">
              <h1 style="margin:0;font-size:24px;font-weight:normal;color:#003153;font-family:Georgia,'Times New Roman',serif;">Benjamin Thomas</h1>
              <p style="margin:4px 0 0;font-size:13px;color:#888;">Fine art &amp; more</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <div style="text-align:center;margin-bottom:24px;">
                <div style="display:inline-block;width:48px;height:48px;border-radius:50%;background-color:${isShipped ? "#f0e6ff" : "#e6f7e6"};line-height:48px;font-size:24px;">${isShipped ? "\u{1F4E6}" : "\u2705"}</div>
              </div>
              <h2 style="margin:0 0 12px;font-size:20px;font-weight:normal;color:#003153;text-align:center;">${heading}</h2>
              <p style="margin:0;font-size:14px;color:#666;line-height:1.6;text-align:center;">
                Dear ${data.buyerName},
              </p>
              <p style="margin:12px 0 0;font-size:14px;color:#666;line-height:1.6;text-align:center;">
                ${bodyText}
              </p>
            </td>
          </tr>
          ${!isShipped ? `
          <tr>
            <td style="padding:0 40px 32px;">
              <div style="padding:16px;background-color:#f0f7ff;border:1px solid #d0e3f0;border-radius:4px;text-align:center;">
                <p style="margin:0;font-size:13px;color:#003153;line-height:1.6;">
                  If you love your artwork, we'd really appreciate it if you shared a photo of it in your space. Tag us on Instagram!
                </p>
              </div>
            </td>
          </tr>` : ""}
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #e5e5e5;background-color:#fafaf8;">
              <p style="margin:0;font-size:12px;color:#888;line-height:1.6;">
                If you have any questions about your order, please reply to this email or get in touch via WhatsApp at +44 7597 765530.
              </p>
              <p style="margin:12px 0 0;font-size:12px;color:#aaa;">
                &copy; Benjamin Thomas Art
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  const textContent = `
${heading}

Dear ${data.buyerName},

${plainBody}

If you have any questions, reply to this email or contact via WhatsApp at +44 7597 765530.

Benjamin Thomas Art
`;
  try {
    await transporter.sendMail({
      from: `"Benjamin Thomas Art" <${fromEmail}>`,
      to: data.buyerEmail,
      subject,
      text: textContent.trim(),
      html: htmlContent
    });
    console.log(`[Email] Status update (${data.newStatus}) sent to ${data.buyerEmail} for ${data.orderRef}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send status update:", error);
    return false;
  }
}
async function sendOwnerEnquiryNotification(data) {
  const fromEmail = process.env.SMTP_USER || process.env.CONTACT_EMAIL || "benjaminthomasart@mail.com";
  const ownerEmail = process.env.CONTACT_EMAIL || "benjaminthomasart@mail.com";
  const typeLabel = data.type === "print" ? "Print enquiry" : data.type === "commission" ? "Commission enquiry" : "Contact enquiry";
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f3f0;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f3f0;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #e5e5e5;">
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #e5e5e5;">
              <h1 style="margin:0;font-size:24px;font-weight:normal;color:#003153;font-family:Georgia,'Times New Roman',serif;">Benjamin Thomas Art</h1>
              <p style="margin:4px 0 0;font-size:13px;color:#888;">Website notification</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <h2 style="margin:0 0 16px;font-size:20px;font-weight:normal;color:#003153;">New ${typeLabel}</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e5e5;">
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #e5e5e5;background-color:#fafaf8;">
                    <p style="margin:0 0 2px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">From</p>
                    <p style="margin:0;font-size:14px;color:#333;">${data.name} (${data.email})${data.phone ? ` \u2014 ${data.phone}` : ""}</p>
                  </td>
                </tr>
                ${data.artworkTitle ? `<tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #e5e5e5;">
                    <p style="margin:0 0 2px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Artwork</p>
                    <p style="margin:0;font-size:14px;color:#333;">'${data.artworkTitle}'</p>
                  </td>
                </tr>` : ""}
                <tr>
                  <td style="padding:12px 16px;">
                    <p style="margin:0 0 2px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Message</p>
                    <p style="margin:0;font-size:14px;color:#333;line-height:1.6;">${data.message.replace(/\n/g, "<br>")}</p>
                  </td>
                </tr>
              </table>
              <p style="margin:16px 0 0;font-size:13px;color:#666;">Reply directly to this email to respond to ${data.name}.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #e5e5e5;background-color:#fafaf8;">
              <p style="margin:0;font-size:12px;color:#aaa;">&copy; Benjamin Thomas Art \u2014 Website Notification</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  const textContent = `New ${typeLabel}

From: ${data.name} (${data.email})${data.phone ? ` \u2014 ${data.phone}` : ""}${data.artworkTitle ? `
Artwork: '${data.artworkTitle}'` : ""}

Message:
${data.message}

Reply to this email to respond to ${data.name}.`;
  try {
    await transporter.sendMail({
      from: `"Benjamin Thomas Art" <${fromEmail}>`,
      to: ownerEmail,
      replyTo: data.email,
      subject: `${typeLabel} from ${data.name}`,
      text: textContent,
      html: htmlContent
    });
    console.log(`[Email] Owner enquiry notification sent for ${typeLabel} from ${data.name}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send owner enquiry notification:", error);
    return false;
  }
}
async function sendOwnerOrderNotification(data) {
  const fromEmail = process.env.SMTP_USER || process.env.CONTACT_EMAIL || "benjaminthomasart@mail.com";
  const ownerEmail = process.env.CONTACT_EMAIL || "benjaminthomasart@mail.com";
  const shippingZoneLabel = data.shippingZone === "uk" ? "UK" : data.shippingZone === "europe" ? "Europe" : "Rest of World";
  const addressParts = [data.addressLine1, data.addressLine2, data.city, data.county, data.postcode, data.country].filter(Boolean);
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f3f0;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f3f0;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #e5e5e5;">
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #e5e5e5;">
              <h1 style="margin:0;font-size:24px;font-weight:normal;color:#003153;font-family:Georgia,'Times New Roman',serif;">Benjamin Thomas Art</h1>
              <p style="margin:4px 0 0;font-size:13px;color:#888;">Website notification</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <h2 style="margin:0 0 16px;font-size:20px;font-weight:normal;color:#003153;">\u{1F4B0} New Order \u2014 ${data.orderRef}</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e5e5;">
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #e5e5e5;background-color:#fafaf8;">
                    <p style="margin:0 0 2px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Item</p>
                    <p style="margin:0;font-size:15px;color:#333;">'${data.itemTitle}'</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#666;">${data.itemDetails}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #e5e5e5;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="font-size:13px;color:#666;">Item price</td><td align="right" style="font-size:13px;color:#333;">${data.itemPrice}</td></tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #e5e5e5;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="font-size:13px;color:#666;">Delivery (${shippingZoneLabel})</td><td align="right" style="font-size:13px;color:#333;">${data.shippingCost}</td></tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;background-color:#fafaf8;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="font-size:14px;font-weight:bold;color:#003153;">Total</td><td align="right" style="font-size:14px;font-weight:bold;color:#003153;">${data.totalPrice}</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
              <div style="margin-top:20px;">
                <p style="margin:0 0 4px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Buyer</p>
                <p style="margin:0;font-size:14px;color:#333;">${data.buyerName} (${data.buyerEmail})${data.buyerPhone ? ` \u2014 ${data.buyerPhone}` : ""}</p>
              </div>
              <div style="margin-top:16px;">
                <p style="margin:0 0 4px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Ship to</p>
                <p style="margin:0;font-size:14px;color:#333;line-height:1.6;">${addressParts.join("<br>")}</p>
              </div>
              <div style="margin-top:20px;padding:16px;background-color:#fff8e1;border:1px solid #ffe082;border-radius:4px;">
                <p style="margin:0;font-size:13px;color:#333;line-height:1.6;">Check your PayPal for the incoming payment. The buyer has been asked to include <strong>${data.orderRef}</strong> in the payment note.</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #e5e5e5;background-color:#fafaf8;">
              <p style="margin:0;font-size:12px;color:#aaa;">&copy; Benjamin Thomas Art \u2014 Website Notification</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  const textContent = `New Order \u2014 ${data.orderRef}

Item: '${data.itemTitle}'
Details: ${data.itemDetails}
Item price: ${data.itemPrice}
Delivery (${shippingZoneLabel}): ${data.shippingCost}
Total: ${data.totalPrice}

Buyer: ${data.buyerName} (${data.buyerEmail})${data.buyerPhone ? ` \u2014 ${data.buyerPhone}` : ""}

Ship to:
${addressParts.join("\n")}

Check your PayPal for the incoming payment.`;
  try {
    await transporter.sendMail({
      from: `"Benjamin Thomas Art" <${fromEmail}>`,
      to: ownerEmail,
      replyTo: data.buyerEmail,
      subject: `New order ${data.orderRef}: '${data.itemTitle}'`,
      text: textContent,
      html: htmlContent
    });
    console.log(`[Email] Owner order notification sent for ${data.orderRef}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send owner order notification:", error);
    return false;
  }
}
async function sendOrderConfirmation(data) {
  const fromEmail = process.env.SMTP_USER || process.env.CONTACT_EMAIL || "benjaminthomasart@mail.com";
  const shippingZoneLabel = data.shippingZone === "uk" ? "UK" : data.shippingZone === "europe" ? "Europe" : "Rest of World";
  const addressParts = [
    data.addressLine1,
    data.addressLine2,
    data.city,
    data.county,
    data.postcode,
    data.country
  ].filter(Boolean);
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f3f0;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f3f0;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #e5e5e5;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #e5e5e5;">
              <h1 style="margin:0;font-size:24px;font-weight:normal;color:#003153;font-family:Georgia,'Times New Roman',serif;">Benjamin Thomas</h1>
              <p style="margin:4px 0 0;font-size:13px;color:#888;">Fine art &amp; more</p>
            </td>
          </tr>
          
          <!-- Confirmation -->
          <tr>
            <td style="padding:32px 40px 16px;">
              <h2 style="margin:0 0 8px;font-size:20px;font-weight:normal;color:#003153;">Order confirmed</h2>
              <p style="margin:0;font-size:14px;color:#666;line-height:1.6;">
                Thank you for your order, ${data.buyerName}. Your order reference is <strong style="color:#003153;">${data.orderRef}</strong>.
              </p>
            </td>
          </tr>
          
          <!-- Order Details -->
          <tr>
            <td style="padding:16px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e5e5;">
                <tr>
                  <td style="padding:16px;border-bottom:1px solid #e5e5e5;background-color:#fafaf8;">
                    <p style="margin:0 0 4px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Item</p>
                    <p style="margin:0;font-size:15px;color:#333;">'${data.itemTitle}'</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#666;">${data.itemDetails}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #e5e5e5;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:13px;color:#666;">Item price</td>
                        <td align="right" style="font-size:13px;color:#333;">${data.itemPrice}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #e5e5e5;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:13px;color:#666;">Delivery (${shippingZoneLabel})</td>
                        <td align="right" style="font-size:13px;color:#333;">${data.shippingCost}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;background-color:#fafaf8;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:14px;font-weight:bold;color:#003153;">Total</td>
                        <td align="right" style="font-size:14px;font-weight:bold;color:#003153;">${data.totalPrice}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Shipping Address -->
          <tr>
            <td style="padding:16px 40px;">
              <p style="margin:0 0 8px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Shipping to</p>
              <p style="margin:0;font-size:14px;color:#333;line-height:1.6;">
                ${addressParts.join("<br>")}
              </p>
            </td>
          </tr>
          
          <!-- Payment Note -->
          <tr>
            <td style="padding:16px 40px 32px;">
              <div style="padding:16px;background-color:#f0f7ff;border:1px solid #d0e3f0;border-radius:4px;">
                <p style="margin:0;font-size:13px;color:#003153;line-height:1.6;">
                  Please include your order reference <strong>${data.orderRef}</strong> in the PayPal payment note so we can match your payment to this order. Once payment is confirmed, we'll begin preparing your artwork for dispatch.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #e5e5e5;background-color:#fafaf8;">
              <p style="margin:0;font-size:12px;color:#888;line-height:1.6;">
                If you have any questions about your order, please reply to this email or get in touch via WhatsApp at +44 7597 765530.
              </p>
              <p style="margin:12px 0 0;font-size:12px;color:#aaa;">
                &copy; Benjamin Thomas Art
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  const textContent = `
Order Confirmation \u2014 ${data.orderRef}

Thank you for your order, ${data.buyerName}.

Order Reference: ${data.orderRef}

Item: '${data.itemTitle}'
Details: ${data.itemDetails}
Item price: ${data.itemPrice}
Delivery (${shippingZoneLabel}): ${data.shippingCost}
Total: ${data.totalPrice}

Shipping to:
${addressParts.join("\n")}

Please include your order reference ${data.orderRef} in the PayPal payment note so we can match your payment to this order. Once payment is confirmed, we'll begin preparing your artwork for dispatch.

If you have any questions, reply to this email or contact via WhatsApp at +44 7597 765530.

Benjamin Thomas Art
`;
  try {
    await transporter.sendMail({
      from: `"Benjamin Thomas Art" <${fromEmail}>`,
      to: data.buyerEmail,
      subject: `Order confirmation \u2014 ${data.orderRef}`,
      text: textContent.trim(),
      html: htmlContent
    });
    console.log(`[Email] Order confirmation sent to ${data.buyerEmail} for ${data.orderRef}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send order confirmation:", error);
    return false;
  }
}
var transporter;
var init_email = __esm({
  "server/email.ts"() {
    "use strict";
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.mail.com",
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: true,
      auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || ""
      }
    });
  }
});

// server/api-entry.ts
import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/oauth.ts
init_db();

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
init_db();
init_env();
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app2) {
  app2.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/systemRouter.ts
init_notification();
import { z } from "zod";

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/bambina-router.ts
import { z as z2 } from "zod";
var bambinaRouter = router({
  // ============ CHECKLIST ============
  checklist: router({
    getAll: publicProcedure.query(async () => {
      const { getAllChecklistItems: getAllChecklistItems2 } = await Promise.resolve().then(() => (init_bambina_db(), bambina_db_exports));
      return getAllChecklistItems2();
    }),
    toggle: publicProcedure.input(z2.object({ id: z2.number(), completed: z2.boolean() })).mutation(async ({ input }) => {
      const { toggleChecklistItem: toggleChecklistItem2 } = await Promise.resolve().then(() => (init_bambina_db(), bambina_db_exports));
      await toggleChecklistItem2(input.id, input.completed);
      return { success: true };
    }),
    updateNotes: protectedProcedure.input(z2.object({ id: z2.number(), notes: z2.string() })).mutation(async ({ input }) => {
      const { updateChecklistNotes: updateChecklistNotes2 } = await Promise.resolve().then(() => (init_bambina_db(), bambina_db_exports));
      await updateChecklistNotes2(input.id, input.notes);
      return { success: true };
    }),
    snooze: protectedProcedure.input(z2.object({ id: z2.number(), weeks: z2.number() })).mutation(async ({ input }) => {
      const { snoozeChecklistItem: snoozeChecklistItem2 } = await Promise.resolve().then(() => (init_bambina_db(), bambina_db_exports));
      await snoozeChecklistItem2(input.id, input.weeks);
      return { success: true };
    }),
    create: protectedProcedure.input(z2.object({
      category: z2.string(),
      phase: z2.string(),
      title: z2.string(),
      description: z2.string().optional(),
      dueWeek: z2.number().optional(),
      sortOrder: z2.number().optional()
    })).mutation(async ({ input }) => {
      const { createChecklistItem: createChecklistItem2 } = await Promise.resolve().then(() => (init_bambina_db(), bambina_db_exports));
      await createChecklistItem2(input);
      return { success: true };
    })
  }),
  // ============ SHOPPING ============
  shopping: router({
    getAll: publicProcedure.query(async () => {
      const { getAllShoppingItems: getAllShoppingItems2 } = await Promise.resolve().then(() => (init_bambina_db(), bambina_db_exports));
      return getAllShoppingItems2();
    }),
    toggle: publicProcedure.input(z2.object({ id: z2.number(), purchased: z2.boolean() })).mutation(async ({ input }) => {
      const { toggleShoppingItem: toggleShoppingItem2 } = await Promise.resolve().then(() => (init_bambina_db(), bambina_db_exports));
      await toggleShoppingItem2(input.id, input.purchased);
      return { success: true };
    }),
    create: protectedProcedure.input(z2.object({
      category: z2.string(),
      title: z2.string(),
      notes: z2.string().optional(),
      sortOrder: z2.number().optional()
    })).mutation(async ({ input }) => {
      const { createShoppingItem: createShoppingItem2 } = await Promise.resolve().then(() => (init_bambina_db(), bambina_db_exports));
      await createShoppingItem2(input);
      return { success: true };
    })
  }),
  // ============ NOTES ============
  notes: router({
    getAll: publicProcedure.query(async () => {
      const { getAllNotes: getAllNotes2 } = await Promise.resolve().then(() => (init_bambina_db(), bambina_db_exports));
      return getAllNotes2();
    }),
    create: protectedProcedure.input(z2.object({
      category: z2.string(),
      title: z2.string().optional(),
      content: z2.string()
    })).mutation(async ({ input }) => {
      const { createNote: createNote2 } = await Promise.resolve().then(() => (init_bambina_db(), bambina_db_exports));
      await createNote2(input);
      return { success: true };
    }),
    update: protectedProcedure.input(z2.object({
      id: z2.number(),
      title: z2.string().optional(),
      content: z2.string().optional(),
      category: z2.string().optional()
    })).mutation(async ({ input }) => {
      const { updateNote: updateNote2 } = await Promise.resolve().then(() => (init_bambina_db(), bambina_db_exports));
      const { id, ...data } = input;
      await updateNote2(id, data);
      return { success: true };
    }),
    delete: protectedProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      const { deleteNote: deleteNote2 } = await Promise.resolve().then(() => (init_bambina_db(), bambina_db_exports));
      await deleteNote2(input.id);
      return { success: true };
    })
  }),
  // ============ PAYMENTS ============
  payments: router({
    getAll: publicProcedure.query(async () => {
      const { getAllPayments: getAllPayments2 } = await Promise.resolve().then(() => (init_bambina_db(), bambina_db_exports));
      return getAllPayments2();
    }),
    toggle: publicProcedure.input(z2.object({ id: z2.number(), paid: z2.boolean() })).mutation(async ({ input }) => {
      const { togglePayment: togglePayment2 } = await Promise.resolve().then(() => (init_bambina_db(), bambina_db_exports));
      await togglePayment2(input.id, input.paid);
      return { success: true };
    }),
    create: protectedProcedure.input(z2.object({
      category: z2.string(),
      description: z2.string(),
      amount: z2.string(),
      currency: z2.string(),
      amountNumeric: z2.number().optional(),
      dueMonth: z2.string().optional(),
      paid: z2.number().optional(),
      sortOrder: z2.number().optional()
    })).mutation(async ({ input }) => {
      const { createPayment: createPayment2 } = await Promise.resolve().then(() => (init_bambina_db(), bambina_db_exports));
      await createPayment2(input);
      return { success: true };
    })
  })
});

// server/routers.ts
import { z as z3 } from "zod";
var appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  bambina: bambinaRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  // Public artwork routes
  artworks: router({
    getAll: publicProcedure.query(async () => {
      const { getAllArtworks: getAllArtworks2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      return getAllArtworks2();
    }),
    getFeatured: publicProcedure.query(async () => {
      const { getFeaturedArtworks: getFeaturedArtworks2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      return getFeaturedArtworks2();
    }),
    getById: publicProcedure.input(z3.object({ id: z3.number() })).query(async ({ input }) => {
      const { getArtworkById: getArtworkById2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      return getArtworkById2(input.id);
    }),
    updateDisplayOrder: protectedProcedure.input(
      z3.object({
        artworkId: z3.number(),
        newDisplayOrder: z3.number()
      })
    ).mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }
      const { updateArtwork: updateArtwork2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      await updateArtwork2(input.artworkId, { displayOrder: input.newDisplayOrder });
      return { success: true };
    })
  }),
  // Shop routes
  shop: router({
    getArtworks: publicProcedure.query(async () => {
      const { getShopArtworks: getShopArtworks2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      return getShopArtworks2();
    })
  }),
  // Prints routes
  prints: router({
    getAll: publicProcedure.query(async () => {
      const { getAllPrints: getAllPrints2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      return getAllPrints2();
    }),
    getById: publicProcedure.input(z3.object({ id: z3.number() })).query(async ({ input }) => {
      const { getPrintById: getPrintById2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      return getPrintById2(input.id);
    })
  }),
  // Artist info routes
  artist: router({
    getInfo: publicProcedure.query(async () => {
      const { getArtistInfo: getArtistInfo2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      return getArtistInfo2();
    })
  }),
  // Order routes
  orders: router({
    create: publicProcedure.input(
      z3.object({
        // Buyer details
        buyerName: z3.string().min(1),
        buyerEmail: z3.string().email(),
        buyerPhone: z3.string().optional(),
        // Shipping address
        addressLine1: z3.string().min(1),
        addressLine2: z3.string().optional(),
        city: z3.string().min(1),
        county: z3.string().optional(),
        postcode: z3.string().min(1),
        country: z3.string().min(1),
        // Item details
        section: z3.enum(["prints", "upcycles"]),
        itemTitle: z3.string(),
        itemDetails: z3.string().optional(),
        price: z3.string(),
        shippingZone: z3.enum(["uk", "europe", "row"]),
        shippingCost: z3.string(),
        itemPrice: z3.string()
      })
    ).mutation(async ({ input }) => {
      const { createOrder: createOrder2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const { notifyOwner: notifyOwner2 } = await Promise.resolve().then(() => (init_notification(), notification_exports));
      const { sendOrderConfirmation: sendOrderConfirmation2, sendOwnerOrderNotification: sendOwnerOrderNotification2 } = await Promise.resolve().then(() => (init_email(), email_exports));
      const { orderRef } = await createOrder2({
        buyerName: input.buyerName,
        buyerEmail: input.buyerEmail,
        buyerPhone: input.buyerPhone || null,
        addressLine1: input.addressLine1,
        addressLine2: input.addressLine2 || null,
        city: input.city,
        county: input.county || null,
        postcode: input.postcode,
        country: input.country,
        section: input.section,
        itemTitle: input.itemTitle,
        itemDetails: input.itemDetails || null,
        price: input.price
      });
      const addressParts = [input.addressLine1, input.addressLine2, input.city, input.county, input.postcode, input.country].filter(Boolean);
      await notifyOwner2({
        title: `\u{1F4B0} New order ${orderRef}: '${input.itemTitle}'`,
        content: [
          `Order ref: ${orderRef}`,
          `Item: '${input.itemTitle}'`,
          `Details: ${input.itemDetails || "N/A"}`,
          `Item price: ${input.itemPrice}`,
          `Delivery (${input.shippingZone.toUpperCase()}): ${input.shippingCost}`,
          `Total: ${input.price}`,
          ``,
          `Buyer: ${input.buyerName}`,
          `Email: ${input.buyerEmail}`,
          input.buyerPhone ? `Phone: ${input.buyerPhone}` : null,
          ``,
          `Ship to:`,
          addressParts.join(", "),
          ``,
          `Check your PayPal for the incoming payment.`
        ].filter(Boolean).join("\n")
      });
      const orderEmailData = {
        orderRef,
        buyerName: input.buyerName,
        buyerEmail: input.buyerEmail,
        buyerPhone: input.buyerPhone,
        itemTitle: input.itemTitle,
        itemDetails: input.itemDetails || "",
        itemPrice: input.itemPrice,
        shippingZone: input.shippingZone,
        shippingCost: input.shippingCost,
        totalPrice: input.price,
        addressLine1: input.addressLine1,
        addressLine2: input.addressLine2,
        city: input.city,
        county: input.county,
        postcode: input.postcode,
        country: input.country
      };
      sendOrderConfirmation2(orderEmailData).catch((err) => console.error("[Orders] Failed to send confirmation email:", err));
      sendOwnerOrderNotification2(orderEmailData).catch((err) => console.error("[Orders] Failed to send owner order email:", err));
      return { success: true, orderRef };
    }),
    // Admin: get all orders
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      const { getAllOrders: getAllOrders2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      return getAllOrders2();
    }),
    // Admin: update order status
    updateStatus: protectedProcedure.input(z3.object({
      id: z3.number(),
      status: z3.enum(["pending", "paid", "shipped", "delivered", "cancelled"])
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      const { updateOrderStatus: updateOrderStatus2, getOrderById: getOrderById2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      await updateOrderStatus2(input.id, input.status);
      if (input.status === "shipped" || input.status === "delivered") {
        const order = await getOrderById2(input.id);
        if (order) {
          const { sendOrderStatusUpdate: sendOrderStatusUpdate2 } = await Promise.resolve().then(() => (init_email(), email_exports));
          sendOrderStatusUpdate2({
            orderRef: order.orderRef,
            buyerName: order.buyerName,
            buyerEmail: order.buyerEmail,
            itemTitle: order.itemTitle,
            newStatus: input.status
          }).catch((err) => console.error("[Orders] Failed to send status email:", err));
        }
      }
      return { success: true };
    }),
    // Keep legacy notification for backwards compatibility
    notifyPayPalClick: publicProcedure.input(
      z3.object({
        title: z3.string(),
        price: z3.string(),
        material: z3.string().optional(),
        size: z3.string().optional(),
        section: z3.enum(["prints", "upcycles"])
      })
    ).mutation(async ({ input }) => {
      const { notifyOwner: notifyOwner2 } = await Promise.resolve().then(() => (init_notification(), notification_exports));
      const details = input.section === "prints" ? `${input.material} \xB7 ${input.size}` : "Upcycled vinyl";
      await notifyOwner2({
        title: `\u{1F4B0} PayPal order: '${input.title}'`,
        content: `Someone clicked Pay with PayPal for '${input.title}'.
Details: ${details}
Price: ${input.price}

Check your PayPal for the incoming payment.`
      });
      return { success: true };
    })
  }),
  // Inquiry routes
  inquiries: router({
    submit: publicProcedure.input(
      z3.object({
        type: z3.enum(["contact", "print", "commission"]),
        name: z3.string().min(1),
        email: z3.string().email(),
        phone: z3.string().optional(),
        message: z3.string().min(1),
        artworkId: z3.number().optional()
      })
    ).mutation(async ({ input }) => {
      const { createInquiry: createInquiry2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const { notifyOwner: notifyOwner2 } = await Promise.resolve().then(() => (init_notification(), notification_exports));
      const { sendOwnerEnquiryNotification: sendOwnerEnquiryNotification2 } = await Promise.resolve().then(() => (init_email(), email_exports));
      let artworkTitle = null;
      if (input.artworkId) {
        const { getArtworkById: getArtworkById2 } = await Promise.resolve().then(() => (init_db(), db_exports));
        const artwork = await getArtworkById2(input.artworkId);
        artworkTitle = artwork?.title || null;
      }
      await createInquiry2({
        type: input.type,
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        message: input.message,
        artworkId: input.artworkId || null
      });
      await notifyOwner2({
        title: `New ${input.type} inquiry`,
        content: `From: ${input.name} (${input.email})
Message: ${input.message}`
      });
      sendOwnerEnquiryNotification2({
        type: input.type,
        name: input.name,
        email: input.email,
        phone: input.phone,
        message: input.message,
        artworkTitle
      }).catch((err) => console.error("[Inquiries] Failed to send owner enquiry email:", err));
      return { success: true };
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/api-entry.ts
var app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
registerOAuthRoutes(app);
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext
  })
);
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});
var api_entry_default = app;
export {
  api_entry_default as default
};
