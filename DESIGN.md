# Design System: Obsidian & Atmosphere — Signal Archive

**Status:** Design brief only — no application code is changed by this document.  
**Reference influence:** the calm editorial hierarchy, oversized typography, and generous whitespace in Dymas Alfin's “Personal Portfolio Website — Animations” on Dribbble. This is a directional reference, not a layout, asset, or interaction to copy.

## 1. Visual Theme & Atmosphere

**Signal Archive** is a warm, editorial portfolio for an AI Orchestrator and Agentic AI Engineer. It should feel like opening a carefully assembled technical field journal: thoughtful, precise, human, and quietly confident. The page makes complex systems feel legible rather than theatrical.

The visual premise keeps the reference's clarity and large typographic rhythm, but replaces its polished designer-portfolio sensibility with a more individual identity: **living documentation for trustworthy AI systems**. Editorial warmth meets archival structure, with system signals, proof references, and deliberate technical annotations. The result must never resemble a generic AI dashboard, a neon “future” interface, or the referenced screen one-for-one.

### Differentiators from the reference

| Area | Signal Archive direction |
|---|---|
| Primary narrative | Engineering evidence and the journey from ambiguity to reliable AI behavior, instead of a UI/UX designer showcase. |
| Visual metaphor | Field notes, archive stamps, signal lines, and source citations; not fashion-editorial image blocks. |
| Hero composition | A split “statement + live system index” with an offset signal map, rather than a centered or image-led introduction. |
| Work presentation | Case-file rows that reveal problem, decision, architecture, outcome, and proof. |
| Motion | Data-like, restrained progress and disclosure cues—never decorative looping animation. |
| Color character | Ink, parchment, oxidized terracotta, and muted sage verification states; no imitation of the reference’s rose/brown palette proportions. |

## 2. Color Palette & Roles

| Name | Value | Role |
|---|---|---|
| Archive Paper | `#F5F1E8` | Main canvas; warm enough to feel authored, light enough to preserve editorial clarity. |
| Weathered Paper | `#E8E1D3` | Alternate section surface and quietly separated content plane. |
| Carbon Ink | `#171A1A` | Primary text, navigation, rules, and the high-contrast technical section. |
| Graphite Annotation | `#5E625F` | Body copy, supporting metadata, and inactive UI. |
| Oxidized Terracotta | `#A94C35` | Primary action, active section marker, selected work emphasis, and intentional editorial heat. |
| Clay Wash | `#E8C7B9` | Low-emphasis accent surface and hover reveal background. |
| Verification Sage | `#61705A` | Verified credentials, successful system states, and evidence markers only. |
| Night Archive | `#202523` | Dark proof and contact sections; softer and greener than pure black. |
| Paper on Night | `#F7F3EB` | High-legibility text on dark surfaces. |
| Quiet Rule | `rgba(23, 26, 26, 0.16)` | Hairline dividers and non-interactive boundaries. |

Do not use gradients, neon cyan/purple, glassmorphism, or large soft glows. Depth comes from paper-tone changes, hairline rules, and the occasional dark archival panel—not from drop shadows. If a shadow is needed for a modal, use a soft charcoal shadow with low opacity.

## 3. Typography Rules

Use the existing local Geist family for product-like clarity, with a single expressive serif display face added only after implementation approval. A suitable direction is **DM Serif Display** or **Instrument Serif**; use one, not both. If no new font is installed, retain Georgia as the fallback display face.

* **Display:** serif, regular weight, tight tracking (`-0.06em` to `-0.075em`), high contrast, and compact leading (`0.84–0.94`). Use it for identity statements and project titles—not for technical metadata.
* **Interface and body:** Geist sans, regular to medium weight. Body copy is 16–18px with `1.6–1.7` line-height, in Graphite Annotation rather than full Carbon Ink.
* **System labels:** Geist Mono, 11–12px, uppercase, `0.12–0.16em` tracking. Examples: `INDEX / 01`, `EVIDENCE VERIFIED`, `SYSTEM NOTE`.
* **Numbers and verbs:** retain normal numerals; reserve italics for one meaningful word in a major statement, never for decoration.

## 4. Component Stylings

### Navigation

Use a slim fixed navigation with a wordmark on the left, section index links in the middle on desktop, and one outlined “Start a conversation” action on the right. It begins transparent, then becomes Archive Paper with a bottom hairline after scrolling. The active link receives a small terracotta index dot or underline, not a filled pill.

### Buttons and links

Primary actions are compact, rectangular controls with 4px corners: Carbon Ink fill with Paper on Night text, turning Oxidized Terracotta on hover. Secondary actions are text links with a ruled underline that travels toward the arrow on hover. All interactive targets must remain at least 44px high on touch devices.

### Case-file project rows

Projects are full-width editorial rows, not a repeated bento-card grid. Each has an index, classification tags, a large title, a concise system outcome, and a proof link. Hovering reveals a restrained visual artifact (existing project SVG or screenshot) from the row’s right edge while a terracotta rule advances. On mobile, the artifact sits below the text and is visible without hover.

### Evidence cards

