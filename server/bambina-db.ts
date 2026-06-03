import { eq } from "drizzle-orm";
import {
  bambinaChecklist,
  bambinaShopping,
  bambinaNotes,
  bambinaPayments,
  InsertBambinaChecklistItem,
  InsertBambinaShoppingItem,
  InsertBambinaNote,
  InsertBambinaPayment,
} from "../drizzle/schema";
import { getDb } from "./db";

// ============ CHECKLIST ============

export async function getAllChecklistItems() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bambinaChecklist).orderBy(bambinaChecklist.phase, bambinaChecklist.sortOrder);
}

export async function toggleChecklistItem(id: number, completed: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bambinaChecklist).set({ completed: completed ? 1 : 0 }).where(eq(bambinaChecklist.id, id));
}

export async function updateChecklistNotes(id: number, notes: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bambinaChecklist).set({ notes }).where(eq(bambinaChecklist.id, id));
}

export async function snoozeChecklistItem(id: number, weeks: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bambinaChecklist).set({ snoozedWeeks: weeks }).where(eq(bambinaChecklist.id, id));
}

export async function createChecklistItem(item: InsertBambinaChecklistItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(bambinaChecklist).values(item);
}

// ============ SHOPPING ============

export async function getAllShoppingItems() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bambinaShopping).orderBy(bambinaShopping.category, bambinaShopping.sortOrder);
}

export async function toggleShoppingItem(id: number, purchased: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bambinaShopping).set({ purchased: purchased ? 1 : 0 }).where(eq(bambinaShopping.id, id));
}

export async function createShoppingItem(item: InsertBambinaShoppingItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(bambinaShopping).values(item);
}

// ============ NOTES ============

export async function getAllNotes() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bambinaNotes).orderBy(bambinaNotes.category, bambinaNotes.createdAt);
}

export async function createNote(note: InsertBambinaNote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(bambinaNotes).values(note);
}

export async function updateNote(id: number, data: { title?: string; content?: string; category?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bambinaNotes).set(data).where(eq(bambinaNotes.id, id));
}

export async function deleteNote(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(bambinaNotes).where(eq(bambinaNotes.id, id));
}

// ============ PAYMENTS ============

export async function getAllPayments() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bambinaPayments).orderBy(bambinaPayments.sortOrder);
}

export async function togglePayment(id: number, paid: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bambinaPayments).set({ paid: paid ? 1 : 0, paidDate: paid ? new Date() : null }).where(eq(bambinaPayments.id, id));
}

export async function createPayment(payment: InsertBambinaPayment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(bambinaPayments).values(payment);
}
