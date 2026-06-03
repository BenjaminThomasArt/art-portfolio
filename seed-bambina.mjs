import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const db = drizzle(DATABASE_URL);

// ============ CHECKLIST ITEMS ============
const checklistItems = [
  // Pre-pregnancy
  { category: "legal", phase: "pre_pregnancy", title: "Sign surrogacy contract with Ariadna", description: null, dueWeek: null, sortOrder: 1 },
  { category: "medical", phase: "pre_pregnancy", title: "Complete IVF cycle and embryo creation", description: null, dueWeek: null, sortOrder: 2 },
  { category: "medical", phase: "pre_pregnancy", title: "Surrogate medical screening and match", description: null, dueWeek: null, sortOrder: 3 },
  { category: "medical", phase: "pre_pregnancy", title: "Transport embryos to Mexico", description: null, dueWeek: null, sortOrder: 4 },
  { category: "medical", phase: "pre_pregnancy", title: "Embryo transfer procedure", description: null, dueWeek: null, sortOrder: 5 },

  // First trimester
  { category: "medical", phase: "first_trimester", title: "Early Pregnancy Scan (6+4 WOG)", description: null, dueWeek: 6, sortOrder: 1 },
  { category: "medical", phase: "first_trimester", title: "Pregnancy Scan - viability, gestational age, heartbeat (10 WOG)", description: null, dueWeek: 10, sortOrder: 2 },
  { category: "medical", phase: "first_trimester", title: "Foetal Medical Scan + Blood work (12-14 WOG)", description: "Blood Count, Chemistry, Liver, HIV, Syphilis, Hep C/A, Urinalysis", dueWeek: 12, sortOrder: 3 },
  { category: "medical", phase: "first_trimester", title: "NIPT Screening", description: null, dueWeek: 12, sortOrder: 4 },
  { category: "agency", phase: "first_trimester", title: "Register with MSJ Hub (Week 12)", description: null, dueWeek: 12, sortOrder: 5 },
  { category: "agency", phase: "first_trimester", title: "Intro call with Mindful Surrogacy teacher (Week 13-15)", description: null, dueWeek: 13, sortOrder: 6 },

  // Second trimester
  { category: "medical", phase: "second_trimester", title: "Anatomy scan (22 WOG)", description: "Foetal Medical Scan + Oral Glucose Tolerance Test + Urinalysis + Blood Count", dueWeek: 22, sortOrder: 1 },
  { category: "legal", phase: "second_trimester", title: "Mexican legal fees - stage 2 (Week 16)", description: null, dueWeek: 16, sortOrder: 2 },
  { category: "legal", phase: "second_trimester", title: "UK Legal Fees - instruct UK lawyer (Week 20)", description: null, dueWeek: 20, sortOrder: 3 },
  { category: "agency", phase: "second_trimester", title: "Mindful Surrogacy Session 1 (Week 20-24)", description: "2 hours - birthing process, birth-day expectations, newborn care in Mexico", dueWeek: 20, sortOrder: 4 },
  { category: "travel", phase: "second_trimester", title: "Book accommodation in Mexico City", description: "Recommended areas: Polanco, Condesa, Reforma, Roma", dueWeek: 20, sortOrder: 5 },
  { category: "travel", phase: "second_trimester", title: "Book flights to Mexico City", description: null, dueWeek: 20, sortOrder: 6 },
  { category: "agency", phase: "second_trimester", title: "Week 18-20 catch-up call with Sophie", description: null, dueWeek: 18, sortOrder: 7 },
  { category: "agency", phase: "second_trimester", title: "Mindful Surrogacy Session 2 (Week 24-30)", description: "1 hour - preparing to fly, final preparations", dueWeek: 24, sortOrder: 8 },
  { category: "agency", phase: "second_trimester", title: "Week 26-28 catch-up call with Sophie", description: null, dueWeek: 26, sortOrder: 9 },

  // Third trimester
  { category: "medical", phase: "third_trimester", title: "Regular Scan + Flu vaccine (27 WOG)", description: null, dueWeek: 27, sortOrder: 1 },
  { category: "medical", phase: "third_trimester", title: "Growth Scan + Vagina Cultures (32 WOG)", description: "Mycoplasma, Ureaplasma, Urinalysis", dueWeek: 32, sortOrder: 2 },
  { category: "medical", phase: "third_trimester", title: "Regular Scan + Blood Count + Coagulation (36 WOG)", description: "Plan for birth", dueWeek: 36, sortOrder: 3 },
  { category: "medical", phase: "third_trimester", title: "Weekly scans from 37 WOG - assess need for delivery", description: null, dueWeek: 37, sortOrder: 4 },
  { category: "nursery", phase: "third_trimester", title: "Confirm cot sheets (3-4) at 28 weeks", description: null, dueWeek: 28, sortOrder: 5 },
  { category: "travel", phase: "third_trimester", title: "Arrive in Mexico City before birth", description: null, dueWeek: 36, sortOrder: 6 },
  { category: "nursery", phase: "third_trimester", title: "Set up nursery/baby area in accommodation", description: null, dueWeek: 36, sortOrder: 7 },
  { category: "financial", phase: "third_trimester", title: "Purchase expressing equipment from Amazon Mexico", description: null, dueWeek: 34, sortOrder: 8 },

  // Birth
  { category: "medical", phase: "birth", title: "Delivery at Hospital Español (C-section)", description: null, dueWeek: 40, sortOrder: 1 },
  { category: "medical", phase: "birth", title: "Ensure car seat is ready for hospital discharge", description: null, dueWeek: 40, sortOrder: 2 },

  // Post-birth
  { category: "medical", phase: "post_birth", title: "Suture removal - 7 days post-birth (surrogate)", description: null, dueWeek: null, sortOrder: 1 },
  { category: "medical", phase: "post_birth", title: "General check-up - 7 days post-birth (surrogate)", description: null, dueWeek: null, sortOrder: 2 },
  { category: "medical", phase: "post_birth", title: "Pediatric check - 10 days post-birth", description: "General check, weight, feeding assessment, vaccination review", dueWeek: null, sortOrder: 3 },
  { category: "medical", phase: "post_birth", title: "Pediatric check - 1 month post-birth", description: "Growth tracking, full physical exam, 8 week vaccinations", dueWeek: null, sortOrder: 4 },
  { category: "medical", phase: "post_birth", title: "Fit to Fly appointment", description: "Health status, ear pressure, immune status, feeding readiness", dueWeek: null, sortOrder: 5 },
  { category: "medical", phase: "post_birth", title: "40 days post-birth check-up (surrogate)", description: "General check-up, birth control", dueWeek: null, sortOrder: 6 },
  { category: "legal", phase: "post_birth", title: "Mexican legal fees - stage 3 (filiation proceedings)", description: null, dueWeek: null, sortOrder: 7 },
  { category: "legal", phase: "post_birth", title: "Register birth at Mexico City Civil Registry", description: null, dueWeek: null, sortOrder: 8 },
  { category: "legal", phase: "post_birth", title: "Apply for UK passport for baby", description: null, dueWeek: null, sortOrder: 9 },
  { category: "travel", phase: "post_birth", title: "Fly home to London with baby", description: null, dueWeek: null, sortOrder: 10 },
];

