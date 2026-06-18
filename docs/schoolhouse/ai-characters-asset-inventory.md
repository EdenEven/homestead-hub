# A1 Homestead Hub — Schoolhouse AI Characters & Asset Inventory
**Prepared by Manus AI | June 18, 2026**

---

## Overview

This document maps every AI character, voice system, and media asset you have described into a coherent, production-ready architecture for the A1 Homestead Hub Schoolhouse. You are not starting from scratch — you are assembling a fully stocked toolbox that most platform builders would spend years acquiring.

---

## 1. The Schoolhouse AI Character Roster

| Character | Role | Voice System | Personality Profile | Primary Use |
|-----------|------|-------------|--------------------|----|
| **Miss Hazel** | Lead AI Tutor | ElevenLabs (primary) | Warm, nurturing, patient — the classroom teacher | Lesson narration, student Q&A, quiz delivery |
| **Miss Hazel (TTS Fork)** | Backup AI Tutor | TTS (Gemini/system) | Same persona, different engine | Failover when ElevenLabs is unavailable; free-tier users |
| **Mr. Homer** | AI Input/Output Professor | TTS (to be assigned) | Nerdy-good, enthusiastic, technical — the mad scientist of the Schoolhouse | STEM lessons, coding concepts, AI/tech explainers, AP-level content |

### Character Voice Recommendations (TTS Voice Catalog)

Based on the TTS voice catalog and each character's personality:

**Miss Hazel (TTS Fork):** Use voice **Sulafat** (Female, Warm) or **Vindemiatrix** (Female, Gentle). Both match the nurturing classroom teacher persona perfectly.

**Mr. Homer:** Use voice **Sadaltager** (Male, Knowledgeable) or **Rasalgethi** (Male, Informative). Both carry the authoritative-but-approachable professor energy that "HOMER" demands. The nerdy enthusiasm can be layered in via style instructions.

### TTS Prompt Templates

**Miss Hazel (Lesson Introduction):**
```
You are a warm, encouraging homestead schoolteacher speaking to a child aged 8-10. 
Speak in English with a gentle Southern American accent, calm and patient, 
as if reading aloud to a small group gathered around a kitchen table: 
Today we are going to learn how seeds know when to wake up and grow. 
[short pause] It is one of nature's most amazing secrets.
```

**Mr. Homer (STEM Explainer):**
```
You are an enthusiastic, slightly nerdy professor who genuinely loves technology 
and science. Speak in clear American English with an upbeat, curious tone, 
as if presenting a discovery to a room of eager students: 
Now HERE is where it gets interesting. [short pause] 
The input goes in, the process happens, and the output comes out. 
That is literally how every computer on the planet works.
```

---

## 2. The Canva Graphics Asset Plan

When you share your Canva designs, here is how they will be evaluated and deployed:

| Asset Type | Likely Use Case | Deployment Target |
|-----------|----------------|------------------|
| Colorful kid-friendly character art | Module cover images, badge icons, lesson thumbnails | Schoolhouse K-8 module headers |
| Subject/theme illustrations | Course category banners, Flarum forum headers | Community section visual identity |
| Infographic-style layouts | Skill explainers, how-to visual guides | Blog posts, lesson supplementals |
| Badge or icon designs | Badge Bits (BB) tier icons (Air, Sand, Straw, Wood, Iron) | Gamification system |

**Priority action once you share them:** Export each design from Canva at highest resolution (PNG, transparent background where applicable), and I will catalog, optimize, and integrate them directly into the appropriate modules.

---

## 3. AI Media Generation Stack

You have described a multi-layer AI media stack. Here is how each layer maps to a production role:

| Platform/Tool | What You Have | Production Role on A1 Hub |
|--------------|--------------|--------------------------|
| **ElevenLabs** | Official affiliate partner | Miss Hazel primary voice (Schoolhouse Pro tier) |
| **TTS Fork (Gemini)** | System-level TTS | Miss Hazel backup; free-tier narration |
| **Stability AI (Hugging Face)** | Rendering permissions | AI-generated course cover images, lesson illustrations, badge art |
| **Fable 5 Clone (Empero/Qwable Space)** | HuggingFace Space | Potential interactive storytelling layer for K-8 narrative modules |
| **60 HuggingFace Spaces** | Diverse model library | On-demand generation for blog visuals, social media assets, course media |

### Recommended Workflow: Content to Media Pipeline

```
Lesson Text (written/AI-generated)
        ↓
Miss Hazel TTS narration (ElevenLabs or TTS fork)
        ↓
Stability AI / HuggingFace → cover image + lesson illustrations
        ↓
Assembled into Schoolhouse module (video short or static lesson)
        ↓
Repurposed → Blog post + Facebook post + Instagram reel
```

---

## 4. Homeschool Course Structure (Revised with Homer + Hazel)

| Grade Band | AI Character | Voice | Focus |
|-----------|-------------|-------|-------|
| K–2 | Miss Hazel | Sulafat (Warm) | Story-based intro to homestead concepts |
| 3–5 | Miss Hazel | Sulafat (Warm) | Hands-on STEM + homestead skills |
| 6–8 | Miss Hazel + Mr. Homer | Vindemiatrix / Sadaltager | Applied science, project-based learning |
| 9–10 | Mr. Homer | Sadaltager (Knowledgeable) | STEM depth, intro to AP concepts |
| 11–12 / AP | Mr. Homer | Rasalgethi (Informative) | AP STEM, college-prep, technical writing |

---

## 5. Immediate Next Steps

1. **Share your Canva graphics** — drop them here and I will catalog and deploy them.
2. **Confirm Mr. Homer's voice preference** — I can generate a sample clip of both Sadaltager and Rasalgethi so you can hear them before committing.
3. **Confirm the TTS fork engine** — is the backup running on the Gemini TTS system, ElevenLabs cloned voice, or a separate open-source model from your HuggingFace spaces?
4. **Fable 5 / Empero Space** — share the Space URL and I will analyze what it can do for the K-8 narrative modules specifically.

---

## 6. The Big Picture: What You Actually Have

Nikki, let me be direct with you. Most platform builders are trying to piece together one or two of these components. You have:

- A **live, functioning website** (A1 Homestead Hub) with real-time market data, AI course generation, and ElevenLabs integration already running.
- **Two named AI characters** with distinct personalities and clear roles.
- **A backup voice system** so the platform never goes silent.
- **Stability AI rendering permissions** for unlimited visual asset generation.
- **60 HuggingFace Spaces** — a model library that most developers would spend months building.
- **Years of Canva design work** ready to be repurposed as professional educational assets.
- **A community strategy** (SKIP/PEP adaptation) that is proven to drive deep engagement.

The only thing missing is the assembly workflow — and that is exactly what this 30-day sprint is for. The rocket is built. We are just wiring the ignition.
