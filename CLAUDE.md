# Pratik Creation website — working rules

Static HTML/CSS/JS site (no build step, no framework, no `package.json`), deployed to
pratikcreation.co.in via Cloudflare Pages/Workers directly from this repo (see
`wrangler.jsonc`), serving the repo root as static assets.

These rules apply to all work in this project from here on.

## Branching and PRs

- **Never push to `main` directly.** Every change goes on its own branch and reaches
  `main` through a pull request.
- One page or one feature per branch, named `page/<slug>` or `feature/<slug>`
  (e.g. `page/home`, `feature/contact-form`).
- Small, clear commits. Open one PR per page/feature with a short summary of what
  changed and how it was tested.
- Build shared layout and components first, then pages one at a time.
- After each page or feature: run the checks below, check it at phone and desktop
  widths, report back in two or three sentences, then **stop and wait for a
  go-ahead** before starting the next one.
- Ask before adding any dependency, paid service, or tracking script.
- Keep `DECISIONS.md` and `CONTENT_STATUS.md` up to date as part of the same PR,
  not as a separate afterthought.
- When unsure whether something is confirmed (a fact, a number, a client name, a
  policy), **treat it as not confirmed** — flag it with `<span class="dev-flag">
  Confirm: …</span>` or `Proof: …` (see "Content honesty" below), and ask rather
  than guess.

## Checks to run before every PR

There's no lint/build/test tooling in this repo yet (no `package.json`, no CI).
Until something is added deliberately (see below), "run the build, lint and any
tests" means, by hand, for every page touched:

1. Open the page locally (`python3 -m http.server` from the repo root is the
   pattern used throughout this project) and visually check it at a phone width
   (~390px) and a desktop width (~1440px).
2. Check the browser console for errors on that page.
3. Confirm no horizontal scroll at either width.
4. Confirm there's exactly one `<h1>` on the page.
5. If the change touches an animation, also check it under
   `prefers-reduced-motion: reduce`.

A reusable Playwright sweep script covering all pages against both widths has
been used throughout this project's history (ad hoc, in a scratchpad, not
committed) — rebuild it per-session rather than assuming a script is on disk.

**No lint/build/test command exists to add here automatically.** If/when this
project adopts one (even something minimal like `prettier --check` or an HTML
validator), ask before adding the dependency, then update this section to name
the exact command.

## Content honesty

Carried over from this project's original content brief and used throughout:
**do not invent facts, numbers, client names, or policies that aren't
established elsewhere in the project.** Where something is asserted on a page
but not yet confirmed, mark it inline:

```html
<span class="dev-flag">Confirm: <what's unconfirmed></span>
```

`.dev-flag` is hidden by default and only shown automatically when the page is
**not** served from `pratikcreation.co.in`/`www.pratikcreation.co.in` (see
`js/main.js`, "DEV FLAGS" section, and `html.show-dev-flags` in
`css/shared.css`) — so unconfirmed content fails safe toward hidden on the
live site, but stays visible to whoever is reviewing locally or in a PR
preview.

## Design system

- All shared styling lives in `css/shared.css`, organized into numbered
  sections (`/* ── N. NAME ── */`) — extend the numbering rather than
  scattering new rules. Page-specific styling lives in a `<style>` block in
  that page's own `<head>`, using page-prefixed class names
  (`.about-section`, `.terms-body`, etc.) rather than reusing another page's
  prefixed classes.
- Design tokens (`--bg`, `--ink`, `--accent`, spacing scale `--sp-*`, etc.)
  are defined once in `css/shared.css` section 2 — use the token, don't
  hardcode a value, and don't reference a spacing token that isn't defined
  there (this has caused real bugs twice in this project's history: an
  undefined `--sp-40` and an undefined `--sp-20` both silently collapsed
  layout spacing to zero).
- Shared interaction/animation behavior (nav scroll state, custom cursor,
  scroll-reveal, the dot-field background, the cookie banner) lives in
  `js/main.js`, one numbered section per behavior.
- Respect `prefers-reduced-motion: reduce` for every new animation — this
  project has a static fallback for the nav transition, flow-chain pulses,
  dot-field cursor interaction, and cookie-banner slide-in, and new
  animated components should follow the same pattern.
