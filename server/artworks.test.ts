import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createTestContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("artworks router", () => {
  it("should return all artworks", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const artworks = await caller.artworks.getAll();

    expect(Array.isArray(artworks)).toBe(true);
  });

  it("should return featured artworks", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const artworks = await caller.artworks.getFeatured();

    expect(Array.isArray(artworks)).toBe(true);
    // All returned artworks should have featured = 1
    artworks.forEach((artwork) => {
      expect(artwork.featured).toBe(1);
    });
  });
});

describe("artist router", () => {
  it("should return artist info", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const artistInfo = await caller.artist.getInfo();

    if (artistInfo) {
      expect(artistInfo).toHaveProperty("name");
      expect(artistInfo).toHaveProperty("bio");
      expect(artistInfo.name).toBe("Benjamin Thomas");
      expect(artistInfo.instagramHandle).toBe("__benjaminthomas");
    }
  });
});

describe("inquiries router", () => {
  it("should submit a contact inquiry", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.inquiries.submit({
      type: "contact",
      name: "Test User",
      email: "test@example.com",
      phone: "123-456-7890",
      message: "This is a test inquiry",
    });

    expect(result).toEqual({ success: true });
  });

  it("should submit a print inquiry with artwork ID", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.inquiries.submit({
      type: "print",
      name: "Art Collector",
      email: "collector@example.com",
      message: "I'd like to inquire about a print",
      artworkId: 1,
    });

    expect(result).toEqual({ success: true });
  });

  it("should require name, email, and message", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.inquiries.submit({
        type: "contact",
        name: "",
        email: "test@example.com",
        message: "Test",
      })
    ).rejects.toThrow();

    await expect(
      caller.inquiries.submit({
        type: "contact",
        name: "Test",
        email: "",
        message: "Test",
      })
    ).rejects.toThrow();

    await expect(
      caller.inquiries.submit({
        type: "contact",
        name: "Test",
        email: "test@example.com",
        message: "",
      })
    ).rejects.toThrow();
  });
});
