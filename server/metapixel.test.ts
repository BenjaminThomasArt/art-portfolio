import { describe, it, expect } from "vitest";

describe("Meta Pixel Configuration", () => {
  it("should have VITE_META_PIXEL_ID environment variable set", () => {
    const pixelId = process.env.VITE_META_PIXEL_ID;
    expect(pixelId).toBeDefined();
    expect(pixelId).not.toBe("");
    // Meta Pixel IDs are numeric strings, typically 15-16 digits
    expect(pixelId).toMatch(/^\d{10,20}$/);
  });
});
