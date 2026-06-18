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
- [x] Add delete button to Barter & Trade listings (admin deletes any, users delete their own)
- [x] Seed a polished example listing so the board never looks empty to new visitors
- [x] Remove test/dummy entries from the live barter board
- [x] Add A1 Homestead Hub Facebook page link to footer
- [x] Add sitewide admin announcement bar (admin can set/clear a banner message)
- [x] Add new blog post toast notification when a post is published
- [x] Add new barter listing toast notification when a trade is posted
- [x] Add browser push notification opt-in system
- [x] Implement server-side web push delivery (VAPID keys + send on new blog post / new barter listing)

## The Schoolhouse — Homeschool Course Studio
- [x] Add Schoolhouse DB tables (courses, lessons, quizzes, students, progress, grades)
- [x] Build Schoolhouse tRPC router (courses, lessons, students, grades CRUD)
- [x] Seed 5 pre-built homestead courses (K-8 STEM + 9-12 AP/STEM) with lessons and quizzes
- [x] Build Schoolhouse landing dashboard (welcome banner, active courses, student progress)
- [x] Build Course Browser page (pre-built + user-created courses grid)
- [x] Build Course Viewer page (lesson list, video embeds, quiz, progress tracking)
- [x] Build Course Builder Studio (lesson editor, quiz builder, media library)
- [x] Build Student Profiles page (photo, grade level, progress bars, mood log)
- [x] Build GradeBook view (table, student selector, quiz scores, letter grades)
- [x] Build Printable Lesson Packet (PDF-ready branded output)
- [x] Add CSV export to GradeBook
- [x] Write vitest tests for Schoolhouse router helpers
- [x] Add Schoolhouse link to main navigation
- [x] Write vitest tests for Schoolhouse router

## AI Study Guide Generator
- [x] Add studyGuides DB table to schema
- [x] Add generateStudyGuide tRPC procedure (LLM-powered)
- [x] Add getStudyGuides and deleteStudyGuide DB helpers
- [x] Build Study Guide UI on the Course page (generate button, display, save, print)

## Patreon
- [x] Write Patreon page description for A1 Homestead Hub
- [x] Write first Patreon post demoing the website
- [x] Add Share to Patreon button on course pages and study guide panel

## AI Course Creator
- [x] Add generateCourse tRPC procedure (LLM structured JSON — full course with lessons and quizzes)
- [x] Build AI Course Creator UI (describe prompt, grade level, subject, generate button, preview, save)
- [x] Wire AI Course Creator into The Schoolhouse navigation

## Schoolhouse Pro — AI Tutor + Voice + PDF

### AI Tutor (Free tier — text chat)
- [x] Add schoolTutorSessions DB table (sessionId, courseId, userId, messages JSON, createdAt)
- [x] Add tutorChat tRPC procedure — per-course AI tutor with lesson context injected into system prompt
- [x] Build AI Tutor chat panel on the Course Viewer page (collapsible side panel, lesson-aware)
- [x] Tutor knows the current lesson content, can answer questions, quiz the student, explain concepts
- [x] Tutor persona: "Miss Hazel" — warm, encouraging, homestead-savvy homeschool teacher

### PDF Printable Lesson Packets (Free tier)
- [x] Build /schoolhouse/course/:id/print route — full print-ready page
- [x] Print layout: branded header (A1 Homestead Hub logo + course title), lesson content, vocab list, quiz, activity
- [x] Add Print Packet button on Course Viewer page (triggers browser print dialog with clean CSS)
- [x] Add CSS @media print styles to hide nav, sidebar, buttons — show only lesson content
- [x] PDF download option: server-side PDF generation using puppeteer or html-to-pdf

### Schoolhouse Pro Upgrade (Paid tier — $9/month or $79/year)
- [x] Add schoolProSubscriptions DB table (userId, stripeSubscriptionId, status, expiresAt)
- [x] Add Stripe checkout for Schoolhouse Pro tier ($9/month)
- [x] Add isPro flag to user session / auth context
- [x] Build Upgrade modal — shown when free user tries to access Pro features
- [x] Pro feature gate: ElevenLabs voice tutor (Miss Hazel speaks the lesson aloud)
- [x] Pro feature gate: Voice Q&A — student asks question by voice, Miss Hazel responds in voice
- [x] Pro feature gate: AI-generated course cover images (image generation per course)
- [ ] Pro feature gate: Unlimited AI course generation (free tier = 3 courses/month)
- [x] Build Schoolhouse Pro landing section on The Schoolhouse page (feature comparison table)