// ============ SHOPPING ITEMS ============
const shoppingItems = [
  { category: "feeding", title: "Baby bottles (self-sterilising MAM)", notes: "Widely available globally. Also at Liverpool Mexico store", sortOrder: 1 },
  { category: "feeding", title: "Milk prep machine", notes: "Provided by MSJ", sortOrder: 2 },
  { category: "feeding", title: "Formula milk", notes: null, sortOrder: 3 },
  { category: "feeding", title: "Bottle brush", notes: null, sortOrder: 4 },
  { category: "feeding", title: "Sterilising machine or Milton tablets", notes: "Not needed in Mexico if using MAM bottles", sortOrder: 5 },
  { category: "sleeping", title: "Next-to-me cot (Chicco)", notes: "Provided by MSJ", sortOrder: 1 },
  { category: "sleeping", title: "Mattress for cot", notes: "Provided by MSJ", sortOrder: 2 },
  { category: "sleeping", title: "Cot sheets (3-4)", notes: "Confirmed at 28 weeks of pregnancy", sortOrder: 3 },
  { category: "sleeping", title: "Waterproof mattress protectors", notes: null, sortOrder: 4 },
  { category: "sleeping", title: "Swaddle blankets", notes: "Swaddle Up suits recommended", sortOrder: 5 },
  { category: "nappies", title: "Nappies (cloth or disposable)", notes: null, sortOrder: 1 },
  { category: "nappies", title: "Wipes", notes: null, sortOrder: 2 },
  { category: "nappies", title: "Nappy cream", notes: null, sortOrder: 3 },
  { category: "nappies", title: "Nappy sacks", notes: null, sortOrder: 4 },
  { category: "nappies", title: "Nappy bin", notes: "Optional but useful for controlling odours", sortOrder: 5 },
  { category: "nappies", title: "Changing pad", notes: null, sortOrder: 6 },
  { category: "nappies", title: "Change bag", notes: null, sortOrder: 7 },
  { category: "clothing", title: "Vests", notes: null, sortOrder: 1 },
  { category: "clothing", title: "Babygrows", notes: null, sortOrder: 2 },
  { category: "clothing", title: "Hats", notes: null, sortOrder: 3 },
  { category: "clothing", title: "Socks", notes: null, sortOrder: 4 },
  { category: "clothing", title: "Mittens", notes: "To prevent scratching", sortOrder: 5 },
  { category: "clothing", title: "Bibs", notes: null, sortOrder: 6 },
  { category: "clothing", title: "Muslins", notes: null, sortOrder: 7 },
  { category: "bathing", title: "Baby bathtub", notes: "Provided by MSJ", sortOrder: 1 },
  { category: "bathing", title: "Body wash/shampoo", notes: "Only water needed for first few weeks", sortOrder: 2 },
  { category: "bathing", title: "Soft baby towels", notes: null, sortOrder: 3 },
  { category: "bathing", title: "Baby hairbrush", notes: null, sortOrder: 4 },
  { category: "bathing", title: "Baby nail clippers or scissors", notes: null, sortOrder: 5 },
  { category: "health", title: "Car seat", notes: "ESSENTIAL - must bring to Mexico or purchase on arrival", sortOrder: 1 },
  { category: "health", title: "Baby monitor", notes: null, sortOrder: 2 },
  { category: "health", title: "First aid kit (infant-specific)", notes: null, sortOrder: 3 },
  { category: "health", title: "Thermometer (digital)", notes: null, sortOrder: 4 },
  { category: "health", title: "Baby-friendly laundry detergent", notes: null, sortOrder: 5 },
  { category: "travel", title: "Pushchair", notes: "Ensure car seat compatibility if needed", sortOrder: 1 },
  { category: "travel", title: "Baby carrier or sling", notes: null, sortOrder: 2 },
  { category: "travel", title: "Travel changing mat", notes: null, sortOrder: 3 },
  { category: "travel", title: "Buggy shade (SnoozeShade)", notes: null, sortOrder: 4 },
  { category: "expressing", title: "Breast pump", notes: "Amazon Mexico, ~1,678 MXN", sortOrder: 1 },
  { category: "expressing", title: "Nursing pads", notes: "Amazon Mexico, ~329.86 MXN", sortOrder: 2 },
  { category: "expressing", title: "Bags for milk (150pcs)", notes: "Amazon Mexico, ~546.88 MXN", sortOrder: 3 },
  { category: "expressing", title: "Cooler for breast milk", notes: "Amazon Mexico, ~359 MXN", sortOrder: 4 },
  { category: "expressing", title: "Lanolina Cream", notes: "Amazon Mexico, ~335 MXN", sortOrder: 5 },
  { category: "expressing", title: "Ice packs for cooler (10)", notes: "Amazon Mexico, ~250 MXN", sortOrder: 6 },
  { category: "expressing", title: "Sharpie markers (2)", notes: "For labelling breast milk bags, ~169 MXN", sortOrder: 7 },
  { category: "expressing", title: "Disinfecting wipes", notes: "Amazon Mexico, ~120 MXN", sortOrder: 8 },
  { category: "miscellaneous", title: "Dummies", notes: "If using", sortOrder: 1 },
  { category: "miscellaneous", title: "Bottle warmer", notes: "Optional", sortOrder: 2 },
  { category: "miscellaneous", title: "Baby play mat", notes: "Or use changing mat", sortOrder: 3 },
  { category: "miscellaneous", title: "Car sunshades", notes: null, sortOrder: 4 },
  { category: "miscellaneous", title: "Room thermometer", notes: null, sortOrder: 5 },
];

