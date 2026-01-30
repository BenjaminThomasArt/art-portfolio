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

describe("shop router", () => {
  it("should return shop artworks", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const artworks = await caller.shop.getArtworks();

    expect(Array.isArray(artworks)).toBe(true);
    // All returned artworks should have forSale = 1
    artworks.forEach((artwork) => {
      expect(artwork.forSale).toBe(1);
    });
  });

  it("should only return artworks marked for sale", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const shopArtworks = await caller.shop.getArtworks();
    const allArtworks = await caller.artworks.getAll();

    // Shop artworks should be a subset of all artworks
    expect(shopArtworks.length).toBeLessThanOrEqual(allArtworks.length);
    
    // Every shop artwork should be in the all artworks list
    shopArtworks.forEach((shopArtwork) => {
      const found = allArtworks.find((a) => a.id === shopArtwork.id);
      expect(found).toBeDefined();
      expect(found?.forSale).toBe(1);
    });
  });
});
