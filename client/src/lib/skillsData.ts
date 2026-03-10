/*
 * Skills Data — Homestead Hub
 * All 9 skill modules with full content, steps, tips, and resources
 */

export interface SkillStep {
  title: string;
  desc: string;
}

export interface SkillTip {
  label: string;
  text: string;
}

export interface SkillResource {
  title: string;
  url: string;
  type: "guide" | "video" | "tool" | "organization";
}

export interface Skill {
  slug: string;
  title: string;
  icon: string;
  tagline: string;
  intro: string;
  color: string;
  bgColor: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  timeToLearn: string;
  steps: SkillStep[];
  tips: SkillTip[];
  resources: SkillResource[];
  safetyNotes?: string;
  seasonalNotes?: string;
}

export const skills: Skill[] = [
  {
    slug: "butchering",
    title: "Butchering",
    icon: "🔪",
    tagline: "From harvest to table — process your own meat with skill and respect.",
    intro: "Butchering is one of the most empowering skills a homesteader can learn. Understanding how to properly process livestock and wild game means you control your food supply from start to finish. This module covers everything from humane harvesting to final cuts, including safe handling, tool care, and preservation.",
    color: "oklch(0.38 0.12 25)",
    bgColor: "oklch(0.96 0.01 25)",
    difficulty: "Intermediate",
    timeToLearn: "2–4 weeks of practice",
    steps: [
      { title: "Gather Your Tools", desc: "Sharp boning knife, breaking knife, meat saw or cleaver, gambrel hooks, food-safe gloves, cutting board, and a clean work surface. Sharp tools are safer than dull ones." },
      { title: "Humane Harvesting", desc: "Learn the most humane methods for each animal type. For poultry: cervical dislocation or sharp knife. For larger livestock: consult a veterinarian or experienced mentor for your first time." },
      { title: "Bleeding & Skinning", desc: "Proper bleeding prevents spoilage. Skinning technique varies by animal — deer and goats skin differently than pigs. Work from the legs down, keeping the hide clean." },
      { title: "Evisceration", desc: "Remove organs carefully to avoid contaminating the meat. Save the heart, liver, and kidneys — they are highly nutritious. Learn to identify healthy vs. diseased organs." },
      { title: "Quartering & Breaking Down", desc: "Quarter large animals for easier handling. Learn the primal cuts: shoulder, loin, rib, round, and flank. Each cut has different cooking applications." },
      { title: "Aging the Meat", desc: "Dry aging in a cool, controlled environment (34–38°F) for 7–21 days improves tenderness and flavor. Wet aging in vacuum bags is faster and more accessible." },
      { title: "Final Cuts & Packaging", desc: "Trim, portion, and wrap cuts for storage. Use freezer paper or vacuum sealing. Label with cut type and date. Properly stored meat lasts 6–12 months frozen." },
    ],
    tips: [
      { label: "Temperature Control", text: "Keep meat below 40°F at all times during processing. Bacteria multiply rapidly between 40–140°F." },
      { label: "Knife Maintenance", text: "A sharp knife requires less force and causes cleaner cuts. Hone your blade before every session and sharpen regularly." },
      { label: "Waste Nothing", text: "Bones make excellent stock. Fat renders into lard or tallow. Organs are nutrient-dense. Scraps become dog food or compost." },
      { label: "Start Small", text: "Begin with poultry before moving to larger animals. Chickens and rabbits are forgiving for beginners." },
    ],
    resources: [
      { title: "The Complete Guide to Home Butchering", url: "https://www.motherearthnews.com/real-food/home-butchering-zmaz81ndzgoe/", type: "guide" },
      { title: "USDA Meat Processing Safety Guidelines", url: "https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/meat", type: "guide" },
      { title: "Butcher Box Blog — Cuts Guide", url: "https://www.butcherbox.com/butcher-box-blog/", type: "guide" },
    ],
    safetyNotes: "Always work with clean hands and sanitized tools. Never process sick animals. Check local regulations regarding home slaughter — some states have specific rules about on-farm processing.",
  },
  {
    slug: "foraging",
    title: "Foraging",
    icon: "🌿",
    tagline: "Nature's grocery store is open year-round — if you know where to look.",
    intro: "Foraging is the ancient skill of identifying and harvesting wild edible and medicinal plants. It connects you deeply to your local ecosystem and provides free, nutrient-dense food. This module covers identification basics, seasonal guides, the most common edibles by region, and critical safety rules.",
    color: "oklch(0.32 0.08 145)",
    bgColor: "oklch(0.95 0.02 145)",
    difficulty: "Beginner",
    timeToLearn: "Ongoing — seasons teach you",
    steps: [
      { title: "Get a Regional Field Guide", desc: "Start with a guide specific to your region. 'Foraging the Mountain West,' 'Midwest Foraging,' or 'A Field Guide to Edible Wild Plants' by Lee Allen Peterson are excellent starting points." },
      { title: "Learn the Rule of Three", desc: "Identify three distinct features before harvesting: leaf shape, stem structure, and habitat. Never rely on a single characteristic. When in doubt, don't eat it." },
      { title: "Start with Unmistakable Plants", desc: "Begin with plants that have no dangerous lookalikes: dandelion, cattail, blackberries, elderberries, lamb's quarters, and wood sorrel. Build confidence before tackling mushrooms." },
      { title: "Learn Your Seasons", desc: "Spring: tender greens, ramps, morels. Summer: berries, flowers, purslane. Fall: nuts, roots, late mushrooms. Winter: evergreen teas, inner bark, dried seeds." },
      { title: "Understand Habitat", desc: "Different plants grow in different conditions. Watercress near streams, chanterelles under oaks, ramps in moist hardwood forests. Learn to read the landscape." },
      { title: "Ethical Harvesting", desc: "Take no more than 1/3 of any stand. Leave roots intact when possible. Spread seeds as you walk. Never strip a patch bare — you need it to be there next year." },
      { title: "Mushrooms: Advanced Track", desc: "Mushrooms require extra caution. Start with foolproof species: chicken of the woods, giant puffballs, chanterelles. Always spore print and cross-reference multiple sources." },
    ],
    tips: [
      { label: "Photograph Everything", text: "Before harvesting, photograph the plant from multiple angles. Review at home against your field guide." },
      { label: "Avoid Roadsides", text: "Plants near roads absorb heavy metals and exhaust. Forage at least 100 feet from any road." },
      { label: "Taste Test Protocol", text: "For unknown plants: crush a leaf and smell it. Touch to lip — wait 15 minutes. Touch to tongue — wait 15 minutes. Chew a small piece — spit out. Wait 8 hours before eating." },
      { label: "Join a Local Group", text: "Foraging walks with experienced guides accelerate learning dramatically. Search for local mycological societies or wild food groups." },
    ],
    resources: [
      { title: "Eat The Weeds — Free Online Guide", url: "https://www.eattheweeds.com/", type: "guide" },
      { title: "iNaturalist — Plant ID App", url: "https://www.inaturalist.org/", type: "tool" },
      { title: "USDA Plants Database", url: "https://plants.usda.gov/", type: "guide" },
      { title: "North American Mycological Association", url: "https://namyco.org/", type: "organization" },
    ],
    safetyNotes: "NEVER eat anything you cannot identify with 100% certainty. Many deadly plants look similar to edible ones. Poison hemlock resembles wild carrot. Death cap mushrooms resemble edible species. When in doubt, throw it out.",
    seasonalNotes: "Spring is the most abundant season for greens. Fall is best for mushrooms and nuts. Winter foraging is possible but requires more knowledge. Keep a foraging journal to track what grows where and when.",
  },
  {
    slug: "building",
    title: "Building",
    icon: "🪵",
    tagline: "Build with your hands what lasts for generations.",
    intro: "Building skills are foundational to homestead life. From fencing to outbuildings, root cellars to rainwater systems — the ability to construct and repair structures saves money and builds resilience. This module covers basic construction principles, common homestead structures, and the tools you need.",
    color: "oklch(0.35 0.06 55)",
    bgColor: "oklch(0.96 0.02 55)",
    difficulty: "Intermediate",
    timeToLearn: "Months to years — build as you go",
    steps: [
      { title: "Master Basic Carpentry", desc: "Learn to measure accurately, cut straight, and join wood securely. Practice on small projects: a raised garden bed, a simple shelf, a chicken nesting box." },
      { title: "Understand Load-Bearing Principles", desc: "Learn the difference between load-bearing and non-load-bearing walls. Understand how weight transfers through a structure. This is essential before building anything you'll stand under." },
      { title: "Post & Beam Construction", desc: "The classic homestead building method. Vertical posts carry horizontal beams, which carry the roof. Simple, strong, and repairable with basic tools." },
      { title: "Build a Chicken Coop", desc: "The perfect starter project. Requires framing, roofing, ventilation, and pest-proofing. Teaches you most of the skills you'll use on larger structures." },
      { title: "Fencing Systems", desc: "Learn woven wire, barbed wire, electric fence, and wooden rail fencing. Each has different applications for different animals and terrain." },
      { title: "Root Cellar Construction", desc: "A root cellar maintains 32–40°F year-round for food storage. Can be built into a hillside, under a barn, or as a standalone structure. Requires drainage and ventilation planning." },
      { title: "Roofing Basics", desc: "Metal roofing is the homesteader's choice: long-lasting, fire-resistant, and excellent for rainwater collection. Learn to install standing seam or corrugated metal panels." },
    ],
    tips: [
      { label: "Measure Twice, Cut Once", text: "This cliché exists because it's true. Wasted lumber is wasted money. Mark your cuts clearly and double-check before sawing." },
      { label: "Build for Your Climate", text: "A structure in Minnesota needs different insulation, snow load capacity, and foundation depth than one in Georgia." },
      { label: "Salvage and Reuse", text: "Barn wood, old windows, used metal roofing, and reclaimed lumber are often free or cheap. Learn to evaluate salvaged materials for structural soundness." },
      { label: "Check Local Codes", text: "Many rural areas have minimal building codes, but some structures require permits. Know your county's rules before you build." },
    ],
    resources: [
      { title: "Timber Framers Guild", url: "https://tfguild.org/", type: "organization" },
      { title: "Mother Earth News — Building Guides", url: "https://www.motherearthnews.com/diy/", type: "guide" },
      { title: "USDA Rural Development Housing Programs", url: "https://www.rd.usda.gov/programs-services/single-family-housing-programs", type: "organization" },
    ],
  },
  {
    slug: "food-preservation",
    title: "Food Preservation",
    icon: "🫙",
    tagline: "Capture the harvest. Eat well all winter.",
    intro: "Food preservation is the backbone of homestead self-sufficiency. When your garden produces more than you can eat fresh, preservation methods let you bank that abundance for the months ahead. This module covers water bath canning, pressure canning, fermentation, dehydrating, smoking, and root cellaring.",
    color: "oklch(0.45 0.10 65)",
    bgColor: "oklch(0.97 0.02 65)",
    difficulty: "Beginner",
    timeToLearn: "1–2 weeks to basics",
    steps: [
      { title: "Water Bath Canning", desc: "Safe for high-acid foods: tomatoes, fruits, pickles, jams, and jellies. Requires mason jars, lids, a large pot, and a jar lifter. Follow tested USDA recipes exactly — this is not the place to improvise." },
      { title: "Pressure Canning", desc: "Required for low-acid foods: vegetables, meats, beans, and soups. A pressure canner reaches 240°F, killing botulism spores that water bath canning cannot. Essential for a complete pantry." },
      { title: "Lacto-Fermentation", desc: "The oldest preservation method. Salt creates an anaerobic environment where beneficial bacteria thrive and pathogens cannot. Sauerkraut, kimchi, pickles, kvass, and fermented hot sauce are all beginner-friendly." },
      { title: "Dehydrating", desc: "Remove moisture to prevent microbial growth. A food dehydrator or low oven (150–200°F) works well. Dehydrate fruits, vegetables, herbs, and jerky. Store in airtight containers away from light." },
      { title: "Smoking", desc: "Cold smoking (below 90°F) flavors and partially preserves. Hot smoking (225–275°F) cooks and preserves. Cure meats with salt before smoking for longer shelf life." },
      { title: "Root Cellaring", desc: "Cool, dark, humid storage for root vegetables, apples, and squash. Ideal temperature: 32–40°F with 90–95% humidity. Many vegetables store for 4–6 months this way." },
      { title: "Freezing", desc: "The simplest method. Blanch vegetables before freezing to preserve color and texture. Vacuum sealing extends freezer life significantly. Organize by date — first in, first out." },
    ],
    tips: [
      { label: "Use Tested Recipes", text: "For canning, always use USDA or Ball Blue Book tested recipes. Untested recipes can result in under-processing and dangerous botulism growth." },
      { label: "Label Everything", text: "Date and label every jar, bag, and container. You will not remember what that mystery jar is in February." },
      { label: "Rotate Your Stock", text: "Use the oldest preserved food first. Practice 'first in, first out' to prevent waste and ensure food safety." },
      { label: "Salt Quality Matters", text: "Use non-iodized canning salt for fermentation and pickling. Iodized salt can inhibit fermentation and cause discoloration." },
    ],
    resources: [
      { title: "National Center for Home Food Preservation", url: "https://nchfp.uga.edu/", type: "guide" },
      { title: "Ball Blue Book of Canning", url: "https://www.freshpreserving.com/", type: "guide" },
      { title: "Fermentation Association", url: "https://fermentation.org/", type: "organization" },
    ],
    safetyNotes: "Botulism is odorless and tasteless. Never taste-test canned goods to check for spoilage. Discard any jar with a bulging lid, off smell, or spurting liquid. When in doubt, throw it out.",
  },
  {
    slug: "gardening",
    title: "Gardening",
    icon: "🌱",
    tagline: "Feed your family from the ground up.",
    intro: "A productive garden is the heart of every homestead. Whether you have a quarter acre or a few raised beds, understanding soil, seeds, seasons, and plant relationships will multiply your yields and reduce your grocery bill. This module covers soil building, planting calendars, companion planting, seed saving, and pest management.",
    color: "oklch(0.38 0.09 140)",
    bgColor: "oklch(0.96 0.02 140)",
    difficulty: "Beginner",
    timeToLearn: "One full growing season",
    steps: [
      { title: "Know Your Zone", desc: "Find your USDA Plant Hardiness Zone. This determines your frost dates, which dictate when to start seeds, transplant, and expect your last and first frosts. Everything else flows from this." },
      { title: "Build Your Soil", desc: "Healthy soil = healthy plants. Add compost, aged manure, and cover crops. Test your soil pH (most vegetables prefer 6.0–7.0). Amend based on test results, not guesswork." },
      { title: "Plan Your Layout", desc: "Map your garden before planting. Consider sun exposure (most vegetables need 6–8 hours), water access, and crop rotation. Tall plants should not shade shorter ones." },
      { title: "Start Seeds Indoors", desc: "Start tomatoes, peppers, and eggplant 6–8 weeks before last frost. Use seed starting mix, not garden soil. Provide adequate light — a south-facing window or grow lights." },
      { title: "Companion Planting", desc: "Three Sisters: corn, beans, and squash support each other. Basil repels aphids near tomatoes. Marigolds deter nematodes. Nasturtiums attract aphids away from vegetables (trap crop)." },
      { title: "Water Management", desc: "Deep, infrequent watering encourages deep roots. Drip irrigation is most efficient. Mulch heavily to retain moisture and suppress weeds. Water at the base, not the leaves." },
      { title: "Seed Saving", desc: "Save seeds from open-pollinated (not hybrid) varieties. Let fruits fully ripen on the plant. Dry seeds thoroughly before storing in cool, dark, dry conditions. Label with variety and year." },
    ],
    tips: [
      { label: "Compost Everything", text: "Kitchen scraps, garden waste, and animal manure all become free fertilizer. A simple three-bin compost system produces rich compost in 3–6 months." },
      { label: "Keep a Garden Journal", text: "Record what you planted, when, where, and how it performed. This data becomes invaluable for planning future seasons." },
      { label: "Succession Planting", text: "Plant fast-growing crops (lettuce, radishes) every 2–3 weeks for continuous harvest rather than one big glut." },
      { label: "Perennials Pay Off", text: "Asparagus, rhubarb, herbs, and fruit trees produce for years with minimal replanting. Invest in perennials early." },
    ],
    resources: [
      { title: "USDA Plant Hardiness Zone Map", url: "https://planthardiness.ars.usda.gov/", type: "tool" },
      { title: "Seed Savers Exchange", url: "https://seedsavers.org/", type: "organization" },
      { title: "Old Farmer's Almanac Planting Calendar", url: "https://www.almanac.com/gardening/planting-calendar", type: "tool" },
    ],
    seasonalNotes: "Spring: start seeds, prepare beds, plant cool-season crops. Summer: maintain, harvest, plant fall crops. Fall: harvest, preserve, plant garlic, cover crop. Winter: plan, order seeds, maintain tools.",
  },
  {
    slug: "hunting-gaming",
    title: "Hunting & Gaming",
    icon: "🦌",
    tagline: "Ethical harvest, wild protein, and deep connection to the land.",
    intro: "Hunting is one of the most direct ways to source your own food. It requires patience, skill, knowledge of animal behavior, and a deep respect for wildlife. This module covers licensing, seasons by state, field dressing, meat care, and the ethics of ethical harvest.",
    color: "oklch(0.30 0.07 50)",
    bgColor: "oklch(0.96 0.02 50)",
    difficulty: "Intermediate",
    timeToLearn: "One full hunting season",
    steps: [
      { title: "Get Licensed", desc: "Every state requires a hunting license. Most require a hunter safety course for first-time hunters. Check your state's fish and wildlife agency website for current requirements, seasons, and bag limits." },
      { title: "Know Your Seasons", desc: "Deer: typically October–January. Turkey: spring and fall. Waterfowl: fall and winter (federal regulations apply). Small game: varies widely. Always verify current season dates — they change annually." },
      { title: "Scout Your Land", desc: "Learn animal movement patterns before season opens. Look for tracks, trails, rubs, scrapes, and feeding areas. Trail cameras are invaluable for pattern recognition." },
      { title: "Ethical Shot Placement", desc: "A clean, ethical kill is the goal. For deer: aim for the heart-lung area behind the front shoulder. Practice at the range until you are confident at your intended hunting distance." },
      { title: "Field Dressing", desc: "Process the animal as quickly as possible after harvest to prevent meat spoilage. Remove the entrails in the field. Keep the carcass cool. Hang in a cool location or get to a processor within a few hours in warm weather." },
      { title: "Meat Care in the Field", desc: "Cool the carcass quickly. In warm weather, pack the body cavity with ice. In cold weather, prop the cavity open for airflow. Avoid letting the meat sit in direct sun." },
      { title: "Processing Your Harvest", desc: "Learn to break down your own deer or other game. See the Butchering module for detailed guidance. Many hunters process their own meat to save money and ensure quality." },
    ],
    tips: [
      { label: "Hunter Safety First", text: "Treat every firearm as if it is loaded. Never point at anything you don't intend to shoot. Know your target and what's beyond it." },
      { label: "Respect the Animal", text: "Use as much of the animal as possible. Waste is disrespectful to the animal and to the land. Organ meats, bones for stock, and hide for leather are all valuable." },
      { label: "Hunt with Mentors", text: "Your first hunting seasons are dramatically better with an experienced mentor. Local hunting clubs and state hunter education programs often pair beginners with experienced hunters." },
      { label: "Know Your Regulations", text: "Bag limits, legal shooting hours, weapon restrictions, and tagging requirements vary by state and species. Violations carry serious penalties." },
    ],
    resources: [
      { title: "State Fish & Wildlife Agencies Directory", url: "https://www.fishwildlife.org/afwa-informs/state-fish-wildlife-agencies", type: "organization" },
      { title: "National Deer Association", url: "https://deerassociation.com/", type: "organization" },
      { title: "Hunter Education — International Hunter Education Association", url: "https://www.ihea-usa.org/", type: "organization" },
    ],
    safetyNotes: "Always wear hunter orange during firearm seasons. Never hunt under the influence of alcohol or drugs. Inform someone of your hunting location and expected return time.",
  },
  {
    slug: "animal-husbandry",
    title: "Animal Husbandry",
    icon: "🐓",
    tagline: "Raise animals well — they will provide for you in return.",
    intro: "Keeping livestock is one of the most rewarding aspects of homesteading. Animals provide meat, eggs, milk, fiber, and labor — and they enrich the land through their manure. This module covers the most common homestead animals: chickens, goats, pigs, and cattle, with guidance on housing, feeding, health, and breeding.",
    color: "oklch(0.42 0.08 80)",
    bgColor: "oklch(0.97 0.02 80)",
    difficulty: "Intermediate",
    timeToLearn: "Ongoing — animals teach you daily",
    steps: [
      { title: "Start with Chickens", desc: "Chickens are the gateway livestock. They provide eggs and meat, require minimal space, and are relatively forgiving of beginner mistakes. Start with 4–6 hens for a family of four." },
      { title: "Housing Requirements", desc: "Chickens need 4 sq ft per bird inside, 10 sq ft outside. Goats need 15–20 sq ft per animal in a dry, draft-free shelter. Pigs need 50–100 sq ft. All housing must be predator-proof." },
      { title: "Feed and Water", desc: "Provide fresh, clean water daily — animals drink more than you expect. Feed quality directly impacts production. Layer hens need calcium (oyster shell). Goats need minerals. Pigs are omnivores and can eat kitchen scraps." },
      { title: "Health Monitoring", desc: "Learn what 'normal' looks like for each species. Healthy animals are alert, eating well, and have clear eyes and normal droppings. Establish a relationship with a large animal vet before you have an emergency." },
      { title: "Parasite Management", desc: "Internal parasites (worms) are the number one health challenge for goats and sheep. Learn FAMACHA scoring for goats. Rotate pastures to break parasite cycles. Avoid overuse of dewormers to prevent resistance." },
      { title: "Breeding Basics", desc: "Understand the reproductive cycles of your animals. Chickens lay without a rooster. Goats cycle in fall for spring kids. Pigs can breed year-round. Plan breeding to align with your needs and resources." },
      { title: "Slaughter and Processing", desc: "Raising animals for meat means eventually processing them. See the Butchering module. Chickens at 8–12 weeks (meat breeds), pigs at 6–8 months, beef cattle at 18–24 months." },
    ],
    tips: [
      { label: "Predator Protection", text: "Predators will find your animals. Hardware cloth (not chicken wire) on coops, electric fencing, and livestock guardian dogs are your best defenses." },
      { label: "Pasture Rotation", text: "Never keep animals on the same pasture continuously. Rotate every 2–4 weeks to prevent overgrazing and parasite buildup." },
      { label: "Keep Records", text: "Track births, deaths, health treatments, feed costs, and production. This data helps you make better management decisions and identify problems early." },
      { label: "Build Community", text: "Connect with other livestock owners in your area. They are your best resource for local vet recommendations, breed advice, and emergency help." },
    ],
    resources: [
      { title: "American Livestock Breeds Conservancy", url: "https://livestockconservancy.org/", type: "organization" },
      { title: "Storey's Guide to Raising Chickens", url: "https://www.storey.com/", type: "guide" },
      { title: "eXtension — Livestock Resources", url: "https://extension.org/livestock/", type: "guide" },
    ],
  },
  {
    slug: "water-systems",
    title: "Water Systems",
    icon: "💧",
    tagline: "Water is life. Secure yours before you need it.",
    intro: "Water security is the most critical infrastructure on any homestead. This module covers rainwater harvesting, well systems, spring development, filtration, gray water management, and water storage — everything you need to ensure clean, reliable water independent of municipal systems.",
    color: "oklch(0.40 0.10 220)",
    bgColor: "oklch(0.96 0.02 220)",
    difficulty: "Intermediate",
    timeToLearn: "2–4 weeks to plan, months to build",
    steps: [
      { title: "Assess Your Water Sources", desc: "Identify all potential water sources on your property: rainfall, springs, streams, ponds, and groundwater. Calculate your household's daily water needs (50–100 gallons per person per day for full homestead use)." },
      { title: "Rainwater Harvesting", desc: "Collect rain from your roof into storage tanks. A 1,000 sq ft roof collects 600 gallons per inch of rain. Use first-flush diverters to discard the first dirty runoff. Filter before drinking. Check your state's laws — some states restrict rainwater collection." },
      { title: "Storage Tanks", desc: "Food-grade poly tanks (250–2,500 gallon IBC totes) are cost-effective. Bury tanks for temperature stability. Install overflow pipes and screens to prevent mosquito breeding. Elevate tanks for gravity-fed pressure." },
      { title: "Well Systems", desc: "Drilled wells reach deeper, cleaner water than dug wells. Requires a licensed well driller in most states. Install a hand pump backup for power outages. Test your well water annually for bacteria and minerals." },
      { title: "Spring Development", desc: "A natural spring is a homesteader's treasure. Develop it by digging out the source, installing a collection box with overflow, and piping water by gravity to your homestead. Protect the spring from animal contamination." },
      { title: "Filtration Systems", desc: "Even clean-looking water may contain bacteria, parasites, or chemicals. A multi-stage system: sediment filter → activated carbon filter → UV sterilizer or ceramic filter. Berkey filters are popular for off-grid use." },
      { title: "Gray Water Management", desc: "Gray water (from sinks, showers, laundry) can be reused for irrigation. Simple systems direct gray water to fruit trees or garden beds. Avoid gray water on edible parts of food plants." },
    ],
    tips: [
      { label: "Calculate Before You Build", text: "Know your daily water needs before sizing your system. A family of four uses 200–400 gallons per day with livestock and garden." },
      { label: "Test Your Water", text: "Test any water source before drinking. Basic test kits are available at hardware stores. Send samples to a lab for comprehensive testing." },
      { label: "Redundancy Saves Lives", text: "Never rely on a single water source. Have a backup: if your well fails, have rainwater storage. If power fails, have a hand pump." },
      { label: "State Regulations", text: "Rainwater collection is regulated differently in every state. Texas actively encourages it. Colorado has historically restricted it (though laws are changing). Know your state's rules." },
    ],
    resources: [
      { title: "Rainwater Harvesting for Drylands and Beyond", url: "https://www.harvestingrainwater.com/", type: "guide" },
      { title: "EPA Rainwater Harvesting Guide", url: "https://www.epa.gov/sites/default/files/2015-11/documents/rainharvesting.pdf", type: "guide" },
      { title: "National Ground Water Association", url: "https://www.ngwa.org/", type: "organization" },
    ],
    safetyNotes: "Never drink untreated water from any source without testing and filtration. Giardia and other pathogens are common in natural water sources. Boiling kills most pathogens but does not remove chemical contaminants.",
  },
  {
    slug: "solar-energy",
    title: "Solar Energy",
    icon: "☀️",
    tagline: "Free energy from the sky — harness it for your homestead.",
    intro: "Small-scale solar power is increasingly accessible and affordable. A well-designed solar system can power your lights, refrigeration, water pump, and communications — reducing or eliminating your dependence on the grid. This module covers system sizing, component selection, installation basics, battery storage, and maintenance.",
    color: "oklch(0.65 0.14 80)",
    bgColor: "oklch(0.97 0.03 80)",
    difficulty: "Intermediate",
    timeToLearn: "2–6 weeks to plan and install",
    steps: [
      { title: "Calculate Your Power Needs", desc: "List every electrical device you want to power. Find the wattage (on the label or manual). Multiply watts × hours per day = watt-hours per day. Add 20% buffer. This is your daily energy budget." },
      { title: "Understand System Components", desc: "Solar panels (generate power) → Charge controller (regulates charging) → Battery bank (stores power) → Inverter (converts DC to AC for standard appliances) → Loads (your devices)." },
      { title: "Choose Your Panel Type", desc: "Monocrystalline panels are most efficient (20–22%) and best for limited space. Polycrystalline are slightly less efficient but cheaper. Thin-film is flexible but less efficient. Monocrystalline is the standard recommendation." },
      { title: "Battery Bank Sizing", desc: "Lead-acid batteries are affordable but require maintenance and ventilation. Lithium iron phosphate (LiFePO4) batteries are more expensive but last longer, require no maintenance, and are safer. Size your bank for 2–3 days of autonomy without sun." },
      { title: "Charge Controller Selection", desc: "MPPT (Maximum Power Point Tracking) controllers are more efficient than PWM and recommended for any system over 200W. Size your controller for 125% of your panel array's maximum current." },
      { title: "Inverter Selection", desc: "Pure sine wave inverters are required for sensitive electronics, motors, and appliances. Modified sine wave inverters are cheaper but can damage some devices. Size for your peak load, not average load." },
      { title: "Installation and Safety", desc: "Mount panels at the optimal angle for your latitude (roughly equal to your latitude in degrees). Use proper wire gauges to prevent voltage drop and fire hazard. Install fuses or breakers at every connection point. Ground your system." },
    ],
    tips: [
      { label: "Start Small, Expand Later", text: "A 400W system with a small battery bank can power lights, phone charging, and a laptop. Start there and expand as your budget and skills grow." },
      { label: "Shade is the Enemy", text: "Even partial shading of one panel can significantly reduce your entire array's output. Site your panels where they will receive unobstructed sun from 9am to 3pm." },
      { label: "Energy Efficiency First", text: "Before adding more solar, reduce your consumption. LED lights, efficient appliances, and good insulation reduce the size (and cost) of system you need." },
      { label: "Backup Power", text: "A small generator for cloudy stretches is a practical backup. A 2,000W generator can recharge your battery bank and power essential loads." },
    ],
    resources: [
      { title: "Renogy Solar Learning Center", url: "https://www.renogy.com/learn/", type: "guide" },
      { title: "Off-Grid Solar Calculator", url: "https://www.wholesalesolar.com/solar-information/solar-calculator", type: "tool" },
      { title: "NREL PVWatts Calculator", url: "https://pvwatts.nrel.gov/", type: "tool" },
      { title: "Solar Energy Industries Association", url: "https://www.seia.org/", type: "organization" },
    ],
    safetyNotes: "Solar systems involve high DC voltages that can cause serious injury or death. If you are not comfortable with electrical work, hire a licensed electrician for the final connections. Always disconnect panels before working on the system.",
  },
];

export function getSkillBySlug(slug: string): Skill | undefined {
  return skills.find((s) => s.slug === slug);
}
