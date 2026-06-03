import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock bambina-db module
vi.mock("./bambina-db", () => ({
  getAllChecklistItems: vi.fn().mockResolvedValue([
    { id: 1, category: "medical", phase: "first_trimester", title: "Early Scan", description: null, completed: 0, notes: null, snoozedWeeks: 0, dueWeek: 6, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, category: "legal", phase: "pre_pregnancy", title: "Sign contract", description: null, completed: 1, notes: "Done!", snoozedWeeks: 0, dueWeek: null, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
  ]),
  toggleChecklistItem: vi.fn().mockResolvedValue(undefined),
  updateChecklistNotes: vi.fn().mockResolvedValue(undefined),
  snoozeChecklistItem: vi.fn().mockResolvedValue(undefined),
  createChecklistItem: vi.fn().mockResolvedValue(undefined),
  getAllShoppingItems: vi.fn().mockResolvedValue([
    { id: 1, category: "feeding", title: "Baby bottles", notes: "MAM self-sterilising", purchased: 0, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, category: "sleeping", title: "Cot", notes: "Provided by MSJ", purchased: 1, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
  ]),
  toggleShoppingItem: vi.fn().mockResolvedValue(undefined),
  createShoppingItem: vi.fn().mockResolvedValue(undefined),
  getAllNotes: vi.fn().mockResolvedValue([
    { id: 1, category: "general", title: "Test note", content: "Hello world", createdAt: new Date(), updatedAt: new Date() },
  ]),
  createNote: vi.fn().mockResolvedValue(undefined),
  updateNote: vi.fn().mockResolvedValue(undefined),
  deleteNote: vi.fn().mockResolvedValue(undefined),
  getAllPayments: vi.fn().mockResolvedValue([
    { id: 1, category: "agency", description: "IP membership", amount: "$15,500", currency: "USD", amountNumeric: 1550000, dueMonth: "Month 1", paid: 1, paidDate: new Date(), sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, category: "medical", description: "Obstetrics Package", amount: "$60,000", currency: "MXN", amountNumeric: 6000000, dueMonth: "Month 9", paid: 0, paidDate: null, sortOrder: 14, createdAt: new Date(), updatedAt: new Date() },
  ]),
  togglePayment: vi.fn().mockResolvedValue(undefined),
  createPayment: vi.fn().mockResolvedValue(undefined),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    res: { clearCookie: vi.fn() } as any,
  };
}

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-open-id",
      name: "Ben",
      email: "ben@test.com",
      loginMethod: "oauth",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    res: { clearCookie: vi.fn() } as any,
  };
}

describe("Bambina Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("checklist", () => {
    it("getAll returns checklist items (public)", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const items = await caller.bambina.checklist.getAll();
      expect(items).toHaveLength(2);
      expect(items[0].title).toBe("Early Scan");
      expect(items[1].completed).toBe(1);
    });

    it("toggle requires authentication", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      await expect(
        caller.bambina.checklist.toggle({ id: 1, completed: true })
      ).rejects.toThrow();
    });

    it("toggle works when authenticated", async () => {
      const caller = appRouter.createCaller(createAuthContext());
      const result = await caller.bambina.checklist.toggle({ id: 1, completed: true });
      expect(result).toEqual({ success: true });
    });

    it("updateNotes works when authenticated", async () => {
      const caller = appRouter.createCaller(createAuthContext());
      const result = await caller.bambina.checklist.updateNotes({ id: 1, notes: "Updated note" });
      expect(result).toEqual({ success: true });
    });

    it("snooze works when authenticated", async () => {
      const caller = appRouter.createCaller(createAuthContext());
      const result = await caller.bambina.checklist.snooze({ id: 1, weeks: 2 });
      expect(result).toEqual({ success: true });
    });
  });

  describe("shopping", () => {
    it("getAll returns shopping items (public)", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const items = await caller.bambina.shopping.getAll();
      expect(items).toHaveLength(2);
      expect(items[0].title).toBe("Baby bottles");
    });

    it("toggle requires authentication", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      await expect(
        caller.bambina.shopping.toggle({ id: 1, purchased: true })
      ).rejects.toThrow();
    });

    it("toggle works when authenticated", async () => {
      const caller = appRouter.createCaller(createAuthContext());
      const result = await caller.bambina.shopping.toggle({ id: 1, purchased: true });
      expect(result).toEqual({ success: true });
    });
  });

  describe("notes", () => {
    it("getAll returns notes (public)", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const notes = await caller.bambina.notes.getAll();
      expect(notes).toHaveLength(1);
      expect(notes[0].content).toBe("Hello world");
    });

    it("create requires authentication", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      await expect(
        caller.bambina.notes.create({ category: "general", content: "test" })
      ).rejects.toThrow();
    });

    it("create works when authenticated", async () => {
      const caller = appRouter.createCaller(createAuthContext());
      const result = await caller.bambina.notes.create({ category: "general", content: "New note" });
      expect(result).toEqual({ success: true });
    });

    it("delete works when authenticated", async () => {
      const caller = appRouter.createCaller(createAuthContext());
      const result = await caller.bambina.notes.delete({ id: 1 });
      expect(result).toEqual({ success: true });
    });
  });

  describe("payments", () => {
    it("getAll returns payments (public)", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const payments = await caller.bambina.payments.getAll();
      expect(payments).toHaveLength(2);
      expect(payments[0].description).toBe("IP membership");
      expect(payments[0].paid).toBe(1);
      expect(payments[1].paid).toBe(0);
    });

    it("toggle requires authentication", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      await expect(
        caller.bambina.payments.toggle({ id: 1, paid: true })
      ).rejects.toThrow();
    });

    it("toggle works when authenticated", async () => {
      const caller = appRouter.createCaller(createAuthContext());
      const result = await caller.bambina.payments.toggle({ id: 2, paid: true });
      expect(result).toEqual({ success: true });
    });
  });
});
