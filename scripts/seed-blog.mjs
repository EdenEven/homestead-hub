/**
 * Seed script: Insert first blog post — Traditional Appalachian Hog Butchering
 * Run: node scripts/seed-blog.mjs
 */

import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const content = `Heritage Pork: The Appalachian Manual of Traditional Butchery and Curing

1. Foundations of Appalachian Swine Processing

Down here in the mountains, a hog killing isn't just about filling the larder; it's a heritage of survival. Before everyone had a refrigerator humming in the kitchen, these techniques were the only way to make it through a hard winter. Think of a country ham as "meat-flavored Gatorade"—it's packed with the electrolytes and salt you need to keep your engine running when the work gets heavy. We aren't just making dinner; we're preserving a way of life through dehydration and salt.

This isn't a job for a lone man. To handle a "Heritage Hog" weighing anywhere from 350 to 500 lbs, you need a village. You need neighbors to help with the heavy lifting and young men who know how to handle a knife instead of a video game controller. Success is a race against the clock that starts the second that animal is dispatched.

Essential Professional Toolset

* Single Tree: A heavy-duty bar with hooks to catch the "leaders" (Achilles tendons) for hoisting.
* Bell Scrapers: Metal discs with a large side for the broad body and a small side for precision work behind the ears.
* 22-Caliber Rifle: For a swift, humane dispatch.
* 3/16" Grinder Plates: The only size that gives Appalachian sausage its proper "bite."
* Long-Blade Knives: Essential for those smooth, continuous sweeps through the muscle.

2. Thermal Preparation: The Scalding and Scraping Phase

Getting the hair off is the make-or-break moment for your hams and bacon. You're looking for a clean, white skin, but if your water temperature is off, you're in trouble. If it's too cool, the pores stay shut. If it's too hot, you'll "set" the hair so deep you'll never get it out, or worse, you'll start browning the meat before it's even out of the pelt.

To open the pores without cooking the flesh, your water must be between 148-155°F. Catch it on the "upstroke" of the heat.

We use the "Bobbing" technique here. Once you roll him in, tighten those chains so he doesn't slosh around, then keep him moving. You don't want the shoulders or hams resting on the bottom of the tub, or they'll cook against the metal. You'll know he's ready when the hair comes off in a "handful release"—just sliding out like it was never attached.

Once he's on the table, grab the bell scraper and get to work. You've got to strip away the hair, the mud, and that top layer of skin called the "skirt." If you don't get that skirt off, you aren't doing a clean job. By the time you're done, that hog should look as white as a sheet.

3. Carcass Suspension and Evisceration

As soon as the skin is clean, you have to get those internals out to stop the core heat from souring the meat at the bone. This part of the job is called "Gaveling." You find the "leaders"—those thick Achilles tendons—cut around them on both sides, and slip the Single Tree through. Use a tractor to hoist him up high and proud.

Final Cleaning and Cooling Protocol

1. Hot Water Scrape: One last pass with hot water to scrub away any remaining grit.
2. Cold Water Rinse: Douse him good with cold water to start pulling the heat out of the carcass.
3. The Torch Finish: Even the best scraper misses a few. Take a torch and singe off the "150 remaining hairs" left out of the millions.

Butcher's Note: Tie off the intestines with a piece of string before you pull the guts. You don't want anything draining back inside and ruining your "Precious Cargo." Once he's empty, hang him in a shady spot overnight. You want temperatures down in the 20s°F to "set" the fat. It makes the cutting a whole lot cleaner the next morning.

4. Primary Breakdown: The Anatomy of the Heritage Cut

We don't cut meat like a grocery store. We prioritize large, whole-muscle groups that we can encapsulate in salt. The fewer small cuts you have, the less chance for spoilage. Before you even start the big cuts, there's a tradition to uphold: the area around the tail is the first part eaten—often sliced off and enjoyed fresh or even raw on day one.

To split the hog, we use the "Chalk Line" method. Snap a line right down the center of the back. Forget the power saws; they just leave bone dust. Take a sharp knife and a hammer and "peck" your way through the rib bones and backbone.

Pro-Tip: You're looking for the "Ridge Bone." Keep the tip of your knife touching the bone all the way down the line. If the knife isn't touching bone, you're making a miscut.

The Heritage Yield

* The Prime Yields: Tenderloins (the best roast you'll ever eat) and Ribs.
* The Curing Trio:
  * Hams: Can tip the scales at 50 lbs on a big hog.
  * Shoulders: Sturdy meat, treated just like the hams.
  * Jowls: The cheek meat—don't discard these; they salt down just like midlings and are a hidden treasure.
* The Mid-Section:
  * Fatback: The top wedge of fat used to protect the tenderloins during the cure.
  * Midlings: The center cut, perfect for seasoning a pot of pinto beans.
  * Bacon/Belly: The leaner bottom section of the side.

When shaping these, use a "Long Clean Sweep." Never use short, choppy strokes. Jagged edges absorb too much salt and get "strong" or yellowed. A smooth surface takes the cure evenly.

5. Artisanal Secondary Processing: Sausage and Lard

Nothing goes to waste. The trimmings from the hams and shoulders are what make the best sausage. The "Standard Appalachian Ratio" is 1/3 fat to 2/3 lean meat.

Butcher's Note: Put your meat trimmings in the freezer for about 2 hours before grinding. If the meat is warm, it "mushes" up in the machine. You want it cold and firm so it passes through the 3/16" plate clean.

Seasoning Protocol

Sage: Primary flavor — A "heavy, heavy coat" until the meat turns green.
Old Plantation Pork Sausage Seasoning: The Foundation — Spread evenly over meat layered 2 inches deep.
Spicy Mixture: The "Kick" — A home-grown blend of Kung Pow, Thai Chili, and Cayenne peppers kneaded in.

Master Butcher Tip: Always fry a test patty before you grind the whole batch. You can always add more salt or spice, but you can never take it out once it's in.

While the sausage is being made, render down the fat for lard. The crispy bits left over are your "Cracklings"—the secret to real Appalachian cornbread.

6. The Salt Box: The Six-Week Curing Cycle

The salt box is where the magic happens. It's a simple box made of 2x10 scrap lumber, built to breathe. When you open it, there's a nasal, sensory smell of curing meat you just don't get anywhere else. The salt stays so cold it feels like a brick.

Start with a 1-inch bed of salt. Follow the Encapsulation Rule: meat must not touch other meat or the wooden sides. It has to be totally buried to cut off the oxygen. As the weather warms and cools, the meat expands and contracts—pushing moisture and blood out and pulling the salt in.

Stewardship Note: We recycle our salt for two years. After that, we take it out chunk by chunk and give it to the deer and game. Even the forest gets a taste of the harvest.
The Timeline: 6 weeks in the salt, then knock the salt off and let it "rest" for 1 week. When the meat starts to turn yellow, you know the cure has taken hold.

7. Smokehouse Preservation and Multi-Layered Bagging

We wait for a "windy March day" to finish the job. The wind helps dry the meat after we wash the residual salt off.

The Protective Glaze and Defense System

Brush on a sticky glaze of water, liquid smoke, and brown sugar (or honey). This isn't just for a golden hue; it's the "glue" for your pepper.

* Black Pepper: Rub it in thick on all sides for flavor.
* Red Pepper: Pack it heavy into the bone ends and the marrow. This is your "Dual-Pepper Defense." Flies want that marrow to lay their eggs; the heat of the red pepper ensures those larvae never survive.

Triple-Layer Bagging Process

This is "Precious Cargo," and you have to protect it from bugs for the next year.

1. First Paper Bag: Slide it on from the bottom up.
2. Second Paper Bag: Slip it over the top like a sock, overlapping the first to seal it.
3. Cotton/Pillowcase Layer: This provides the structural support. Use heavy nylon string or paracord to tie it. Don't use cheap twine—I've seen it break under the weight of a 50lb ham, and you don't want all that work hitting the floor.

Hang it in the Smokehouse for 12 to 18 months. In the summer, those barns might hit 120°F, but that salt cure will hold. Over time, a natural fungal mold will grow on the bags—that's the "good" mold that gives a true Appalachian ham its deep, complex soul. These old ways are a test of patience, but they produce a quality that modern factories can't touch.`;

