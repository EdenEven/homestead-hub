# A1 Homestead Hub: Resilience Architecture
**Prepared by Manus AI | June 18, 2026**

---

## The Core Philosophy

This platform is designed to survive billing cycles, platform outages, and limited funding windows. Every component has a fallback. Nothing critical lives in only one place.

> "The repo can be full of true/false files that serve a purpose at a particular milestone in monetary gains." — Nikki Russell

This is the correct mental model. GitHub is the permanent memory. Manus is the paid build manager. The Raspberry Pi is the insurance policy. Supabase is the live database with repo backup. Each layer serves a distinct role and can operate independently of the others.

---

## The Four-Layer Stack

| Layer | Tool | Role | Survives Without |
|-------|------|------|-----------------|
| **Permanent Memory** | GitHub (EdenEven/homestead-hub) | All documentation, code, workflows, and milestones | Manus subscription, Supabase, hosting |
| **Live Database** | Supabase | User data, barter listings, course progress, community posts | GitHub (syncs on schedule) |
| **Build Manager** | Manus AI | Ideation, coding, documentation, workflow automation | GitHub (all work is committed before session ends) |
| **Offline Insurance** | Raspberry Pi Package | Core curriculum, Qwable-9B model, skills library | Internet, hosting, all cloud services |

---

## The Milestone Flag System

The repository uses a flag-based milestone system. Files in `/milestones/` act as true/false switches that unlock features or workflows when funding allows.

```
/milestones/
  phase-1-foundation.md         ← TRUE (complete)
  phase-2-otis-matchmaking.md   ← FALSE (pending funding)
  phase-3-map-barter.md         ← FALSE (pending funding)
  phase-4-raspberry-pi.md       ← FALSE (pending funding)
  flarum-gamification.md        ← FALSE (pending setup)
  f5-tts-fork-active.md         ← FALSE (needs rebuild)
  supabase-backup-active.md     ← FALSE (needs configuration)
```

When a milestone is reached, the corresponding file is updated to `TRUE` and the associated GitHub Actions workflow is triggered. This means the platform can grow incrementally — each funded phase activates the next layer of functionality.

---

## Content Publishing Resilience

The scheduled blog post system must never be blocked by a billing issue again. The workflow is:

1. Blog posts are written and queued in GitHub (as Markdown files in `/content/blog/`).
2. A GitHub Actions workflow publishes them on schedule, regardless of Manus subscription status.
3. If the A1 Hub hosting goes down, the content still exists in GitHub and can be re-deployed instantly.
4. Supabase stores post metadata (publish date, category, status) and syncs back to GitHub on a nightly schedule.

**The "gated flood" problem** (posts written but not published when billing was delinquent) is solved by moving the publishing trigger to GitHub Actions, which is free and independent of any paid subscription.

---

## Supabase Backup Configuration

Supabase serves as the live operational database. To ensure no data is ever lost:

1. A nightly GitHub Actions workflow exports Supabase data to `/backups/` in the repository.
2. Critical tables (users, barter listings, course progress, community posts) are backed up as JSON.
3. The Supabase project URL and anon key are stored as GitHub Secrets, never in plaintext.

**To configure:** Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to the repository's GitHub Secrets, then enable the `supabase-backup.yml` workflow (to be created in Phase 1).

---

## Session Continuity Protocol

Every Manus session ends with the following steps to ensure continuity:

1. All new documents are committed to the repository with a descriptive commit message.
2. The `MASTER-INDEX.md` is updated to reflect new work.
3. The session changelog (`/docs/changelog.md`) is updated with a summary of what was accomplished.
4. Any unresolved tasks are added to `todo.md` with priority labels.

This means that when a new Manus session begins, the first action is to read `MASTER-INDEX.md` and `todo.md` to immediately understand the current state of the project — no context is lost between sessions.
