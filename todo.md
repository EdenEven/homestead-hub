# A1 Homestead Hub — Project TODO

## Completed
- [x] Full site scaffold with 9 skill modules
- [x] Skills Hub with detail pages
- [x] Community Connect page
- [x] Barter & Trade board
- [x] Land Access resources page
- [x] Map Explorer with Google Maps
- [x] Homestead AI Chat widget (Gemini-powered)
- [x] Moltbook agent registration (homesteadhubai)
- [x] Stripe subscription system ($7/month)
- [x] Profile creation page
- [x] Pricing page with free/paid tiers
- [x] Stripe webhook handler
- [x] Welcome modal with e-book offer
- [x] Free e-book PDF lead magnet
- [x] Live commodities ticker bar (corn, wheat, soybeans, cattle, etc.)

## In Progress
- [ ] Live weather widget (GPS + zip code fallback)
- [ ] NOAA weather alert ticker (scrolling emergency alerts)
- [ ] Expand market ticker with DOW Jones and NASDAQ
- [ ] Moltbook agent bold persona + social posting strategy
- [ ] Scheduled Moltbook posts

## Bugs
- [x] Fix stock/commodities ticker not functioning

## Planned
- [ ] Add Pricing link to main navigation
- [x] Blog / From the Field section
- [ ] State-by-state hunting season calendar
- [ ] User account real community profiles
- [ ] Moltbook heartbeat auto-posting
- [x] Build Blog / From the Field section with free and gated posts
- [x] Publish first blog post: Traditional Appalachian Hog Butchering with infographic, audio, and PDF
- [x] Add Blog link to main navigation ("From the Field")
- [x] Add "From the Field" teaser section to homepage showing recent blog posts
- [x] Add Pricing link to main navigation bar (amber highlight)
- [x] Add Featured Post hero banner to the blog journal page
- [x] Add members-only gating example (second blog post marked as subscriber-only)
- [x] Fix "Loading market data..." and weather alerts ticker bar — switched to Stooq free API, fixed NOAA URL
- [x] Rewrite AI chatbot system prompt with hard safety refusals (no plant/mushroom ID, defer to USDA/Ball Blue Book on food safety)
- [x] Add visible safety disclaimer banner in the chat UI
- [x] Add email_subscribers table to database schema
- [x] Add email signup tRPC procedure (subscribe to list)
- [x] Replace welcome popup with free email signup flow (no $7, no paywall)
- [x] Remove Pricing page and Pricing nav link entirely
- [x] Remove members-only gate from Foraging blog post (all content free)
- [x] Update all CTAs to free community — no subscription required
- [x] Extend user table with homesteader profile fields (bio, location, skills, avatar, website, isPublic)
- [x] Add tRPC procedures for getProfile, updateProfile, uploadAvatar
- [x] Build full Profile page UI (avatar upload, bio, location, skills, completion tracker, save)
- [x] Build Community Members directory page showing real database profiles with skill badges
- [x] Wire Community nav link to members directory; nav shows My Profile/Sign Out for signed-in users
- [x] Fix profile.get returning undefined (must return null) when no profile row exists for new user
- [x] Upload infographic, video, and audio to CDN
- [x] Publish post: "From Bunkers to Bonds: A Conceptual Breakdown of Community Resilience"
- [x] Publish post: "The Off-Grid Land Buyer's Geographic Selection Guide"
- [x] Publish post: "Strategic Framework for Multi-Family Rural Land Development"
- [x] Publish post: "Resilient Decentralized Communications: Infrastructure Implementation Plan"
- [x] Publish post: "The Strategic Blueprint for Off-Grid Community Building" (converted from slide script)
- [x] Upload poultry media assets to CDN (3 videos, PDF, mind map, slide images)
- [x] Publish post: "The Honest Harvest: A Field Guide to Ethical Poultry Processing"
- [x] Publish post: "Humane Dispatch: The Anatomy of an Ethical Kill"
- [x] Publish post: "Dual-Purpose Chickens: Raising Breeds That Feed You Twice"
- [x] Publish post: "Turkey vs. Everything: Processing Your Holiday Bird at Home"
- [x] Fix silver price decimal point error in markets ticker (showing ~$7,000 instead of ~$75/oz)
- [x] Fix Barter & Trade: submitted listings not appearing on the page
- [x] Build classified-ad style listings display (category filters, listing cards, contact button)
