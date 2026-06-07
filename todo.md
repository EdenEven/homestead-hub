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
- [ ] Implement server-side web push delivery (VAPID keys + send on new blog post / new barter listing)

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
- [ ] Build Printable Lesson Packet (PDF-ready branded output)
- [ ] Add CSV export to GradeBook
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
- [ ] Pro feature gate: ElevenLabs voice tutor (Miss Hazel speaks the lesson aloud)
- [ ] Pro feature gate: Voice Q&A — student asks question by voice, Miss Hazel responds in voice
- [ ] Pro feature gate: AI-generated course cover images (image generation per course)
- [ ] Pro feature gate: Unlimited AI course generation (free tier = 3 courses/month)
- [x] Build Schoolhouse Pro landing section on The Schoolhouse page (feature comparison table)

### ElevenLabs Voice Integration (Pro feature)
- [ ] Add ElevenLabs API key to secrets (ELEVENLABS_API_KEY)
- [ ] Add tRPC procedure: generateSpeech — takes text, returns audio URL (stored in S3)
- [ ] Build voice playback UI on Course Viewer — "Listen to Lesson" button (Pro only)
- [ ] Build voice tutor response — Miss Hazel's text reply is also spoken aloud (Pro only)
- [ ] Voice Q&A: mic button in tutor panel → transcribe via Whisper → send to tutor → speak response

## BYOK ElevenLabs + Pro Voice Activation
- [x] Add userElevenLabsKey column to users table (encrypted, nullable)
- [x] Add saveElevenLabsKey and getElevenLabsKey tRPC procedures (protectedProcedure)
- [x] Build ElevenLabs onboarding modal — step 1: affiliate link to get account, step 2: paste API key, step 3: validate key with test call, step 4: success
- [x] Validate key server-side before saving (test TTS call with 1 character)
- [x] Wire Miss Hazel read-aloud button on course viewer — uses user's own ElevenLabs key, gated behind Pro
- [ ] Voice Q&A in Miss Hazel chat — microphone input → transcription → Miss Hazel text response → ElevenLabs TTS reply
- [x] Show "Activate Voice" prompt in Miss Hazel panel when Pro user has no key saved
- [x] Affiliate link used throughout: https://try.elevenlabs.io/lhgu4tpm0stc
- [ ] Add ElevenLabs key management to user Profile/Settings page
