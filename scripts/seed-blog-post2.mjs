/**
 * Seed script: Insert second blog post — Wild Foraging: Reading the Land
 * This post is MEMBERS ONLY (isFree = 0) to demonstrate the subscription gate.
 * Run: node scripts/seed-blog-post2.mjs
 */

import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const content = `Wild Foraging: Reading the Land Before You Pick

1. The Forager's First Rule: Identification Before Harvest

The land is generous, but it doesn't forgive carelessness. Before you pull a single plant from the earth, you must know it with absolute certainty. Not "pretty sure." Not "looks like." Certain. The difference between wild garlic and death camas is the difference between a good meal and a funeral. This is not a skill you learn from one book or one walk in the woods — it is built season by season, plant by plant, until the land starts to speak a language you understand.

Start with five plants. Master them completely before you add a sixth. Learn them in every season — what they look like in spring when they first push through the frost, in summer at full growth, in fall when they go to seed, and in winter when only the root remains. A plant you know in all four seasons is a plant you can trust.

The Forager's Identification Checklist

* Leaf shape, margin, and venation pattern
* Stem cross-section (round, square, triangular, hollow)
* Root structure and smell when crushed
* Flower color, petal count, and arrangement
* Habitat preference (wet, dry, shaded, open)
* Seasonal timing in your specific region

2. The Appalachian Foraging Calendar

The mountains move on their own schedule, and the smart forager moves with them. Spring arrives in waves — first on the south-facing slopes, then in the hollows, then on the north-facing ridges weeks later. A single mountain can give you a six-week foraging season for ramps if you follow the elevation.

Early Spring (March–April): The Hunger Gap Breakers

These are the plants that kept mountain families alive when the root cellar was empty and the garden hadn't started yet.

* Ramps (Allium tricoccum): The king of Appalachian spring. Harvest the leaves only — never pull the bulb unless the stand is thick. Leave every third plant. A ramp patch takes seven years to recover from over-harvest.
* Chickweed (Stellaria media): Grows in dense mats in disturbed soil. Mild flavor, excellent raw in salads or cooked like spinach.
* Dandelion (Taraxacum officinale): Every part is edible. Young leaves before the flower stalk rises are the least bitter. Roots can be roasted for a coffee substitute.
* Violet leaves and flowers (Viola spp.): High in vitamin C. Flowers make a beautiful addition to salads and can be candied.

Late Spring (May–June): The Abundance Season

* Elderflower (Sambucus canadensis): Harvest the flat-topped flower clusters before the berries form. Make elderflower cordial, fritters, or dry for tea. Never eat raw elderberries — they must be cooked.
* Stinging Nettle (Urtica dioica): Wear gloves. Once blanched or dried, the sting is gone and you have one of the most nutritious greens in the forest. Rich in iron, calcium, and protein.
* Wood Sorrel (Oxalis spp.): The clover-like plant with heart-shaped leaves. Tart and lemony. Excellent in salads. Do not confuse with true clovers.

Summer (July–August): The Fruit and Seed Season

* Wild Blackberries and Raspberries: The land's most generous gift. Harvest in the morning when the dew has dried. Freeze what you cannot eat immediately.
* Pawpaw (Asimina triloba): America's forgotten tropical fruit. Grows in river bottoms and moist hollows. Harvest when the skin turns yellow-green and the fruit gives slightly to pressure.
* Sumac (Rhus glabra): The red berry clusters can be soaked in cold water to make a lemonade-like drink rich in vitamin C. Do not confuse with white-berried poison sumac.

Fall (September–November): The Root and Mushroom Season

* Jerusalem Artichoke (Helianthus tuberosus): The tubers are ready after the first frost. Nutty, crisp, and prolific. One patch will feed a family.
* Black Walnuts (Juglans nigra): Harvest in the husk before squirrels beat you to them. Wear gloves — the husks will stain your hands dark brown for weeks.
* Hickory Nuts (Carya spp.): Labor-intensive to crack, but the oil-rich meat is worth every minute.

3. The Ethics of Wild Harvest

The land is not a grocery store. It is a living system that requires your stewardship, not just your appetite. Every forager carries a responsibility to the next generation and to the ecosystem itself.

The One-Third Rule: Never harvest more than one-third of any stand. Leave enough for the plant to reproduce and for the wildlife that depends on it.

The Scatter Rule: When you harvest seeds or nuts, scatter some as you walk. You are not just a consumer — you are a planter.

The Stranger Rule: Never harvest from land you don't have permission to be on. Never harvest from roadsides where runoff carries heavy metals and pesticides. Never harvest from areas that have been sprayed.

Stewardship Note: The ramp patches in these mountains were tended by Cherokee families for generations before European settlement. When you harvest ramps, you are participating in a tradition that is thousands of years old. Honor that. Take only what you need. Leave the patch better than you found it.

4. Mushroom Foraging: The Advanced Practice

Mushrooms are the most rewarding and the most dangerous category of wild food. The rule here is even stricter: if you are not one hundred percent certain, you do not eat it. Period.

Begin with the "foolproof four" — species with no deadly look-alikes in North America:

* Giant Puffball (Calvatia gigantea): Slice it in half before eating. The interior must be pure white throughout. Any hint of gills or color means it is not a puffball.
* Chicken of the Woods (Laetiporus sulphureus): Bright orange and yellow shelf fungus on dead or dying hardwoods. No look-alikes. Tastes remarkably like chicken when young and tender.
* Hen of the Woods / Maitake (Grifola frondosa): Gray-brown overlapping fronds at the base of oaks. One of the most prized medicinal mushrooms in the world.
* Chanterelle (Cantharellus cibarius): Golden, funnel-shaped, with forked ridges (not true gills). Fruity apricot smell. The false chanterelle has true gills and an unpleasant smell.

Pro-Tip: Carry a field guide specific to your region, not a general North American guide. Mushroom distribution is highly regional. A guide written for the Pacific Northwest will mislead you in Appalachia.

5. Building Your Forager's Kit

You don't need much, but what you carry matters.

* A sharp folding knife for clean cuts that don't damage root systems
* A mesh bag or basket (never plastic bags — they trap moisture and degrade your harvest)
* A field guide specific to your region
* A hand lens (10x magnification) for examining fine details
* A small notebook to record what you find, where, and when
* Gloves for handling plants like nettles and when harvesting mushrooms (to avoid contaminating the spore print)

The most important tool is time. Slow down. Sit with a plant. Watch what insects visit it. Smell it at different times of day. The land rewards patience with knowledge that no book can fully give you.`;

