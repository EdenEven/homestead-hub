# A1 Homestead Hub: Session Changelog

---

## Session: June 18, 2026 — Manus AI Build Session

**Focus:** Community strategy analysis, AI character architecture, HuggingFace asset inventory, model integration, and GitHub documentation push.

### What Was Accomplished

This session established the foundational documentation layer for the A1 Homestead Hub project. The work began with an analysis of the Community Strategy Blueprint submitted by Nikki, which adapts the SKIP/PEP permaculture gamification model from Paul Wheaton's Permies.com community. The blueprint was validated against the existing A1 Hub feature set and found to be highly compatible with the platform's current Flarum forum, Barter Board, and Map Explorer infrastructure.

The Schoolhouse AI character roster was formalized. Miss Hazel was confirmed as the primary AI tutor powered by ElevenLabs, with the F5-TTS zero-shot voice cloning space designated as her backup engine. Mr. Homer was introduced as the STEM/AP professor character, with voice assignments of Sadaltager (Knowledgeable) or Rasalgethi (Informative) from the TTS catalog recommended. The full TTS prompt templates for both characters were documented.

All 52 HuggingFace spaces under the `Dragunflie-420` profile were cataloged across three pages. The spaces were categorized into four functional groups: Voice/Audio (F5-TTS, Giant Music Transformer, Video Dubbing), Image/Video Generation (MIDJOURNEY/RealVisXL running, FLUX.1, TRELLIS), LLMs/Text (Qwen 3.5-9B running, Llama 3.1 405B running), and Interactive/Gaming (Minecraft mods running, PlayCanvas Physics, AI Game Creator). A deployment map was created assigning each space to a specific A1 Hub use case.

The `empero-ai/Qwable-9B-Claude-Fable-5` model was identified and analyzed. This is a full-parameter fine-tune of Qwen3.5-9B on Claude Fable 5 reasoning traces, running locally via Docker Model Runner or vLLM with an OpenAI-compatible API. It was designated as a **Raspberry Pi "Offline Goldmine" component** rather than an active deployment, given current funding constraints. A full integration guide was documented.

The resilience architecture was formalized: GitHub as permanent memory, Supabase as live database with repo backup, Manus as paid build manager, and the Raspberry Pi package as offline insurance. A milestone flag system was designed to gate feature activation on funding availability.

### Documents Created This Session

| Document | Location |
|----------|----------|
| 30-Day Sprint Plan | `/docs/ai-strategy/30-day-sprint-plan.md` |
| AI Characters & Asset Inventory | `/docs/schoolhouse/ai-characters-asset-inventory.md` |
| HuggingFace Spaces Deployment Map | `/docs/huggingface/spaces-deployment-map.md` |
| Qwable-9B Integration Guide | `/docs/huggingface/qwable-9b-integration-guide.md` |
| Resilience Architecture | `/docs/infrastructure/resilience-architecture.md` |
| Master Index | `/docs/MASTER-INDEX.md` |
| Session Changelog | `/docs/changelog.md` (this file) |

### Open Items for Next Session

The following tasks are unresolved and should be addressed in the next session:

1. **Fix F5-TTS space** — Runtime error on `Dragunflie-420/F5-TTS`. Likely a deprecated dependency. Rebuild needed to activate Miss Hazel's TTS fork.
2. **Canva graphics import** — Nikki to share Canva designs. Once received, catalog and deploy as module covers, badge icons, and forum headers.
3. **Fable 5 / Empero Space URL** — Not found in public spaces. Nikki to confirm if private or under a different account.
4. **Supabase backup workflow** — Create `supabase-backup.yml` GitHub Actions workflow. Requires `SUPABASE_URL` and `SUPABASE_ANON_KEY` as GitHub Secrets.
5. **Blog post flood gate** — Investigate and resolve the gated post issue from the previous billing cycle. Migrate publishing trigger to GitHub Actions.
6. **Mr. Homer voice sample** — Generate TTS sample clips of Sadaltager and Rasalgethi for Nikki to choose Mr. Homer's voice.
7. **Miss Hazel TTS fork engine** — Confirm whether backup runs on Gemini TTS, cloned ElevenLabs voice, or open-source HuggingFace model.
