import { describe, it, expect } from "vitest";
import { getAllPrints, getPrintById, createPrint } from "./db";

describe("Print Catalog", () => {
  it("should retrieve all available prints", async () => {
    const prints = await getAllPrints();
    expect(Array.isArray(prints)).toBe(true);
    
    // Should have at least one print (The Subject of Paint)
    expect(prints.length).toBeGreaterThan(0);
    
    // All prints should have required fields
    prints.forEach(print => {
      expect(print).toHaveProperty("id");
      expect(print).toHaveProperty("title");
      expect(print).toHaveProperty("imageUrl");
      expect(print).toHaveProperty("imageKey");
      expect(print.available).toBe(1);
    });
  });

  it("should retrieve a specific print by ID", async () => {
    // First get all prints to get a valid ID
    const prints = await getAllPrints();
    expect(prints.length).toBeGreaterThan(0);
    
    const firstPrint = prints[0];
    const print = await getPrintById(firstPrint.id);
    
    expect(print).toBeDefined();
    expect(print?.id).toBe(firstPrint.id);
    expect(print?.title).toBe(firstPrint.title);
  });

  it("should return undefined for non-existent print ID", async () => {
    const print = await getPrintById(999999);
    expect(print).toBeUndefined();
  });

  it("should verify The Subject of Paint print exists", async () => {
    const prints = await getAllPrints();
    const subjectOfPaint = prints.find(p => p.title === "The Subject of Paint");
    
    expect(subjectOfPaint).toBeDefined();
    expect(subjectOfPaint?.sizeInfo).toBe("Available in custom sizes");
    expect(subjectOfPaint?.imageUrl).toContain("shop-hero-image.jpg");
  });
});
