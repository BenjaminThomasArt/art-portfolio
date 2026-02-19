/**
 * Meta Pixel helper — thin wrapper around fbq() for type-safe event tracking.
 * The base pixel is loaded via index.html; this module fires custom events.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function track(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, params);
  }
}

/** Fires when a user views an artwork or print detail */
export function trackViewContent(data: {
  contentName: string;
  contentCategory: string;
  value?: number;
  currency?: string;
}) {
  track("ViewContent", {
    content_name: data.contentName,
    content_category: data.contentCategory,
    ...(data.value != null && { value: data.value, currency: data.currency ?? "GBP" }),
  });
}

/** Fires when a user clicks Order / initiates checkout */
export function trackInitiateCheckout(data: {
  contentName: string;
  value: number;
  currency?: string;
}) {
  track("InitiateCheckout", {
    content_name: data.contentName,
    value: data.value,
    currency: data.currency ?? "GBP",
  });
}

/** Fires when a user submits a contact / inquiry form */
export function trackContact() {
  track("Contact");
}

/** Fires when a user completes a purchase (lands on thank-you page) */
export function trackPurchase(data: {
  value: number;
  currency?: string;
  contentName?: string;
}) {
  track("Purchase", {
    value: data.value,
    currency: data.currency ?? "GBP",
    ...(data.contentName && { content_name: data.contentName }),
  });
}
