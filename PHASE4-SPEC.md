# Phase 4: Design Overhaul — TypoTab-style + Real Data Only

## Reference: https://www.typotab.com/
Study the TypoTab design patterns:
- Bright vibrant hero with colorful gradient sky background (blues/greens/warm tones)
- Clean white/light floating cards over colorful backgrounds
- Smooth hover animations on EVERYTHING (scale, shadow lift, color transitions)
- Simple centered layout — nothing off-center
- Crisp bold typography with generous spacing
- Feature cards in clean grids
- Minimal, professional — not dark/gamer

## CRITICAL CHANGES

### 1. REMOVE ALL MOCK DATA
Delete src/lib/mock-data.ts entirely. 
Every section that referenced mock data must now:
- Pull from the database via API routes, OR
- Show empty states with CTAs ("Be the first to get rated", "No cars yet — upload yours")
- The homepage featured cars section becomes a "Featured Cars" grid that reads from DB (featured=true on cars table)
- Leaderboard reads from /api/leaderboard
- If no data exists, show clean empty states — NOT fake data

### 2. HERO REDESIGN
Replace the dark background hero with:
- A bright blue sky gradient background with subtle palm tree silhouettes or a warm outdoor/car-meet vibe
- NOT dark. Think California car meet on a sunny day.
- Use CSS gradients: linear-gradient from sky blue (#87CEEB / #60A5FA) to warm blue (#3B82F6) with white clouds
- Add floating card placeholders/slots where the user can see "featured cars" (seeded by admin)
- Main headline: "Does your car mog?" with a subtitle prompting users to upload
- Big CTA: "Upload Your Car" button
- The hero should feel inviting and exciting, like you want to show off your car

### 3. DESIGN DIRECTION — TypoTab Style
- Light/bright theme for public pages (homepage, pricing, leaderboards)
- Cards: white/very light with subtle shadows, NOT dark graphite
- Background: soft gradients, light colors
- Text: dark on light (#1a1a2e on white)
- Accent: still blue #3b82f6 for buttons/links
- Dashboard can stay dark (users expect dark dashboards)
- Hover animations on ALL interactive elements: 
  - Cards: scale(1.02) + shadow lift on hover
  - Buttons: slight scale + brightness change
  - Links: color transition
  - Nav items: background highlight
- Smooth transitions: 200-300ms ease-out on everything
- NO janky scroll-reveal animations. Remove the scroll-reveal system entirely — it causes lag
- Instead use simple CSS transitions that feel instant and smooth

### 4. CENTER EVERYTHING
- Every section must be max-w-[1200px] mx-auto centered
- Grid items must be centered within their containers
- Text alignment: centered for section headers, left-aligned for card content
- Pricing cards must be equal width and centered
- Footer columns must be evenly spaced and centered

### 5. FIX ALL BUTTONS
- Every button must have proper href/onClick handlers
- "Get Your Score" → links to /rate
- "Sign In" → opens AuthModal popup
- "View Leaderboard" → links to /leaderboards
- Pricing CTAs → link to /rate (free) or future Stripe checkout
- Nav links must all work
- Mobile nav must work

### 6. FIX NAVBAR
- Remove lag — no heavy blur/backdrop-filter if it causes jank
- Use a simple solid background on scroll instead of expensive blur
- Buttons must be properly positioned and clickable
- Mobile menu must open/close smoothly
- Sign in opens AuthModal (popup)

### 7. HOMEPAGE SECTIONS (in order)
1. **Hero** — Blue sky gradient bg, palm tree silhouettes, headline + subtitle + CTA, floating featured car cards (from DB or empty state placeholders)
2. **How it works** — 3 clean steps, white cards, SVG icons, centered
3. **Scoring system** — 5 axes explained in clean horizontal layout
4. **Featured cars** — Grid pulling from DB (or empty state). Each shows car photo, score, name.
5. **Leagues** — Clean league progression, SVG icons
6. **Pricing** — 3 tiers, centered, equal width cards, Free/Pro/Elite
7. **CTA** — Final call to action
8. **Footer**

### 8. API ROUTES FOR REAL DATA
Create/update these API routes:
- GET /api/featured — returns cars where featured=true, with user info
- GET /api/leaderboard already exists — make sure homepage uses it
- GET /api/stats — returns aggregate stats (total cars, total users, total views) from DB

### 9. SIGN IN FLOW
- AuthModal popup (already built) must actually work
- Google sign-in button in modal redirects to /api/auth/google
- After OAuth callback, redirect back to the page they were on
- Navbar shows avatar + username when logged in
- Logout button in dropdown

### 10. RATE PAGE
- Clean, bright design matching the new homepage
- Upload area should be inviting (light card with dashed border)
- Results display should be clean with proper score ring + bars
- "Sign up to save your score" if not logged in
- "Share" button generates a shareable link

### 11. DASHBOARD
- Dashboard can stay dark theme (it's a different context)
- But fix all alignment issues
- Make sure the 12-col grid actually works
- All hover animations must be smooth
- Remove any mock data — pull from DB or show empty states

### 12. FILE CLEANUP
- Delete src/lib/mock-data.ts
- Remove all imports of mock-data
- Remove the scroll-reveal animation system (useScrollReveal hook, .scroll-reveal CSS classes)
- Replace with simple CSS hover transitions

### 13. CSS OVERHAUL
Update globals.css:
- Add light theme variables for public pages
- Keep dark theme for dashboard
- Remove scroll-reveal classes
- Add smooth hover transitions as utility classes
- Fix the particle system or remove it from public pages (only keep on dashboard if at all)
- Remove excessive animation keyframes that cause jank

## FONTS (keep)
- Outfit for headings
- Space Grotesk for body

## BUILD REQUIREMENTS
- npx next build must pass with 0 errors
- No TypeScript errors
- No unused imports
- Every page must render without crashing
