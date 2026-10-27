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
| Home | `index.html` | Live, fully built | "Available now" chip list for Connected (`Confirm: which are available now`); product-types + photo for Cambridge Apparels & Teamo work tiles — **candidate source files now identified, see "Pending asset review" below**; UK brand name/logo/photo (`Proof: name + logo + photo`) — **name confirmed 2026-10-27 (Rawayat by Mannat), candidate product file found, logo/photo still pending**; shipping countries (`Confirm: countries`); Pantone matching process (`Confirm: Pantone matching process`); dieline/artwork support details (`Confirm: dieline and artwork support`); batch QC description (`Confirm: batch QC`); "usual way" lead-time figure, if one exists (`Confirm: typical range`) |
| Work | `work.html` | Live, fully built | UK brand name (`Proof: name`) — **confirmed 2026-10-27: Rawayat by Mannat, pending asset review before the page text/photo changes** |
| Concepts | `concepts.html` | Live, fully built | none known |
| Process | `process.html` | Live, fully built | shipping countries, Pantone matching, dieline/artwork support, batch QC — same four items as Home (shared copy) |
| About | `about.html` | Live, fully built | UK brand name + logo (`Proof: name + logo`); **trust strip still uses the old 4-name text placeholder — not yet updated to the real logo marquee used on Home (2026-10-13 decision), pending a call on whether to bring it in line** |
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

## Pending asset review (not yet shown or approved — nothing live changed)

A full inventory of the PRATIK external disk was completed 2026-10-27 (on
the account owner's Mac, at `~/Desktop/Pratik-Brand-Assets/INVENTORY.md` —
not part of this repo). It turned up candidate files for three of this
project's long-standing open items:

- **Cambridge Apparels** — a box dieline (`camb box.cdr` / `.dxf`). A
  dieline is a production/cutting file, not necessarily finished product
  photography — needs a look before deciding if it's presentable as-is.
- **Teamo** — three bag-artwork PDFs; the Teamo logo appears on the bag
  but there's no standalone logo file. The logo would need extracting from
  the artwork.
- **"UK Brand"** — **confirmed 2026-10-27 as Rawayat by Mannat** (the
  account owner recognized the brand from a candidate bag-artwork PDF
  carrying a London E7 address). One bag-artwork PDF found; no standalone
  logo file.

**None of this has been added to the website yet.** Per the account
owner's instruction (2026-10-27): no new brands get added right now, and
for these three, a mockup + screenshot of exactly what's being added and
where must be shown and explicitly approved before anything goes live —
same discipline as every other page/feature change. Source files need to
be sent over (this session has no access to the account owner's Mac) before
that mockup can be built.

## Branches / history note

Two branches (`claude/new-session-3b0v1v`, `backup-old-github-version`)
existed from an earlier, abandoned attempt at this site with a completely
unrelated git history to the current `main`/`dev` lineage. Confirmed
2026-10-27 that neither adds anything the current site doesn't already
have (same giant-wordmark/GSAP Work-page concept, already rebuilt and
further developed on the current lineage). Flagged to the account owner to
delete manually on GitHub, since this session's access doesn't permit
branch deletion.
