var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

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
var TITLE_MAX_LENGTH, CONTENT_MAX_LENGTH, trimValue, isNonEmptyString, buildEndpointUrl, validatePayload;
var init_notification = __esm({
  "server/_core/notification.ts"() {
    "use strict";
    init_env();
    TITLE_MAX_LENGTH = 1200;
    CONTENT_MAX_LENGTH = 2e4;
    trimValue = (value) => value.trim();
    isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
    buildEndpointUrl = (baseUrl) => {
      const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
      return new URL(
        "webdevtoken.v1.WebDevService/SendNotification",
        normalizedBase
      ).toString();
    };
    validatePayload = (input) => {
      if (!isNonEmptyString(input.title)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Notification title is required."
        });
      }
      if (!isNonEmptyString(input.content)) {
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

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
var users, artworks, inquiries, artistInfo, prints;
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
      displayOrder: int("display_order").default(0).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
    });
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  createArtwork: () => createArtwork,
  createInquiry: () => createInquiry,
  createPrint: () => createPrint,
  deleteArtwork: () => deleteArtwork,
  getAllArtworks: () => getAllArtworks,
  getAllInquiries: () => getAllInquiries,
  getAllPrints: () => getAllPrints,
  getArtistInfo: () => getArtistInfo,
  getArtworkById: () => getArtworkById,
  getDb: () => getDb,
  getFeaturedArtworks: () => getFeaturedArtworks,
  getPrintById: () => getPrintById,
  getShopArtworks: () => getShopArtworks,
  getUserByOpenId: () => getUserByOpenId,
  updateArtwork: () => updateArtwork,
  updateInquiryStatus: () => updateInquiryStatus,
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
var _db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_env();
    _db = null;
  }
});

// api/index.ts
import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

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

// server/routers.ts
import { z as z2 } from "zod";
var appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
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
    getById: publicProcedure.input(z2.object({ id: z2.number() })).query(async ({ input }) => {
      const { getArtworkById: getArtworkById2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      return getArtworkById2(input.id);
    }),
    updateDisplayOrder: protectedProcedure.input(
      z2.object({
        artworkId: z2.number(),
        newDisplayOrder: z2.number()
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
    getById: publicProcedure.input(z2.object({ id: z2.number() })).query(async ({ input }) => {
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
  // Inquiry routes
  inquiries: router({
    submit: publicProcedure.input(
      z2.object({
        type: z2.enum(["contact", "print", "commission"]),
        name: z2.string().min(1),
        email: z2.string().email(),
        phone: z2.string().optional(),
        message: z2.string().min(1),
        artworkId: z2.number().optional()
      })
    ).mutation(async ({ input }) => {
      const { createInquiry: createInquiry2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const { notifyOwner: notifyOwner2 } = await Promise.resolve().then(() => (init_notification(), notification_exports));
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
      return { success: true };
    })
  })
});

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
var isNonEmptyString2 = (value) => typeof value === "string" && value.length > 0;
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
      if (!isNonEmptyString2(openId) || !isNonEmptyString2(appId) || !isNonEmptyString2(name)) {
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

// server/_core/oauth.ts
init_db();
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

// api/index.ts
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
var index_default = app;
export {
  index_default as default
};
