import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Public artwork routes
  artworks: router({
    getAll: publicProcedure.query(async () => {
      const { getAllArtworks } = await import("./db");
      return getAllArtworks();
    }),
    getFeatured: publicProcedure.query(async () => {
      const { getFeaturedArtworks } = await import("./db");
      return getFeaturedArtworks();
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const { getArtworkById } = await import("./db");
      return getArtworkById(input.id);
    }),
  }),

  // Shop routes
  shop: router({
    getArtworks: publicProcedure.query(async () => {
      const { getShopArtworks } = await import("./db");
      return getShopArtworks();
    }),
  }),

  // Artist info routes
  artist: router({
    getInfo: publicProcedure.query(async () => {
      const { getArtistInfo } = await import("./db");
      return getArtistInfo();
    }),
  }),

  // Inquiry routes
  inquiries: router({
    submit: publicProcedure
      .input(
        z.object({
          type: z.enum(["contact", "print", "commission"]),
          name: z.string().min(1),
          email: z.string().email(),
          phone: z.string().optional(),
          message: z.string().min(1),
          artworkId: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { createInquiry } = await import("./db");
        const { notifyOwner } = await import("./_core/notification");
        
        await createInquiry({
          type: input.type,
          name: input.name,
          email: input.email,
          phone: input.phone || null,
          message: input.message,
          artworkId: input.artworkId || null,
        });

        // Notify owner of new inquiry
        await notifyOwner({
          title: `New ${input.type} inquiry`,
          content: `From: ${input.name} (${input.email})\nMessage: ${input.message}`,
        });

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
