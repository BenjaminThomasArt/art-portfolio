import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const bambinaRouter = router({
  // ============ CHECKLIST ============
  checklist: router({
    getAll: publicProcedure.query(async () => {
      const { getAllChecklistItems } = await import("./bambina-db");
      return getAllChecklistItems();
    }),
    toggle: protectedProcedure
      .input(z.object({ id: z.number(), completed: z.boolean() }))
      .mutation(async ({ input }) => {
        const { toggleChecklistItem } = await import("./bambina-db");
        await toggleChecklistItem(input.id, input.completed);
        return { success: true };
      }),
    updateNotes: protectedProcedure
      .input(z.object({ id: z.number(), notes: z.string() }))
      .mutation(async ({ input }) => {
        const { updateChecklistNotes } = await import("./bambina-db");
        await updateChecklistNotes(input.id, input.notes);
        return { success: true };
      }),
    snooze: protectedProcedure
      .input(z.object({ id: z.number(), weeks: z.number() }))
      .mutation(async ({ input }) => {
        const { snoozeChecklistItem } = await import("./bambina-db");
        await snoozeChecklistItem(input.id, input.weeks);
        return { success: true };
      }),
    create: protectedProcedure
      .input(z.object({
        category: z.string(),
        phase: z.string(),
        title: z.string(),
        description: z.string().optional(),
        dueWeek: z.number().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { createChecklistItem } = await import("./bambina-db");
        await createChecklistItem(input);
        return { success: true };
      }),
  }),

  // ============ SHOPPING ============
  shopping: router({
    getAll: publicProcedure.query(async () => {
      const { getAllShoppingItems } = await import("./bambina-db");
      return getAllShoppingItems();
    }),
    toggle: protectedProcedure
      .input(z.object({ id: z.number(), purchased: z.boolean() }))
      .mutation(async ({ input }) => {
        const { toggleShoppingItem } = await import("./bambina-db");
        await toggleShoppingItem(input.id, input.purchased);
        return { success: true };
      }),
    create: protectedProcedure
      .input(z.object({
        category: z.string(),
        title: z.string(),
        notes: z.string().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { createShoppingItem } = await import("./bambina-db");
        await createShoppingItem(input);
        return { success: true };
      }),
  }),

  // ============ NOTES ============
  notes: router({
    getAll: publicProcedure.query(async () => {
      const { getAllNotes } = await import("./bambina-db");
      return getAllNotes();
    }),
    create: protectedProcedure
      .input(z.object({
        category: z.string(),
        title: z.string().optional(),
        content: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { createNote } = await import("./bambina-db");
        await createNote(input);
        return { success: true };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        category: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { updateNote } = await import("./bambina-db");
        const { id, ...data } = input;
        await updateNote(id, data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const { deleteNote } = await import("./bambina-db");
        await deleteNote(input.id);
        return { success: true };
      }),
  }),

  // ============ PAYMENTS ============
  payments: router({
    getAll: publicProcedure.query(async () => {
      const { getAllPayments } = await import("./bambina-db");
      return getAllPayments();
    }),
    toggle: protectedProcedure
      .input(z.object({ id: z.number(), paid: z.boolean() }))
      .mutation(async ({ input }) => {
        const { togglePayment } = await import("./bambina-db");
        await togglePayment(input.id, input.paid);
        return { success: true };
      }),
    create: protectedProcedure
      .input(z.object({
        category: z.string(),
        description: z.string(),
        amount: z.string(),
        currency: z.string(),
        amountNumeric: z.number().optional(),
        dueMonth: z.string().optional(),
        paid: z.number().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { createPayment } = await import("./bambina-db");
        await createPayment(input);
        return { success: true };
      }),
  }),
});
