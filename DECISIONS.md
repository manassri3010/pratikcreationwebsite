# Decisions log

What was decided, when, and by whom. Newest at the bottom. Add an entry here
in the same PR as the change it covers, not after the fact.

Entries from before this log existed (2026-09-16 through 2026-10-26) are
reconstructed from the git history and prior chat context, backfilled on
2026-10-27 when this log was created — dates are accurate, but exact wording
of "why" is a summary, not a transcript.

---

**2026-09-16 — Manas + Claude.** Initial site build from the design/content
brief: hero, trust strip, process, samples, about pages. Sample-kit form
wired to Web3Forms for real submissions.

**2026-09-17** — Added `robots.txt`, `sitemap.xml`, a custom 404 page,
favicon, Open Graph/Twitter cards, and canonical URLs for basic SEO hygiene.

**2026-09-23** — Added the Concepts page with a click-to-enlarge gallery
lightbox.

**2026-10-08 — Brand identity change.** Replaced the original gold palette
with a new "flame" identity (ember orange, `--c-ember` family) across every
page, switched the display typeface to Poppins, and added the new logo,
monogram and favicon assets. Also: removed the homepage's logo-intro opening
animation and scoped the hero background video to just the hero section
(both judged as more distracting than additive), and redesigned the footer
site-wide into the current solid-ink block with CTA and link grid.

**2026-10-08 — Full redesign, staged.** Rebuilt the whole site against a
fuller design spec in 8 stages: shared design-system tokens/components
(Stage 1), Home as a 13-section layout (Stage 2), then Process, Samples,
About, Work, and Concepts in turn (Stages 3–7), finishing with an honesty
pass over every page (Stage 8) to make sure nothing stated a fact that wasn't
in the content brief — unconfirmed items were marked with `dev-flag` spans
instead of invented.

**2026-10-09 — Accessibility pass.** Fixed real contrast failures found by a
Lighthouse audit.

**2026-10-09 — Nav behavior.** Decided the nav should load as a full-width
bar (not a pill) and only morph into the floating pill once the user starts
scrolling, rather than being a pill from first paint.

**2026-10-09 — Home "difference" section, iterated twice.**
1. First replaced the static old-way/new-way comparison cards with an
   interactive toggle diagram (modeled closely on an ecomflow.com reference
   the user liked), with a smooth crossfade between states.
2. Replaced that again, same day, with the current design: two
   always-visible rows ("With Pratik" / "The Usual Way"), each a node chain
   with a continuously travelling pulse dot, the "usual way" row animating
   slower than the Pratik row. Chosen over the toggle because it reads at a
   glance without needing interaction. The "usual way" row intentionally
   shows no invented day-count — content honesty — just "No fixed timeline"
   plus a `dev-flag` asking for a real typical-range figure if one exists.

**2026-10-09 — Sitewide dot-field background.** Added a subtle dot-grid
background (canvas, `position:fixed; z-index:-1`) behind every page, with a
liquid cursor-displacement effect on hover-capable devices and a static
grid everywhere else (touch devices, `prefers-reduced-motion`). Positioned
behind content without needing any section's own background to change,
since a uniform dot grid looks identical whether pinned to the viewport or
scrolling with the page.

**2026-10-09 — Connected section visual.** Replaced a generic concentric-
ripple mark with an actual outlined iPhone (brand-orange stroke) with its
dynamic island as the signal's origin point, rings pulsing outward on a
staggered loop. Four composition variants were mocked up and shown to the
user before building; variant A (large phone, full concentric rings
centered on the island) was chosen.

**2026-10-13 — Trusted-brands logo marquee.** Replaced the 4-name text
placeholder trust strip on Home with an auto-scrolling marquee of 18 real
client logos (supplied by the user, with permission to use). Two visual
treatments — full colour vs. grey/white (brightening to colour on hover,
matching an ecomflow.com reference) — were mocked up and shown before
building; the grey/white treatment was chosen. Two of the 18 logos
(Cambridge, In Look) are brands already named elsewhere on the site as
real clients. **Open:** `about.html`'s own trust strip still has the old
4-name text placeholder — never updated to match, pending a decision on
whether to bring it in line with Home.

**2026-10-13 — Contact details.** Switched the site's contact email from
`hello@pratikcreation.com` to `info@pratikcreation.co.in` everywhere, added
the phone number (`+91 98202 62865`) as a `tel:` link next to it in the
footer and mobile nav, and added Instagram/LinkedIn icon links to the
footer. **Known gap, not yet resolved:** the sample-kit form posts through
an existing Web3Forms access key whose destination inbox wasn't
re-confirmed as part of this change — it may still be delivering to the old
address. Needs the account owner to either repoint that key's destination
in the Web3Forms dashboard, or issue a new key for the new inbox and hand
it over to swap in.

**2026-10-26 — Cookies, Terms & Conditions, rights-reserved, phone field.**
- Added a sitewide dismissible cookie banner. The site runs no analytics or
  tracking cookies today, so the banner and the new Terms page's Cookies
  section say exactly that, rather than listing cookie categories that
  don't apply yet — the only thing stored is a `localStorage` flag
  remembering the banner was dismissed.
- Added `terms.html` (Terms & Conditions, including the Cookies section)
  with generic, honest boilerplate for a Mumbai-based packaging
  manufacturer — explicitly **not** a substitute for the account owner's
  own legal review before relying on it. One fact is flagged rather than
  invented: the registered business name/address for legal correspondence.
- Footer copyright line now reads "All rights reserved", with a small
  Terms & Conditions link next to it.
- Added an optional "Phone / WhatsApp number" field to the sample-kit form.

**2026-10-27 — Project workflow.** Decided to run this project the same
disciplined way as the user's other project: every change on its own
`page/<slug>` or `feature/<slug>` branch, through a PR into `main`, never
pushed to `main` directly. `CLAUDE.md`, this file, and `CONTENT_STATUS.md`
created to carry the rules and state forward. Two stale, unrelated-history
branches (`claude/new-session-3b0v1v`, `backup-old-github-version`, from an
earlier abandoned attempt at this same site, superseded by the current
lineage) were found to add nothing the current project doesn't already
have; this session's GitHub access turned out not to permit deleting a
branch, so that's left for the account owner to do manually on GitHub.

**2026-10-27 — External disk inventoried; "UK Brand" identified.** A full,
read-only inventory of the PRATIK external disk (separate from this repo —
run via a local Claude Code session on the account owner's Mac) turned up
candidate logo/product files for brands already on this site, plus ~39
brands not yet on it. Full results live at
`~/Desktop/Pratik-Brand-Assets/INVENTORY.md` on that Mac.

Directly relevant here: **Manas confirmed the long-standing unnamed "UK
Brand" placeholder is Rawayat by Mannat** — a candidate bag-artwork file
carrying a London E7 address, which he recognized. The name is now
confirmed; the logo/photo assets are not yet added to the site (see
`CONTENT_STATUS.md`, "Pending asset review").

Also decided: no new brands (of the ~39 found) get added to the site right
now — only product photos/files for brands already live (Cambridge
Apparels, Teamo, Rawayat by Mannat). For each of those, a mockup and
screenshot of exactly what's being added and where must be shown and
explicitly approved before it goes live, same as every other page/feature
change under this project's workflow.