### ElevenLabs Voice Integration (Pro feature)
- [x] Add ElevenLabs API key to secrets (ELEVENLABS_API_KEY)
- [x] Add tRPC procedure: generateSpeech — takes text, returns audio URL (stored in S3)
- [x] Build voice playback UI on Course Viewer — "Listen to Lesson" button (Pro only)
- [x] Build voice tutor response — Miss Hazel's text reply is also spoken aloud (Pro only)
- [x] Voice Q&A: mic button in tutor panel → transcribe via Whisper → send to tutor → speak response

## BYOK ElevenLabs + Pro Voice Activation
- [x] Add userElevenLabsKey column to users table (encrypted, nullable)
- [x] Add saveElevenLabsKey and getElevenLabsKey tRPC procedures (protectedProcedure)
- [x] Build ElevenLabs onboarding modal — step 1: affiliate link to get account, step 2: paste API key, step 3: validate key with test call, step 4: success
- [x] Validate key server-side before saving (test TTS call with 1 character)
- [x] Wire Miss Hazel read-aloud button on course viewer — uses user's own ElevenLabs key, gated behind Pro
- [x] Voice Q&A in Miss Hazel chat — microphone input → transcription → Miss Hazel text response → ElevenLabs TTS reply
- [x] Show "Activate Voice" prompt in Miss Hazel panel when Pro user has no key saved
- [x] Affiliate link used throughout: https://try.elevenlabs.io/lhgu4tpm0stc
- [x] Add ElevenLabs key management to user Profile/Settings page

## Clickable Ticker — Historical Chart Modal
- [x] Add tRPC procedure to fetch historical price data for a given symbol (1W, 1M, 3M, 1Y ranges)
- [x] Build CommodityChartModal component — price line chart using recharts, range selector, OHLC summary
- [x] Make each ticker item clickable to open the chart modal
- [x] Show symbol name, current price, change, and historical chart in the modal

## Structured Data / Schema Markup (SEO Rich Results)
- [x] Add Article + BreadcrumbList JSON-LD schema to BlogPost page
- [x] Add HowTo + BreadcrumbList JSON-LD schema to SkillDetail page
- [x] Add Course + BreadcrumbList JSON-LD schema to SchoolCourse page
- [x] Add Organization JSON-LD schema to homepage (Home.tsx)
- [x] Generate dynamic sitemap.xml at /sitemap.xml via Express route
- [x] Add robots.txt with sitemap reference

## Social Sharing Buttons
- [x] Build reusable ShareButtons component (Facebook, X/Twitter, Pinterest, Copy Link)
- [x] Add ShareButtons to BlogPost page
- [x] Add ShareButtons to SchoolCourse page

## AI Discoverability & Documentation (Gemini/Google indexing)
- [x] Build /features page — explicit documentation of every feature, ElevenLabs partnership, how AI Course Creator works
- [x] Add FAQPage JSON-LD schema to homepage and features page
- [x] Add FAQ section to homepage with 8 key questions about the platform
- [x] Build /about page — platform story, tech partnerships (ElevenLabs), mission
- [x] Add ElevenLabs affiliate badge/partnership callout on Schoolhouse pages
- [x] Update meta description tags on all pages to include "ElevenLabs", "AI tutor", "homeschool"

## Daily Site Freshness Engine (Phase 2 Automation)
- [x] Add skillTips table to DB schema (skillSlug, tip text, createdAt)
- [x] Add freshness.getSkillTip tRPC procedure — returns the most recent tip for a given skill slug (rotates 1 skill/day to keep costs low)
- [x] Add /api/scheduled/generate-skill-tip Heartbeat endpoint — generates 1 tip per skill per day via LLM
- [x] Add "Tip of the Day" UI card to each SkillDetail page
- [x] Add schoolDailyExpansions table to DB schema (courseId, content, type, createdAt)
- [x] Add /api/scheduled/expand-course Heartbeat endpoint — adds 1 new quiz question or lesson note to a random course daily
- [x] Surface new lesson expansions on the Course Viewer page — Daily Course Additions panel with quiz questions, fun facts, and activities
- [x] Add homesteadFeed table to DB schema (type, headline, body, source, createdAt)
- [x] Add /api/scheduled/refresh-homestead-feed Heartbeat endpoint — generates daily homesteading insight (seasonal/market/tip/news)
- [x] Build "This Week in Homesteading" section on homepage — live feed cards from homesteadFeed table

