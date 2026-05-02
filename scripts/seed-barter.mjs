/**
 * Barter & Trade seed script
 * - Removes test/dummy entries
 * - Inserts polished example listings so the board never looks empty
 *
 * Run: node scripts/seed-barter.mjs
 */
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const conn = await mysql.createConnection(DATABASE_URL);

// ── 1. Soft-delete test/dummy entries ────────────────────────────────────
console.log("Removing test entries...");
await conn.execute(
  `UPDATE barterListings SET isActive = 0
   WHERE title LIKE '%testing%'
      OR title LIKE '%test%'
      OR description LIKE '%testing testing%'
      OR (title LIKE '%Egg%' AND posterEmail LIKE '%homesteadhub.com%')`
);

// ── 2. Check how many real listings remain ───────────────────────────────
const [rows] = await conn.execute(
  "SELECT COUNT(*) as cnt FROM barterListings WHERE isActive = 1"
);
const activeCount = rows[0].cnt;
console.log(`Active listings after cleanup: ${activeCount}`);

// ── 3. Seed polished example listings ────────────────────────────────────
const examples = [
  {
    title: "Pastured Chicken Eggs — 2 Dozen Weekly",
    offering: "Two dozen fresh pastured eggs every week from our free-range flock. Brown, blue, and green shells. Hens are fed non-GMO grain and forage freely.",
    seeking: "Canning jars (quart or half-gallon), lids, or fresh garden produce. Open to other fair trades — just ask.",
    category: "food-produce",
    location: "Ozark Mountains, AR",
    posterName: "Nikki R.",
    posterEmail: "nikki@a1homesteadhub.com",
  },
  {
    title: "Skilled Carpenter Available — Trade for Produce or Livestock",
    offering: "30+ years of carpentry experience. Can build chicken coops, fence lines, raised beds, barn repairs, or basic outbuildings. I bring my own tools.",
    seeking: "Fresh or preserved food, laying hens, meat rabbits, or goat milk. Willing to discuss other fair trades.",
    category: "skills-labor",
    location: "Hill Country, TX",
    posterName: "Dale W.",
    posterEmail: null,
  },
  {
    title: "Heritage Breed Meat Rabbits — Breeding Pairs Available",
    offering: "New Zealand White and Californian breeding pairs, 6–8 weeks old. Raised on hay, pellets, and garden scraps. Excellent for meat production and easy to raise.",
    seeking: "Fruit tree starts (apple, pear, or persimmon), berry canes, or heirloom vegetable seeds. Open to other trades.",
    category: "animals-livestock",
    location: "Appalachian Foothills, TN",
    posterName: "Sarah M.",
    posterEmail: null,
  },
  {
    title: "Heirloom Seed Collection — 40+ Varieties",
    offering: "Curated collection of open-pollinated, heirloom seeds saved over 10 years. Includes tomatoes, peppers, squash, beans, herbs, and flowers. All tested for germination.",
    seeking: "Canning supplies, fermentation crocks, dehydrator trays, or other heirloom seeds I don't have. Will list full variety catalog on request.",
    category: "seeds-plants",
    location: "Blue Ridge Mountains, NC",
    posterName: "Ruth H.",
    posterEmail: null,
  },
  {
    title: "Walk-Behind Tractor — Trade or Short-Term Loan",
    offering: "BCS walk-behind tractor with tiller and mower attachments. Runs great, well-maintained. Available for trade or I'll loan it for a season in exchange for fair compensation.",
    seeking: "Livestock feed (hay, corn, or scratch), labor help on my property, or quality hand tools. Let's talk.",
    category: "tools-equipment",
    location: "Willamette Valley, OR",
    posterName: "James K.",
    posterEmail: null,
  },
];

console.log("Inserting example listings...");
for (const ex of examples) {
  await conn.execute(
    `INSERT INTO barterListings
       (userId, title, description, offering, seeking, category, offeringType,
        location, posterName, posterEmail, isActive, createdAt, updatedAt)
     VALUES (0, ?, ?, ?, ?, ?, 'offer', ?, ?, ?, 1, NOW(), NOW())`,
    [
      ex.title,
      `${ex.offering} | Seeking: ${ex.seeking}`,
      ex.offering,
      ex.seeking,
      ex.category,
      ex.location ?? null,
      ex.posterName ?? null,
      ex.posterEmail ?? null,
    ]
  );
  console.log(`  ✓ ${ex.title}`);
}

await conn.end();
console.log("Done! Barter board seeded successfully.");
