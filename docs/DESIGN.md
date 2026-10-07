# Design Direction: Jovanka Surya Dilla

**Status:** Implemented direction for the public portfolio.

**Goal:** A modern, minimal, easy-on-the-eyes portfolio with a soft monochrome palette.

## Visual character

Keep the experience calm, personal, and direct. Use generous spacing, a clear type scale, a few quiet dividers, and real project evidence. Let the portrait and work provide personality; interface decoration should stay in the background.

The site should feel contemporary and human. Avoid dense labels, all-caps technical tags, repeated pills, ornate editorial flourishes, bento layouts, gradients, neon accents, glass effects, and motion without a purpose.

## Color system

The palette uses layered neutral gray with a restrained green-gray undertone. Color should support reading rather than become the subject.

| Token | Hex | Use |
|---|---|---|
| Page | `#F3F4F2` | Main background |
| Surface | `#E8EAE7` | Alternate section and form area |
| Raised surface | `#FAFBF9` | Small elevated content surfaces |
| Ink | `#292E2B` | Main text |
| Muted text | `#69716C` | Descriptions and secondary information |
| Accent | `#68766E` | Links, subtle emphasis, and focus states |
| Accent wash | `#DCE2DD` | Quiet highlight surfaces |
| Dark surface | `#343A37` | Primary buttons and credentials section |
| Dark text | `#F5F6F4` | Text on dark surface |

Keep contrast readable. Use the accent sparingly. Do not introduce unrelated bright hues. Shadows should be soft and rare; use spacing and surface tone to create separation.

## Typography

Use Inter across the interface. Headings use medium weight, compact line-height, and restrained negative tracking. Paragraphs use regular weight, comfortable line-height, and muted ink. Avoid oversized outlined lettering, decorative serif mixing, and monospaced labels outside small technical details.

## Layout and components

* Keep the content within a centered width of about `1152px`, with 20px mobile and 48px desktop gutters.
* Give each primary section at least one viewport of vertical room. Use a minimum height so sections with longer content can grow naturally; never use a fixed height that clips content.
* The navigation is compact, quiet, and readable, with one contact action.
* The hero pairs a concise personal introduction with the portrait. Put the role, a short description, two clear actions, and a small list of focus areas together. Add restrained perspective tilt to the portrait and gently move its soft background shape.
* Principles use three simple text columns with subtle top rules.
* Projects use a consistent list with a neutralized preview, readable summary, a few technology names, and direct links.
* Credentials use a calm dark-gray section and concise rows. Evidence opens in an accessible modal.
* Contact combines social links with a plain, clearly labeled form.
* Use modest corner radii (6–10px) only for controls and image frames. Avoid heavy shadows and decorative containers.

## Interaction and accessibility

Reveal content gently as sections enter the viewport. Add slight pointer tilt to the portrait and project previews, a fine page progress line, and small depth shifts that support orientation. Keep motion quiet and short; no forced scroll snapping, looping animation, or fixed section heights. Respect `prefers-reduced-motion` by removing movement and showing content immediately. Maintain semantic headings, visible keyboard focus, descriptive image text, and touch targets of at least 44px. Essential information and links must work without hover.

## Content direction

Use Indonesian as the primary language. Write in a straightforward, personal tone. Prefer short, specific explanations over repeated technical slogans. Verify social and project links before publishing.
