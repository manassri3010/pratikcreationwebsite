/* ============================================================
   PRATIK CREATION — footer-video-fade.js
   The fixed background video should only be visible through the
   "Ready to work together?" CTA section. Once the footer starts
   entering the viewport, fade the video out to solid black —
   and fade it back in if the user scrolls back up past that point.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const bgVideo = document.getElementById('bgVideo');
  const ctaWrap = document.querySelector('.cta-wrap');

  if (!bgVideo || !ctaWrap || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  ScrollTrigger.create({
    trigger: ctaWrap,
    start: 'bottom 75%',  // CTA bar's bottom edge starting to leave the lower part of the screen
    end: 'bottom 10%',    // fully faded well before the footer's content appears
    scrub: 0.3,
    onUpdate: self => {
      gsap.set(bgVideo, { opacity: 1 - self.progress });
    }
  });

});
