import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const CDN = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663353064793/QabQE5xjRLwvDkHphpqtoD';

const HUMANE_DISPATCH_VIDEO = `${CDN}/Humane_Dispatch__The_Anatomy_of_an_Ethical_Kill_72ddc19f.mp4`;
const DUAL_PURPOSE_VIDEO = `${CDN}/Dual-Purpose_Chickens_725365bc.mp4`;
const TURKEY_VIDEO = `${CDN}/Turkey_vs_2a8754b6.mp4`;
const SOP_PDF = `${CDN}/StandardOperatingProcedure_Small-ScaleOn-FarmPoultryProcessing_61beb180.pdf`;
const MIND_MAP = `${CDN}/NotebookLMMindMap_8aac83a0.png`;
const SLIDE1 = `${CDN}/image1_79760dc2.png`;
const SLIDE2 = `${CDN}/image2_2daccbde.png`;

const posts = [
  {
    slug: 'the-honest-harvest-poultry-processing-guide',
    title: 'The Honest Harvest: A Field Guide to Ethical Poultry Processing',
    subtitle: 'From pre-processing protocols to whole-bird utilization — a professional approach to the most important skill on your homestead.',
    category: 'ANIMAL HUSBANDRY',
    heroImageUrl: SLIDE1,
    audioUrl: null,
    videoUrl: null,
    pdfUrl: SOP_PDF,
    isFree: 1,
    isPublished: 1,
    authorName: 'Nikki Russell',
    publishedAt: new Date('2026-04-13T08:00:00Z'),
    content: `Processing your own poultry is one of the most consequential skills a homesteader can develop. It closes the loop between raising an animal and feeding your family. Done right, it is an act of respect — for the animal, for the food, and for the people at your table. Done carelessly, it produces inferior meat and unnecessary suffering. This guide covers the complete professional workflow.

## The Philosophy: The Unhurried Approach

Processing is the final act of husbandry. A hurried approach — rushing the bird, skipping protocols, cutting corners — creates high animal stress, rapid glycogen depletion, altered muscle pH levels, and ultimately tough, substandard meat. The unhurried approach honors the animal and guarantees culinary excellence. A calm environment, rapid insensibility, and preserved cellular ATP produce a tender, premium product.

![The Hurried vs. Unhurried Approach](${SLIDE2})

## The Foundation: Pre-Processing Protocols

Successful processing begins long before the first incision. Stress in the final hours depletes muscle glycogen, which negatively alters pH levels and leads to a loss in quality. Proper pre-processing mitigates these chemical shifts while ensuring the digestive tract is clear.

**Fasting Standards by Bird Category:**

| Bird Category | Fasting Duration | Rationale |
|---|---|---|
| Broilers (Young) | 12 Hours | Minimizes crop volume to ensure the sac is empty |
| Layers (Older) | 18 Hours | More robust digestive tracts require longer transit times |
| Turkeys | 12–20 Hours | Large body size necessitates a clear tract |
| Waterfowl | 18–24 Hours | High metabolic rates require extended withdrawal |

A full crop is heavy, distended, and acts as a high-risk biological "balloon" that can contaminate the breast meat. Adhering to these standards ensures the internal organs are flaccid, significantly reducing the risk of rupture.

**Critical Sanitation Steps:**
- Use a diluted bleach solution (1 tablespoon per gallon) to sanitize all non-porous surfaces. This kills surface-level pathogens like E. coli and Salmonella.
- Organize the workspace so slaughter, scalding, and plucking are physically separated from evisceration. This prevents cross-contamination from the high-pathogen external environment to the clean internal meat.
- For waterfowl: add a grease-cutting detergent to the scalding water to break the lipid barrier created by the uropygial gland.

## The Complete Processing Workflow

The mind map below shows the full workflow at a glance — from pre-processing through waste and by-products. Study it before your first processing day.

![Poultry Processing and Utilization Mind Map](${MIND_MAP})

## Removing the Oil Gland

Before accessing the internal cavity, remove the yellow uropygial gland (oil gland) located on the dorsal side of the tail. This gland must be removed first because those oils, if left on the carcass during cooking, will impart a bitter, "off" flavor to the entire bird.

Do not simply chop the tail off. Place your knife just in front of the yellow tissue. Use a "scooping" motion, cutting down until you feel the resistance of the bone. Slide the knife toward the tail to lift the gland out entirely without severing the tail. There should be zero yellow tissue remaining on the carcass.

## The Neck Entry: Managing the Crop, Trachea, and Esophagus

Beginning at the neck allows you to loosen the primary connections, making it possible to pull the entire viscera package through the body cavity in one motion later.

1. **Head Removal at the Atlas Joint** — Cut through the first vertebra to leave the maximum amount of neck skin intact.
2. **Trachea (Windpipe)** — A firm, ribbed tube. Differentiate by touch: it feels like a tiny vacuum hose.
3. **Esophagus** — A soft, smooth tube. More elastic than the trachea.
4. **Crop** — A thin-walled storage sac on the bird's right side. If broken, immediately rinse the breast meat with fresh water to prevent spoilage.

## The Posterior Opening: Precision at the Vent

Make a shallow incision just above the vent, being careful not to pierce the underlying intestine. Carefully cut around the vent to free the cloaca from the skin.

**The Strict Rule:** If dark green fluid (bile) appears or a foul, sulfurous odor is detected, the bile duct has ruptured. Condemn that bird for human consumption — the meat is now unsanitary and foul-tasting.

## The Internal Harvest: Sequence of Organ Extraction

Reach past the breastbone toward the neck, hook your fingers firmly around the gizzard, and pull the entire viscera package toward the posterior opening.

| Organ | Identification | Processing Action |
|---|---|---|
| Heart | Dense, firm, lean muscle | Rinse out remaining blood. No "organ-y" flavor — a culinary staple |
| Liver | Deep red, soft, smooth | Carefully cut away the green gallbladder. Puncturing it ruins the liver |
| Gizzard | Large, hard, round muscle | Slice open carefully. Peel and discard the yellow lining |
| Lungs | Bright pink, squishy tissue | Use a lung scraper or fingers to pull tissue from between the ribs |

## Post-Removal Hygiene and Chilling

**Thermodynamic Chilling Sequence:**
1. Final Rinse — Wash the cavity and exterior with cold water to remove bone fragments or organ remnants.
2. Ice-Water Bath Immersion — Submerge the carcass in a clean bucket of ice and water.
3. Target Temperature — The core must reach **40°F** as quickly as possible.

**The Maturation Window:** Skipping the aging step results in meat that is chemically "locked" and tough. Allow rigor mortis to pass as the bird's cellular ATP is depleted and the muscles relax.
- Chickens: Rest for 24–48 hours
- Turkeys: Rest for 48–72 hours

## Download the Full Standard Operating Procedure

The complete SOP for small-scale on-farm poultry processing is available as a PDF download. This is the professional reference document — print it, laminate it, and keep it at your processing station.`,
  },
  {
    slug: 'humane-dispatch-anatomy-of-an-ethical-kill',
    title: 'Humane Dispatch: The Anatomy of an Ethical Kill',
    subtitle: 'Why how you end a life matters as much as how you raised it — and the techniques that honor both the animal and the meat.',
    category: 'ANIMAL HUSBANDRY',
    heroImageUrl: SLIDE2,
    audioUrl: null,
    videoUrl: HUMANE_DISPATCH_VIDEO,
    pdfUrl: null,
    isFree: 1,
    isPublished: 1,
    authorName: 'Nikki Russell',
    publishedAt: new Date('2026-04-13T09:00:00Z'),
    content: `There is a moment in every homesteader's journey where the philosophy meets the practice. You have raised the animal. You have fed it, watered it, watched it grow. And now you are responsible for its death. How you handle that moment defines the kind of steward you are.

Humane dispatch is not a soft concept — it is a technical and ethical standard. It is the difference between an animal that dies in seconds without awareness and one that suffers through a prolonged, stressful process. It is also the difference between premium meat and inferior meat. The two are inseparable.

## Why It Matters: The Science of Stress and Meat Quality

High animal stress in the final moments triggers a cascade of biological events. Cortisol floods the system. Glycogen is rapidly depleted from the muscles. The pH of the meat shifts. The result is tough, pale, watery, or dark, firm, dry meat — none of which is what you raised this animal for.

The unhurried, humane approach preserves cellular ATP, maintains proper muscle pH, and produces the tender, flavorful product that makes home-raised poultry worth the effort.

**The two non-negotiables of humane dispatch:**
1. **Rapid insensibility** — the animal must lose consciousness immediately, before it can register pain or fear.
2. **Complete exsanguination** — full blood drainage ensures the best possible meat quality and food safety.

## The Methods: What Works and What Doesn't

The video below covers the anatomy of an ethical kill in detail — the restraint, the cut, the timing, and the signs that tell you it was done correctly.

## Watch: Humane Dispatch in Practice

The following video demonstrates the complete humane dispatch process for backyard poultry. It is direct and educational — this is real homesteading, not sanitized content.

## After the Dispatch: The First 60 Seconds

What you do in the 60 seconds after dispatch determines the quality of everything that follows. Proper blood drainage, immediate scalding preparation, and a calm, organized workspace are the marks of a practiced processor.

The full processing workflow — from dispatch through chilling and aging — is covered in detail in our companion guide: [The Honest Harvest: A Field Guide to Ethical Poultry Processing](/blog/the-honest-harvest-poultry-processing-guide).`,
  },
  {
    slug: 'dual-purpose-chickens-raising-breeds-that-feed-you-twice',
    title: 'Dual-Purpose Chickens: Raising Breeds That Feed You Twice',
    subtitle: 'The math of dual-purpose breeds — why the right chicken gives you eggs for two years and meat at the end, and which breeds actually deliver.',
    category: 'ANIMAL HUSBANDRY',
    heroImageUrl: SLIDE1,
    audioUrl: null,
    videoUrl: DUAL_PURPOSE_VIDEO,
    pdfUrl: null,
    isFree: 1,
    isPublished: 1,
    authorName: 'Nikki Russell',
    publishedAt: new Date('2026-04-13T10:00:00Z'),
    content: `The industrial poultry model split the chicken into two separate animals: the Cornish Cross broiler, engineered for maximum meat in 8 weeks, and the White Leghorn layer, engineered for maximum eggs with a body too small to bother processing. For the homesteader, this is a false choice — and an expensive one.

The dual-purpose breed is the original homestead chicken. It lays well enough to justify the feed bill for 18–24 months, and when its laying days are done, it puts enough meat on the table to make the processing day worthwhile. One flock. Two functions. No waste.

## The Math That Makes It Work

A good dual-purpose hen lays 200–250 eggs per year in her prime. At 18 months, production begins to decline. At 24–30 months, she is still laying but at 60–70% of peak. At that point, you have a choice: keep feeding a declining layer, or process her and put 4–6 pounds of flavorful, rich meat in the freezer.

The rooster math is even cleaner. Every hatch produces roughly 50% cockerels. In a laying flock, you need one rooster per 8–10 hens. The rest are surplus. A dual-purpose cockerel processed at 16–20 weeks yields 5–7 pounds of meat. That is free protein — the cost of raising it is already covered by the eggs the hens are producing.

## The Breeds That Actually Deliver

Not all "dual-purpose" breeds are equal. Some are better layers with mediocre meat. Some are better meat birds with disappointing egg production. The breeds that genuinely deliver on both:

**Barred Plymouth Rock** — The gold standard. 280 eggs/year, excellent meat conformation, calm temperament, cold-hardy. The most forgiving breed for beginners.

**Rhode Island Red** — 260–300 eggs/year, good meat yield, aggressive foragers that reduce feed costs. Roosters can be assertive.

**Black Australorp** — Holds the world record for egg production (364 eggs in 365 days). Excellent meat bird. Gentle, quiet, heat-tolerant.

**Buff Orpington** — 200–280 eggs/year, exceptional meat quality, extremely docile. The breed most likely to go broody and raise its own replacements.

**Delaware** — Originally developed as a commercial meat breed, retained excellent laying ability. Fast-growing, efficient feed conversion, excellent flavor.

## Watch: Dual-Purpose Chickens in Practice

The video below covers dual-purpose breed selection, management, and the processing decision — when to keep laying and when to harvest.

## The Processing Decision

The hardest part of dual-purpose management is not the processing itself — it is making the decision. The bird that has given you eggs for two years is not a pet (unless you made it one). It is livestock. Making the processing decision on schedule, not emotionally, is what separates a functioning homestead from an expensive hobby.

For the complete processing guide, see: [The Honest Harvest: A Field Guide to Ethical Poultry Processing](/blog/the-honest-harvest-poultry-processing-guide).`,
  },
  {
    slug: 'turkey-vs-everything-processing-your-holiday-bird',
    title: 'Turkey vs. Everything: Processing Your Holiday Bird at Home',
    subtitle: 'Everything that is different about processing a turkey — the size, the scalding, the timing, and why heritage breeds change the entire equation.',
    category: 'ANIMAL HUSBANDRY',
    heroImageUrl: SLIDE1,
    audioUrl: null,
    videoUrl: TURKEY_VIDEO,
    pdfUrl: SOP_PDF,
    isFree: 1,
    isPublished: 1,
    authorName: 'Nikki Russell',
    publishedAt: new Date('2026-04-13T11:00:00Z'),
    content: `If you have processed chickens, you think you know how to process a turkey. You do not. A turkey is not a large chicken — it is a different animal with different biology, different processing requirements, and a different timeline. Get those differences wrong and you will have a tough, poorly-drained, difficult-to-pluck bird that does not justify the effort.

Get them right, and you will have the best turkey you have ever tasted — and you will never buy a grocery store bird again.

## What Is Actually Different

**Size and handling** — A mature broad-breasted turkey can weigh 25–35 pounds. That is a different physical challenge than a 5-pound chicken. You need a larger scalding vessel, a stronger killing cone or restraint system, and more physical space at every stage of processing.

**Fasting duration** — Turkeys require 12–20 hours of feed withdrawal before processing. Their larger body size and more complex digestive system require more time to clear the tract. Rushing this step is the most common cause of contamination during evisceration.

**Scalding temperature and time** — Turkeys require a slightly higher scalding temperature (140–150°F for hard scald) and longer immersion time than chickens. Their feathers are denser and the follicles are deeper. Under-scalding is the most common reason for a difficult pluck.

**Aging** — This is where most home processors fail with turkeys. A turkey processed and cooked the same day will be tough. The muscles need 48–72 hours of refrigerated rest after processing for rigor mortis to fully resolve. Plan your processing day accordingly.

## Heritage vs. Broad-Breasted: The Real Comparison

The broad-breasted white turkey — the standard commercial bird — was engineered for maximum breast meat in minimum time. It reaches processing weight in 16–20 weeks. It cannot reproduce naturally. It has difficulty walking at full size. It is a production machine, not a homestead animal.

The heritage turkey — Narragansett, Bourbon Red, Black, Standard Bronze — is a different proposition entirely. It takes 25–30 weeks to reach processing weight. It forages aggressively, reducing feed costs. It reproduces naturally. Its meat is darker, richer, and more flavorful than any commercial bird. And it is a sustainable, self-replacing flock animal.

| Feature | Broad-Breasted White | Heritage Breed |
|---|---|---|
| Processing Age | 16–20 weeks | 25–30 weeks |
| Live Weight | 25–35 lbs | 14–22 lbs |
| Feed Conversion | Excellent | Good |
| Natural Reproduction | No | Yes |
| Foraging Ability | Poor | Excellent |
| Meat Flavor | Mild | Rich, complex |
| Self-Sustaining Flock | No | Yes |

## Watch: Turkey Processing in Practice

The video below covers the complete turkey processing workflow — from restraint and dispatch through scalding, plucking, evisceration, and chilling. Pay particular attention to the scalding section and the aging guidance at the end.

## The Thanksgiving Timeline

If you are raising turkeys for Thanksgiving, work backward from your table date:

- **Processing day:** 3–4 days before Thanksgiving (allows for 48–72 hour aging plus 1 day for brining or dry-rub preparation)
- **Final feed withdrawal:** 12–20 hours before processing
- **Processing start:** Early morning — you want the bird chilled and aging by midday

The full Standard Operating Procedure for on-farm poultry processing is available as a PDF download below. It covers turkeys specifically in the waterfowl and large bird section.

For the complete processing fundamentals, see: [The Honest Harvest: A Field Guide to Ethical Poultry Processing](/blog/the-honest-harvest-poultry-processing-guide).`,
  },
];

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  let inserted = 0;
  for (const post of posts) {
    // Check if slug already exists
    const [existing] = await conn.execute('SELECT id FROM blogPosts WHERE slug = ?', [post.slug]);
    if (existing.length > 0) {
      console.log(`Skipping existing post: ${post.slug}`);
      continue;
    }
    
    // embed video in content if present
    let finalContent = post.content;
    if (post.videoUrl) {
      finalContent = finalContent.replace(
        '## Watch:',
        `<video controls class="w-full rounded-lg my-6" src="${post.videoUrl}"></video>\n\n## Watch:`
      );
    }
    
    await conn.execute(
      `INSERT INTO blogPosts 
        (slug, title, subtitle, category, heroImageUrl, audioUrl, pdfUrl, 
         isFree, isPublished, author, publishedAt, content, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        post.slug,
        post.title,
        post.subtitle,
        post.category,
        post.heroImageUrl,
        post.audioUrl,
        post.pdfUrl,
        post.isFree,
        post.isPublished,
        post.authorName,
        post.publishedAt,
        finalContent,
      ]
    );
    console.log(`Published: ${post.title}`);
    inserted++;
  }
  
  console.log(`\nDone. Published ${inserted} new posts.`);
  await conn.end();
}

main().catch(console.error);