const conn = await mysql.createConnection(DATABASE_URL);

try {
  // Check if post already exists
  const [existing] = await conn.execute(
    "SELECT id FROM blogPosts WHERE slug = ?",
    ["traditional-appalachian-hog-butchering"]
  );

  if (existing.length > 0) {
    console.log("Post already exists — updating...");
    await conn.execute(
      `UPDATE blogPosts SET
        title = ?,
        subtitle = ?,
        author = ?,
        category = ?,
        content = ?,
        excerpt = ?,
        heroImageUrl = ?,
        audioUrl = ?,
        pdfUrl = ?,
        pdfTitle = ?,
        tags = ?,
        isFree = 1,
        isPublished = 1,
        publishedAt = ?
      WHERE slug = ?`,
      [
        "Traditional Appalachian Hog Butchering & Curing",
        "Heritage skills passed down through the mountains — from dispatch to smokehouse",
        "Nikki Russell",
        "Butchering",
        content,
        "Down here in the mountains, a hog killing isn't just about filling the larder; it's a heritage of survival. Learn the complete Appalachian method from scalding and scraping to salt-box curing and smokehouse preservation.",
        "https://d2xsxph8kpxj0f.cloudfront.net/310519663353064793/QabQE5xjRLwvDkHphpqtoD/TraditionalAppalachianHogButcheringGuide_4224e281.webp",
        "https://d2xsxph8kpxj0f.cloudfront.net/310519663353064793/QabQE5xjRLwvDkHphpqtoD/Traditional_Appalachian_Hog_Butchering_and_Curing_155ee8b6.m4a",
        "https://d2xsxph8kpxj0f.cloudfront.net/310519663353064793/QabQE5xjRLwvDkHphpqtoD/Appalachian_Hog_Preservation_f81031a3.pdf",
        "Appalachian Hog Preservation — Complete Field Guide (PDF)",
        "butchering,hog,pork,heritage,Appalachian,curing,smokehouse,salt-box",
        new Date("2026-03-12"),
        "traditional-appalachian-hog-butchering"
      ]
    );
  } else {
    console.log("Inserting new post...");
    await conn.execute(
      `INSERT INTO blogPosts
        (slug, title, subtitle, author, category, content, excerpt, heroImageUrl, audioUrl, pdfUrl, pdfTitle, tags, isFree, isPublished, publishedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?)`,
      [
        "traditional-appalachian-hog-butchering",
        "Traditional Appalachian Hog Butchering & Curing",
        "Heritage skills passed down through the mountains — from dispatch to smokehouse",
        "Nikki Russell",
        "Butchering",
        content,
        "Down here in the mountains, a hog killing isn't just about filling the larder; it's a heritage of survival. Learn the complete Appalachian method from scalding and scraping to salt-box curing and smokehouse preservation.",
        "https://d2xsxph8kpxj0f.cloudfront.net/310519663353064793/QabQE5xjRLwvDkHphpqtoD/TraditionalAppalachianHogButcheringGuide_4224e281.webp",
        "https://d2xsxph8kpxj0f.cloudfront.net/310519663353064793/QabQE5xjRLwvDkHphpqtoD/Traditional_Appalachian_Hog_Butchering_and_Curing_155ee8b6.m4a",
        "https://d2xsxph8kpxj0f.cloudfront.net/310519663353064793/QabQE5xjRLwvDkHphpqtoD/Appalachian_Hog_Preservation_f81031a3.pdf",
        "Appalachian Hog Preservation — Complete Field Guide (PDF)",
        "butchering,hog,pork,heritage,Appalachian,curing,smokehouse,salt-box",
        new Date("2026-03-12"),
      ]
    );
  }

  console.log("✅ First blog post published successfully!");
  console.log("   Slug: traditional-appalachian-hog-butchering");
  console.log("   Title: Traditional Appalachian Hog Butchering & Curing");
  console.log("   Status: FREE / Published");
} catch (err) {
  console.error("❌ Error:", err.message);
  throw err;
} finally {
  await conn.end();
}
