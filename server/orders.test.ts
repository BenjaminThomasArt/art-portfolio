import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

// Mock the db module
vi.mock("./db", () => ({
  createOrder: vi.fn().mockResolvedValue({ orderRef: "BT-TEST01" }),
}));

// Mock the notification module
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

describe("orders.create", () => {
  it("creates an order and returns an order reference", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.orders.create({
      buyerName: "Jane Smith",
      buyerEmail: "jane@example.com",
      buyerPhone: "+44 7700 900000",
      addressLine1: "123 Art Street",
      addressLine2: "Flat 4",
      city: "London",
      county: "Greater London",
      postcode: "SW1A 1AA",
      country: "United Kingdom",
      section: "prints",
      itemTitle: "Portmanteau",
      itemDetails: "Canvas Inkjet · 60×80cm",
      price: "£125",
    });

    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("orderRef", "BT-TEST01");
  });

  it("validates required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Missing required buyerName
    await expect(
      caller.orders.create({
        buyerName: "",
        buyerEmail: "jane@example.com",
        addressLine1: "123 Art Street",
        city: "London",
        postcode: "SW1A 1AA",
        country: "United Kingdom",
        section: "prints",
        itemTitle: "Portmanteau",
        price: "£125",
      })
    ).rejects.toThrow();
  });

  it("validates email format", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.orders.create({
        buyerName: "Jane Smith",
        buyerEmail: "not-an-email",
        addressLine1: "123 Art Street",
        city: "London",
        postcode: "SW1A 1AA",
        country: "United Kingdom",
        section: "prints",
        itemTitle: "Portmanteau",
        price: "£125",
      })
    ).rejects.toThrow();
  });

  it("accepts upcycles section", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.orders.create({
      buyerName: "John Doe",
      buyerEmail: "john@example.com",
      addressLine1: "456 Vinyl Lane",
      city: "Manchester",
      postcode: "M1 1AA",
      country: "United Kingdom",
      section: "upcycles",
      itemTitle: "Pre & Post",
      itemDetails: 'Upcycled vintage vinyl artwork diptych; 2 x 12"x12"',
      price: "£75",
    });

    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("orderRef");
  });
});