// ============ PAYMENTS ============
const payments = [
  { category: "agency", description: "IP membership fee - stage 1", amount: "$15,500", currency: "USD", amountNumeric: 1550000, dueMonth: "Month 1 - IP Onboarding", paid: 1, sortOrder: 1 },
  { category: "agency", description: "Surrogate membership fee - stage 1", amount: "$15,000", currency: "USD", amountNumeric: 1500000, dueMonth: "Month 1 - IP Onboarding", paid: 1, sortOrder: 2 },
  { category: "agency", description: "IP membership fee - stage 2", amount: "$7,500", currency: "USD", amountNumeric: 750000, dueMonth: "Month 2-3 - Embryo Transport", paid: 1, sortOrder: 3 },
  { category: "agency", description: "Surrogate membership - stage 2", amount: "$9,500", currency: "USD", amountNumeric: 950000, dueMonth: "Month 4 - Surrogate Match", paid: 1, sortOrder: 4 },
  { category: "medical", description: "Surrogate major medical insurance", amount: "$45,000", currency: "MXN", amountNumeric: 4500000, dueMonth: "Month 4 - Surrogate Match", paid: 1, sortOrder: 5 },
  { category: "legal", description: "Mexican legal fees - stage 1", amount: "$100,000", currency: "MXN", amountNumeric: 10000000, dueMonth: "Month 4 - Surrogate Match", paid: 1, sortOrder: 6 },
  { category: "surrogate", description: "Surrogate Nutrition", amount: "$5,000", currency: "MXN", amountNumeric: 500000, dueMonth: "Month 4 - Surrogate Match", paid: 1, sortOrder: 7 },
  { category: "medical", description: "Pre-Match Surrogate Medical Screening, Medication & Vitamins", amount: "$47,000", currency: "MXN", amountNumeric: 4700000, dueMonth: "Month 4 - Surrogate Match", paid: 1, sortOrder: 8 },
  { category: "medical", description: "Embryo Reception & Storage", amount: "$12,000", currency: "MXN", amountNumeric: 1200000, dueMonth: "Month 5 - Embryo Transfer Prep", paid: 1, sortOrder: 9 },
  { category: "medical", description: "Embryo Transfer Preparation inc ET, Medication & Scans", amount: "$50,000", currency: "MXN", amountNumeric: 5000000, dueMonth: "Month 5 - Embryo Transfer Prep", paid: 1, sortOrder: 10 },
  { category: "medical", description: "Surrogate life insurance (annual)", amount: "$6,000", currency: "MXN", amountNumeric: 600000, dueMonth: "Month 5 - Embryo Transfer Prep", paid: 1, sortOrder: 11 },
  { category: "surrogate", description: "ET compensation and meals", amount: "$15,000", currency: "MXN", amountNumeric: 1500000, dueMonth: "Month 6 - Embryo Transfer", paid: 1, sortOrder: 12 },
  { category: "surrogate", description: "Surrogate Compensation (week 8)", amount: "$28,000", currency: "MXN", amountNumeric: 2800000, dueMonth: "Month 8 - Beta+", paid: 1, sortOrder: 13 },
  { category: "medical", description: "Obstetrics Package - Monitoring and Ultrasound Scans", amount: "$60,000", currency: "MXN", amountNumeric: 6000000, dueMonth: "Month 9 - 12 Week Gestation", paid: 1, sortOrder: 14 },
  { category: "surrogate", description: "Surrogate compensation (week 12)", amount: "$28,000", currency: "MXN", amountNumeric: 2800000, dueMonth: "Month 9 - 12 Week Gestation", paid: 1, sortOrder: 15 },
  { category: "surrogate", description: "Surrogate compensation (week 16)", amount: "$28,000", currency: "MXN", amountNumeric: 2800000, dueMonth: "Month 10 - 16 Weeks", paid: 0, sortOrder: 16 },
  { category: "legal", description: "Mexican legal fees - stage 2", amount: "$52,000", currency: "MXN", amountNumeric: 5200000, dueMonth: "Month 10 - 16 Weeks", paid: 0, sortOrder: 17 },
  { category: "agency", description: "IP membership fee - stage 3 (20 weeks)", amount: "$2,000", currency: "USD", amountNumeric: 200000, dueMonth: "Month 11 - 20 Weeks", paid: 0, sortOrder: 18 },
  { category: "legal", description: "UK Legal Fees (20 weeks)", amount: "£6,700", currency: "GBP", amountNumeric: 670000, dueMonth: "Month 11 - 20 Weeks", paid: 0, sortOrder: 19 },
  { category: "surrogate", description: "Surrogate maternity clothing", amount: "$15,000", currency: "MXN", amountNumeric: 1500000, dueMonth: "Month 11 - 20 Weeks", paid: 0, sortOrder: 20 },
  { category: "surrogate", description: "Surrogate compensation (week 20)", amount: "$28,000", currency: "MXN", amountNumeric: 2800000, dueMonth: "Month 11 - 20 Weeks", paid: 0, sortOrder: 21 },
  { category: "surrogate", description: "Surrogate compensation (week 24)", amount: "$28,000", currency: "MXN", amountNumeric: 2800000, dueMonth: "Month 12 - 24 Weeks", paid: 0, sortOrder: 22 },
  { category: "surrogate", description: "Surrogate compensation (week 28)", amount: "$28,000", currency: "MXN", amountNumeric: 2800000, dueMonth: "Month 13 - 28 Weeks", paid: 0, sortOrder: 23 },
  { category: "surrogate", description: "Surrogate compensation (week 32)", amount: "$28,000", currency: "MXN", amountNumeric: 2800000, dueMonth: "Month 14-15 - 32-36 Weeks", paid: 0, sortOrder: 24 },
  { category: "surrogate", description: "Surrogate compensation (week 36)", amount: "$28,000", currency: "MXN", amountNumeric: 2800000, dueMonth: "Month 14-15 - 32-36 Weeks", paid: 0, sortOrder: 25 },
  { category: "medical", description: "Obstetrics Delivery Fees (inc C-section)", amount: "$90,000", currency: "MXN", amountNumeric: 9000000, dueMonth: "Month 16 - Birth (40 Weeks)", paid: 0, sortOrder: 26 },
  { category: "medical", description: "Hospital Package (inc C-section delivery)", amount: "$70,140", currency: "MXN", amountNumeric: 7014000, dueMonth: "Month 16 - Birth (40 Weeks)", paid: 0, sortOrder: 27 },
  { category: "surrogate", description: "Surrogate compensation (week 40)", amount: "$28,000", currency: "MXN", amountNumeric: 2800000, dueMonth: "Month 16 - Birth (40 Weeks)", paid: 0, sortOrder: 28 },
  { category: "surrogate", description: "Surrogate compensation (post birth)", amount: "$28,000", currency: "MXN", amountNumeric: 2800000, dueMonth: "Month 17-18 - Post Birth", paid: 0, sortOrder: 29 },
  { category: "legal", description: "Mexican legal fees - stage 3", amount: "$52,000", currency: "MXN", amountNumeric: 5200000, dueMonth: "Month 17-18 - Post Birth", paid: 0, sortOrder: 30 },
  { category: "surrogate", description: "Surrogate Final Payment (completion of legal proceedings)", amount: "$30,000", currency: "MXN", amountNumeric: 3000000, dueMonth: "Month 17-18 - Post Birth", paid: 0, sortOrder: 31 },
  { category: "medical", description: "Insurance Maternity Help Payment (credit)", amount: "-$70,000", currency: "MXN", amountNumeric: -7000000, dueMonth: "Month 17-18 - Post Birth", paid: 0, sortOrder: 32 },
];

