/**
 * Seed script: The Schoolhouse — 5 pre-built A1HSH homestead courses
 * Run: node scripts/seed-schoolhouse.mjs
 */
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// ---- Helper: insert and return insertId ----
async function insert(table, values) {
  const [result] = await connection.execute(
    `INSERT INTO ${table} (${Object.keys(values).join(", ")}) VALUES (${Object.keys(values).map(() => "?").join(", ")})`,
    Object.values(values)
  );
  return result.insertId;
}

// ---- Clear existing pre-built courses ----
console.log("Clearing existing pre-built courses...");
await connection.execute("DELETE FROM schoolQuizQuestions WHERE quizId IN (SELECT id FROM schoolQuizzes WHERE lessonId IN (SELECT id FROM schoolLessons WHERE courseId IN (SELECT id FROM schoolCourses WHERE isPrebuilt = 1)))");
await connection.execute("DELETE FROM schoolQuizzes WHERE lessonId IN (SELECT id FROM schoolLessons WHERE courseId IN (SELECT id FROM schoolCourses WHERE isPrebuilt = 1))");
await connection.execute("DELETE FROM schoolLessons WHERE courseId IN (SELECT id FROM schoolCourses WHERE isPrebuilt = 1)");
await connection.execute("DELETE FROM schoolCourses WHERE isPrebuilt = 1");