## Partner & Advertiser Landing Page
- [x] Add partnerApplications table to DB schema (name, company, email, website, partnerType, message, status, createdAt)
- [x] Add submitPartnerApplication tRPC procedure (public) — saves to DB and notifies owner
- [x] Add getPartnerApplications tRPC procedure (admin-only) — lists all submissions
- [x] Build /partners landing page with hero, media kit stats, partnership tiers, and application form
- [x] Add "Partners" link to site navigation
- [x] Wire /partners route in App.tsx

## Media Kit Page
- [x] Build /media-kit page — platform overview, audience stats, content categories, ad formats, pricing philosophy, contact CTA
- [x] Wire /media-kit route in App.tsx
- [x] Add "Media Kit" link to Partners page and navigation

## Community Events System
- [x] Add communityEvents table to DB schema (title, description, eventDate, endDate, location, address, category, imageUrl, externalUrl, isFeatured, createdBy, createdAt)
- [x] Add events tRPC procedures: getUpcomingEvents (public), getEventById (public), createEvent (admin), updateEvent (admin), deleteEvent (admin)
- [x] Build /events page — upcoming events grid, auto-hides past events, category filter
- [x] Build admin event create/edit form (modal or inline, admin-only)
- [x] Add "Events" to Community nav group dropdown
- [x] Wire /events route in App.tsx
- [x] Seed the Scott City 4th of July 2026 event as the first entry
- [x] Add expired event cleanup to weekly-cleanup scheduled job

## Core Operational Fixes (June 2026)
- [x] Create all 5 Heartbeat cron jobs (blog, skill-tip, course-expansion, homestead-feed, weekly-cleanup)
- [x] Fix ElevenLabs env var name mismatch (ELEVENLABS_API_KEY → Eleven_Labs_Api_key)
- [x] Add AI-generated hero image to daily blog post generator (generateImage → S3 upload → heroImageUrl)
- [x] Connect Resend email service (API key validated, sendEmail helper built)
- [x] Wire welcome email on subscriber signup (fire-and-forget, non-blocking)
- [x] Wire partner application email notification to nikki@a1homesteadhub.com
- [ ] Verify a1homesteadhub.com domain in Resend dashboard (DNS TXT record) to send from noreply@a1homesteadhub.com

## Subscriber Conversion Landing Page (/join)
- [x] Build /join dedicated landing page — hero with strong CTA, 6 value prop cards, feature previews, email capture form, social proof section
- [x] Wire /join route in App.tsx
- [x] Ensure subscribe mutation sends welcome email on form submit

## Google Business Profile
- [x] Write complete Google Business Profile listing document (business name, category, description, hours, attributes, services, photos checklist, Q&A seeds)

## Home Instead Rebranding & New Features (June 17)
- [x] Rebrand homepage hero copy — "Home Instead" framing, new tagline, updated subheadline
- [x] Update homepage feature cards to reflect 2026 modern homesteader (smartphone, Raspberry Pi, intentional living)
- [x] Build /offline-kit waitlist page — product description, what's included, pricing, pre-order form
- [x] Add offlineKitWaitlist table to DB schema (name, email, zipCode, interestedIn, createdAt)
- [x] Add offlineKit tRPC router (joinWaitlist, getWaitlist) — saves to DB, notifies owner
- [x] Build Cherry Pick Your Knowledge feature — /cherry-pick page with interactive bundle builder
- [x] Add /cherry-pick page — checklist UI, select skills/courses, generate download
- [x] Add "Offline Kit" and "Cherry Pick" links to navigation under Features group
- [x] Wire /offline-kit and /cherry-pick routes in App.tsx

## Known Gaps — Next Session
- [x] Cherry Pick: implement real server-side bundle generation (tRPC procedure + S3 upload + real download) — generates a formatted Markdown bundle from actual skill content
- [x] /join page: add a social proof section (subscriber count, community stats, trust badges) — pulls live DB counts via trpc.stats.getSiteStats
- [ ] Verify a1homesteadhub.com domain in Resend dashboard (DNS TXT record) so emails send from noreply@a1homesteadhub.com instead of Resend's domain

## Upcoming Improvements
- [ ] Cherry Pick: upgrade from Markdown bundle to PDF generation (server-side PDF via html-to-pdf or reportlab, email delivery option)
- [x] Daily Course Additions: add graceful fallback for malformed expansion payloads (empty card guard)
- [x] Add AI cover generation button to Course Builder (for existing/manually created courses)
- [x] Add ElevenLabs callout to Schoolhouse catalog page (Schoolhouse.tsx) and Course Viewer (SchoolCourse.tsx)
- [ ] Implement per-page document.title updates in key pages (Blog, Schoolhouse, Skills Hub, Barter)
