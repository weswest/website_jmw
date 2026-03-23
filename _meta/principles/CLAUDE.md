# Website Design & Layout Instructions

For voice, style, writing guide, and broader themes, see `/_meta/blog-pipeline/CLAUDE.md`.

## Content Strategy

### Articles
- Nomis articles: full text hosted on site, link back to Nomis original
- Novantas articles: full text hosted on site (originals no longer online; take down if asked)
- Personal think pieces: canonical on site
- Substack: distribution layer (summary + link for employer pieces, full duplication for personal pieces)
- No separate blog section. Everything is "Writing." Professional AI think pieces, possibly recipes, all tagged by topic.

### Case studies (supporting the pillars)
Starting set:
- The Complexity Tax engagement (best "guided C-suite to better decision" story)
- The Model Factory at Novantas (>10% of US deposits)
- The Huntington turnaround (eNPS -45 to +92, $30B hedge program)
- The Financial Intelligence Engine at Nomis (carefully framed to avoid patent territory)

Case study articles link from the pillars on the About page. A CEO reads the pillar, clicks through to the proof if they want it.

### Speaking
Lightweight at launch: featured Nomis webinar links, conference history to be compiled over time. Gap during Huntington/COVID years acknowledged.

## Page Structure

Three pages. Nav: **Home | Writing | Speaking**

### Home (= About + Contact combined)
The home page IS the about page. This is the primary landing for a C-suite scanner.

1. **Top:** Name, positioning statement ("Turning hard analytical problems into decisions executives act on. Now with AI."), headshot. Below photo: "Current: [Nomis logo]" then "Prior: [JPMC logo] [Citi logo] [Huntington logo] [Novantas/Curinos logo]". No role titles, no dates, no descriptions — the logos alone do the credibility work. No hero banner. Ben Evans energy — quiet authority, not a brand.
2. **Four pillars:** Cards or blocks — bold title, supporting sentence(s), link to a relevant article. 2x2 grid on desktop, stacked on mobile.
3. **Five principles:** Visually subordinate to pillars. Simple numbered list with bold assertion + one-sentence follow-up. No cards.
4. **Latest writing:** 2-3 most recent pieces, Evans-style cards (title + summary + date). Draws the eye to the Writing page.
5. **Contact:** Bottom of page. LinkedIn, email, maybe GitHub. A sentence or two. No form. No "hire me" or "book a call" language.

### Writing
Evans-style essay listing. Cards with title, date, 2-3 sentence summary. No images in listing view. Filterable by tag: source (Nomis / Novantas / Personal), topic (AI, Pricing, Modeling, Leadership, etc.). Most recent first. Option to feature/pin a few at top.

### Speaking
Lightweight. Featured webinar embeds or links at top. Below: simple list of engagements (event, topic, date) filled in over time. Can be thin at launch.

## Visual Direction

**Reference site: ben-evans.com.** Quiet authority. Clean, sparse, lets the content do the work.

What to steal from Evans:
- Clean single-column layout, no visual noise
- Essays page: cards with title + date + 2-3 sentence summary, topic tags for filtering, no images in listing
- Minimal nav: just the things that matter
- Overall posture: "I don't need to convince you this is worth reading"

What to change:
- Home page is About (pillars, principles, career arc), not an essay feed
- More structure on Home than Evans has — multi-part argument, not a one-section bio
- Writing page uses Evans essay-card format with source tags in addition to topic tags
- Color/font palette: not a priority. Clean and professional. No strong opinion on dark vs. light yet.

**Core design principle: Design for fluidity, not fixed width.** Use percentages, viewport units, and flexible layouts — never hardcode pixel widths that break at different screen sizes. The site must look good from 375px mobile to 2560px ultrawide without media query hacks for every breakpoint.

## Navigation Flow

Home → About (the argument, which IS the home page) → Writing (the evidence)