// ============================================================
// COURSE 1: From Seed to Supper (K-5, Science + Life Skills)
// ============================================================
const c1 = await insert("schoolCourses", {
  createdBy: null,
  title: "From Seed to Supper",
  description: "A hands-on journey through the garden — from planting heirloom seeds to harvesting, cooking, and preserving your first meal. Students learn plant biology, soil science, and the joy of growing their own food.",
  subject: "Science + Life Skills",
  gradeMin: 0,
  gradeMax: 5,
  coverImageUrl: null,
  isPrebuilt: 1,
  isPublished: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const c1l1 = await insert("schoolLessons", {
  courseId: c1,
  title: "What Is a Seed?",
  objective: "Students will identify the parts of a seed and explain what a seed needs to germinate.",
  content: "## What Is a Seed?\n\nA seed is a tiny package of life. Inside every seed is an embryo — a baby plant — waiting for the right conditions to wake up and grow.\n\n### Parts of a Seed\n- **Seed coat** — the protective outer shell\n- **Embryo** — the baby plant inside\n- **Cotyledon** — stored food to feed the baby plant until it can make its own\n\n### What Does a Seed Need to Germinate?\nSeeds need three things to sprout: **water**, **warmth**, and **oxygen**. Most seeds do NOT need light to germinate — they sprout underground in the dark!\n\n### Activity\nSoak a bean seed overnight. The next day, carefully peel back the seed coat and find the embryo inside. Draw what you see and label the parts.",
  videoUrl: null,
  materials: "Bean seeds, water, paper towels, magnifying glass, pencil and paper",
  sortOrder: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const c1l2 = await insert("schoolLessons", {
  courseId: c1,
  title: "Soil: The Living Foundation",
  objective: "Students will describe what healthy soil is made of and why earthworms are important.",
  content: "## Soil: The Living Foundation\n\nSoil is not just dirt — it is a living community of billions of organisms, minerals, water, and air all working together.\n\n### What Is Soil Made Of?\n- **Minerals** — tiny broken-down rock particles\n- **Organic matter** — decomposed plants and animals (humus)\n- **Water** — fills the spaces between particles\n- **Air** — roots need oxygen to breathe\n- **Living organisms** — bacteria, fungi, earthworms, insects\n\n### Why Are Earthworms Amazing?\nEarthworms eat organic matter and leave behind castings (worm poop) that are incredibly rich in nutrients. They also tunnel through soil, creating air pockets that help roots breathe and water drain.\n\n### Activity\nDig up a small section of garden soil and count how many earthworms you find in a 12-inch square. Record your findings. More worms = healthier soil!",
  videoUrl: null,
  materials: "Garden trowel, ruler, notebook, magnifying glass",
  sortOrder: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const c1l3 = await insert("schoolLessons", {
  courseId: c1,
  title: "From Garden to Table: Harvesting and Preserving",
  objective: "Students will demonstrate how to harvest a vegetable at peak ripeness and describe one method of food preservation.",
  content: "## From Garden to Table\n\nHarvesting at the right time is an art. Pick too early and the flavor is not fully developed. Pick too late and the plant stops producing.\n\n### Signs of Ripeness\n- **Tomatoes**: fully colored, slightly soft to the touch, pulls easily from the vine\n- **Green beans**: pods are firm and snap cleanly, seeds not yet bulging\n- **Zucchini**: best at 6-8 inches — do not let them become baseball bats!\n- **Lettuce**: harvest outer leaves first, the center keeps growing\n\n### Simple Food Preservation Methods\n1. **Refrigeration** — slows bacterial growth, good for days to weeks\n2. **Freezing** — blanch vegetables first, then freeze for months\n3. **Dehydrating** — removes moisture so bacteria cannot grow; dried herbs, fruit leather\n4. **Canning** — heat processing in sealed jars; lasts 1-2 years on the shelf\n\n### Activity\nHarvest something from the garden (or buy fresh produce). Wash, prepare, and taste it fresh. Then help an adult freeze a portion. Compare the taste after it thaws.",
  videoUrl: null,
  materials: "Garden produce, cutting board, knife (adult supervision), freezer bags, blanching pot",
  sortOrder: 3,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Quiz for Lesson 1
const q1 = await insert("schoolQuizzes", { lessonId: c1l1, title: "What Is a Seed? — Quiz", createdAt: new Date() });
const seedQuestions = [
  { question: "What is the protective outer layer of a seed called?", optionA: "Embryo", optionB: "Cotyledon", optionC: "Seed coat", optionD: "Root", correctAnswer: "C", sortOrder: 1 },
  { question: "What does a seed need to germinate?", optionA: "Sunlight, soil, and wind", optionB: "Water, warmth, and oxygen", optionC: "Fertilizer, light, and cold", optionD: "Rain, darkness, and sand", correctAnswer: "B", sortOrder: 2 },
  { question: "What is the baby plant inside a seed called?", optionA: "Cotyledon", optionB: "Seed coat", optionC: "Sprout", optionD: "Embryo", correctAnswer: "D", sortOrder: 3 },
  { question: "What is the cotyledon's job?", optionA: "Protect the seed from insects", optionB: "Store food for the baby plant", optionC: "Absorb water from the soil", optionD: "Attract pollinators", correctAnswer: "B", sortOrder: 4 },
  { question: "Do most seeds need light to germinate?", optionA: "Yes, they need full sun", optionB: "Yes, but only indirect light", optionC: "No, they sprout underground in the dark", optionD: "Only if they are flower seeds", correctAnswer: "C", sortOrder: 5 },
];
for (const q of seedQuestions) {
  await insert("schoolQuizQuestions", { quizId: q1, ...q });
}

// ============================================================
// COURSE 2: The Farmer's Math (Grades 3-8, Mathematics)
// ============================================================
const c2 = await insert("schoolCourses", {
  createdBy: null,
  title: "The Farmer's Math",
  description: "Real-world mathematics through the lens of homestead life. Students calculate garden bed areas, livestock feed ratios, harvest yields, and basic farm economics — math that actually matters.",
  subject: "Mathematics",
  gradeMin: 3,
  gradeMax: 8,
  coverImageUrl: null,
  isPrebuilt: 1,
  isPublished: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
});

await insert("schoolLessons", {
  courseId: c2,
  title: "Measuring Garden Beds: Area and Perimeter",
  objective: "Students will calculate the area and perimeter of rectangular garden beds and determine how much fencing or soil amendment is needed.",
  content: "## Measuring Garden Beds\n\nBefore you plant, you need to know your numbers. How much soil do you need? How much fencing? How many seeds per row?\n\n### Key Formulas\n- **Perimeter** = 2 × (length + width) — used for fencing\n- **Area** = length × width — used for soil, mulch, and planting density\n\n### Example\nYour raised bed is 4 feet wide and 8 feet long.\n- Perimeter = 2 × (4 + 8) = 2 × 12 = **24 feet** of border boards\n- Area = 4 × 8 = **32 square feet** of soil needed\n\n### Practice Problems\n1. A garden bed is 3 ft × 12 ft. What is the area? What is the perimeter?\n2. You want to plant tomatoes 18 inches apart in a 4 ft × 8 ft bed. How many tomato plants fit?\n3. Compost costs $0.50 per square foot. How much will it cost to fill your 32 sq ft bed?",
  videoUrl: null,
  materials: "Measuring tape, graph paper, pencil, calculator",
  sortOrder: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
});

await insert("schoolLessons", {
  courseId: c2,
  title: "Feed Ratios: Fractions and Proportions",
  objective: "Students will use fractions and proportions to calculate livestock feed rations for different animals and herd sizes.",
  content: "## Feed Ratios: Fractions and Proportions\n\nEvery animal on the homestead needs a specific amount of feed based on its weight and purpose. Too little and they lose condition. Too much and you waste money.\n\n### Basic Feed Rules\n- **Chickens**: 1/4 pound of feed per bird per day\n- **Goats**: 2-4% of body weight in hay per day\n- **Pigs**: 1 pound of feed per 10 pounds of body weight per day\n\n### Example: Chicken Math\nYou have 12 chickens. Each needs 1/4 lb of feed per day.\n- Daily feed = 12 × 1/4 = **3 pounds per day**\n- Weekly feed = 3 × 7 = **21 pounds per week**\n- Monthly feed = 3 × 30 = **90 pounds per month**\n\n### Practice Problems\n1. Your goat weighs 80 lbs. She needs 3% of her body weight in hay daily. How many pounds of hay per day?\n2. A 50-lb bag of chicken feed costs $18. How many days will it last your flock of 12?\n3. You are raising 3 pigs, each weighing 100 lbs. How much feed do you need for one week?",
  videoUrl: null,
  materials: "Calculator, pencil, notebook",
  sortOrder: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
});

await insert("schoolLessons", {
  courseId: c2,
  title: "Harvest Yield and Farm Economics",
  objective: "Students will calculate harvest yields, cost per unit, and basic profit/loss for a homestead crop.",
  content: "## Harvest Yield and Farm Economics\n\nKnowing your numbers is the difference between a homestead that sustains itself and one that bleeds money.\n\n### Key Concepts\n- **Yield** — how much you harvest per plant or per square foot\n- **Cost per unit** — total cost ÷ total units produced\n- **Break-even point** — how much you need to sell to cover your costs\n\n### Example: Egg Economics\n- You have 6 laying hens\n- Each hen lays an average of 5 eggs per week\n- Weekly egg production = 6 × 5 = **30 eggs = 2.5 dozen**\n- Feed cost: $15/month ÷ 4 weeks = $3.75/week\n- Cost per dozen = $3.75 ÷ 2.5 = **$1.50 per dozen**\n- Farmers market price: $5/dozen\n- Weekly profit = (2.5 × $5) - $3.75 = $12.50 - $3.75 = **$8.75 profit per week**\n\n### Practice Problems\n1. Your tomato plants produced 45 lbs of tomatoes. Seeds cost $3, soil amendments $12, water $5. What is your cost per pound?\n2. If you sell tomatoes at $2.50/lb, what is your profit?\n3. How many pounds do you need to sell to break even?",
  videoUrl: null,
  materials: "Calculator, pencil, notebook, receipts from a real purchase if available",
  sortOrder: 3,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// ============================================================
// COURSE 3: Homestead History (Grades 5-12, History + Social Studies)
// ============================================================
const c3 = await insert("schoolCourses", {
  createdBy: null,
  title: "Homestead History: America's Self-Sufficient Roots",
  description: "Trace the arc of American self-sufficiency from colonial kitchen gardens to the Homestead Act of 1862 to the modern back-to-the-land movement. History through the lens of the people who fed themselves.",
  subject: "History + Social Studies",
  gradeMin: 5,
  gradeMax: 12,
  coverImageUrl: null,
  isPrebuilt: 1,
  isPublished: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
});

await insert("schoolLessons", {
  courseId: c3,
  title: "Colonial Self-Sufficiency: Life Before the Grocery Store",
  objective: "Students will describe how colonial American families produced their own food, clothing, and medicine, and explain why self-sufficiency was a survival skill.",
  content: "## Colonial Self-Sufficiency\n\nIn 1700s America, there were no grocery stores, no pharmacies, no hardware stores. Every family was, by necessity, a small manufacturing operation.\n\n### What Colonial Families Produced at Home\n- **Food**: kitchen gardens, orchards, livestock, hunting, fishing, foraging\n- **Preservation**: salting, smoking, drying, root cellaring, fermentation\n- **Clothing**: spinning wool and flax, weaving, sewing, tanning leather\n- **Medicine**: herbal remedies, poultices, tinctures from the kitchen garden\n- **Tools**: blacksmithing, coopering (barrel-making), woodworking\n\n### The Kitchen Garden\nThe kitchen garden was the center of colonial domestic life. It was typically managed by women and children and provided the majority of the family's vegetables, herbs, and medicinal plants. Common crops included: beans, squash, corn (the Three Sisters), cabbages, turnips, onions, and medicinal herbs like yarrow, chamomile, and comfrey.\n\n### Primary Source Discussion\n*\"A garden, a kitchen garden especially, is one of the greatest comforts of a family.\"* — Thomas Jefferson, 1811\n\n### Discussion Questions\n1. What skills would you need to survive if you had to live like a colonial family for one month?\n2. Which colonial self-sufficiency skill do you think is most valuable today? Why?\n3. What did colonial families trade or barter for things they could not produce themselves?",
  videoUrl: null,
  materials: "Notebook, pencil, optional: library access for primary source research",
  sortOrder: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
});

await insert("schoolLessons", {
  courseId: c3,
  title: "The Homestead Act of 1862: Land, Freedom, and the American Dream",
  objective: "Students will explain the purpose and impact of the Homestead Act of 1862, including who benefited, who was excluded, and its long-term consequences.",
  content: "## The Homestead Act of 1862\n\nOn May 20, 1862, President Abraham Lincoln signed the Homestead Act — one of the most consequential land laws in American history.\n\n### What It Said\nAny American citizen (or intended citizen) who was the head of a household and at least 21 years old could claim 160 acres of public land. After living on it and improving it for five years, they owned it free and clear. The filing fee was $18.\n\n### Who Claimed Land\n- Freed Black Americans seeking economic independence after the Civil War\n- European immigrants (Germans, Scandinavians, Irish) seeking a new start\n- Women — widows and single women could file claims\n- Veterans of the Civil War\n\n### The Complicated Legacy\nThe land distributed under the Homestead Act was not empty. It was Indigenous land — taken through treaties, broken promises, and military force. The Act accelerated the displacement of Native peoples from their ancestral territories.\n\nBy 1900, over 600,000 homestead claims had been filed. By the time the Act was repealed in 1976 (1986 in Alaska), 270 million acres — 10% of all US land — had been claimed.\n\n### Discussion Questions\n1. Was the Homestead Act a good law? For whom? At whose expense?\n2. How did the Act shape the demographics of the American West?\n3. What does it mean to \"own\" land? Who decides?",
  videoUrl: null,
  materials: "Notebook, pencil, map of US showing homestead territories",
  sortOrder: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
});

await insert("schoolLessons", {
  courseId: c3,
  title: "The Modern Back-to-the-Land Movement",
  objective: "Students will trace the back-to-the-land movements of the 1970s and 2020s, comparing their motivations, methods, and cultural contexts.",
  content: "## The Modern Back-to-the-Land Movement\n\nEvery generation rediscovers the land. But why? And what does it look like each time?\n\n### The 1970s Movement\nFueled by the Vietnam War, environmental awareness, and distrust of corporations, hundreds of thousands of Americans left cities to start communes, homesteads, and intentional communities. Key texts: *The Whole Earth Catalog* (1968), *Living the Good Life* by Helen and Scott Nearing.\n\nMany experiments failed — farming is hard, community is harder. But the movement left a permanent mark on American food culture: organic farming, farmers markets, and the modern natural foods industry all trace roots to this era.\n\n### The 2020s Revival\nDriven by pandemic supply chain disruptions, food price inflation, distrust of industrial food systems, and social media communities, a new generation is turning to homesteading. This time with YouTube tutorials, Instagram gardens, and online seed swaps.\n\nKey differences from the 1970s:\n- More suburban and small-acreage homesteading (backyard chickens, container gardens)\n- Faith-rooted motivations alongside environmental ones\n- Technology-assisted (apps, online communities, digital resources)\n\n### Discussion Questions\n1. What do the 1970s and 2020s movements have in common? What is different?\n2. Why do you think people turn to self-sufficiency during times of social upheaval?\n3. What does your family's homesteading journey have in common with these historical movements?",
  videoUrl: null,
  materials: "Notebook, pencil, optional: interview a grandparent or older community member about food and self-sufficiency in their childhood",
  sortOrder: 3,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// ============================================================
// COURSE 4: Nature Journals & Field Observation (Grades 2-8, Language Arts + Science)
// ============================================================
const c4 = await insert("schoolCourses", {
  createdBy: null,
  title: "Nature Journals & Field Observation",
  description: "Develop scientific observation skills and expressive writing through the practice of nature journaling. Students learn to see, record, and reflect on the natural world around them — a skill used by scientists, artists, and naturalists for centuries.",
  subject: "Language Arts + Science",
  gradeMin: 2,
  gradeMax: 8,
  coverImageUrl: null,
  isPrebuilt: 1,
  isPublished: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
});

await insert("schoolLessons", {
  courseId: c4,
  title: "The Art of Observation: Seeing What Is Really There",
  objective: "Students will practice slowing down to observe a natural object in detail, using all five senses to record what they notice.",
  content: "## The Art of Observation\n\nMost people look. Scientists and naturalists *observe*. The difference is attention.\n\n### The Five-Sense Inventory\nWhen you encounter something in nature, stop and work through all five senses:\n1. **Sight** — color, shape, texture, size, movement\n2. **Sound** — what sounds does it make? What sounds surround it?\n3. **Touch** — smooth, rough, waxy, fuzzy, warm, cold? (only touch if safe)\n4. **Smell** — earthy, sweet, sharp, musty, fresh?\n5. **Taste** — only if you are 100% certain it is safe to taste\n\n### The 10-Minute Rule\nPick one natural object — a leaf, a beetle, a patch of bark, a cloud formation. Spend 10 uninterrupted minutes observing it. Do not move on until the 10 minutes are up. You will be amazed what you notice in the last 3 minutes that you missed in the first 7.\n\n### Activity\nGo outside. Find one natural object. Spend 10 minutes observing it. Fill one full page of your nature journal with what you notice — words, sketches, measurements, questions.",
  videoUrl: null,
  materials: "Nature journal (blank or lined notebook), pencil, colored pencils, ruler, magnifying glass",
  sortOrder: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
});

await insert("schoolLessons", {
  courseId: c4,
  title: "Seasonal Records: Tracking Change Over Time",
  objective: "Students will establish a seasonal observation practice and explain why tracking change over time is a core scientific method.",
  content: "## Seasonal Records: Tracking Change Over Time\n\nA nature journal is most powerful when it becomes a record over time. One observation is interesting. A hundred observations across four seasons is science.\n\n### What to Track\n- **First sightings**: first robin of spring, first firefly of summer, first frost\n- **Phenology**: the timing of natural events — when do the apple trees bloom? When do the monarchs arrive?\n- **Weather patterns**: temperature, precipitation, wind direction\n- **Animal behavior**: nesting, migration, hibernation, feeding patterns\n- **Plant changes**: bud break, leaf-out, flowering, fruiting, dormancy\n\n### The Naturalist's Calendar\nCreate a monthly spread in your journal. Each month, record:\n- Date of first/last frost\n- Plants blooming or fruiting\n- Birds present or absent\n- Moon phases\n- Any unusual events\n\n### Why This Matters\nLong-term phenology records are among the most valuable data sets in ecology. Henry David Thoreau kept meticulous records at Walden Pond from 1851-1858. Scientists today compare his records to current observations to measure the effects of climate change.\n\n### Activity\nStart your seasonal calendar today. Record five observations from your current season. Commit to adding five observations per week for the rest of the month.",
  videoUrl: null,
  materials: "Nature journal, pencil, calendar, colored pencils",
  sortOrder: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
});

await insert("schoolLessons", {
  courseId: c4,
  title: "Writing from Nature: Descriptive Language and Scientific Precision",
  objective: "Students will write a descriptive paragraph about a natural subject using precise scientific vocabulary alongside vivid sensory language.",
  content: "## Writing from Nature\n\nThe best nature writing does two things at once: it is scientifically accurate AND it makes you feel something. Think of it as the intersection of a field guide and a poem.\n\n### Two Modes of Writing\n**Scientific mode**: precise, measurable, objective\n> *The eastern box turtle (Terrapene carolina) measured 6.2 inches in carapace length. The shell displayed a high-domed profile with yellow-orange markings on a dark brown background.*\n\n**Literary mode**: sensory, emotional, evocative\n> *The old turtle moved like a thought — slow, deliberate, unhurried by anything the world had to offer. Her shell carried the color of autumn leaves pressed into mud.*\n\n**Combined mode** (the goal):\n> *The eastern box turtle — carapace length 6.2 inches, shell domed high as a hill — moved through the leaf litter with the patience of something that has outlived every reason to hurry. Her markings, yellow-orange on dark brown, looked like fire trapped in wood.*\n\n### Activity\nChoose a natural subject from your journal. Write three versions:\n1. Pure scientific description (measurements, species name, objective observations)\n2. Pure literary description (sensory, emotional, metaphorical)\n3. Combined — blend both voices into one paragraph\n\nShare your combined version with your teacher or family.",
  videoUrl: null,
  materials: "Nature journal, pencil, field guide (optional)",
  sortOrder: 3,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// ============================================================
// COURSE 5: Food Preservation & Kitchen Chemistry (Grades 6-12, Chemistry + Home Ec)
// ============================================================
const c5 = await insert("schoolCourses", {
  createdBy: null,
  title: "Food Preservation & Kitchen Chemistry",
  description: "The science behind why food spoils and how preservation methods stop it. Students explore the chemistry of fermentation, the physics of dehydration, the microbiology of canning, and the mathematics of safe food storage — real chemistry with real-world stakes.",
  subject: "Chemistry + Home Economics",
  gradeMin: 6,
  gradeMax: 12,
  coverImageUrl: null,
  isPrebuilt: 1,
  isPublished: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
});

await insert("schoolLessons", {
  courseId: c5,
  title: "Why Food Spoils: Microbiology of Decay",
  objective: "Students will identify the four main agents of food spoilage and explain the conditions each requires to grow.",
  content: "## Why Food Spoils: Microbiology of Decay\n\nFood spoilage is not random — it follows predictable biological rules. Understanding those rules is the foundation of all food preservation.\n\n### The Four Agents of Spoilage\n\n**1. Bacteria**\nThe most dangerous spoilage agent. Bacteria like *Clostridium botulinum* (botulism), *Salmonella*, and *Listeria* can cause serious illness or death. Most bacteria thrive between 40°F and 140°F — the \"danger zone.\"\n\n**2. Molds**\nFungi that grow on the surface of food. Most molds are not dangerous (just unpleasant), but some produce mycotoxins that can cause illness. Molds need moisture and oxygen to grow.\n\n**3. Yeasts**\nSingle-celled fungi that ferment sugars into alcohol and CO2. Sometimes desirable (sourdough, wine, beer) and sometimes not (spoiled juice, fermented fruit).\n\n**4. Enzymes**\nNot living organisms — chemical catalysts naturally present in food that continue to break down tissue after harvest. This is why cut apples turn brown and why blanching vegetables before freezing is essential (heat deactivates enzymes).\n\n### The Conditions Spoilage Needs\n- **Food** (nutrients)\n- **Acidity** (most pathogens prefer neutral pH 6-7)\n- **Temperature** (40-140°F danger zone)\n- **Time** (bacteria double every 20 minutes in ideal conditions)\n- **Oxygen** (aerobic bacteria need it; anaerobic bacteria like botulism do NOT)\n- **Moisture** (water activity)\n\n### Discussion\nEvery preservation method works by eliminating one or more of these conditions. As you study each method, identify which conditions it removes.",
  videoUrl: null,
  materials: "Notebook, pencil, optional: microscope and prepared slides of bacteria/mold",
  sortOrder: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
});

await insert("schoolLessons", {
  courseId: c5,
  title: "Fermentation: Controlled Microbiology",
  objective: "Students will explain the biochemistry of lacto-fermentation and safely make a simple fermented vegetable.",
  content: "## Fermentation: Controlled Microbiology\n\nFermentation is one of humanity's oldest food preservation technologies — and one of the most fascinating examples of applied microbiology.\n\n### What Is Lacto-Fermentation?\nLacto-fermentation uses naturally occurring *Lactobacillus* bacteria (present on the surface of all vegetables) to convert sugars into lactic acid. The lactic acid lowers the pH of the food, creating an environment too acidic for harmful bacteria to survive.\n\n**The Chemistry**:\n> C₆H₁₂O₆ → 2 C₃H₆O₃\n> Glucose → Lactic Acid\n\n### Why Salt?\nSalt (sodium chloride) draws water out of vegetables through osmosis, creating a brine. The brine provides the anaerobic (oxygen-free) environment that *Lactobacillus* needs. Salt also inhibits harmful bacteria while allowing the salt-tolerant *Lactobacillus* to thrive.\n\n### Simple Sauerkraut Recipe\n**Ingredients**: 1 medium head of cabbage, 1 tablespoon non-iodized salt per pound of cabbage\n\n1. Shred cabbage thinly\n2. Weigh cabbage and calculate salt (1 tbsp per pound)\n3. Massage salt into cabbage for 10 minutes until it releases liquid\n4. Pack tightly into a clean mason jar, pressing down until liquid covers cabbage\n5. Cover loosely (not airtight) and leave at room temperature (65-75°F)\n6. Taste after 3 days. Fully fermented in 1-4 weeks depending on temperature\n\n### Safety Note\nProper lacto-fermentation is very safe — the acid environment prevents pathogen growth. Signs of a healthy ferment: bubbling, sour smell, tangy taste. Signs of a problem: pink/black/fuzzy mold on the surface (discard and start over).",
  videoUrl: null,
  materials: "Cabbage, non-iodized salt, kitchen scale, mason jar, cutting board, knife (adult supervision for younger students)",
  sortOrder: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
});

await insert("schoolLessons", {
  courseId: c5,
  title: "Water Bath Canning: The Science of Heat Processing",
  objective: "Students will explain the scientific principles behind water bath canning and identify which foods are safe to water bath can and why.",
  content: "## Water Bath Canning: The Science of Heat Processing\n\nCanning is not just cooking food in a jar. It is a precisely calibrated heat-processing system designed to destroy pathogens and create a vacuum seal that prevents recontamination.\n\n### The Science\n**Heat destroys pathogens**: Boiling water (212°F at sea level) kills most bacteria, molds, and yeasts. The processing time in tested recipes is calculated to ensure the center of the jar reaches a safe temperature for long enough to destroy pathogens.\n\n**The vacuum seal**: As the jar cools, the contents contract, creating a partial vacuum that pulls the lid down tight. This prevents new microorganisms from entering.\n\n### The Critical Rule: pH and Acidity\nWater bath canning is ONLY safe for **high-acid foods** (pH 4.6 or below). High acid inhibits *Clostridium botulinum* spores from germinating.\n\n**Safe for water bath canning** (pH ≤ 4.6):\n- Most fruits and fruit products\n- Tomatoes with added acid (lemon juice or citric acid)\n- Pickles (with proper vinegar ratio)\n- Jams and jellies\n\n**NOT safe for water bath canning** (requires pressure canning):\n- All vegetables (green beans, corn, carrots, etc.)\n- Meats and poultry\n- Fish and seafood\n- Low-acid tomato products without added acid\n\n### Why Pressure Canning for Low-Acid Foods?\n*C. botulinum* spores can survive boiling (212°F). Pressure canning raises the temperature to 240°F — hot enough to destroy the spores. Never water bath can low-acid foods. Botulism is odorless, colorless, and can be fatal.\n\n**Always use tested recipes from the USDA Complete Guide to Home Canning or the Ball Blue Book.**",
  videoUrl: null,
  materials: "Notebook, pencil, Ball Blue Book or USDA canning guide (reference), optional: demonstration of water bath canning setup",
  sortOrder: 3,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Quiz for Food Preservation Course Lesson 1
const q5 = await insert("schoolQuizzes", { lessonId: c5 - 2, title: "Why Food Spoils — Quiz", createdAt: new Date() });

// Get the actual lesson ID for the first lesson of course 5
const [c5lessons] = await connection.execute("SELECT id FROM schoolLessons WHERE courseId = ? ORDER BY sortOrder LIMIT 1", [c5]);
const c5l1id = c5lessons[0]?.id;

if (c5l1id) {
  // Update the quiz to point to the correct lesson
  await connection.execute("UPDATE schoolQuizzes SET lessonId = ? WHERE id = ?", [c5l1id, q5]);
  
  const spoilageQuestions = [
    { question: "What is the temperature 'danger zone' for bacterial growth in food?", optionA: "0°F to 32°F", optionB: "40°F to 140°F", optionC: "100°F to 200°F", optionD: "32°F to 40°F", correctAnswer: "B", sortOrder: 1 },
    { question: "Which agent of spoilage is responsible for botulism?", optionA: "Mold", optionB: "Yeast", optionC: "Bacteria", optionD: "Enzymes", correctAnswer: "C", sortOrder: 2 },
    { question: "Why do you blanch vegetables before freezing them?", optionA: "To add flavor", optionB: "To deactivate enzymes that cause browning", optionC: "To kill all bacteria", optionD: "To remove pesticides", correctAnswer: "B", sortOrder: 3 },
    { question: "Which condition do most spoilage bacteria NOT need to survive?", optionA: "Food (nutrients)", optionB: "Moisture", optionC: "Extreme cold (below 0°F)", optionD: "Temperature in the danger zone", correctAnswer: "C", sortOrder: 4 },
    { question: "Botulism bacteria are dangerous because they are:", optionA: "Aerobic — they need oxygen to grow", optionB: "Anaerobic — they grow WITHOUT oxygen, making sealed jars dangerous", optionC: "Only found in meat, never vegetables", optionD: "Easily detected by smell and color", correctAnswer: "B", sortOrder: 5 },
  ];
  for (const q of spoilageQuestions) {
    await insert("schoolQuizQuestions", { quizId: q5, ...q });
  }
}

await connection.end();
console.log("✅ Schoolhouse seed complete! 5 courses, 15 lessons, and quizzes loaded.");
