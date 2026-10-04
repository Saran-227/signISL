# SignISL Website UI Kit

## Overview
A full high-fidelity mockup of the SignISL marketing website — 16 sections, fully responsive, with live interactions (slideshow, demo, form submit, scroll-to-top).

## Files
| File | Description |
|---|---|
| `index.html` | Full 16-section website prototype |
| `styles.css` | All CSS (~370 lines): tokens, layout, components, animations, responsive |
| `app.js` | Vanilla JS: slideshow, demo translate, form, scroll-to-top, stagger animations |

## Design Width
**1200px max-content** · Responsive down to 375px mobile

## Sections Implemented
1. **Navbar** — fixed, glass blur, logo, nav anchors, CTA buttons
2. **Hero** — animated orb BG + dot grid, H1, CTAs, trust badges, live avatar card with floating micro-cards
3. **Awards Slideshow** — 5-slide auto-carousel (4s), prev/next arrows, dot indicators, stat pills
4. **Problem** — 5 emotional scenario cards (3+2 grid)
5. **How It Works** — 3-step horizontal flow with animated connectors
6. **Solutions** — 6 glassmorphism cards on dark BG
7. **Demo** — Interactive: language select, textarea, quick-tap chips, voice button, translate → avatar output
8. **Industries** — 6 cards with colored left-border accents
9. **Deployment** — 3 real-world cards (railway, metro, airport) with dark image areas
10. **Technology** — Animated vertical 5-node tech stack with traveling-dot connectors
11. **Research Timeline** — Alternating left/right timeline, past vs. future styling
12. **Stats** — 4 glassmorphism stat cards (68M+, <200ms, 12+, ₹25K)
13. **Testimonials** — 3 testimonial cards + partner logo row
14. **Roadmap** — 6 roadmap cards with status pills
15. **CTA** — Contact form with success state, contact details, social links
16. **Footer** — 4-column grid, legal bar

## Interactive Features
- **Slideshow:** auto-advances every 4s; prev/next; dot click to jump
- **Demo:** chip tap fills textarea; translate button shows translation after 900ms
- **Form:** submit shows success message, button changes to teal
- **Scroll-to-top:** appears after 400px scroll
- **Card stagger:** IntersectionObserver fades in card grids

## Usage
Open `index.html` directly in browser — no build step needed.
Reference `../../assets/` for logo and avatar SVGs from this path.
