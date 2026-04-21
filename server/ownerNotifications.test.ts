import { describe, expect, it, vi, beforeEach } from "vitest";

// Use vi.hoisted so the mock fn is available when vi.mock runs (hoisted above imports)
const mockSendMail = vi.hoisted(() => vi.fn().mockResolvedValue({ messageId: "test-id" }));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: mockSendMail,
    })),
  },
}));

// Set env vars before importing the module
process.env.SMTP_USER = "test@mail.com";
process.env.SMTP_PASS = "testpass";
process.env.CONTACT_EMAIL = "owner@example.com";

import {
  sendOwnerEnquiryNotification,
  sendOwnerOrderNotification,
} from "./email";

describe("owner email notifications", () => {
  beforeEach(() => {
    mockSendMail.mockClear();
    mockSendMail.mockResolvedValue({ messageId: "test-id" });
  });

  describe("sendOwnerEnquiryNotification", () => {
    it("should send a contact enquiry email to the owner", async () => {
      const result = await sendOwnerEnquiryNotification({
        type: "contact",
        name: "Jane Doe",
        email: "jane@example.com",
        message: "I love your work!",
      });

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledTimes(1);

      const call = mockSendMail.mock.calls[0][0];
      expect(call.to).toBe("owner@example.com");
      expect(call.replyTo).toBe("jane@example.com");
      expect(call.subject).toBe("Contact enquiry from Jane Doe");
      expect(call.html).toContain("New Contact enquiry");
      expect(call.html).toContain("Jane Doe");
      expect(call.html).toContain("jane@example.com");
      expect(call.html).toContain("I love your work!");
      expect(call.text).toContain("I love your work!");
    });

    it("should send a print enquiry email with artwork title", async () => {
      const result = await sendOwnerEnquiryNotification({
        type: "print",
        name: "Art Collector",
        email: "collector@example.com",
        phone: "+44 7777 123456",
        message: "I'd like a print of this piece",
        artworkTitle: "Something Good",
      });

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledTimes(1);

      const call = mockSendMail.mock.calls[0][0];
      expect(call.subject).toBe("Print enquiry from Art Collector");
      expect(call.html).toContain("New Print enquiry");
      expect(call.html).toContain("+44 7777 123456");
      expect(call.html).toContain("'Something Good'");
      expect(call.text).toContain("Something Good");
    });

    it("should send a commission enquiry email", async () => {
      const result = await sendOwnerEnquiryNotification({
        type: "commission",
        name: "Patron",
        email: "patron@example.com",
        message: "I'd like to commission a piece",
      });

      expect(result).toBe(true);

      const call = mockSendMail.mock.calls[0][0];
      expect(call.subject).toBe("Commission enquiry from Patron");
      expect(call.html).toContain("New Commission enquiry");
    });

    it("should omit artwork section when no artworkTitle provided", async () => {
      await sendOwnerEnquiryNotification({
        type: "contact",
        name: "Test User",
        email: "test@example.com",
        message: "Hello",
      });

      const call = mockSendMail.mock.calls[0][0];
      expect(call.html).not.toContain("Artwork");
    });

    it("should omit phone when not provided", async () => {
      await sendOwnerEnquiryNotification({
        type: "contact",
        name: "Test User",
        email: "test@example.com",
        message: "Hello",
      });

      const call = mockSendMail.mock.calls[0][0];
      // From line should show name and email without any phone number
      expect(call.html).toContain("Test User (test@example.com)</p>");
    });

    it("should return false when sendMail fails", async () => {
      mockSendMail.mockRejectedValueOnce(new Error("SMTP error"));

      const result = await sendOwnerEnquiryNotification({
        type: "contact",
        name: "Test",
        email: "test@example.com",
        message: "Hello",
      });

      expect(result).toBe(false);
    });
  });

  describe("sendOwnerOrderNotification", () => {
    const orderData = {
      orderRef: "BT-20260421-ABC1",
      buyerName: "John Smith",
      buyerEmail: "john@example.com",
      buyerPhone: "+44 7777 999888",
      itemTitle: "The Subject of Paint",
      itemDetails: "Left panel · Unframed · Mixed media diptych on PVC board",
      itemPrice: "£150",
      shippingZone: "uk" as const,
      shippingCost: "£12",
      totalPrice: "£162",
      addressLine1: "42 Art Street",
      addressLine2: "Flat 3",
      city: "London",
      county: "Greater London",
      postcode: "SW1A 1AA",
      country: "United Kingdom",
    };

    it("should send an order notification email to the owner", async () => {
      const result = await sendOwnerOrderNotification(orderData);

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledTimes(1);

      const call = mockSendMail.mock.calls[0][0];
      expect(call.to).toBe("owner@example.com");
      expect(call.replyTo).toBe("john@example.com");
      expect(call.subject).toContain("BT-20260421-ABC1");
      expect(call.subject).toContain("The Subject of Paint");
    });

    it("should include order details in the email body", async () => {
      await sendOwnerOrderNotification(orderData);

      const call = mockSendMail.mock.calls[0][0];
      expect(call.html).toContain("BT-20260421-ABC1");
      expect(call.html).toContain("The Subject of Paint");
      expect(call.html).toContain("£150");
      expect(call.html).toContain("£12");
      expect(call.html).toContain("£162");
      expect(call.html).toContain("Left panel");
    });

    it("should include buyer details and shipping address", async () => {
      await sendOwnerOrderNotification(orderData);

      const call = mockSendMail.mock.calls[0][0];
      expect(call.html).toContain("John Smith");
      expect(call.html).toContain("john@example.com");
      expect(call.html).toContain("+44 7777 999888");
      expect(call.html).toContain("42 Art Street");
      expect(call.html).toContain("Flat 3");
      expect(call.html).toContain("London");
      expect(call.html).toContain("SW1A 1AA");
      expect(call.html).toContain("United Kingdom");
    });

    it("should include shipping zone label for UK", async () => {
      await sendOwnerOrderNotification(orderData);
      const call = mockSendMail.mock.calls[0][0];
      expect(call.html).toContain("UK");
    });

    it("should handle Europe shipping zone", async () => {
      await sendOwnerOrderNotification({ ...orderData, shippingZone: "europe" });
      const call = mockSendMail.mock.calls[0][0];
      expect(call.html).toContain("Europe");
    });

    it("should handle Rest of World shipping zone", async () => {
      await sendOwnerOrderNotification({ ...orderData, shippingZone: "row" });
      const call = mockSendMail.mock.calls[0][0];
      expect(call.html).toContain("Rest of World");
    });

    it("should include PayPal reminder", async () => {
      await sendOwnerOrderNotification(orderData);
      const call = mockSendMail.mock.calls[0][0];
      expect(call.html).toContain("Check your PayPal");
      expect(call.text).toContain("Check your PayPal");
    });

    it("should omit phone when not provided", async () => {
      await sendOwnerOrderNotification({ ...orderData, buyerPhone: undefined });
      const call = mockSendMail.mock.calls[0][0];
      expect(call.html).toContain("John Smith (john@example.com)");
      expect(call.html).not.toContain("undefined");
    });

    it("should return false when sendMail fails", async () => {
      mockSendMail.mockRejectedValueOnce(new Error("SMTP error"));

      const result = await sendOwnerOrderNotification(orderData);

      expect(result).toBe(false);
    });
  });
});
