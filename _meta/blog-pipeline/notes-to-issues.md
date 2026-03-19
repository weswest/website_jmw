# Notes to Self — Future GitHub Issues

Capture ideas here; promote to `gh issue create` when ready.

## Inline Footnotes / Sidenotes System

**Need:** A way to have inline footnotes in articles where clicking or hovering a callout shows a text bubble with additional context. Not traditional bottom-of-page footnotes — inline popups that keep the reader in flow.

**Reference sites:** Some blogs use "sidenotes" (Tufte CSS style) that appear in the margin on wide screens and expand inline on mobile. Others use tooltip-style popups on hover/click.

**First use case:** The sprint cycle article needs a footnote on the "I've never read a proposal" paragraph — an aside about Management 101 (manage by objective, not by micromanagement) and links to other articles.

**Second use case:** The "system will never achieve flawless execution" section — a footnote aside about engineers dismissing automated tools because error risk is non-zero vs. human engineers never producing spot-on deliverables either.

**Implementation options to evaluate:**
1. Tufte-style sidenotes (CSS-only, margin placement)
2. Tooltip popups (JS, click/hover triggered)
3. Hugo shortcode that renders either approach

**Status:** Needs implementation. Create GitHub issue when ready.

## Newsletter / Content Ideas

- **Share "Wes Preference" instruction files.** Tied to article 02 (`02-enforcement-model`), "Self-Knowledge Through Fast Feedback" section — the paragraph about getting an objective mirror of management style. The agent-generated instruction files that capture preferences and dislikes from working sessions would make great newsletter content. Show the raw artifact: what the system actually produces when you tell it "capture my preferences and embed them." Readers get a concrete example instead of abstract advice.