Credentials appear as narrow, bordered proof records in the Night Archive section. Each record includes issuer, date, verification state, and a “view evidence” action. Use Verification Sage exclusively for confirmed proof. Opening evidence uses the existing accessible modal pattern.

### Inputs and forms

Inputs have Archive Paper backgrounds, a single Carbon Ink/Quiet Rule border, 4px corners, and clear labels above fields. Focus is a 2px Oxidized Terracotta outline offset by 3px. Avoid floating labels and opaque rounded form panels.

### Decorative elements

Use only purposeful graphics: a small offset orbital/signal contour in the hero, a vertical section index line, source-style footnotes, and project-specific diagrams. Decorations must not overlap essential copy or become a generic AI motif.

## 5. Layout Principles

Use a maximum content width of `1440px`. Desktop gutters are 48px, tablet 32px, and mobile 20px. Standard vertical rhythm is 112px between major sections on desktop, 80px on tablet, and 64px on mobile.

The principal grid is asymmetric:

```
[ persistent section label / index ]  [ main narrative, work, or evidence ]
              0.7fr                               1.3fr
```

The left rail is an orientation device, not a second column of prose. On small screens it moves above the content and remains compact. Preserve large empty areas around the hero statement; whitespace is part of the confidence, not unused space to fill.

## 6. Page Narrative & Proposed Sections

1. **Hero — “Merancang AI yang bisa dipertanggungjawabkan.”**  
   A two-column opening. The left carries availability, location, and a simple signal contour; the main column holds the personal statement, a short Indonesian bio, and two actions: selected work and CV. A narrow “System Index” lists current focus: agentic systems, knowledge infrastructure, product engineering.
2. **Operating principles — “Dari sinyal menjadi sistem.”**  
   Three numbered principles: bounded agency, explainable product decisions, and reliability under change. Make these read as operating commitments, not service cards.
3. **Selected systems — “Case files, not thumbnails.”**  
   A sequential list of projects. Each row explicitly answers: what was the friction, what decision was made, what changed, and where can it be verified.
4. **Proof ledger — “Belajar yang dapat ditelusuri.”**  
   A dark archival section for credentials and competitions. Offer an evidence viewer rather than oversized certificate imagery in the page flow.
5. **Direct uplink — “Punya persoalan yang perlu dibuat lebih jelas?”**  
   An intentional contact endpoint in Oxidized Terracotta or Night Archive, with email as the primary channel and GitHub/LinkedIn as supporting routes.
6. **Footer — “Archive closed, signal remains.”**  
   A small provenance line, current year, and quiet links. No decorative social icon wall.

## 7. Motion & Interaction

Motion should make hierarchy and causality clearer.

* On first entry, reveal labels, display text, and hero index in a stagger no longer than 600ms total.
* Section headings may rise by 8–12px while fading in once when entering the viewport.
* Project rows expand their horizontal rule and reveal their artifact over 220–320ms with `cubic-bezier(0.16, 1, 0.3, 1)`.
* Navigation state and underlines transition in 150–200ms.
* Modals fade and scale subtly, preserving the current keyboard and Escape behavior.
* Respect `prefers-reduced-motion: reduce`: show final states immediately, remove position movement, and keep only essential opacity changes.

Never auto-scroll, parallax, loop a loader, animate text by individual character, or add motion solely because the reference includes animation.

## 8. Accessibility & Content Guardrails

* Meet WCAG AA contrast: body text and controls need at least 4.5:1; large display text at least 3:1.
* Keep semantic headings in order, provide descriptive labels for project/evidence links, and preserve visible keyboard focus.
* Do not depend on hover for project summaries, verification state, or navigation.
* Use Indonesian as the primary public-facing language. Technical terms can be bilingual where they increase precision.
* Replace placeholder identity and social links before production. Never present a credential as verified unless its source link or artifact is available.

## 9. Implementation Acceptance Criteria

The future implementation is successful when:

- It clearly reads as a portfolio for an AI systems engineer, not a UI/UX portfolio clone.
- The hero, project list, and proof ledger follow the Signal Archive narrative above.
- Existing public routes, contact API, credential modal accessibility, and admin functionality continue to work.
- It is responsive from 320px through wide desktop without clipped display text or hover-only critical content.
- Animations are subtle, purposeful, and reduced-motion safe.
- The final UI is checked side-by-side against this document for tone and differentiation, not pixel-matched against the Dribbble reference.

## 10. Execution Prompt

When ready, give the implementation agent this prompt from the repository root:

> Read `DESIGN.md` in full and redesign the public portfolio to implement the **Signal Archive** system. Treat the Dymas Alfin Dribbble link only as high-level inspiration for editorial clarity; do not copy its layout, assets, wording, or distinctive visual compositions. Preserve the existing Next.js routes, data models, admin area, contact behavior, and accessibility. First inspect the current implementation and existing uncommitted changes. Then update the public portfolio components and styles, test the production build, and report every changed file.

If using a coding assistant in this workspace, mentioning `DESIGN.md` in the request is enough; the file is the durable source of truth. You do not need to paste the whole document each time. Add explicit preferences (for example, “use the current project SVGs” or “do not add external fonts”) to that prompt when they matter.
