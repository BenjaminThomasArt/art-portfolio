import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the notification module
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("orders.notifyPayPalClick", () => {
  it("sends notification for a prints order", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.orders.notifyPayPalClick({
      title: "The Subject of Paint",
      price: "£150",
      material: "Giclée",
      size: "80×60cm",
      section: "prints",
    });

    expect(result).toEqual({ success: true });

    const { notifyOwner } = await import("./_core/notification");
    expect(notifyOwner).toHaveBeenCalledWith({
      title: expect.stringContaining("The Subject of Paint"),
      content: expect.stringContaining("Giclée"),
    });
  });

  it("sends notification for an upcycles order", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.orders.notifyPayPalClick({
      title: "Pre & Post",
      price: "£75",
      section: "upcycles",
    });

    expect(result).toEqual({ success: true });

    const { notifyOwner } = await import("./_core/notification");
    expect(notifyOwner).toHaveBeenCalledWith({
      title: expect.stringContaining("Pre & Post"),
      content: expect.stringContaining("Upcycled vinyl"),
    });
  });

  it("rejects invalid section value", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.orders.notifyPayPalClick({
        title: "Test",
        price: "£50",
        section: "invalid" as any,
      })
    ).rejects.toThrow();
  });
});