const conn = await mysql.createConnection(DATABASE_URL);

try {
  const [existing] = await conn.execute(
    "SELECT id FROM blogPosts WHERE slug = ?",
    ["wild-foraging-reading-the-land"]
  );

  if (existing.length > 0) {
    console.log("Post already exists — skipping insert.");
  } else {
    console.log("Inserting second blog post (members-only)...");
    await conn.execute(
      `INSERT INTO blogPosts
        (slug, title, subtitle, author, category, content, excerpt, heroImageUrl, audioUrl, pdfUrl, pdfTitle, tags, isFree, isPublished, publishedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1, ?)`,
      [
        "wild-foraging-reading-the-land",
        "Wild Foraging: Reading the Land Before You Pick",
        "A season-by-season Appalachian foraging guide — from ramps and elderflower to mushrooms and black walnuts",
        "Nikki Russell",
        "Foraging",
        content,
        "The land is generous, but it doesn't forgive carelessness. Learn the Appalachian forager's calendar, the ethics of wild harvest, and the five plants every beginner must master before picking anything else.",
        null,
        null,
        null,
        null,
        "foraging,wild-plants,Appalachian,ramps,mushrooms,elderflower,seasonal",
        new Date("2026-03-12"),
      ]
    );
    console.log("✅ Second blog post published (members-only)!");
    console.log("   Slug: wild-foraging-reading-the-land");
    console.log("   Title: Wild Foraging: Reading the Land Before You Pick");
    console.log("   Status: MEMBERS ONLY / Published");
  }
} catch (err) {
  console.error("❌ Error:", err.message);
  throw err;
} finally {
  await conn.end();
}
