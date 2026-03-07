# FluentGe Bug Report — March 7, 2026

## Found by Mustafa (browser audit)

### 🔴 Critical
1. **Premium page shows purchase to premium users** — FIXED ✅ (but Cloudflare may cache old version)
2. **Dashboard still shows 4 removed sections** — Cloudflare cache issue, old version served
3. **Difficult Words not syncing across browsers** — FIXED ✅ (now uses Firebase)

### 🟡 Medium
4. **Grammar lock icons hard to distinguish** — locked lessons look very similar to unlocked (both grey-ish in light mode)
5. **"117 სიტყვა" on homepage** — says 117 words learned but dashboard shows 259. Inconsistent count.
6. **Podcast page** — episode count says "35 ეპიზოდი · 3 უფასო" but all should be available for premium users

### 🟢 Minor / Visual
7. **Light mode contrast** — some text is too light on the cream background (grammar page lesson descriptions)
8. **Nav "პრემიუმი" button** — still shows for premium users, should change to something else or hide
9. **Dashboard "0 გრამატიკა დასრულებული"** — user completed "to be" but counter shows 0
10. **Games page** — "სურათის ქვიზი" (daily spotlight) has placeholder-looking image

## Needs Tornike's Review
- Georgian translations quality (audit in progress)
- Mobile responsiveness on his actual phone
- All game functionality