async function seed() {
  console.log("Seeding Bambina data...");

  // Insert checklist items
  for (const item of checklistItems) {
    await db.execute(sql`INSERT INTO bambina_checklist (category, phase, title, description, due_week, sort_order, completed, snoozed_weeks) VALUES (${item.category}, ${item.phase}, ${item.title}, ${item.description}, ${item.dueWeek}, ${item.sortOrder}, 0, 0)`);
  }
  console.log(`Inserted ${checklistItems.length} checklist items`);

  // Insert shopping items
  for (const item of shoppingItems) {
    await db.execute(sql`INSERT INTO bambina_shopping (category, title, notes, sort_order, purchased) VALUES (${item.category}, ${item.title}, ${item.notes}, ${item.sortOrder}, 0)`);
  }
  console.log(`Inserted ${shoppingItems.length} shopping items`);

  // Insert payments
  for (const item of payments) {
    await db.execute(sql`INSERT INTO bambina_payments (category, description, amount, currency, amount_numeric, due_month, paid, sort_order) VALUES (${item.category}, ${item.description}, ${item.amount}, ${item.currency}, ${item.amountNumeric}, ${item.dueMonth}, ${item.paid}, ${item.sortOrder})`);
  }
  console.log(`Inserted ${payments.length} payment items`);

  console.log("\nBambina seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
