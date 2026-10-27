# Content & page status

Live reference for what's built, what's confirmed, and what's still open.
Update this in the same PR as any change that affects it — don't let it
drift from reality. "Open" items use the same `dev-flag` markers that are
actually in the page (`Confirm: …` / `Proof: …`), so this file and the
pages themselves should never disagree.

Hosting: Cloudflare Pages/Workers, deployed from this repo's `main` branch
(`wrangler.jsonc`). Last reviewed: 2026-10-27.

## Pages

| Page | File | Status | Open items |
|---|---|---|---|
| Home | `index.html` | Live, fully built | Cambridge Apparels work-tile photo — still a placeholder, only a box dieline exists for it (not finished product photography), see Known issues; Teamo and "UK Brand" work-tile items **resolved 2026-10-27** — real product photos live, UK Brand renamed to Rawayat by Mannat; "Available now" chip list for Connected (`Confirm: which are available now`); shipping countries (`Confirm: countries`); Pantone matching process (`Confirm: Pantone matching process`); dieline/artwork support details (`Confirm: dieline and artwork support`); batch QC description (`Confirm: batch QC`); "usual way" lead-time figure, if one exists (`Confirm: typical range`) |
| Work | `work.html` | Live, fully built | UK brand name **resolved 2026-10-27** — renamed to Rawayat by Mannat (text only; this page's own Zone 1 head-image panel and Zone 2 scroll gallery don't show Teamo/Rawayat photos yet — only the Home work-tile grid was shown for approval and shipped, see Known issues for the natural follow-up) |
| Concepts | `concepts.html` | Live, fully built | none known |
| Process | `process.html` | Live, fully built | shipping countries, Pantone matching, dieline/artwork support, batch QC — same four items as Home (shared copy) |
| About | `about.html` | Live, fully built | UK brand name **resolved 2026-10-27** — renamed to Rawayat by Mannat in the trust-strip text (still no logo image here, see Known issues); trust strip still uses the old 4-name text placeholder style — not yet updated to the real logo marquee used on Home (2026-10-13 decision), pending a call on whether to bring it in line |
| Samples | `samples.html` | Live, fully built | kit contents list (`Proof: kit contents`); response-time commitment (`Proof: response time`); **sample-request delivery inbox not reconfirmed since the 2026-10-13 email switch — see Known Issues below** |
| Terms & Conditions | `terms.html` | Live, new as of 2026-10-26 | registered business name/address (`Confirm: registered business name and address for legal correspondence`); **page is a generic draft — flagged to the account owner as needing their own legal review before relying on it** |
| work-matiere (MATIÈRE project) | `work-matiere.html` | Live, fully built | none known |
| work-suzao (Studio Suzao project) | `work-suzao.html` | Live, fully built | none known |
| 404 | `404.html` | Live, fully built | none known |

## Known issues (not yet resolved)

- **Sample-kit form destination inbox unconfirmed.** `samples.html`'s form
  posts to Web3Forms using an access key that predates the 2026-10-13
  switch to `info@pratikcreation.co.in`. Nobody has confirmed which inbox
  that key actually delivers to. Needs the account owner to either repoint
  the key in the Web3Forms dashboard, or get a new key for the new address
  and hand it over.
- **About page trust strip out of date.** Still the old 4 client-name text
  placeholder; Home's equivalent section was replaced with a real 18-logo
  marquee on 2026-10-13. Not updated on About because it wasn't explicitly
  asked for at the time — needs a decision, not just a copy-paste, since it
  may be worth asking whether About should carry the full marquee or a
  smaller static set.

## Teamo and Rawayat by Mannat product photos — shipped 2026-10-27

Following the PRATIK external-disk inventory (on the account owner's Mac,
`~/Desktop/Pratik-Brand-Assets/INVENTORY.md` — not part of this repo), the
account owner sent over Teamo's bag-artwork PDFs and confirmed "UK Brand"
is Rawayat by Mannat. Three Teamo colourway renders and the one Rawayat
render were converted (`pdftoppm` → trimmed with ImageMagick), mocked up
in the real Home work-tile component, and shown for approval before
anything went live, per the account owner's explicit instruction. Approved
and shipped:

- `images/projects/teamo/hero.png` — Teamo's dark/vertical bag colourway
  (one of three shown; the other two cropped worse into the site's 4:5
  tile or had poor rope-handle contrast on the white colourway).
- `images/projects/rawayat-by-mannat/hero.png` — Rawayat by Mannat's
  black/gold bag.
- Home work-tile grid (`index.html`): both tiles now show the real photo;
  captions read "Paper bags" (the only type actually visible in the
  artwork); Rawayat's tile name changed from "UK Brand" to "Rawayat by
  Mannat"; both `dev-flag`s removed.
- "UK Brand" → "Rawayat by Mannat" text updated everywhere else it
  appeared (`about.html` trust strip, `work.html` hero list) — text only.

**Deliberately not done in this pass** (wasn't part of what was shown for
approval): `work.html`'s own Zone 1 head-image panel and Zone 2 scroll
gallery don't reference these photos yet — they're a different page with
different image treatment (`object-fit: contain` vs. the home tile's
`cover`), and adding them there is a natural small follow-up, not bundled
in without being shown first.

**Still open:** Cambridge Apparels — only a box dieline (`camb box.cdr` /
`.dxf`) was found for it, not finished product photography; still a
placeholder on the Home work-tile grid pending something presentable.

## Branches / history note

Two branches (`claude/new-session-3b0v1v`, `backup-old-github-version`)
existed from an earlier, abandoned attempt at this site with a completely
unrelated git history to the current `main`/`dev` lineage. Confirmed
2026-10-27 that neither adds anything the current site doesn't already
have (same giant-wordmark/GSAP Work-page concept, already rebuilt and
further developed on the current lineage). Flagged to the account owner to
delete manually on GitHub, since this session's access doesn't permit
branch deletion.
