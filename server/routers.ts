import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
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
    updateDisplayOrder: protectedProcedure
      .input(
        z.object({
          artworkId: z.number(),
          newDisplayOrder: z.number(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Only allow admin users to reorder
        if (ctx.user?.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        const { updateArtwork } = await import("./db");
        await updateArtwork(input.artworkId, { displayOrder: input.newDisplayOrder });
        return { success: true };
      }),
  }),

  // Shop routes
  shop: router({
    getArtworks: publicProcedure.query(async () => {
      const { getShopArtworks } = await import("./db");
      return getShopArtworks();
    }),
  }),

  // Prints routes
  prints: router({
    getAll: publicProcedure.query(async () => {
      const { getAllPrints } = await import("./db");
      return getAllPrints();
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const { getPrintById } = await import("./db");
      return getPrintById(input.id);
    }),
  }),

  // Artist info routes
  artist: router({
    getInfo: publicProcedure.query(async () => {
      const { getArtistInfo } = await import("./db");
      return getArtistInfo();
    }),
  }),

  // Order routes
  orders: router({
    create: publicProcedure
      .input(
        z.object({
          // Buyer details
          buyerName: z.string().min(1),
          buyerEmail: z.string().email(),
          buyerPhone: z.string().optional(),
          // Shipping address
          addressLine1: z.string().min(1),
          addressLine2: z.string().optional(),
          city: z.string().min(1),
          county: z.string().optional(),
          postcode: z.string().min(1),
          country: z.string().min(1),
          // Item details
          section: z.enum(["prints", "upcycles"]),
          itemTitle: z.string(),
          itemDetails: z.string().optional(),
          price: z.string(),
          shippingZone: z.enum(["uk", "europe", "row"]),
          shippingCost: z.string(),
          itemPrice: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const { createOrder } = await import("./db");
        const { notifyOwner } = await import("./_core/notification");
        const { sendOrderConfirmation } = await import("./email");

        const { orderRef } = await createOrder({
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
          price: input.price,
        });

        const addressParts = [input.addressLine1, input.addressLine2, input.city, input.county, input.postcode, input.country].filter(Boolean);
        await notifyOwner({
          title: `\ud83d\udcb0 New order ${orderRef}: '${input.itemTitle}'`,
          content: [
            `Order ref: ${orderRef}`,
            `Item: '${input.itemTitle}'`,
            `Details: ${input.itemDetails || 'N/A'}`,
            `Item price: ${input.itemPrice}`,
            `Delivery (${input.shippingZone.toUpperCase()}): ${input.shippingCost}`,
            `Total: ${input.price}`,
            ``,
            `Buyer: ${input.buyerName}`,
            `Email: ${input.buyerEmail}`,
            input.buyerPhone ? `Phone: ${input.buyerPhone}` : null,
            ``,
            `Ship to:`,
            addressParts.join(', '),
            ``,
            `Check your PayPal for the incoming payment.`,
          ].filter(Boolean).join('\n'),
        });

        // Send buyer confirmation email (non-blocking)
        sendOrderConfirmation({
          orderRef,
          buyerName: input.buyerName,
          buyerEmail: input.buyerEmail,
          itemTitle: input.itemTitle,
          itemDetails: input.itemDetails || '',
          itemPrice: input.itemPrice,
          shippingZone: input.shippingZone,
          shippingCost: input.shippingCost,
          totalPrice: input.price,
          addressLine1: input.addressLine1,
          addressLine2: input.addressLine2,
          city: input.city,
          county: input.county,
          postcode: input.postcode,
          country: input.country,
        }).catch(err => console.error('[Orders] Failed to send confirmation email:', err));

        return { success: true, orderRef };
      }),

    // Admin: get all orders
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
      const { getAllOrders } = await import("./db");
      return getAllOrders();
    }),

    // Admin: update order status
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "paid", "shipped", "delivered", "cancelled"]),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        const { updateOrderStatus } = await import("./db");
        await updateOrderStatus(input.id, input.status);
        return { success: true };
      }),

    // Keep legacy notification for backwards compatibility
    notifyPayPalClick: publicProcedure
      .input(
        z.object({
          title: z.string(),
          price: z.string(),
          material: z.string().optional(),
          size: z.string().optional(),
          section: z.enum(["prints", "upcycles"]),
        })
      )
      .mutation(async ({ input }) => {
        const { notifyOwner } = await import("./_core/notification");
        const details = input.section === "prints"
          ? `${input.material} \u00b7 ${input.size}`
          : "Upcycled vinyl";
        await notifyOwner({
          title: `\ud83d\udcb0 PayPal order: '${input.title}'`,
          content: `Someone clicked Pay with PayPal for '${input.title}'.\nDetails: ${details}\nPrice: ${input.price}\n\nCheck your PayPal for the incoming payment.`,
        });
        return { success: true };
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

        // Notify owner via Manus notification system
        await notifyOwner({
          title: `New ${input.type} inquiry`,
          content: `From: ${input.name} (${input.email})\nMessage: ${input.message}`,
        });

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
