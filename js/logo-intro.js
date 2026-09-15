/* ============================================================
   PRATIK CREATION — logo-intro.js
   Big opening screen: PRATIK / hangtag / CREATION, centered.
   As the user scrolls:
     - the tag exits upward and fades out early
     - the two text lines shrink + translate to land exactly on
       the real (invisible) nav logo's position and size
     - right as they land, crossfade: intro text fades out,
       real nav fades in — from then on it's just the normal nav
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const introSection = document.getElementById('logoIntro');
  const introStack    = document.getElementById('introStack');
  const introTag      = document.getElementById('introTag');
  const nav            = document.querySelector('.nav');
  const navLogo        = document.querySelector('.nav__logo');
  const bgVideo         = document.getElementById('bgVideo');

  if (!introSection || !introStack || !nav || !navLogo || typeof gsap === 'undefined') {
    // fail safe — if anything's missing, just show the nav normally
    if (nav) { nav.style.opacity = 1; nav.style.pointerEvents = 'auto'; }
    if (introSection) introSection.style.display = 'none';
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    introSection.style.display = 'none';
    gsap.set(nav, { opacity: 1, pointerEvents: 'auto' });
    if (bgVideo) { bgVideo.style.opacity = 1; bgVideo.play().catch(() => {}); }
    return;
  }

  let startCenter, endCenter, startSize, endFontScale;

  function measure() {
    // stack's own natural size at scale 1 (reset transform first so the
    // measurement isn't polluted by a previous scroll-driven transform)
    gsap.set(introStack, { x: 0, y: 0, scale: 1 });
    const stackRect = introStack.getBoundingClientRect();
    startSize = { w: stackRect.width, h: stackRect.height };

    // start: centered on screen
    startCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    // end: exactly where the real nav logo sits (nav is invisible but
    // still laid out normally, so its rect is a true, responsive target)
    const navRect = navLogo.getBoundingClientRect();
    endCenter = { x: navRect.left + navRect.width / 2, y: navRect.top + navRect.height / 2 };

    // scale ratio: how big the intro text is vs. the real nav logo's font-size
    const introFontSize = parseFloat(getComputedStyle(introStack.querySelector('.logo-intro__line')).fontSize);
    const navFontSize   = parseFloat(getComputedStyle(navLogo).fontSize);
    endFontScale = navFontSize / introFontSize;
  }

  measure();
  window.addEventListener('resize', measure);

  gsap.set(nav, { opacity: 0, pointerEvents: 'none' });
  gsap.set(introTag, { opacity: 1, y: 0 });
  if (bgVideo) bgVideo.pause();
  let videoStarted = false;

  function applyProgress(p) {
    // text stack: interpolate scale + position every tick (recomputed,
    // not just lerped endpoints) so the box's *center* always lands
    // exactly on the interpolated target point, regardless of scale
    const s = gsap.utils.interpolate(1, endFontScale, p);
    const cx = gsap.utils.interpolate(startCenter.x, endCenter.x, p);
    const cy = gsap.utils.interpolate(startCenter.y, endCenter.y, p);
    const tx = cx - (startSize.w * s) / 2;
    const ty = cy - (startSize.h * s) / 2;
    gsap.set(introStack, { x: tx, y: ty, scale: s });

    // tag: exits early (fully gone by ~45% progress) — "just scrolls up"
    const tagP = Math.min(p / 0.45, 1);
    gsap.set(introTag, {
      opacity: 1 - tagP,
      y: -60 * tagP,
    });

    // crossfade to the real nav (and reveal + start the video) in the last stretch
    const landP = gsap.utils.clamp(0, 1, (p - 0.82) / 0.18);
    gsap.set(introStack.querySelectorAll('.logo-intro__line'), { opacity: 1 - landP });
    gsap.set(nav, { opacity: landP, pointerEvents: landP > 0.5 ? 'auto' : 'none' });
    if (bgVideo) {
      gsap.set(bgVideo, { opacity: landP });
      if (landP > 0 && !videoStarted) {
        videoStarted = true;
        bgVideo.play().catch(() => {});
      }
    }
  }

  ScrollTrigger.create({
    trigger: introSection,
    start: 'top top',
    end: 'bottom top',
    scrub: 0.4,
    onUpdate: self => applyProgress(self.progress),
    onLeave: () => {
      gsap.set(introSection, { visibility: 'hidden' });
      gsap.set(nav, { opacity: 1, pointerEvents: 'auto' });
      if (bgVideo) gsap.set(bgVideo, { opacity: 1 });
    },
    onEnterBack: () => {
      gsap.set(introSection, { visibility: 'visible' });
    }
  });

  // apply the progress=0 state immediately — otherwise the intro sits
  // unstyled at its raw top:0/left:0 position until the first scroll
  // event fires onUpdate, causing a visible "jump" into place
  applyProgress(0);

  // SAFETY NET: the very first measure() above can run before the Syne
  // webfont has actually finished loading, so it may measure against
  // fallback-font metrics. Once the real font is confirmed ready, the
  // browser reflows the text to its true size — so we re-measure and
  // re-apply here too, otherwise that reflow causes a visible jump of
  // its own (which can look like "scrolling fixes it" purely by timing
  // coincidence, when really it's the font swap, not the scroll).
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      measure();
      applyProgress(0);
      ScrollTrigger.refresh();
    });
  }

});
