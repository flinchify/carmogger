# CarMogger Full Rebuild Spec

## CRITICAL RULES
- NO emoji as visual elements anywhere on the site. Use SVG icons or real images.
- Use real car photos from Unsplash for all demo/mock content
- Everything must be centered and aligned properly
- The site must look like a $10M startup, not an AI-generated template
- Dark graphite base, metallic accents, ONE electric accent color (blue #3b82f6)
- Soft glass or satin surfaces, subtle motion
- NO rainbow gradients, NO neon overload, NO heavy glassmorphism on every card
- NO large particle effects over content — particles in page background ONLY, never reduce legibility
- Sign in must be a popup modal, not a separate page

## Unsplash Car Photos (use these exact URLs for demo content)
Use Unsplash source URLs for real car photos. These are free to use:
- BMW M3: https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80
- Porsche 911 GT3: https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80
- Nissan GT-R: https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80
- Toyota Supra: https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800&q=80
- Mercedes AMG: https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80
- Lamborghini: https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80
- Audi RS: https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80
- Ferrari: https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80
- Widebody BMW: https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80
- JDM Car meet: https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80
- Clean white Porsche: https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80
- Black sports car: https://images.unsplash.com/photo-1525609004556-c46c6c5104b8?w=800&q=80

## Tech Stack (keep existing)
- Next.js 15.5 App Router + TypeScript + Tailwind 4
- Neon PostgreSQL (serverless) via @neondatabase/serverless
- Gemini 2.0 Flash (AI scoring)
- Google OAuth (popup flow)
- Fonts: Outfit (headings) + Space Grotesk (body)

## Design System
- Background: #06080d (primary), #0c1018 (secondary), #0f1420 (cards)
- Accent: #3b82f6 (blue) — ONE accent color only
- Text: #f0f2f5 (primary), #8892a4 (secondary), #4a5568 (muted)
- Border: rgba(148, 163, 184, 0.08)
- Card radius: 20px
- Content max-width: 1440px
- Grid: 12-column, 24px gutters, 24px page padding
- Cards: dark graphite with subtle metallic/satin finish, NOT heavy glass
- Motion: subtle — hover lifts, smooth transitions, scroll reveals. No excessive animation.

## Scoring System (keep existing logic)
- 5 axes: Aura (25%), Larp (20%), Money (20%), Demand (20%), Hype (15%)
- CarMog Score = weighted average (0-100)
- Labels: APEX MOG (90+), MOG MACHINE (75+), SHOW STOPPER (60+), CLEAN BUILD (40+), STREET SLEEPER (20+), STOCK ANDY (<20)
- Keep the Gemini scoring prompt from src/lib/ai-scoring.ts as-is

## League System (keep existing)
- 6 leagues: Junkyard → Garage → Street → Track → Elite → Apex
- 3 divisions per league
- Use SVG icons for leagues, NOT emoji
- League icons should be clean geometric/automotive themed SVGs

## Pages to Build

### 1. Homepage (/)
Sections in order:
1. **Hero** — "Does your car mog?" headline, subtext, CTA button, ONE featured car photo (real Unsplash image, not placeholder). Show a demo score card next to the car.
2. **Social proof ticker** — "X cars rated · Y active users · Z total views" — use realistic numbers
3. **How it works** — 3 steps with clean SVG icons (Upload → AI Rates → Compete)
4. **Featured cars** — 3-4 cards with REAL car photos from Unsplash, scores, usernames. Cards should show the car image, score badge, car name, and username.
5. **Scoring system** — 5 axes explained with clean bars/visual, NOT emoji
6. **League progression** — Show leagues with SVG icons, XP thresholds, clean design
7. **Pricing section** — Free / Pro $15/mo / Elite $39/mo with feature comparison
8. **Final CTA** — "Ready to find out?" with button
9. **Footer** — Links, legal, social

### 2. Rate Page (/rate)
- Drag-and-drop upload area (1-4 images)
- Clean progress/loading state with car-themed animation
- Results: Large score ring, car identification, score bars, AI roast, highlights/lowlights
- "Sign up to save" prompt if not logged in
- "Share Score" and "Rate Another" CTAs after result

### 3. Dashboard (/dashboard) — THE BIG ONE
Desktop: 12-column grid, 1440px max, 24px gutters

**Frame:**
- Left rail: 88px fixed width, icon-only nav with tooltips
- Top bar: 72px fixed, page title left, global search center, notifications + avatar + "Upgrade" button right
- Main canvas: scrollable content

**Left rail nav items (icon + tooltip, no text visible):**
1. Dashboard (home icon)
2. My Cars (car icon)
3. Leaderboards (trophy icon)
4. Compare (vs icon)
5. Integrations (plug icon)
6. Billing (card icon)
7. Settings (gear icon)

**Row 1 — Above the fold (3 cards):**
- Cols 1-3: Profile/Rank card — avatar, @handle, linked socials icons, current rank badge (SVG), level progress bar, "next rank in X points"
- Cols 4-8: Featured Car / Score Hero — large car image, large CarMog score (biggest element on page), percentile badge "Top 7% this week", "Share score" button, "Re-analyze" button
- Cols 9-12: Quick stats stack — page views, leaderboard position, follower count, 7-day trend arrow, compact "Upload new car" button

**Row 2:**
- Cols 1-8: My Cars — horizontal scroll card list OR 2x2 grid. Each card: car photo, score, rank tag, last updated. First card = pinned/featured. Upload card always visible at front with "+" icon.
- Cols 9-12: Leaderboard preview — tabs (Global / Weekly / Local / Brand), show top 5, then "You: #43" row even if not in top 5

**Row 3:**
- Cols 1-7: Score Breakdown — horizontal bars for Aura/Larp/Money/Demand/Hype with values, confidence indicator per metric, small radar chart top-right as secondary visual only, AI explanation: 3 short reasons for the score
- Cols 8-12: Performance — 30-day views line chart, traffic sources, shares clicked

**Row 4:**
- Cols 1-8: How to Improve — actionable suggestions with buttons:
  - "Link Instagram to unlock Hype verification"
  - "Upload interior photos to improve confidence"
  - "Add wheel specs"
  - etc.
- Cols 9-12: Integrations/Share — copy profile link, download share card, Instagram bio button, subscription status

**Mobile dashboard:** Reorder by priority:
1. Featured car + CarMog score
2. Rank / level
3. Upload or re-analyze CTA
4. Nearby leaderboard position
5. Cars carousel
6. Metric bars
7. Views/performance
8. Integrations/billing

**Mobile bottom nav (5 items max):**
Home | Cars | Leaderboard | Compare | Profile

### 4. Public Profile (/u/[username])
- Clean profile page showing avatar, username, bio, linked socials
- Featured car with score
- All cars grid with scores
- Stats (total views, best score, avg score, cars count)
- Shareable — good OG meta tags

### 5. Leaderboard (/leaderboards)
Two types:
- **Macro:** Global, Weekly, Local, By Brand tabs
- **Micro:** "People near you", same brand, same city, ±5 places from your rank
- Always show the user's own position even if not in top list
- Real car photos in leaderboard rows

### 6. Compare (/compare)
- Side-by-side car comparison
- Two score breakdowns next to each other
- Visual diff on each axis

### 7. Pricing (/pricing)
Three tiers:

**Free — $0/mo**
- 1 active car profile
- 3 analyses/month
- Public CarMog page
- Basic score (no full breakdown)
- Share card WITH watermark
- Leaderboard preview
- 7-day basic analytics
- Instagram bio link

**Pro — $15/mo ($120/yr)**
- 5 active car profiles
- 30 analyses/month
- No watermark
- Full metric breakdown
- Full leaderboard access
- Compare mode
- 90-day analytics
- Profile theme customization
- Priority processing
- HireACreator sync

**Elite — $39/mo ($349/yr)**
- Unlimited car profiles
- 100 analyses/month
- Verified badge
- Advanced analytics
- Sponsor/media kit exports
- Featured discovery placement
- Webhook/API access (coming soon)
- Priority support

**Add-ons:**
- 10 extra analyses: $8
- 50 extra analyses: $25
- Custom share card pack: $9 one-time

### 8. Terms (/terms) — keep existing
### 9. Privacy (/privacy) — keep existing

## Auth Flow
- Google OAuth via popup modal (not page redirect)
- Sign in button opens a centered modal with Google sign-in button
- After auth, modal closes and page updates
- Cookie-based sessions (carmog_session)

## Mock Data for Demo
Use realistic demo data with real car photos. Create a mock data file with 8-12 entries:
- Real car names (2024 BMW M3 Competition, 2023 Porsche 911 GT3 RS, etc.)
- Realistic scores (varied — some 90+, some 60s, some 40s)
- Real-looking usernames (not "test_user")
- Real Unsplash car photos
- The leaderboard on the homepage should use this mock data

## DB Schema Updates Needed
Add these tables (in ensureTables):
- `profiles` — extended user profile (bio, theme, featured_car_id)
- `social_accounts` — linked social media accounts
- `analysis_jobs` — track analysis pipeline
- `analysis_results` — detailed analysis output
- `share_events` — track shares
- `subscriptions` — plan management
- `plan_entitlements` — what each plan allows
- `achievements` — badges/milestones

Update existing `cars` table: add `slug` column for /cars/[slug] URLs.

## Components to Build/Rebuild
- `DashboardLayout` — left rail + top bar + content area
- `DashboardSidebar` — 88px icon rail with SVG icons
- `DashboardTopBar` — breadcrumb, search, notifications, avatar, upgrade
- `ScoreHero` — large score display with car image
- `ProfileRankCard` — avatar, handle, rank, level progress
- `QuickStats` — stacked stat cards
- `CarGrid` — horizontal scroll or grid of car cards
- `LeaderboardPreview` — compact leaderboard with tabs
- `ScoreBreakdown` — horizontal bars + mini radar + AI explanation
- `PerformanceChart` — 30-day line chart (use canvas or simple SVG)
- `ImproveSuggestions` — actionable cards with buttons
- `ShareTools` — copy link, download card, Instagram button
- `PricingTable` — 3-tier comparison
- `AuthModal` — popup sign-in modal
- `LeagueBadge` — SVG-based, no emoji
- `BottomNav` — mobile navigation bar

## League SVG Icons (replace emoji)
Design simple, clean SVG icons for each league:
- Junkyard: wrench/gear icon
- Garage: garage door icon
- Street: road/highway icon
- Track: flag/circuit icon
- Elite: crown/star icon
- Apex: diamond/peak icon

## File Structure
```
src/
  app/
    page.tsx              (homepage)
    rate/page.tsx         (rate your car)
    dashboard/
      page.tsx            (main dashboard)
      layout.tsx          (dashboard layout with sidebar)
    leaderboards/page.tsx
    compare/page.tsx
    pricing/page.tsx
    u/[username]/page.tsx (public profile)
    terms/page.tsx
    privacy/page.tsx
    api/
      auth/google/route.ts
      auth/google/callback/route.ts
      auth/me/route.ts
      auth/logout/route.ts
      rate/route.ts
      init/route.ts
      leaderboard/route.ts
      profile/[username]/route.ts
      embed/[username]/route.ts
      views/route.ts
  components/
    Navbar.tsx
    Footer.tsx
    Particles.tsx         (background only, subtle)
    ScoreRing.tsx
    ScoreBar.tsx
    Confetti.tsx
    CarCard.tsx
    AuthModal.tsx
    DashboardSidebar.tsx
    DashboardTopBar.tsx
    ScoreHero.tsx
    ProfileRankCard.tsx
    QuickStats.tsx
    CarGrid.tsx
    LeaderboardPreview.tsx
    ScoreBreakdown.tsx
    PerformanceChart.tsx
    ImproveSuggestions.tsx
    ShareTools.tsx
    PricingTable.tsx
    LeagueBadge.tsx
    BottomNav.tsx
  hooks/
    useScrollReveal.ts
  lib/
    ai-scoring.ts         (keep as-is)
    auth.ts
    db.ts                 (lazy proxy, keep as-is)
    leagues.ts            (update: remove emoji, add SVG refs)
    xp.ts
    stripe.ts
    mock-data.ts          (NEW: realistic demo data with Unsplash URLs)
```

## Performance Requirements
- All pages must pass Next.js build with no errors
- Particles must not affect frame rate — keep particle count low, pause when tab not visible
- Images must use next/image or proper loading="lazy"
- Dashboard should feel snappy — no full-page loading states

## What NOT to Do
- No emoji as visual elements (league badges, XP sources, etc.)
- No placeholder gray boxes where images should be
- No "lorem ipsum" or obviously fake text
- No cluttered all-in-one dashboards
- No rainbow/neon color schemes
- No heavy glassmorphism on every single card
- No particles over content areas
- No mocked stats that say "0" — use realistic demo numbers
