/**
 * seed-data.mjs
 * Seeds the Scott City 4th of July 2026 event and 12 realistic barter listings.
 * Run once: node seed-data.mjs
 */

import "dotenv/config";
import mysql from "mysql2/promise";

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ─── Community Event ─────────────────────────────────────────────────────────

const [evtRows] = await conn.execute(
  "SELECT id FROM communityEvents WHERE title LIKE '%4th of July%' LIMIT 1"
);
if (evtRows.length === 0) {
  await conn.execute(
    `INSERT INTO communityEvents
       (title, description, eventDate, endDate, location, address, category, externalUrl, isFeatured, createdBy)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      "Scott City 4th of July Celebration 2026",
      "Join the Scott City community for a full day of patriotic fun! Enjoy live music, food vendors, kids' activities, a parade through downtown, and a spectacular fireworks display after dark. Free admission — bring your lawn chairs and blankets.",
      new Date("2026-07-04T10:00:00Z"),
      new Date("2026-07-04T23:59:00Z"),
      "Scott City Park & Downtown",
      "Scott City, KS 67871",
      "festival",
      "https://www.facebook.com/scottcityks",
      true,
      "Nikki Russell — A1 Homestead Hub",
    ]
  );
  console.log("✅ Scott City 4th of July event seeded");
} else {
  console.log("⏭  Scott City event already exists, skipping");
}

// ─── Barter Listings ─────────────────────────────────────────────────────────

const listings = [
  {
    title: "Fresh Eggs for Canning Jars or Lids",
    offering: "2 dozen fresh brown eggs per week from our free-range flock",
    seeking: "Wide-mouth quart canning jars or new lids (any brand)",
    category: "food-produce",
    location: "Scott City",
    state: "Kansas",
    posterName: "Nikki Russell",
  },
  {
    title: "Heirloom Tomato Starts — Cherokee Purple & Mortgage Lifter",
    offering: "6-pack of hardened-off heirloom tomato starts (Cherokee Purple or Mortgage Lifter)",
    seeking: "Pepper starts, herb starts, or seed packets",
    category: "seeds-plants",
    location: "Scott City",
    state: "Kansas",
    posterName: "Nikki Russell",
  },
  {
    title: "Fence Post Driving Help for Garden Produce",
    offering: "Half day of fence post driving (I have the equipment)",
    seeking: "Fresh vegetables, eggs, or homemade preserves",
    category: "skills-labor",
    location: "Scott County",
    state: "Kansas",
    posterName: "Dale M.",
  },
  {
    title: "Raw Goat Milk (1 Gallon/Week) for Fermentation Supplies",
    offering: "1 gallon raw goat milk per week from our Nubian does",
    seeking: "Cheese cultures, rennet, or fermentation crocks",
    category: "food-produce",
    location: "Garden City",
    state: "Kansas",
    posterName: "Sarah T.",
  },
  {
    title: "Pressure Canner for Chest Freezer Space",
    offering: "All-American 921 pressure canner (21.5 qt, excellent condition)",
    seeking: "Chest freezer (5–7 cu ft) or equivalent trade",
    category: "tools-equipment",
    location: "Liberal",
    state: "Kansas",
    posterName: "Jim H.",
  },
  {
    title: "Soap Making Lessons for Beeswax or Honey",
    offering: "2-hour hands-on soap making class (cold process, 6 bars to take home)",
    seeking: "Raw beeswax (1 lb) or raw honey (2 lbs)",
    category: "skills-labor",
    location: "Dodge City",
    state: "Kansas",
    posterName: "Carol B.",
  },
  {
    title: "Meat Rabbits (4 Fryers) for Laying Hens",
    offering: "4 processed meat rabbits (New Zealand White, ~4 lbs each)",
    seeking: "2–3 laying hens (Rhode Island Red or similar)",
    category: "animals-livestock",
    location: "Ulysses",
    state: "Kansas",
    posterName: "Mike R.",
  },
  {
    title: "Dehydrated Zucchini & Summer Squash for Root Crops",
    offering: "5 lbs dehydrated zucchini and yellow squash (vacuum sealed)",
    seeking: "Sweet potatoes, winter squash, or dried beans",
    category: "food-produce",
    location: "Lakin",
    state: "Kansas",
    posterName: "Patty J.",
  },
  {
    title: "Welding Repair Work for Firewood",
    offering: "Small welding repairs (farm equipment, gates, trailers)",
    seeking: "1 cord of split firewood (oak or hedge preferred)",
    category: "skills-labor",
    location: "Leoti",
    state: "Kansas",
    posterName: "Tom W.",
  },
  {
    title: "Homemade Lard (5 lbs) for Rendered Tallow",
    offering: "5 lbs leaf lard rendered from heritage breed pigs",
    seeking: "Rendered beef tallow (5 lbs) or equivalent",
    category: "food-produce",
    location: "Tribune",
    state: "Kansas",
    posterName: "Anna K.",
  },
  {
    title: "Seedling Heat Mat for Seed Starting Mix",
    offering: "Seedling heat mat (10x20, works perfectly)",
    seeking: "Pro-Mix or similar seed starting mix (2 cu ft bag)",
    category: "tools-equipment",
    location: "Scott City",
    state: "Kansas",
    posterName: "Nikki Russell",
  },
  {
    title: "Hay (Small Square Bales) for Canning Help",
    offering: "10 small square bales of prairie hay",
    seeking: "Help with a canning day — I supply the produce and jars, you supply the hands",
    category: "food-produce",
    location: "Ness City",
    state: "Kansas",
    posterName: "Ruth E.",
  },
];

let seeded = 0;
let skipped = 0;

for (const l of listings) {
  const [existing] = await conn.execute(
    "SELECT id FROM barterListings WHERE title = ? LIMIT 1",
    [l.title]
  );
  if (existing.length > 0) {
    skipped++;
    continue;
  }
  await conn.execute(
    `INSERT INTO barterListings
       (userId, title, description, offering, seeking, category, location, state, posterName, offeringType, isActive)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      0,
      l.title,
      `${l.offering} | Seeking: ${l.seeking}`,
      l.offering,
      l.seeking,
      l.category,
      l.location,
      l.state,
      l.posterName,
      "offer",
      true,
    ]
  );
  seeded++;
}

console.log(`✅ Barter listings: ${seeded} seeded, ${skipped} already existed`);

await conn.end();
console.log("Done.");
