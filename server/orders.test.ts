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

// Mock the email module
vi.mock("./email", () => ({
  sendOrderConfirmation: vi.fn().mockResolvedValue(true),
}));

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-open-id",
      name: "Admin",
      email: "admin@example.com",
      loginMethod: "email",
      role: "admin" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

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
      price: "£137",
      shippingZone: "uk",
      shippingCost: "£12",
      itemPrice: "£125",
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
        price: "£137",
        shippingZone: "uk",
        shippingCost: "£12",
        itemPrice: "£125",
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
        price: "£137",
        shippingZone: "uk",
        shippingCost: "£12",
        itemPrice: "£125",
      })
    ).rejects.toThrow();
  });

  it("accepts upcycles section with europe shipping", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.orders.create({
      buyerName: "John Doe",
      buyerEmail: "john@example.com",
      addressLine1: "456 Vinyl Lane",
      city: "Berlin",
      postcode: "10115",
      country: "Germany",
      section: "upcycles",
      itemTitle: "Pre & Post",
      itemDetails: 'Upcycled vintage vinyl artwork diptych; 2 x 12"x12"',
      price: "£95",
      shippingZone: "europe",
      shippingCost: "£20",
      itemPrice: "£75",
    });

    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("orderRef");
  });

  it("sends confirmation email after order creation", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const { sendOrderConfirmation } = await import("./email");

    await caller.orders.create({
      buyerName: "Email Test",
      buyerEmail: "test@example.com",
      addressLine1: "1 Test Lane",
      city: "London",
      postcode: "E1 1AA",
      country: "United Kingdom",
      section: "prints",
      itemTitle: "Portmanteau",
      itemDetails: "Canvas Inkjet · 60×80cm",
      price: "£137",
      shippingZone: "uk",
      shippingCost: "£12",
      itemPrice: "£125",
    });

    // Allow async email call to resolve
    await new Promise(r => setTimeout(r, 50));
    expect(sendOrderConfirmation).toHaveBeenCalledWith(
      expect.objectContaining({
        buyerEmail: "test@example.com",
        orderRef: "BT-TEST01",
        itemTitle: "Portmanteau",
      })
    );
  });

  it("accepts rest of world shipping zone", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.orders.create({
      buyerName: "Alice Wong",
      buyerEmail: "alice@example.com",
      addressLine1: "789 Gallery Road",
      city: "Sydney",
      postcode: "2000",
      country: "Australia",
      section: "prints",
      itemTitle: "I Saw the Whole Thing",
      itemDetails: "Canvas Inkjet · 100×120cm",
      price: "£265",
      shippingZone: "row",
      shippingCost: "£65",
      itemPrice: "£200",
    });

    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("orderRef");
  });
});

describe("orders.getAll (admin)", () => {
  it("requires admin role", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.orders.getAll()).rejects.toThrow();
  });
});

describe("orders.updateStatus (admin)", () => {
  it("requires admin role", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.orders.updateStatus({ id: 1, status: "paid" })
    ).rejects.toThrow();
  });
});
