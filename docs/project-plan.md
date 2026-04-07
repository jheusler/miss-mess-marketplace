# Miss Mess Marketplace — Daily Task Plan
**MVP deadline: April 30, 2026 | Full version: May 16, 2026**

---

## Phase 1 — Sales Feed (Apr 7–11)

| Date | Task | Owner | Est. Time |
|------|------|-------|-----------|
| Tue Apr 7 | Run write-scraper.cjs, commit sales.json | Jess | 30 min |
| Tue Apr 7 | Build date filter chips (Today / This Weekend / Next 7 Days) | Claude | 45 min |
| Tue Apr 7 | Review, test locally, push to GitHub | Jess | 20 min |
| Wed Apr 8 | Verify date filters on live site | Jess | 15 min |
| Wed Apr 8 | Lock in app name — update title, readme, meta tags | Both | 30 min |
| Wed Apr 8 | Create docs/task-log.md in repo | Claude | 15 min |
| Thu Apr 9 | Sales Feed mobile audit — test every filter on iPhone | Jess | 20 min |
| Thu Apr 9 | Fix any layout or filter bugs found | Claude | 30 min |
| Thu Apr 9 | Document manual scraper schedule | Both | 15 min |
| Fri Apr 10 | Sales Feed: full end-to-end verification on live site | Jess | 20 min |
| Fri Apr 10 | Buffer — fix anything that failed verification | Both | as needed |
| Weekend Apr 11–12 | Run scraper again (new listings post on weekends) | Jess | 15 min |
| Weekend Apr 11–12 | Show someone the feed, note their reaction | Jess | 10 min |

---

## Phase 2 — AI Identifier (Apr 14–18)

| Date | Task | Owner | Est. Time |
|------|------|-------|-----------|
| Mon Apr 14 | Build photo upload UI — camera + file picker | Claude | 1 hr |
| Mon Apr 14 | Review and test upload locally | Jess | 20 min |
| Tue Apr 15 | Connect upload to Claude API — item name, era, resale value | Claude | 1 hr |
| Tue Apr 15 | Build result display card | Claude | 30 min |
| Wed Apr 16 | Add loading state + error handling (timeout, bad image) | Claude | 45 min |
| Wed Apr 16 | Test full flow locally on iPhone | Jess | 20 min |
| Wed Apr 16 | Push to GitHub, verify on live site | Jess | 10 min |
| Thu Apr 17 | AI Identifier mobile audit — real photos from around the house | Jess | 30 min |
| Thu Apr 17 | Fix top issues from testing | Claude | 45 min |
| Fri Apr 18 | AI Identifier: full end-to-end verification on live site | Jess | 20 min |
| Fri Apr 18 | Buffer — fix anything that failed | Both | as needed |

---

## Phase 3 — Saved Tab + Backend (Apr 21–25)

| Date | Task | Owner | Est. Time |
|------|------|-------|-----------|
| Mon Apr 21 | Build Saved tab — save/unsave/view flow (localStorage) | Claude | 1 hr |
| Mon Apr 21 | Test locally, push to GitHub | Jess | 20 min |
| Tue Apr 22 | Verify Saved tab on live site | Jess | 15 min |
| Tue Apr 22 | Set up Railway account, deploy Node/Express backend | Both | 1 hr |
| Wed Apr 23 | Connect frontend to Railway — fetch sales from API not static JSON | Claude | 1 hr |
| Wed Apr 23 | Set scraper to run on Railway schedule (weekly) | Claude | 30 min |
| Thu Apr 24 | End-to-end test with Railway backend live | Jess | 20 min |
| Thu Apr 24 | Fix any connection or data issues | Both | 45 min |
| Fri Apr 25 | All 3 MVP features live and verified | Jess | 30 min |
| Fri Apr 25 | Buffer — catch up on anything slipped | Both | as needed |

---

## Phase 4 — Stranger Test + Polish (Apr 28–30)

| Date | Task | Owner | Est. Time |
|------|------|-------|-----------|
| Mon Apr 28 | Give app to a real stranger — watch, don't explain | Jess | 30 min |
| Mon Apr 28 | Document every confusion point | Jess | 15 min |
| Mon Apr 28 | Full mobile audit on iPhone | Jess | 20 min |
| Tue Apr 29 | Fix top 3 issues from stranger test | Claude | 1 hr |
| Tue Apr 29 | PWA install check — add to home screen on iPhone | Jess | 15 min |
| Wed Apr 30 | **MVP complete — share with real St. Louis users** | Jess | — |

> **Apr 30 milestone: MVP live. Real data. Usable by strangers.**

---

## Phase 5 — Supabase + eBay (May 1–9)

| Date | Task | Owner | Est. Time |
|------|------|-------|-----------|
| May 1–2 | Supabase project setup, schema design | Both | 1 hr |
| May 1–2 | Migrate Saved items from localStorage to Supabase | Claude | 2 hr |
| May 5–7 | Basic user auth — email login or Google OAuth | Claude | 2 hr |
| May 5–7 | Saved items sync across devices | Claude | 1 hr |
| May 5–7 | eBay API key setup, test endpoint | Jess | 30 min |
| May 8–9 | eBay sold listings integrated into AI Identifier results | Claude | 2 hr |
| May 8–9 | Link from AI result → eBay search | Claude | 30 min |

---

## Phase 6 — Craigslist + Final Launch (May 12–16)

| Date | Task | Owner | Est. Time |
|------|------|-------|-----------|
| May 12–13 | Build Craigslist scraper with stealth/rotation | Claude | 3 hr |
| May 12–13 | Add category filter to feed (estate / garage / thrift) | Claude | 1 hr |
| May 14–15 | End-to-end test — all features with Supabase + eBay + Craigslist live | Jess | 45 min |
| May 14–15 | Fix issues, final polish | Both | 2 hr |
| Fri May 16 | **Full version live — share widely** | Jess | — |

> **May 16 milestone: Full version live. Supabase + eBay + Craigslist.**

---

*Owner key: Claude = Claude builds it | Jess = Jess runs it | Both = together*
